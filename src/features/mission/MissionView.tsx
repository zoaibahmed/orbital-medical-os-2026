import { Link } from 'react-router-dom'
import { useMediaQuery } from '../../animation/useMediaQuery'
import { useSession } from '../../state/session'

export function MissionView() {
  const smallScreen = useMediaQuery('(max-width: 767px)')
  const { motionReduced, setMotionReduced } = useSession()
  return <main id="main-content" tabIndex={-1} className="mission-entry">
    <div className="mission-copy">
    <div className="mission-mark" aria-hidden="true"><svg width="34" height="34" viewBox="0 0 34 34" fill="none"><circle cx="17" cy="17" r="12" stroke="currentColor" /><path d="M17 7v20M7 17h20" stroke="currentColor" /></svg></div>
    <p className="mission-context">NASA Space Apps Challenge · Environment vertical slice</p>
    <h1>Orbital medical bay</h1>
    <p className="mission-intro">Explore an orbital examination bay and its medical equipment. Choose a crew member, inspect the environment, and visit the medical module previews.</p>
    <p className="simulation-note">Educational simulation · Fictional crew · Static sample data</p>
    <label className="motion-option"><input type="checkbox" checked={motionReduced} onChange={event => setMotionReduced(event.target.checked)} /> Reduce camera motion</label>
    <div className="action-row"><Link className="button" to={`/${smallScreen ? 'dashboard' : 'bay'}/overview?crew=crew-01`}>Initialize mission</Link><Link className="button button-secondary" to="/dashboard/overview?crew=crew-01">Open dashboard mode</Link></div>
    <p className="scope-note">First environment vertical slice. Medical dashboards and monitoring workflows remain previews.</p>
    </div>
    <aside className="mission-brief" aria-label="Examination bay mission brief">
      <svg viewBox="0 0 420 310" fill="none" aria-hidden="true"><path d="M44 258h332M78 246V94l45-42h174l45 42v152M94 246V102l37-34h158l37 34v144" stroke="currentColor" strokeWidth="1.2" opacity=".4"/><path d="M130 185v-41a80 80 0 0 1 160 0v41M141 185v-41a69 69 0 0 1 138 0v41" stroke="currentColor" strokeWidth="3"/><path d="M149 188h122l12 17H137l12-17Zm6 20v25m110-25v25m-126 6h142M162 161h96v25h-96zM172 144h76v13h-76z" stroke="currentColor" strokeWidth="1.5"/><path d="M89 118h-22m22 28h-22m264-28h22m-22 28h22M190 42h40m-20-11v22" stroke="currentColor" opacity=".55"/><circle cx="210" cy="93" r="4" fill="currentColor"/><path d="M101 270h218" stroke="currentColor" opacity=".35"/></svg>
      <h2>Examination module 01</h2>
      <p>A guided medical workspace with an examination cradle, diagnostic scanner and crew-focused module previews.</p>
      <p>Choose a station to inspect its equipment. Dashboard mode provides the same module access without 3D rendering.</p>
    </aside>
  </main>
}
