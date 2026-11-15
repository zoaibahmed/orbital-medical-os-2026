import {expect,test} from './fixtures'
import {chapter,ready} from './helpers'

test('legacy URLs resolve to the unified identity and all six medical boundaries remain reachable',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message))
 await page.goto('/dashboard/vitals?crew=crew-02');await expect(page.getByRole('heading',{name:'Biometric measurements'})).toBeVisible();await expect(page.getByText('81 bpm',{exact:true})).toBeVisible()
 await page.keyboard.press('Escape');await page.getByRole('button',{name:'Medical index',exact:true}).click()
 for(const name of ['Crew biometrics & vitals','Space radiation monitoring','Physiological & musculoskeletal assessment','Psychological health & wellbeing','AI diagnostics','Emergency protocols'])await expect(page.getByRole('button',{name:new RegExp(name.replace(/[&]/g,'&'))})).toBeVisible()
 await page.getByRole('button',{name:/Space radiation monitoring/}).click();await expect(page.getByRole('heading',{name:'Space radiation monitoring'})).toBeVisible();await expect(page.getByText('21 µSv/h')).toBeVisible()
 await page.keyboard.press('Escape');await expect(page.locator('.station-navigation,.camera-views,.app-header')).toHaveCount(0);expect(errors).toEqual([])
})

test('crew selection updates biometrics atomically and emergency focus survives WebGL unavailability',async({page})=>{
 await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,...args:Parameters<typeof original>){if(String(args[0]).includes('webgl'))return null;return original.apply(this,args)} as typeof original})
 await page.goto('/bay/vitals?crew=crew-01');await expect(page.getByTestId('environment-status')).toHaveAttribute('data-state','fallback')
 await page.getByRole('button',{name:/Crew and display settings/}).click();await page.getByRole('combobox',{name:'Astronaut'}).selectOption('crew-02');await page.keyboard.press('Escape')
 await expect(page.getByRole('heading',{name:'Sam Rivera'})).toBeVisible();await page.getByRole('button',{name:'Open detailed biometrics'}).click();await expect(page.getByText('81 bpm',{exact:true})).toBeVisible();await expect(page.getByText('72 bpm',{exact:true})).toHaveCount(0);await page.keyboard.press('Escape')
 const trigger=page.getByRole('button',{name:'Emergency rehearsal'});await trigger.click();await expect(page.getByRole('button',{name:'Return to station'})).toBeFocused();await page.keyboard.press('Escape');await expect(trigger).toBeFocused()
 await chapter(page,'Explore');await expect(page.getByRole('heading',{name:'Inside the medical bay.'})).toBeVisible()
})

test('keyboard navigation, deep-link reload and browser Back retain the shell',async({page})=>{
 await page.goto('/bay/vitals?crew=crew-02&quality=low');await ready(page)
 await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Skip to main content'})).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('#main-content')).toBeFocused()
 await chapter(page,'Explore');await page.reload();await expect(page.getByRole('heading',{name:'Inside the medical bay.'})).toBeVisible();await page.goBack();await expect(page.getByRole('heading',{name:'Sam Rivera'})).toBeVisible()
})

test('invalid paths and crew retain meaningful recovery',async({page})=>{
 for(const path of ['/bay/unknown?crew=crew-01','/bay/vitals?crew=unknown','/unknown/vitals','/dashboard/vitals?crew=unknown','/bay/radiation?crew=unknown']){await page.goto(path);await expect(page.getByRole('heading',{name:'Station or crew unavailable'})).toBeVisible();await expect(page.getByRole('button',{name:'Return to mission'})).toBeVisible();await expect(page.getByRole('dialog')).not.toBeVisible()}
})
