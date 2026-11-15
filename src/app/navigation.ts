export const stationIds = ['overview', 'vitals', 'radiation', 'physical', 'wellbeing', 'diagnostics', 'emergency'] as const
export type StationId = typeof stationIds[number]
export type DisplayMode = 'bay' | 'dashboard'

export const stations: ReadonlyArray<{ id: StationId; label: string; short: string }> = [
  { id: 'overview', label: 'Bay overview', short: 'Overview' },
  { id: 'vitals', label: 'Crew biometrics & vitals', short: 'Vitals' },
  { id: 'radiation', label: 'Space radiation monitoring', short: 'Radiation' },
  { id: 'physical', label: 'Physiological & musculoskeletal assessment', short: 'Physical' },
  { id: 'wellbeing', label: 'Psychological health & wellbeing', short: 'Wellbeing' },
  { id: 'diagnostics', label: 'AI diagnostics', short: 'Diagnostics' },
  { id: 'emergency', label: 'Emergency protocols', short: 'Emergency' },
]

export function isStationId(value: string | undefined): value is StationId {
  return stationIds.some(id => id === value)
}
export function stationPath(mode: DisplayMode, station: StationId, crewId: string): string {
  return `/${mode}/${station}?crew=${encodeURIComponent(crewId)}`
}
