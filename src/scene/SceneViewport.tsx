import { lazy, Suspense, useCallback, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { stationPath, type StationId } from '../app/navigation'
import { useMediaQuery } from '../animation/useMediaQuery'
import { useSession } from '../state/session'
import { ErrorBoundary } from '../ui/ErrorBoundary'
import { LoadingState } from '../ui/LoadingState'
import { detectWebGL } from './detectWebGL'
import { isCameraView, views, type CameraView } from './navigation/presets'
import type { QualityTier } from './quality/config'

const MedicalBayCanvas = lazy(() => import('./MedicalBayCanvas'))

export function SceneViewport({ station, crewId }: { station: StationId; crewId: string }) {
  const [supported, setSupported] = useState(detectWebGL)
  const [attempt, setAttempt] = useState(0)
  const [ready, setReady] = useState(false)
  const [loadedQuality, setLoadedQuality] = useState<QualityTier | null>(null)
  const [lost, setLost] = useState(false)
  const [resetToken, setResetToken] = useState(0)
  const [standbyRun, setStandbyRun] = useState(0)
  const [search, setSearch] = useSearchParams()
  const systemReduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const smallScreen = useMediaQuery('(max-width: 767px)')
  const { motionReduced } = useSession()
  const requestedView = search.get('view')
  const view: CameraView = isCameraView(requestedView) ? requestedView : station === 'vitals' || station === 'physical' ? 'examination' : station === 'diagnostics' ? 'equipment' : 'overview'
  const quality: QualityTier = search.get('quality') === 'low' || (search.get('quality') !== 'standard' && smallScreen) ? 'low' : 'standard'
  const onReady = useCallback(() => setReady(true), [])
  const onLoaded = useCallback(() => setLoadedQuality(quality), [quality])
  const onContextLost = useCallback(() => { setLost(true); setReady(false); setLoadedQuality(null) }, [])
  const onSelect = useCallback((next: CameraView) => {
    setSearch(previous => { const params = new URLSearchParams(previous); params.set('view', next); return params })
  }, [setSearch])
  async function retry() {
    if (supported) {
      const { retryEnvironmentResource } = await import('./assets/loadModel')
      retryEnvironmentResource(quality)
    }
    setReady(false)
    setLoadedQuality(null)
    setLost(false)
    setSupported(detectWebGL())
    setAttempt(value => value + 1)
  }
  const loaded = ready && loadedQuality === quality
  const recovery = <div className="scene-recovery" role="status"><h2>3D view unavailable</h2><p>{lost ? 'The graphics context was lost.' : supported ? 'The renderer or a required environment asset could not be loaded.' : 'WebGL 2 could not be initialized.'} All station interfaces remain available.</p><div className="action-row"><button className="button" onClick={retry}>Retry 3D view</button><Link className="button button-secondary" to={stationPath('dashboard', station, crewId)}>Use dashboard mode</Link></div></div>
  return <section className="scene-viewport" aria-label="Medical bay environment viewport">
    <ErrorBoundary key={attempt} fallback={recovery}>
      {supported && !lost ? <>
        <div className="canvas-layer" aria-hidden="true" data-testid="scene-host"><Suspense fallback={<LoadingState label="Loading 3D renderer…" />}><MedicalBayCanvas view={view} onSelect={onSelect} onLoaded={onLoaded} reducedMotion={systemReduced || motionReduced} quality={quality} resetToken={resetToken} onReady={onReady} onContextLost={onContextLost} benchmark={search.get('benchmark') === '1' && loaded} standbyRun={standbyRun} /></Suspense></div>
        {!loaded && <div className="environment-loading" role="status">Loading authored medical bay assets…</div>}
        <div className="environment-id" aria-hidden="true"><span>Orbital / Medical</span><strong>Examination bay 01</strong><small>{view === 'overview' ? 'Pressure module · Interior overview' : view === 'examination' ? 'Examination cradle · Selected' : 'Diagnostic trolley · Selected'}</small></div>
        <div className="viewport-status"><span role="status" data-testid="environment-status" data-state={loaded ? 'ready' : 'loading'}>{loaded ? 'Environment ready' : 'Preparing environment…'}</span><button onClick={() => { onSelect('overview'); setResetToken(value => value + 1) }}>Reset camera</button></div>
      </> : recovery}
    </ErrorBoundary>
    {supported && !lost && <div className="scene-tools">
      <div className="camera-views" role="group" aria-label="Camera views">{views.map(item => <button key={item.id} aria-pressed={view === item.id} onClick={() => onSelect(item.id)}>{item.label}</button>)}</div>
      <label className="quality-select">Render quality<select value={quality} onChange={event => setSearch(previous => { const params = new URLSearchParams(previous); params.set('quality', event.target.value); return params })}><option value="standard">Standard</option><option value="low">Low</option></select></label>
      <button className="standby-check" disabled={!loaded} onClick={() => setStandbyRun(value => value + 1)}>Check standby indicator</button>
      <p className="standby-status" role="status">{standbyRun > 0 ? 'Scanner light check · Visual simulation only' : 'Select the cradle or diagnostic trolley to inspect'}</p>
    </div>}
  </section>
}
