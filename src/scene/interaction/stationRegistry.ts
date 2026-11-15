import type { StationId } from '../../app/navigation'

export interface StationInteraction {
  stationId: StationId
  nodeName: string
  label: string
  anchor: readonly [number, number, number]
}

/** Future station components register named GLB anchors and dispose on unmount. */
export function createStationRegistry() {
  const entries = new Map<StationId, StationInteraction>()
  return {
    register(entry: StationInteraction) {
      if (entries.has(entry.stationId)) throw new Error(`Station already registered: ${entry.stationId}`)
      entries.set(entry.stationId, entry)
      return () => { if (entries.get(entry.stationId) === entry) entries.delete(entry.stationId) }
    },
    get(id: StationId) { return entries.get(id) },
  }
}
