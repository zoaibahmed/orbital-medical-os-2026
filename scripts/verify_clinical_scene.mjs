import {chromium,expect} from '@playwright/test'
import {mkdir,writeFile} from 'node:fs/promises'
const browser=await chromium.launch({args:['--use-angle=d3d11','--ignore-gpu-blocklist','--enable-gpu']})
const page=await browser.newPage({viewport:{width:1440,height:900}}),requests=[],errors=[]
page.on('request',r=>{if(r.url().includes('.glb'))requests.push(r.url())});page.on('pageerror',e=>errors.push(e.message))
await page.addInitScript(()=>{window.__orbitalProbe={active:false,frames:[],react:[],lifecycles:[],resources:[]}})
await page.goto('http://127.0.0.1:5187/bay/physical');await expect(page.getByTestId('environment-status')).toHaveAttribute('data-state','ready',{timeout:90000});await expect(page.locator('canvas')).toHaveAttribute('data-camera-transition','settled',{timeout:30000})
await page.getByRole('button',{name:'Prepare examination'}).click();await expect(page.locator('canvas')).toHaveAttribute('data-patient-visible','true',{timeout:60000});await page.waitForTimeout(900)
const id=await page.locator('canvas').getAttribute('data-renderer-instance'),count=requests.length,before=await page.evaluate(()=>window.__orbitalProbe.resourceSnapshot())
await page.getByRole('button',{name:'Start examination',exact:true}).click();await page.evaluate(()=>{window.__orbitalProbe.frames=[];window.__orbitalProbe.active=true});await page.getByRole('button',{name:'Start demonstration scan'}).click();await expect(page.locator('canvas')).toHaveAttribute('data-examination-state','SCAN_ACTIVE')
const during=await page.evaluate(()=>window.__orbitalProbe.resourceSnapshot());expect(during.geometries.length).toBeGreaterThan(before.geometries.length)
await expect(page.getByText('Demonstration complete.',{exact:false})).toBeVisible({timeout:10000});await expect(page.locator('canvas')).toHaveAttribute('data-examination-state','EXAMINATION_COMPLETE')
const result=await page.evaluate(()=>{const p=window.__orbitalProbe;p.active=false;const gaps=p.frames.slice(1).map((f,i)=>f.time-p.frames[i].time);return{frames:p.frames.length,maxGapMs:Math.max(...gaps),resources:p.resourceSnapshot(),renderer:p.renderer}})
expect(result.frames).toBeGreaterThan(10);expect(result.resources).toEqual(before);expect(requests.length).toBe(count);expect(errors).toEqual([])
await mkdir('docs/measurements/final',{recursive:true});const report={...result,resources:undefined,rendererRetained:id===await page.locator('canvas').getAttribute('data-renderer-instance'),temporaryScanGeometryObserved:true,resourcesReturnedToBaseline:true,newGlbRequests:requests.length-count,errors};await writeFile('docs/measurements/final/scanner.json',JSON.stringify(report,null,2));console.log(report);await browser.close()
