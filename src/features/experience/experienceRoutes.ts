import { isStationId, type StationId } from '../../app/navigation'
import type { EquipmentFocus } from '../../scene/navigation/experiencePath'
export const chapterNames = ['Mission arrival', 'Medical bay exploration', 'Crew biometric monitoring'] as const
export function resolveExperience(path: string) {
  if (path === '/') return { valid: true, chapter: 0, station: 'overview' as StationId, list: false }
  const match = /^\/(bay|dashboard)\/([^/]+)\/?$/.exec(path)
  const valid = !!match && isStationId(match[2])
  const station: StationId = valid ? match![2] as StationId : 'overview'
  return { valid, chapter: station === 'vitals' || station === 'physical' ? 2 : 1, station, list: match?.[1] === 'dashboard' }
}
export function resolveFocus(search: URLSearchParams): EquipmentFocus | null {
  const focus = search.get('focus')
  if (focus === 'scanner' || focus === 'cradle' || focus === 'equipment') return focus
  return search.get('view') === 'equipment' ? 'equipment' : search.get('view') === 'examination' ? 'cradle' : null
}
