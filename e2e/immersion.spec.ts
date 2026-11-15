import{expect,test}from'./fixtures'
import{chapter,ready,settled}from'./helpers'

test('biometric instruments display fixture values, interactive ECG and detailed provenance',async({page})=>{
 await page.goto('/bay/vitals?crew=crew-01&quality=low');await ready(page)
 await expect(page.getByRole('heading',{name:'Alex Morgan'})).toBeVisible();await expect(page.getByText('118/76',{exact:true})).toBeVisible();await expect(page.getByText('98 %',{exact:true})).toBeVisible();await expect(page.getByText('46 ms',{exact:true})).toBeVisible();await expect(page.getByText('8 h',{exact:true})).toBeVisible()
 const svg=page.getByRole('img',{name:'Animated simulated ECG; illustrative signal, not a clinical recording'});const before=await svg.locator('polyline').getAttribute('points');await page.getByRole('button',{name:'Inspect trace',exact:true}).click();await expect(page.getByRole('button',{name:'Full trace'})).toHaveAttribute('aria-pressed','true');expect(await svg.locator('polyline').getAttribute('points')).not.toBe(before)
 await page.getByRole('button',{name:'Open detailed biometrics'}).click();await expect(page.getByRole('heading',{name:'Biometric measurements'})).toBeVisible();await expect(page.getByText('72 bpm',{exact:true})).toBeVisible();await page.getByText('Measurement timestamps and quality',{exact:true}).click();await expect(page.getByText('valid / severity unknown').first()).toBeVisible();await expect(page.getByText('2026-11-14T06:00:00Z',{exact:true}).first()).toBeVisible()
})

test('responsive layouts keep mission controls and detailed medical views accessible',async({page})=>{
 for(const width of [320,390,768,1024,1440]){
  await page.setViewportSize({width,height:900});await page.goto('/bay/vitals?crew=crew-02&quality=low');await expect(page.getByRole('heading',{name:'Sam Rivera'})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  await page.getByRole('button',{name:'Emergency rehearsal'}).click();await expect(page.getByRole('button',{name:'Return to station'})).toBeVisible();await page.keyboard.press('Escape')
  await page.getByRole('button',{name:'Open detailed biometrics'}).click();await expect(page.locator('.team-measurement').first().locator('strong')).toHaveText(/^(79|80|81|82) bpm$/);await page.keyboard.press('Escape')
 }
})

test('public experience stays high quality and exposes no tier selector',async({page})=>{
 await page.goto('/?quality=low&devQuality=low');await ready(page);const original=await page.locator('canvas').elementHandle()
 await expect(page.locator('canvas')).toHaveAttribute('data-quality','standard')
 await expect(page.locator('canvas')).toHaveAttribute('data-shadow-policy','static-casters')
 await page.getByRole('button',{name:/Crew and display settings/}).click()
 await expect(page.getByRole('combobox',{name:'Graphics quality'})).toHaveCount(0)
 await page.keyboard.press('Escape');await chapter(page,'Biometrics');await settled(page)
 expect(await page.locator('canvas').evaluate((n,o)=>n===o,original)).toBe(true)
})
