import { requestApi } from './client'
import { parseCrewState } from './validate'
import type { CrewApiState } from './contracts'

export interface ConnectionState { status: 'connecting'|'connected'|'offline'; data: CrewApiState|null; error: string; lastSuccess: string|null }
export interface CrewConnection {
  crewId: string
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => ConnectionState
  start: () => () => void
  refresh: () => void
  command: (path: string, body: unknown, method?: 'POST'|'PATCH', signal?: AbortSignal) => Promise<unknown>
}

/** One polling owner per selected crew. A generation guard discards late responses. */
export function createCrewConnection(crewId: string): CrewConnection {
  let state: ConnectionState={status:'connecting',data:null,error:'',lastSuccess:null}
  const listeners=new Set<()=>void>()
  let timer: ReturnType<typeof setTimeout>|undefined, controller: AbortController|null=null, running=false, generation=0, failures=0
  const publish=(next:ConnectionState)=>{state=next;listeners.forEach(listener=>listener())}
  const clear=()=>{if(timer)clearTimeout(timer);timer=undefined}
  const visible=()=>document.visibilityState!=='hidden'
  async function poll(){
    clear()
    if(!running||!visible())return
    controller?.abort();controller=new AbortController()
    const current=++generation,signal=controller.signal
    try{
      const result=parseCrewState(await requestApi(`/crew/${encodeURIComponent(crewId)}/state`,{signal}),crewId)
      if(!running||current!==generation)return
      failures=0;publish({status:'connected',data:result,error:'',lastSuccess:new Date().toISOString()})
    }catch(error){
      if(!running||current!==generation||signal.aborted)return
      failures++;publish({status:'offline',data:null,error:error instanceof Error?error.message:'Demo service unavailable',lastSuccess:state.lastSuccess})
    }finally{
      if(running&&current===generation&&visible())timer=setTimeout(()=>void poll(),Math.min(10000,2000*2**Math.min(failures,3)))
    }
  }
  function visibility(){
    if(document.visibilityState==='hidden'){clear();generation++;controller?.abort()}
    else void poll()
  }
  return {
    crewId,subscribe:listener=>{listeners.add(listener);return()=>{listeners.delete(listener)}},getSnapshot:()=>state,
    start:()=>{
      running=true;document.addEventListener('visibilitychange',visibility);void poll()
      return()=>{running=false;generation++;clear();controller?.abort();document.removeEventListener('visibilitychange',visibility)}
    },
    refresh:()=>{if(running)void poll()},
    command:async(path,body,method='POST',signal)=>{
      const result=await requestApi(`${path}${path.includes('?')?'&':'?'}crewId=${encodeURIComponent(crewId)}`,{method,body,signal})
      if(!result||typeof result!=='object'||!('crewId' in result)||result.crewId!==crewId||!('simulation' in result)||result.simulation!==true||!('data' in result))throw new Error('Mismatched API command response')
      if(running)await poll()
      return result.data
    },
  }
}
