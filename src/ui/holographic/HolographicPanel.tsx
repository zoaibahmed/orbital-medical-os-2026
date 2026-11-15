import type { ReactNode } from 'react'

/** DOM presentation boundary; world-space anchors/shaders are a later scene concern. */
export function HolographicPanel({ children }: { children: ReactNode }) {
  return <section className="holographic-panel" aria-labelledby="station-title">{children}</section>
}
