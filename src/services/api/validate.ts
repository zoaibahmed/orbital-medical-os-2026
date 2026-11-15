import type { CrewApiState } from './contracts'

type RecordValue = Record<string, unknown>
function object(value: unknown): asserts value is RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Malformed API object')
}
function string(value: unknown): asserts value is string { if (typeof value !== 'string') throw new Error('Malformed API text') }
function date(value: unknown) { string(value); if (!Number.isFinite(Date.parse(value))) throw new Error('Malformed API timestamp') }
function numeric(value: unknown, nullable = false) { if (nullable && value === null) return; if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error('Malformed API number') }
function array(value: unknown, limit = 200): asserts value is unknown[] { if (!Array.isArray(value) || value.length > limit) throw new Error('Malformed API list') }
function literal(value: unknown, choices: readonly unknown[]) { if (!choices.includes(value)) throw new Error('Unsupported API value') }
function measurement(value: unknown, unit: string) {
  object(value); string(value.id); numeric(value.value, true); date(value.measuredAt)
  literal(value.unit, [unit]); literal(value.source, ['external']); literal(value.quality, ['valid','missing','stale','invalid']); literal(value.severity, ['unknown','nominal','attention','critical'])
  if (value.value === null && (value.quality === 'valid' || value.severity !== 'unknown')) throw new Error('Unavailable measurement claims valid data')
}

/** Reject the whole response atomically rather than mixing crew IDs, units or provenance. */
export function parseCrewState(value: unknown, crewId: string): CrewApiState {
  object(value); literal(value.schemaVersion,[1]); literal(value.crewId,[crewId]); literal(value.simulation,[true]); literal(value.reviewStatus,['draft'])
  literal(value.mode,['NOMINAL','EVA_ACTIVE','HYPOXIA_EVENT','SOLAR_FLARE','EMERGENCY_INJURY'])
  const s=value.snapshot; object(s); literal(s.schemaVersion,[1]); literal(s.crewId,[crewId]); literal(s.source,['external']); string(s.scenarioId); date(s.capturedAt)
  const b=s.biometrics; object(b)
  for(const [name,unit] of Object.entries({heartRate:'bpm',systolicPressure:'mmHg',diastolicPressure:'mmHg',oxygenSaturation:'%',heartRateVariability:'ms'}))measurement(b[name],unit)
  const r=s.radiation;object(r);measurement(r.doseRate,'µSv/h');measurement(r.cumulativeDose,'mSv');date(r.periodStart);literal(r.environment,['GCR-demo','SPE-demo','unavailable'])
  const sleep=s.sleep;object(sleep);literal(sleep.crewId,[crewId]);string(sleep.id);date(sleep.start);date(sleep.end);measurement(sleep.duration,'h');numeric(sleep.suppliedScore,true)
  const p=s.physical;object(p);literal(p.crewId,[crewId]);string(p.id);date(p.recordedAt);string(p.questionnaireVersion);measurement(p.boneDensityChange,'%');measurement(p.muscleMassChange,'%');numeric(p.exerciseMinutes,true);array(p.symptoms,8)
  for(const row of p.symptoms){object(row);string(row.questionId);literal(row.answer,[true,false,null])}
  const w=s.wellbeing;object(w);literal(w.crewId,[crewId]);string(w.id);date(w.recordedAt);numeric(w.mood,true);numeric(w.stress,true);string(w.note);object(w.scale);literal(w.scale.min,[1]);literal(w.scale.max,[10])
  const d=s.diagnostic;object(d);literal(d.crewId,[crewId]);string(d.id);string(d.summary);string(d.contentVersion);date(d.generatedAt);literal(d.source,['external']);literal(d.kind,['supplied-result']);array(d.evidenceIds);d.evidenceIds.forEach(string)
  array(value.heartRateHistory,30);for(const row of value.heartRateHistory){object(row);date(row.measuredAt);numeric(row.bpm,true)}
  array(value.radiationHistory,30);for(const row of value.radiationHistory){object(row);date(row.measuredAt);for(const key of ['doseRate','cumulativeDose','neutronDoseRate'])numeric(row[key],true)}
  object(value.records)
  for(const key of ['exercises','checkIns','sleep','sans'])array(value.records[key])
  for(const row of value.records.exercises as unknown[]){object(row);string(row.id);date(row.timestamp);literal(row.type,['ARED','T2_TREADMILL','CYCLE']);numeric(row.durationMin);numeric(row.intensityPercent);date(row.date);literal(row.completed,[true,false])}
  for(const row of value.records.checkIns as unknown[]){object(row);string(row.id);date(row.timestamp);numeric(row.moodScore);numeric(row.stressScore);string(row.notes)}
  for(const row of value.records.sleep as unknown[]){object(row);string(row.id);date(row.timestamp);date(row.start);date(row.end);numeric(row.hoursSlept);numeric(row.sleepScore)}
  const diag=value.diagnostics;object(diag);date(diag.timestamp);string(diag.threatLevel);string(diag.summary);numeric(diag.findingsCount);literal(diag.requiresImmediateIntervention,[true,false]);array(diag.findings)
  for(const row of diag.findings){object(row);for(const key of ['system','severity','code','observation'])string(row[key])}
  object(value.emergency);literal(value.emergency.isActive,[true,false]);if(value.emergency.type!==null)string(value.emergency.type);if(value.emergency.timestamp!==null)date(value.emergency.timestamp)
  array(value.limitations);value.limitations.forEach(string)
  return value as unknown as CrewApiState
}
