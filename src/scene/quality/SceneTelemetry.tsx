import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, type Camera, type Object3D } from 'three'
import type { QualityTier } from './config'
import { summarizeFrames, type FrameSample } from './metrics'

/** Foreground active rendering, measured only after model readiness and warmup.
 * CPU submission cost is distinct from GPU completion/presentation time.
 */
export function SceneTelemetry({ quality, benchmark }: { quality: QualityTier; benchmark: boolean }) {
  const { gl } = useThree()
  const lastReport = useRef(0)
  const rendererName = useRef('Unknown renderer')
  const sample = useRef({ last: 0, frame: 0, rows: [] as FrameSample[], cpuRenderMs: 0, moved: 0, position: new Vector3(), measuringSince: 0, complete: false })
  useEffect(() => {
    sample.current = { last: 0, frame: 0, rows: [], cpuRenderMs: 0, moved: 0, position: new Vector3(), measuringSince: 0, complete: false }
    gl.domElement.dataset.quality = quality
    const context = gl.getContext()
    const debug = context.getExtension('WEBGL_debug_renderer_info')
    rendererName.current = debug ? context.getParameter(debug.UNMASKED_RENDERER_WEBGL) : context.getParameter(context.RENDERER)
    gl.domElement.dataset.benchmarkStatus = benchmark ? 'warming' : 'idle'
    if (!benchmark) return
    const original = gl.render
    function measuredRender(scene: Object3D, camera: Camera) {
      const started = performance.now()
      try { original.call(gl, scene, camera) }
      finally { sample.current.cpuRenderMs = performance.now() - started }
    }
    gl.render = measuredRender
    return () => { if (gl.render === measuredRender) gl.render = original }
  }, [gl, benchmark, quality])
  useFrame(state => {
    const now = performance.now()
    const current = sample.current
    if (benchmark && !current.complete) {
      current.frame++
      if (current.frame > 3 && current.last) {
        if (!current.measuringSince) current.measuringSince = current.last
        current.rows.push({ intervalMs: now - current.last, cpuRenderMs: current.cpuRenderMs, visible: document.visibilityState === 'visible', alwaysRendering: state.frameloop === 'always' })
        current.moved += current.position.distanceTo(state.camera.position)
        const elapsed = now - current.measuringSince
        current.complete = (elapsed >= 5000 && current.rows.length >= 12) || elapsed >= 30000 || current.rows.length >= 300
      }
      current.position.copy(state.camera.position)
      current.last = now
      gl.domElement.dataset.benchmarkStatus = current.complete ? 'complete' : current.frame <= 3 ? 'warming' : 'measuring'
    }
    if (now - lastReport.current > 500 || current.complete) {
      gl.domElement.dataset.renderStats = JSON.stringify({
        calls: gl.info.render.calls, triangles: gl.info.render.triangles,
        geometries: gl.info.memory.geometries, textures: gl.info.memory.textures,
        quality, frameloop: state.frameloop,
        renderer: rendererName.current,
        visibility: document.visibilityState,
        ...summarizeFrames(current.rows, current.moved),
        benchmarkComplete: current.complete,
      })
      lastReport.current = now
    }
    if (current.complete && state.frameloop !== 'demand') state.setFrameloop('demand')
  })
  return null
}
