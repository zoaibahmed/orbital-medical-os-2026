export interface FrameSample {
  intervalMs: number
  cpuRenderMs: number
  visible: boolean
  alwaysRendering: boolean
}

export function summarizeFrames(samples: readonly FrameSample[], movedDistance: number) {
  const periods = samples.map(sample => sample.intervalMs).filter(value => Number.isFinite(value) && value > 0)
  const elapsedMs = periods.reduce((sum, value) => sum + value, 0)
  const sorted = [...periods].sort((a, b) => a - b)
  const percentile = (values: number[], p: number) => values[Math.min(values.length - 1, Math.floor(values.length * p))] ?? null
  const cpu = samples.map(sample => sample.cpuRenderMs).sort((a, b) => a - b)
  const visibilityValid = samples.length > 0 && samples.every(sample => sample.visible)
  const activeModeValid = samples.length > 0 && samples.every(sample => sample.alwaysRendering)
  return {
    sampledFrames: periods.length,
    elapsedMs,
    fps: elapsedMs ? periods.length * 1000 / elapsedMs : null,
    averageFrameMs: periods.length ? elapsedMs / periods.length : null,
    medianFrameMs: percentile(sorted, .5),
    p95FrameMs: percentile(sorted, .95),
    medianCpuRenderMs: percentile(cpu, .5),
    p95CpuRenderMs: percentile(cpu, .95),
    visibilityValid,
    activeModeValid,
    movedDistance,
    representativeNavigation: visibilityValid && activeModeValid && periods.length >= 12 && movedDistance > .1,
    limitedSample: periods.length < 30,
  }
}
