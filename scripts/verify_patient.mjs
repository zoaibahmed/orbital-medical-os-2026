// Numeric/DOM verification only. Never captures images, videos or canvas pixels.
import { chromium,expect } from '@playwright/test'
import { mkdir,writeFile } from 'node:fs/promises'
const browser=await chromium.launch({args:['--use-angle=d3d11','--ignore-gpu-blocklist','--enable-gpu']})
const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],requests=[]
page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('.glb'))requests.push(r.url())})
await page.addInitScript(()=>{window.__orbitalProbe={active:false,frames:[],react:[],lifecycles:[],resources:[]}})
await page.goto(process.env.PATIENT_URL||'http://127.0.0.1:5187/bay/physical')
await expect(page.getByTestId('environment-status')).toHaveAttribute('data-state','ready',{timeout:90000})
const canvas=page.locator('canvas'),renderer=await canvas.getAttribute('data-renderer-instance')
const patientLoadStart=Date.now()
await page.getByRole('button',{name:'Prepare examination'}).click()
await expect(canvas).toHaveAttribute('data-patient-visible','true',{timeout:60000})
const patientLoadMs=Date.now()-patientLoadStart
await page.waitForTimeout(900)
const patient=await page.evaluate(()=>window.__orbitalProbe.patientSnapshot())
expect(patient.meshes.length).toBe(5);expect(patient.meshes.every(m=>m.bones>100)).toBeTruthy()
expect(patient.bounds[0][0]).toBeGreaterThan(-.9);expect(patient.bounds[1][0]).toBeLessThan(.1)
expect(patient.bounds[0][2]).toBeGreaterThan(-1.3);expect(patient.bounds[1][2]).toBeLessThan(1.04)
expect(Number(await canvas.getAttribute('data-restraint-triangles'))).toBeGreaterThan(0)
await page.evaluate(()=>{window.__orbitalProbe.frames=[];window.__orbitalProbe.active=true});await page.waitForTimeout(6000);const performanceResult=await page.evaluate(()=>{const p=window.__orbitalProbe;p.active=false;const gaps=p.frames.slice(1).map((f,i)=>f.time-p.frames[i].time).sort((a,b)=>a-b);return{frames:p.frames.length,fps:1000*gaps.length/gaps.reduce((a,b)=>a+b,0),p95:gaps[Math.floor(gaps.length*.95)],maxGap:Math.max(...gaps),maxCalls:Math.max(...p.frames.map(f=>f.calls))}})
const before=await page.evaluate(()=>window.__orbitalProbe.resourceSnapshot()),first=Number(await canvas.getAttribute('data-chest-expansion'))
await page.waitForTimeout(1200)
const second=Number(await canvas.getAttribute('data-chest-expansion'));expect(Math.abs(second-first)).toBeGreaterThan(.01)
await page.getByRole('button',{name:'Clear examination'}).click();await expect(canvas).toHaveAttribute('data-patient-visible','false')
await page.getByRole('button',{name:'Prepare examination'}).click();await expect(canvas).toHaveAttribute('data-patient-visible','true')
const result={patientLoadMs,performance:performanceResult,patient,breathingChanges:[first,second],restraintTriangles:await canvas.getAttribute('data-restraint-triangles'),rendererRetained:renderer===await canvas.getAttribute('data-renderer-instance'),resourcesRetained:JSON.stringify(before)===JSON.stringify(await page.evaluate(()=>window.__orbitalProbe.resourceSnapshot())),patientRequests:requests.filter(r=>r.includes('/patient/')).length,errors}
expect(result.rendererRetained).toBe(true);expect(result.resourcesRetained).toBe(true);expect(result.patientRequests).toBe(1);expect(errors).toEqual([])
await mkdir('docs/measurements/final',{recursive:true});await writeFile('docs/measurements/final/patient-verification.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await browser.close()
