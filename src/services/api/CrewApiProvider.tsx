import { useEffect, useMemo, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { crew } from '../../data/fixtures'
import { createCrewConnection } from './connection'
import { CrewApiContext } from './context'

/** URL is the only selected-crew owner. Telemetry stays in an external store. */
export function CrewApiProvider({children}:{children:ReactNode}){
  const [search]=useSearchParams(),requested=search.get('crew')??crew[0]!.id
  const crewId=crew.some(row=>row.id===requested)?requested:crew[0]!.id
  const connection=useMemo(()=>createCrewConnection(crewId),[crewId])
  useEffect(()=>connection.start(),[connection])
  return <CrewApiContext value={connection}>{children}</CrewApiContext>
}
