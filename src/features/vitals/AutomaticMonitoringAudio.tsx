import { useEffect, useRef, useState } from 'react'
import { beatPhase, usableHeartRate, type MonitoringFeed } from './monitoring'
/** One context per immersive session; no autoplay bypass and no station-local contexts. */
export function AutomaticMonitoringAudio({feed,active,allowed}:{feed:MonitoringFeed;active:boolean;allowed:boolean}){
 const desired=useRef(false)
 const permitted=useRef(allowed),master=useRef<GainNode|null>(null),fadeTimer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined)
 useEffect(()=>{permitted.current=allowed;desired.current=active&&allowed&&document.visibilityState==='visible'},[active,allowed])
 const context=useRef<AudioContext|null>(null),voices=useRef(new Set<OscillatorNode>()),[unlocked,setUnlocked]=useState(false),[visible,setVisible]=useState(()=>document.visibilityState==='visible'),[blocked,setBlocked]=useState(false)
 useEffect(()=>{
  const unlock=()=>{if(!permitted.current)return;try{if(!context.current){context.current=new AudioContext();master.current=context.current.createGain();master.current.gain.setValueAtTime(1,context.current.currentTime);master.current.connect(context.current.destination)}void context.current.resume().then(()=>{setUnlocked(true);setBlocked(false);if(!desired.current||document.visibilityState!=='visible')void context.current?.suspend().catch(()=>{})}).catch(()=>setBlocked(true))}catch{setBlocked(true)}}
  const visibility=()=>{setVisible(document.visibilityState==='visible');if(document.visibilityState!=='visible'){voices.current.forEach(v=>{try{v.stop()}catch{/* ended */}});void context.current?.suspend().catch(()=>{})}}
  document.addEventListener('pointerdown',unlock);document.addEventListener('keydown',unlock);document.addEventListener('visibilitychange',visibility)
  return()=>{document.removeEventListener('pointerdown',unlock);document.removeEventListener('keydown',unlock);document.removeEventListener('visibilitychange',visibility);clearTimeout(fadeTimer.current);master.current?.disconnect();master.current=null;const audio=context.current;context.current=null;if(audio&&audio.state!=='closed')void audio.close().catch(()=>{})}
 },[])
 useEffect(()=>{
  const audio=context.current
  if(!audio)return
  const finish=()=>{voices.current.forEach(v=>{try{v.stop()}catch{/* ended */}});voices.current.clear();if(audio.state!=='closed')void audio.suspend().catch(()=>{})}
  const stop=()=>{clearTimeout(fadeTimer.current);if(audio.state==='closed')return;if(!permitted.current||document.visibilityState!=='visible'){finish();return}const gain=master.current?.gain;gain?.cancelScheduledValues?.(audio.currentTime);gain?.setValueAtTime(Math.max(.0001,gain.value||1),audio.currentTime);gain?.exponentialRampToValueAtTime(.0001,audio.currentTime+.06);fadeTimer.current=setTimeout(finish,70)}
  if(!active||!allowed||!visible){stop();return}
  clearTimeout(fadeTimer.current);master.current?.gain.cancelScheduledValues?.(audio.currentTime);master.current?.gain.setValueAtTime(1,audio.currentTime)
  let cancelled=false,previous:number|null=null
  void audio.resume().then(()=>{if(document.visibilityState!=='visible')stop();else if(!cancelled)setBlocked(false)}).catch(()=>{if(!cancelled)setBlocked(true)})
  const timer=setInterval(()=>{
   const frame=feed.getSnapshot(),bpm=usableHeartRate(frame)
   if(cancelled||!frame.active||!bpm||audio.state!=='running'||document.visibilityState!=='visible')return
   const phase=beatPhase(performance.now(),frame),crossed=previous!==null&&previous-phase>.5;previous=phase
   if(!crossed||phase*60000/bpm>110)return
   const voice=audio.createOscillator(),gain=audio.createGain(),now=audio.currentTime
   voice.frequency.setValueAtTime(720,now);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.02,now+.008);gain.gain.exponentialRampToValueAtTime(.0001,now+.09);voice.connect(gain);gain.connect(master.current??audio.destination);voices.current.add(voice);voice.onended=()=>{voices.current.delete(voice);voice.disconnect();gain.disconnect()};voice.start(now);voice.stop(now+.1)
  },25)
  return()=>{cancelled=true;clearInterval(timer);stop()}
 },[feed,active,allowed,visible,unlocked])
 return <span className="audio-session-status" role="status" data-testid="automatic-audio" data-state={!allowed?'muted':blocked?'blocked':active&&unlocked&&visible?'monitoring':'standby'}>{!allowed?'Monitoring sound muted in preferences':blocked?'Sound deferred by browser; monitoring remains visual':active&&unlocked?'Monitoring pulse / quiet':'Monitoring sound waits for permitted interaction'}</span>
}
