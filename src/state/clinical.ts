import { useSyncExternalStore } from 'react'
import type { ClinicalSession } from '../domain/frontend'
const sessions=new Map<string,ClinicalSession>(), listeners=new Set<()=>void>()
const empty=():ClinicalSession=>({examination:'PATIENT_READY',scanStartedAt:null,region:'Spine',exercises:[],answers:{},checkIns:[],messages:[],sleepRecords:[]})
export function clinicalSession(crew:string){if(!sessions.has(crew))sessions.set(crew,empty());return sessions.get(crew)!}
export function updateClinical(crew:string,patch:Partial<ClinicalSession>){const previous=clinicalSession(crew),next={...previous,...patch};if(patch.examination&&patch.examination!==previous.examination)next.scanStartedAt=patch.examination==='SCAN_ACTIVE'?performance.now():null;sessions.set(crew,next);listeners.forEach(fn=>fn())}
export function useClinical(crew:string){return useSyncExternalStore(fn=>{listeners.add(fn);return()=>{listeners.delete(fn)}},()=>clinicalSession(crew))}
