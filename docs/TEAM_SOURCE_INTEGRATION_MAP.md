# Team source integration map

Authoritative workspace: `D:\nasa-hackathon`. Source C is inspected in ignored `.tools/team-source-vitals-orbit` at commit `888e3b9`; `D:\final-nasa` is excluded from this task.

Recovery: branch `checkpoint/pre-fullstack-20261115` at `9e25c2e`, plus `.tools/integration-backup/frontend-before-integration.bundle`. Original extracted backend and ZIP remain untouched. SHA-256 baseline covers 35 runtime assets/manifests.

## Baseline (15 November 2026)

- React 19.3.1, Vite 8.3.8, TypeScript 6.0.3, Three 0.187.0, Fiber 9.8.2, Drei 10.7.9, Tailwind 4.3.5.
- Build/typecheck pass. Existing 14 unit files / 38 tests pass. Existing warning: Three-dependent chunk exceeds 500 kB; Node emits a localStorage-path warning under jsdom.
- Root lint sees 55 errors in the newly supplied untracked archive directory; accepted tracked frontend has no reported lint errors. Preserve and exclude archive originals; lint the consolidated backend with Node globals.
- Accepted application uses `UnifiedExperience`, URL-selected crew, one `MedicalBayCanvas`, one `CameraDirector`, shared monitoring store, and per-crew clinical session state.

## Selective integration

| Source | Source path | Destination | Conflict and resolution |
| --- | --- | --- | --- |
| A / accepted frontend | `src/app/App.tsx`, `src/features/experience`, `src/scene` | Existing paths | Keep routing, room, rigged patient, camera ownership, audio, design and asset pipeline. No complete App/src replacement. |
| C / Faiz | `src/ui/medical/MedicalPanel.tsx`, `MeasurementTile.tsx`, `severity.ts`, `RingGauge.tsx` | Matching frontend paths | Adapt presentation to existing instrument styles; retain unique heading IDs, supplied severity, unavailable data and accessible labels. Do not copy standalone global CSS. |
| C / Faiz | `src/features/vitals/components/VitalsDashboard.tsx`, `HeartRateTrend.tsx` | Matching paths; detailed biometric sheet | Keep spatial ECG; add timestamped history with gaps and accessible table. Share the same monitoring feed as physical display. |
| C / Faiz | `src/features/physical/components/PhysicalAssessmentDashboard.tsx`, `sansQuestions.ts` | Matching paths; existing physical console | Preserve examination controls and body-region interaction. Add eight draft questions; synchronize answers through existing crew session rather than another global provider. |
| B / Saad | `src/services/{vitalsSimulator,radiationCalculator,healthCalculators,aiDiagnosticsEngine,storageService}.js` | `server/services/` | B and C are text-identical after newline normalization. Use B once; export constructors for crew-scoped simulators. Preserve equations; repair data/persistence defects explicitly. |
| B / original routes | `server.js` | `server/app.js`, `server/index.js` | Existing single global crew and permissive bodies are unsuitable. Preserve route capabilities behind validation, per-crew state, bounded request bodies and configurable loopback deployment. |
| B / tests | `test-simulation.js` | `server/test/team-simulation.js` | Retain original 21 assertions; supplement HTTP, isolation, validation and persistence tests. |
| B/C / provider | `src/context/AstronautHealthContext.jsx` | Not imported | Would create duplicate global crew state and browser simulators. Use typed API store and existing URL crew owner instead. |
| C / adapter | `src/services/telemetryAdapter.ts` | New `src/services/api/` transport/validation | Original adapter runs calculations in the browser, assumes single crew and adds thresholds. Replace with validated server contracts, explicit provenance, timeout/cancellation and one polling owner. |
| C / standalone layout | `src/App.tsx`, `src/styles/*` | Not imported | Would replace accepted 3D visual identity; retain Source A. |
| C / research | `src/data/alert_rules.json`, `docs/research/*` | Attributed research documentation | Retain as team research/draft rules, not an extra contradictory calculation engine. Public redistribution authorized by user; scientific review remains pending. |

## Data decisions

- Backend responses are simulated, never actual astronaut telemetry. API metadata makes this explicit.
- Keep `crew-01` / `crew-02` IDs from Source A. Backend crew contexts own independent simulator, radiation, records and emergency state.
- `mSv/h` from Saad's calculator becomes `µSv/h` by multiplication by 1000; cumulative dose remains `mSv`. Net loss magnitudes become negative percentage changes in the existing display contract.
- Preserve nulls, missing quality, timestamps and unknown severity. Do not infer nominal from an absent status.
- The team wellbeing engine uses a 1–10 scale; connected forms and stored records will state that scale explicitly. Do not silently reinterpret existing 1–5 session entries.
- Scientific issues to disclose: inconsistent exercise target comment (150 vs 120 min/day); inconsistent LBNP action text; sleep-duration score can exceed its stated 50-point component cap; simplified radiation risk model and SANS scores are not validated. Preserve source calculations for review and label all outputs educational.

## Publication authorization

Phase 3 verification: TypeScript passes; 7 targeted team/existing component and clinical tests pass. Baseline browser checks: 11/11 pass (fractional viewport startup, patient/breathing/scanner/cache/recovery, legacy routes, keyboard and crew selection). No screenshots, video or traces were captured.

User confirmed `zoaibahmed/orbital-medical-os-2026` as the new public submission destination and authorized public redistribution of team code/research. Never force-push or write to `moizj484-dotcom/vitals-orbit`. Existing origin remains preserved; use a separate submission remote.


## Final integration verification

Consolidated Express 5.3.0 / cors 2.8.6 backend and typed API store are implemented. Final complete browser run: 41/41 pass (7.1 minutes); frontend unit suite: 16 files / 47 pass; backend: original 21 assertions plus 10 integrated HTTP tests pass. Production build and combined/single-origin startup work. All 35 runtime baseline hashes remain identical. Public account/repository and team redistribution were approved by the user; publication is verified separately in the final submission report.
