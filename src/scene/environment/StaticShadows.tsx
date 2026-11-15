import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
/** All casters/lights are static. Camera movement and emissive checks reuse the shadow map. */
export function StaticShadows() {
 const {gl,invalidate}=useThree()
 useEffect(()=>{
  const previous=gl.shadowMap.autoUpdate
  gl.shadowMap.autoUpdate=false;gl.shadowMap.needsUpdate=true
  gl.domElement.dataset.shadowPolicy='static-casters'
  invalidate()
  return()=>{gl.shadowMap.autoUpdate=previous}
 },[gl,invalidate])
 return null
}
