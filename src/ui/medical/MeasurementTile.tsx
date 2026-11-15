import type { Measurement } from '../../domain/contracts'
import { formatMeasurement } from '../../domain/format'
import { severityTone } from './severity'

/** Missing and invalid values retain their identity; no threshold calculation. */
export function MeasurementTile({ label, measurement }: { label: string; measurement: Measurement }) {
  const tone = severityTone[measurement.severity]
  return <div className="team-measurement">
    <span>{label}</span><strong style={{ color: tone.color }}>{formatMeasurement(measurement)}</strong>
    <small>{tone.label} · {measurement.quality}</small>
    <small>{measurement.source === 'external' ? 'Backend simulation' : 'Offline fixture'} · <time dateTime={measurement.measuredAt}>{measurement.measuredAt.replace('T', ' ').replace('Z', ' UTC')}</time></small>
  </div>
}
