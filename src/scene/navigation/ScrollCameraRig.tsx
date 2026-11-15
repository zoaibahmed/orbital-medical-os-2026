import { useEffect, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { openingPose } from './scrollPath'
import { viewPresets } from './presets'

/** Sole camera owner in the opening. Existing workspace CameraRig remains intact. */
export function ScrollCameraRig({ progress, reducedMotion, paused }: { progress: RefObject<number>; reducedMotion: boolean; paused: boolean }) {
  const { invalidate } = useThree()
  const current = useRef(0)
  const initialized = useRef(false)
  useEffect(() => {
    const update = () => invalidate()
    window.addEventListener('scroll', update, { passive: true })
    invalidate()
    return () => window.removeEventListener('scroll', update)
  }, [invalidate, reducedMotion, paused])
  useFrame(({ camera, gl }, delta) => {
    if (paused && initialized.current) return
    const wanted = reducedMotion ? .48 : progress.current
    current.current = !initialized.current || reducedMotion ? wanted : current.current + (wanted - current.current) * (1 - Math.exp(-Math.min(delta, .05) * 14))
    const settling = Math.abs(wanted - current.current) > .0001
    if (!settling) current.current = wanted
    const pose = reducedMotion ? viewPresets.overview : openingPose(current.current)
    camera.position.set(...pose.position)
    camera.lookAt(...pose.target)
    gl.domElement.dataset.openingPose = JSON.stringify({ progress: current.current, position: camera.position.toArray(), target: pose.target, reducedMotion })
    initialized.current = true
    if (settling) invalidate()
  })
  return null
}
