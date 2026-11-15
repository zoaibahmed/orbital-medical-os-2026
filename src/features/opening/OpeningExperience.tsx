import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { crew } from '../../data/fixtures'
import { stations, stationPath } from '../../app/navigation'
import { useSession } from '../../state/session'
import { useMediaQuery } from '../../animation/useMediaQuery'
import { detectWebGL } from '../../scene/detectWebGL'
import { ErrorBoundary } from '../../ui/ErrorBoundary'
import type { QualityTier } from '../../scene/quality/config'

const MedicalBayCanvas = lazy(() => import('../../scene/MedicalBayCanvas'))

export function OpeningExperience() {
  const [search, setSearch] = useSearchParams()
  const astronaut = crew.find(person => person.id === search.get('crew')) ?? crew[0]!
  const { emergencyOpen, setEmergencyOpen, motionReduced, setMotionReduced } = useSession()
  const narrow = useMediaQuery('(max-width: 767px)')
  const prefersReduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const reduced = motionReduced || prefersReduced
  const [enabled, setEnabled] = useState(false)
  const [supported] = useState(detectWebGL)
  const [lost, setLost] = useState(false)
  const [ready, setReady] = useState(false)
  const [sceneFailed, setSceneFailed] = useState(false)
  const [quality, setQuality] = useState<QualityTier>('standard')
  const [attempt, setAttempt] = useState(0)
  const [indexOpen, setIndexOpen] = useState(false)
  const [indexSection, setIndexSection] = useState<'crew' | 'modules'>('modules')
  const root = useRef<HTMLElement>(null)
  const intro = useRef<HTMLDivElement>(null)
  const arrival = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const index = useRef<HTMLDialogElement>(null)
  const renderScene = (!narrow || enabled) && supported && !lost
  const onLoaded = useCallback(() => setReady(true), [setReady])
  const onReady = useCallback(() => {}, [])
  const onLost = useCallback(() => { setLost(true); setReady(false) }, [setReady, setLost])
  const scrollToBay = useCallback(() => {
    const element = root.current
    if (element) window.scrollTo({ top: element.offsetTop + element.offsetHeight - window.innerHeight, behavior: reduced ? 'instant' : 'smooth' })
  }, [reduced])
  useEffect(() => {
    const element = root.current
    if (!element) return
    let frame = 0
    const update = () => {
      frame = 0
      const range = Math.max(1, element.offsetHeight - innerHeight)
      const p = Math.max(0, Math.min(1, -element.getBoundingClientRect().top / range))
      progress.current = p
      // Geometry follows native document scrolling. React doesn't render on each tick.
      const reveal = reduced ? 0 : Math.min(1, p / .58)
      element.style.setProperty('--reveal', String(reveal))
      element.style.setProperty('--intro-alpha', String(Math.max(0, 1 - p / .32)))
      element.style.setProperty('--arrival-alpha', String(Math.max(0, Math.min(1, (p - .65) / .2))))
      element.style.setProperty('--travel', `${p * 100}%`)
      element.dataset.immersed = String(p > .35 && !reduced)
      element.dataset.canvasFilled = String(p >= .565 && !reduced)
      element.dataset.progress = p.toFixed(3)
      if (intro.current) intro.current.inert = p > .34
      if (arrival.current) arrival.current.inert = p < .65
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    update()
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [reduced])
  useEffect(() => {
    const dialog = index.current
    if (!dialog) return
    if (indexOpen && !dialog.open) dialog.showModal()
    if (!indexOpen && dialog.open) dialog.close()
  }, [indexOpen])
  useEffect(() => {
    if (!indexOpen && !emergencyOpen) return
    const previous = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => { document.documentElement.style.overflow = previous }
  }, [indexOpen, emergencyOpen])
  const openIndex = (section: 'crew' | 'modules') => { setIndexSection(section); setIndexOpen(true) }
  async function retry() {
    const { retryEnvironmentResource } = await import('../../scene/assets/loadModel')
    retryEnvironmentResource(quality)
    setLost(false)
    setSceneFailed(false)
    setReady(false)
    setAttempt(value => value + 1)
  }
  const recovery = <div className="opening-recovery"><span className="opening-cross" aria-hidden="true">＋</span><h2>The mission stays within reach.</h2><p>{lost ? 'The graphics connection was interrupted.' : 'The spatial preview is unavailable. The medical workspace remains accessible.'}</p><Link to={stationPath('dashboard', 'overview', astronaut.id)}>Open dashboard mode</Link>{supported && <button onClick={() => { void retry() }}>Retry 3D view</button>}</div>
  return <main ref={root} id="main-content" tabIndex={-1} className={`opening${reduced ? ' opening-reduced' : ''}${narrow && renderScene ? ' opening-live-mobile' : ''}`} aria-label="Orbital medical bay opening">
    <div className="opening-pin">
      <div className="opening-scene" aria-label="Scroll-controlled medical bay">
        {renderScene ? <ErrorBoundary key={`${quality}-${attempt}`} onError={() => setSceneFailed(true)} fallback={recovery}><Suspense fallback={<div className="opening-loading" role="status">Preparing the medical bay…</div>}><MedicalBayCanvas view="overview" onSelect={scrollToBay} onLoaded={onLoaded} onReady={onReady} onContextLost={onLost} quality={quality} reducedMotion={reduced} benchmark={false} standbyRun={0} resetToken={attempt} scrollProgress={progress} scrollPaused={emergencyOpen || indexOpen} /></Suspense></ErrorBoundary> : narrow && !enabled && supported ? <div className="opening-mobile-poster"><svg viewBox="0 0 300 300" fill="none" aria-hidden="true"><circle cx="150" cy="150" r="120"/><path d="M82 192v-65a68 68 0 0 1 136 0v65M95 192v-65a55 55 0 0 1 110 0v65M66 204h170l-24-25H87l-21 25Zm39 4v28m96-28v28M126 158h50v20h-50z"/><path d="M150 0v40m0 220v40M0 150h40m220 0h40"/></svg><span>Examination bay / Spatial preview</span><button onClick={() => setEnabled(true)}>Enable 3D exploration <span aria-hidden="true">↗</span></button></div> : recovery}
        {renderScene && !ready && !sceneFailed && <div className="opening-loading" role="status">Loading the authored environment…</div>}
      </div>
      <div className="opening-curve-label" aria-hidden="true">Human health / Beyond Earth orbit</div>
      <header className="opening-header">
        <Link className="opening-wordmark" to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} aria-label="Orbital mission introduction"><span className="opening-emblem" aria-hidden="true"><i /><i /></span>orbital<span className="opening-wordmark-dot">.</span></Link>
        <div className="opening-edition">A human mission.<br /><span>NASA Space Apps Challenge</span></div>
        <nav aria-label="Mission controls"><button className="opening-crew-trigger" onClick={() => openIndex('crew')}><span className="opening-crew-initials">{astronaut.displayName.split(' ').map(name => name[0]).join('')}</span><span>{astronaut.displayName}</span></button><button onClick={() => openIndex('modules')}>Medical index <span aria-hidden="true">≡</span></button><button className="opening-emergency" onClick={() => setEmergencyOpen(true)} aria-label="Emergency rehearsal"><span aria-hidden="true">＋</span><span>Emergency</span></button></nav>
      </header>
      <div ref={intro} className="opening-intro">
        <p className="opening-kicker"><span /> Medicine for the next frontier</p>
        <h1>Care,<br />beyond<br /><span>Earth.</span></h1>
        <div className="opening-intro-note"><span aria-hidden="true">↳</span><p>Far from home.<br />Closer to what makes us human.</p></div>
        <button className="opening-scroll-invitation" onClick={scrollToBay}><span className="opening-scroll-circle" aria-hidden="true">↓</span><span>Explore the medical bay<small>Scroll to enter</small></span></button>
      </div>
      <div ref={arrival} className="opening-arrival">
        <p className="opening-kicker">Inside the mission / Examination bay</p>
        <h2>Built around<br />the human.</h2>
        <p>An examination cradle. A diagnostic scanner.<br />A space designed around the crew.</p>
        <Link className="opening-enter" to={stationPath(narrow ? 'dashboard' : 'bay', 'overview', astronaut.id)}>Initialize mission <span aria-hidden="true">↗</span></Link>
        <Link className="opening-station-link" to={`${stationPath(narrow ? 'dashboard' : 'bay', 'vitals', astronaut.id)}&view=examination`}>Inspect examination station</Link>
      </div>
      <div className="opening-progress" aria-label="Opening sequence"><span>Arrival</span><div><i /></div><span>Medical bay</span></div>
      <div className="opening-bottom"><Link to={stationPath('dashboard', 'overview', astronaut.id)}>Open dashboard mode <span aria-hidden="true">↗</span></Link><p>Educational simulation. Fictional crew. No medical decisions.</p><span className="opening-render-state" data-testid="opening-status" data-state={sceneFailed ? 'fallback' : ready ? 'ready' : renderScene ? 'loading' : 'fallback'}>{sceneFailed ? 'Spatial preview unavailable' : ready ? 'Examination environment / Ready' : renderScene ? 'Preparing environment' : 'List workspace available'}</span></div>
    </div>
    <dialog ref={index} className="opening-index" aria-labelledby="opening-index-title" onCancel={() => setIndexOpen(false)} onClose={() => setIndexOpen(false)}>
      <div className="opening-index-top"><span>Orbital / Mission access</span><button onClick={() => setIndexOpen(false)} aria-label="Close medical index">×</button></div>
      <h2 id="opening-index-title">{indexSection === 'crew' ? 'The people at the centre.' : 'A mission in good hands.'}</h2>
      <label className="opening-crew-select">Crew context<select aria-label="Astronaut" value={astronaut.id} onChange={event => setSearch(previous => { const next = new URLSearchParams(previous); next.set('crew', event.target.value); return next }, { replace: true })}>{crew.map(person => <option key={person.id} value={person.id}>{person.displayName} / {person.role}</option>)}</select></label>
      <nav aria-label="Medical modules">{stations.map((station, i) => <Link key={station.id} to={stationPath('dashboard', station.id, astronaut.id)}><span>{station.label}</span><span aria-hidden="true">{i === 0 ? '↗' : '＋'}</span></Link>)}</nav>
      <fieldset><legend>Experience preferences</legend><label><input type="checkbox" checked={motionReduced} onChange={event => setMotionReduced(event.target.checked)} /> Reduce camera motion</label>{prefersReduced && <p>Your system motion preference is respected.</p>}<label>Rendering quality<select aria-label="Rendering quality" value={quality} onChange={event => { setReady(false); setSceneFailed(false); setQuality(event.target.value as QualityTier) }}><option value="low">Low / Efficient</option><option value="standard">Standard / Shadows</option></select></label></fieldset>
      <p className="opening-index-disclosure">Static, fictional medical data. No live monitoring, medical calculation or AI diagnosis. This preview contains the opening experience only.</p>
    </dialog>
  </main>
}
