import { useState } from 'react'
import type { CrewSnapshot } from '../../domain/contracts'
import type { RadiationScenario } from '../../domain/frontend'
import { formatMeasurement } from '../../domain/format'
import { TrendChart } from '../vitals/ECGTrace'
import { useApiAction } from '../../services/api/useApiAction'
const scenarios:readonly RadiationScenario[]=[{id:'GCR',status:'Nominal demonstration',history:[{day:1,doseRate:16,cumulativeDose:.1,neutronCount:24},{day:2,doseRate:18,cumulativeDose:.2,neutronCount:27},{day:3,doseRate:17,cumulativeDose:.3,neutronCount:25},{day:4,doseRate:18,cumulativeDose:.4,neutronCount:28}]},{id:'SPE',status:'Elevated demonstration',history:[{day:1,doseRate:18,cumulativeDose:.4,neutronCount:28},{day:2,doseRate:42,cumulativeDose:.5,neutronCount:51},{day:3,doseRate:65,cumulativeDose:.7,neutronCount:76},{day:4,doseRate:39,cumulativeDose:.8,neutronCount:48}]}]
export function RadiationConsole({snapshot}:{snapshot:CrewSnapshot}){
  const api=useApiAction(),[localScenario,setScenario]=useState(0),[period,setPeriod]=useState(4),[channel,setChannel]=useState<'doseRate'|'cumulativeDose'|'neutronCount'>('doseRate')
  const remote=api.connected?api.remote:null,scenario=remote?Number(remote.mode==='SOLAR_FLARE'):localScenario,selected=scenarios[scenario]!
  const rows=remote?remote.radiationHistory.slice(-period).map((row,i)=>({day:i+1,timestamp:row.measuredAt,doseRate:row.doseRate,cumulativeDose:row.cumulativeDose,neutronCount:row.neutronDoseRate})):selected.history.slice(-period).map(row=>({...row,timestamp:`Day ${row.day}`}))
  const unit=channel==='doseRate'?'µSv/h':channel==='cumulativeDose'?'mSv':remote?'µSv/h neutron dose equivalent':'counts / demo interval'
  function changeScenario(value:number){if(remote){void api.run('/vitals/mode',{mode:value?'SOLAR_FLARE':'NOMINAL'},'Crew simulation scenario updated by the backend.')}else setScenario(value)}
  return <section className="clinical-section"><p>Fictional exposure / {snapshot.crewId}. {remote?'CANS-inspired backend simulation; radiation accumulation is accelerated 10×.':'Offline authored observations; no instrument is connected.'}</p>
    <label>Radiation environment<select value={scenario} disabled={api.pending} onChange={e=>changeScenario(Number(e.target.value))}><option value={0}>GCR / Galactic Cosmic Rays</option><option value={1}>SPE / Solar Particle Event</option></select></label>
    <p className={scenario?'monitor-warning':'instrument-status'} role="status">{remote?`${snapshot.radiation.doseRate.severity} / backend scenario ${remote.mode}`:`${selected.status} — scenario-selected, no clinical threshold.`}</p><p role="status">{api.notice}</p>
    <dl className="data-ledger"><div><dt>Current crew dose rate</dt><dd>{formatMeasurement(snapshot.radiation.doseRate)}</dd></div><div><dt>Supplied cumulative exposure</dt><dd>{formatMeasurement(snapshot.radiation.cumulativeDose)}</dd></div><div><dt>Observation start</dt><dd>{snapshot.radiation.periodStart}</dd></div></dl>
    <label>Exposure period<select value={period} onChange={e=>setPeriod(Number(e.target.value))}><option value={4}>{remote?'Last four samples':'Four observation days'}</option><option value={2}>{remote?'Last two samples':'Last two observation days'}</option></select></label>
    <label>Exposure trend<select value={channel} onChange={e=>setChannel(e.target.value as typeof channel)}><option value="doseRate">Dose rate</option><option value="cumulativeDose">Cumulative dose</option><option value="neutronCount">CANS-inspired neutron channel</option></select></label>
    {!remote&&<label>Scenario intensity / µSv/h (illustrative 0–100 display range)<meter min={0} max={100} value={selected.history.at(-1)!.doseRate}/></label>}
    <TrendChart key={`${scenario}:${period}:${channel}`} values={rows.map(row=>row[channel])} label={`${selected.id} exposure history`} unit={unit}/>
    <table><caption>{remote?'Backend simulated observation timeline':'Authored mission observation timeline'} / {unit}</caption><thead><tr><th>{remote?'Time (UTC)':'Day'}</th><th>Supplied value</th></tr></thead><tbody>{rows.map(row=><tr key={row.timestamp}><th>{row.timestamp}</th><td>{row[channel]??'Unavailable'}</td></tr>)}</tbody></table>
    <details><summary>Inspect measurement and CANS context</summary><p>CANS-inspired presentation only; no Canadian instrument feed is connected. Backend neutron dose equivalent and offline neutron counts are distinct quantities. No universal clinical limit or validated cancer-risk prediction is claimed.</p><a href="https://www.asc-csa.gc.ca/eng/iss/cans.asp" target="_blank" rel="noreferrer">Canadian Space Agency: CANS</a></details>
  </section>
}
