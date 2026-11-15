import {test,expect} from './fixtures'
import {writeFile,mkdir} from 'node:fs/promises'
import {chapter,ready,settled} from './helpers'

test('stationary room cache preserves sampled colour and patient depth across navigation and resize',async({page})=>{
 await page.addInitScript(()=>{window.__orbitalProbe={active:false,frames:[],react:[],lifecycles:[],resources:[]}})
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/bay/physical');await ready(page);await settled(page);await page.getByRole('button',{name:'Prepare examination'}).click();await expect(page.locator('canvas')).toHaveAttribute('data-patient-visible','true')
 const measurements:Array<{samples:number;meanChannelError:number;maxChannelError:number}>=[]
 const compare=async()=>{const result=await page.evaluate(()=>window.__orbitalProbe!.checkComposite!());console.log(result);expect(result.meanChannelError).toBeLessThan(1.5);expect(result.maxChannelError).toBeLessThan(12);measurements.push(result)}
 await compare();await page.keyboard.press('Escape');await chapter(page,'Biometrics');await settled(page);await compare();await chapter(page,'Explore');await settled(page);await page.setViewportSize({width:1100,height:760});await compare()
 await mkdir('docs/measurements/final',{recursive:true});await writeFile('docs/measurements/final/composite-verification.json',JSON.stringify(measurements,null,2))
})
