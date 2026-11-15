import {describe,expect,it} from 'vitest'
import {planScan,sampleScan,scanRegions,isScanMoving} from '../features/physical/scanTimeline'
import {createScannerRuntime} from '../state/scanner'
import {scannerTravel} from '../scene/environment/scannerMeasurements'

describe('measured mechanical scanner trajectory',()=>{
  it('traverses the complete posed subject and parks before reporting completion',()=>{
    const plan=planScan('Full body'),samples=Array.from({length:1001},(_,i)=>sampleScan(plan,plan.duration*i/1000))
    expect(samples[0]!.offset).toBe(0)
    expect(Math.max(...samples.map(s=>s.offset))+scannerTravel.apertureZ).toBeCloseTo(scannerTravel.feetZ+.02,3)
    expect(samples.some(s=>s.phase==='forward')).toBe(true);expect(samples.some(s=>s.phase==='backward')).toBe(true)
    expect(samples.at(-1)).toEqual({offset:0,progress:1,phase:'complete'})
    expect(samples.every(s=>s.offset>=0&&s.offset<=scannerTravel.endZ)).toBe(true)
  })
  it('targets each anatomically authored region without reusing a generic full sweep',()=>{
    for(const region of Object.keys(scanRegions) as Array<keyof typeof scanRegions>){
      const plan=planScan(region),peak=sampleScan(plan,plan.approach+plan.forward)
      expect(peak.offset+scannerTravel.apertureZ).toBeCloseTo(scanRegions[region][1],5)
      expect(sampleScan(plan,plan.duration).offset).toBe(0)
    }
    expect(planScan('Chest').end).toBeLessThan(planScan('Lower limbs').end)
    expect(planScan('Head and eyes').end).toBeLessThan(planScan('Spine').end)
  })
  it('applies physical position before completion and prevents overlapping crew scans',()=>{
    let position=-1,completions=0
    const runtime=createScannerRuntime(()=>{expect(position).toBe(0);completions++})
    runtime.attach(frame=>{position=frame.offset})
    expect(runtime.start('crew-01','Full body')).toBe(true)
    expect(runtime.start('crew-02','Chest')).toBe(false)
    for(let i=0;i<500;i++)runtime.advance(.04)
    expect(runtime.getSnapshot('crew-01').phase).toBe('complete');expect(completions).toBe(1)
    expect(runtime.getSnapshot('crew-02').phase).toBe('ready')
  })
  it('returns smoothly on cancellation and never completes the wrong crew',()=>{
    const runtime=createScannerRuntime()
    runtime.start('crew-01','Full body');for(let i=0;i<130;i++)runtime.advance(.04)
    const from=runtime.current()!.offset;expect(from).toBeGreaterThan(.5)
    runtime.cancel('Crew changed');runtime.advance(.04)
    expect(runtime.current()!.offset).toBeLessThanOrEqual(from);expect(runtime.current()!.offset).toBeGreaterThan(0)
    for(let i=0;i<150;i++)runtime.advance(.04)
    expect(runtime.getSnapshot('crew-01').phase).toBe('cancelled');expect(runtime.current()!.offset).toBe(0)
    expect(runtime.getSnapshot('crew-02').phase).toBe('ready')
  })
  it('bounds long-frame catch-up, keeps progress monotonic and reports presenter errors',()=>{
    const runtime=createScannerRuntime();runtime.start('crew-01','Chest');runtime.advance(30)
    expect(runtime.current()!.elapsed).toBe(.08)
    let previous=0,notifications=0;runtime.subscribe(()=>notifications++)
    for(let i=0;i<500;i++){runtime.advance(.01);expect(runtime.current()!.progress).toBeGreaterThanOrEqual(previous);previous=runtime.current()!.progress}
    expect(notifications).toBeLessThan(65)
  })
  it('sets an explicit error and safe parked state if a mechanical presenter fails',()=>{
    const runtime=createScannerRuntime();runtime.attach(()=>{});runtime.start('crew-01','Chest')
    let calls=0;runtime.attach(()=>{if(++calls>1)throw Error('Test mechanism unavailable')})
    runtime.advance(.05);expect(runtime.current()!.phase).toBe('error');expect(runtime.current()!.offset).toBe(0)
    expect(isScanMoving(runtime.current()!.phase)).toBe(false)
  })
})
