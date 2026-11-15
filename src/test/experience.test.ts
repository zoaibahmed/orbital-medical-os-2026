import { describe, expect, it } from 'vitest'
import { experiencePose } from '../scene/navigation/experiencePath'
import { resolveExperience, resolveFocus } from '../features/experience/experienceRoutes'

describe('unified journey and route boundaries', () => {
  it('uses continuous aisle-safe camera motion and explicit inspection poses', () => {
    let prior = experiencePose(0)
    for (let i=0; i<=1000; i++) {
      const pose=experiencePose(i/500)
      expect(pose.position[0]).toBeGreaterThan(1.5)
      expect(pose.position[0]).toBeLessThan(3.5)
      expect(pose.position[1]).toBeGreaterThan(1.5)
      expect(pose.position[1]).toBeLessThan(3)
      expect(pose.position[2]).toBeGreaterThan(.4)
      expect(pose.position[2]).toBeLessThan(4.2)
      expect(Math.hypot(...pose.position.map((v,j)=>v-prior.position[j]!))).toBeLessThan(.02)
      prior=pose
    }
    expect(experiencePose(0).position).not.toEqual(experiencePose(1).position)
    expect(experiencePose(1).position).not.toEqual(experiencePose(2).position)
    expect(experiencePose(0,'scanner')).toEqual(experiencePose(2,'scanner'))
    expect(experiencePose(0,'scanner')).not.toEqual(experiencePose(0,'cradle'))
  })
  it('maps legacy addresses into one shell without accepting unregistered modules', () => {
    expect(resolveExperience('/').chapter).toBe(0)
    expect(resolveExperience('/bay/overview').chapter).toBe(1)
    expect(resolveExperience('/dashboard/vitals')).toMatchObject({valid:true,chapter:2,list:true})
    expect(resolveExperience('/bay/unknown').valid).toBe(false)
    expect(resolveFocus(new URLSearchParams('view=equipment'))).toBe('equipment')
    expect(resolveFocus(new URLSearchParams('focus=scanner'))).toBe('scanner')
    expect(resolveFocus(new URLSearchParams('focus=unknown'))).toBe(null)
  })
})
