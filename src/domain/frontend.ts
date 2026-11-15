import type { CrewSnapshot, ProtocolContent, SleepRecord } from './contracts'
export type ExaminationState='EMPTY_BED'|'PATIENT_READY'|'EXAMINATION_ACTIVE'|'SCAN_ACTIVE'|'EXAMINATION_COMPLETE'
export type BodyRegion='Full body'|'Head and eyes'|'Chest'|'Spine'|'Upper limbs'|'Lower limbs'|'Muscle groups'
export interface ExerciseEntry { id:string; type:string; minutes:number; date:string; completed:boolean }
export interface CheckIn { id:string; mood:number; stress:number; note:string; date:string }
export interface AssistantRequest { crewId:string; snapshot:CrewSnapshot; region:BodyRegion; message:string; alerts:readonly string[] }
export interface AssistantMessage { role:'user'|'assistant'; text:string }
export interface ClinicalSession { examination:ExaminationState; scanStartedAt:number|null; region:BodyRegion; exercises:readonly ExerciseEntry[]; answers:Readonly<Record<string,string>>; checkIns:readonly CheckIn[]; messages:readonly AssistantMessage[]; sleepRecords:readonly SleepRecord[] }
export interface RadiationHistory { day:number; doseRate:number; cumulativeDose:number; neutronCount:number }
export interface RadiationScenario { id:'GCR'|'SPE'; status:'Nominal demonstration'|'Elevated demonstration'; history:readonly RadiationHistory[] }
export interface ReviewedProtocol extends ProtocolContent { incident:string }
