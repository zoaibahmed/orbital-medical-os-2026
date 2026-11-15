import { describe, expect, it } from 'vitest'
import { viewPresets } from '../scene/navigation/presets'

describe('guided camera clearance', () => {
  it('keeps every pairwise Cartesian path inside the clear right-hand aisle', () => {
    for (const from of Object.values(viewPresets)) {
      for (const to of Object.values(viewPresets)) {
        for (let i = 0; i <= 20; i++) {
          const t = i / 20
          const position = from.position.map((value, axis) => value + (to.position[axis]! - value) * t)
          // 8m pressure shell; bed ends at x=.75; trolley starts at z=-2.8.
          expect(position[0]).toBeGreaterThan(1.5)
          expect(position[0]).toBeLessThan(3.5)
          expect(position[1]).toBeGreaterThan(1.5)
          expect(position[1]).toBeLessThan(3.0)
          expect(position[2]).toBeGreaterThan(.4)
          expect(position[2]).toBeLessThan(4.2)
        }
      }
    }
  })
})
