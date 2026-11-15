/** Team history contract, supplied alongside CrewSnapshot by the API adapter. */
export interface HeartRateSample { measuredAt: string; bpm: number | null }

export function HeartRateTrend({ samples }: { samples?: readonly HeartRateSample[] }) {
  const values = (samples ?? []).flatMap(s => (s.bpm === null ? [] : [s.bpm]))
  if (!samples || values.length < 2) {
    return <p className="!m-0 text-sm text-[var(--os-muted)]">No heart rate history supplied. The trend appears when a history feed is connected.</p>
  }
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const W = 300
  const H = 80
  const y = (v: number) => H - 6 - ((v - min) / span) * (H - 12)
  let path = ''
  let pen = false
  samples.forEach((s, i) => {
    if (s.bpm === null) { pen = false; return } // a gap, never a zero
    path += `${pen ? 'L' : 'M'}${((i / (samples.length - 1)) * W).toFixed(1)} ${y(s.bpm).toFixed(1)} `
    pen = true
  })
  return <figure className="!m-0">
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" className="h-24 w-full"
      aria-label={`Heart rate trend, ${min} to ${max} bpm across ${samples.length} samples`}>
      <path d={path} fill="none" stroke="var(--os-accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
    <figcaption className="text-xs text-[var(--os-muted)]">Range {min} to {max} bpm. Gaps mean no valid sample.</figcaption>
    <details className="mt-2 text-sm">
      <summary className="cursor-pointer">Show data table</summary>
      <table className="mt-2 w-full text-left text-xs">
        <thead><tr><th scope="col">Time (UTC)</th><th scope="col">Heart rate</th></tr></thead>
        <tbody>{samples.map((s,i) => <tr key={`${s.measuredAt}:${i}`}><td>{s.measuredAt.slice(11, 19)}</td><td>{s.bpm === null ? 'Unavailable' : `${s.bpm} bpm`}</td></tr>)}</tbody>
      </table>
    </details>
  </figure>
}
