import { expect, test } from './fixtures'
import { chapter, ready, settled } from './helpers'
import { PerspectiveCamera, Vector3 } from 'three'

test('five chapter and equipment cycles retain Canvas, cached assets and material identities',async({page})=>{
 test.setTimeout(180000)
 const requests:string[]=[];page.on('request',r=>{if(r.url().includes('.glb'))requests.push(r.url())})
 await page.addInitScript(()=>{window.__orbitalProbe={active:false,frames:[],react:[],lifecycles:[],resources:[]}})
 await page.goto('/?quality=low');await ready(page);await settled(page)
 const canvas=await page.locator('canvas').elementHandle();const id=await page.locator('canvas').getAttribute('data-renderer-instance')
 const before=await page.evaluate(()=>({ids:window.__orbitalProbe!.resourceSnapshot!(),count:window.__orbitalProbe!.resources.length}))
 const requestCount=requests.length
 for(let i=0;i<5;i++){
  await chapter(page,'Biometrics');await settled(page);await expect(page.getByRole('heading',{name:'Alex Morgan'})).toBeVisible()
  await chapter(page,'Explore');await settled(page)
  await page.getByRole('button',{name:/Diagnostic scanner/}).click();await settled(page);await expect(page.locator('canvas')).toHaveAttribute('data-camera-owner','inspection')
  await page.getByRole('button',{name:'Return to chapter'}).click();await settled(page)
  await chapter(page,'Arrival');await settled(page)
 }
 expect(await page.locator('canvas').evaluate((n,original)=>n===original,canvas)).toBe(true)
 expect(await page.locator('canvas').getAttribute('data-renderer-instance')).toBe(id)
 expect(requests.length).toBe(requestCount)
 const after=await page.evaluate(()=>({ids:window.__orbitalProbe!.resourceSnapshot!(),count:window.__orbitalProbe!.resources.length}))
 expect(after).toEqual(before)
 expect(await page.locator('.station-navigation,.camera-views,.opening-app,.bay-shell').count()).toBe(0)
})

test('real mesh hover/click, scanner standby and interrupted inspection use one camera owner',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.emulateMedia({reducedMotion:'reduce'})
 await page.goto('/bay/overview?quality=low');await ready(page);await settled(page)
 const pose=JSON.parse((await page.locator('canvas').getAttribute('data-camera-pose'))!)
 const bounds=(await page.locator('canvas').boundingBox())!
 const camera=new PerspectiveCamera(55,bounds.width/bounds.height,.08,35);camera.position.fromArray(pose.position);camera.lookAt(...pose.target as [number,number,number]);camera.updateMatrixWorld()
 const v=new Vector3(.24,.92,.62).project(camera);const point={x:bounds.x+(v.x+1)*bounds.width/2,y:bounds.y+(1-v.y)*bounds.height/2}
 await page.mouse.move(point.x,point.y);await expect(page.locator('canvas')).toHaveCSS('cursor','pointer');await page.mouse.click(point.x,point.y)
 await expect(page.getByRole('heading',{name:'Examination cradle'})).toBeVisible();await expect(page.locator('canvas')).toHaveAttribute('data-camera-owner','inspection')
 await page.getByRole('button',{name:'Check standby indicator'}).click();await expect(page.locator('canvas')).toHaveAttribute('data-scanner-animation','static')
 await page.emulateMedia({reducedMotion:'no-preference'});await page.getByRole('button',{name:'Check standby indicator'}).click();await expect(page.locator('canvas')).toHaveAttribute('data-scanner-animation','complete')
 await page.evaluate(()=>window.scrollTo(0,innerHeight*1.6));await expect(page.locator('canvas')).toHaveAttribute('data-camera-owner','scroll');await settled(page)
 await expect(page.getByRole('heading',{name:'Alex Morgan'})).toBeVisible()
})

test('failed assets recover without losing medical data and actual context loss can retry',async({page})=>{
 await page.route('**/examination-standard.glb*',r=>r.abort());await page.goto('/bay/vitals?crew=crew-02&quality=low')
 await expect(page.getByTestId('environment-status')).toHaveAttribute('data-state','fallback')
 await expect(page.getByRole('heading',{name:'Sam Rivera'})).toBeVisible()
 await page.unroute('**/examination-standard.glb*');await page.getByRole('button',{name:'Retry 3D view'}).first().click();await ready(page)
 await page.locator('canvas').evaluate(c=>{const ext=(c as HTMLCanvasElement).getContext('webgl2')!.getExtension('WEBGL_lose_context');if(!ext)throw Error('No context loss extension');ext.loseContext()})
 await expect(page.getByTestId('environment-status')).toHaveAttribute('data-state','fallback');await expect(page.getByRole('heading',{name:'Sam Rivera'})).toBeVisible()
 await page.getByRole('button',{name:'Retry 3D view'}).first().click();await ready(page)
})
