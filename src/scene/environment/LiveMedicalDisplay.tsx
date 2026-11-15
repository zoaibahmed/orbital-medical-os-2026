import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CanvasTexture, LinearFilter, SRGBColorSpace } from 'three'
import type { AstronautProfile } from '../../domain/contracts'
import { formatMeasurement } from '../../domain/format'
import { beatPhase, ecgAmplitude, usableHeartRate, type MonitoringFeed } from '../../features/vitals/monitoring'

/** One reusable 512×288 texture on the actual trolley screen; no additional Canvas/root. */
export function LiveMedicalDisplay({ feed, astronaut, reducedMotion }: { feed: MonitoringFeed; astronaut: AstronautProfile; reducedMotion: boolean }) {
  const {invalidate,gl}=useThree()
  const resources=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=288
    const texture=new CanvasTexture(canvas);texture.colorSpace=SRGBColorSpace
    texture.minFilter=texture.magFilter=LinearFilter;texture.generateMipmaps=false
    return {canvas,texture,context:canvas.getContext('2d')}
  },[])
  const last=useRef(0),draws=useRef(0),dirty=useRef(true)
  useEffect(()=>{
    const refresh=()=>{dirty.current=true;invalidate()}
    const unsubscribe=feed.subscribe(refresh);refresh()
    return unsubscribe
  },[feed,astronaut,reducedMotion,invalidate])
  useEffect(()=>()=>resources.texture.dispose(),[resources])
  useFrame(()=>{
    const now=performance.now(),frame=feed.getSnapshot(),ctx=resources.context
    const moving=frame.active&&!reducedMotion&&document.visibilityState==='visible'
    if(ctx&&(dirty.current||(moving&&now-last.current>=1000/45))){
      const b=frame.snapshot.biometrics
      ctx.fillStyle='#091916';ctx.fillRect(0,0,512,288)
      ctx.fillStyle='#a2d9c9';ctx.font='19px Barlow, sans-serif';ctx.fillText(`${astronaut.callSign} / ${astronaut.displayName}`,20,29)
      ctx.fillStyle='#adc1b8';ctx.font='12px Barlow, sans-serif';ctx.fillText(frame.active?'MONITORING / SIMULATED':'STANDBY / SIMULATED',20,49)
      const phase=moving?beatPhase(now,frame):0
      ctx.strokeStyle='#223f34';ctx.lineWidth=1
      for(let y=70;y<=165;y+=24){ctx.beginPath();ctx.moveTo(18,y);ctx.lineTo(494,y);ctx.stroke()}
      ctx.strokeStyle='#91d6bc';ctx.lineWidth=2.3;ctx.beginPath()
      for(let x=0;x<=470;x+=2){const y=125-(usableHeartRate(frame)===null?0:ecgAmplitude(x/470*3+phase)*50);if(x===0)ctx.moveTo(x+20,y);else ctx.lineTo(x+20,y)}ctx.stroke()
      ctx.fillStyle='#b2ead9';ctx.font='34px Barlow, sans-serif';ctx.fillText(`${usableHeartRate(frame)??'—'} bpm`,20,207)
      ctx.font='23px Barlow, sans-serif';ctx.fillText(`${formatMeasurement(b.oxygenSaturation)} SpO2`,275,207)
      const pressure=[b.systolicPressure,b.diastolicPressure].every(m=>m.value!==null&&m.quality!=='invalid'&&m.quality!=='missing')?`${b.systolicPressure.value}/${b.diastolicPressure.value} mmHg`:'BP unavailable'
      ctx.fillStyle='#cbd5ca';ctx.font='18px Barlow, sans-serif';ctx.fillText(pressure,20,245);ctx.fillText(`${formatMeasurement(b.heartRateVariability)} HRV`,275,245)
      ctx.fillStyle=frame.demoAlert||frame.emergencyActive?'#ffbaaa':'#91a89e';ctx.font='11px Barlow, sans-serif';ctx.fillText(frame.emergencyActive?'BACKEND EMERGENCY REHEARSAL / FICTIONAL CREW':frame.demoAlert?'USER-SELECTED DEMO ALERT / NO DETECTED CONDITION':'ILLUSTRATIVE ECG / FICTIONAL SAMPLES / NO DIAGNOSIS',20,273)
      resources.texture.needsUpdate=true;last.current=dirty.current?now:Math.max(last.current+1000/45,now-1000/45);dirty.current=false
      gl.domElement.dataset.monitorFrames=String(++draws.current)
      gl.domElement.dataset.monitorCrew=astronaut.id
      gl.domElement.dataset.monitorState=moving?'active':frame.active?'motion-reduced':'standby'
      gl.domElement.dataset.monitorReading=String(usableHeartRate(frame)??'unavailable')
      gl.domElement.dataset.monitorSource=frame.snapshot.source==='external'?'backend-simulation':'offline-fixture'
      gl.domElement.dataset.emergencyActive=String(frame.emergencyActive)
    }
    if(moving)invalidate()
  })
  return <mesh name="live-trolley-monitor" layers-mask={2} position={[2.11,1.99,-2.239]} raycast={()=>{}}>
    <planeGeometry args={[.775,.448]}/><meshBasicMaterial map={resources.texture} toneMapped={false}/>
  </mesh>
}
