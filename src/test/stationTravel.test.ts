import { describe, expect, it } from 'vitest'
import { stationDestinations, travelDuration, travelPose } from '../scene/navigation/experiencePath'

describe('distance-aware station travel',()=>{
  it('has continuous, bounded paths and exact endpoints for every destination pair',()=>{
    for(const from of Object.values(stationDestinations)) for(const to of Object.values(stationDestinations)){
      expect(travelPose(from,to,0)).toEqual(from)
      expect(travelPose(from,to,1).position).toEqual(to.position)
      expect(travelDuration(from,to)).toBeGreaterThanOrEqual(1.4)
      expect(travelDuration(from,to)).toBeLessThanOrEqual(4)
      let previous=from
      for(let i=1;i<=100;i++){
        const next=travelPose(from,to,i/100)
        expect(next.position[0]).toBeGreaterThan(1.5);expect(next.position[0]).toBeLessThan(3.5)
        expect(next.position[1]).toBeGreaterThan(1.5);expect(next.position[1]).toBeLessThan(3)
        expect(next.position[2]).toBeGreaterThan(.4);expect(next.position[2]).toBeLessThan(4.2)
        expect(Math.hypot(...next.position.map((v,j)=>v-previous.position[j]!))).toBeLessThan(.11)
        previous=next
      }
    }
  })
  it('restarts an interrupted path at the actual intermediate pose',()=>{
    const halfway=travelPose(stationDestinations.arrival,stationDestinations.vitals,.4)
    expect(travelPose(halfway,stationDestinations.overview,0)).toEqual(halfway)
    expect(travelDuration(stationDestinations.arrival,stationDestinations.vitals)).toBeGreaterThan(travelDuration(stationDestinations.physical,stationDestinations.overview))
  })
})
