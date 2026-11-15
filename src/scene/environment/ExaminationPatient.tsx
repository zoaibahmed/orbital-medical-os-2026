import { Suspense } from 'react'
import { useThree } from '@react-three/fiber'
import { useClinical } from '../../state/clinical'
import { ErrorBoundary } from '../../ui/ErrorBoundary'
import { PatientAsset } from './PatientAsset'
import { usePatientAssetStatus } from '../assets/patient'

/** Separate boundary: patient decoding must never blank or remount the room. */
export function ExaminationPatient({crewId,reduced}:{crewId:string;reduced:boolean}){
 const data=useClinical(crewId),{gl}=useThree()
 const asset=usePatientAssetStatus()
 return <ErrorBoundary key={asset.attempt} fallback={<group/>} onError={()=>{gl.domElement.dataset.patientState='asset-error'}}><Suspense fallback={null}><PatientAsset crewId={crewId} state={data.examination} reduced={reduced}/></Suspense></ErrorBoundary>
}
