import { describe, expect, it } from 'vitest'
import { openingPose } from '../scene/navigation/scrollPath'
import { viewPresets } from '../scene/navigation/presets'

describe('opening camera route', () => {
  it('keeps continuous, reversible positions inside the established clear aisle', () => {
    let previous = openingPose(0)
    for (let i = 0; i <= 1000; i++) {
      const progress = i / 1000
      const pose = openingPose(progress)
      expect(pose.position[0]).toBeGreaterThan(1.5)
      expect(pose.position[0]).toBeLessThan(3.5)
      expect(pose.position[1]).toBeGreaterThan(1.5)
      expect(pose.position[1]).toBeLessThan(3)
      expect(pose.position[2]).toBeGreaterThan(.4)
      expect(pose.position[2]).toBeLessThan(4.2)
      expect(Math.hypot(...pose.position.map((n, axis) => n - previous.position[axis]!))).toBeLessThan(.02)
      expect(Math.hypot(...pose.target.map((n, axis) => n - previous.target[axis]!))).toBeLessThan(.02)
      previous = pose
    }
    expect(openingPose(1)).toEqual(viewPresets.examination)
    expect(openingPose(-1)).toEqual(openingPose(0))
    expect(openingPose(2)).toEqual(openingPose(1))
  })
})
