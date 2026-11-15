import { useSyncExternalStore } from 'react'
import type { BodyRegion } from '../domain/frontend'
import { updateClinical } from './clinical'
import { isScanMoving, planScan, sampleScan, smoothScanMotion, type ScanFrame, type ScanPlan } from '../features/physical/scanTimeline'

type Presenter=(frame:ScanFrame)=>void
const ready=(crewId:string,region:BodyRegion):ScanFrame=>({crewId,region,phase:'ready',offset:0,progress:0,elapsed:0,duration:0,runId:0,error:''})

/** One authoritative mechanical timeline. The same frame is applied to the
 * physical group before its progress/completion is published to DOM subscribers. */
export function createScannerRuntime(onComplete:(crewId:string,cancelled:boolean)=>void=()=>{}){
  const records=new Map<string,ScanFrame>(),listeners=new Set<()=>void>()
  let active:ScanFrame|null=null,published:ScanFrame|null=null,plan:ScanPlan|null=null,cancelFrom=0,cancelTime=0,presenter:Presenter|null=null,lastNotice=0,sequence=0,noticeTime=0,cameraReady=true
  const publish=(frame:ScanFrame)=>{published={...frame};records.set(frame.crewId,published);listeners.forEach(fn=>fn())}
  return {
    subscribe:(listener:()=>void)=>{listeners.add(listener);return()=>{listeners.delete(listener)}},
    getSnapshot:(crewId:string)=>{if(!records.has(crewId))records.set(crewId,ready(crewId,'Full body'));return records.get(crewId)!},
    current:()=>active,
    getMachineSnapshot:()=>published,
    cameraReady:()=>cameraReady,
    setCameraReady(value:boolean){if(cameraReady!==value){cameraReady=value;listeners.forEach(fn=>fn())}},
    attach:(callback:Presenter)=>{presenter=callback;if(active)callback(active);return()=>{if(presenter===callback)presenter=null}},
    start(crewId:string,region:BodyRegion){
      if(active&&isScanMoving(active.phase))return false
      plan=planScan(region);cancelTime=0;lastNotice=-1;noticeTime=0
      active={...ready(crewId,region),phase:'preparing',duration:plan.duration,runId:++sequence}
      presenter?.(active);publish(active);return true
    },
    cancel(reason='Cancelled by operator'){
      if(!active||!isScanMoving(active.phase)||active.phase==='cancelling')return
      cancelFrom=active.offset;cancelTime=0
      active={...active,phase:'cancelling',error:reason};presenter?.(active);publish(active)
    },
    advance(delta:number){
      if(!active||!plan||!isScanMoving(active.phase))return
      // Bound catch-up after a long frame; hidden documents do not call advance.
      const dt=Math.max(0,Math.min(delta,.08))
      const previousPhase=active.phase;noticeTime+=dt
      if(active.phase==='cancelling'){
        const duration=Math.max(.65,cancelFrom/.6);cancelTime+=dt
        active={...active,offset:cancelFrom*(1-smoothScanMotion(cancelTime/duration)),phase:cancelTime>=duration?'cancelled':'cancelling'}
      }else{
        const elapsed=Math.min(plan.duration,active.elapsed+dt)
        active={...active,elapsed,...sampleScan(plan,elapsed)}
      }
      try{presenter?.(active)}catch(error){active={...active,phase:'error',offset:0,error:error instanceof Error?error.message:'Scanner mechanism unavailable'};try{presenter?.(active)}catch{/* Keep the rest of the bay usable. */}}
      const finished=!isScanMoving(active.phase)
      if(finished||noticeTime-lastNotice>=.1||active.phase!==previousPhase){publish(active);lastNotice=noticeTime}
      if(finished)onComplete(active.crewId,active.phase!=='complete')
    },
    reset(crewId:string,region:BodyRegion){
      if(active&&isScanMoving(active.phase))return false
      const frame=ready(crewId,region);active=frame;presenter?.(frame);publish(frame);return true
    },
    dispose(){if(active&&isScanMoving(active.phase)){active={...active,offset:0,phase:'cancelled'};presenter?.(active);publish(active);onComplete(active.crewId,true)}},
  }
}

export const scannerRuntime=createScannerRuntime((crewId,cancelled)=>updateClinical(crewId,{examination:cancelled?'EXAMINATION_ACTIVE':'EXAMINATION_COMPLETE'}))
export function useScanner(crewId:string){return useSyncExternalStore(scannerRuntime.subscribe,()=>scannerRuntime.getSnapshot(crewId))}
export function useScannerCamera(){return useSyncExternalStore(scannerRuntime.subscribe,scannerRuntime.cameraReady)}
export function useScannerMachine(){return useSyncExternalStore(scannerRuntime.subscribe,scannerRuntime.getMachineSnapshot)}
