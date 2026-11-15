import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { Mesh } from 'three'
import { useClinical } from '../../state/clinical'
/** Fixed scanner optics sweep an illustrative light sheet. No moving gantry,
 * spinning rings, internal anatomy or medical acquisition is implied. */
export function ExaminationScan({crewId,reduced}:{crewId:string;reduced:boolean}){
 const {gl,invalidate}=useThree()
 const state=useClinical(crewId),plane=useRef<Mesh>(null)
 useEffect(()=>{gl.domElement.dataset.examinationState=state.examination;gl.domElement.dataset.patientRegion=state.region;invalidate()},[gl,invalidate,state.examination,state.region])
 useFrame(({invalidate})=>{if(state.examination!=='SCAN_ACTIVE'||!plane.current)return;const progress=Math.max(0,Math.min(1,(performance.now()-(state.scanStartedAt??performance.now()))/5000));plane.current.position.z=reduced?-.5:-1.15+progress*1.77;gl.domElement.dataset.scanProgress=progress.toFixed(4);if(!reduced)invalidate()})
 return state.examination==='SCAN_ACTIVE'?<mesh layers-mask={2} name="examination-light-sheet" ref={plane} position={[-.4,1.39,-1.15]} raycast={()=>{}}><planeGeometry args={[.67,.49]}/><meshBasicMaterial color="#94d2c1" transparent opacity={.14} depthWrite={false} toneMapped={false}/></mesh>:null
}
