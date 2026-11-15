import {test,expect} from './fixtures'
import {chapter,ready,settled} from './helpers'

for(const scale of [1,1.25])test(`fractional canvas at device scale ${scale} becomes ready without resizing or DevTools`,async({browser,baseURL})=>{
 const context=await browser.newContext({baseURL,viewport:{width:1440,height:900},deviceScaleFactor:scale}),page=await context.newPage()
 try{
  await page.addInitScript(()=>{document.addEventListener('DOMContentLoaded',()=>{const style=document.createElement('style');style.textContent='.os-scene{right:auto!important;bottom:auto!important;width:calc(100% - .25px)!important;height:calc(100% - .25px)!important}';document.head.append(style)},{once:true})})
  await page.goto('/');await ready(page)
  const result=await page.locator('canvas').evaluate(c=>{const canvas=c as HTMLCanvasElement,gl=canvas.getContext('webgl2')!;return{buffer:[canvas.width,canvas.height],client:[canvas.clientWidth,canvas.clientHeight],viewport:Array.from(gl.getParameter(gl.VIEWPORT)),patient:canvas.dataset.patientVisible,frames:Number(canvas.dataset.presentedFrames)}})
  const ratio=result.buffer[0]!>result.client[0]!?scale:1;expect(result.buffer).toEqual([Math.floor(1439.75*ratio),Math.floor(899.75*ratio)]);expect(result.client).toEqual([1440,900]);expect(result.viewport).toEqual([0,0,...result.buffer]);expect(result.patient).toBe('true');expect(result.frames).toBeGreaterThan(0)
 }finally{await context.close()}
})

test('first ready screen has opaque breathing patient, native resolution and stable quality after navigation/reload',async({page})=>{
 await page.setViewportSize({width:1440,height:900})
 await page.addInitScript(()=>{
  window.__orbitalProbe={active:false,frames:[],react:[],lifecycles:[],resources:[]}
  const record=window as Window&{firstReady?:Record<string,unknown>}
  new MutationObserver(()=>{if(record.firstReady)return;const status=document.querySelector<HTMLElement>('[data-testid="environment-status"]'),c=document.querySelector('canvas');if(status?.dataset.state==='ready'&&c){const gl=c.getContext('webgl2')!;record.firstReady={buffer:[c.width,c.height],css:[c.clientWidth,c.clientHeight],patient:c.dataset.patientVisible,opacity:c.dataset.patientOpacity,preparation:c.dataset.patientPreparation,pose:!!c.dataset.cameraPose,frames:Number(c.dataset.presentedFrames),viewport:Array.from(gl.getParameter(gl.VIEWPORT)),quality:c.dataset.quality}}}).observe(document,{subtree:true,attributes:true,childList:true})
 })
 for(let fresh=0;fresh<2;fresh++){
  if(fresh===0)await page.goto('/');else await page.reload()
  await ready(page)
  const initial=await page.evaluate(()=>(window as Window&{firstReady?:Record<string,unknown>}).firstReady)
  expect(initial).toMatchObject({buffer:[1440,900],css:[1440,900],patient:'true',opacity:'1.0000',preparation:'ready',pose:true,quality:'standard',viewport:[0,0,1440,900]})
  expect(Number(initial!.frames)).toBeGreaterThan(0)
  const patient=await page.evaluate(()=>window.__orbitalProbe!.patientSnapshot!());expect(patient!.visible).toBe(true);expect(patient!.meshes).toHaveLength(5)
  const projected=await page.evaluate(bounds=>[0,1].flatMap(x=>[0,1].flatMap(y=>[0,1].map(z=>window.__orbitalProbe!.projectPoint!([bounds[x]![0]!,bounds[y]![1]!,bounds[z]![2]!])))),patient!.bounds);for(const p of projected){expect(p.x).toBeGreaterThan(0);expect(p.x).toBeLessThan(1440);expect(p.y).toBeGreaterThan(0);expect(p.y).toBeLessThan(900)}
  const renderer=await page.locator('canvas').getAttribute('data-renderer-instance'),phase=await page.locator('canvas').getAttribute('data-chest-expansion');await page.waitForTimeout(800);expect(await page.locator('canvas').getAttribute('data-chest-expansion')).not.toBe(phase)
  for(const destination of ['Explore','Biometrics','Arrival']){await chapter(page,destination);await settled(page);await expect(page.locator('canvas')).toHaveAttribute('data-patient-visible','true');expect(await page.locator('canvas').getAttribute('data-renderer-instance')).toBe(renderer);expect(await page.locator('canvas').evaluate(c=>[(c as HTMLCanvasElement).width,(c as HTMLCanvasElement).height])).toEqual([1440,900]);await expect(page.locator('canvas')).toHaveAttribute('data-quality','standard')}
 }
})
