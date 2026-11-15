import type { BodyRegion } from '../../domain/frontend'
import { scannerTravel } from '../../scene/environment/scannerMeasurements'

export type ScanPhase='ready'|'preparing'|'forward'|'backward'|'complete'|'cancelling'|'cancelled'|'error'
export interface ScanFrame {
  crewId:string;region:BodyRegion;phase:ScanPhase;offset:number;progress:number;elapsed:number;duration:number;runId:number;error:string
}
// Longitudinal ranges follow the actual posed MakeHuman joints: head/neck,
// spine01–05, upper-arm roots, pelvis and foot joints. They are display targets,
// not anatomical measurements or diagnostic regions.
export const scanRegions:Record<BodyRegion,readonly[number,number]>={
  'Full body':[scannerTravel.apertureZ,scannerTravel.feetZ+.02],
  'Head and eyes':[scannerTravel.headZ,-.945],
  Chest:[-.842,-.446],Spine:[-.842,-.326],
  'Upper limbs':[-.801,-.16],'Lower limbs':[-.301,scannerTravel.feetZ+.02],
  'Muscle groups':[-.801,.539],
}
const smooth=(t:number)=>{const v=Math.max(0,Math.min(1,t));return v*v*v*(v*(v*6-15)+10)}
export interface ScanPlan { approach:number;forward:number;backward:number;settle:number;start:number;end:number;duration:number }
export function planScan(region:BodyRegion):ScanPlan{
  const [a,b]=scanRegions[region],start=Math.max(0,a-scannerTravel.apertureZ),end=Math.min(scannerTravel.endZ,b-scannerTravel.apertureZ)
  const approach=.65+(start>0?Math.max(1.2,start/.38):0)
  const forward=Math.max(1.8,(end-start)/.32),backward=Math.max(1.8,end/.40),settle=.35
  return {approach,forward,backward,settle,start,end,duration:approach+forward+backward+settle}
}
export function sampleScan(plan:ScanPlan,elapsed:number):{offset:number;progress:number;phase:ScanPhase}{
  const t=Math.max(0,Math.min(plan.duration,elapsed))
  if(t<plan.approach)return {offset:plan.start*smooth(Math.max(0,t-.65)/Math.max(.001,plan.approach-.65)),progress:t/plan.duration,phase:'preparing'}
  if(t<plan.approach+plan.forward)return {offset:plan.start+(plan.end-plan.start)*smooth((t-plan.approach)/plan.forward),progress:t/plan.duration,phase:'forward'}
  if(t<plan.approach+plan.forward+plan.backward)return {offset:plan.end*(1-smooth((t-plan.approach-plan.forward)/plan.backward)),progress:t/plan.duration,phase:'backward'}
  return {offset:0,progress:t/plan.duration,phase:t>=plan.duration?'complete':'backward'}
}
export const isScanMoving=(phase:ScanPhase)=>['preparing','forward','backward','cancelling'].includes(phase)
export { smooth as smoothScanMotion }
