// Event/CPU trace only, no media capture.
import {chromium,expect} from '@playwright/test'
import {writeFile} from 'node:fs/promises'
const browser=await chromium.launch({args:['--use-angle=d3d11','--ignore-gpu-blocklist','--enable-gpu']}),page=await browser.newPage({viewport:{width:1440,height:900}})
await page.addInitScript(()=>{window.__tasks=[];new PerformanceObserver(l=>window.__tasks.push(...l.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:true})})
await page.goto('http://127.0.0.1:5187/bay/physical');await expect(page.getByTestId('environment-status')).toHaveAttribute('data-state','ready',{timeout:90000})
const cdp=await page.context().newCDPSession(page),events=[]
cdp.on('Tracing.dataCollected',e=>events.push(...e.value));await cdp.send('Profiler.enable');await cdp.send('Profiler.start');await cdp.send('Tracing.start',{categories:'devtools.timeline,gpu,disabled-by-default-gpu.service',options:'record-until-full'})
const start=Date.now();await page.evaluate(()=>window.__start=performance.now());await page.getByRole('button',{name:'Prepare examination'}).click();await expect(page.locator('canvas')).toHaveAttribute('data-patient-visible','true',{timeout:60000});await page.waitForTimeout(900)
const cpu=await cdp.send('Profiler.stop'),complete=new Promise(resolve=>cdp.once('Tracing.tracingComplete',resolve));await cdp.send('Tracing.end');await complete
const tasks=await page.evaluate(()=>window.__tasks.filter(t=>t.start>=window.__start)),long=events.filter(e=>e.ph==='X'&&e.dur>50000).sort((a,b)=>b.dur-a.dur)
const result={elapsed:Date.now()-start,tasks,longEvents:long.map(e=>({name:e.name,cat:e.cat,duration:e.dur/1000,pid:e.pid,tid:e.tid}))}
await writeFile(`docs/measurements/final/${process.env.PATIENT_PROFILE_NAME||'patient-load-profile'}.json`,JSON.stringify(result,null,2));await writeFile('docs/measurements/final/patient-load-cpu.json',JSON.stringify(cpu));console.log(JSON.stringify({elapsed:result.elapsed,tasks:result.tasks,top:result.longEvents.slice(0,8)},null,2));await browser.close()
