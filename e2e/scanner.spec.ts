import {test,expect} from './fixtures'
import {ready,settled} from './helpers'

const probe=()=>{window.__orbitalProbe={active:false,frames:[],react:[],lifecycles:[],resources:[]}}
async function start(page:import('@playwright/test').Page,region='Full body'){
 await page.getByRole('combobox',{name:'Examination region'}).selectOption(region)
 await page.getByRole('button',{name:'Prepare examination',exact:true}).click()
 await page.getByRole('button',{name:'Start demonstration scan',exact:true}).click()
}

test('actual complete gantry and light sheet travel head to feet to park without asset or Canvas reconstruction',async({page})=>{
 await page.addInitScript(probe)
 const glbs:string[]=[],errors:string[]=[];page.on('request',r=>{if(r.url().includes('.glb'))glbs.push(r.url())});page.on('pageerror',e=>errors.push(e.message))
 await page.goto('/bay/physical');await ready(page);await settled(page)
 const canvas=page.locator('canvas'),original=await canvas.elementHandle()
 const initial=await page.evaluate(()=>window.__orbitalProbe!.scannerSnapshot!())
 expect(initial!.assemblies).toBe(1);expect(initial!.triangles).toBeGreaterThan(80000);expect(initial!.parts).toBe(10);expect(initial!.offset).toBe(0)
 await expect(canvas).toHaveAttribute('data-patient-visible','true')
 const resources=await page.evaluate(()=>window.__orbitalProbe!.resourceSnapshot!()),count=glbs.length
 await start(page)
 await expect(canvas).toHaveAttribute('data-gantry-layer','live')
 const frames=await page.evaluate(()=>new Promise<Array<{offset:number;vertex:number[];sheetZ:number|null;phase:string;progress:number;clinical:string}>>((resolve,reject)=>{
  const samples:Array<{offset:number;vertex:number[];sheetZ:number|null;phase:string;progress:number;clinical:string}>=[],began=performance.now()
  function tick(){
   const canvas=document.querySelector('canvas')!,mechanism=window.__orbitalProbe!.scannerSnapshot!()!
   samples.push({offset:mechanism.offset,vertex:mechanism.vertex,sheetZ:mechanism.sheetZ,phase:canvas.dataset.scanPhase!,progress:Number(canvas.dataset.scanProgress),clinical:canvas.dataset.examinationState!})
   if(canvas.dataset.scanPhase==='complete')resolve(samples)
   else if(performance.now()-began>30000)reject(Error('Mechanical scan did not finish'))
   else requestAnimationFrame(tick)
  }requestAnimationFrame(tick)
 }))
 const peak=Math.max(...frames.map(f=>f.offset)),peakIndex=frames.findIndex(f=>f.offset===peak),last=frames.at(-1)!
 expect(peak).toBeCloseTo(1.85537081,2);expect(peakIndex).toBeGreaterThan(0);expect(peakIndex).toBeLessThan(frames.length-2)
 expect(last.offset).toBe(0);expect(last.progress).toBe(1);expect(last.clinical).toBe('EXAMINATION_COMPLETE')
 await expect(canvas).toHaveAttribute('data-gantry-layer','cached')
 expect(frames.some(f=>f.phase==='forward'&&f.offset>.2)).toBe(true);expect(frames.some(f=>f.phase==='backward'&&f.offset>.2)).toBe(true)
 for(const frame of frames){
  expect(frame.vertex[0]).toBeCloseTo(initial!.vertex[0]!,5);expect(frame.vertex[1]).toBeCloseTo(initial!.vertex[1]!,5)
  expect(frame.vertex[2]!-initial!.vertex[2]!).toBeCloseTo(frame.offset,4)
  if(['forward','backward'].includes(frame.phase))expect(Math.abs(frame.sheetZ!-(-1.22+frame.offset))).toBeLessThan(.09)
  if(frame.clinical==='EXAMINATION_COMPLETE')expect(frame.offset).toBe(0)
 }
 await expect(page.getByRole('heading',{name:'Demonstration observations'})).toBeVisible()
 await expect(page.locator('.result-context')).toContainText('Full body')
 expect(await canvas.evaluate((node,before)=>node===before,original)).toBe(true)
 expect(await page.evaluate(()=>window.__orbitalProbe!.resourceSnapshot!())).toEqual(resources)
 expect(glbs.length).toBe(count);expect(errors).toEqual([])
})

test('all six localized regions reach distinct anatomical limits and return safely',async({page})=>{
 test.setTimeout(180000);await page.addInitScript(probe)
 await page.goto('/bay/physical');await ready(page)
 const limits:Record<string,number>={'Head and eyes':-.945,'Chest':-.446,'Spine':-.326,'Upper limbs':-.16,'Lower limbs':.63537081,'Muscle groups':.539}
 for(const [region,end] of Object.entries(limits)){
  await start(page,region)
  await expect(page.getByRole('combobox',{name:'Examination region'})).toBeDisabled()
  const max=await page.evaluate(()=>new Promise<number>((resolve,reject)=>{
   let peak=0;const began=performance.now()
   function tick(){const p=window.__orbitalProbe!.scannerSnapshot!()!;peak=Math.max(peak,p.offset);if(document.querySelector('canvas')!.dataset.scanPhase==='complete')resolve(peak);else if(performance.now()-began>30000)reject(Error('Localized scan stalled'));else requestAnimationFrame(tick)}requestAnimationFrame(tick)
  }))
  expect(max-1.22).toBeCloseTo(end,2)
  expect((await page.evaluate(()=>window.__orbitalProbe!.scannerSnapshot!()))!.offset).toBe(0)
  await expect(page.locator('.result-context')).toContainText(region)
 }
})

test('operator cancellation and selected crew/region changes return to park before reuse',async({page})=>{
 await page.addInitScript(probe);await page.goto('/bay/physical');await ready(page)
 const canvas=page.locator('canvas')
 await start(page);await expect.poll(()=>canvas.getAttribute('data-gantry-offset').then(Number)).toBeGreaterThan(.4)
 await page.getByRole('button',{name:'Cancel scan and return'}).click()
 await expect(page.getByRole('button',{name:'Cancel scan and return'})).toBeDisabled()
 await expect(canvas).toHaveAttribute('data-scan-phase','cancelled');await expect(canvas).toHaveAttribute('data-gantry-offset','0.000000')
 await start(page);await expect.poll(()=>canvas.getAttribute('data-gantry-offset').then(Number)).toBeGreaterThan(.3)
 await page.getByRole('tab',{name:'Assessment',exact:true}).click();await page.getByRole('button',{name:'Chest',exact:true}).click()
 await expect(canvas).toHaveAttribute('data-scan-phase','cancelled');await expect(canvas).toHaveAttribute('data-gantry-offset','0.000000')
 await page.getByRole('tab',{name:'Examination',exact:true}).click();await start(page,'Chest')
 await expect.poll(()=>canvas.getAttribute('data-gantry-offset').then(Number)).toBeGreaterThan(.3)
 await page.getByRole('button',{name:'Close mission view'}).click()
 await page.getByRole('button',{name:/Crew and display settings/}).click();await page.getByRole('combobox',{name:'Astronaut',exact:true}).selectOption('crew-02');await page.keyboard.press('Escape')
 await expect(canvas).toHaveAttribute('data-scan-phase','cancelled');await expect(canvas).toHaveAttribute('data-gantry-offset','0.000000')
 await expect(canvas).toHaveAttribute('data-patient-crew','crew-02');await expect(canvas).toHaveAttribute('data-scan-crew','crew-01')
 await page.getByRole('button',{name:'Medical index',exact:true}).click();await page.getByRole('navigation',{name:'Medical modules'}).getByRole('button',{name:/Physiological/}).click()
 await expect(page.locator('.subject-context')).toContainText('Sam Rivera');await expect(page.getByTestId('scan-progress')).toHaveAttribute('data-phase','ready')
 await start(page,'Head and eyes');await expect(canvas).toHaveAttribute('data-scan-crew','crew-02')
 await expect(canvas).toHaveAttribute('data-scan-phase','complete',{timeout:20000})
 await expect(page.locator('.result-context')).toContainText('crew-02')
})

test('medical tabs, native forms and grouped answers remain readable and keyboard accessible at five widths without WebGL',async({page})=>{
 await page.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,...args:Parameters<typeof get>){return String(args[0]).includes('webgl')?null:get.apply(this,args)} as typeof get})
 await page.emulateMedia({reducedMotion:'reduce'})
 for(const width of [320,390,768,1024,1440]){
  await page.setViewportSize({width,height:900});await page.goto('/bay/physical');await expect(page.getByTestId('environment-status')).toHaveAttribute('data-state','fallback')
  const tabs=page.getByRole('tablist',{name:'Physical medical operations'})
  await tabs.getByRole('tab',{name:'Examination',exact:true}).focus();await page.keyboard.press('ArrowRight');await expect(tabs.getByRole('tab',{name:'Assessment',exact:true})).toBeFocused()
  await page.keyboard.press('End');await expect(tabs.getByRole('tab',{name:'Exercise',exact:true})).toBeFocused()
  await page.getByLabel('Duration in minutes').fill('0');await page.getByRole('button',{name:'Save exercise plan'}).click();expect(await page.getByLabel('Duration in minutes').evaluate(n=>(n as HTMLInputElement).validity.rangeUnderflow)).toBe(true)
  await tabs.getByRole('tab',{name:'Vision check',exact:true}).click();const answer=page.getByRole('group',{name:'Distance vision looked blurry'}).getByRole('radio',{name:'Yes',exact:true});await answer.check();await expect(answer).toBeChecked()
  const answerStyle=await answer.locator('..').evaluate(n=>({height:n.getBoundingClientRect().height,font:parseFloat(getComputedStyle(n).fontSize)}));expect(answerStyle.height).toBeGreaterThanOrEqual(44);expect(answerStyle.font).toBeGreaterThanOrEqual(13)
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  const dialog=page.getByRole('dialog'),bounds=await dialog.boundingBox();expect(bounds!.x).toBeGreaterThanOrEqual(0);expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(width)
  await page.getByRole('button',{name:'Emergency access',exact:true}).click();await expect(page.getByRole('button',{name:'Return to station'})).toBeFocused();await page.keyboard.press('Escape')
 }
})
