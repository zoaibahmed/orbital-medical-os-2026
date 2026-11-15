import type { StationId } from '../../app/navigation'

export interface CameraPreset {
  position: [number, number, number]
  target: [number, number, number]
}

export type CameraView = 'overview' | 'examination' | 'equipment'
export const views: ReadonlyArray<{ id: CameraView; label: string }> = [
  { id: 'overview', label: 'Bay overview' },
  { id: 'examination', label: 'Examination station' },
  { id: 'equipment', label: 'Equipment detail' },
]

export function isCameraView(value: string | null): value is CameraView {
  return value === 'overview' || value === 'examination' || value === 'equipment'
}

/** All camera positions and interpolated paths remain in the clear right-side aisle.
 * Guided views intentionally disable unconstrained orbit/pan through solid equipment.
 */
export const viewPresets: Record<CameraView, CameraPreset> = {
  overview: { position: [3.3, 2.65, 4.1], target: [-.5, 1.55, -1.0] },
  examination: { position: [2.25, 2.05, 2.35], target: [-.4, 1.1, -.25] },
  equipment: { position: [2.65, 1.98, .65], target: [2.15, 1.4, -2.2] },
}

export const cameraPresets: Record<StationId, CameraPreset> = {
  overview: viewPresets.overview,
  vitals: viewPresets.examination,
  radiation: viewPresets.overview,
  physical: viewPresets.examination,
  wellbeing: viewPresets.overview,
  diagnostics: viewPresets.equipment,
  emergency: viewPresets.overview,
}
