import type { AstronautProfile, CrewSnapshot, Measurement, ProtocolContent } from '../domain/contracts'

export const fixtureTime = '2026-11-14T06:00:00Z'
export const crew: readonly AstronautProfile[] = [
  { id: 'crew-01', displayName: 'Alex Morgan', role: 'Mission commander', callSign: 'Aster', fictional: true },
  { id: 'crew-02', displayName: 'Sam Rivera', role: 'Flight engineer', callSign: 'Vega', fictional: true },
]

function metric<U extends string>(id: string, value: number | null, unit: U): Measurement<U> {
  return { id, value, unit, measuredAt: fixtureTime, quality: value === null ? 'missing' : 'valid', severity: 'unknown', source: 'simulated-fixture' }
}

function makeSnapshot(crewId: string, heartRate: number): CrewSnapshot {
  return {
    schemaVersion: 1, crewId, scenarioId: 'foundation-demo', capturedAt: fixtureTime, source: 'simulated-fixture',
    biometrics: {
      heartRate: metric('heart-rate', heartRate, 'bpm'),
      systolicPressure: metric('systolic', 118, 'mmHg'),
      diastolicPressure: metric('diastolic', 76, 'mmHg'),
      oxygenSaturation: metric('spo2', 98, '%'),
      heartRateVariability: metric('hrv', crewId === 'crew-01' ? 46 : 38, 'ms'),
    },
    radiation: { doseRate: metric('dose-rate', crewId === 'crew-01' ? 18 : 21, 'µSv/h'), cumulativeDose: metric('cumulative-dose', crewId === 'crew-01' ? .4 : .35, 'mSv'), periodStart: '2026-11-13T06:00:00Z', environment: 'GCR-demo' },
    sleep: { id: `sleep-${crewId}`, crewId, start: crewId === 'crew-01' ? '2026-11-13T22:00:00Z' : '2026-11-13T22:30:00Z', end: fixtureTime, duration: metric('sleep-duration', crewId === 'crew-01' ? 8 : 7.5, 'h'), suppliedScore: crewId === 'crew-01' ? 84 : 76 },
    physical: { id: `physical-${crewId}`, crewId, recordedAt: fixtureTime, questionnaireVersion: 'draft-1', symptoms: [], boneDensityChange: metric('bone-change', crewId === 'crew-01' ? -.7 : -.4, '%'), muscleMassChange: metric('muscle-change', crewId === 'crew-01' ? -1.1 : -.6, '%'), exerciseMinutes: null },
    wellbeing: { id: `wellbeing-${crewId}`, crewId, recordedAt: fixtureTime, mood: null, stress: null, scale: { min: 1, max: 5 }, note: '' },
    diagnostic: { id: `diagnostic-${crewId}`, crewId, generatedAt: fixtureTime, source: 'simulated-fixture', kind: 'scripted-demo', summary: 'No analysis performed. This entry verifies the diagnostic message interface.', evidenceIds: ['heart-rate'], contentVersion: 'draft-1' },
  }
}

const snapshots: Readonly<Record<string, CrewSnapshot>> = {
  'crew-01': makeSnapshot('crew-01', 72),
  'crew-02': makeSnapshot('crew-02', 81),
}

/** Static lookup only: no service, streaming, random values, calculation or storage. */
export function getFixtureSnapshot(crewId: string): CrewSnapshot | undefined {
  return snapshots[crewId]
}

export const demoProtocol: ProtocolContent = {
  id: 'foundation-protocol', version: 'draft-1', title: 'Emergency interface rehearsal', reviewStatus: 'draft', simulationOnly: true,
  steps: [
    { id: 'demo-1', text: 'This is a navigation rehearsal. No emergency has been detected.' },
    { id: 'demo-2', text: 'Operational medical instructions will be supplied after domain review.' },
  ],
  references: [],
}
