import { lazy, Suspense, useEffect, useRef } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { crew, getFixtureSnapshot } from '../data/fixtures'
import { isStationId, stationPath } from './navigation'
import { StationNavigation } from './StationNavigation'
import { SceneViewport } from '../scene/SceneViewport'
import { useSession } from '../state/session'
import { LoadingState } from '../ui/LoadingState'
import { ErrorBoundary } from '../ui/ErrorBoundary'

const views = {
  overview: lazy(() => import('../features/mission/OverviewView')),
  vitals: lazy(() => import('../features/vitals/VitalsView')),
  radiation: lazy(() => import('../features/radiation/RadiationView')),
  physical: lazy(() => import('../features/physical/PhysicalView')),
  wellbeing: lazy(() => import('../features/wellbeing/WellbeingView')),
  diagnostics: lazy(() => import('../features/diagnostics/DiagnosticsView')),
  emergency: lazy(() => import('../features/emergency/EmergencyView')),
}

export function Workspace() {
  const { mode, stationId } = useParams()
  const [search, setSearch] = useSearchParams()
  const { motionReduced, setMotionReduced, setEmergencyOpen } = useSession()
  const crewId = search.get('crew') ?? 'crew-01'
  const astronaut = crew.find(person => person.id === crewId)
  const snapshot = getFixtureSnapshot(crewId)
  const main = useRef<HTMLElement>(null)
  const previousStation = useRef(stationId)
  useEffect(() => {
    if (previousStation.current !== stationId) main.current?.focus()
    previousStation.current = stationId
  }, [stationId])

  if ((mode !== 'bay' && mode !== 'dashboard') || !isStationId(stationId) || !astronaut || !snapshot) return <main id="main-content" className="recovery"><h1>Station or crew unavailable</h1><p>This location does not match a registered station and fictional crew member.</p><Link className="button" to="/dashboard/overview?crew=crew-01">Return to overview</Link></main>
  const View = views[stationId]
  const panelOpen = search.get('panel') === 'open' || (stationId !== 'overview' && search.get('panel') !== 'closed')
  return <div className={`workspace-shell ${mode === 'bay' ? 'immersive-workspace' : 'flat-workspace'}`}>
    <div className="workspace-toolbar"><div className="mission-summary"><p className="mission-context">Mission 01 / Medical operations</p><span>Selected crew: <strong>{astronaut.displayName}</strong></span></div><label className="crew-field">Astronaut<select value={crewId} onChange={event => { const next = new URLSearchParams(search); next.set('crew', event.target.value); setSearch(next) }}>{crew.map(person => <option key={person.id} value={person.id}>{person.displayName} · {person.callSign}</option>)}</select></label></div>
    <StationNavigation mode={mode} crewId={crewId} />
    <div className={`workspace-grid ${mode === 'dashboard' ? 'dashboard-layout' : ''}`}>
      {mode === 'bay' && <SceneViewport station={stationId} crewId={crewId} />}
      <main ref={main} id="main-content" tabIndex={-1} aria-label="Selected medical module" className={`station-content${mode === 'bay' ? ' bay-module-panel' : ''}`}>
        {mode === 'bay' && <button className="module-panel-toggle" aria-expanded={panelOpen} aria-controls="module-panel-content" onClick={() => setSearch(previous => { const next = new URLSearchParams(previous); next.set('panel', panelOpen ? 'closed' : 'open'); return next })}><span>{stationId === 'overview' ? 'Mission notes' : 'Module preview'}</span><span aria-hidden="true">{panelOpen ? '−' : '+'}</span></button>}
        <div id="module-panel-content" hidden={mode === 'bay' && !panelOpen}><ErrorBoundary key={stationId} fallback={<section className="recovery"><h1>Station could not load</h1><p>Other stations and the emergency rehearsal remain available.</p><button className="button" onClick={() => window.location.reload()}>Reload station</button></section>}><Suspense fallback={<LoadingState />}><View snapshot={snapshot} /></Suspense></ErrorBoundary>
          <p className="data-provenance">Static fixture captured {new Date(snapshot.capturedAt).toUTCString()} · No live telemetry · Nothing is saved</p>
        </div>
      </main>
    </div>
    <div className="workspace-controls"><Link to={stationPath(mode === 'bay' ? 'dashboard' : 'bay', stationId, crewId)}>{mode === 'bay' ? 'Use dashboard mode' : 'Open spatial viewport'}</Link><label className="motion-option"><input type="checkbox" checked={motionReduced} onChange={event => setMotionReduced(event.target.checked)} /> Reduce camera motion</label><button className="emergency-trigger" onClick={() => setEmergencyOpen(true)}>Emergency rehearsal</button></div>
    <p className="workspace-disclosure">Educational simulation · Fictional crew · No medical decisions</p>
  </div>
}
