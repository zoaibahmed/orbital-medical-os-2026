import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useCrewApi } from './context'

/** No optimistic success or automatic POST retry. A crew switch cancels the UI request. */
export function useApiAction(){
  const connection=useCrewApi(),state=useSyncExternalStore(connection.subscribe,connection.getSnapshot)
  const [feedback,setFeedback]=useState({crewId:connection.crewId,pending:false,notice:''})
  const pending=feedback.crewId===connection.crewId&&feedback.pending
  const notice=feedback.crewId===connection.crewId?feedback.notice:''
  const setNotice=(value:string)=>setFeedback(previous=>({crewId:connection.crewId,pending:previous.crewId===connection.crewId&&previous.pending,notice:value}))
  const controller=useRef<AbortController|null>(null)
  useEffect(()=>()=>{controller.current?.abort();controller.current=null},[connection])
  async function run(path:string,body:unknown,success:string,method:'POST'|'PATCH'='POST'){
    if(controller.current)return null
    const active=new AbortController();controller.current=active;setFeedback({crewId:connection.crewId,pending:true,notice:'Saving to demo backend…'})
    try{
      const result=await connection.command(path,body,method,active.signal)
      if(!active.signal.aborted)setNotice(success)
      return result
    }catch(error){
      if(!active.signal.aborted)setNotice(`${error instanceof Error?error.message:'Request failed'}. Save was not confirmed; inspect records before retrying.`)
      return null
    }finally{if(!active.signal.aborted){controller.current=null;setFeedback(previous=>({...previous,pending:false}))}}
  }
  return {connection,state,connected:state.status==='connected',remote:state.data,pending,notice,setNotice,run}
}
