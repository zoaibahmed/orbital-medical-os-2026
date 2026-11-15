import { useState, type FormEvent } from 'react'
import type { CrewSnapshot } from '../../domain/contracts'
import type { BodyRegion } from '../../domain/frontend'
import { updateClinical, useClinical } from '../../state/clinical'
import { Examination } from './Examination'
import { OperationTabs } from '../../ui/medical/OperationTabs'
import { formatMeasurement } from '../../domain/format'
import { PhysicalAssessmentDashboard } from './components/PhysicalAssessmentDashboard'
import { SANS_DRAFT_QUESTIONS } from './sansQuestions'
import { useApiAction } from '../../services/api/useApiAction'

const regions:readonly BodyRegion[]=['Full body','Head and eyes','Chest','Spine','Upper limbs','Lower limbs','Muscle groups']
const names={CYCLE:'Cycle ergometer',ARED:'Resistance session',T2_TREADMILL:'Treadmill'}
export function PhysicalConsole({snapshot}:{snapshot:CrewSnapshot}){
  const data=useClinical(snapshot.crewId),api=useApiAction()
  const [tab,setTab]=useState('examination')
  const [missing,setMissing]=useState(false),[period,setPeriod]=useState('Current')
  const [completion,setCompletion]=useState<{id:string;completed:boolean}|null>(null)
  const remote=api.connected?api.remote:null
  const exercises=remote?remote.records.exercises.map(row=>({id:row.id,type:names[row.type],minutes:row.durationMin,date:row.date,completed:row.completed})):data.exercises
  const symptoms=SANS_DRAFT_QUESTIONS.map(q=>{
    const local=data.answers[q.id],supplied=snapshot.physical.symptoms.find(s=>s.questionId===q.id)?.answer
    return {questionId:q.id,answer:local===undefined?supplied??null:local==='Yes'?true:local==='No'?false:null}
  })
  const assessment={...snapshot.physical,symptoms,...(missing?{boneDensityChange:{...snapshot.physical.boneDensityChange,value:null,quality:'missing' as const,severity:'unknown' as const},muscleMassChange:{...snapshot.physical.muscleMassChange,value:null,quality:'missing' as const,severity:'unknown' as const}}:{})}
  async function addExercise(event:FormEvent<HTMLFormElement>){
    event.preventDefault();const form=new FormData(event.currentTarget),type=String(form.get('exercise')),minutes=Number(form.get('minutes')),date=String(form.get('date'))
    if(!Number.isFinite(minutes)||minutes<1||minutes>240)return
    if(api.connected){await api.run('/health/exercise-log',{type,durationMin:minutes,date,completed:false,intensityPercent:80},'Exercise plan saved to the demo backend. Only completed sessions enter the supplied calculation.');return}
    updateClinical(snapshot.crewId,{exercises:[...data.exercises,{id:crypto.randomUUID(),type:names[type as keyof typeof names],minutes,date,completed:false}]})
    api.setNotice('Exercise plan saved in this browser session. It was not uploaded.')
  }
  async function complete(id:string,completed:boolean){
    if(api.connected){setCompletion({id,completed});await api.run(`/health/exercise-log/${encodeURIComponent(id)}`,{completed},'Exercise completion saved to the demo backend.','PATCH');setCompletion(null);return}
    updateClinical(snapshot.crewId,{exercises:data.exercises.map(row=>row.id===id?{...row,completed}:row)})
  }
  return <section className="clinical-section physical-console">
    <OperationTabs items={[{id:'examination',label:'Examination'},{id:'assessment',label:'Assessment'},{id:'vision',label:'Vision check'},{id:'exercise',label:'Exercise'}]} value={tab} onChange={setTab}>{id=>id==='examination'?<Examination crewId={snapshot.crewId} snapshot={snapshot}/>:id==='assessment'?<div className="operation-section">    <h3>Regional assessment</h3><p>Select a region here or on the exterior patient in the bay. Internal anatomical imaging is not supplied.</p>
    <div role="group" aria-label="Body regions" className="region-selector">{regions.map(region=><button key={region} aria-pressed={data.region===region} onClick={()=>updateClinical(snapshot.crewId,{region})}>{region}</button>)}</div>
    <h4>{data.region}</h4><p>Selected observation region for {snapshot.crewId}. Scanner results are illustrative, not acquired measurements.</p>
    {data.region==='Head and eyes'?<button onClick={()=>setTab('vision')}>Review this crew member’s SANS observation checklist</button>:data.region==='Chest'?<dl className="data-ledger" aria-label="Supplied chest monitoring context"><div><dt>Heart rate</dt><dd>{formatMeasurement(snapshot.biometrics.heartRate)}</dd></div><div><dt>SpO2</dt><dd>{formatMeasurement(snapshot.biometrics.oxygenSaturation)}</dd></div><div><dt>HRV</dt><dd>{formatMeasurement(snapshot.biometrics.heartRateVariability)}</dd></div></dl>:<p>Bone and muscle values are whole-body simulation outputs; region-specific measurements are unavailable.</p>}
    <PhysicalAssessmentDashboard section="physical" assessment={assessment}/><label>Observation period<select value={period} onChange={e=>setPeriod(e.target.value)}><option>Current</option><option>Previous observation</option></select></label>
    {period==='Previous observation'&&<p>No prior assessment series is available. Current readings remain labelled below.</p>}
    <label><input type="checkbox" checked={missing} onChange={e=>setMissing(e.target.checked)}/> Inspect unavailable-data state</label>
</div>:id==='vision'?<div className="operation-section">    <h3 id="sans-checklist">SANS educational observation checklist</h3><p>Draft for Fatima review. This self-report never creates instrument grades, scores or a diagnosis.</p>
    <PhysicalAssessmentDashboard section="vision" assessment={assessment} onSymptomsChange={rows=>updateClinical(snapshot.crewId,{answers:Object.fromEntries(rows.map(row=>[row.questionId,row.answer===true?'Yes':row.answer===false?'No':'Unsure']))})}/>
    <button disabled={api.pending||!api.connected} onClick={()=>void api.run('/health/sans-assessment',{symptoms},'SANS observations saved. No clinical grade was inferred.')}>Save SANS observations to backend</button>
    {!api.connected&&<p>Offline answers remain in this crew’s browser session. They are not automatically uploaded.</p>}
    <details><summary>Review SANS answers</summary>{SANS_DRAFT_QUESTIONS.map(q=><p key={q.id}>{q.text}: {data.answers[q.id]??(symptoms.find(s=>s.questionId===q.id)?.answer===true?'Yes':symptoms.find(s=>s.questionId===q.id)?.answer===false?'No':'Not answered')}</p>)}</details>
<p role="status" className="operation-feedback">{tab==='vision'?api.notice:''}</p></div>:<div className="operation-section">    <h3>Exercise countermeasures</h3>
    <form onSubmit={event=>void addExercise(event)}><label>Exercise type<select name="exercise"><option value="CYCLE">Cycle ergometer</option><option value="ARED">Resistance session</option><option value="T2_TREADMILL">Treadmill</option></select></label><label>Duration in minutes<input name="minutes" type="number" min="1" max="240" required defaultValue="20"/></label><label>Session date<input name="date" type="date" required defaultValue="2026-11-15"/></label><button type="submit" disabled={api.pending}>Save exercise plan</button></form>
    <p role="status" className="operation-feedback">{tab==='exercise'?api.notice:''}</p><p>{exercises.filter(e=>e.completed).length} / {exercises.length} planned sessions completed</p>
    <ul>{exercises.map(entry=><li key={entry.id}><label><input type="checkbox" data-record-id={entry.id} checked={completion?.id===entry.id?completion.completed:entry.completed} disabled={api.pending} onChange={e=>void complete(entry.id,e.target.checked)}/>{entry.type} / {entry.minutes} min / {entry.date}</label></li>)}</ul>
    <p>{remote?'Backend model / educational simulation; negative values display calculated loss as percentage change. Scientific review pending.':'Offline supplied observations; no calculation is performed.'}</p>
</div>}</OperationTabs>
  </section>
}
