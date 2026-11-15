import express from 'express'
import cors from 'cors'
import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'
import { crewProfiles, stateFor, diagnosticsFor, inactiveEmergency } from './runtime.js'
import { SIMULATION_MODES } from './services/vitalsSimulator.js'
import { MusculoskeletalCalculator, SANSCalculator, SleepTracker, AIDiagnosticsEngine } from './services/index.js'
import { InputError, object, number, text, boolean, oneOf, date } from './validation.js'

export function createApp(runtime, { origins = [], staticDir = null } = {}) {
  const app = express()
  app.disable('x-powered-by')
  app.use('/api', (req, res, next) => {
    res.set({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
    if (req.headers.origin && !origins.includes(req.headers.origin)) return res.status(403).json({ error: 'Origin is not allowed' })
    next()
  }, cors({ origin: origins, methods: ['GET', 'POST', 'PATCH'], maxAge: 600 }), express.json({ limit: '16kb' }))
  const writes = new Map()
  app.use('/api', (req, res, next) => {
    if (!['POST', 'PATCH'].includes(req.method)) return next()
    if (!req.is('application/json')) return res.status(415).json({ error: 'Use application/json' })
    const now = Date.now(), key = req.ip
    for (const [ip, window] of writes) if (now - window.start > 60000) writes.delete(ip)
    const window = writes.get(key) ?? { start: now, count: 0 }
    window.count++; writes.set(key, window)
    if (window.count > 120) return res.status(429).json({ error: 'Too many demo writes; try again shortly' })
    next()
  })
  app.get('/api/health-check', (_req, res) => res.json({ status: 'ONLINE', simulation: true, schemaVersion: 1, uptimeSeconds: process.uptime() }))
  app.get('/api/crew', (_req, res) => res.json(crewProfiles))
  app.get('/api/crew/:crewId/state', (req, res) => {
    const context = runtime.contexts.get(req.params.crewId)
    if (!context) return res.status(404).json({ error: 'Unknown fictional crew member' })
    res.json(stateFor(context))
  })
  app.use('/api', (req, res, next) => {
    const id = req.query.crewId ?? 'crew-01'
    if (typeof id !== 'string' || !runtime.contexts.has(id)) return res.status(404).json({ error: 'Unknown fictional crew member' })
    res.locals.context = runtime.contexts.get(id)
    next()
  })
  const withCrew = (handler) => (req, res) => {
    const context = res.locals.context
    const result = handler(context, req)
    res.json({ crewId: context.profile.id, simulation: true, reviewStatus: 'draft', data: result })
  }
  app.get('/api/vitals', withCrew(c => c.vitals.getSnapshot()))
  app.get('/api/vitals/history', withCrew(c => c.vitals.getHistory()))
  app.post('/api/vitals/mode', withCrew((c, req) => {
    const mode = oneOf(object(req.body).mode, Object.values(SIMULATION_MODES), 'simulation mode')
    c.vitals.setMode(mode); runtime.tick(); runtime.persist()
    return { activeMode: mode }
  }))
  app.get('/api/radiation/cans', withCrew(c => c.radiation.getTelemetry()))
  app.get('/api/radiation/history', withCrew(c => c.radiation.getHistory()))
  app.get('/api/health/exercise-logs', withCrew(c => c.storage.getExerciseLogs()))
  app.get('/api/health/musculoskeletal', withCrew(c => MusculoskeletalCalculator.assessLoss(c.storage.getProfile().missionDay, c.storage.getExerciseLogs().filter(row => row.completed !== false))))
  app.post('/api/health/exercise-log', withCrew((c, req) => {
    const body = object(req.body)
    const entry = { id: randomUUID(), timestamp: new Date().toISOString(),
      type: oneOf(body.type, ['ARED', 'T2_TREADMILL', 'CYCLE'], 'exercise type'),
      durationMin: number(body.durationMin, 'Duration', 1, 240),
      intensityPercent: number(body.intensityPercent ?? 80, 'Intensity', 0, 100),
      date: date(body.date, 'Session date'), completed: boolean(body.completed ?? false, 'Completed'),
    }
    c.storage.memoryStore.exerciseLogs.unshift(entry); c.storage._saveToStorage()
    return entry
  }))
  app.patch('/api/health/exercise-log/:id', withCrew((c, req) => {
    const entry = c.storage.memoryStore.exerciseLogs.find(row => row.id === req.params.id)
    if (!entry) throw new InputError('Exercise record was not found for this crew')
    entry.completed = boolean(object(req.body).completed, 'Completed'); c.storage._saveToStorage()
    return entry
  }))
  app.get('/api/health/sans-assessments', withCrew(c => c.storage.getSANSAssessments()))
  app.post('/api/health/sans-assessment', withCrew((c, req) => {
    const body = object(req.body)
    if ('symptoms' in body) {
      if (!Array.isArray(body.symptoms) || body.symptoms.length > 8) throw new InputError('At most eight observations are allowed')
      const ids = ['blur-far', 'blur-near', 'headache', 'dimming', 'double', 'pulse-sound', 'eye-pressure', 'nausea']
      const symptoms = body.symptoms.map(row => ({ questionId: oneOf(object(row).questionId, ids, 'question ID'), answer: row.answer === null ? null : boolean(row.answer, 'Answer') }))
      if (new Set(symptoms.map(row => row.questionId)).size !== symptoms.length) throw new InputError('Duplicate question IDs')
      c.observations = symptoms
      return c.storage.saveSANSAssessment({ kind: 'self-report', symptoms, evaluation: null })
    }
    // Instrument observations must be explicit; missing self-reports are never clinical grades.
    const input = {
      frisenGrade: number(body.frisenGrade, 'Frisen grade', 0, 5, true),
      headacheSeverity: number(body.headacheSeverity, 'Headache severity', 0, 10),
      ...Object.fromEntries(['blurredNearVision', 'globeFlatteningPresent', 'cottonWoolSpots', 'choroidalFolds'].map(key => [key, boolean(body[key], key)])),
    }
    return c.storage.saveSANSAssessment({ kind: 'instrument-demo', ...SANSCalculator.evaluate(input) })
  }))
  app.get('/api/health/sleep-logs', withCrew(c => c.storage.getSleepLogs()))
  app.post('/api/health/sleep-log', withCrew((c, req) => {
    const body = object(req.body), start = date(body.start, 'Sleep start'), end = date(body.end, 'Sleep end')
    if (Date.parse(end) <= Date.parse(start)) throw new InputError('Sleep end must follow its start')
    const hoursSlept = number(body.hoursSlept, 'Hours slept', 0, 24)
    if (hoursSlept > (Date.parse(end) - Date.parse(start)) / 3600000 + 0.01) throw new InputError('Hours slept cannot exceed the supplied interval')
    const input = { hoursSlept,
      awakeningsCount: number(body.awakeningsCount, 'Awakenings', 0, 30, true),
      remFractionPct: number(body.remFractionPct, 'REM fraction', 0, 100),
      lightExposureSync: boolean(body.lightExposureSync, 'Light synchronization'),
    }
    return c.storage.saveSleepLog({ start, end, ...input, ...SleepTracker.calculateSleepScore(input) })
  }))
  app.get('/api/health/mental-logs', withCrew(c => c.storage.getMoodLogs()))
  app.post('/api/health/mental-checkin', withCrew((c, req) => {
    const body = object(req.body)
    return c.storage.saveMoodLog({ moodScore: number(body.moodScore, 'Mood', 1, 10, true), stressScore: number(body.stressScore, 'Stress', 1, 10, true), notes: text(body.notes ?? '', 'Note') })
  }))
  app.get('/api/ai/diagnostics', withCrew(c => diagnosticsFor(c)))
  app.post('/api/ai/assist', withCrew((c, req) => {
    const message = text(object(req.body).message, 'Message').trim()
    if (!message) throw new InputError('Message cannot be empty')
    const diagnostic = diagnosticsFor(c), v = c.vitals.getSnapshot()
    return { response: /vital|heart|oxygen|spo2/i.test(message)
      ? `Supplied fictional heart rate: ${v.heartRate} bpm; SpO2: ${v.spo2}%; HRV: ${v.hrv} ms. Backend simulator for ${c.profile.id}. No measured ECG or clinical interpretation.`
      : `Backend rule-engine demonstration for ${c.profile.id}: ${diagnostic.findingsCount} simulated findings. ${diagnostic.summary} This is an unvalidated educational result; no external AI service is called.`,
      kind: 'rule-based-demo' }
  }))
  app.post('/api/emergency/trigger', withCrew((c, req) => {
    const type = oneOf(object(req.body).emergencyType, ['RAPID_DEPRESS', 'SOLAR_SPE', 'CARDIAC_ARREST', 'GENERAL_EMERGENCY'], 'emergency type')
    c.emergency = { isActive: true, type, timestamp: new Date().toISOString(), protocol: AIDiagnosticsEngine.getEmergencyOverrideProtocol(type) }
    c.storage.logEmergencyIncident(c.emergency)
    return c.emergency
  }))
  app.post('/api/emergency/clear', withCrew(c => {
    c.emergency = inactiveEmergency(); c.vitals.setMode('NOMINAL'); runtime.persist()
    return c.emergency
  }))
  app.get('/api/emergency/status', withCrew(c => c.emergency))
  app.use('/api', (_req, res) => res.status(404).json({ error: 'API route not found' }))
  if (staticDir) {
    app.use(express.static(staticDir, { index: false, dotfiles: 'deny' }))
    app.use((req, res, next) => {
      if (req.method !== 'GET' || extname(req.path) || !req.accepts('html')) return next()
      res.sendFile('index.html', { root: staticDir })
    })
  }
  app.use((error, _req, res, _next) => {
    void _next // Express identifies error middleware by its four-argument signature.
    const status = error instanceof InputError || error.type === 'entity.parse.failed' ? 400 : error.type === 'entity.too.large' ? 413 : 500
    if (status === 500) console.error('Demo API request failed:', error.message)
    res.status(status).json({ error: status === 500 ? 'Demo service failed; no record was confirmed' : error.message })
  })
  return app
}
