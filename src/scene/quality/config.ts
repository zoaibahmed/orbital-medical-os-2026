export type QualityTier = 'standard' | 'low'
export const qualitySettings = {
  standard: { dpr: [1, 1.5] as [number, number], antialias: true, shadows: true, shadowMap: 2048, environmentResolution: 256 },
  low: { dpr: [.85, .85] as [number, number], antialias: false, shadows: false, shadowMap: 512, environmentResolution: 64 },
} satisfies Record<QualityTier, { dpr: [number, number]; antialias: boolean; shadows: boolean; shadowMap: number; environmentResolution: number }>

/** Public builds always open the highest authored tier; debug mode is development-only. */
export function initialGraphicsQuality(search: URLSearchParams, development = import.meta.env.DEV): QualityTier {
 return development && search.get('devQuality') === 'low' ? 'low' : 'standard'
}
