# Consolidated team integration report

Date: 15 November 2026. Project: **Orbital Medical OS / Aesculus**. Authoritative folder: `D:\nasa-hackathon`.

## Sources and preservation

Source A is the accepted frontend at `9e25c2e`. Source B is the supplied nested backend directory. Source C is `moizj484-dotcom/vitals-orbit` at `888e3b9`, inspected in ignored staging under `.tools`. Source B/C service text matches after newline normalization. No Google Drive, unrelated archive or replacement standalone frontend was used. `D:\final-nasa` was not changed by this integration.

A recovery branch and 94,732,301-byte Git bundle protect Source A. The original local backend/ZIP remain intact. The 35 runtime asset/manifests in the integration hash baseline remain unchanged; Blender sources, patient, medical bay geometry, materials, existing camera paths and visual identity were preserved.

Publication uses a clean initial snapshot on `submission-main` with the verified account's noreply commit email, preventing republication of personal author email metadata. The original local main/checkpoint history stays intact; no force-push or original-remote rewrite occurs.

## Implemented integration

- Adapted Faiz's `MedicalPanel`, `MeasurementTile`, severity presentation, `RingGauge`, `VitalsDashboard`, `HeartRateTrend`, `PhysicalAssessmentDashboard` and draft eight-question SANS content to the accepted instrument styles. No standalone global styles/App/provider were copied.
- Integrated one Express 5.3.0 / cors 2.8.6 backend in `server/`, using the supplied engines. Constructors isolate both canonical crew IDs; one server clock advances telemetry/radiation.
- Added typed response validation, same-origin proxying, timeout/cancellation, capped read retry backoff, one selected-crew polling owner and explicit connection/offline presentation.
- Connected vital readings, heart-rate history, BP, SpO2, HRV, radiation and cumulative dose, team physical calculations, exercise plans/completion, unscored self-reports, sleep, wellbeing, diagnostics, assistance and emergency rehearsals.
- Shared the monitoring store with DOM ECG/audio/readings and the physical trolley texture. API notifications bypass scene-host React state. Repeated medical/equipment navigation does not remount the Canvas or reload GLBs.
- Added bounded per-crew record storage with atomic JSON-file replacement. The original Node implementation was memory-only; no external database or credential is required.
- Preserved offline session interactions, WebGL recovery, reduced motion, mobile optional 3D, audio consent and emergency keyboard/focus behavior.
- Added combined development startup and single-origin build hosting with deep-link support.

## Deliberate differences from source deliveries

| Original limitation/conflict | Integrated resolution |
| --- | --- |
| Global `ASTRO-01` simulator and records | Independent canonical `crew-01` / `crew-02` contexts; explicit scoped requests |
| Alternative React simulation provider | Not imported; existing URL selection remains authoritative |
| Browser-side medical calculations/threshold adapter | Server services plus validated typed transport; frontend maps units/status only |
| Source Node storage does not persist | Bounded ignored JSON file; corrupt-file failures preserve the original file |
| Falsy defaults can replace explicit zero; timestamp IDs collide | Nullish defaults and UUIDs; meaningful zero-intensity test |
| Exercise plans could earn immediate calculation credit | Only completed records are credited; no duplicate calculation engine |
| 1–5 frontend vs 1–10 backend wellbeing scales | Explicit separate modes/labels; no silent conversion or upload |
| Self-report vs instrument SANS inputs | Eight nullable observations are stored unscored; clinical grades require explicit alternative inputs |
| Rejected standalone presentation | Accepted 3D composition retained; imported components use existing typography/material palette |
| Hidden SANS radios obstruct direct pointer targeting | Visible native controls and sticky-header scroll clearance |
| Old raw API response shape | Documented crew/simulation envelope and one aggregate typed read contract |

## Verification and phase status

| Phase | Outcome |
| --- | --- |
| 1 — protect/audit | Recovery branch/bundle; baseline build, 38 unit tests and 11 browser checks passed. Archive-related lint failures identified before consolidation. |
| 2 — source analysis | Actual three-source comparison and conflict resolution recorded in `TEAM_SOURCE_INTEGRATION_MAP.md`. |
| 3 — team dashboards | Compatible components integrated; targeted tests and preserved frontend workflows verified. |
| 4 — backend | Actual startup verified; 21 original checks plus 10 integrated HTTP tests pass. |
| 5 — APIs | Real production-browser requests, unit validation, outages, malformed responses and recovery verified. |
| 6 — shared state | Crew-scoped medical modules and shared DOM/3D monitor verified; five repeated connected transitions retain Canvas/GLB cache. |
| 7 — regression tests | 47 frontend unit tests; final full browser run 41/41 passed; TypeScript/build/lint pass. Numeric hardware profile is recorded in `TEST_RESULTS.md`. |
| 8 — documentation | README, API contract, source map, test results, attribution and submission checklist prepared. |
| 9 — publication | Authorized destination: `zoaibahmed/orbital-medical-os-2026`. Final security/publication evidence belongs in the final report. Never push to the original teammate repository. |
| 10 — final assessment | Final report distinguishes tested functionality, simulation, domain-review dependencies, publication verification and unresolved limitations. |

Initial regression runs found a controlled-checkbox timing issue, hidden-radio pointer obstruction and a test selector that targeted an older same-labelled exercise. Those were corrected before the final 41/41 browser run. No test was deleted to obtain a pass. Earlier failed runs are not counted as final successful results.

## Scientific and deployment boundaries

This is a functioning integrated **demonstration**, not validated healthcare. Scientific concerns in the supplied equations/action strings remain documented. Research guidelines are retained for review rather than introduced as a second competing engine. Unreviewed treatment instructions are not presented as operational procedures. There is no real sensor feed, external AI, clinical imaging, hardware actuation or authentication system.

The JSON store is appropriate for one local demo process, not multi-user production healthcare. Active emergency state resets at restart; its event history remains. Historical hardware measurements do not establish a universal frame-rate guarantee. Public source publication is not a live-hosting claim.

See `TEST_RESULTS.md`, `SUBMISSION_CHECKLIST.md` and `FINAL_NASA_HACKATHON_SUBMISSION_REPORT.md` for final executed evidence, security findings and verified repository/commit links.
