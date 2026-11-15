import { useState } from 'react'
import { updateClinical, useClinical } from '../../state/clinical'
import { retryPatientAsset, usePatientAssetStatus } from '../../scene/assets/patient'
import { scannerRuntime, useScanner, useScannerCamera, useScannerMachine } from '../../state/scanner'
import { isScanMoving } from './scanTimeline'
import type { BodyRegion } from '../../domain/frontend'
import type { CrewSnapshot } from '../../domain/contracts'
import { crew } from '../../data/fixtures'
import { MeasurementTile } from '../../ui/medical/MeasurementTile'

const examinationRegions:readonly BodyRegion[]=['Full body','Head and eyes','Chest','Spine','Upper limbs','Lower limbs','Muscle groups']
const phaseLabels={ready:'Ready',preparing:'Preparing',forward:'Scanning forward',backward:'Scanning backward',complete:'Complete',cancelling:'Returning safely',cancelled:'Cancelled',error:'Error'}
export function Examination({crewId,snapshot}:{crewId:string;snapshot?:CrewSnapshot}){
  const data=useClinical(crewId),frame=useScanner(crewId),machine=useScannerMachine(),cameraReady=useScannerCamera(),asset=usePatientAssetStatus()
  const [notice,setNotice]=useState('')
  const moving=!!machine&&isScanMoving(machine.phase),ownActive=moving&&machine.crewId===crewId
  const profile=crew.find(person=>person.id===crewId),prepared=data.examination==='EXAMINATION_ACTIVE'
  const completed=frame.phase==='complete'&&frame.crewId===crewId
  function prepare(){
    if(moving)return
    scannerRuntime.reset(crewId,data.region);updateClinical(crewId,{examination:'EXAMINATION_ACTIVE'})
    window.dispatchEvent(new Event('orbital:examination-view'));setNotice('Examination prepared. Confirm the region, then start the mechanical demonstration.')
  }
  function start(){
    if(!prepared||!cameraReady)return
    if(scannerRuntime.start(crewId,data.region)){updateClinical(crewId,{examination:'SCAN_ACTIVE'});setNotice('')}
  }
  return <section className="examination-control" aria-labelledby="examination-heading">
    <header className="examination-heading"><div><span className="operation-kicker">Medical examination</span><h3 id="examination-heading">Scanner operations</h3></div><span className="operation-status" data-phase={frame.phase}>{ownActive?phaseLabels[machine.phase]:prepared&&!cameraReady?'Preparing view':phaseLabels[frame.phase]}</span></header>
    <div className="subject-context"><strong>{profile?.displayName??crewId}</strong><span>{crewId} / {profile?.role??'Fictional subject'}</span><small>Shared fictional patient asset; not a unique crew likeness.</small></div>
    <label className="operation-field">Examination region<select value={data.region} disabled={moving} onChange={e=>{updateClinical(crewId,{region:e.target.value as BodyRegion,examination:'PATIENT_READY'});if(!moving)scannerRuntime.reset(crewId,e.target.value as BodyRegion)}}>{examinationRegions.map(region=><option key={region}>{region}</option>)}</select></label>
    <div className="examination-primary-actions">
      {!moving&&(!prepared||completed||frame.phase==='cancelled')&&<button className="operation-primary" onClick={prepare}>Prepare examination</button>}
      {!moving&&prepared&&!completed&&frame.phase!=='cancelled'&&<button className="operation-primary" disabled={!cameraReady} onClick={start}>{cameraReady?'Start demonstration scan':'Settling examination view…'}</button>}
      {ownActive&&<button className="operation-secondary" disabled={machine.phase==='cancelling'} onClick={()=>scannerRuntime.cancel()}>Cancel scan and return</button>}
      <button className="operation-reset" disabled={moving} onClick={()=>{scannerRuntime.reset(crewId,data.region);updateClinical(crewId,{examination:'EMPTY_BED'});setNotice('Examination cleared. Prepare the patient to begin again.')}}>Clear examination</button>
    </div>
    <ol className="examination-steps" aria-label="Examination workflow"><li data-current={!prepared&&!moving&&!completed}>Select subject and region</li><li data-current={prepared&&!moving}>Prepare examination</li><li data-current={ownActive}>Run scan and return</li><li data-current={completed}>Review observations</li></ol>
    <p className="operation-description">The complete scanner assembly follows the bed axis, examines the selected region, then returns to its head-end parking position. This demonstrates equipment motion, not medical imaging.</p>
    {(asset.status==='loading'||asset.status==='preparing')&&<p className="operation-note">Preparing patient geometry. Controls remain available while the examination view settles.</p>}
    {asset.status==='failed'&&<p className="operation-feedback" role="status">Patient asset unavailable. <button onClick={retryPatientAsset}>Retry patient asset</button></p>}
    <div className="scan-progress" data-testid="scan-progress" data-phase={frame.phase} data-region={frame.region} data-run={frame.runId}>
      <div><span>{ownActive?phaseLabels[machine.phase]:phaseLabels[frame.phase]}</span><strong>{Math.round(frame.progress*100)}%</strong></div>
      <progress aria-label="Examination progress" max={1} value={frame.progress}/>
      <p role="status" aria-live="polite" aria-atomic="true">{frame.phase==='forward'?'Gantry moving toward the selected feet-end limit.':frame.phase==='backward'?'Gantry returning to its safe head-end position.':frame.phase==='cancelling'?'Cancellation requested. Returning the gantry before releasing the controls.':frame.phase==='complete'?'Demonstration complete. Scanner parked at the starting position.':frame.phase==='cancelled'?`Scan cancelled. Scanner parked. ${frame.error}`:frame.phase==='error'?frame.error:notice||'Choose a region and prepare the examination.'}</p>
    </div>
    {moving&&!ownActive&&<p role="status">Returning the scanner for the previous crew member. A new scan can start when it is parked.</p>}
    <details className="operation-notes"><summary>Simulation and viewing notes</summary><p className="operation-note">No internal anatomy or diagnostic measurements are acquired. Reduced-motion settings keep camera/decorative effects still; starting a scan explicitly runs the requested mechanical motion. Without 3D, the same labelled sequence remains available as an accessible walkthrough.</p></details>
    {completed&&<section className="scan-results" aria-labelledby="scan-results-heading"><h4 id="scan-results-heading">Demonstration observations</h4><dl className="result-context"><div><dt>Subject</dt><dd>{profile?.displayName??crewId} / {crewId}</dd></div><div><dt>Examined region</dt><dd>{frame.region}</dd></div><div><dt>Equipment</dt><dd>Returned to head-end parking / 100%</dd></div></dl>
      {snapshot?.crewId===crewId?<><div className="measurement-grid"><MeasurementTile label="Supplied heart rate" measurement={snapshot.biometrics.heartRate}/><MeasurementTile label="Supplied SpO2" measurement={snapshot.biometrics.oxygenSaturation}/><MeasurementTile label="Bone density change" measurement={snapshot.physical.boneDensityChange}/><MeasurementTile label="Muscle mass change" measurement={snapshot.physical.muscleMassChange}/></div><p>These are the existing {snapshot.source==='external'?'backend-supplied simulation':'offline fixture'} observations. The scan did not create them. Regional/internal imaging is unavailable.</p></>:<p>Medical observations are unavailable for this context.</p>}
      <button className="operation-secondary" onClick={()=>window.dispatchEvent(new Event('orbital:overview'))}>Return to overview</button>
    </section>}
  </section>
}
