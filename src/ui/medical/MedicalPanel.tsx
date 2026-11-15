import { useId, type ReactNode } from 'react'
import type { Severity } from '../../domain/contracts'
import { severityTone } from './severity'

export function SeverityBadge({ severity }: { severity: Severity }) {
  const tone = severityTone[severity]
  return <span className="instrument-status" style={{ color: tone.color }}>{tone.label}</span>
}

/** Faiz's accessible panel composition; presentation stays in the accepted design system. */
export function MedicalPanel({ title, severity = 'unknown', aside, children }: {
  title: string; severity?: Severity; aside?: ReactNode; children: ReactNode
}) {
  const id = useId()
  return <section className="instrument-panel team-medical-panel" aria-labelledby={id}>
    <header><h3 id={id}>{title}</h3>{aside ?? <SeverityBadge severity={severity} />}</header>
    {children}
  </section>
}
