import { chromium,expect } from '@playwright/test'
import { writeFile,mkdir } from 'node:fs/promises'
const profileName=process.env.PROFILE_NAME||'navigation'
const browser=await chromium.launch({args:['--use-angle=d3d11','--ignore-gpu-blocklist','--enable-gpu']})
const page=await browser.newPage({viewport:{width:1440,height:900}})
await page.goto('http://127.0.0.1:5187/');await expect(page.getByTestId('environment-status')).toHaveAttribute('data-state','ready',{timeout:90000})
const cdp=await page.context().newCDPSession(page)
const events=[];cdp.on('Tracing.dataCollected',e=>events.push(...e.value))
await cdp.send('Profiler.enable');await cdp.send('Profiler.start');await cdp.send('Tracing.start',{categories:'devtools.timeline,renderer.scheduler,gpu,cc,disabled-by-default-gpu.service',options:'record-until-full'})
await page.evaluate(()=>new Promise(resolve=>{const start=performance.now();function tick(now){const t=(now-start)/15000;scrollTo(0,(1-Math.cos(Math.min(t,1)*Math.PI*4))*innerHeight);if(t<1)requestAnimationFrame(tick);else resolve()}requestAnimationFrame(tick)}))
const cpu=await cdp.send('Profiler.stop');const complete=new Promise(resolve=>cdp.once('Tracing.tracingComplete',resolve));await cdp.send('Tracing.end');await complete
const long=events.filter(e=>e.ph==='X'&&e.dur>100000).sort((a,b)=>b.dur-a.dur).slice(0,50)
await mkdir('docs/measurements/master-1',{recursive:true});await writeFile(`docs/measurements/master-1/${profileName}-trace.json`,JSON.stringify({traceEvents:events}));await writeFile(`docs/measurements/master-1/${profileName}-long-events.json`,JSON.stringify(long,null,2));await writeFile(`docs/measurements/master-1/${profileName}-cpu.json`,JSON.stringify(cpu))
console.log(long.map(e=>({name:e.name,cat:e.cat,duration:e.dur/1000,pid:e.pid,tid:e.tid})))
await browser.close()
