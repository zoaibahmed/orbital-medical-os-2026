# Final NASA Hackathon submission report

Assessment date: **15 November 2026**. **Integrated code, local execution and public source publication are verified.**

## 1. Project and authoritative folder

**Orbital Medical OS / Aesculus**, an educational NASA Space Apps Challenge 2026 medical-bay demonstration. Final workspace: **`D:\nasa-hackathon`**. `D:\final-nasa` was not modified during this integration. No Google Drive or unused archive was imported.

## 2. Source integration and preservation

- Source A: accepted frontend at `9e25c2e`; protected by `checkpoint/pre-fullstack-20261115` and `.tools/integration-backup/frontend-before-integration.bundle` (94,732,301 bytes).
- Source B: actual supplied nested `nasa-space-medbay-backend` project; authoritative medical simulation implementation, consolidated into `server/`.
- Source C: `moizj484-dotcom/vitals-orbit` at `888e3b9`; selectively integrated Faiz presentation and attributed Fatima research. Service text matches Source B after newline normalization.
- No complete standalone App/src/style/provider replacement. Original backend delivery remains locally intact and excluded from publication. The 35 baseline runtime assets/manifests have identical SHA-256 hashes.

The original detailed environment, rigged opaque patient, breathing morph, bed/scanner, Earth viewport, cached PBR assets, existing camera/scroll navigation, medical audio, mobile/reduced-motion support and WebGL recovery remain intact. Browser tests verify their behavior; this task did not create screenshots or videos.

## 3. Dashboard contributions and code changes

Integrated Faiz's `MedicalPanel`, `MeasurementTile`, `severityTone`, `RingGauge`, `VitalsDashboard`, `HeartRateTrend`, `PhysicalAssessmentDashboard` and eight draft SANS questions. Styles use the accepted operations design system. Detailed biometrics use the timestamped backend history and supplied severities; gaps/unavailable values remain explicit. SANS answers use the existing per-crew state and remain unscored.

Main changes: `src/services/api/*`, the shared monitoring feed/hooks, subscribed medical consoles, the existing application provider composition, trolley display provenance/emergency status, `server/*`, root scripts/proxy configuration and additional tests/docs. `MedicalBayCanvas` and `CameraDirector` implementation/asset geometry were not rewritten. See `TEAM_SOURCE_INTEGRATION_MAP.md` and Git diff for exact paths.

## 4. Backend selected and API connections

Saad's supplied engines provide vitals, CANS-inspired radiation, musculoskeletal/SANS/sleep calculations, deterministic diagnostics and emergency protocol data. The integration adds independent canonical crew runtimes, validation, one server clock, bounded JSON persistence, UUIDs and response normalization. Express **5.3.0** / cors **2.8.6** are pinned from the actual team repository dependency versions.

The frontend's single polling owner reads `/api/crew/:crewId/state`. Writes connect simulation modes, exercise plans/completion, nullable SANS observations, sleep, wellbeing, assistant replies and emergency registration/clear. Raw health/vital/radiation/history/calculation/diagnostic/emergency routes are also verified. Complete endpoint/payload inventory is in `API_INTEGRATION.md`.

Source equations are preserved rather than duplicated in the browser. Actual integration fixes include zero-intensity/default handling, per-crew isolation, plan-vs-completion semantics and durable bounded records. Scientific assumptions were not silently replaced.

## 5. Actual browser validation and synchronized context

Production-browser requests reached the real Express API through the configured proxy. Tests verify displayed crew/vitals, record creation/completion, reload persistence, sleep/wellbeing updates, radiation scenario changes, diagnostic assistance and emergency state. Wrong-crew/malformed responses, outages, cancellation and reconnects preserve usable navigation and explicit fallback.

The canonical selected ID comes from the existing URL. One monitoring feed supplies DOM readings/ECG, permitted sound and the physical trolley texture. Five connected chapter/equipment cycles retain the same Canvas and fetch no additional GLBs. Medical data changes do not recreate scene geometry or start another camera controller.

## 6. Medical module status

| Module | Status and practical boundary |
| --- | --- |
| Immersive bay | Implemented/tested real navigable 3D; one persistent renderer, patient/breathing/scanner and camera interactions preserved |
| Biometrics/vitals | Backend-connected simulated HR, BP, SpO2, HRV and heart-rate history; ECG illustrative, no clinical recording |
| Radiation | Backend-connected simulated rate/cumulative/neutron dose-equivalent history and GCR/SPE scenarios; no physical instrument |
| Physiological/musculoskeletal | Team demo calculations, region interaction, exercise records/completion and unscored SANS observations; no acquired internal anatomy |
| Behavioral/wellbeing | Connected fictional check-ins/sleep records/source scores and support content; no mental-health diagnosis |
| Diagnostics/emergency | Connected deterministic rule findings/assistance and crew-specific rehearsals; no external AI or equipment actuation |

## 7. Final structure and installed dependencies

The accepted frontend remains under `src/`; added transport lives in `src/services/api`, backend in `server`, runtime assets in `public/assets`, original authoring/provenance in `assets/source`, browser tests in `e2e` and current reports in `docs`. The complete structure and startup workflow are in README.

Runtime dependencies: React/React DOM **19.3.1**, React Router **7.18.5**, Three **0.187.0**, Fiber **9.8.2**, Drei **10.7.9**, Express **5.3.0**, cors **2.8.6**. Toolchain: Vite **8.3.8**, TypeScript **6.0.3**, Tailwind **4.3.5**, Vitest **4.1.12**, Playwright **1.65.1**, ESLint **10.15.0**. Exact direct/dev/transitive installed versions and declared licenses are recorded in `DEPENDENCY_LICENSES.md`; package.json/lockfile are authoritative.

## 8. Tests and build results

- TypeScript: pass.
- ESLint: pass, zero warnings/errors.
- Frontend: **16 files / 47 tests passed**.
- Backend: **21 original assertions + 10 HTTP tests passed**.
- Browser: final full run **41/41 passed**, **7.1 minutes**.
- Production build: pass, **120 modules**. Existing Three-dependent chunk warning retained.
- Actual `dev:all` and production `start` workflows verified, including deep links and proxied/same-origin API health.
- 35 runtime baseline hashes unchanged; no screenshots/videos generated.

The initial checkbox/radio/test-selector failures were corrected before final full verification; tests were not removed. Executed commands, coverage and warnings are in `TEST_RESULTS.md`.

## 9. Performance and outstanding technical issues

Actual Intel UHD 620 / ANGLE D3D11 at 1440×900, accepted standard assets: production ready **18.14 s**, moving navigation **20.28 FPS**, active stationary monitoring **58.69 FPS**. Five repeated transition/focus cycles retained resources and made **zero** additional GLB requests. Forty-eight completed aggregate requests averaged **5.92 ms**, max **11.69 ms**, with zero failed requests/page errors in the production profile.

Moving-scene frame pacing remains limited: p95 **55.2 ms**, largest interval **405 ms**; two navigation-window long tasks, max **554 ms**. No 45–60 FPS moving-room guarantee is claimed. The largest interval did not overlap a recorded long task; GPU-completion/compositor timing is not measured, so a definitive cause for every gap is not claimed. Startup preparation remains lengthy on this adapter.

Development was also measured: **24.04 s** ready, **20.08 FPS** navigation, **50.91 FPS** monitoring; React Profiler measurements are documented in `TEST_RESULTS.md`. Shared-host conditions/cycle counts differ, so these are qualified comparisons.

Other limits: only available Chromium/Windows hardware was executed; JSON storage is single-process demo persistence; telemetry histories are transient, active emergency resets on restart and abrupt termination may lose radiation ticks since the last persisted mutation. Real-time transport is polling, not a streaming sensor feed. HRV/SpO2 historical series and physiological history are not invented when unavailable.

## 10. Scientific review dependencies

Radiation risk/accelerated dose assumptions, linear atrophy, inconsistent exercise-target comments, SANS score bounds, sleep component caps and conflicting prescriptive source strings need domain review. Research guidance is attributed and retained as draft material, not executed as an additional competing engine. Backend source treatment actions are not rendered as approved medical procedures. Passing code tests does not establish clinical accuracy, NASA/CSA approval or certification.

## 11. Security, rights and publication evidence

The user authorized **`zoaibahmed/orbital-medical-os-2026`** as a new public submission repository and confirmed team permission to redistribute code/research. The authenticated CLI account was verified as `zoaibahmed`. The original teammate repository must not receive a push; the previous frontend origin is preserved.

The original Git author metadata contains a personal email address. The new public repository uses a clean submission snapshot with the verified account's GitHub noreply address. The original local main/checkpoint history and recovery bundle are preserved; neither original remote is rewritten or force-pushed. The new publication branch is `submission-main`, mapped to the new remote's `main`.

Runtime model/font/decoder provenance was inspected: original room/equipment/maps, MakeHuman CC0 patient, OFL fonts, Apache-2.0 Draco, original synthesized sound. Dependency licenses were inventoried; `webgl-constants` has a verified installed MIT LICENSE despite missing package metadata. Team research documents contain no embedded media/email addresses in the inspected XML. No new project-wide blanket reuse license is invented.

Environment files, record stores, original archives, node_modules, build output, caches and generated capture/measurement directories are excluded. Executed pattern/document-XML scan: **303 indexed files**, **250 reachable historical blobs / 225,778,764 bytes**, **zero findings**. Provider-token, private-key, credential-URI, secret-assignment and excluded-artifact checks were used; no secret values were printed. This is an executed scoped source audit, not a claim of formal penetration testing. `npm audit --json` returned **zero info/low/moderate/high/critical vulnerabilities** for the installed lockfile. Final staged content and ignored boundaries were reviewed before publication.

Publication/remote/anonymous-read evidence and the actual code commit SHA are recorded below. Two preserved Blender authoring files triggered GitHub's recommended 50 MB size warning (61.08 and 61.68 MB), but the push succeeded. No file exceeded the enforced 100 MB individual-file limit; no runtime model was removed to reduce publication size.

## 12. Submission-readiness verdict

**Implemented and tested:** one integrated, locally runnable 3D frontend + crew-aware medical simulation backend and documented startup/build/test workflows.

**Demo/simulation:** every astronaut, reading, ECG, medical model, diagnostic and emergency action.

**Backend-connected:** all supported medical read/write flows described above, verified through actual browser requests.

**Scientific validation pending:** all clinical assumptions, source action content and operational use.

**Not implemented:** real patient/sensor telemetry, internal clinical imaging, external AI, real emergency actuation, production authentication/multi-user medical storage and live website hosting.

**External blocker / unavoidable user action:** **none** for the delivered local demonstration and verified public source repository. Clinical/production deployment requires separate domain/security work and is not claimed by this submission.

## 13. Verified public submission and code revision

- Repository: **https://github.com/zoaibahmed/orbital-medical-os-2026**
- README: **https://github.com/zoaibahmed/orbital-medical-os-2026/blob/main/README.md**
- Verified implementation commit: **`072402f51644ace14ba36a345acfe5f02158fad3`**
- Stable tested-code link: **https://github.com/zoaibahmed/orbital-medical-os-2026/commit/072402f51644ace14ba36a345acfe5f02158fad3**
- Published branch: remote `main`; local `submission-main` tracks `submission/main`.
- Anonymous GitHub API verification: `private: false`, default branch `main`, **303 files**, non-truncated tree, required frontend/backend/package/docs/patient model paths present.
- Remote ref and local implementation SHA matched. Root implementation commit has **zero parents** and uses the verified GitHub noreply address, excluding old personal author metadata from the new public history.
- Unauthenticated GitHub README HTML returned **200** and contained the rendered project H1, Quick start and `npm run dev:all` instructions. The connected GitHub source tool also retrieved `server/app.js` successfully.
- `origin` remains the previous frontend repository; only the new `submission` remote received a push. No teammate-repository push or force-push occurred.

The implementation commit identifies the exact code/asset snapshot that was tested. A documentation-only follow-up records this already-executed publication verification; it does not change application behavior. The final delivery message identifies that final documentation tip separately when needed. GitHub source publication is **not** a live website deployment.

Local application remains available at **http://127.0.0.1:5001/** through the verified `npm start` workflow. The API health endpoint is **http://127.0.0.1:5001/api/health-check**. No credential or database setup is required for the fictional local demonstration.
