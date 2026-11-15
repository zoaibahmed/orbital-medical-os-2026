import { CameraControls } from '@react-three/drei/core/CameraControls'
import { useEffect, useRef } from 'react'
import { Vector3 } from 'three'
import { viewPresets, type CameraView } from './presets'
import { useFrame, useThree } from '@react-three/fiber'

export function CameraRig({ view, reducedMotion, resetToken, benchmark = false }: { view: CameraView; reducedMotion: boolean; resetToken: number; benchmark?: boolean }) {
  const controls = useRef<CameraControls>(null)
  const { camera, gl } = useThree()
  const moving = useRef(false)
  const target = useRef(new Vector3())
  const position = useRef(new Vector3())
  const goalPosition = useRef(new Vector3())
  const goalTarget = useRef(new Vector3())
  const startPosition = useRef(new Vector3())
  const startTarget = useRef(new Vector3())
  const startedAt = useRef(0)
  const benchmarkStart = useRef(0)
  const benchmarkRestored = useRef(false)
  useEffect(() => { benchmarkStart.current = performance.now(); benchmarkRestored.current = false }, [benchmark])
  useEffect(() => {
    const controller = controls.current
    if (!controller) return
    controller.stop()
    controller.getPosition(position.current)
    controller.getTarget(target.current)
    startPosition.current.copy(position.current)
    startTarget.current.copy(target.current)
    startedAt.current = performance.now()
    goalPosition.current.set(...viewPresets[view].position)
    goalTarget.current.set(...viewPresets[view].target)
    moving.current = !reducedMotion
    gl.domElement.dataset.cameraTransition = reducedMotion ? 'settled' : 'moving'
    if (reducedMotion) {
      void controller.setLookAt(...viewPresets[view].position, ...viewPresets[view].target, false)
      controller.update(0)
      gl.domElement.dataset.cameraPose = JSON.stringify({ view, position: camera.position.toArray() })
    }
    return () => { moving.current = false; controller.stop() }
  }, [view, reducedMotion, resetToken, camera, gl, benchmark])
  // Interpolate Cartesian positions/targets through a verified clear convex aisle,
  // rather than camera-controls' spherical orbit path through the medical station.
  useFrame(state => {
    if (benchmark && !reducedMotion && controls.current) {
      if (gl.domElement.dataset.benchmarkStatus === 'complete') {
        if (!benchmarkRestored.current) {
          void controls.current.setLookAt(...viewPresets[view].position, ...viewPresets[view].target, false)
          controls.current.update(0)
          gl.domElement.dataset.cameraTransition = 'settled'
          gl.domElement.dataset.cameraPose = JSON.stringify({ view, position: camera.position.toArray() })
          benchmarkRestored.current = true
        }
        return
      }
      const cycle = ((performance.now() - benchmarkStart.current) % 6000) / 2000
      const segment = Math.floor(cycle)
      const fraction = cycle - segment
      const eased = fraction * fraction * (3 - 2 * fraction)
      const route = [viewPresets.overview, viewPresets.examination, viewPresets.equipment, viewPresets.overview]
      const from = route[segment]!
      const to = route[segment + 1]!
      startPosition.current.set(...from.position)
      goalPosition.current.set(...to.position)
      startTarget.current.set(...from.target)
      goalTarget.current.set(...to.target)
      position.current.lerpVectors(startPosition.current, goalPosition.current, eased)
      target.current.lerpVectors(startTarget.current, goalTarget.current, eased)
      const p = position.current
      const t = target.current
      void controls.current.setLookAt(p.x, p.y, p.z, t.x, t.y, t.z, false)
      controls.current.update(0)
      return
    }
    if (!moving.current || !controls.current) return
    const progress = Math.min((performance.now() - startedAt.current) / 1100, 1)
    const alpha = progress * progress * (3 - 2 * progress)
    position.current.lerpVectors(startPosition.current, goalPosition.current, alpha)
    target.current.lerpVectors(startTarget.current, goalTarget.current, alpha)
    const p = position.current
    const t = target.current
    void controls.current.setLookAt(p.x, p.y, p.z, t.x, t.y, t.z, false)
    if (progress === 1) {
      moving.current = false
      controls.current.update(0)
      state.gl.domElement.dataset.cameraTransition = 'settled'
      state.gl.domElement.dataset.cameraPose = JSON.stringify({ view, position: state.camera.position.toArray() })
    }
    else state.invalidate()
  })
  return <CameraControls ref={controls} makeDefault enabled={false} />
}
