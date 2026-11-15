import { use, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { getPatientResource, setPatientPreparation } from '../assets/patient'
import { clone } from 'three/addons/utils/SkeletonUtils.js'
import { Mesh, MeshStandardMaterial } from 'three'
import type { BodyRegion, ExaminationState } from '../../domain/frontend'
import { updateClinical } from '../../state/clinical'

/** CC0 MakeHuman exterior avatar, authored in measured bed coordinates.
 * Generic fictional patient, not clinical internal anatomy or a crew likeness. */
export function PatientAsset({state,reduced,crewId}:{state:ExaminationState;reduced:boolean;crewId:string}){
 const {gl,invalidate,camera,scene:world}=useThree(),gltf=use(getPatientResource()),[gpuReady,setGpuReady]=useState(false)
 const resource=useMemo(()=>{
  const scene=clone(gltf.scene),materials:MeshStandardMaterial[]=[],morphs:Mesh[]=[]
  scene.name='licensed-examination-patient';scene.visible=false
  scene.traverse(o=>{o.layers.set(1);if(!(o instanceof Mesh))return;o.castShadow=true;o.receiveShadow=true
   if(o.material instanceof MeshStandardMaterial){o.material=o.material.clone();o.material.alphaHash=true;materials.push(o.material)}
   if(o.morphTargetDictionary?.Respiration!==undefined)morphs.push(o)
  })
  return {scene,materials,morphs}
 },[gltf.scene])
 // Initial reveal is masked by scene preparation, so the first ready frame
 // contains the fully opaque subject. Later explicit clear/prepare still fades.
 const fade=useRef(1),visible=state!=='EMPTY_BED'&&gpuReady
 useEffect(()=>{
  let cancelled=false;setPatientPreparation('preparing');gl.domElement.dataset.patientPreparation='compiling'
  // The real trace found synchronous first-use program queries. Compile this
  // skinned/morphed object against the existing room lights before revealing it.
  void gl.compileAsync(resource.scene,camera,world).then(()=>{if(!cancelled){setGpuReady(true);setPatientPreparation('ready');gl.domElement.dataset.patientPreparation='ready';gl.shadowMap.needsUpdate=true;invalidate()}}).catch(()=>{if(!cancelled){setPatientPreparation('failed');gl.domElement.dataset.patientPreparation='failed'}})
  return()=>{cancelled=true}
 },[resource,gl,camera,world,invalidate])
 useEffect(()=>{gl.domElement.dataset.patientAsset='CC0-MakeHuman';gl.domElement.dataset.patientCrew=crewId;gl.domElement.dataset.patientState=state;gl.shadowMap.needsUpdate=true;invalidate()},[crewId,state,gl,invalidate])
 useEffect(()=>{const wake=()=>invalidate();document.addEventListener('visibilitychange',wake);return()=>document.removeEventListener('visibilitychange',wake)},[invalidate])
 useEffect(()=>()=>{resource.materials.forEach(m=>m.dispose());resource.scene.traverse(o=>{if('skeleton' in o)(o as import('three').SkinnedMesh).skeleton.dispose()})},[resource])
 useFrame(({clock},delta)=>{
  if(!gpuReady){resource.scene.visible=false;gl.domElement.dataset.patientVisible='false';return}
  const target=visible?1:0
  const previous=fade.current
  fade.current=reduced?target:target>fade.current?Math.min(target,fade.current+delta/.65):Math.max(target,fade.current-delta/.65)
  if(previous!==target&&fade.current===target)gl.shadowMap.needsUpdate=true
  resource.scene.visible=fade.current>0
  resource.materials.forEach(m=>{m.opacity=fade.current})
  const breathing=visible&&!reduced&&document.visibilityState==='visible'
  const expansion=breathing?(1-Math.cos(clock.elapsedTime*Math.PI*2/5))*.5:0
  resource.morphs.forEach(m=>{m.morphTargetInfluences![m.morphTargetDictionary!.Respiration!]=expansion})
  gl.domElement.dataset.breathing=reduced?'reduced':breathing?'active':'standby'
  gl.domElement.dataset.chestExpansion=expansion.toFixed(4)
  gl.domElement.dataset.patientVisible=String(resource.scene.visible)
  gl.domElement.dataset.patientOpacity=fade.current.toFixed(4)
  if(breathing||Math.abs(target-fade.current)>.001)invalidate()
 })
 function pick(e:ThreeEvent<MouseEvent>){
  if(!visible||e.delta>5)return;e.stopPropagation()
  const p=e.point
  const region:BodyRegion=p.z<-.93?'Head and eyes':Math.abs(p.x+.4)>.19?'Upper limbs':p.z<-.42?'Chest':p.z<.08?'Spine':'Lower limbs'
  updateClinical(crewId,{region})
 }
 return <group name="patient-animation" onClick={pick}><primitive object={resource.scene} dispose={null}/></group>
}
