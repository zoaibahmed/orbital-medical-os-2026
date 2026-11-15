import type { Severity } from '../../domain/contracts'

/** Faiz's supplied-severity presentation, adapted to the accepted operations palette. */
export const severityTone: Record<Severity, { color: string; label: string }> = {
  nominal: { color: 'var(--os-accent, #b0dbcb)', label: 'Nominal' },
  attention: { color: 'var(--os-warning, #f0b4a0)', label: 'Needs attention' },
  critical: { color: 'var(--alert, #ff7a73)', label: 'Critical' },
  unknown: { color: 'var(--os-muted, #adbdc3)', label: 'Not assessed' },
}
