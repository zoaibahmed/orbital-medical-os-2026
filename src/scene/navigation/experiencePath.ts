import type { CameraPreset } from './presets'
import type { StationId } from '../../app/navigation'
export type EquipmentFocus = 'cradle' | 'scanner' | 'equipment'
export type SpatialDestination = StationId | 'arrival' | 'examination'
export interface DirectorCommand {
  progress: number
  focus: EquipmentFocus | null
  paused: boolean
  reduced: boolean
  destination?: SpatialDestination | null
  onMotionChange?: (moving: boolean) => void
  invalidate?: () => void
}
const route: CameraPreset[] = [
  { position: [3.3, 2.65, 4.1], target: [-1.1, 1.5, -1] },
  { position: [2.9, 2.35, 3.35], target: [-1.0, 1.35, -.5] },
  { position: [2.65, 1.98, .65], target: [2.15, 1.4, -2.2] },
]
const inspections: Record<EquipmentFocus, CameraPreset> = {
  cradle: { position: [2.65, 1.9, 2.7], target: [-.4, 1, -.15] },
  scanner: { position: [2.15, 2.3, 1.9], target: [-.4, 1.85, -.85] },
  equipment: { position: [2.65, 1.98, .65], target: [2.15, 1.4, -2.2] },
}
/** Future modules deliberately share verified clear-aisle views, not fictional equipment. */
export const stationDestinations: Record<SpatialDestination, CameraPreset> = {
  arrival: route[0]!, overview: route[1]!, examination: inspections.cradle,
  vitals: inspections.equipment,
  radiation: { position: [2.9,2.25,2.4], target: [-1.6,1.6,-2.3] },
  physical: inspections.cradle,
  wellbeing: { position: [3.05,2.3,3.1], target: [-1.8,1.6,-1.3] },
  diagnostics: inspections.equipment,
  emergency: { position: [3.15,2.6,3.7], target: [-.3,1.4,-.6] },
}
export function travelDuration(from: CameraPreset, to: CameraPreset): number {
  const distance = Math.hypot(...from.position.map((v,i) => v-to.position[i]!))
  const turn = Math.hypot(...from.target.map((v,i) => v-to.target[i]!))
  return Math.min(4, Math.max(1.4, 1.35 + distance*.48 + turn*.12))
}
/** Convex clear-aisle corridor. Control points stay inside the same bounds as endpoints. */
export function travelPose(from: CameraPreset, to: CameraPreset, fraction: number): CameraPreset {
  const t = Math.max(0,Math.min(1,fraction))
  if (t === 0) return from
  if (t === 1) return to
  const ease=t*t*t*(t*(t*6-15)+10)
  const position=from.position.map((v,i)=>v+(to.position[i]!-v)*ease) as [number,number,number]
  // Lift gently through the clear aisle, rather than orbiting through the patient platform.
  position[1] += Math.sin(ease*Math.PI)*.07
  const target=from.target.map((v,i)=>v+(to.target[i]!-v)*ease) as [number,number,number]
  return {position,target}
}
export function experiencePose(progress: number, focus: EquipmentFocus | null = null, destination?: SpatialDestination | null): CameraPreset {
  if (focus) return inspections[focus]
  if (destination) return stationDestinations[destination]
  const p = Math.max(0, Math.min(2, progress))
  const segment = Math.min(1, Math.floor(p))
  const t = p - segment
  const smooth = t * t * (3 - 2 * t)
  const from = route[segment]!, to = route[segment + 1]!
  const lerp = (a: number[], b: number[]): [number, number, number] => [a[0]! + (b[0]! - a[0]!) * smooth, a[1]! + (b[1]! - a[1]!) * smooth, a[2]! + (b[2]! - a[2]!) * smooth]
  return { position: lerp(from.position, to.position), target: lerp(from.target, to.target) }
}
