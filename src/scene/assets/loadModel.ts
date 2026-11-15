import type { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { getAssetUrl, type ModelAsset } from './registry'
import type { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import type { QualityTier } from '../quality/config'
import { modelAssets } from './registry'

let decoder: Promise<DRACOLoader> | undefined
function getDecoder() {
  decoder ??= import('three/addons/loaders/DRACOLoader.js').then(({ DRACOLoader }) => new DRACOLoader()
    .setDecoderPath({ js: `${import.meta.env.BASE_URL}assets/decoders/draco/draco_wasm_wrapper.js`, wasm: `${import.meta.env.BASE_URL}assets/decoders/draco/draco_decoder.wasm` })
    .setWorkerLimit(2))
  return decoder
}
const environments = new Map<QualityTier, Promise<GLTF[]>>()
const failedEnvironments = new Set<QualityTier>()

export function retryEnvironmentResource(tier: QualityTier) {
  if (failedEnvironments.delete(tier)) environments.delete(tier)
}

/** Bounded two-tier cache. Never mutate/dispose shared cached materials in instances. */
export function getEnvironmentResource(tier: QualityTier): Promise<GLTF[]> {
  const cached = environments.get(tier)
  if (cached) return cached
  const pending = Promise.all(modelAssets.filter(asset => asset.tier === tier).map(asset => loadModel(asset)))
  environments.set(tier, pending)
  // Retain a rejected promise until an explicit retry. Replacing it during render
  // would create an endless Suspense retry loop instead of reaching the boundary.
  void pending.catch(() => failedEnvironments.add(tier))
  return pending
}

/** Local Draco decoding; no CDN. Raw GLBs remain supported for future assets. */
export async function loadModel(
  asset: ModelAsset,
  configure?: (loader: GLTFLoader) => void,
  onProgress?: (event: ProgressEvent) => void,
): Promise<GLTF> {
  const url = getAssetUrl(asset)
  const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js')
  const loader = new GLTFLoader()
  if (asset.compression === 'draco') loader.setDRACOLoader(await getDecoder())
  configure?.(loader)
  try {
    return await loader.loadAsync(url, onProgress)
  } catch (error) {
    throw new Error(`Unable to load model ${asset.id}`, { cause: error })
  }
}
