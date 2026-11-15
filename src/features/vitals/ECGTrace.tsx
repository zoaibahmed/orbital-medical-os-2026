import { useEffect, useRef } from 'react'
import { beatPhase, ecgPoints, usableHeartRate, type MonitoringFeed } from './monitoring'

/** High-frequency SVG updates bypass React; no scene or telemetry-provider rerenders. */
export function ECGTrace({ feed, reducedMotion, zoom=false }: { feed: MonitoringFeed; reducedMotion: boolean; zoom?: boolean }) {
  const line=useRef<SVGPolylineElement>(null),pulse=useRef<SVGCircleElement>(null)
  useEffect(()=>{
    let raf=0,frames=0,last=0
    const draw=(now:number)=>{
      const element=line.current
      if(!element)return
      const frame=feed.getSnapshot(),available=usableHeartRate(frame)!==null
      const running=frame.active&&!reducedMotion&&document.visibilityState==='visible'&&available
      const phase=running?beatPhase(now,frame):0
      if(now-last>1000/45||!running){
        element.setAttribute('points',available?ecgPoints(phase,zoom?300:600):'0,71 600,71')
        element.dataset.animation=running?'running':'static'
        element.dataset.frames=String(++frames)
        pulse.current?.setAttribute('opacity',running?String(phase<.18?1:.35):'.6')
        last=last===0||!running?now:Math.max(last+1000/45,now-1000/45)
      }
      if(running)raf=requestAnimationFrame(draw)
    }
    const restart=()=>{cancelAnimationFrame(raf);draw(performance.now())}
    const unsubscribe=feed.subscribe(restart)
    document.addEventListener('visibilitychange',restart);restart()
    return()=>{cancelAnimationFrame(raf);unsubscribe();document.removeEventListener('visibilitychange',restart)}
  },[feed,reducedMotion,zoom])
  return <svg viewBox={`0 0 ${zoom?300:600} 120`} role="img" aria-label="Animated simulated ECG; illustrative signal, not a clinical recording">
    <path className="ecg-grid" d="M0 20H600M0 70H600M0 115H600M100 0V120M200 0V120M300 0V120M400 0V120M500 0V120"/>
    <polyline ref={line} points={ecgPoints(0,zoom?300:600)}/><circle ref={pulse} cx={zoom?288:588} cy="12" r="4" fill="currentColor"/>
  </svg>
}

export function TrendChart({ values, label, unit }: { values: readonly (number|null)[]; label: string; unit: string }) {
  const valid=values.filter((value):value is number=>value!==null&&Number.isFinite(value))
  if(valid.length<2)return <p className="trend-unavailable" role="img" aria-label={`${label}: history unavailable`}>History unavailable</p>
  const min=Math.min(...valid)-1,max=Math.max(...valid)+1
  let path='',pen=false
  values.forEach((value,i)=>{if(value===null||!Number.isFinite(value)){pen=false;return}path+=`${pen?'L':'M'}${i/(values.length-1)*240},${42-(value-min)/(max-min)*34} `;pen=true})
  return <svg className="trend-chart" viewBox="0 0 240 48" role="img" aria-label={`${label}, fictional samples: ${values.map(value=>value??'Unavailable').join(', ')} ${unit}`}><path d="M0 46H240"/><path className="trend-data" pathLength={1} d={path} fill="none" stroke="currentColor" strokeWidth="1.6"/></svg>
}
