import { createContext, useContext } from 'react'
import type { CrewConnection } from './connection'
export const CrewApiContext=createContext<CrewConnection|null>(null)
export function useCrewApi(){
  const connection=useContext(CrewApiContext)
  if(!connection)throw new Error('CrewApiProvider is required')
  return connection
}
