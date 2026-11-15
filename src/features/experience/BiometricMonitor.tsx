import { memo, useMemo, useState, useSyncExternalStore } from 'react'
import type { CrewSnapshot, AstronautProfile } from '../../domain/contracts'
import { formatMeasurement } from '../../domain/format'
import { MedicalReadout, StatusIndicator } from '../../ui/medical/MedicalPrimitives'
import { ECGTrace, TrendChart } from '../vitals/ECGTrace'
import { createMonitoringFeed, usableHeartRate, type MonitoringChannel, type MonitoringFeed } from '../vitals/monitoring'
import { VitalsDashboard } from '../vitals/components/VitalsDashboard'
import { HeartRateTrend } from '../vitals/components/HeartRateTrend'
import { ConnectionStatus } from '../../services/api/ConnectionStatus'
import type { CrewConnection } from '../../services/api/connection'

interface Props {
  snapshot: CrewSnapshot
  astronaut: AstronautProfile
  onDetails: () => void
  feed?: MonitoringFeed
  active?: boolean
  reducedMotion?: boolean
  connection?: CrewConnection
}
export const BiometricMonitor = memo(function BiometricMonitor({ snapshot, astronaut, onDetails, feed: supplied, active=false, reducedMotion=false, connection }: Props) {
  const fallback=useMemo(()=>createMonitoringFeed(snapshot),[snapshot])
  const feed=supplied??fallback
  const frame=useSyncExternalStore(feed.subscribe,feed.getSnapshot)
  const [zoom,setZoom]=useState(false),[channel,setChannel]=useState<MonitoringChannel>('heartRate')
  const b=frame.snapshot.biometrics,heartRate=usableHeartRate(frame)
  const sleep=frame.snapshot.sleep
  const pressure=[b.systolicPressure,b.diastolicPressure].every(m=>m.value!==null&&m.quality!=='invalid'&&m.quality!=='missing')
  const chartLabels={heartRate:'Heart rate trend',oxygenSaturation:'Oxygen saturation trend',heartRateVariability:'HRV trend'}
  return <section className="medical-instrument" aria-labelledby="biometric-title" data-crew={astronaut.id} data-sequence={frame.sequence}>
    <div className="instrument-heading"><StatusIndicator state={frame.active?'active':'standby'}>{frame.active?'Monitoring / Simulated':'Monitor standby'}</StatusIndicator><button onClick={onDetails} aria-label="Open detailed biometrics">Readout ↗</button></div>
    <h1 id="biometric-title">{astronaut.displayName}</h1><p className="instrument-subtitle">{astronaut.role} <span>/</span> {astronaut.callSign}</p>
    {connection&&<ConnectionStatus connection={connection}/>}
    <div className="heart-reading"><div><span className="reading-label">Heart rate</span><strong data-unavailable={heartRate===null} data-testid="heart-rate">{heartRate??'Unavailable'}<small>{heartRate===null?'':b.heartRate.unit}</small></strong></div><span className="signal-provenance">Fictional telemetry<br/>{frame.snapshot.source==='external'?'Backend / 2-second poll':'Offline / 4-second samples'}</span></div>
    <figure className="ecg"><figcaption><span>ECG / Simulated signal</span><button aria-pressed={zoom} onClick={()=>setZoom(value=>!value)}>{zoom?'Full trace':'Inspect trace'}</button></figcaption><ECGTrace feed={feed} reducedMotion={reducedMotion} zoom={zoom}/><p>{reducedMotion?'Motion reduced / static trace':'Illustrative waveform / Not a clinical recording'}</p></figure>
    <div className="trend-selection" role="group" aria-label="Monitoring chart">{(['heartRate','oxygenSaturation','heartRateVariability'] as const).map(id=><button key={id} aria-pressed={channel===id} onClick={()=>setChannel(id)}>{id==='heartRate'?'Heart rate':id==='oxygenSaturation'?'SpO₂':'HRV'}</button>)}</div>
    {channel==='heartRate'&&feed.heartRateHistory()?<HeartRateTrend samples={feed.heartRateHistory()}/>:<TrendChart values={feed.history(channel)} label={chartLabels[channel]} unit={b[channel].unit}/>}
    <dl className="biometric-readings"><MedicalReadout label="Blood pressure">{pressure?<><span>{b.systolicPressure.value}/{b.diastolicPressure.value}</span><small>mmHg</small></>:'Unavailable'}</MedicalReadout><MedicalReadout label="SpO₂" measurement={b.oxygenSaturation}/><MedicalReadout label="HRV" measurement={b.heartRateVariability}/></dl>
    <div className="oxygen-track" aria-hidden="true"><i style={{width:`${b.oxygenSaturation.quality==='valid'?(b.oxygenSaturation.value??0):0}%`}}/></div>
    <label className="demo-alert"><input type="checkbox" checked={frame.demoAlert} onChange={event=>feed.setDemoAlert(event.target.checked)}/> Preview demonstration alert</label>
    {frame.demoAlert&&<p className="monitor-warning" role="status">Demonstration hypoxia / threshold alert selected by you. No medical threshold or detected condition.</p>}
    <div className="sleep-preview"><div><span className="reading-label">Sleep / Previous interval</span><strong>{formatMeasurement(sleep.duration)}</strong></div><div className="circadian-preview"><svg viewBox="0 0 54 54" role="img" aria-label={`Circadian preview: ${sleep.duration.value??'Unavailable'} hours of simulated sleep in 24 hours`}><circle cx="27" cy="27" r="22"/><circle className="sleep-arc" cx="27" cy="27" r="22" pathLength="24" strokeDasharray={`${sleep.duration.value??0} 24`} transform="rotate(-120 27 27)"/></svg><span><b>{sleep.suppliedScore===null?'Unavailable':`${sleep.suppliedScore} / 100`}</b><small>Supplied demo sleep score</small><small>{sleep.duration.value===null?'No sleep record':`${sleep.start.slice(11,16)}–${sleep.end.slice(11,16)} UTC`}</small></span></div></div>
    <p className="audio-standby">{active?'Monitoring pulse follows permitted interaction and sound preferences.':'Sound is off outside the monitoring station.'}</p>
    <button className="instrument-data-link" onClick={onDetails}>Measurements & provenance <span aria-hidden="true">↗</span></button>
  </section>
})

export function BiometricDetails({ feed }: { feed: MonitoringFeed }) {
  const {snapshot}=useSyncExternalStore(feed.subscribe,feed.getSnapshot)
  const labels={heartRate:'Heart rate',systolicPressure:'Systolic pressure',diastolicPressure:'Diastolic pressure',oxygenSaturation:'SpO₂',heartRateVariability:'HRV'}
  return <><VitalsDashboard biometrics={snapshot.biometrics} sleep={snapshot.sleep} heartRateHistory={feed.heartRateHistory()}/><details><summary>Measurement timestamps and quality</summary><dl className="data-ledger">{Object.entries(snapshot.biometrics).map(([name,value])=><div key={name}><dt>{labels[name as keyof typeof labels]}<small>{value.quality} / severity {value.severity}</small></dt><dd><time dateTime={value.measuredAt}>{value.measuredAt}</time></dd></div>)}</dl></details><p className="measurement-note">ECG is a synchronized normalized illustration, not a measured clinical signal. All crew data is fictional.</p></>
}
