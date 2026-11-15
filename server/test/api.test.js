import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { once } from 'node:events'
import { createApp } from '../app.js'
import { createRuntime, stateFor } from '../runtime.js'

async function fixture(t, options = {}) {
  const runtime = createRuntime({ tickMs: 0, ...options })
  const server = createApp(runtime, { origins: ['http://127.0.0.1:5187'], staticDir: options.staticDir ?? null }).listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(() => new Promise(resolve => { server.close(() => { runtime.close(); resolve() }); server.closeAllConnections() }))
  const base = `http://127.0.0.1:${server.address().port}`
  const get = async path => { const res = await fetch(base + path); return { status: res.status, body: await res.json() } }
  const post = async (path, data, method = 'POST') => {
    const res = await fetch(base + path, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    return { status: res.status, body: await res.json() }
  }
  return { runtime, base, get, post }
}

test('health, crew and every read endpoint return scoped simulation data', async t => {
  const { get } = await fixture(t)
  assert.equal((await get('/api/health-check')).body.status, 'ONLINE')
  assert.equal((await get('/api/crew')).body.length, 2)
  for (const path of ['/vitals','/vitals/history','/radiation/cans','/radiation/history','/health/musculoskeletal','/health/exercise-logs','/health/sans-assessments','/health/sleep-logs','/health/mental-logs','/ai/diagnostics','/emergency/status']) {
    const res = await get(`/api${path}?crewId=crew-02`)
    assert.equal(res.status, 200, path); assert.equal(res.body.crewId, 'crew-02'); assert.equal(res.body.simulation, true)
  }
})
test('crew simulators and emergency scenarios remain independent', async t => {
  const { get, post, runtime } = await fixture(t)
  await post('/api/vitals/mode?crewId=crew-02', { mode: 'HYPOXIA_EVENT' })
  for (let i = 0; i < 20; i++) runtime.tick()
  const a = (await get('/api/crew/crew-01/state')).body, b = (await get('/api/crew/crew-02/state')).body
  assert.equal(a.mode, 'NOMINAL'); assert.equal(b.mode, 'HYPOXIA_EVENT')
  assert.equal(a.snapshot.biometrics.oxygenSaturation.severity, 'nominal'); assert.equal(b.snapshot.biometrics.oxygenSaturation.severity, 'critical')
  assert.equal(b.snapshot.crewId, 'crew-02'); assert.equal(b.snapshot.sleep.duration.value, null)
  await post('/api/emergency/trigger?crewId=crew-02', { emergencyType: 'RAPID_DEPRESS' })
  assert.equal((await get('/api/emergency/status?crewId=crew-01')).body.data.isActive, false)
  assert.equal((await get('/api/emergency/status?crewId=crew-02')).body.data.isActive, true)
  assert.equal((await post('/api/emergency/clear?crewId=crew-02', {})).body.data.isActive, false)
})
test('exercise plans, completion and calculations share one crew record', async t => {
  const { get, post } = await fixture(t)
  const initial = (await get('/api/health/musculoskeletal')).body.data
  const entry = (await post('/api/health/exercise-log', { type:'ARED', durationMin:120, intensityPercent:100, date:'2026-11-15', completed:false })).body.data
  assert.equal((await get('/api/health/musculoskeletal')).body.data.netBoneLossPct, initial.netBoneLossPct)
  await post(`/api/health/exercise-log/${entry.id}`, { completed:true }, 'PATCH')
  assert.ok((await get('/api/health/musculoskeletal')).body.data.netBoneLossPct < initial.netBoneLossPct)
  assert.equal((await get('/api/health/exercise-logs?crewId=crew-02')).body.data.length, 0)
})
test('sleep, wellbeing and self-reported SANS retain explicit data without manufacturing grades', async t => {
  const { get, post } = await fixture(t)
  assert.equal((await post('/api/health/mental-checkin',{moodScore:4,stressScore:2,notes:'fictional test'})).status,200)
  assert.equal((await post('/api/health/sleep-log',{start:'2026-11-14T22:00:00Z',end:'2026-11-15T06:00:00Z',hoursSlept:7,awakeningsCount:1,remFractionPct:25,lightExposureSync:true})).status,200)
  const sans = await post('/api/health/sans-assessment',{symptoms:[{questionId:'blur-near',answer:null}]})
  assert.equal(sans.body.data.evaluation,null)
  const state = (await get('/api/crew/crew-01/state')).body
  assert.equal(state.snapshot.sleep.duration.value,7);assert.equal(state.snapshot.wellbeing.mood,4)
  assert.equal(state.snapshot.wellbeing.scale.max,10);assert.equal(state.snapshot.physical.symptoms[0].answer,null)
  const instrument = await post('/api/health/sans-assessment',{frisenGrade:3,headacheSeverity:7,blurredNearVision:true,globeFlatteningPresent:true,cottonWoolSpots:false,choroidalFolds:false})
  assert.equal(instrument.body.data.riskLevel,'HIGH')
  assert.equal((await post('/api/ai/assist',{message:'explain vitals'})).body.data.kind,'rule-based-demo')
})
test('units, history bounds and missing values match frontend contracts', async t => {
  const { runtime } = await fixture(t)
  for(let i=0;i<45;i++)runtime.tick()
  const context=runtime.contexts.get('crew-01'), state=stateFor(context)
  assert.equal(state.heartRateHistory.length,30)
  assert.equal(state.snapshot.radiation.doseRate.value,context.radiation.getTelemetry().totalInstantRate*1000)
  assert.equal(state.snapshot.physical.boneDensityChange.value < 0,true)
  assert.equal(state.snapshot.sleep.duration.quality,'missing');assert.equal(state.snapshot.sleep.duration.severity,'unknown')
  assert.equal(state.snapshot.radiation.cumulativeDose.severity,'unknown')
})
test('zero exercise intensity remains zero rather than receiving a default credit', async t => {
  const {get,post}=await fixture(t)
  const before=(await get('/api/health/musculoskeletal')).body.data
  await post('/api/health/exercise-log',{type:'ARED',durationMin:120,intensityPercent:0,date:'2026-11-15',completed:true})
  const after=(await get('/api/health/musculoskeletal')).body.data
  assert.equal(after.netBoneLossPct,before.netBoneLossPct)
  assert.equal(after.complianceRatio,0)
})
test('validation rejects invalid, malformed, oversized, unknown crew and cross-origin writes', async t => {
  const {get,post,base}=await fixture(t)
  assert.equal((await get('/api/crew/missing/state')).status,404)
  assert.equal((await get('/api/vitals?crewId=missing')).status,404)
  for(const [path,body] of [['/vitals/mode',{mode:'not-real'}],['/health/mental-checkin',{moodScore:null,stressScore:2}],['/health/mental-checkin',{moodScore:0,stressScore:2}],['/health/exercise-log',{type:'CYCLE',durationMin:-1}],['/health/sans-assessment',{}],['/health/sleep-log',{start:'bad',end:'bad'}],['/emergency/trigger',{emergencyType:'TOXIC_LEAK'}]])assert.equal((await post('/api'+path,body)).status,400,path)
  assert.equal((await fetch(base+'/api/vitals/mode',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'})).status,400)
  assert.equal((await post('/api/ai/assist',{message:'x'.repeat(17000)})).status,413)
  assert.equal((await fetch(base+'/api/emergency/trigger',{method:'POST',headers:{Origin:'https://untrusted.invalid','Content-Type':'application/json'},body:'{}'})).status,403)
  assert.equal((await fetch(base+'/api/emergency/clear',{method:'POST',body:'{}'})).status,415)
})
test('atomic file persistence restores bounded per-crew records after restart', async t => {
  const directory=mkdtempSync(join(tmpdir(),'orbital-api-'));t.after(()=>rmSync(directory,{recursive:true,force:true}))
  const file=join(directory,'demo.json'),{post}=await fixture(t,{file})
  await post('/api/health/mental-checkin?crewId=crew-02',{moodScore:6,stressScore:3,notes:'restart test'})
  const restarted=createRuntime({file,tickMs:0});t.after(()=>restarted.close())
  assert.equal(restarted.contexts.get('crew-02').storage.getMoodLogs()[0].notes,'restart test')
  assert.equal(restarted.contexts.get('crew-01').storage.getMoodLogs().length,0)
})
test('corrupted persistence fails explicitly instead of overwriting user records', t => {
  const directory=mkdtempSync(join(tmpdir(),'orbital-corrupt-'));t.after(()=>rmSync(directory,{recursive:true,force:true}))
  const file=join(directory,'demo.json');writeFileSync(file,'{"version":99,"crews":{}}')
  assert.throws(()=>createRuntime({file,tickMs:0}),/Invalid saved demo data/)
})
test('single-server build hosting supports deep links and keeps API errors as JSON', async t => {
  const directory=mkdtempSync(join(tmpdir(),'orbital-host-'));t.after(()=>rmSync(directory,{recursive:true,force:true}))
  writeFileSync(join(directory,'index.html'),'<html><title>Orbital fixture</title></html>')
  const {base}=await fixture(t,{staticDir:directory})
  const route=await fetch(base+'/bay/physical?crew=crew-02',{headers:{Accept:'text/html'}})
  assert.equal(route.status,200);assert.match(await route.text(),/Orbital fixture/)
  assert.equal((await fetch(base+'/missing.js')).status,404)
  const missing=await fetch(base+'/api/not-a-route');assert.equal(missing.status,404);assert.match(missing.headers.get('content-type'),/application\/json/)
})
