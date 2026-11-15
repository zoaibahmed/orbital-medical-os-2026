import { expect, test } from './fixtures'
import { chapter, ready, settled } from './helpers'
import { stationDestinations, travelPose } from '../src/scene/navigation/experiencePath'

test('operations identity, contextual interfaces and emergency remain usable across widths', async ({page}) => {
  // This composition check does not depend on a GPU; recovery is part of the product.
  await page.addInitScript(() => { const original=HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,...args:Parameters<typeof original>){if(String(args[0]).includes('webgl'))return null;return original.apply(this,args)} as typeof original })
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message))
  for(const width of [320,390,768,1024,1440]){
    await page.setViewportSize({width,height:900});await page.goto('/')
    await expect(page.getByRole('heading',{name:'Care in orbit.'})).toBeVisible()
    await expect(page.locator('.os-header,.station-navigation,.scene-tools')).toHaveCount(0)
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
    for(const label of ['Medical index','Emergency rehearsal']) await expect(page.getByRole('button',{name:label,exact:true})).toBeInViewport()
    await page.getByRole('button',{name:/Crew and display settings/}).click()
    await page.getByRole('combobox',{name:'Astronaut'}).selectOption('crew-02');await page.keyboard.press('Escape')
    await page.getByRole('button',{name:'Medical index',exact:true}).click()
    for(const label of ['Crew biometrics & vitals','Space radiation monitoring','Physiological & musculoskeletal assessment','Psychological health & wellbeing','AI diagnostics','Emergency protocols']) await expect(page.getByRole('navigation',{name:'Medical modules'}).getByRole('button',{name:new RegExp(label)})).toBeVisible()
    await page.keyboard.press('Escape')
    const emergency=page.getByRole('button',{name:'Emergency rehearsal'});await emergency.click();await expect(page.getByRole('button',{name:'Return to station'})).toBeFocused();await page.keyboard.press('Escape');await expect(emergency).toBeFocused()
    await chapter(page,'Biometrics');await expect(page.getByRole('heading',{name:'Sam Rivera'})).toBeVisible()
  }
  expect(errors).toEqual([])
})

test('accepted high environment is preserved in the new operations composition',async({page})=>{
  await page.goto('/bay/overview');await ready(page)
  await expect(page.locator('canvas')).toHaveCount(1)
  await expect(page.locator('canvas')).toHaveAttribute('data-quality','standard')
  await expect(page.getByRole('heading',{name:'Inside the medical bay.'})).toBeVisible()
})

test('emergency deep link opens the accessible rehearsal directly',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto('/bay/emergency?crew=crew-02')
  await expect(page.getByRole('heading',{name:'Emergency interface rehearsal'})).toBeVisible()
  await expect(page.getByRole('button',{name:'Return to station'})).toBeFocused()
  await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible()
})

test('direct station travel is deliberate, interruptible and frames the actual console',async({page})=>{
  await page.addInitScript(()=>{window.__orbitalProbe={active:false,frames:[],react:[],lifecycles:[],resources:[]}})
  await page.goto('/');await ready(page);await settled(page)
  const positions=[...Object.values(stationDestinations).map(p=>p.position),...[[stationDestinations.arrival,stationDestinations.overview],[stationDestinations.overview,stationDestinations.vitals],[stationDestinations.vitals,stationDestinations.physical]].flatMap(([from,to])=>[.25,.5,.75].map(t=>travelPose(from!,to!,t).position))]
  expect(await page.evaluate(points=>window.__orbitalProbe!.checkClearance!(points),positions)).toEqual({blocked:[],radius:.16})
  const initial=JSON.parse((await page.locator('canvas').getAttribute('data-camera-pose'))!)
  await chapter(page,'Biometrics');await expect(page.locator('canvas')).toHaveAttribute('data-camera-transition','moving')
  await page.waitForTimeout(400)
  const intermediate=JSON.parse((await page.locator('canvas').getAttribute('data-camera-pose'))!)
  expect(intermediate.position).not.toEqual(initial.position)
  expect(intermediate.position[2]).toBeGreaterThan(.65)
  await chapter(page,'Explore');await settled(page)
  let pose=JSON.parse((await page.locator('canvas').getAttribute('data-camera-pose'))!)
  expect(pose.destination).toBe('overview')
  await chapter(page,'Biometrics');await settled(page)
  pose=JSON.parse((await page.locator('canvas').getAttribute('data-camera-pose'))!)
  expect(pose.position).toEqual([2.65,1.98,.65]);expect(pose.target).toEqual([2.15,1.4,-2.2])
  for(const label of ['Space radiation monitoring','Physiological & musculoskeletal assessment','Psychological health & wellbeing','AI diagnostics']){
    await page.getByRole('button',{name:'Medical index',exact:true}).click();await page.getByRole('navigation',{name:'Medical modules'}).getByRole('button',{name:new RegExp(label)}).click()
    await expect(page.getByRole('heading',{name:label,exact:true})).toBeVisible();await settled(page)
    await expect(page.locator('canvas')).toHaveAttribute('data-camera-owner','navigation')
    await page.keyboard.press('Escape')
  }
})
