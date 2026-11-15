// DOM/profiling only. Deliberately never captures images or video.
import { chromium, expect } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
const name=process.env.PERF_NAME||'operations'
const browser=await chromium.launch({args:['--use-angle=d3d11','--ignore-gpu-blocklist','--enable-gpu']})
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'})
if(process.env.PERF_NO_AA==='1') await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(String(type).includes('webgl'))args[0]={...args[0],antialias:false};return original.call(this,type,...args)}})
const errors=[],requests=[]
const apiRequests=[],apiFailures=[]
page.on('requestfinished',request=>{if(/\/api\/crew\/.+\/state/.test(request.url())){const timing=request.timing();apiRequests.push({path:new URL(request.url()).pathname,ms:timing.responseEnd})}})
page.on('requestfailed',request=>{if(request.url().includes('/api/'))apiFailures.push({path:new URL(request.url()).pathname,error:request.failure()?.errorText})})
page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('.glb'))requests.push(r.url())})
await page.addInitScript(()=>{window.__orbitalProbe={active:false,frames:[],react:[],lifecycles:[],resources:[]};window.__longTasks=[];new PerformanceObserver(l=>window.__longTasks.push(...l.getEntries().map(t=>({start:t.startTime,duration:t.duration})))).observe({type:'longtask',buffered:true})})
const start=Date.now()
await page.goto(process.env.PERF_URL||'http://127.0.0.1:5187/')
await expect(page.getByTestId('environment-status')).toHaveAttribute('data-state','ready',{timeout:90000})
await expect(page.locator('canvas')).toHaveAttribute('data-camera-transition','settled',{timeout:30000})
const readyMs=Date.now()-start
const before=await page.evaluate(()=>window.__orbitalProbe.resourceSnapshot())
const count=requests.length,id=await page.locator('canvas').getAttribute('data-renderer-instance')
await page.evaluate(()=>{window.__orbitalProbe.frames=[];window.__orbitalProbe.active=true;window.__measureStart=performance.now()})
// Native scroll across both directions, 12 seconds of actual active input.
await page.evaluate(()=>new Promise(resolve=>{const start=performance.now();function tick(now){const t=(now-start)/12000;window.scrollTo(0,(1-Math.cos(Math.min(t,1)*Math.PI*2))*innerHeight);if(t<1)requestAnimationFrame(tick);else resolve()}requestAnimationFrame(tick)}))
await expect(page.locator('canvas')).toHaveAttribute('data-camera-transition','settled',{timeout:30000})
for(let i=0;i<Number(process.env.PERF_CYCLES||5);i++){
 for(const destination of ['Biometrics','Explore']){await page.getByRole('navigation',{name:'Chapters'}).getByRole('button',{name:new RegExp(destination)}).click();await expect(page.locator('canvas')).toHaveAttribute('data-camera-transition','settled',{timeout:30000})}
 await page.getByRole('button',{name:/Diagnostic scanner/}).click();await expect(page.locator('canvas')).toHaveAttribute('data-camera-transition','settled',{timeout:30000})
 await page.getByRole('button',{name:'Return to chapter'}).click();await expect(page.locator('canvas')).toHaveAttribute('data-camera-transition','settled',{timeout:30000})
}
const raw=await page.evaluate(()=>{const p=window.__orbitalProbe;p.active=false;return {frames:p.frames,react:p.react,resources:p.resourceSnapshot(),renderer:p.renderer,tasks:window.__longTasks.filter(t=>t.start>=window.__measureStart),elapsed:performance.now()-window.__measureStart}})
const intervals=raw.frames.slice(1).flatMap((f,i)=>raw.frames[i].moving?[f.time-raw.frames[i].time]:[]).sort((a,b)=>a-b)
let monitoring
if(process.env.PERF_MONITOR==='1'){
 await page.getByRole('navigation',{name:'Chapters'}).getByRole('button',{name:/Biometrics/}).click();await expect(page.locator('canvas')).toHaveAttribute('data-camera-transition','settled',{timeout:30000})
 await page.evaluate(()=>{window.__orbitalProbe.frames=[];window.__orbitalProbe.active=true})
 const first=Number(await page.locator('canvas').getAttribute('data-monitor-frames'))
 await page.waitForTimeout(10000)
 monitoring=await page.evaluate(()=>{const p=window.__orbitalProbe;p.active=false;const a=p.frames.slice(1).map((v,i)=>v.time-p.frames[i].time);return{frames:p.frames.length,fps:1000*a.length/a.reduce((a,b)=>a+b,0),maxGapMs:Math.max(...a),minDrawCalls:Math.min(...p.frames.map(f=>f.calls)),maxDrawCalls:Math.max(...p.frames.map(f=>f.calls)),medianTriangles:p.frames.map(f=>f.triangles).sort((a,b)=>a-b)[Math.floor(p.frames.length/2)],renderedTextureFrames:Number(document.querySelector('canvas').dataset.monitorFrames),sequence:document.querySelector('.medical-instrument').dataset.sequence}})
 monitoring.textureUpdates=monitoring.renderedTextureFrames-first
}
const pipeline=await page.locator('canvas').evaluate(canvas=>({buffer:[canvas.width,canvas.height],antialias:canvas.getContext('webgl2').getContextAttributes().antialias,frameBudget:canvas.dataset.frameBudget,quality:canvas.dataset.quality,roomCache:canvas.dataset.roomCache,gpuBackpressure:Number(canvas.dataset.gpuBackpressure??0)}))
const composite=await page.evaluate(()=>window.__orbitalProbe.checkComposite?.())
const api={requests:apiRequests,failures:apiFailures,meanMs:apiRequests.length?apiRequests.reduce((sum,row)=>sum+row.ms,0)/apiRequests.length:null,maxMs:apiRequests.length?Math.max(...apiRequests.map(row=>row.ms)):null}
const report={composite,name,readyMs,renderer:raw.renderer,pipeline,monitoring,api,activeFPS:1000*intervals.length/intervals.reduce((a,b)=>a+b,0),p95:intervals[Math.floor(intervals.length*.95)],p99:intervals[Math.floor(intervals.length*.99)],maxActiveGap:Math.max(...intervals),motionIntervals:intervals.length,elapsed:raw.elapsed,maxDrawCalls:Math.max(...raw.frames.map(f=>f.calls)),maxTriangles:Math.max(...raw.frames.map(f=>f.triangles)),rendererRetained:id===await page.locator('canvas').getAttribute('data-renderer-instance'),resourcesRetained:JSON.stringify(before)===JSON.stringify(raw.resources),newGlbRequests:requests.length-count,errors,raw}
await mkdir('docs/measurements/master-1',{recursive:true});await writeFile(`docs/measurements/master-1/${name}.json`,JSON.stringify(report,null,2))
console.log(JSON.stringify({...report,raw:undefined},null,2));await browser.close()
