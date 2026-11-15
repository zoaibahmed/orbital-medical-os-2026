import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { AstronautProfile, Measurement } from '../../domain/contracts'
import { formatMeasurement } from '../../domain/format'

/** Presentation only: severity and measurements must be supplied by the data adapter. */
export function StatusIndicator({ children, state = 'standby' }: { children: ReactNode; state?: 'active' | 'standby' | 'attention' }) {
  return <span className="instrument-status" data-state={state}><i aria-hidden="true" />{children}</span>
}
export function MedicalReadout({ label, measurement, children }: { label: string; measurement?: Measurement; children?: ReactNode }) {
  return <div className="medical-readout"><dt>{label}</dt><dd>{measurement ? formatMeasurement(measurement) : children}</dd></div>
}
export function CrewIdentity({ astronaut }: { astronaut: AstronautProfile }) {
  return <span className="crew-identity"><span className="crew-avatar" aria-hidden="true">{astronaut.callSign.slice(0,1)}</span><span>{astronaut.displayName}<small>{astronaut.callSign} / Fictional crew</small></span></span>
}
export function InstrumentPanel({ title, id, children, aside }: { title: string; id: string; children: ReactNode; aside?: ReactNode }) {
  return <section className="instrument-panel" aria-labelledby={id}><header><h2 id={id}>{title}</h2>{aside}</header>{children}</section>
}
export function MedicalControl({ children, priority = 'secondary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { priority?: 'primary' | 'secondary' }) {
  return <button {...props} className={`medical-control medical-control--${priority} ${props.className ?? ''}`}>{children}</button>
}
