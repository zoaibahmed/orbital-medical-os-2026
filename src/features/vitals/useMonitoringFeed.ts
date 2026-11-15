import { useEffect, useMemo } from 'react'
import type { CrewSnapshot } from '../../domain/contracts'
import { createMonitoringFeed } from './monitoring'
import type { CrewConnection } from '../../services/api/connection'

/** One lifecycle per selected crew. The store notifies its subscribers, not the scene host. */
export function useMonitoringFeed(snapshot: CrewSnapshot, active: boolean, connection?: CrewConnection) {
  const feed=useMemo(()=>createMonitoringFeed(snapshot),[snapshot])
  useEffect(()=>{
    if(!connection)return
    const sync=()=>{
      const state=connection.getSnapshot()
      feed.supply(state.status==='connected'&&state.data?state.data.snapshot:snapshot,state.data?.heartRateHistory,state.data?.emergency.isActive)
    }
    sync();return connection.subscribe(sync)
  },[feed,snapshot,connection])
  useEffect(()=>{
    const sync=()=>feed.activate(active&&document.visibilityState==='visible')
    sync()
    const interval=window.setInterval(()=>feed.advance(),4000)
    document.addEventListener('visibilitychange',sync)
    return()=>{clearInterval(interval);document.removeEventListener('visibilitychange',sync);feed.activate(false)}
  },[feed,active])
  return feed
}
