import { useState, type FormEvent } from 'react'
import type { CrewSnapshot } from '../../domain/contracts'
import { updateClinical, useClinical } from '../../state/clinical'
import { formatMeasurement } from '../../domain/format'
import { TrendChart } from '../vitals/ECGTrace'
import { useApiAction } from '../../services/api/useApiAction'
const resources=[['Stress management','Use check-in notes to prepare a conversation with mission-designated support. This tool does not interpret changes or replace professional care.'],['Relaxation','Choose a quiet pause and an activity you find comfortable. This educational resource is not therapy.'],['Isolation coping','Plan meaningful personal time and use established crew support channels. Content awaits domain review.'],['Communication delay','Prepare asynchronous messages with context, a timestamp and a clear question. A delayed reply does not imply lack of support.'],['Support pathways','Use mission-designated behavioural health and medical contacts. Operational contact details must be supplied by the team.']]
export function WellbeingConsole({snapshot}:{snapshot:CrewSnapshot}){
  const data=useClinical(snapshot.crewId),api=useApiAction(),[resource,setResource]=useState(0)
  const records=api.connected&&api.remote?api.remote.records.checkIns.map(row=>({id:row.id,mood:row.moodScore,stress:row.stressScore,note:row.notes,date:row.timestamp})):data.checkIns
  const scale=api.connected?10:5
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();const form=new FormData(event.currentTarget),mood=Number(form.get('mood')),stress=Number(form.get('stress')),note=String(form.get('note'))
    if(api.connected){await api.run('/health/mental-checkin',{moodScore:mood,stressScore:stress,notes:note},'Check-in saved to the demo backend for this crew member.');return}
    updateClinical(snapshot.crewId,{checkIns:[...data.checkIns,{id:crypto.randomUUID(),mood,stress,note,date:new Date().toISOString()}]})
    api.setNotice('Check-in saved for this crew member in memory. Refreshing clears offline demonstration logs. Nothing was uploaded.')
  }
  async function saveSleep(event:FormEvent<HTMLFormElement>){
    event.preventDefault();const form=new FormData(event.currentTarget),hours=Number(form.get('hours')),start=new Date(String(form.get('start'))+'Z').toISOString(),end=new Date(String(form.get('end'))+'Z').toISOString()
    if(hours<0||hours>24||Date.parse(end)<=Date.parse(start)||hours>(Date.parse(end)-Date.parse(start))/3600000){api.setNotice('Check the UTC interval and supplied duration. Duration must fit inside the interval.');return}
    if(api.connected){await api.run('/health/sleep-log',{start,end,hoursSlept:hours,awakeningsCount:Number(form.get('awakenings')),remFractionPct:Number(form.get('rem')),lightExposureSync:form.get('light')==='on'},'Sleep record saved. The demo backend supplied the score; scientific validation is pending.');return}
    const score=Number(form.get('score'));if(score<0||score>100)return
    const now=new Date().toISOString()
    updateClinical(snapshot.crewId,{sleepRecords:[...data.sleepRecords,{id:crypto.randomUUID(),crewId:snapshot.crewId,start,end,duration:{id:'sleep-duration',value:hours,unit:'h',measuredAt:now,quality:'valid',severity:'unknown',source:'simulated-fixture'},suppliedScore:score}]})
    api.setNotice('Supplied sleep record saved and shared with Biometrics. No score was calculated or uploaded.')
  }
  return <section className="clinical-section">
    <h3>Daily wellbeing check-in</h3><p>Optional self-report / fictional crew / no mental-health diagnosis. {api.connected?'Submitting sends these demo entries to your configured backend. Use fictional notes only.':'Offline entries stay in browser memory and are not uploaded.'}</p>
    <form key={`checkin-${scale}`} onSubmit={event=>void submit(event)}><label>Mood: 1 very low to {scale} very positive<input name="mood" type="range" min="1" max={scale} defaultValue={api.connected?6:3}/></label><label>Stress: 1 very low to {scale} very high<input name="stress" type="range" min="1" max={scale} defaultValue={api.connected?4:2}/></label><label>Optional check-in notes<textarea name="note" maxLength={1000}/></label><button disabled={api.pending}>Save check-in</button></form>
    <p role="status">{api.notice}</p><h3>Recent entries</h3>
    {records.length>1&&<TrendChart values={records.map(e=>e.mood)} label="Self-reported mood history" unit={`1–${scale}`}/>}
    <ul>{records.map(e=><li key={e.id}>{e.date}: Mood {e.mood}/{scale}; Stress {e.stress}/{scale}<p>{e.note}</p></li>)}</ul>{!records.length&&<p>No check-in recorded.</p>}
    <h3>Sleep and circadian context</h3><dl className="data-ledger"><div><dt>Sleep duration</dt><dd>{formatMeasurement(snapshot.sleep.duration)}</dd></div><div><dt>Supplied demo sleep score</dt><dd>{snapshot.sleep.suppliedScore??'Unavailable'} / 100</dd></div></dl>
    <p>UTC sleep interval: {snapshot.sleep.duration.value===null?'Unavailable':`${snapshot.sleep.start.slice(11,16)}–${snapshot.sleep.end.slice(11,16)}`}</p>
    <div className="circadian-band" role="img" aria-label={`24-hour circadian preview; ${snapshot.sleep.duration.value??'unavailable'} hours recorded sleep`}><i style={{width:`${(snapshot.sleep.duration.value??0)/24*100}%`}}/></div>
    <h3>Log supplied sleep record</h3>
    <form onSubmit={event=>void saveSleep(event)}><label>Sleep interval start (UTC)<input type="datetime-local" name="start" required defaultValue="2026-11-14T22:00"/></label><label>Sleep interval end (UTC)<input type="datetime-local" name="end" required defaultValue="2026-11-15T06:00"/></label><label>Supplied sleep duration in hours<input type="number" name="hours" min="0" max="24" step="0.1" required defaultValue="8"/></label>
    {api.connected?<><label>Awakenings<input name="awakenings" type="number" min="0" max="30" step="1" required defaultValue="1"/></label><label>REM fraction percent<input name="rem" type="number" min="0" max="100" step="0.1" required defaultValue="25"/></label><label><input name="light" type="checkbox" defaultChecked/> Light exposure synchronized (demo input)</label></>:<label>Supplied demo sleep score<input name="score" type="number" min="0" max="100" required defaultValue="84"/></label>}
    <button disabled={api.pending}>Save supplied sleep record</button></form>
    {api.remote&&api.connected&&api.remote.records.sleep.length>0&&<details><summary>Backend sleep history</summary><ul>{api.remote.records.sleep.map(row=><li key={row.id}>{row.start}: {row.hoursSlept} h / supplied demo score {row.sleepScore}</li>)}</ul></details>}
    <h3>Coping and support library</h3><nav aria-label="Support resources">{resources.map(([name],i)=><button key={name} aria-pressed={resource===i} onClick={()=>setResource(i)}>{name}</button>)}</nav><h4>{resources[resource]![0]}</h4><p>{resources[resource]![1]}</p><p>Draft educational content for Fatima review. This interface does not replace professional support.</p>
  </section>
}
