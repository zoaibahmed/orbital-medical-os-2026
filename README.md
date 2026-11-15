# Orbital Medical OS — Aesculus

An immersive astronaut-health **simulation** for the NASA Space Apps Challenge 2026. The project combines the original interactive React Three Fiber medical bay with Faiz’s medical presentation components, Saad’s simulation services and Fatima’s draft research guidance.

Long-duration missions bring together radiation exposure, altered gravity, isolation, a closed environment and distance from support. This prototype presents those related health domains in one navigable spacecraft workspace. It is an educational hackathon demonstration, not a NASA-endorsed product, medical device or operational decision system.

## Quick start

Use Node **>=24.15.0** and npm **>=11**, as declared in `package.json`. Verified locally with Node 25.2.1 and npm 11.6.2 on Windows.

```powershell
git clone https://github.com/zoaibahmed/orbital-medical-os-2026.git
cd orbital-medical-os-2026
npm ci
npm run dev:all
```

Open **http://127.0.0.1:5186/**. The API runs on **http://127.0.0.1:5001/**; Vite forwards `/api` to it. Do not run `dev:all` at the same time as separate frontend/backend commands on those ports.

Separate terminals are also supported:

```powershell
# Terminal 1: backend
npm run server
# Terminal 2: frontend
npm run dev
```

The authoritative development workspace for the integrated team submission is `D:\nasa-hackathon`. The extracted backend delivery is preserved locally but excluded from Git; its consolidated implementation is `server/`. `D:\final-nasa` is unrelated to this final submission workspace and was not used for integration.

## Build and serve the complete application

```powershell
npm run build
npm start
```

Open **http://127.0.0.1:5001/**. The Express process serves the built frontend, API and SPA deep links from one origin. `npm start` requires an existing `dist/index.html` and reports a missing build explicitly.

`npm run preview -- --port 5187` is an alternative build preview; run the backend separately for connected data. Source publication on GitHub is not website deployment. No hosted website is claimed by this repository.

## Configuration

Defaults run locally without credentials or a database. To override them:

```powershell
Copy-Item .env.example .env
```

| Variable | Default / purpose |
| --- | --- |
| `API_HOST` | `127.0.0.1`; loopback-only demonstration server |
| `API_PORT` | `5001` |
| `DEMO_DATA_FILE` | `.local-data/medbay.json`; ignored local simulation records |
| `CORS_ORIGINS` | Explicit local frontend/preview/application origins listed in `.env.example` |
| `API_PROXY_TARGET` | `http://127.0.0.1:5001`; Vite development/preview proxy destination |
| `VITE_API_BASE_URL` | Empty means same-origin `/api`; use a public HTTP(S) API URL ending in `/api` only when intentionally hosting the API separately |

`VITE_` variables are bundled into browser code; they must never contain credentials. When changing the API port, update the proxy target and permitted origin configuration as appropriate. Browser configuration changes require restarting Vite/rebuilding production output.

This demo has no user authentication, clinical access controls, encrypted record storage or real patient connection. Keep the default loopback binding and use fictional records. Public multi-user health-data deployment needs separate security and privacy engineering; CORS is not authentication.

## Experience and medical modules

The room is actual navigable 3D geometry, with a licensed rigged patient, localized breathing morph, examination cradle, scanner, equipment, materials, lighting and Earth viewport. The accepted GLBs and design identity are preserved.

| Area | Implemented behavior |
| --- | --- |
| Medical bay | Three reversible scroll chapters; direct station navigation; temporary equipment inspection; one persistent Canvas/camera director; cached assets |
| Crew biometrics | Crew selection, backend-simulated heart rate, BP, SpO2, HRV, timestamped history, gap-aware chart/table, illustrative ECG and synchronized trolley display |
| Radiation | Crew-scoped CANS-inspired dose simulation, rate/cumulative dose, neutron dose-equivalent history and GCR/SPE scenario controls |
| Physical assessment | Visible/breathing patient, region selection, examination/scanner sequence, team bone/muscle model, exercise plans/completion and eight unscored draft SANS observations |
| Wellbeing | Optional demo check-ins, sleep records, backend-supplied sleep score, circadian preview and draft support resources |
| Diagnostics | Supplied rule-engine findings plus deterministic crew-aware assistance; no external AI service |
| Emergency | Persistent accessible rehearsal, crew-scoped backend registration/clear, acknowledgement checklist and corresponding display status; no actual equipment actuation |

Heartbeat sound uses original synthesized Web Audio, one reused audio context and browser-permitted interaction. Sound preferences, visibility, station activity and reduced motion remain respected. ECG is a normalized illustration, not measured electrophysiology. No internal anatomical imaging is supplied.

Small screens offer readable DOM medical views with optional 3D. WebGL/asset failures preserve navigation and data access. The public experience retains accepted high-fidelity assets; the existing Intel-specific rendering budget remains in place. This is not a 60 FPS guarantee.

## Routes

- `/`: mission arrival.
- `/bay/overview`, `/bay/vitals`, `/bay/radiation`, `/bay/physical`, `/bay/wellbeing`, `/bay/diagnostics`, `/bay/emergency`: the unified experience.
- `/dashboard/:stationId`: compatibility URLs into the same experience.
- `?crew=crew-01|crew-02`: canonical fictional crew selection; preserved during navigation.
- `?focus=cradle|scanner|equipment`: focused equipment deep links.
- `/visual-benchmark`: preserved historical asset study, separate from the main experience.

## Architecture and data flow

```text
BrowserRouter / URL crew selection
  → CrewApiProvider (one selected-crew polling owner)
  → validated /api/crew/:crewId/state response
  → shared MonitoringFeed external store
  → DOM readings / ECG / medical panels / physical 3D display

Medical forms → typed HTTP transport → Express validation
  → independent crew runtime → Saad's supplied services
  → bounded local JSON records → refreshed crew state
```

Telemetry notifications update subscribed instruments, not the scene host. The Canvas is above route interpretation; camera ownership stays with `CameraDirector`. No team browser simulator/provider or duplicate global crew selector is imported.

The backend has one simulation clock, independent crew simulators/radiation contexts and bounded histories. Records use UUIDs and atomic JSON-file replacement. Original memory/browser storage code is retained and adapted for the consolidated Node runtime. No external database is required. Emergency active state resets at server restart; its event history remains stored. Radiation accumulation is saved on record changes and graceful shutdown, rather than on every tick.

When the API is unavailable or malformed, the frontend explicitly switches to offline fixtures with unknown supplied severities. It does not retain another crew’s readings or describe fixtures as live telemetry. Offline notes, exercise plans, answers and sleep records stay in the current browser session; they are not automatically uploaded on reconnection.

Connected wellbeing records use the team backend’s **1–10** scale. Offline session check-ins retain the original **1–5** scale. These records are not silently rescaled or merged. Backend dose rate is converted from mSv/h to µSv/h; cumulative exposure remains mSv. Supplied positive loss magnitudes become negative percentage changes in the display adapter. Unknown/missing values never become zero or nominal.

## Project structure

```text
src/
  app/                  Router, station registry and compatibility boundaries
  features/experience/  Accepted immersive composition and station sheets
  features/vitals/      Monitoring store, ECG, sound and team detailed dashboards
  features/physical/    Examination, scanner controls, exercise and SANS
  features/radiation/   Exposure presentation and backend scenario controls
  features/wellbeing/   Sleep, check-ins and support content
  features/diagnostics/ Rule-engine presentation and demonstration chat
  features/emergency/   Accessible rehearsal interface
  services/api/         Transport, validation, connection lifecycle and action hooks
  domain/               Existing TypeScript medical/display contracts
  scene/                One R3F Canvas, camera director, assets and rendering policy
  state/                Existing clinical/session stores
  ui/medical/           Accepted primitives and adapted Faiz presentation
server/
  app.js                Validated Express routes and optional build hosting
  runtime.js            Crew isolation, normalization, clock and JSON persistence
  services/             Attributed Saad calculation/simulation services
  test/                 Original simulation checks and HTTP integration tests
public/assets/          Runtime GLBs, fonts, textures, decoder and licenses
assets/source/          Preserved Blender sources and patient provenance
e2e/                    Browser regressions and actual full-stack journeys
scripts/                Development orchestration, authoring and numeric profiling
docs/                   Current integration/submission reports and historical work
```

## API overview

Use `?crewId=crew-01|crew-02` on scoped routes. Omitting it selects `crew-01` for compatibility. Responses state `simulation: true`; the aggregate response follows the existing medical snapshot contracts.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health-check` | Server health and simulation/schema identity |
| GET | `/api/crew` | Canonical fictional crew profiles |
| GET | `/api/crew/:crewId/state` | Atomic snapshot, histories, records, diagnostics and emergency status |
| GET | `/api/vitals`, `/api/vitals/history` | Raw team simulation and rolling history |
| POST | `/api/vitals/mode` | Set a validated simulation scenario |
| GET | `/api/radiation/cans`, `/api/radiation/history` | CANS-inspired simulation and history |
| GET | `/api/health/musculoskeletal`, `/api/health/exercise-logs` | Team calculations and exercise records |
| POST / PATCH | `/api/health/exercise-log`, `/api/health/exercise-log/:id` | Create a plan / change completion |
| GET / POST | `/api/health/sans-assessments`, `/api/health/sans-assessment` | Read history / save explicit observations |
| GET / POST | `/api/health/sleep-logs`, `/api/health/sleep-log` | Sleep records and source demo score |
| GET / POST | `/api/health/mental-logs`, `/api/health/mental-checkin` | Optional fictional check-ins |
| GET / POST | `/api/ai/diagnostics`, `/api/ai/assist` | Rule-based findings / deterministic assistance |
| GET / POST | `/api/emergency/status`, `/api/emergency/trigger`, `/api/emergency/clear` | Rehearsal state and actions |

Full payloads, envelopes, unit conversions, cancellation/retry behavior and limitations: [API integration](docs/API_INTEGRATION.md). Self-reported SANS symptoms never imply Frisén or imaging findings. Backend prescriptive source actions are retained for domain review and not rendered as approved treatment instructions.

## Verification

```powershell
npm run typecheck
npm run lint
npm test
npm run test:backend
npx playwright install chromium
npm run test:e2e
```

`npm run test:all` runs frontend and backend tests. Browser tests use production preview on 5187 and an isolated demo API on 5002. Existing fixture scenarios explicitly intercept telemetry; `e2e/fullstack.spec.ts` uses actual browser HTTP requests. Screenshot, video and trace capture are disabled. Browser executables may require installation on a new machine; the repository does not contain them.

For numeric profiling on the actual graphics adapter, run the backend and a preview, then set `PERF_NAME`, `PERF_MONITOR=1`, optionally `PERF_URL`, and run `node scripts/measure_operations.mjs`. It performs 12 seconds of reversible native scrolling, five inspection/navigation cycles and an optional 10-second monitor sample. Reports go to ignored `docs/measurements/master-1`. Do not run concurrent GPU tests/benchmarks. Frame submission timing is not GPU-completion or compositor timing.

Executed results and remaining limitations are recorded in [test results](docs/TEST_RESULTS.md) and the [final submission report](docs/FINAL_NASA_HACKATHON_SUBMISSION_REPORT.md).

## Team attribution

| Contributor | Supplied responsibility |
| --- | --- |
| Zohaib | Original 3D environment, patient integration, camera/navigation, accepted frontend and asset pipeline |
| Faiz | MedicalPanel, MeasurementTile, severity presentation, VitalsDashboard, gap-aware HeartRateTrend, PhysicalAssessmentDashboard and draft SANS questions |
| Saad | Telemetry/radiation simulation, health calculators, diagnostics, emergency services and original backend tests |
| Fatima | Space-health research, draft alert guidance and domain-review material |
| Minal | QA/integration and presentation role identified in the team repository |

These credits describe the supplied sources; they do not imply that every contributor reviewed this final integration. Exact paths, conflict decisions and adaptations: [source integration map](docs/TEAM_SOURCE_INTEGRATION_MAP.md).

## Scientific status and known limitations

All astronauts, telemetry, risk outputs and emergency actions are fictional. Source services contain simplified team-authored equations, scores and thresholds. Passing software tests does not validate medicine or establish NASA/CSA approval.

Domain review is still required for radiation assumptions (including 10× accelerated accumulation), linear bone/muscle models, exercise-target inconsistencies, SANS scoring, sleep scoring and conflicting prescriptive source text. The frontend deliberately avoids presenting source treatment instructions as approved procedures. The research guidelines are retained for review rather than executed as a second contradictory rule engine.

Other limitations: the medical model uses one licensed exterior character for two fictional crew identities; no real telemetry, measured ECG, internal anatomy, real AI, sensor acquisition or hardware actuation is implemented. The JSON store is a single-process demonstration store, not a production database. Integrated-graphics navigation remains hardware-limited; see measured results. The existing Three-dependent bundle-size warning remains visible.

## Rights and attribution

The user authorized public redistribution of supplied team code/research for this submission. This does not invent a blanket project-wide reuse license. Original notices and rights remain with their authors; the supplied backend package declares MIT.

- Room/equipment geometry and procedural maps: original project work; Blender sources retained.
- Patient: official MakeHuman CC0 assets and derived project work; see [patient provenance](public/assets/licenses/MAKEHUMAN-PATIENT-CC0.md) and [asset manifest](docs/ASSET_MANIFEST.md).
- Barlow, Barlow Condensed and Antonio fonts: SIL OFL 1.1; notices in `public/assets/licenses`.
- Draco decoder: Apache 2.0 notice retained in `public/assets/licenses/DRACO-LICENSE.txt`.
- Heartbeat audio: original oscillator-based Web Audio; no third-party recording is distributed.
- npm dependency notices: [dependency license inventory](docs/DEPENDENCY_LICENSES.md).
- Team research: attributed draft material under `docs/research`; no NASA endorsement is implied.

Future work includes independent scientific validation, approved operational content, authenticated multi-user storage, real telemetry adapters, validated anatomy, production security/deployment and further measured GPU optimization. None is represented as finished in this submission.

Current handoff: [integration report](docs/TEAM_INTEGRATION_REPORT.md), [submission checklist](docs/SUBMISSION_CHECKLIST.md). Earlier planning and visual reports are historical snapshots.
