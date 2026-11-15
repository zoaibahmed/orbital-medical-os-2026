import { loadModel } from './loadModel'
import type { ModelAsset } from './registry'
import metadata from './patient-manifest.json'
import { useSyncExternalStore } from 'react'
let cached:ReturnType<typeof loadModel>|undefined
let state={status:'idle' as 'idle'|'loading'|'preparing'|'ready'|'failed',attempt:0}
const listeners=new Set<()=>void>()
function publish(status:typeof state.status){state={...state,status};listeners.forEach(fn=>fn())}
export function setPatientPreparation(status:'preparing'|'ready'|'failed'){publish(status)}
export function usePatientAssetStatus(){return useSyncExternalStore(fn=>{listeners.add(fn);return()=>{listeners.delete(fn)}},()=>state)}
export function retryPatientAsset(){if(state.status!=='failed')return;cached=undefined;state={status:'idle',attempt:state.attempt+1};listeners.forEach(fn=>fn())}
/** Reuse the environment's local loader pipeline and one retained promise. */
export function getPatientResource(){
 if(!cached){queueMicrotask(()=>publish('loading'));cached=loadModel(metadata as ModelAsset).then(model=>{publish('preparing');return model}).catch(error=>{publish('failed');throw error})}
 return cached
}
