import { lazy, Suspense, useSyncExternalStore } from 'react'
import type { MonitoringFeed } from '../vitals/monitoring'
import type { StationId } from '../../app/navigation'
import { useCrewApi } from '../../services/api/context'
import { ConnectionStatus } from '../../services/api/ConnectionStatus'
const Radiation=lazy(()=>import('../radiation/RadiationConsole').then(m=>({default:m.RadiationConsole})))
const Physical=lazy(()=>import('../physical/PhysicalConsole').then(m=>({default:m.PhysicalConsole})))
const Wellbeing=lazy(()=>import('../wellbeing/WellbeingConsole').then(m=>({default:m.WellbeingConsole})))
const Assistant=lazy(()=>import('../diagnostics/AssistantConsole').then(m=>({default:m.AssistantConsole})))
export function ModulePreview({station,feed}:{station:StationId;feed:MonitoringFeed}){
 const {snapshot}=useSyncExternalStore(feed.subscribe,feed.getSnapshot)
 const connection=useCrewApi()
 const View=station==='radiation'?Radiation:station==='physical'?Physical:station==='wellbeing'?Wellbeing:Assistant
 return <><ConnectionStatus connection={connection}/><Suspense fallback={<p role="status">Opening medical instrument…</p>}><View snapshot={snapshot}/></Suspense></>
}
