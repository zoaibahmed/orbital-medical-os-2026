/** Frontend display contracts. Values and severity are supplied, never diagnosed here. */
export type CrewId = string
export type ISODateTime = string
export type DataSource = 'simulated-fixture' | 'external'
export type DataQuality = 'valid' | 'missing' | 'stale' | 'invalid'
export type Severity = 'nominal' | 'attention' | 'critical' | 'unknown'

export interface AstronautProfile {
  id: CrewId
  displayName: string
  role: string
  callSign: string
  fictional: boolean
}
export interface CrewSelection { crewId: CrewId }
export interface Measurement<Unit extends string = string> {
  id: string
  value: number | null
  unit: Unit
  measuredAt: ISODateTime
  quality: DataQuality
  severity: Severity
  source: DataSource
}
export interface BiometricMeasurements {
  heartRate: Measurement<'bpm'>
  systolicPressure: Measurement<'mmHg'>
  diastolicPressure: Measurement<'mmHg'>
  oxygenSaturation: Measurement<'%'>
  heartRateVariability: Measurement<'ms'>
}
export interface RadiationMeasurements {
  doseRate: Measurement<'µSv/h'>
  cumulativeDose: Measurement<'mSv'>
  periodStart: ISODateTime
  environment: 'GCR-demo' | 'SPE-demo' | 'unavailable'
}
export interface SleepRecord {
  id: string
  crewId: CrewId
  start: ISODateTime
  end: ISODateTime
  duration: Measurement<'h'>
  suppliedScore: number | null
}
export interface PhysicalAssessment {
  id: string
  crewId: CrewId
  recordedAt: ISODateTime
  questionnaireVersion: string
  symptoms: ReadonlyArray<{ questionId: string; answer: boolean | null }>
  boneDensityChange: Measurement<'%'>
  muscleMassChange: Measurement<'%'>
  exerciseMinutes: number | null
}
export interface PsychologicalWellbeing {
  id: string
  crewId: CrewId
  recordedAt: ISODateTime
  mood: number | null
  stress: number | null
  scale: { min: number; max: number }
  note: string
}
export interface DiagnosticMessage {
  id: string
  crewId: CrewId
  generatedAt: ISODateTime
  source: DataSource
  kind: 'scripted-demo' | 'supplied-result'
  summary: string
  evidenceIds: readonly string[]
  contentVersion: string
}
export interface ProtocolContent {
  id: string
  version: string
  title: string
  reviewStatus: 'draft' | 'domain-approved'
  simulationOnly: boolean
  steps: ReadonlyArray<{ id: string; text: string }>
  references: readonly string[]
}
export interface EmergencyStatus {
  state: 'inactive' | 'demo-active'
  protocolId: string | null
  acknowledgedStepIds: readonly string[]
}
export interface CrewSnapshot {
  schemaVersion: 1
  crewId: CrewId
  scenarioId: string
  capturedAt: ISODateTime
  source: DataSource
  biometrics: BiometricMeasurements
  radiation: RadiationMeasurements
  sleep: SleepRecord
  physical: PhysicalAssessment
  wellbeing: PsychologicalWellbeing
  diagnostic: DiagnosticMessage
}
