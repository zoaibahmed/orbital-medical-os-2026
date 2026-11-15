import { describe, expect, it } from 'vitest'
import { summarizeFrames } from '../scene/quality/metrics'

describe('active-navigation measurements', () => {
  it('does not certify an idle or background interval as navigation performance', () => {
    const idle = Array.from({ length: 40 }, () => ({ intervalMs: 1000, cpuRenderMs: 1, visible: true, alwaysRendering: false }))
    expect(summarizeFrames(idle, 0).representativeNavigation).toBe(false)
    expect(summarizeFrames(idle.map(sample => ({ ...sample, visible: false, alwaysRendering: true })), 5).representativeNavigation).toBe(false)
  })
  it('reports elapsed active time and preserves slow frames instead of dropping them', () => {
    const samples = Array.from({ length: 60 }, () => ({ intervalMs: 1000 / 60, cpuRenderMs: 4, visible: true, alwaysRendering: true }))
    const summary = summarizeFrames(samples, 3)
    expect(summary.fps).toBeCloseTo(60)
    expect(summary.representativeNavigation).toBe(true)
    const stalled = summarizeFrames([...samples, { ...samples[0]!, intervalMs: 6000 }], 3)
    expect(stalled.fps).toBeLessThan(10)
    expect(stalled.elapsedMs).toBeCloseTo(7000)
  })
})
