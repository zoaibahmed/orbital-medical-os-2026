import type { CrewSnapshot, Measurement } from '../../domain/contracts'
import type { HeartRateSample } from './components/HeartRateTrend'

export type MonitoringChannel = 'heartRate' | 'oxygenSaturation' | 'heartRateVariability'
export interface MonitoringFrame {
  snapshot: CrewSnapshot
  sequence: number
  epoch: number
  active: boolean
  demoAlert: boolean
  emergencyActive: boolean
}
export interface MonitoringFeed {
  getSnapshot: () => MonitoringFrame
  subscribe: (listener: () => void) => () => void
  activate: (active: boolean) => void
  advance: () => void
  setDemoAlert: (enabled: boolean) => void
  history: (channel: MonitoringChannel) => readonly number[]
  heartRateHistory: () => readonly HeartRateSample[] | undefined
  supply: (snapshot: CrewSnapshot, history?: readonly HeartRateSample[], emergencyActive?: boolean) => void
}

// Authored demonstration samples, not physiological calculations or random telemetry.
const samples = {
  'crew-01': { heartRate:[72,73,72,71,72,74,73,72], oxygenSaturation:[98,98,99,98,98,97,98,98], heartRateVariability:[46,47,45,46,48,47,46,46] },
  'crew-02': { heartRate:[81,80,82,81,80,79,81,81], oxygenSaturation:[97,98,97,98,98,97,97,98], heartRateVariability:[38,39,38,37,39,40,39,38] },
} as const
function sampleMeasurement<U extends string>(original: Measurement<U>, values: readonly number[], sequence: number, capturedAt: string): Measurement<U> {
  if(original.source!=='simulated-fixture'||original.quality!=='valid'||original.value===null)return original
  return {...original,value:values[sequence%values.length]!,measuredAt:new Date(Date.parse(capturedAt)+sequence*4000).toISOString()}
}
export function createMonitoringFeed(base: CrewSnapshot): MonitoringFeed {
  let frame: MonitoringFrame={snapshot:base,sequence:0,epoch:0,active:false,demoAlert:false,emergencyActive:false}
  const listeners=new Set<()=>void>()
  const publish=()=>listeners.forEach(listener=>listener())
  const selected=base.crewId === 'crew-02' ? samples['crew-02'] : samples['crew-01']
  let remote=false,remoteHistory:readonly HeartRateSample[]|undefined
  return {
    getSnapshot:()=>frame,
    subscribe:listener=>{listeners.add(listener);return()=>{listeners.delete(listener)}},
    activate:active=>{if(frame.active===active)return;frame={...frame,active,epoch:performance.now()};publish()},
    advance:()=>{
      if(!frame.active||remote)return
      const sequence=frame.sequence+1
      const biometrics={...base.biometrics,
        heartRate:sampleMeasurement(base.biometrics.heartRate,selected.heartRate,sequence,base.capturedAt),
        oxygenSaturation:sampleMeasurement(base.biometrics.oxygenSaturation,selected.oxygenSaturation,sequence,base.capturedAt),
        heartRateVariability:sampleMeasurement(base.biometrics.heartRateVariability,selected.heartRateVariability,sequence,base.capturedAt),
      }
      // Preserve graphic/audio phase through a supplied demonstration rate change.
      const now=performance.now(),phase=beatPhase(now,frame),bpm=biometrics.heartRate.value
      frame={...frame,sequence,epoch:bpm&&bpm>0?now-phase*60000/bpm:now,snapshot:{...base,biometrics}}
      publish()
    },
    setDemoAlert:demoAlert=>{frame={...frame,demoAlert};publish()},
    history:channel=>remote?channel==='heartRate'?(remoteHistory??[]).flatMap(row=>row.bpm===null?[]:[row.bpm]):[]:base.biometrics[channel].quality==='valid'&&base.biometrics[channel].value!==null&&base.biometrics[channel].source==='simulated-fixture'?selected[channel]:[],
    heartRateHistory:()=>remoteHistory,
    supply:(snapshot,history,emergencyActive=false)=>{
      if(snapshot.crewId!==base.crewId)return
      remote=snapshot.source==='external';remoteHistory=history
      const now=performance.now(),phase=beatPhase(now,frame),bpm=snapshot.biometrics.heartRate.value
      frame={...frame,snapshot,emergencyActive,sequence:frame.sequence+1,epoch:bpm&&bpm>0?now-phase*60000/bpm:now};publish()
    },
  }
}
export function usableHeartRate(frame: MonitoringFrame): number | null {
  const m=frame.snapshot.biometrics.heartRate
  return m.quality==='valid'&&m.value!==null&&m.value>0?m.value:null
}
/** Normalized graphic timing only. Not a measured ECG, rhythm analysis or diagnostic engine. */
export function beatPhase(now: number, frame: MonitoringFrame): number {
  const bpm=usableHeartRate(frame)
  return bpm ? ((Math.max(0,now-frame.epoch)*bpm/60000)%1) : 0
}
const trace=[0,0,0,.06,.16,.05,0,-.12,.92,-.35,.03,0,0,.05,.21,.25,.12,0,0,0,0,0,0,0]
export function ecgAmplitude(phase: number): number {
  const point=((phase%1+1)%1)*(trace.length-1),i=Math.floor(point)
  return trace[i]!+(trace[Math.min(i+1,trace.length-1)]!-trace[i]!)*(point-i)
}
export function ecgPoints(phase: number, width=600, height=120): string {
  const points=[]
  for(let x=0;x<=width;x+=3)points.push(`${x},${(height*.59-ecgAmplitude(x/width*3+phase)*height*.43).toFixed(1)}`)
  return points.join(' ')
}
