import {expect,test} from './fixtures'
import{chapter,ready,settled}from'./helpers'

test('native scrolling moves through three real camera compositions and reverses without route reconstruction',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/?quality=low');await ready(page);await settled(page)
 const original=await page.locator('canvas').elementHandle();const poses=[]
 for(const progress of [0,.5,1,1.5,2,1,0]){await page.evaluate(p=>window.scrollTo(0,p*innerHeight),progress);await expect.poll(async()=>JSON.parse((await page.locator('canvas').getAttribute('data-camera-pose'))!).progress).toBeCloseTo(progress,2);await settled(page);poses.push(JSON.parse((await page.locator('canvas').getAttribute('data-camera-pose'))!).position)}
 expect(poses[0]).not.toEqual(poses[2]);expect(poses[2]).not.toEqual(poses[4]);expect(poses[6]).toEqual(poses[0]);expect(await page.locator('canvas').evaluate((n,o)=>n===o,original)).toBe(true)
 await chapter(page,'Explore');await page.getByRole('button',{name:/Diagnostic scanner/}).click();await expect(page.locator('canvas')).toHaveAttribute('data-camera-owner','inspection');await chapter(page,'Biometrics');await expect(page.locator('canvas')).toHaveAttribute('data-camera-owner','navigation');await settled(page)
})

test('reduced motion cuts between chapters and optional mobile 3D stays mounted after enablement',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/bay/vitals?quality=low');await expect(page.locator('canvas')).toHaveCount(0);await expect(page.getByRole('heading',{name:'Alex Morgan'})).toBeVisible()
 await page.getByRole('button',{name:'Enable 3D view'}).click();await ready(page);await expect(page.locator('canvas')).toHaveAttribute('data-camera-transition','settled')
 const original=await page.locator('canvas').elementHandle();await chapter(page,'Arrival');await settled(page)
 const start=JSON.parse((await page.locator('canvas').getAttribute('data-camera-pose'))!).position
 await page.evaluate(()=>window.scrollTo(0,innerHeight*.2));await page.waitForTimeout(200);expect(JSON.parse((await page.locator('canvas').getAttribute('data-camera-pose'))!).position).toEqual(start)
 await chapter(page,'Explore');await settled(page);expect(JSON.parse((await page.locator('canvas').getAttribute('data-camera-pose'))!).position).not.toEqual(start)
 await page.setViewportSize({width:1024,height:900});expect(await page.locator('canvas').evaluate((n,o)=>n===o,original)).toBe(true)
})
