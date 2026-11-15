import { useState, type ReactNode } from 'react'
import { SessionContext } from './session'

export function SessionProvider({ children }: { children: ReactNode }) {
  const [emergencyOpen, setEmergencyOpen] = useState(false)
  const [motionReduced, setMotionReduced] = useState(false)
  return <SessionContext value={{ emergencyOpen, setEmergencyOpen, motionReduced, setMotionReduced }}>{children}</SessionContext>
}
