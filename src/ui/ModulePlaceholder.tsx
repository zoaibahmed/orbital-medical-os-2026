import type { ReactNode } from 'react'
import type { CrewSnapshot } from '../domain/contracts'
import { HolographicPanel } from './holographic/HolographicPanel'

export interface ModuleProps { snapshot: CrewSnapshot }
export function ModulePlaceholder({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return <HolographicPanel>
    <span className="phase-tag">Module foundation</span>
    <h1 tabIndex={-1} id="station-title">{title}</h1>
    <p className="module-description">{description}</p>
    <div className="fixture-preview">{children}</div>
    <p className="scope-note">Placeholder interface · Static simulated fixtures · No medical analysis</p>
  </HolographicPanel>
}
