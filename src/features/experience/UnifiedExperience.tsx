import { useClinical } from '../../state/clinical'
import { AutomaticMonitoringAudio } from '../vitals/AutomaticMonitoringAudio'
import { lazy, Suspense, useCallback, useMemo, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { crew, getFixtureSnapshot } from '../../data/fixtures'
import { stations, type StationId } from '../../app/navigation'
import { useSession } from '../../state/session'
import { useMediaQuery } from '../../animation/useMediaQuery'
import { ErrorBoundary } from '../../ui/ErrorBoundary'
import { useDialogDismiss } from '../../ui/useDialogDismiss'
import { detectWebGL } from '../../scene/detectWebGL'
import { getEnvironmentResource, retryEnvironmentResource } from '../../scene/assets/loadModel'
import { getPatientResource, retryPatientAsset, usePatientAssetStatus } from '../../scene/assets/patient'
import { initialGraphicsQuality, type QualityTier } from '../../scene/quality/config'
import type { CameraView } from '../../scene/navigation/presets'
import type { DirectorCommand, EquipmentFocus } from '../../scene/navigation/experiencePath'
import { OperationsNavigation } from './OperationsNavigation'
import { BiometricDetails, BiometricMonitor } from './BiometricMonitor'
import { useMonitoringFeed } from '../vitals/useMonitoringFeed'
import { ModulePreview } from './ModulePreview'
import { chapterNames, resolveExperience, resolveFocus } from './experienceRoutes'
import { useCrewApi } from '../../services/api/context'
import { ConnectionStatus } from '../../services/api/ConnectionStatus'

const MedicalBayCanvas = lazy(() => import('../../scene/MedicalBayCanvas'))
type Sheet = 'crew' | 'details' | 'modules' | 'preview' | null
const previewStations = new Set(['radiation', 'physical', 'wellbeing', 'diagnostics'])

export function UnifiedExperience() {
  const location = useLocation(), navigate = useNavigate()
  const [search, setSearch] = useSearchParams()
  const route = resolveExperience(location.pathname)
  const crewId = search.get('crew') ?? 'crew-01'
  const astronaut = crew.find(person => person.id === crewId) ?? crew[0]!
  const baseSnapshot = getFixtureSnapshot(astronaut.id)!
  const clinical=useClinical(astronaut.id)
  const snapshot=useMemo(()=>({...baseSnapshot,sleep:clinical.sleepRecords.at(-1)??baseSnapshot.sleep}),[baseSnapshot,clinical.sleepRecords])
  const invalid = !route.valid || !crew.some(person => person.id === crewId)
  const { emergencyOpen, setEmergencyOpen, motionReduced, setMotionReduced } = useSession()
  const systemReduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const reduced = motionReduced || systemReduced
  const [audioAllowed,setAudioAllowed]=useState(()=>{try{return localStorage.getItem('orbital-monitoring-sound')!=='muted'}catch{return true}})
  const saveAudioPreference=(allowed:boolean)=>{setAudioAllowed(allowed);try{localStorage.setItem('orbital-monitoring-sound',allowed?'allowed':'muted')}catch{/* Preference remains effective for this session. */}}
  const [enabled, setEnabled] = useState(() => innerWidth >= 768)
  const [supported, setSupported] = useState(detectWebGL)
  const [quality] = useState<QualityTier>(() => initialGraphicsQuality(search))
  const [ready, setReady] = useState(false)
  const [assetsLoaded,setAssetsLoaded]=useState(false),[gpuPrepared,setGpuPrepared]=useState(false)
  const patientAsset=usePatientAssetStatus(),patientFailed=patientAsset.status==='failed'
  const preparationSteps=Number(assetsLoaded)+Number(patientAsset.status==='ready')+Number(gpuPrepared)+Number(ready)
  const [failed, setFailed] = useState(false)
  const [lost, setLost] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [chapter, setChapter] = useState(route.chapter)
  const [cameraMoving, setCameraMoving] = useState(false)
  const [focus, setFocus] = useState<EquipmentFocus | null>(() => resolveFocus(search))
  const [sheet, setSheet] = useState<Sheet>(() => previewStations.has(route.station) ? 'preview' : route.list && route.station === 'vitals' ? 'details' : null)
  const sheetAllowed = sheet !== null && (!invalid || sheet === 'crew')
  const [standbyRun, setStandbyRun] = useState(0)
  const root = useRef<HTMLElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const dismissContext = useDialogDismiss(dialog, () => setSheet(null), reduced, location.pathname)
  const skipRouteScroll = useRef(false)
  const activeChapter = useRef(route.chapter)
  const input = useRef<DirectorCommand>({ progress: route.chapter, focus: resolveFocus(search), destination: route.chapter === 0 ? 'arrival' : route.station, paused: false, reduced, onMotionChange: setCameraMoving })
  const monitoringActive = (chapter === 2 || focus === 'equipment') && !emergencyOpen && !invalid && !previewStations.has(route.station) && (!enabled || !supported || failed || lost || (ready && !cameraMoving))
  const connection=useCrewApi()
  const monitoring = useMonitoringFeed(snapshot, monitoringActive, connection)
  const routeRef = useRef({ path: location.pathname, search: location.search, crewId: astronaut.id })
  const path = location.pathname
  const viewQuery = search.get('view'), focusQuery = search.get('focus')
  const openDetails = useCallback(() => setSheet('details'), [])
  const onReady = useCallback(() => {}, [])
  const onLoaded = useCallback(() => { setReady(true); setFailed(false) }, [])
  const onPrepared=useCallback(()=>setGpuPrepared(true),[])
  const onError = useCallback(() => { setFailed(true); setReady(false) }, [])
  const onLost = useCallback(() => { setLost(true); setReady(false) }, [])
  useEffect(() => { routeRef.current = { path, search: location.search, crewId: astronaut.id } }, [path, location.search, astronaut.id])
  useEffect(() => { if (route.station === 'emergency' && !invalid) setEmergencyOpen(true) }, [route.station, invalid, setEmergencyOpen])
  useEffect(() => {
    let cancelled=false
    if (enabled && supported) {
      void getEnvironmentResource(quality).then(()=>{if(!cancelled)setAssetsLoaded(true)}).catch(() => {})
      void getPatientResource().catch(()=>{})
    }
    return()=>{cancelled=true}
  }, [enabled, supported, quality])
  useEffect(() => {
    input.current.reduced = reduced
    // Context panels never steal camera ownership or freeze an in-flight navigation.
    input.current.paused = false
    input.current.invalidate?.()
  }, [reduced])
  useEffect(() => {
    if (!emergencyOpen) return
    const controller = input.current
    const previous = { destination: controller.destination, focus: controller.focus }
    controller.destination = 'emergency'; controller.focus = null; controller.invalidate?.()
    return () => { Object.assign(controller, previous); controller.invalidate?.() }
  }, [emergencyOpen])
  useEffect(() => {
    if (skipRouteScroll.current) { skipRouteScroll.current = false; return }
    const next = resolveExperience(path)
    const params = new URLSearchParams(routeRef.current.search)
    const nextFocus = resolveFocus(params)
    input.current.focus = nextFocus
    input.current.destination = next.chapter === 0 ? 'arrival' : next.station
    const frame = requestAnimationFrame(() => {
      activeChapter.current = next.chapter
      setChapter(next.chapter)
      setFocus(nextFocus)
      if (previewStations.has(next.station)) setSheet('preview')
      else if (next.list && next.station === 'vitals') setSheet('details')
      else setSheet(null)
      window.scrollTo({ top: next.chapter * innerHeight, behavior: 'instant' })
      input.current.progress = next.chapter
      input.current.invalidate?.()
    })
    return () => cancelAnimationFrame(frame)
  }, [path, viewQuery, focusQuery])
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const element = root.current
      if (!element || element.offsetHeight <= innerHeight) return
      const progress = Math.max(0, Math.min(2, -element.getBoundingClientRect().top / Math.max(1, element.offsetHeight - innerHeight) * 2))
      if (Math.abs(input.current.progress - progress) < .00001) return
      input.current.progress = progress
      input.current.destination = null
      if (input.current.focus) {
        input.current.focus = null
        setFocus(null)
        const params = new URLSearchParams(routeRef.current.search)
        params.delete('view'); params.delete('focus')
        if (params.toString() !== routeRef.current.search.replace(/^\?/, '')) {
          skipRouteScroll.current = true
          navigate(`${routeRef.current.path}?${params}`, { replace: true })
        }
      }
      const next = Math.round(progress)
      element.style.setProperty('--journey-progress', `${progress / 2 * 100}%`)
      element.dataset.progress = progress.toFixed(4)
      if (next !== activeChapter.current) {
        activeChapter.current = next
        setChapter(next)
        // A native-scroll chapter owns its route too; stale provisional-module state
        // must not suppress the monitor after the user scrolls away from that station.
        const nextPath = next === 0 ? '/' : next === 1 ? '/bay/overview' : '/bay/vitals'
        if (routeRef.current.path !== nextPath) {
          const params = new URLSearchParams(routeRef.current.search)
          params.delete('view'); params.delete('focus')
          skipRouteScroll.current = true
          navigate(`${nextPath}?${params}`, { replace: true })
        }
      }
      input.current.invalidate?.()
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    frame = requestAnimationFrame(update)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [navigate])
  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (sheetAllowed && !element.open) element.showModal()
    if (!sheetAllowed && element.open) element.close()
  }, [sheetAllowed])
  useEffect(() => {
    if (!sheetAllowed && !emergencyOpen) return
    const before = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => { document.documentElement.style.overflow = before }
  }, [sheetAllowed, emergencyOpen])
  function goChapter(next: number) {
    activeChapter.current = next
    setChapter(next)
    setSheet(null); setFocus(null)
    input.current.focus = null
    input.current.destination = next === 0 ? 'arrival' : next === 1 ? 'overview' : 'vitals'
    skipRouteScroll.current = false
    const params = new URLSearchParams(search)
    params.delete('view'); params.delete('focus'); params.delete('panel')
    const nextPath = next === 0 ? '/' : next === 1 ? '/bay/overview' : '/bay/vitals'
    navigate(`${nextPath}?${params}`)
    window.scrollTo({ top: next * innerHeight, behavior: 'instant' })
    input.current.progress = next
    input.current.invalidate?.()
  }
  const inspect = useCallback((next: EquipmentFocus) => {
    input.current.focus = next
    input.current.invalidate?.()
    setFocus(next)
  }, [])
  const selectModel = useCallback((view: CameraView) => { inspect(view === 'equipment' ? 'equipment' : 'cradle') }, [inspect])
  function leaveInspection() { input.current.focus = null; input.current.destination = chapter === 0 ? 'arrival' : chapter === 1 ? 'overview' : 'vitals'; setFocus(null); input.current.invalidate?.() }
  function retry() {
    retryEnvironmentResource(quality)
    setFailed(false); setLost(false); setReady(false);setGpuPrepared(false); setCameraMoving(false); setSupported(detectWebGL()); setAttempt(value => value + 1)
  }
  function openModule(station: StationId) {
    skipRouteScroll.current = false
    if (station === 'emergency') { setSheet(null); setEmergencyOpen(true); return }
    if (station === 'overview' || station === 'vitals') { goChapter(station === 'overview' ? 1 : 2); return }
    navigate(`/bay/${station}?crew=${astronaut.id}`)
    setSheet('preview')
  }
  const recovery = <div className="scene-recovery-note" role="status"><strong>Spatial view unavailable</strong><span>{lost ? 'The graphics connection was interrupted.' : 'Medical data and mission controls remain available.'}</span>{supported && <button onClick={retry}>Retry 3D view</button>}</div>
  const selectionLabel = focus === 'scanner' ? 'Diagnostic scanner' : focus === 'equipment' ? 'Diagnostic trolley' : 'Examination cradle'
  return <div className="orbital-os"><AutomaticMonitoringAudio feed={monitoring} active={monitoringActive} allowed={audioAllowed}/>
    <div className="os-scene" aria-label="Persistent medical bay environment" data-testid="persistent-scene">
      {enabled && supported && <ErrorBoundary key={attempt} onError={onError} fallback={recovery}><Suspense fallback={null}><MedicalBayCanvas view={focus === 'equipment' ? 'equipment' : chapter === 2 || focus ? 'examination' : 'overview'} onSelect={selectModel} onReady={onReady} onLoaded={onLoaded} onPrepared={onPrepared} onContextLost={onLost} quality={quality} reducedMotion={reduced} benchmark={false} standbyRun={standbyRun} resetToken={attempt} director={input} warmup renderReady={ready} monitoring={{ feed: monitoring, astronaut }} /></Suspense></ErrorBoundary>}
      {(!ready || lost) && <div className="os-loading-space"><svg viewBox="0 0 400 400" fill="none" aria-hidden="true"><path d="M60 300V160a140 140 0 0 1 280 0v140M75 300V160a125 125 0 0 1 250 0v140M90 302h220l-25-42H115l-25 42Zm35 6v40m150-40v40M145 217h110v40H145zM175 175h50v36h-50z"/><circle cx="200" cy="140" r="7"/></svg><span>{patientFailed ? 'Patient unavailable / medical controls remain available' : enabled && supported && !failed && !lost ? !assetsLoaded?'Loading medical bay assets':patientAsset.status!=='ready'?'Preparing patient and materials':!gpuPrepared?'Preparing lighting and shaders':'Presenting medical bay'  : 'Medical workspace / Spatial alternative'}</span>{enabled&&supported&&!failed&&!lost&&(patientFailed?<button style={{pointerEvents:'auto'}} onClick={retryPatientAsset}>Retry patient asset</button>:<progress aria-label="Medical bay preparation" max={4} value={preparationSteps}/>)}</div>}
    </div>
    <OperationsNavigation astronaut={astronaut} chapter={chapter} station={focus ? selectionLabel : previewStations.has(route.station) ? `${stations.find(s => s.id === route.station)?.short} / Spatial context` : chapterNames[chapter]!} onChapter={goChapter} onCrew={() => setSheet('crew')} onModules={() => setSheet('modules')} onEmergency={() => setEmergencyOpen(true)} />
    <main ref={root} id="main-content" tabIndex={-1} className="experience-length" aria-label="Orbital Medical OS">
      <div className="chapter-stage" data-testid="chapter-stage" data-chapter={chapter}>
        {invalid ? <section className="chapter-copy"><h1>Station or crew unavailable</h1><p>This address does not match the registered mission context.</p><button className="os-primary" onClick={() => { navigate('/'); window.scrollTo(0,0) }}>Return to mission</button></section> : focus ? <section className="inspection-copy"><span className="system-label">Equipment inspection / Camera focused</span><h1>{selectionLabel}</h1><p>{focus === 'scanner' ? 'Segmented sensor assembly, patient clearance and scanner indicator.' : focus === 'cradle' ? 'Articulated supports, restraint rails and examination surface.' : 'Diagnostic display, probe dock and equipment connections.'}</p><div className="inspection-status"><span>Equipment state</span><strong>Standby / simulated</strong></div><button className="os-text-action" onClick={()=>openModule('physical')}>Open examination controls</button><button className="os-primary" onClick={leaveInspection}>Return to chapter</button>{focus !== 'equipment' && <button className="os-text-action" disabled={!ready} onClick={() => setStandbyRun(value => value + 1)}>Check standby indicator</button>}<p className="source-note">{standbyRun ? 'Indicator check requested. Visual simulation only.' : 'Scroll to resume the chapter camera.'}</p></section> : chapter === 0 ? <section className="chapter-copy arrival-copy"><span className="system-label">Aesculus / Orbital health mission</span><h1>Care in orbit.</h1><p>Aesculus keeps the crew at the centre of every decision. Step inside your orbital medical workspace.</p><button className="os-primary" onClick={() => goChapter(1)}>Enter the medical bay <span aria-hidden="true">↗</span></button><button className="os-text-action" onClick={() => goChapter(2)}>Go directly to crew biometrics</button><div className="arrival-context"><span>Current crew</span><strong>{astronaut.displayName}</strong><small>{astronaut.role} / {astronaut.callSign}</small></div></section> : chapter === 1 ? <section className="chapter-copy exploration-copy"><span className="system-label">Examination deck / Equipment access</span><h1>Inside the medical bay.</h1><p>Examine the patient platform and diagnostic instruments. Select equipment to bring its working detail into focus.</p><div className="equipment-commands"><button onClick={() => inspect('cradle')}><span>Examination cradle</span><small>Supports & patient interface</small><b aria-hidden="true">↗</b></button><button onClick={() => inspect('scanner')}><span>Diagnostic scanner</span><small>Sensor assembly & standby light</small><b aria-hidden="true">↗</b></button><button onClick={() => inspect('equipment')}><span>Diagnostic trolley</span><small>Display & instrument dock</small><b aria-hidden="true">↗</b></button></div><button className="os-text-action" onClick={() => goChapter(2)}>Review crew biometrics <span aria-hidden="true">↗</span></button></section> : null}<div className="biometric-layer" hidden={invalid || !!focus || chapter !== 2}><BiometricMonitor key={astronaut.id} snapshot={snapshot} astronaut={astronaut} onDetails={openDetails} feed={monitoring} connection={connection} active={monitoringActive} reducedMotion={reduced} /></div>
      </div>
    </main>
    <footer className="os-status-seam"><div><span className="journey-label">0{chapter + 1} / {chapterNames[chapter]}</span><i className="journey-track"><b style={{ width: `${chapter / 2 * 100}%` }} /></i></div><div className="spatial-status"><span role="status" data-testid="environment-status" data-state={ready && !lost ? 'ready' : failed || !supported || lost || patientFailed ? 'fallback' : !enabled ? 'disabled' : 'loading'}>{ready && !lost ? 'Environment ready' : failed || !supported || lost || patientFailed ? 'Spatial view unavailable' : enabled ? 'Preparing environment' : '3D is optional'}</span>{!enabled && supported && <button onClick={() => setEnabled(true)}>Enable 3D view</button>}{(failed || lost) && <button onClick={retry}>Retry 3D view</button>}<span>{quality === 'low' ? 'Development diagnostic mode' : 'High fidelity'}</span></div><p>Simulation / fictional data / no medical decisions</p></footer>
    <dialog ref={dialog} className="os-dialog inspection-interface" aria-labelledby="os-dialog-title" onCancel={event => { event.preventDefault(); dismissContext() }}><div className="os-dialog-heading"><span className="system-label">Aesculus / Operations</span><button className="emergency-access" onClick={()=>{setSheet(null);setEmergencyOpen(true)}}>Emergency access</button><button aria-label="Close mission view" onClick={dismissContext}>×</button></div><h2 id="os-dialog-title">{sheet === 'crew' ? 'Crew & display' : sheet === 'details' ? 'Biometric measurements' : sheet === 'preview' ? stations.find(s => s.id === route.station)?.label : 'Medical stations'}</h2>
      {sheet === 'crew' && <><ConnectionStatus connection={connection}/><label className="os-field">Astronaut<select value={astronaut.id} onChange={event => setSearch(previous => { const next = new URLSearchParams(previous); next.set('crew', event.target.value); return next }, { replace: true })}>{crew.map(person => <option key={person.id} value={person.id}>{person.displayName} / {person.callSign}</option>)}</select></label><label className="os-motion"><input type="checkbox" checked={audioAllowed} onChange={e=>saveAudioPreference(e.target.checked)}/> Allow monitoring sound after interaction</label><label className="os-motion"><input type="checkbox" checked={motionReduced} onChange={event => setMotionReduced(event.target.checked)} /> Reduce camera motion</label>{systemReduced && <p>Your system reduced-motion preference is respected.</p>}</>}
      {sheet === 'modules' && <nav className="module-index" aria-label="Medical modules">{stations.map(station => <button key={station.id} onClick={() => openModule(station.id)}><span>{station.label}</span><small>{station.id === 'vitals' || station.id === 'overview' ? 'Navigate to station' : station.id === 'emergency' ? 'Rehearsal' : 'Open station'}</small></button>)}</nav>}
      {sheet === 'details' && <><p>{astronaut.displayName} / {astronaut.role}</p><BiometricDetails feed={monitoring}/></>}
      {sheet === 'preview' && <ModulePreview key={`${astronaut.id}:${route.station}`} station={route.station} feed={monitoring} />}
      <button className="os-text-action" onClick={()=>goChapter(1)}>Return to bay overview</button><p className="os-provenance">Fictional crew only / no medical decisions.<br />Connected data is generated by the local demo backend. Offline fixtures remain available.</p>
    </dialog>
  </div>
}
