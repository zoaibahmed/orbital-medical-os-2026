import {test,expect} from './fixtures'
import type {Locator,Page} from '@playwright/test'

async function readableControl(page:Page,control:Locator){
 await control.hover();await control.focus();await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');await expect(control).toBeFocused()
 const style=await control.evaluate(element=>{
  const css=getComputedStyle(element)
  const luminance=(color:string)=>{
   const [r,g,b]=(color.match(/[\d.]+/g)??[]).slice(0,3).map(Number).map(v=>{const n=v/255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4})
   return .2126*r!+.7152*g!+.0722*b!
  }
  const a=luminance(css.color),b=luminance(css.backgroundColor)
  return {ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05),height:element.getBoundingClientRect().height,outline:parseFloat(css.outlineWidth)}
 })
 expect(style.ratio).toBeGreaterThanOrEqual(4.5);expect(style.height).toBeGreaterThanOrEqual(44);expect(style.outline).toBeGreaterThanOrEqual(2)
}

test('primary medical and emergency controls retain contrast, hit targets and focus through hover',async({page})=>{
 await page.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,...args:Parameters<typeof get>){return String(args[0]).includes('webgl')?null:get.apply(this,args)} as typeof get})
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/bay/physical')
 await readableControl(page,page.getByRole('button',{name:'Prepare examination',exact:true}))
 await page.getByRole('tab',{name:'Exercise',exact:true}).click();await readableControl(page,page.getByRole('button',{name:'Save exercise plan',exact:true}))
 await page.getByRole('button',{name:'Emergency access',exact:true}).click();await readableControl(page,page.getByRole('button',{name:'Return to station',exact:true}))
 await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible()
 await page.getByRole('button',{name:'Medical index',exact:true}).click();await page.getByRole('navigation',{name:'Medical modules'}).getByRole('button',{name:/Space radiation/}).click()
 expect(await page.getByRole('table').evaluate(n=>parseFloat(getComputedStyle(n).fontSize))).toBeGreaterThanOrEqual(14)
 expect(await page.getByRole('dialog').evaluate(n=>n.scrollWidth<=n.clientWidth)).toBe(true)
})
