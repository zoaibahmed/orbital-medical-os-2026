import type { Measurement } from '../../domain/contracts'
import { formatMeasurement } from '../../domain/format'
import { severityTone } from './severity'

const R = 70
const C = 2 * Math.PI * R
const ARC = 0.75 * C

/** Dial fills value / max. Without `max` the dial stays empty (no invented scale). Colour comes from supplied severity. */
export function RingGauge({ measurement, max, label }: { measurement: Measurement; max?: number; label: string }) {
  const tone = severityTone[measurement.severity]
  const unavailable = measurement.value === null || measurement.quality === 'missing' || measurement.quality === 'invalid'
  const pct = unavailable || max === undefined || !Number.isFinite(max) || max <= 0 ? 0 : Math.min(1, Math.max(0, (measurement.value ?? 0) / max))
  return <div className="relative mx-auto aspect-square w-full max-w-[210px]">
    <svg viewBox="0 0 180 180" aria-hidden="true" className="size-full">
      <g transform="rotate(135 90 90)" fill="none" strokeLinecap="round" strokeWidth="10">
        <circle cx="90" cy="90" r={R} stroke="rgb(168 189 206 / .2)" strokeDasharray={`${ARC} ${C}`} />
        <circle cx="90" cy="90" r={R} stroke={tone.color} strokeDasharray={`${pct * ARC} ${C}`}
          style={{ transition: 'stroke-dasharray .6s' }} />
      </g>
    </svg>
    <div className="absolute inset-0 grid place-content-center px-6 text-center">
      <span className="text-2xl font-semibold tabular-nums" style={{ color: tone.color }}>{formatMeasurement(measurement)}</span>
      <span className="text-sm text-[var(--os-muted)]">{label}</span>
    </div>
  </div>
}
