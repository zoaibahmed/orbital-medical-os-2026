import { viewPresets } from './presets'

export function openingPose(progress: number) {
  const p = Math.max(0, Math.min(1, progress))
  const from = p < .48 ? { position: viewPresets.overview.position, target: [-2.15, 1.5, -1.2] } : viewPresets.overview
  const to = p < .48 ? viewPresets.overview : viewPresets.examination
  const fraction = p < .48 ? p / .48 : (p - .48) / .52
  const t = fraction * fraction * (3 - 2 * fraction)
  const interpolate = (a: number[], b: number[]): [number, number, number] => [0, 1, 2].map(i => a[i]! + (b[i]! - a[i]!) * t) as [number, number, number]
  return { position: interpolate(from.position, to.position), target: interpolate(from.target, to.target) }
}
