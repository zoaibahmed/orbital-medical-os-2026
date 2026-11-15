import { configureProductionRenderer } from './quality/rendererSetup'
import { StaticShadows } from './environment/StaticShadows'
import { FrameBudget } from './quality/FrameBudget'
import { isBandwidthLimitedAdapter } from './detectWebGL'
import { ExaminationScan } from './environment/ExaminationScan'
import { ExaminationPatient } from './environment/ExaminationPatient'
import { LiveMedicalDisplay } from './environment/LiveMedicalDisplay'
import type { MonitoringFeed } from '../features/vitals/monitoring'
import type { AstronautProfile } from '../domain/contracts'
import { lazy, Suspense, useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { usePatientAssetStatus } from './assets/patient'
const ScrollCameraRig=lazy(()=>import('./navigation/ScrollCameraRig').then(m=>({default:m.ScrollCameraRig})))
import { RuntimeProbe } from './quality/RuntimeProbe'
import { CameraDirector } from './navigation/CameraDirector'
import type { DirectorCommand } from './navigation/experiencePath'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
const CameraRig=lazy(()=>import('./navigation/CameraRig').then(m=>({default:m.CameraRig})))
import { MedicalBayEnvironment } from './environment/MedicalBayEnvironment'
import { LightingRig } from './environment/LightingRig'
import { ContactGrounding } from './environment/ContactGrounding'
import { SceneTelemetry } from './quality/SceneTelemetry'
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace, Vector2 } from 'three'
import { viewPresets, type CameraView } from './navigation/presets'
import { qualitySettings, type QualityTier } from './quality/config'

interface Props {
  view: CameraView
  onSelect: (view: CameraView) => void
  onLoaded: () => void
  benchmark: boolean
  standbyRun: number
  reducedMotion: boolean
  quality: QualityTier
  resetToken: number
  onReady: () => void
  onContextLost: () => void
  scrollProgress?: RefObject<number>
  scrollPaused?: boolean
  director?: RefObject<DirectorCommand>
  warmup?: boolean
  renderReady?: boolean
  monitoring?: { feed: MonitoringFeed; astronaut: AstronautProfile }
  onPrepared?: () => void
}

/** Readiness follows a complete native-resolution render, including the initial
 * camera and opaque patient, rather than the small shader warmup viewport. */
function FirstReadyFrame({active,patient,onLoaded}:{active:boolean;patient:boolean;onLoaded:()=>void}){
 const {gl,invalidate}=useThree(),scheduled=useRef<number|null>(null),complete=useRef(false),fence=useRef<WebGLSync|null>(null),dimensions=useRef(new Vector2())
 useEffect(()=>{if(!active)return;const frame=requestAnimationFrame(()=>invalidate());return()=>cancelAnimationFrame(frame)},[active,invalidate])
 useEffect(()=>()=>{if(scheduled.current!==null)cancelAnimationFrame(scheduled.current);if(fence.current)(gl.getContext() as WebGL2RenderingContext).deleteSync(fence.current)},[gl])
 useFrame(()=>{
  if(!active||complete.current||scheduled.current!==null)return
  const canvas=gl.domElement
  const subjectReady=!patient||(canvas.dataset.examinationState==='EMPTY_BED'?canvas.dataset.patientVisible==='false':canvas.dataset.patientVisible==='true'&&canvas.dataset.patientOpacity==='1.0000')
  if(!subjectReady||!canvas.dataset.cameraPose||!canvas.dataset.presentedFrames)return
  const size=gl.getSize(dimensions.current),ratio=gl.getPixelRatio()
  // CSS client dimensions round to the nearest pixel; WebGL buffers floor.
  // A legitimate subpixel layout/zoom must not hold readiness until a resize.
  if(size.x<=0||size.y<=0||Math.abs(size.x-canvas.clientWidth)>1||Math.abs(size.y-canvas.clientHeight)>1||canvas.width!==Math.floor(size.x*ratio)||canvas.height!==Math.floor(size.y*ratio)){invalidate();return}
  const context=gl.getContext() as WebGL2RenderingContext
  fence.current=context.fenceSync(context.SYNC_GPU_COMMANDS_COMPLETE,0);context.flush()
  const presented=()=>{
   if(context.isContextLost())return
   if(fence.current&&context.clientWaitSync(fence.current,0,0)===context.TIMEOUT_EXPIRED){scheduled.current=requestAnimationFrame(presented);return}
   if(fence.current){context.deleteSync(fence.current);fence.current=null}
   complete.current=true;onLoaded()
  }
  scheduled.current=requestAnimationFrame(presented)
 },2)
 return null
}

function CanvasLifecycle({ onReady, onContextLost }: Pick<Props, 'onReady' | 'onContextLost'>) {
  const canvas = useThree(state => state.gl.domElement)
  useEffect(() => {
    const handleLost = (event: Event) => { event.preventDefault(); onContextLost() }
    canvas.addEventListener('webglcontextlost', handleLost)
    onReady()
    return () => canvas.removeEventListener('webglcontextlost', handleLost)
  }, [canvas, onReady, onContextLost])
  return null
}

export default function MedicalBayCanvas({ view, onSelect, onLoaded, benchmark, standbyRun, reducedMotion, quality, resetToken, onReady, onContextLost, scrollProgress, scrollPaused = false, director, warmup = false, renderReady = true, monitoring, onPrepared }: Props) {
  const settings = qualitySettings[quality]
  const limited = isBandwidthLimitedAdapter()
  const patient=usePatientAssetStatus(),[prepared,setPrepared]=useState(false)
  const environmentPrepared=useCallback(()=>{if(warmup){setPrepared(true);onPrepared?.()}else onLoaded()},[warmup,onLoaded,onPrepared])
  const prepareReady=!monitoring||patient.status==='ready'||patient.status==='failed'
  return <Canvas style={{visibility:warmup&&!renderReady?'hidden':'visible'}} onCreated={({gl,raycaster})=>{configureProductionRenderer(gl);raycaster.layers.enable(1)}} camera={{ position: viewPresets.overview.position, fov: 55, near: 0.08, far: 35 }} dpr={limited?1:settings.dpr} shadows={settings.shadows ? { type: PCFSoftShadowMap } : false} gl={{ antialias: settings.antialias && !limited, toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.05, outputColorSpace: SRGBColorSpace, powerPreference: 'high-performance' }} frameloop={warmup && !prepared && !renderReady ? 'never' : benchmark ? 'always' : 'demand'} fallback={<p>3D renderer unavailable. Station panels remain accessible.</p>}>
    <color attach="background" args={['#18212a']} />
    <LightingRig quality={quality} study />
    <RuntimeProbe /><StaticShadows />
    <CanvasLifecycle onReady={onReady} onContextLost={onContextLost} />
    <Suspense fallback={null}>{director ? <CameraDirector command={director} /> : scrollProgress ? <ScrollCameraRig progress={scrollProgress} reducedMotion={reducedMotion} paused={scrollPaused} /> : <CameraRig view={view} reducedMotion={reducedMotion} resetToken={resetToken} benchmark={benchmark} />}</Suspense>
    <Suspense fallback={null}><MedicalBayEnvironment quality={quality} view={view} onSelect={onSelect} onLoaded={environmentPrepared} reducedMotion={reducedMotion} standbyRun={standbyRun} warmup={warmup} prepareReady={prepareReady} liveDisplay={!!monitoring} crewId={monitoring?.astronaut.id}/><ContactGrounding /></Suspense>
    {monitoring && <LiveMedicalDisplay feed={monitoring.feed} astronaut={monitoring.astronaut} reducedMotion={reducedMotion}/>}
    {monitoring && <ExaminationScan crewId={monitoring.astronaut.id} reduced={reducedMotion}/>}
    {monitoring && <ExaminationPatient crewId={monitoring.astronaut.id} reduced={reducedMotion}/>}
    <FirstReadyFrame active={warmup&&prepared} patient={!!monitoring} onLoaded={onLoaded}/><SceneTelemetry quality={quality} benchmark={benchmark} /><FrameBudget limited={limited} />
  </Canvas>
}
