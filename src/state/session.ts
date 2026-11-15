import { createContext, useContext } from 'react'

interface SessionState {
  emergencyOpen: boolean
  setEmergencyOpen: (open: boolean) => void
  motionReduced: boolean
  setMotionReduced: (reduced: boolean) => void
}
export const SessionContext = createContext<SessionState | null>(null)
export function useSession(): SessionState {
  const session = useContext(SessionContext)
  if (!session) throw new Error('SessionProvider is required')
  return session
}
