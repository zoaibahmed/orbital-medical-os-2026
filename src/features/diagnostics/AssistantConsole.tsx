import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { CrewSnapshot } from '../../domain/contracts'
import type { AssistantRequest } from '../../domain/frontend'
import { updateClinical, useClinical, clinicalSession } from '../../state/clinical'
import { formatMeasurement } from '../../domain/format'
import { useApiAction } from '../../services/api/useApiAction'
function demonstrationReply(request:AssistantRequest):string {
 const topic=request.message.toLowerCase()
 if(topic.includes('vital'))return `Supplied fictional heart rate: ${formatMeasurement(request.snapshot.biometrics.heartRate)}. HRV is ${formatMeasurement(request.snapshot.biometrics.heartRateVariability)}. These are separate measurements; no interpretation is performed.`
 if(topic.includes('radiation'))return `Supplied cumulative dose: ${formatMeasurement(request.snapshot.radiation.cumulativeDose)}. Open Radiation to inspect authored GCR/SPE scenarios. No risk calculation is available.`
 if(topic.includes('alert'))return 'Demonstration alerts are supplied or selected by the user. No clinical threshold engine or emergency detection is connected.'
 if(topic.includes('exercise')||topic.includes('microgravity'))return 'Review the Physical module for supplied bone/muscle observations and the exercise plan. Domain-reviewed countermeasure guidance must be supplied by the medical team.'
 if(topic.includes('sleep')||topic.includes('wellbeing'))return `Supplied sleep duration: ${formatMeasurement(request.snapshot.sleep.duration)}. The Wellbeing module shares this record and offers voluntary check-in controls. No mental-health analysis is performed.`
 return 'Scripted demonstration assistant: ask about vitals, radiation, microgravity, exercise, sleep, wellbeing or alerts. No AI service, diagnosis or treatment recommendation is connected.'
}
export function AssistantConsole({snapshot}:{snapshot:CrewSnapshot}){
  const data=useClinical(snapshot.crewId),api=useApiAction()
  const [pending,setPending]=useState(false),[error,setError]=useState(''),[unavailable,setUnavailable]=useState(false)
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null)
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[])
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();if(pending||api.pending)return
    const form=event.currentTarget,message=String(new FormData(form).get('message')??'').trim();if(!message)return
    setError('');updateClinical(snapshot.crewId,{messages:[...data.messages,{role:'user',text:message}]});form.reset()
    if(api.connected&&!unavailable){
      const result=await api.run('/ai/assist',{message},'Rule-based demo response received. No external AI service was called.')
      if(result&&typeof result==='object'&&'response' in result&&typeof result.response==='string')updateClinical(snapshot.crewId,{messages:[...clinicalSession(snapshot.crewId).messages,{role:'assistant',text:result.response}]})
      return
    }
    setPending(true)
    timer.current=setTimeout(()=>{
      setPending(false)
      if(unavailable){setError('Demonstration response unavailable. Turn off the unavailable scenario and submit again.');return}
      const request:AssistantRequest={crewId:snapshot.crewId,snapshot,region:data.region,message,alerts:[]}
      updateClinical(snapshot.crewId,{messages:[...clinicalSession(snapshot.crewId).messages,{role:'assistant',text:demonstrationReply(request)}]})
    },400)
  }
  const diagnostic=api.connected?api.remote?.diagnostics:null
  return <section className="clinical-section"><h3>Onboard medical assistance</h3>
    <p>Deterministic demonstration / {snapshot.crewId}. {api.connected?'Messages go to your configured demo backend; no external AI service is called.':'Offline scripted replies stay in this browser.'} No clinical advice.</p>
    {diagnostic&&<section aria-label="Backend diagnostic findings"><h3>Backend rule-engine findings</h3><p>Unvalidated educational output / {diagnostic.threatLevel}</p><p>{diagnostic.summary}</p><time dateTime={diagnostic.timestamp}>{diagnostic.timestamp}</time><ul>{diagnostic.findings.map(row=><li key={row.code}><strong>{row.system} / {row.severity}</strong><p>{row.observation}</p></li>)}</ul>{!diagnostic.findings.length&&<p>No findings were emitted by this simulation. This is not a medical clearance.</p>}<p>Prescriptive source actions require scientific review and are not displayed here.</p></section>}
    <dl className="data-ledger"><div><dt>Supplied heart rate</dt><dd>{formatMeasurement(snapshot.biometrics.heartRate)}</dd></div><div><dt>Assessment region</dt><dd>{data.region}</dd></div></dl>
    <div role="log" aria-label="Medical assistance conversation" aria-live="polite">{data.messages.map((message,i)=><article key={i}><strong>{message.role==='user'?'Crew request':'Scripted assistant'}</strong><p>{message.text}</p></article>)}</div>
    <p role="status">{pending||api.pending?'Preparing scripted response':error||api.notice}</p>
    <form onSubmit={event=>void submit(event)}><label>Ask onboard assistance<textarea name="message" required maxLength={1000} placeholder="Ask about vitals, radiation or sleep"/></label><button disabled={pending||api.pending}>Send message</button></form>
    <label><input type="checkbox" checked={unavailable} onChange={e=>setUnavailable(e.target.checked)}/> Demonstrate unavailable response</label><button onClick={()=>updateClinical(snapshot.crewId,{messages:[]})} disabled={pending||api.pending}>Clear conversation</button>
  </section>
}
