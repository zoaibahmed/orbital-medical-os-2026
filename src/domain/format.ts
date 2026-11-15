import type { Measurement } from './contracts'

export function formatMeasurement(measurement: Measurement): string {
  if (measurement.value === null || measurement.quality === 'missing' || measurement.quality === 'invalid') return 'Unavailable'
  return `${measurement.value} ${measurement.unit}${measurement.quality === 'stale' ? ' · Stale' : ''}`
}
