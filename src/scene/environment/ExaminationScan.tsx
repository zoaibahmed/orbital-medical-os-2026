import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { DoubleSide, type Mesh } from 'three'
import { useClinical } from '../../state/clinical'
import { scannerRuntime } from '../../state/scanner'
import { scannerTravel } from './scannerMeasurements'
import { isScanMoving } from '../../features/physical/scanTimeline'

/** The light sheet follows the authoritative physical gantry frame. */
export function ExaminationScan({crewId,reduced}:{crewId:string;reduced:boolean}){
  const {gl,invalidate}=useThree(),state=useClinical(crewId),plane=useRef<Mesh>(null)
  useEffect(()=>{gl.domElement.dataset.examinationState=state.examination;gl.domElement.dataset.patientRegion=state.region;invalidate()},[gl,invalidate,state.examination,state.region])
  useFrame(()=>{
    if(!plane.current)return
    const frame=scannerRuntime.current()
    plane.current.visible=!!frame&&isScanMoving(frame.phase)&&frame.phase!=='cancelling'
    plane.current.position.z=scannerTravel.apertureZ+(frame?.offset??0)
    gl.domElement.dataset.scanSheetZ=plane.current.position.z.toFixed(6)
    gl.domElement.dataset.scanEffects=reduced?'reduced':'subtle'
  })
  return <mesh layers-mask={2} name="examination-light-sheet" ref={plane} position={[-.4,1,scannerTravel.apertureZ]} visible={false} raycast={()=>{}}>
    <circleGeometry args={[.745*scannerTravel.clearanceScale,48,0,Math.PI]}/><meshBasicMaterial color="#94d2c1" transparent opacity={.055} depthWrite={false} toneMapped={false} side={DoubleSide}/>
  </mesh>
}
