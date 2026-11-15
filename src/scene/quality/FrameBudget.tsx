import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { StationaryRoomCache } from './StationaryRoomCache'
import { Raycaster, Vector2 } from 'three'

/** Bound full-room navigation submission on constrained adapters, while live
 * stationary monitoring uses the lightweight cache at display cadence. */
export function FrameBudget({ limited }: { limited: boolean }) {
  const {gl,scene,camera}=useThree()
  const cache=useMemo(()=>new StationaryRoomCache(),[])
  const last=useRef(0)
  const presented=useRef(0)
  useEffect(()=>{if(limited)void cache.prepare(gl).catch(()=>{/* Ordinary full rendering remains available. */})},[cache,gl,limited])
  useEffect(()=>()=>cache.dispose(),[cache])
  useEffect(()=>{
    const probe=window.__orbitalProbe;if(!probe)return
    probe.checkComposite=()=>{
      // Isolated numeric pixel assertions, no image buffer, screenshot or artifact.
      const context=gl.getContext(),mask=camera.layers.mask,pixel=new Uint8Array(4)
      const sample=()=>{const values:number[]=[];for(let y=1;y<6;y++)for(let x=1;x<8;x++){context.readPixels(Math.floor(gl.domElement.width*x/8),Math.floor(gl.domElement.height*y/6),1,1,context.RGBA,context.UNSIGNED_BYTE,pixel);values.push(...pixel.slice(0,3))}return values}
      camera.layers.enable(1);gl.domElement.dataset.renderPass='validation';gl.render(scene,camera);camera.layers.mask=mask;const reference=sample();cache.render(gl,scene,camera);const cached=sample(),delta=cached.map((v,i)=>Math.abs(v-reference[i]!))
      const worst=Math.floor(delta.indexOf(Math.max(...delta))/3),x=(worst%7+1)/8,y=(Math.floor(worst/7)+1)/6,ray=new Raycaster();ray.setFromCamera(new Vector2(x*2-1,y*2-1),camera)
      return {samples:35,meanChannelError:delta.reduce((a,b)=>a+b,0)/delta.length,maxChannelError:Math.max(...delta),worstSurface:ray.intersectObjects(scene.children,true)[0]?.object.name??'background'}
    }
    return()=>{probe.checkComposite=undefined}
  },[gl,scene,camera,cache])
  useFrame(({gl,scene,camera,invalidate}) => {
    const stationary=gl.domElement.dataset.cameraTransition==='settled'
    const now=performance.now()
    if(limited&&!stationary&&now-last.current<1000/25-1){invalidate();return}
    const ratio=gl.getPixelRatio()
    gl.setViewport(0,0,gl.domElement.width/ratio,gl.domElement.height/ratio)
    const eligible=limited&&stationary&&gl.extensions.has('EXT_color_buffer_float')
    if(eligible)cache.render(gl,scene,camera)
    else{gl.domElement.dataset.renderPass='present';const mask=camera.layers.mask;camera.layers.enable(1);gl.render(scene,camera);camera.layers.mask=mask}
    gl.domElement.dataset.roomCache=eligible?'active':'bypass'
    last.current=now
    gl.domElement.dataset.presentedFrames=String(++presented.current)
    gl.domElement.dataset.frameBudget=limited?(stationary?'display-cache':'25-navigation'):'display'
    gl.domElement.dataset.navigationBudget=limited?'25':'display'
  },1)
  return null
}
