import type { AstronautProfile } from '../../domain/contracts'
import { CrewIdentity } from '../../ui/medical/MedicalPrimitives'

interface Props {
  astronaut: AstronautProfile
  chapter: number
  station: string
  onChapter: (chapter: number) => void
  onCrew: () => void
  onModules: () => void
  onEmergency: () => void
}

/** Corner-mounted controls leave the equipment and room centre unobstructed. */
export function OperationsNavigation({ astronaut, chapter, station, onChapter, onCrew, onModules, onEmergency }: Props) {
  return <>
    <header className="mission-masthead">
      <a href="/" className="mission-signature" aria-label="Orbital Medical OS mission arrival" onClick={e => { e.preventDefault(); onChapter(0) }}>
        <svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="14"/><path d="M18 8v20M8 18h20M3 29 32 7"/></svg>
        <span>Orbital<small>Aesculus / Medical operations</small></span>
      </a>
      <nav className="chapter-navigation" aria-label="Chapters">{['Arrival','Explore','Biometrics'].map((label,i) => <button key={label} aria-current={chapter === i ? 'step' : undefined} onClick={() => onChapter(i)}><span className="chapter-number" aria-hidden="true">0{i+1}</span><span>{label}</span></button>)}</nav>
    </header>
    <div className="command-cluster" aria-label="Mission controls">
      <button className="crew-context-trigger" onClick={onCrew} aria-label={`Crew and display settings, ${astronaut.displayName}`}><CrewIdentity astronaut={astronaut}/><span aria-hidden="true">⌄</span></button>
      <button className="module-switch" onClick={onModules} aria-label="Medical index"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h5v5H4zM15 4h5v5h-5zM4 15h5v5H4zM15 15h5v5h-5z"/></svg><span>Stations</span></button>
      <button className="emergency-access" onClick={onEmergency} aria-label="Emergency rehearsal"><span aria-hidden="true">+</span><span>Emergency<small>Rehearsal</small></span></button>
    </div>
    <div className="station-beacon" aria-live="polite"><i aria-hidden="true"/><span>Current station<strong>{station}</strong></span></div>
  </>
}
