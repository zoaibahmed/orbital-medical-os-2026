import { describe, expect, it, vi } from 'vitest'
import { getFixtureSnapshot } from '../data/fixtures'
import { beatPhase, createMonitoringFeed, ecgPoints, usableHeartRate } from '../features/vitals/monitoring'

describe('typed simulated monitor boundary',()=>{
  it('updates one crew atomically, preserves units and does nothing in standby',()=>{
    const base=getFixtureSnapshot('crew-01')!,feed=createMonitoringFeed(base),listener=vi.fn()
    const unsubscribe=feed.subscribe(listener);feed.advance();expect(feed.getSnapshot().sequence).toBe(0)
    feed.activate(true);feed.advance()
    const next=feed.getSnapshot();expect(next.snapshot.crewId).toBe('crew-01');expect(next.snapshot.biometrics.heartRate.value).toBe(73)
    expect(next.snapshot.biometrics.heartRateVariability.unit).toBe('ms');expect(next.snapshot.biometrics.systolicPressure.unit).toBe('mmHg')
    expect(next.snapshot.biometrics.heartRate.measuredAt).not.toBe(base.capturedAt)
    feed.activate(false);feed.advance();expect(feed.getSnapshot().sequence).toBe(1)
    unsubscribe();const calls=listener.mock.calls.length;feed.setDemoAlert(true);expect(listener).toHaveBeenCalledTimes(calls)
    expect(base.biometrics.heartRate.value).toBe(72)
    expect(createMonitoringFeed(getFixtureSnapshot('crew-02')!).getSnapshot().snapshot.biometrics.heartRate.value).toBe(81)
  })
  it('preserves unavailable and external measurements and never invents severity',()=>{
    const base=getFixtureSnapshot('crew-01')!
    const snapshot={...base,biometrics:{...base.biometrics,heartRate:{...base.biometrics.heartRate,quality:'invalid' as const},heartRateVariability:{...base.biometrics.heartRateVariability,value:null},oxygenSaturation:{...base.biometrics.oxygenSaturation,source:'external' as const}}}
    const feed=createMonitoringFeed(snapshot);feed.activate(true);feed.advance()
    expect(usableHeartRate(feed.getSnapshot())).toBeNull();expect(feed.getSnapshot().snapshot.biometrics.heartRateVariability.value).toBeNull()
    expect(feed.getSnapshot().snapshot.biometrics.oxygenSaturation).toBe(snapshot.biometrics.oxygenSaturation)
    expect(feed.history('oxygenSaturation')).toEqual([]);expect(feed.history('heartRateVariability')).toEqual([])
    feed.setDemoAlert(true);expect(feed.getSnapshot().snapshot.biometrics.heartRate.severity).toBe('unknown')
  })
  it('shares a heartbeat clock with a continuously changing illustrative trace',()=>{
    const feed=createMonitoringFeed(getFixtureSnapshot('crew-01')!);feed.activate(true)
    const frame=feed.getSnapshot(),period=60000/72
    expect(beatPhase(frame.epoch+period*.5,frame)).toBeCloseTo(.5)
    expect(ecgPoints(0)).not.toBe(ecgPoints(.5))
    expect(ecgPoints(.2)).not.toMatch(/NaN|Infinity/)
  })
})
