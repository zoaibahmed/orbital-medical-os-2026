# API integration contract

The consolidated API lives in `server/`. Source B supplies the calculation engines; Source C has identical service text after newline normalization. There is one deployed implementation, not two running backend folders. All responses concern fictional simulation data, not real astronauts.

## Lifecycle and ownership

- `CrewApiProvider` derives the canonical selected crew from the existing URL. No second crew selector/provider is imported from the team repository.
- `createCrewConnection` owns one GET polling chain. The normal delay is two seconds after a completed response. Failures back off to four/eight/ten seconds, capped at ten. Manual retry restarts the chain.
- Requests have a five-second timeout and AbortController cancellation. Generation checks discard late responses after disposal or crew changes. Hidden documents stop polling and cancel in-flight reads; becoming visible refreshes immediately.
- `parseCrewState` rejects incorrect IDs, schema, provenance, units, quality/severity values, non-finite numbers, malformed timestamps and malformed records before publishing an atomic update.
- The same `MonitoringFeed` supplies DOM instruments, illustrative ECG timing, permitted audio and the real trolley texture. A backend sample is never advanced by the browser’s offline sampler.
- Module forms use `useApiAction`. POST/PATCH actions are never automatically retried. A save is confirmed only after a valid scoped command response; uncertain failures tell the user to inspect records before retrying.
- One `MedicalBayCanvas` and one `CameraDirector` remain mounted across station, equipment and medical-data transitions. Transport notifications do not update the scene host’s React state.

## Configuration and serving

`VITE_API_BASE_URL` defaults to same-origin `/api`. It is public browser configuration and must contain no secret. `API_PROXY_TARGET` defaults to the local API and is consumed by Vite development/preview only. `.env.example` contains safe settings. Root Node scripts load an optional `.env` through Node’s native env-file support.

`npm run dev:all`: frontend 5186, backend 5001. `npm run build` then `npm start`: Express serves `dist/`, the API and SPA deep links on 5001. The server binds to loopback by default. Explicit origin allowlisting, JSON content types, 16 kB request-body bounds, input validation and a 120-write/minute/IP limit protect the demo boundary; these are not authentication or production medical-data controls.

## Response formats

Health response:

```json
{"status":"ONLINE","simulation":true,"schemaVersion":1,"uptimeSeconds":123}
```

Scoped raw endpoints use a versioned integration envelope rather than the earlier standalone server’s raw responses:

```json
{"crewId":"crew-02","simulation":true,"reviewStatus":"draft","data":{}}
```

Existing standalone API consumers must adapt to this envelope. The integrated frontend does not import the old browser-side team adapter.

The frontend polls `GET /api/crew/:crewId/state`, which returns:

```text
schemaVersion: 1
crewId: crew-01 | crew-02
simulation: true
reviewStatus: draft
mode: NOMINAL | EVA_ACTIVE | HYPOXIA_EVENT | SOLAR_FLARE | EMERGENCY_INJURY
snapshot: CrewSnapshot (src/domain/contracts.ts)
heartRateHistory: { measuredAt: ISO timestamp, bpm: number | null }[]
radiationHistory: { measuredAt, doseRate, cumulativeDose, neutronDoseRate }[]
records: { exercises, checkIns, sleep, sans }
diagnostics: { timestamp, threatLevel, summary, findingsCount, findings, requiresImmediateIntervention }
emergency: { isActive, type, timestamp, protocol }
limitations: string[]
```

Histories are bounded to 30 samples; record categories to 200 entries per crew. Unknown crew IDs return 404. Other scoped routes accept `?crewId=crew-01|crew-02`; omitting the parameter selects `crew-01`. The frontend always sends the selected ID explicitly.

## Endpoint and payload inventory

| Method | Route | Request / result |
| --- | --- | --- |
| GET | `/api/health-check` | Health/schema/simulation identity |
| GET | `/api/crew` | Existing fictional profile IDs/names/roles/callsigns |
| GET | `/api/crew/:crewId/state` | Aggregate response above |
| GET | `/api/vitals` | Team vitals including timestamp, astronautId, heartRate, bloodPressure, spo2, hrv and source alerts |
| GET | `/api/vitals/history` | Last 30 raw vital samples |
| POST | `/api/vitals/mode` | `{mode: SimulationMode}`; switches only the selected crew’s mode |
| GET | `/api/radiation/cans` | Team CANS-inspired telemetry; raw rate units are mSv/h |
| GET | `/api/radiation/history` | Last 30 raw radiation samples |
| GET | `/api/health/musculoskeletal` | Team model using mission day 85 and this crew’s completed exercise logs |
| GET | `/api/health/exercise-logs` | This crew’s plans/completion records |
| POST | `/api/health/exercise-log` | `{type: ARED|T2_TREADMILL|CYCLE, durationMin: 1..240, intensityPercent: 0..100, date: ISO/date, completed: boolean}`; intensity defaults to 80, completion to false |
| PATCH | `/api/health/exercise-log/:id` | `{completed: boolean}`; ID must belong to selected crew |
| GET | `/api/health/sans-assessments` | Submitted SANS records |
| POST | `/api/health/sans-assessment` | Self-report `{symptoms: [{questionId, answer: boolean|null}]}`; at most eight unique recognized IDs; stores observations with `evaluation: null` |
| POST | `/api/health/sans-assessment` | Alternative instrument-demo input: explicit `frisenGrade` 0..5 integer, `headacheSeverity` 0..10 and booleans `blurredNearVision`, `globeFlatteningPresent`, `cottonWoolSpots`, `choroidalFolds`; calls original source evaluator |
| GET | `/api/health/sleep-logs` | Supplied sleep records/source scores |
| POST | `/api/health/sleep-log` | `{start, end, hoursSlept: 0..24, awakeningsCount: 0..30 integer, remFractionPct: 0..100, lightExposureSync: boolean}`; end follows start and duration fits interval |
| GET | `/api/health/mental-logs` | Crew check-ins |
| POST | `/api/health/mental-checkin` | `{moodScore: 1..10 integer, stressScore: 1..10 integer, notes: string <=1000 chars}` |
| GET | `/api/ai/diagnostics` | Original deterministic multi-domain rule output; no external AI |
| POST | `/api/ai/assist` | `{message: nonempty string <=1000 chars}`; returns `{response, kind: rule-based-demo}` |
| GET | `/api/emergency/status` | Crew-scoped rehearsal state |
| POST | `/api/emergency/trigger` | `{emergencyType: RAPID_DEPRESS|SOLAR_SPE|CARDIAC_ARREST|GENERAL_EMERGENCY}`; records an educational incident, never actuates hardware |
| POST | `/api/emergency/clear` | `{}`; clears selected crew’s rehearsal and restores its nominal simulation mode |

Malformed/invalid bodies return 400, unsupported media type 415, oversized bodies 413, rate limits 429, unknown routes/crew 404 and internal failures a generic 500 without a stack trace. Cross-origin requests outside the configured allowlist return 403.

## Units, severity and unsupported data

- Raw radiation mSv/h becomes µSv/h by multiplying by 1000. Cumulative dose stays mSv. Backend neutron history is **dose equivalent**, not particle counts; offline authored neutron counts retain their separate label.
- Bone/muscle model positive loss magnitudes become negative displayed percentage changes. Planned exercise never receives completion credit. Explicit 0% intensity remains zero rather than the original falsy-default credit.
- Metric severity is mapped from supplied backend alert/status codes; frontend code adds no clinical thresholds. Cumulative dose has no metric-specific source status and remains unknown.
- A missing sleep record yields null duration/score and missing/unknown quality, not a default sleep assessment. Self-reported SANS observations are never interpreted as instrument findings.
- Connected mood/stress use 1–10. Offline original session records use 1–5; there is no silent rescaling or automatic upload.
- Heart-rate `bpm: null` produces a graph gap and “Unavailable” table cell. Other nullable histories also break the line rather than bridging a missing interval.
- HRV/SpO2 numeric readouts are connected; their historical series are unavailable because the aggregate currently supplies timestamped heart-rate history only. No substitute history is invented.
- Physical assessment historical series, internal anatomy, real ECG acquisition, real telemetry and hardware control are not supplied.

## Persistence and scientific boundaries

The original source’s Node store was memory-only. The consolidated runtime writes bounded records to `.local-data/medbay.json` through temporary-file replacement. That directory, environment files, original archives and test stores are ignored by Git. Emergency active state resets after restart, while event records remain. Telemetry history is transient. Radiation accumulation persists on record writes and graceful shutdown; abrupt process termination can lose subsequent accumulated demo ticks. Corrupt data files fail explicitly rather than being overwritten.

The original source equations remain educational and unvalidated. Known issues include simplified accelerated radiation accumulation/risk, exercise target inconsistency, linear atrophy assumptions, SANS score bounds, sleep component cap and conflicting prescriptive source actions. UI findings expose observations and explicit draft status; unreviewed treatment instructions are not rendered. Research guidelines are retained for review, not introduced as a second engine.

## Executed communication checks

Real production-browser HTTP requests verified telemetry, selected crew, one polling owner, exercise creation/completion, SANS persistence, check-ins, sleep scoring, diagnostics/assistance, radiation scenarios and emergency registration/clear. Outage, malformed/wrong-crew responses, cancellation, reload and recovery are covered by `e2e/fullstack.spec.ts`. Five real telemetry navigation/inspection cycles retain the Canvas and request no new GLBs. Full executed counts and hardware measurements are in `TEST_RESULTS.md`.
