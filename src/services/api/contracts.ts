import type { CrewSnapshot } from '../../domain/contracts'
import type { HeartRateSample } from '../../features/vitals/components/HeartRateTrend'

export type SimulationMode = 'NOMINAL' | 'EVA_ACTIVE' | 'HYPOXIA_EVENT' | 'SOLAR_FLARE' | 'EMERGENCY_INJURY'
export interface ApiExercise { id: string; timestamp: string; type: 'ARED'|'T2_TREADMILL'|'CYCLE'; durationMin: number; intensityPercent: number; date: string; completed: boolean }
export interface ApiCheckIn { id: string; timestamp: string; moodScore: number; stressScore: number; notes: string }
export interface ApiSleep { id: string; timestamp: string; start: string; end: string; hoursSlept: number; sleepScore: number }
export interface DiagnosticFinding { system: string; severity: string; code: string; observation: string }
export interface ApiDiagnostics { timestamp: string; threatLevel: string; summary: string; findingsCount: number; findings: readonly DiagnosticFinding[]; requiresImmediateIntervention: boolean }
export interface ApiEmergency { isActive: boolean; type: string|null; timestamp: string|null }
export interface CrewApiState {
  schemaVersion: 1; crewId: string; simulation: true; reviewStatus: 'draft'; mode: SimulationMode
  snapshot: CrewSnapshot; heartRateHistory: readonly HeartRateSample[]
  radiationHistory: readonly { measuredAt: string; doseRate: number|null; cumulativeDose: number|null; neutronDoseRate: number|null }[]
  records: { exercises: readonly ApiExercise[]; checkIns: readonly ApiCheckIn[]; sleep: readonly ApiSleep[]; sans: readonly unknown[] }
  diagnostics: ApiDiagnostics; emergency: ApiEmergency; limitations: readonly string[]
}
