import {test,expect,type Page} from '@playwright/test'
import {chapter,ready,settled} from './helpers'

const connection=(page:Page)=>page.locator('.api-connection:visible').first()
async function connected(page:Page){await expect(connection(page)).toHaveAttribute('data-status','connected')}
async function resetModes(page:Page){for(const id of ['crew-01','crew-02'])await page.request.post(`/api/vitals/mode?crewId=${id}`,{data:{mode:'NOMINAL'}})}
test.afterEach(async({page})=>{await resetModes(page)})

test('actual production browser requests update typed crew vitals and preserve one polling owner',async({page})=>{
  await page.setViewportSize({width:390,height:844})
  const requests:string[]=[],errors:string[]=[]
  page.on('request',request=>{if(/\/api\/crew\/.+\/state/.test(request.url()))requests.push(request.url())})
  page.on('pageerror',error=>errors.push(error.message))
  await page.goto('/bay/vitals?crew=crew-01');await connected(page)
  await expect(page.getByTestId('heart-rate')).not.toContainText('Unavailable')
  await page.getByRole('button',{name:/Crew and display settings/}).click()
  await page.getByRole('combobox',{name:'Astronaut'}).selectOption('crew-02');await page.keyboard.press('Escape')
  await connected(page);await expect(connection(page)).toHaveAttribute('data-crew','crew-02')
  await expect(page.getByRole('heading',{name:'Sam Rivera'})).toBeVisible()
  const before=requests.length;await page.waitForTimeout(6500)
  const sampled=requests.slice(before)
  expect(sampled.length).toBeGreaterThanOrEqual(2);expect(sampled.length).toBeLessThanOrEqual(4)
  expect(sampled.every(url=>url.includes('/crew-02/state'))).toBe(true)
  expect(errors).toEqual([])
})

test('exercise and SANS submissions reach the server, survive reload and retain unknown observations',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto('/bay/physical?crew=crew-02');await connected(page)
  const posted=page.waitForResponse(r=>r.url().includes('/api/health/exercise-log?')&&r.request().method()==='POST')
  await page.getByRole('button',{name:'Save exercise plan',exact:true}).click()
  const exercise=(await(await posted).json()).data
  const checkbox=page.locator(`input[data-record-id="${exercise.id}"]`)
  await expect(checkbox).toBeVisible();await checkbox.check()
  await expect(checkbox).toBeChecked()
  await page.getByRole('group',{name:'Distance vision looked blurry'}).getByRole('radio',{name:'Yes',exact:true}).check()
  await page.getByRole('group',{name:'Double vision'}).getByRole('radio',{name:'Unsure',exact:true}).check()
  await page.getByRole('button',{name:'Save SANS observations to backend'}).click()
  await expect(page.getByText(/SANS observations saved\. No clinical grade/)).toBeVisible()
  await page.reload();await connected(page)
  await expect(page.getByRole('group',{name:'Distance vision looked blurry'}).getByRole('radio',{name:'Yes',exact:true})).toBeChecked()
  const state=await(await page.request.get('/api/crew/crew-02/state')).json()
  expect(state.records.exercises.find((row:{id:string})=>row.id===exercise.id).completed).toBe(true)
  expect(state.records.sans[0].evaluation).toBeNull()
  expect(state.snapshot.physical.symptoms.find((row:{questionId:string})=>row.questionId==='double').answer).toBeNull()
})

test('wellbeing, sleep, diagnostic assistant and emergency use real crew-scoped writes',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto('/bay/wellbeing?crew=crew-02');await connected(page)
  const note=`Fictional integration check ${Date.now()}`
  await page.getByLabel('Optional check-in notes').fill(note);await page.getByRole('button',{name:'Save check-in',exact:true}).click()
  await expect(page.getByText(note,{exact:true})).toBeVisible()
  await page.getByLabel('Supplied sleep duration in hours').fill('7')
  await page.getByRole('button',{name:'Save supplied sleep record',exact:true}).click()
  await expect(page.locator('.clinical-section').getByText('7 h',{exact:true})).toBeVisible()
  const saved=await(await page.request.get('/api/crew/crew-02/state')).json()
  expect(saved.snapshot.sleep.duration.value).toBe(7);expect(saved.snapshot.wellbeing.scale.max).toBe(10)
  const other=await(await page.request.get('/api/crew/crew-01/state')).json()
  expect(other.records.checkIns.some((row:{notes:string})=>row.notes===note)).toBe(false)
  await page.goto('/bay/diagnostics?crew=crew-02');await connected(page)
  await expect(page.getByRole('region',{name:'Backend diagnostic findings'})).toBeVisible()
  await page.getByLabel('Ask onboard assistance').fill('explain vitals')
  await page.getByRole('button',{name:'Send message',exact:true}).click()
  await expect(page.getByRole('log')).toContainText('Backend simulator for crew-02')
  await page.getByRole('button',{name:'Emergency access',exact:true}).click()
  await page.getByRole('button',{name:'Elevated radiation event',exact:true}).click()
  await page.getByRole('button',{name:'Register backend rehearsal',exact:true}).click()
  await expect(page.getByText('Backend rehearsal active / SOLAR_SPE',{exact:true})).toBeVisible()
  expect((await(await page.request.get('/api/emergency/status?crewId=crew-01')).json()).data.isActive).toBe(false)
  await page.getByRole('button',{name:'Clear backend rehearsal',exact:true}).click()
  await expect(page.getByText('Backend rehearsal inactive',{exact:true})).toBeVisible()
})

test('radiation controls change the shared backend scenario and show neutron dose units',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto('/bay/radiation?crew=crew-02');await connected(page)
  await page.getByLabel('Radiation environment').selectOption('1')
  await expect(page.getByText(/critical \/ backend scenario SOLAR_FLARE/)).toBeVisible()
  await page.getByLabel('Exposure trend').selectOption('neutronCount')
  await expect(page.getByRole('table')).toContainText('µSv/h neutron dose equivalent')
  const state=await(await page.request.get('/api/crew/crew-02/state')).json()
  expect(state.snapshot.radiation.environment).toBe('SPE-demo')
  expect((await(await page.request.get('/api/crew/crew-01/state')).json()).mode).toBe('NOMINAL')
})

test('malformed API data, outages and recovery never leak a different crew or block emergency',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto('/bay/vitals?crew=crew-02');await connected(page)
  await page.route('**/api/crew/*/state',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({crewId:'crew-01',schemaVersion:1,simulation:true})}))
  await expect(connection(page)).toHaveAttribute('data-status','offline')
  await expect(page.getByTestId('heart-rate')).toContainText(/79|80|81|82/)
  await expect(page.getByRole('heading',{name:'Sam Rivera'})).toBeVisible()
  await page.getByRole('button',{name:'Emergency rehearsal'}).click();await expect(page.getByRole('heading',{name:'Emergency interface rehearsal'})).toBeVisible();await page.keyboard.press('Escape')
  await page.unroute('**/api/crew/*/state')
  await page.route('**/api/crew/*/state',route=>route.abort())
  await page.getByRole('button',{name:'Retry connection',exact:true}).click()
  await expect(connection(page)).toContainText('Backend unavailable')
  await page.unroute('**/api/crew/*/state');await page.getByRole('button',{name:'Retry connection',exact:true}).click();await connected(page)
})

test('crew changes cancel late requests before they can replace the selected astronaut',async({page})=>{
  await page.setViewportSize({width:390,height:844})
  await page.route('**/api/crew/crew-01/state',async route=>{
    const response=await route.fetch();await new Promise(resolve=>setTimeout(resolve,700));await route.fulfill({response})
  })
  await page.goto('/bay/vitals?crew=crew-01')
  await page.getByRole('button',{name:/Crew and display settings/}).click();await page.getByRole('combobox',{name:'Astronaut'}).selectOption('crew-02');await page.keyboard.press('Escape')
  await connected(page);await page.waitForTimeout(900)
  await expect(connection(page)).toHaveAttribute('data-crew','crew-02');await expect(page.getByRole('heading',{name:'Sam Rivera'})).toBeVisible()
})

test('real telemetry preserves the persistent scene, breathing patient, camera ownership and GLB cache',async({page})=>{
  test.setTimeout(180000)
  const glbs:string[]=[];page.on('request',request=>{if(request.url().includes('.glb'))glbs.push(request.url())})
  await page.goto('/bay/vitals?crew=crew-01');await ready(page);await settled(page);await connected(page)
  await expect(page.locator('canvas')).toHaveAttribute('data-monitor-source','backend-simulation')
  await expect(page.locator('canvas')).toHaveAttribute('data-patient-visible','true')
  const canvas=await page.locator('canvas').elementHandle(),count=glbs.length
  await expect.poll(()=>page.evaluate(()=>{
    const canvas=document.querySelector('canvas'),reading=document.querySelector('[data-testid=heart-rate]')?.textContent??''
    return !!canvas?.dataset.monitorReading&&reading.replace(/\s/g,'')===`${canvas.dataset.monitorReading}bpm`
  })).toBe(true)
  for(let i=0;i<5;i++){
    await chapter(page,'Explore');await settled(page)
    await page.getByRole('button',{name:/Diagnostic scanner/}).click();await settled(page)
    await expect(page.locator('canvas')).toHaveAttribute('data-camera-owner','inspection')
    await page.getByRole('button',{name:'Return to chapter'}).click();await settled(page)
    await chapter(page,'Biometrics');await settled(page)
  }
  expect(await page.locator('canvas').evaluate((node,original)=>node===original,canvas)).toBe(true)
  expect(glbs.length).toBe(count)
  await expect(page.locator('canvas')).toHaveAttribute('data-monitor-source','backend-simulation')
})
