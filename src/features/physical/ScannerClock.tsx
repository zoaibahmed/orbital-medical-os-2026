import { useEffect } from 'react'
import type { BodyRegion } from '../../domain/frontend'
import { scannerRuntime } from '../../state/scanner'
import { isScanMoving } from './scanTimeline'

/** One clock for physical and accessible operation. Closing a panel does not
 * destroy equipment; crew/region changes request a controlled return. */
export function ScannerClock({crewId,region}:{crewId:string;region:BodyRegion}){
  useEffect(()=>{
    const frame=scannerRuntime.current()
    if(frame&&isScanMoving(frame.phase)&&(frame.crewId!==crewId||frame.region!==region))scannerRuntime.cancel('Crew or examination region changed')
  },[crewId,region])
  useEffect(()=>{
    let raf=0,last=0,stepping=false
    const tick=(now:number)=>{
      raf=0
      stepping=true
      if(document.visibilityState!=='hidden')scannerRuntime.advance(last?(now-last)/1000:0)
      stepping=false
      last=now
      if(document.visibilityState!=='hidden'&&isScanMoving(scannerRuntime.current()?.phase??'ready'))raf=requestAnimationFrame(tick)
    }
    const wake=()=>{if(document.visibilityState!=='hidden'&&!raf&&!stepping&&isScanMoving(scannerRuntime.current()?.phase??'ready')){last=0;raf=requestAnimationFrame(tick)}}
    const visibility=()=>{last=0;wake()}
    const unsubscribe=scannerRuntime.subscribe(wake)
    document.addEventListener('visibilitychange',visibility);wake()
    return()=>{cancelAnimationFrame(raf);unsubscribe();document.removeEventListener('visibilitychange',visibility);scannerRuntime.dispose()}
  },[])
  return null
}
