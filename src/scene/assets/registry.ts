import type { StationId } from '../../app/navigation'
import type { QualityTier } from '../quality/config'
import generated from './benchmark-manifest.json'

export interface ModelAsset {
  id: string
  path: string
  version: string
  bytes: number
  station: StationId
  tier: QualityTier
  license: { source: string; author: string; name: string; attribution: string }
  animations: readonly string[]
  compression?: 'draco'
  triangles?: number
}

export const modelAssets: readonly ModelAsset[] = generated.map(asset => ({
  id: asset.id,
  path: asset.path,
  version: asset.sha256.slice(0, 12),
  bytes: asset.bytes,
  station: asset.id.startsWith('shell') ? 'overview' : asset.id.startsWith('examination') ? 'vitals' : 'diagnostics',
  tier: asset.tier as QualityTier,
  license: { source: 'scripts/build_premium_bay.py', author: 'Orbital Medical Bay project', name: 'Original geometry; CC0 deck maps; NASA Earth imagery', attribution: asset.license },
  animations: [],
  compression: 'draco',
  triangles: asset.triangles,
}))

export function getAssetUrl(asset: ModelAsset): string {
  if (!/^assets\/models\/[a-zA-Z0-9_./-]+\.glb$/.test(asset.path) || asset.path.split('/').includes('..')) {
    throw new Error(`Invalid model path: ${asset.id}`)
  }
  return `${import.meta.env.BASE_URL}${asset.path}?v=${encodeURIComponent(asset.version)}`
}
