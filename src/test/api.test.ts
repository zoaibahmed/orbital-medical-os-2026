import {afterEach,describe,expect,it,vi} from 'vitest'
import {parseCrewState} from '../services/api/validate'
import {requestApi} from '../services/api/client'
import {createCrewConnection} from '../services/api/connection'
import {createMonitoringFeed} from '../features/vitals/monitoring'
import {getFixtureSnapshot} from '../data/fixtures'
import {apiFixture} from './apiFixture'

afterEach(()=>{vi.useRealTimers();vi.unstubAllGlobals()})
const response=(value:unknown)=>new Response(JSON.stringify(value),{status:200,headers:{'Content-Type':'application/json'}})
describe('typed full-stack boundary',()=>{
  it('rejects wrong crew, units, missing values claiming validity, and invalid history',()=>{
    expect(parseCrewState(apiFixture(),'crew-01').simulation).toBe(true)
    expect(()=>parseCrewState(apiFixture(),'crew-02')).toThrow()
    const wrongUnit=apiFixture();Object.assign(wrongUnit.snapshot.radiation.doseRate,{unit:'mSv/h'})
    expect(()=>parseCrewState(wrongUnit,'crew-01')).toThrow()
    const missing=apiFixture();Object.assign(missing.snapshot.biometrics.heartRate,{value:null,quality:'valid'})
    expect(()=>parseCrewState(missing,'crew-01')).toThrow()
    const history=apiFixture();Object.assign(history,{heartRateHistory:[{measuredAt:'not a date',bpm:72}]})
    expect(()=>parseCrewState(history,'crew-01')).toThrow()
  })
  it('preserves null gaps and supplied unknown severity without inventing nominal',()=>{
    const value=apiFixture();Object.assign(value.snapshot.biometrics.heartRateVariability,{value:null,quality:'missing',severity:'unknown'})
    Object.assign(value,{heartRateHistory:[{measuredAt:value.snapshot.capturedAt,bpm:null}]})
    const parsed=parseCrewState(value,'crew-01')
    expect(parsed.snapshot.biometrics.heartRateVariability.value).toBeNull();expect(parsed.snapshot.biometrics.heartRateVariability.severity).toBe('unknown');expect(parsed.heartRateHistory[0]!.bpm).toBeNull()
  })
  it('uses one polling chain and cancels it completely on disposal',async()=>{
    vi.useFakeTimers();Object.defineProperty(document,'visibilityState',{configurable:true,value:'visible'})
    const fetcher=vi.fn(async()=>response(apiFixture()));vi.stubGlobal('fetch',fetcher)
    const store=createCrewConnection('crew-01'),stop=store.start()
    await vi.advanceTimersByTimeAsync(0);expect(store.getSnapshot().status).toBe('connected');expect(fetcher).toHaveBeenCalledTimes(1)
    await vi.advanceTimersByTimeAsync(6000);expect(fetcher).toHaveBeenCalledTimes(4)
    stop();await vi.advanceTimersByTimeAsync(20000);expect(fetcher).toHaveBeenCalledTimes(4)
  })
  it('discards late responses after crew disposal and backs off failures without stale data',async()=>{
    vi.useFakeTimers();Object.defineProperty(document,'visibilityState',{configurable:true,value:'visible'})
    let finish:(value:Response)=>void=()=>{}
    vi.stubGlobal('fetch',vi.fn(()=>new Promise<Response>(resolve=>{finish=resolve})))
    const old=createCrewConnection('crew-01'),stop=old.start();stop();finish(response(apiFixture()))
    await vi.advanceTimersByTimeAsync(0);expect(old.getSnapshot().data).toBeNull()
    const fetcher=vi.fn(async()=>response({wrong:'schema'}));vi.stubGlobal('fetch',fetcher)
    const current=createCrewConnection('crew-02'),dispose=current.start()
    await vi.advanceTimersByTimeAsync(0);expect(current.getSnapshot().status).toBe('offline');expect(current.getSnapshot().data).toBeNull()
    await vi.advanceTimersByTimeAsync(3999);expect(fetcher).toHaveBeenCalledTimes(1)
    await vi.advanceTimersByTimeAsync(1);expect(fetcher).toHaveBeenCalledTimes(2);dispose()
  })
  it('times out requests and never retries a write automatically',async()=>{
    vi.useFakeTimers()
    const fetcher=vi.fn((_url:string,init:RequestInit)=>new Promise<Response>((_resolve,reject)=>init.signal!.addEventListener('abort',()=>reject(init.signal!.reason))))
    vi.stubGlobal('fetch',fetcher)
    const pending=requestApi('/emergency/trigger',{method:'POST',body:{emergencyType:'GENERAL_EMERGENCY'}})
    const assertion=expect(pending).rejects.toThrow('timed out')
    await vi.advanceTimersByTimeAsync(5000);await assertion;expect(fetcher).toHaveBeenCalledTimes(1)
  })
  it('updates the shared display feed atomically and cannot advance backend samples locally',()=>{
    const feed=createMonitoringFeed(getFixtureSnapshot('crew-01')!),state=apiFixture()
    feed.activate(true);feed.supply(state.snapshot,state.heartRateHistory,true)
    const supplied=feed.getSnapshot();feed.advance();expect(feed.getSnapshot()).toBe(supplied)
    expect(feed.getSnapshot().emergencyActive).toBe(true)
    feed.supply(apiFixture('crew-02').snapshot);expect(feed.getSnapshot()).toBe(supplied)
    feed.supply(getFixtureSnapshot('crew-01')!);expect(feed.getSnapshot().snapshot.source).toBe('simulated-fixture')
  })
})
