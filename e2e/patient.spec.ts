import {test,expect} from './fixtures'

test('licensed patient, breathing, scan timing, crew isolation and cache persistence',async({page})=>{
 await page.addInitScript(()=>{window.__orbitalProbe={active:false,frames:[],react:[],lifecycles:[],resources:[]}})
 const errors:string[]=[],requests:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('/patient/')&&r.url().includes('.glb'))requests.push(r.url())})
 await page.goto('/bay/physical');await expect(page.getByTestId('environment-status')).toHaveAttribute('data-state','ready')
 const canvas=page.locator('canvas'),renderer=await canvas.getAttribute('data-renderer-instance')
 await page.getByRole('button',{name:'Prepare examination'}).click();await expect(canvas).toHaveAttribute('data-patient-visible','true');await expect(canvas).toHaveAttribute('data-restraints','released')
 const first=await canvas.getAttribute('data-chest-expansion');await page.waitForTimeout(1100);expect(await canvas.getAttribute('data-chest-expansion')).not.toBe(first)
 await page.getByRole('button',{name:'Chest',exact:true}).click();await expect(page.getByRole('definition').filter({hasText:'72 bpm'})).toBeVisible()
 await page.getByRole('button',{name:'Head and eyes',exact:true}).click();await expect(page.getByRole('link',{name:/Review this crew member/})).toBeVisible()
 await page.getByRole('button',{name:'Start examination',exact:true}).click();await page.getByRole('button',{name:'Start demonstration scan'}).click();await expect(canvas).toHaveAttribute('data-examination-state','SCAN_ACTIVE');await page.waitForTimeout(800);const p=Number(await canvas.getAttribute('data-scan-progress'));expect(p).toBeGreaterThan(.05);expect(p).toBeLessThan(.8)
 await expect(canvas).toHaveAttribute('data-examination-state','EXAMINATION_COMPLETE',{timeout:8000})
 await page.getByRole('button',{name:'Chest',exact:true}).click();await expect(canvas).toHaveAttribute('data-patient-region','Chest')
 await page.getByRole('button',{name:'Close mission view'}).click();await expect(page.getByRole('dialog')).not.toBeVisible();const head=await page.evaluate(()=>window.__orbitalProbe!.projectPoint!([-.4,1.56,-1.06]));await page.mouse.click(head.x,head.y);await expect(canvas).toHaveAttribute('data-patient-region','Head and eyes');await page.getByRole('button',{name:/Crew/}).click();await page.getByRole('combobox',{name:'Astronaut',exact:true}).selectOption('crew-02');await expect(canvas).toHaveAttribute('data-patient-crew','crew-02');await expect(canvas).toHaveAttribute('data-patient-visible','true')
 await page.getByRole('combobox',{name:'Astronaut',exact:true}).selectOption('crew-01');await expect(canvas).toHaveAttribute('data-patient-visible','true');expect(await canvas.getAttribute('data-renderer-instance')).toBe(renderer);expect(requests).toHaveLength(1);expect(errors).toEqual([])
})

test('reduced motion keeps respiration static and examination controls usable',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/bay/physical');await expect(page.getByTestId('environment-status')).toHaveAttribute('data-state','ready');await page.getByRole('button',{name:'Prepare examination'}).click();const canvas=page.locator('canvas');await expect(canvas).toHaveAttribute('data-breathing','reduced');await expect(canvas).toHaveAttribute('data-chest-expansion','0.0000');await page.waitForTimeout(400);await expect(canvas).toHaveAttribute('data-chest-expansion','0.0000');await page.getByRole('button',{name:'Clear examination'}).click();await expect(canvas).toHaveAttribute('data-patient-visible','false')
})

test('failed patient load leaves the room usable and retries independently',async({page})=>{
 await page.route('**/patient-examination.glb*',route=>route.abort());await page.goto('/bay/physical');await expect(page.getByTestId('environment-status')).toHaveAttribute('data-state','fallback');await expect(page.locator('canvas')).toHaveAttribute('data-renderer-instance',/renderer/);const renderer=await page.locator('canvas').getAttribute('data-renderer-instance');const retry=page.getByRole('dialog').getByRole('button',{name:'Retry patient asset'});await expect(retry).toBeVisible();await page.unroute('**/patient-examination.glb*');await retry.click();await expect(page.locator('canvas')).toHaveAttribute('data-patient-visible','true');expect(await page.locator('canvas').getAttribute('data-renderer-instance')).toBe(renderer)
})

test('WebGL recovery retains patient data and cached model after examination',async({page})=>{
 const requests:string[]=[];page.on('request',r=>{if(r.url().includes('/patient/')&&r.url().includes('.glb'))requests.push(r.url())});await page.goto('/bay/physical');await expect(page.getByTestId('environment-status')).toHaveAttribute('data-state','ready');await page.getByRole('button',{name:'Prepare examination'}).click();await expect(page.locator('canvas')).toHaveAttribute('data-patient-visible','true');await page.locator('canvas').evaluate(c=>(c as HTMLCanvasElement).getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext());await expect(page.getByTestId('environment-status')).toHaveAttribute('data-state','fallback');await page.getByRole('button',{name:'Close mission view'}).click();await page.getByRole('button',{name:'Retry 3D view'}).first().click();await expect(page.getByTestId('environment-status')).toHaveAttribute('data-state','ready');await expect(page.locator('canvas')).toHaveAttribute('data-patient-visible','true');expect(requests).toHaveLength(1)
})
