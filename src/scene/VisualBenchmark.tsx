import { configureProductionRenderer } from './quality/rendererSetup'
import { lazy, Suspense, use, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ACESFilmicToneMapping, Mesh, PCFSoftShadowMap, Vector3 } from 'three'
import { loadModel } from './assets/loadModel'
import type { ModelAsset } from './assets/registry'
import manifest from './assets/benchmark-manifest.json'
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { qualitySettings, initialGraphicsQuality, type QualityTier } from './quality/config'
import { LightingRig } from './environment/LightingRig'
import { ContactGrounding } from './environment/ContactGrounding'
import { RuntimeProbe } from './quality/RuntimeProbe'
import { ErrorBoundary } from '../ui/ErrorBoundary'
import { detectWebGL } from './detectWebGL'
import { useMediaQuery } from '../animation/useMediaQuery'
import './benchmark.css'
import { StaticShadows } from './environment/StaticShadows'

const cache = new Map<QualityTier, Promise<GLTF[]>>()
function resources(tier: QualityTier) {
  if (!cache.has(tier)) cache.set(tier, Promise.all(manifest.filter(a => a.tier === tier).map(a => loadModel({ ...a, version: a.sha256.slice(0,12), station: 'overview', tier, compression: 'draco', animations: [], license: { source: 'scripts/build_reference_bay.py', author: 'Orbital project', name: 'Original project art', attribution: a.license } } satisfies ModelAsset))))
  return cache.get(tier)!
}
function Models({ quality, loaded }: { quality: QualityTier; loaded: () => void }) {
  const models = use(resources(quality))
  const { gl, scene, camera, invalidate } = useThree()
  const copies = useMemo(() => models.map(m => {
    const s = m.scene.clone(true)
    s.traverse(o => { if (o instanceof Mesh) { o.castShadow = !o.name.replaceAll('_',' ').includes('NASA Earth') && !o.name.replaceAll('_',' ').includes('Thin optical glazing'); o.receiveShadow = !o.name.replaceAll('_',' ').includes('NASA Earth') } })
    return s
  }), [models])
  const [failure,setFailure] = useState<Error | null>(null)
  useEffect(() => { gl.domElement.dataset.quality = quality; let active = true; void gl.compileAsync(scene,camera).then(() => { if (active) { gl.shadowMap.needsUpdate = true; loaded(); invalidate() } }).catch(error => { if (active) setFailure(error instanceof Error ? error : new Error('GPU preparation failed')) }); return () => { active = false } }, [gl,scene,camera,invalidate,loaded,copies,quality])
  if (failure) throw failure
  return <group>{copies.map((s,i) => <primitive key={i} object={s} dispose={null} />)}</group>
}
const detail = new URLSearchParams(location.search).get('detail')
const overview = detail === 'equipment' ? { p: new Vector3(3.18,1.91,-.10), t: new Vector3(2.15,1.50,-2.25) } : detail === 'architecture' ? { p: new Vector3(-.45,2.05,2.05), t: new Vector3(-3.10,2,-.85) } : detail === 'beauty' ? { p: new Vector3(2.65,1.65,3.3), t: new Vector3(-.4,1.22,-.7) } : { p: new Vector3(3.1,2.45,4.15), t: new Vector3(-.3,1.38,-1) }
const close = { p: new Vector3(1.5,1.92,1.95), t: new Vector3(-.4,1.25,-.72) }
function DemonstrationCamera({ progress, reduced }: { progress: number; reduced: boolean }) {
  const { camera, invalidate, gl } = useThree()
  const motion = useRef({ start: 0, fromP: overview.p.clone(), fromT: overview.t.clone(), toP: overview.p.clone(), toT: overview.t.clone(), target: overview.t.clone(), moving: false })
  useEffect(() => {
    const m = motion.current
    m.fromP.copy(camera.position); m.fromT.copy(m.target)
    m.toP.lerpVectors(overview.p,close.p,progress); m.toT.lerpVectors(overview.t,close.t,progress)
    m.start = performance.now(); m.moving = true; invalidate()
  }, [progress,camera,invalidate])
  useFrame(() => {
    const m = motion.current
    if (!m.moving) return
    const t = reduced ? 1 : Math.min(1,(performance.now()-m.start)/2200)
    const ease = t*t*t*(t*(t*6-15)+10)
    camera.position.lerpVectors(m.fromP,m.toP,ease); m.target.lerpVectors(m.fromT,m.toT,ease); camera.lookAt(m.target)
    gl.domElement.dataset.cameraTransition = t < 1 ? 'moving' : 'settled'
    gl.domElement.dataset.cameraPose = JSON.stringify({ position: camera.position.toArray(), target: m.target.toArray() })
    if (t < 1) invalidate(); else m.moving = false
  })
  return null
}
function ContextLifecycle({ lost }: { lost: () => void }) {
  const canvas = useThree(s=>s.gl.domElement)
  useEffect(()=>{const handler=(event:Event)=>{event.preventDefault();lost()};canvas.addEventListener('webglcontextlost',handler);return()=>canvas.removeEventListener('webglcontextlost',handler)},[canvas,lost])
  return null
}
function StudioCanvas({ quality, progress, reduced, loaded, lost }: { quality: QualityTier; progress: number; reduced: boolean; loaded: () => void; lost: () => void }) {
  const q = qualitySettings[quality]
  return <Canvas onCreated={({gl})=>configureProductionRenderer(gl)} camera={{ position: overview.p.toArray(), fov: 48, near: .08, far: 30 }} dpr={q.dpr} shadows={q.shadows ? { type: PCFSoftShadowMap } : false} frameloop="demand" gl={{ antialias: q.antialias, toneMapping: ACESFilmicToneMapping, toneMappingExposure: .95, powerPreference: 'high-performance' }}>
    <color attach="background" args={['#161e20']} /><LightingRig quality={quality} study /><RuntimeProbe /><StaticShadows /><ContextLifecycle lost={lost} />
    <DemonstrationCamera progress={progress} reduced={reduced} />
    <Suspense fallback={null}><Models quality={quality} loaded={loaded} /><ContactGrounding /></Suspense>
  </Canvas>
}
// The benchmark route is lazy-loaded independently from the operational DOM host.
const LazyStudio = lazy(() => Promise.resolve({ default: StudioCanvas }))
export default function VisualBenchmark() {
  const quality = initialGraphicsQuality(new URLSearchParams(location.search))
  const [progress,setProgress] = useState(0)
  const [ready,setReady] = useState(false)
  const [lost,setLost] = useState(false)
  const [attempt,setAttempt] = useState(0)
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const loaded = useCallback(() => setReady(true),[])
  const contextLost = useCallback(() => { setLost(true); setReady(false) },[])
  const supported = detectWebGL()
  return <main className="benchmark" id="main-content">
    <div className="benchmark-scene"><ErrorBoundary key={attempt} fallback={<div className="benchmark-fallback">Environment could not load. <button onClick={() => { cache.delete(quality); setAttempt(a=>a+1) }}>Retry environment</button></div>}>
      {supported && !lost ? <Suspense fallback={null}><LazyStudio quality={quality} progress={progress} reduced={reduced} loaded={loaded} lost={contextLost} /></Suspense> : <div className="benchmark-fallback">Spatial view unavailable. <a href="/bay/vitals">Open accessible medical view</a>{lost && <button onClick={() => { setLost(false); setAttempt(a=>a+1) }}>Restart renderer</button>}</div>}
    </ErrorBoundary></div>
    <header className="benchmark-title"><span className="benchmark-mark" aria-hidden="true">✳</span><div>Orbital / Aesculus<small>Examination habitat · Environment study</small></div></header>
    <aside className="benchmark-caption" data-close={progress>.5}><h1>A place for care.<br/>Built for orbit.</h1><p>Pressure architecture, articulated patient support<br/>and a rail-mounted diagnostic gantry.</p></aside>
    <footer className="benchmark-console"><div className="benchmark-status" role="status" data-testid="benchmark-status" data-state={ready ? 'ready' : 'loading'}>{lost ? 'Renderer interrupted' : ready ? 'Environment ready' : 'Preparing environment…'}</div>
      <div className="benchmark-transport"><button aria-pressed={progress===0} onClick={()=>setProgress(0)}>Overview</button><label>Examination focus<input aria-label="Camera journey" type="range" min="0" max="1" step=".01" value={progress} onChange={e=>setProgress(Number(e.target.value))}/></label><button aria-pressed={progress===1} onClick={()=>setProgress(1)}>Examine</button></div>
      <a href="/bay/vitals">Medical access</a>
    </footer>
  </main>
}
