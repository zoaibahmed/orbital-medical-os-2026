import { useEffect, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { experiencePose, travelDuration, travelPose, type DirectorCommand } from './experiencePath'
import type { CameraPreset } from './presets'

/** One owner: inspection overrides scroll; new scroll cancels inspection in the host. */
export function CameraDirector({ command }: { command: RefObject<DirectorCommand> }) {
  const { invalidate, gl } = useThree()
  const target = useRef(new Vector3())
  const goalPosition = useRef(new Vector3())
  const goalTarget = useRef(new Vector3())
  const initialized = useRef(false)
  const journey = useRef<{ key: string; from: CameraPreset; elapsed: number; duration: number } | null>(null)
  const lastPublished = useRef(0)
  const previousMotion = useRef<boolean | null>(null)
  useEffect(() => {
    const input = command.current
    input.invalidate = invalidate
    const resume = () => { if (document.visibilityState === 'visible') invalidate() }
    document.addEventListener('visibilitychange', resume)
    invalidate()
    return () => { if (input.invalidate === invalidate) input.invalidate = undefined; document.removeEventListener('visibilitychange', resume) }
  }, [command, invalidate])
  useFrame(({ camera }, delta) => {
    const input = command.current
    if ((input.paused || document.visibilityState !== 'visible') && initialized.current) return
    const progress = input.reduced ? Math.round(input.progress) : input.progress
    const pose = experiencePose(progress, input.focus, input.destination)
    goalPosition.current.set(...pose.position)
    goalTarget.current.set(...pose.target)
    if (!initialized.current || input.reduced) {
      camera.position.copy(goalPosition.current)
      target.current.copy(goalTarget.current)
      journey.current = null
    } else if (input.focus || input.destination) {
      const key = `${input.focus ?? ''}:${input.destination ?? ''}`
      if (journey.current?.key !== key) {
        const from = { position: camera.position.toArray(), target: target.current.toArray() } as CameraPreset
        journey.current = { key, from, elapsed: 0, duration: travelDuration(from, pose) }
      }
      // A dropped frame cannot jump the camera across the room. Interruptions start at its actual pose.
      const travel = journey.current
      travel.elapsed += Math.min(delta,.06)
      const next = travelPose(travel.from,pose,travel.elapsed/travel.duration)
      camera.position.set(...next.position); target.current.set(...next.target)
    } else {
      journey.current = null
      const alpha = 1 - Math.exp(-7 * Math.min(delta, .06))
      camera.position.lerp(goalPosition.current, alpha); target.current.lerp(goalTarget.current, alpha)
    }
    const moving = (journey.current !== null && journey.current.elapsed < journey.current.duration) || camera.position.distanceToSquared(goalPosition.current) + target.current.distanceToSquared(goalTarget.current) > .000001
    if (!moving) { camera.position.copy(goalPosition.current); target.current.copy(goalTarget.current) }
    camera.lookAt(target.current)
    initialized.current = true
    gl.domElement.dataset.cameraOwner = input.focus ? 'inspection' : input.destination ? 'navigation' : 'scroll'
    gl.domElement.dataset.cameraTransition = moving ? 'moving' : 'settled'
    if (moving !== previousMotion.current) { previousMotion.current=moving; input.onMotionChange?.(moving) }
    const host = gl.domElement.closest<HTMLElement>('.orbital-os')
    if (host) host.dataset.cameraMoving = String(moving)
    // Instrumentation at 10Hz; avoid JSON and DOM writes on every rendered frame.
    if (performance.now()-lastPublished.current > 100 || !moving) {
      gl.domElement.dataset.cameraPose = JSON.stringify({ progress: input.progress, focus: input.focus, destination: input.destination, position: camera.position.toArray(), target: target.current.toArray() })
      lastPublished.current = performance.now()
    }
    if (moving) invalidate()
  })
  return null
}
