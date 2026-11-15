import { useCallback, useEffect, useRef, useState } from 'react'
import { beatPhase, usableHeartRate, type MonitoringFeed } from './monitoring'

type AudioState='muted'|'enabling'|'enabled'|'unavailable'
/** Original synthesized monitoring pulse. One context, one scheduler, bounded voices. */
export function HeartbeatAudio({ feed, active, reducedMotion }: { feed: MonitoringFeed; active: boolean; reducedMotion: boolean }) {
  const [state,setState]=useState<AudioState>('muted')
  const context=useRef<AudioContext|null>(null),voices=useRef(new Set<OscillatorNode>())
  const attempt=useRef(0),requested=useRef(false)
  const control=useRef<HTMLButtonElement>(null)
  const stop=useCallback(()=>{
    voices.current.forEach(voice=>{try{voice.stop()}catch{/* Voice already ended. */}});voices.current.clear()
    const audio=context.current
    if(audio&&audio.state!=='closed')void audio.suspend().catch(()=>{})
  },[])
  const release=useCallback(()=>{
    attempt.current++;requested.current=false;stop()
    const audio=context.current;context.current=null
    if(audio&&audio.state!=='closed')void audio.close().catch(()=>{})
  },[stop])
  const effective=active&&state==='enabled'
  useEffect(()=>{
    if(!effective){stop();return}
    const audio=context.current
    if(!audio)return
    let previousPhase:number|null=null
    const tick=()=>{
      const frame=feed.getSnapshot(),bpm=usableHeartRate(frame)
      if(!frame.active||document.visibilityState!=='visible'||audio.state!=='running'||!bpm){previousPhase=null;return}
      const period=60000/bpm
      const now=performance.now(),phase=beatPhase(now,frame)
      // Sample updates preserve phase but can change epoch. Only an actual phase
      // wrap emits a pulse; a new telemetry sample must never replay the same beat.
      const crossed=previousPhase!==null&&previousPhase-phase>.5
      previousPhase=phase
      if(!crossed)return
      const elapsed=phase*period
      // Don't emit a late pulse after tab/driver suspension.
      if(elapsed>110)return
      const oscillator=audio.createOscillator(),gain=audio.createGain(),at=audio.currentTime
      oscillator.type='sine';oscillator.frequency.setValueAtTime(740,at);oscillator.frequency.exponentialRampToValueAtTime(660,at+.065)
      gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(.025,at+.008);gain.gain.exponentialRampToValueAtTime(.0001,at+.095)
      oscillator.connect(gain);gain.connect(audio.destination);voices.current.add(oscillator)
      oscillator.onended=()=>{voices.current.delete(oscillator);oscillator.disconnect();gain.disconnect()}
      oscillator.start(at);oscillator.stop(at+.1)
      if(control.current)control.current.dataset.pulses=String(Number(control.current.dataset.pulses??0)+1)
    }
    const timer=window.setInterval(tick,25);tick()
    return()=>{clearInterval(timer);stop()}
  },[feed,effective,stop])
  useEffect(()=>{
    // Explicit enablement lasts for this station visit only. Re-entry never starts audio.
    if(!active)stop()
  },[active,stop])
  useEffect(()=>{
    const visibility=()=>{if(document.visibilityState!=='visible'){attempt.current++;requested.current=false;stop();setState('muted')}}
    document.addEventListener('visibilitychange',visibility)
    return()=>{document.removeEventListener('visibilitychange',visibility);release()}
  },[stop,release])
  async function toggle(){
    if(state==='enabled'||state==='enabling'){attempt.current++;requested.current=false;stop();setState('muted');return}
    if(!active)return
    const ticket=++attempt.current
    requested.current=true;setState('enabling')
    try{
      const audio=context.current??=new AudioContext()
      await audio.resume()
      if(context.current!==audio)return
      if(ticket!==attempt.current||!requested.current||document.visibilityState!=='visible'){
        if(!requested.current&&audio.state!=='closed')await audio.suspend()
        return
      }
      if(audio.state!=='running')throw Error('Audio blocked')
      setState('enabled')
    }catch{if(ticket===attempt.current){requested.current=false;setState('unavailable')}}
  }
  return <div className="monitor-audio"><button ref={control} onClick={()=>void toggle()} aria-label={state==='enabled'?'Mute heartbeat audio':state==='enabling'?'Cancel heartbeat audio':'Enable heartbeat audio'} aria-pressed={state==='enabled'} disabled={!active||state==='unavailable'} data-audio-state={effective?'enabled':state==='unavailable'?'unavailable':'muted'}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4zM17 8q5 4 0 8"/></svg>{state==='enabled'?'Sound on':state==='enabling'?'Enabling sound…':'Enable sound'}</button><span>{state==='unavailable'?'Audio unavailable; visual monitoring continues.':reducedMotion?'Optional quiet pulse / motion reduced':'Optional quiet pulse / default muted'}</span></div>
}
