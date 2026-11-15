import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { VitalsSimulator } from './services/vitalsSimulator.js'
import { RadiationCalculator } from './services/radiationCalculator.js'
import { StorageService } from './services/storageService.js'
import { MusculoskeletalCalculator, AIDiagnosticsEngine, SleepTracker } from './services/index.js'

export const crewProfiles = [
  { id: 'crew-01', displayName: 'Alex Morgan', role: 'Mission commander', callSign: 'Aster', fictional: true },
  { id: 'crew-02', displayName: 'Sam Rivera', role: 'Flight engineer', callSign: 'Vega', fictional: true },
]
const logKeys = ['moodLogs', 'exerciseLogs', 'sansAssessments', 'sleepLogs', 'emergencyEvents']
export const inactiveEmergency = () => ({ isActive: false, type: null, timestamp: null, protocol: null })

/** One server clock; independent engines/records per canonical frontend crew ID. */
export function createRuntime({ file = null, tickMs = 1000 } = {}) {
  const contexts = new Map()
  let saved = { version: 1, crews: {} }
  if (file && existsSync(file)) {
    saved = JSON.parse(readFileSync(file, 'utf8'))
    if (saved.version !== 1 || !saved.crews || typeof saved.crews !== 'object') throw new Error('Invalid saved demo data schema; original file was preserved')
  }
  for (const profile of crewProfiles) {
    const storage = new StorageService()
    storage.memoryStore.astronautProfile = { ...profile, missionDay: 85 }
    const previous = saved.crews[profile.id]
    if (previous) {
      for (const key of logKeys) {
        if (!Array.isArray(previous[key]) || previous[key].some(row => !row || typeof row.id !== 'string' || !Number.isFinite(Date.parse(row.timestamp)))) throw new Error(`Invalid saved ${key}; original file was preserved`)
        storage.memoryStore[key] = previous[key].slice(0, 200)
      }
    }
    const vitals = new VitalsSimulator(profile.id)
    const radiation = new RadiationCalculator(Number.isFinite(previous?.dose) ? previous.dose : 42.5, 85)
    if (previous?.mode) vitals.setMode(previous.mode)
    const context = { profile, storage, vitals, radiation, emergency: inactiveEmergency(), observations: previous?.observations ?? [] }
    contexts.set(profile.id, context)
  }
  function persist() {
    if (!file) return
    const crews = Object.fromEntries([...contexts].map(([id, context]) => [id, {
      ...Object.fromEntries(logKeys.map(key => [key, context.storage.memoryStore[key].slice(0, 200)])),
      dose: context.radiation.cumulativeDoseMsv, mode: context.vitals.getMode(), observations: context.observations,
    }]))
    mkdirSync(dirname(file), { recursive: true })
    const temporary = `${file}.tmp`
    writeFileSync(temporary, JSON.stringify({ version: 1, crews }), { mode: 0o600 })
    renameSync(temporary, file)
  }
  for (const context of contexts.values()) {
    // Persist after bounded mutations, not on every telemetry tick.
    context.storage._saveToStorage = () => {
      for (const key of logKeys) context.storage.memoryStore[key] = context.storage.memoryStore[key].slice(0, 200)
      persist()
    }
  }
  function tick() {
    for (const context of contexts.values()) {
      context.vitals.step()
      context.radiation.sampleSensor(context.vitals.getMode() === 'SOLAR_FLARE')
    }
  }
  tick()
  const interval = tickMs > 0 ? setInterval(tick, tickMs) : null
  interval?.unref()
  return { contexts, tick, persist, close() { if (interval) clearInterval(interval); persist() } }
}

export function diagnosticsFor(context) {
  return AIDiagnosticsEngine.runDiagnosticScan({
    vitals: context.vitals.getSnapshot(), radiation: context.radiation.getTelemetry(),
    sans: context.storage.getSANSAssessments()[0] ?? null,
    sleep: context.storage.getSleepLogs()[0] ?? null,
    mood: context.storage.getMoodLogs()[0] ?? null,
  })
}
const severity = status => ({ NOMINAL: 'nominal', OPTIMAL: 'nominal', WARNING: 'attention', ELEVATED: 'attention', MILD_FATIGUE: 'attention', CRITICAL: 'critical', CRITICAL_SPE: 'critical', SEVERE_SLEEP_DEBT: 'attention' }[status] ?? 'unknown')
function metric(id, value, unit, measuredAt, status) {
  const valid = typeof value === 'number' && Number.isFinite(value)
  return { id, value: valid ? value : null, unit, measuredAt, quality: valid ? 'valid' : 'missing', severity: valid ? severity(status) : 'unknown', source: 'external' }
}

/** Adapter changes units/signs only; all medical calculations stay in supplied services. */
export function stateFor(context) {
  const crewId = context.profile.id, v = context.vitals.getSnapshot(), r = context.radiation.getTelemetry()
  const time = v.timestamp, logs = context.storage, sleep = logs.getSleepLogs()[0], mood = logs.getMoodLogs()[0]
  const exerciseLogs = logs.getExerciseLogs(), completed = exerciseLogs.filter(row => row.completed !== false)
  const physical = MusculoskeletalCalculator.assessLoss(logs.getProfile().missionDay, completed)
  const diagnostic = diagnosticsFor(context)
  const alertStatus = codes => {
    const alerts = v.activeAlerts.filter(alert => codes.includes(alert.code))
    return alerts.some(a => a.level === 'CRITICAL') ? 'CRITICAL' : alerts.length ? 'WARNING' : 'NOMINAL'
  }
  const snapshot = {
    schemaVersion: 1, crewId, scenarioId: context.vitals.getMode(), capturedAt: time, source: 'external',
    biometrics: {
      heartRate: metric('heart-rate', v.heartRate, 'bpm', time, alertStatus(['HEART_RATE_EXTREME', 'HEART_RATE_ELEVATED'])),
      systolicPressure: metric('systolic', v.bloodPressure.systolic, 'mmHg', time, alertStatus(['BLOOD_PRESSURE_LOW'])),
      diastolicPressure: metric('diastolic', v.bloodPressure.diastolic, 'mmHg', time, alertStatus(['BLOOD_PRESSURE_LOW'])),
      oxygenSaturation: metric('spo2', v.spo2, '%', time, alertStatus(['SPO2_SEVERELY_LOW', 'SPO2_DEGRADED'])),
      heartRateVariability: metric('hrv', v.hrv, 'ms', time, alertStatus(['HRV_EXHAUSTION'])),
    },
    radiation: {
      doseRate: metric('dose-rate', r.totalInstantRate * 1000, 'µSv/h', r.timestamp, r.alertLevel),
      cumulativeDose: metric('cumulative-dose', r.cumulativeDoseMsv, 'mSv', r.timestamp, null),
      periodStart: context.radiation.getHistory()[0]?.timestamp ?? r.timestamp,
      environment: context.vitals.getMode() === 'SOLAR_FLARE' ? 'SPE-demo' : 'GCR-demo',
    },
    sleep: { id: sleep?.id ?? `sleep-${crewId}`, crewId, start: sleep?.start ?? time, end: sleep?.end ?? time,
      duration: metric('sleep-duration', sleep?.hoursSlept, 'h', sleep?.timestamp ?? time, sleep?.status), suppliedScore: sleep?.sleepScore ?? null },
    physical: { id: `physical-${crewId}`, crewId, recordedAt: time, questionnaireVersion: 'draft-1', symptoms: context.observations,
      boneDensityChange: metric('bone-change', -physical.netBoneLossPct, '%', time, physical.status),
      muscleMassChange: metric('muscle-change', -physical.netMuscleLossPct, '%', time, physical.status),
      exerciseMinutes: completed.reduce((sum, row) => sum + row.durationMin, 0) },
    wellbeing: { id: mood?.id ?? `mood-${crewId}`, crewId, recordedAt: mood?.timestamp ?? time,
      mood: mood?.moodScore ?? null, stress: mood?.stressScore ?? null, scale: { min: 1, max: 10 }, note: mood?.notes ?? '' },
    diagnostic: { id: `diagnostic-${crewId}`, crewId, generatedAt: diagnostic.timestamp, source: 'external', kind: 'supplied-result',
      summary: diagnostic.summary, evidenceIds: diagnostic.findings.map(row => row.code), contentVersion: 'saad-demo-1' },
  }
  return {
    schemaVersion: 1, crewId, simulation: true, reviewStatus: 'draft', mode: context.vitals.getMode(), snapshot,
    heartRateHistory: context.vitals.getHistory().map(row => ({ measuredAt: row.timestamp, bpm: row.heartRate })),
    radiationHistory: context.radiation.getHistory().map(row => ({ measuredAt: row.timestamp, doseRate: row.totalInstantRate * 1000, cumulativeDose: row.cumulativeDoseMsv, neutronDoseRate: row.cansNeutronDoseRate * 1000 })),
    records: { exercises: exerciseLogs, checkIns: logs.getMoodLogs(), sleep: logs.getSleepLogs(), sans: logs.getSANSAssessments() },
    diagnostics: diagnostic, emergency: context.emergency,
    limitations: ['Fictional backend simulation; no astronaut sensors', 'Unvalidated educational calculations; not medical advice', 'Radiation accumulation is accelerated 10x'],
  }
}

export { SleepTracker }
