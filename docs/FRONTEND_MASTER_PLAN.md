# Space Station Medical Bay Frontend Master Plan

## Current completion upgrade / 15 November 2026

The accepted room and medical demonstrations are preserved. An actual CC0 MakeHuman patient is now integrated: 42,610 triangles, 163 bones, five skinned meshes, measured supine fit, outward 3mm breathing morph, independent load/retry and crew-scoped examination/scan states. The final Blender audit reports zero bed intersections across all five patient meshes; released restraints are stowed at the port rail. Internal medical anatomy and final art/scientific approval remain external.

Targeted PBR/contact refinements, stationary HDR/depth caching, asynchronous patient preparation, synchronized scan timing and persisted permitted monitoring audio are implemented. Selected UHD 620 measurement: 27.38 FPS navigation, p95 49.0ms, max gap 254.1ms; 52.47 FPS monitoring; 9.33s environment readiness. Navigation remains below 45–60 FPS, cold loading varies, and a one-time prepared-patient trace still shows a 727ms task. No new screenshots/videos were generated.

Final verification passed: TypeScript/build, zero-warning ESLint, **37 unit/component tests in 14 files** and **31 browser integration tests**, with zero skips or flaky cases. The authoritative [FINAL_FRONTEND_DELIVERY_REPORT.md](FINAL_FRONTEND_DELIVERY_REPORT.md) contains exact evidence and limitations. Older gates/status summaries below are historical and do not revoke the latest authorized six-phase task.

## Historical completion snapshot — superseded

Verified: TypeScript/build, zero-warning ESLint, 33 unit/component tests and 25 browser tests passed. Final UHD 620: 27.52 FPS navigation / 427.7ms max active gap; 21.99 FPS monitoring; 10.92s readiness. Actual scanner geometry rendered for 135 frames with 66.7ms max interval, then resources returned to baseline. All high GLB hashes are unchanged.

All medical feature interfaces now contain working educational demonstrations, per-crew in-memory logs, draft SANS/emergency content and automatic permitted monitoring audio. Accepted room assets are unchanged. Realistic patient/anatomy assets, verified bed placement and visible breathing remain blocked; no crude character substitute was added. See [final report](FINAL_FRONTEND_COMPLETION_REPORT.md) and [38-item audit](REQUIREMENTS_TRACEABILITY.md). Older records below are historical.


## Current implementation — Master Prompt 1

15 November 2026. The latest prompt accepts the 3D architecture and authorizes sequential implementation of 1A UI replacement, 1B cinematic navigation/render scheduling, and 1C animated biometrics without intermediate approval stops. The accepted GLBs, refined materials, bed/scanner/trolley/architecture and viewport remain unchanged. New operations styling and corner controls replace the rejected active presentation. One camera director handles native scrolling, deliberate direct station travel and equipment focus. One typed monitoring feed drives the animated DOM ECG and physical trolley screen; quiet heartbeat audio requires explicit enablement and cleans up on exit/tab changes.

Executed verification: TypeScript/build, zero-warning ESLint, 29 unit tests and the complete final 24-scenario browser suite passed. Final UHD 620 production navigation: 27.25 FPS, p95 49.3ms, maximum active gap 349.8ms; live monitor: 21.35 FPS / 127.3ms max gap. The prior multi-second freezes did not recur in the measured workflow; 45-60 FPS remains unmet and readiness took 10.13 seconds (12.63 seconds in the preceding run). Renderer/resources persisted with zero extra GLB loads.

Full implementation, integration boundaries, executed tests and measured performance: [Master Prompt 1 consolidated report](MASTER_IMPLEMENTATION_1_REPORT.md). Scope/status matrix: [requirements traceability](REQUIREMENTS_TRACEABILITY.md). Future radiation, physical, wellbeing and diagnostics workflows remain previews. No backend, medical engine, storage or real AI was implemented. No images, video or review gallery were generated for this task.

All records below are historical snapshots. Their earlier approval gates, quality policies and proposed/unimplemented architecture do not describe the active Master Prompt 1 application.


## Historical high-only refinement — awaiting review

The public review and operational scene now always open in the highest authored tier. Public graphics selectors and automatic hardware downgrade are removed; the lower mode is development-only. New platform mechanisms/restraints, inner scanner layers/optics, console reservoirs/probe, layered viewport and exterior NASA-textured Earth sphere are integrated. TypeScript/build/lint, 21 unit tests and 14 browser tests passed. Final UHD 620 motion rate: 22.84 FPS, with a 3.44-second in-motion gap; performance is not approved. See [high-only refinement review](HIGH_GRAPHICS_REFINEMENT_REVIEW.md). Earlier lower-tier recommendations and visual statuses below are historical. Stop for review.


Current art gate: [reference-driven quality review](REFERENCE_QUALITY_REVIEW.md) and [pre-modelling specification](REFERENCE_ASSET_SPEC.md). Earlier visual directions below are historical. New assets are integrated; no new UI/modules/scroll work is authorized beyond this environment approval gate.

## Visual environment reset — review required

A separate `/visual-benchmark` now demonstrates the new authored environment and a reversible 2.2-second overview/examination camera move. This is the current art approval gate. Previous three-chapter layouts remain functional for continuity but are not approved visual references. No full UI, extra modules or additional chapter choreography was implemented in this phase. See [visual quality review](VISUAL_QUALITY_RESET.md).


## Historical corrective integration — awaiting review

The rejected opening and legacy routed UI have been superseded by one persistent, dark Orbital Medical OS experience with three working scroll chapters: Arrival, Explore and Biometrics. Existing /bay and /dashboard URLs resolve into this same presentation. Detailed assets and typed contracts are preserved. No remaining full medical modules or backend services were added. See [corrective integration report](CORRECTIVE_INTEGRATION_REPORT.md) for actual GPU measurements, code changes and executed checks. Earlier opening-only and legacy phase statuses below are historical. Stop for review.


## Historical opening approval gate — critical override

The user rejected the existing UI and authorized a new scroll-driven presentation. The root route now contains one working opening: **Care, beyond Earth**, with new Antonio typography, porcelain/oxblood identity, a live R3F aperture and reversible scroll-controlled camera travel. This replaces the root mission page; it does not implement the remaining two chapters. See [Opening experience review](OPENING_EXPERIENCE_REVIEW.md) for actual captures, recording, technical changes and limitations.

Existing operational bay/dashboard routes remain reachable for functional continuity and have not been creatively approved or restyled by this opening-only gate. Models, pipeline, contracts and backend boundaries are preserved. Earlier Phase 3B and Phase 3C-A creative recommendations are historical; this opening is a new direction under the explicit override. Verification: TypeScript/build/lint passed, 13 unit tests and 12 browser regressions passed; the focused opening rerun also passed all 3 tests. Final production captures include a 27.36-second live scroll recording, 0 healthy desktop page errors and unchanged hashes for all 6 GLBs. **Stop for user visual approval before remaining chapters.**


Audit date: 14 November 2026, Asia/Karachi. Updated for the user-authorized Phase 3B cinematic polish pass.

## Phase 3B cinematic polish implementation

The user authorized refinement of the existing vertical slice, not a rebuild or new medical module phase. Phase 3B is implemented and regression-tested, with visual approval still reserved for the user. This section supersedes older visual/performance status below; the Phase 3 and foundation records remain historical context.

### Problems found and changes made

The original bay stacked a 96px header, crew toolbar and horizontal navigation above a scrollable 3D panel. Identical wall cassettes, bright structural metal, a broad bed base, small voxel lettering and weak contact grounding reduced spatial hierarchy. The old performance sampler recorded software frame intervals without foreground/pacing or camera-motion evidence.

The bay now fills the full 1440x900 viewport behind compact operational overlays. Crew selection is in the top rail, modules form a side rail, and clinical placeholders open in a collapsible contextual panel. Overview starts with mission notes collapsed. The page has no primary desktop scrolling; actual browser layout assertions verify a 1440x900 scene and 900px document height. Existing routes, crew selection, Canvas lifetime, emergency access and renderer-free dashboard mode are preserved. Explicit render quality now survives module navigation.

The same three authored assets were refined in Blender: varied service cartridges, frame joint shoes, a ceiling service spine, differentiated deck material, a smaller lift plinth, visible pivots/crossmembers, smooth actuator/probe cable routes, scanner sensor cassettes/drive housings and protective monitor edge caps. Interaction anchor names/coordinates are unchanged. Converted Barlow Condensed outlines replace the coarse lettering; locally served Barlow UI fonts and their OFL licenses are recorded in the asset manifest.

### Rendering and animation decisions

Materials distinguish coated structural ribs, satin metal, anodized deck, ceramic, upholstery and rubber. A warmer key with restrained cool fill and lower broad environment/frontal light provides stronger equipment/background separation. One standard-tier PCF shadow caster is retained. Two analytical soft-contact patches ground the static cradle and trolley in both tiers; these are explicitly art-directed approximations, not a UV-baked or ray-traced AO solution. No bloom, fog, particle layer or heavy postprocessing was introduced.

A user-triggered 1.6-second standby indicator check animates only the scanner emission. It returns to its resting intensity and demand rendering; reduced motion produces a static response. It does not move the camera or imply a real diagnostic procedure. Normal scene navigation retains the existing guided, interruptible camera controller.

### Performance protocol and actual evidence

The diagnostic query now uses continuous rendering only after model readiness and three warmup frames. The existing camera controller follows its safe preset paths during the explicit benchmark. Sampling runs for approximately five seconds/up to 300 samples, with a 30-second measurement budget for slow backends. It records visibility, always-rendering status, actual camera travel, intervals, CPU render-submission cost, renderer counters and experimental JS heap data, then returns to demand mode. Sparse or background/idle intervals are not certified as representative navigation. CPU submission time is not a GPU completion timestamp.

A matching Intel UHD Graphics 620 adapter/driver was found through Win32_VideoController. Chromium can use it through explicit D3D11 test launch arguments; default headless Chromium used SwiftShader. Both paths were foregrounded with background throttling disabled. Their idle rAF baseline was about 16.67ms, while active software rendering remained very slow. These observations do not support treating the low software FPS as idle demand-loop timing. Software rendering/presentation/scheduling is the likely dominant constraint; the exact split is unresolved without a GPU timer. The old figures remain historical software observations, not representative physical-GPU results.

At an actual 1440x900 drawing buffer in Chromium 159.0.8154.6 on Windows:

| First-pass hardware navigation measurement | Standard | Low |
| --- | ---: | ---: |
| Active FPS over measured interval | 28.71 | 60.03 |
| Sample frames / interval | 198 / 6.90s | 300 / 5.00s |
| Mean / p95 frame period | 34.83 / 61.0ms | 16.66 / 23.5ms |
| Draw calls / rendered triangles | 54 / 253500 | 32 / 96384 |
| Renderer geometries / textures | 34 / 20 | 33 / 18 |
| Navigation to ready, localhost automation | 3.38s | 2.13s |

Hardware mode used `--use-angle=d3d11 --ignore-gpu-blocklist --enable-gpu` only in test browser processes, not system or application configuration. Adapter driver: 31.0.101.2135. These short results do not prove sustained 60 FPS or default-browser behavior. Standard's 60 FPS aspiration is not met on this adapter. Low averaged about 60 FPS in this particular sample; its p95 is above a strict 16.7ms/60Hz budget.

Forced SwiftShader produced limited 3-frame/35.3s and 7-frame/33.9s samples, around 0.085 and 0.207 FPS. They hit the slow-backend budget and are marked nonrepresentative for smooth navigation. Dashboard mode remains the practical software fallback. No physical-phone, Safari/Firefox, long-soak or VRAM-byte acceptance is claimed.

See `docs/screenshots/phase3b/render-measurements.json` and the progress report for exact launch arguments, CPU/frame values, resource delivery, counts, sampling validity and screenshots.

### Final asset/contact verification run

Close-up review corrected the trolley caster and cradle mounting-track heights so their authored contact surfaces meet the deck. Examination/equipment assets were re-exported for both tiers; shell geometry and interaction anchors are unchanged. All six final SHA-256 values, sizes and Draco extensions match both manifests. All seven refreshed screenshots were inspected after this correction.

The final production run at 1440x900 is in render-measurements.json. The earlier run above is preserved in first-pass-measurements.json for comparison, rather than selecting the faster sample.

| Final active navigation measurement | Standard | Low |
| --- | ---: | ---: |
| Intel UHD 620 average FPS | 27.86 | 59.20 |
| Intervals / duration | 211 / 7572.8ms | 296 / 5000.2ms |
| Mean / median / p95 frame time | 35.89 / 16.7 / 68.5ms | 16.89 / 16.5 / 24.7ms |
| Median / p95 CPU submission | 3.7 / 5.6ms | 3.2 / 12.3ms |
| Localhost navigation to ready | 3266ms | 3135ms |
| Draw calls / rendered triangles | 54 / 253500 | 32 / 96384 |
| Geometry / texture counters | 34 / 20 | 33 / 18 |
| Experimental used JS heap | 21.7MB | 21.7MB |
| Representative active navigation | Valid | Valid |
| SwiftShader limited sample FPS | 0.100 | 0.280 |
| SwiftShader intervals / duration | 3 / 30123.4ms | 9 / 32105.5ms |

Both software samples remain limited/nonrepresentative; their sparse intervals hit the slow-backend budget. Foreground rAF baselines remained about 16.67ms. Final model bodies total 1,354,924 bytes standard and 1,040,308 low. With actual decoder encoded bodies (11,748 + 192,420 bytes), those totals become 1,559,092 and 1,244,476 bytes, excluding app JavaScript/fonts. Per-request entries are recorded under assets and decoderAssets; cached responses can have 300-byte transfer metadata while retaining their encoded body sizes. Counters and JS heap are not VRAM usage. Hardware samples returned to demand mode after completion; activeModeValid refers to the entire sampled interval.

Across both short hardware runs, standard averaged 27.9–28.7 FPS and low 59.2–60.0 FPS. This is not sustained or universal 60 FPS acceptance. Standard still needs performance work for that target; low is the recommended demo tier on the tested adapter.

### Review gate

All twelve unit tests, nine browser regression tests, TypeScript, lint and production build passed. All required screenshots were captured and inspected: mission entry, full bay overview, examination close-up, equipment detail, contextual navigation and mobile dashboard, plus low quality. No healthy-path page errors occurred in the capture run.

The recommendation is to review the visual pass and use low quality for a demo on this verified UHD 620 configuration. Standard performance and broader-device acceptance remain open. No full holographic dashboard, telemetry engine, medical calculation, anatomy, AI, backend, database or next phase was implemented. Stop after Phase 3B and await user review.

## Historical Phase 3 environment implementation

The user authorized the first detailed 3D vertical slice. This milestone implements an original pressure-module examination section, a contoured medical cradle with scanner arch, and an articulated-monitor diagnostic trolley. It does not authorize full holographic dashboards, anatomy, medical monitoring logic, risk calculation, real AI, backend work or a further phase.

No Blender installation or local environment assets were found. An official portable Blender 4.5.15 LTS build was downloaded to ignored `.tools/` and checked against its published SHA-256. The project authored all geometry, procedural maps and a small stencil alphabet in `scripts/build_medical_bay.py`; no external models, images or fonts were sourced. Six Draco GLBs are now registered with content hashes, actual byte sizes and usage records. See `docs/ASSET_MANIFEST.md` for details and review status.

### Architecture and visual decisions

- The existing Canvas, routes, crew selection, feature boundaries, emergency modal and fallback architecture remain intact. Bay layout now gives the scene the full workspace width and places compact medical placeholder panels below it. Dashboard mode remains renderer-free.
- Three guided views are overview, examination station and equipment detail. URL `view` retains selection and supports browser history. Existing station routes select an appropriate default view. `quality=standard|low` can override the responsive tier without remounting Canvas.
- CameraRig still owns the only CameraControls instance. It uses an interruptible 1.1-second Cartesian smoothstep through a verified clear right-side aisle. Reduced motion cuts directly to the destination. Unrestricted orbit/pan is deliberately disabled; mouse, touch and keyboard use equipment selection or visible guided-view controls.
- Original models use meter-scale authoring, UVs, bevels, weighted normals, layered panels, custom bed profiles and curved scanner/hatch meshes. Repeated static details are merged by material at export. This slice uses static batching rather than runtime instancing; moving equipment parts would require a later asset revision.
- A central sRGB material palette differentiates graphite paint, satin metal, ceramic, upholstery and rubber, while retaining exported metallic/roughness/normal maps. Shared runtime materials/textures reduce duplicate uploads; independent ceramic clones support subtle hover/selection highlights. Small maps tile at a finer scale rather than stretching as broad surface bands.
- Warm practical diffuser meshes correspond to two ceiling spot sources. One spot casts PCF shadows in standard mode; low mode disables dynamic shadows. Hemisphere/directional fill and a generated RoomEnvironment/PMREM provide reflection context. ACES filmic tone mapping and sRGB output are explicit. No bloom, particles, postprocessing composer, external HDRI or flat-room backdrop is used.
- The existing loader now configures a shared two-worker local WASM Draco decoder. A bounded two-tier promise cache retains successful assets across scene retries. Failed promises remain cached until explicit retry so failures reach the error boundary instead of looping in Suspense. Unique material/texture clones and generated environment render targets are disposed on cleanup; cached source models remain shared.
- Named GLB anchors and station registration preserve expansion points for future interfaces. The current equipment monitor says standby; it does not pretend to show clinical telemetry.
- Normal mode uses demand rendering. `benchmark=1` explicitly measures 20 active frames after model readiness, discards three warmup frames, then returns to demand mode. Idle demand rendering has no meaningful FPS figure. Camera settling metadata and completed-frame render counters support verification without claiming physical-GPU performance.

### Verification and quality gate

Four rendered review screenshots cover overview, examination, equipment and low quality. Inspection found and corrected blank exported map data, over-reflective material treatment and overly broad texture scale. Actual raycast hover/click, guided camera selection, context loss/retry, missing GLB recovery, crew navigation and existing medical entries are part of verification. Current results, measurements and limits belong to `FRONTEND_PROGRESS.md` and the screenshot measurement JSON.

The GLBs and environment are a serious first vertical slice **pending user art approval**, not a claim of finished AAA production quality. Remaining work includes bespoke high-resolution decals, richer equipment internals, local baked contact/occlusion detail, hardware performance profiling and review of plausible spacecraft/medical construction. No real-phone, physical-GPU or exhaustive accessibility acceptance is implied.

Final production-preview sampling used a 1920x1080 browser viewport and an approximately 1702x819 canvas. Standard measured 42 draw calls / 210,888 rendered triangles including shadows; low measured 24 / 78,244. SwiftShader software sampling was approximately 0.145 FPS standard and 0.259 FPS low, which is very slow. The original interactive frame/load budgets and 60 FPS aspiration are **not accepted or verified** on this evidence. Use the dashboard fallback for software rendering and profile actual demo hardware before performance sign-off. Full measurements and test evidence are in the progress record and screenshot JSON.

**Stop after this milestone for review.** The next recommended action is visual/art and target-hardware acceptance, then a separately approved bounded holographic interface milestone. The older plan's full module roadmap remains future scope.

## Historical Phase 2 implementation decisions

The user explicitly authorized foundation implementation in `D:/nasa-hackathon` through the request headed “PHASE 2 | FRONTEND FOUNDATION IMPLEMENTATION.” User Phase 1 means the completed audit; user Phase 2 means the foundation. This maps to the original roadmap's Phase 0 audit and Phase 1 foundation. The original roadmap's Phase 2 detailed 3D vertical slice remains deferred and is **not** part of the completed foundation. No next phase is authorized.

Sections 1–16 below retain the original audit baseline and forward plan. Statements there about no application or pending implementation describe the audit-time inventory, not the current workspace. Use `FRONTEND_PROGRESS.md` for the current implemented inventory and actual checks.

### Decisions realized in the foundation

- React 19.3.1 / React DOM 19.3.1, Vite 8.3.8, TypeScript 6.0.3, Tailwind 4.3.5 with its Vite plugin, Three 0.187.0, R3F 9.8.2 and Drei 10.7.9 are installed with exact direct versions and one npm lockfile.
- React Router DOM 7.18.5 implements BrowserRouter routes. All seven station IDs, including overview and the six independent module entries, are registered. Emergency now has its own placeholder route as well as a route-preserving global rehearsal modal. This extends the original route proposal to give the emergency team an independent entry point.
- React context is sufficient for this milestone's in-memory emergency/motion state. Crew and station remain URL-owned. No Zustand, backend adapter, request cache, persistent storage or authentication was introduced.
- Medical contract interfaces and two fictional static crew fixtures verify wiring. No streaming simulation engine, live data adapter, clinical thresholds, interpretation, risk engine or AI service exists. The source brief's future calculation requests remain outside this frontend scope.
- The scene is deliberately empty: an environment group, neutral background and basic lighting establish the scene boundary without pretending to be a medical bay. One CameraRig owns constrained CameraControls. All presets currently share the neutral overview pose until a safe authored layout exists.
- Canvas persists across station and crew changes within bay mode. Switching to dashboard mode or mission initialization intentionally releases graphics resources; returning to bay creates a fresh renderer. Scene-only retries also remount Canvas. Dashboard routes do not load the lazy renderer chunk.
- WebGL 2 detection, renderer loading/error fallback, actual context-loss handling and retry preserve access to DOM station views. The empty asset registry and dynamic GLB loader are ready for future local assets. Draco/Meshopt/KTX2 decoder configuration, real assets, lighting production and safe camera paths remain future work.
- Standard/low DPR and antialias settings are configured, with demand rendering. Real-device adaptive-quality tuning is not implemented or measured.
- CSS transitions and Drei camera smoothing cover current animation requirements; no separate animation dependency was necessary. System typography replaces the proposed downloadable font pair for this milestone, avoiding an external font dependency until final visual direction is approved.
- ESLint, strict TypeScript checks, Vitest/Testing Library and Chromium Playwright checks are configured. The current machine is Node 25.2.1 / npm 11.6.2; Node 24 LTS is recommended but was not tested here. Vitest 4.1.12 and jsdom 27.4.0 were selected because latest majors excluded Node 25. TypeScript 6.0.3 satisfies typescript-eslint's `<6.1` peer range; latest TypeScript 7 did not.
- npm reported a moderate minimatch advisory through lint tooling. A pinned `minimatch: 11.0.8` override and deduplication remove the advisory; lint, types and tests validate the selected graph. Track upstream removal of this temporary override. No forced dependency downgrade was applied.

### Foundation verification and limits

All nine component/contract tests and all five Chromium workflow tests passed. Browser tests verified Canvas DOM identity across station and crew changes, actual WebGL context loss/retry, unavailable-WebGL fallback, all six module entries, crew selection, modal focus restoration, keyboard skip navigation, deep links/reload/Back and layout overflow at multiple widths. Desktop/mobile screenshots were visually inspected. Production-preview smoke checks rendered vitals and initialized the renderer without page errors. See the progress record for exact commands and final results.

The browser reports WebGL 2 through ANGLE/SwiftShader software rendering. No physical-GPU, real-phone, Safari, Firefox, screen-reader or performance-budget validation is claimed. The lazy renderer chunk currently exceeds Vite's 500kB warning threshold; initial/dashboard routes avoid loading it. R3F currently uses Three.Clock, which triggers a Three deprecation warning. A WebGL extension warning can occur during the intentional context-loss teardown. These warnings did not cause test failures; preserve them as known issues rather than hiding them.

The next recommended milestone is the **detailed 3D vertical slice**, subject to separate approval of floor plan, assets/licenses, target devices and art/performance acceptance. Complete medical dashboards are still deferred.

## 1. Executive finding and audit boundary

The supplied workspace is a requirements-only starting point. It contains one Word document and no frontend application. The planned experience therefore requires a new frontend foundation, rather than an extension of verified existing code. This report separates observed facts, requirements, and proposed decisions. No application code was created or modified, no dependencies were installed, and no implementation phase was started.

The audit covers the entire supplied `D:/nasa-hackathon` tree, including hidden entries. It does not establish whether another checkout, remote repository, or unprovided branch contains an application. Git reports that this directory is not a repository. If an existing application was expected, confirm its location before scaffolding anything.

## 2. Verified repository inventory

Before this audit, the complete workspace inventory was:

```text
D:/nasa-hackathon/
  NASA SPACE APP CHALANGE PROJET RECUIREMENT AND GUID LINES.docx
```

The document is 21,030 bytes. SHA-256: `B267B9EFFDA7250C61CC3D11FF1464C40C91BF99E488E11924CB7EB307E66F3B`.

Read-only inspection used a root listing with hidden entries, recursive inventory, `rg --files --hidden`, package/lockfile and AGENTS searches, and `git status --short`. The Word document's paragraph text was read directly from `word/document.xml`; the archive has no `word/media/` entries. Document visual layout was not assessed because this is a requirements and code audit, not a Word formatting review.

| Audit area | Verified result | Implication |
| --- | --- | --- |
| Framework and dependencies | No package.json, lockfile, or node_modules | React, Vite, Tailwind, Three.js, R3F and Drei are intentions only |
| Routing and entry points | No source files, index.html, or router | No executable screens or URLs |
| Folder structure | Only the requirements document | No existing conventions to preserve beyond this document |
| Pages, components and hooks | None present | No reusable frontend code |
| Styles, fonts and icons | None present | A design system must be proposed and approved |
| Animations and shaders | None present | No runtime motion to evaluate |
| Models and textures | No GLB/glTF, geometry, image, HDR or texture files | No environment assets exist locally |
| Tests, tooling and deployment | No configuration or scripts | Build, accessibility and runtime performance cannot be measured |
| Git and local instructions | No .git; no applicable AGENTS.md found in checked ancestors/workspace | Branch, remote, history and integration practices are unknown |

After the audit, only this document and `docs/FRONTEND_PROGRESS.md` are added. An absent implementation is not a failed implementation: runtime tests are not applicable yet.

## 3. Existing requirements and reusable material

The Word document defines all six requested modules, floating holographic panels, interactive navigation, simulated charts, sleep tracking, GCR/SPE radiation representation, exercise logging, SANS checklists, mood/stress logging, support content, diagnostics recommendations, and an emergency screen. These are specifications, not verified features.

Reusable material consists of the product brief, module vocabulary and team assignments:

| Person | Document assignment | Proposed frontend handoff |
| --- | --- | --- |
| Zohaib | Frontend lead and 3D environment | App shell, scene, camera, models and rendering budget |
| Faiz | UI/UX and holographic dashboards | Reusable DOM panels, charts, forms and responsive layouts |
| Saad | Backend, state and integration | Agree snapshot/event contracts; provide external data or deterministic fixture inputs |
| Fatima | Domain research and content | Approved labels, units, explanations, protocol copy and citations |
| Minal | QA, integration and pitch | Acceptance matrix, target-device checks and repeatable demo script |

These are proposed responsibilities based on the source, not confirmations of team availability. The brief asks for risk calculation and AI output; the current user instruction explicitly excludes medical engines and real AI. The frontend will display supplied results or labeled fixtures and collect inputs. It will not derive cancer risk, diagnose SANS, invent clinical thresholds, or call an AI provider.

## 4. Complete proposed user journey

1. **Mission initialization:** show project identity, educational simulation label, mission profile and available demo scenario. Offer standard, reduced-motion and dashboard modes. Load the shell first, report real asset-loading progress, and allow entry into dashboard mode if 3D fails. Do not invent loading percentages.
2. **Enter the bay:** a short skippable arrival reveals an authored spacecraft interior and central examination station. A persistent mission strip shows scenario time, connection/fixture status and selected astronaut. No mandatory cinematic blocks access.
3. **Choose an astronaut:** open a labeled crew roster; show identity, role and supplied status summary. Confirm selection visibly in every station. Switch snapshots atomically so old charts cannot appear under a new name.
4. **Navigate spatially:** click a station hotspot or use the equivalent station list. A constrained camera move brings the station into view, then opens its readable panel. Show location and a return-to-overview control. Keyboard and touch can perform every action.
5. **Inspect and record:** review vitals, radiation, physical assessment and wellbeing. Expand history and explanations; submit local demo logs with clear persistence status. Pause animated visualizations independently of data inspection.
6. **Review diagnostics:** inspect supplied findings, supporting measurements, timestamps and content provenance. In the demo, selecting a scripted event changes the scenario; nothing implies a real AI analysis occurred.
7. **Emergency scenario:** a global emergency action opens an immediate DOM protocol overlay without waiting for camera motion or model loading. Scenario type is explicit. Users can acknowledge individual steps locally and exit back to the prior station and astronaut. Any confirmation needed to reset the demo does not delay viewing protocol steps.
8. **End or restart:** show completed demo actions and allow an explicit reset of demo logs. No account, authentication, export or cloud persistence is assumed.

Proposed route model: `/` for initialization, `/bay/:stationId?crew=:crewId` for the persistent bay, and `/dashboard/:stationId?crew=:crewId` for the equivalent flat view. Station IDs: `overview`, `vitals`, `radiation`, `physical`, `wellbeing`, `diagnostics`. Emergency is an overlay state that preserves the return location. Unknown station/crew IDs get a useful recovery screen. Browser Back restores navigation; route changes must not recreate the Canvas. Deployment must support SPA deep links or an agreed hash-route alternative.

## 5. Module scope and acceptance behavior

| Module | Required frontend experience | Meaningful 3D representation | Completion criteria |
| --- | --- | --- | --- |
| Holographic medical bay | Initialization, crew roster, station list, loading/errors, overview | Detailed shell, examination bed, gantry, equipment and spatial hotspots | All five clinical stations reachable by DOM and scene controls; selection survives navigation |
| Biometrics and vitals | Heart rate, BP, SpO2, HRV and sleep history with units, time and source | Selected-crew body scan, schematic pulse path and waveform synchronized to supplied samples | Current/history views, missing/stale states and pause controls; never label a schematic waveform as acquired ECG |
| Radiation | Supplied current/cumulative dose, history, GCR/SPE scenario labels, shielding explanation | Shield cross-section and particle paths illustrating the selected scenario | Explicit unit/time basis and supplied severity; no client-side cancer-risk inference or claim of a live CANS feed |
| Physiological and musculoskeletal | Bone/muscle trends, exercise log, SANS symptom questionnaire | Segmented anatomy with selectable regions and time comparison | Text equivalent for each region; questionnaire collects observations without diagnosing |
| Behavioral and psychological | Mood/stress check-in, sleep context, support resource library | Quiet station with restrained ambient visual response to user input | Labeled sliders, nonjudgmental copy, save/error feedback and explicit local-demo storage behavior |
| Diagnostics and emergencies | Supplied findings, evidence, scripted assistant prompts and emergency steps | Focus highlights connect findings to equipment/body regions | Mock/source label visible; emergency usable without WebGL; acknowledgments never imply a real mission action |

All modules require loading, empty, partial, stale, error and retry presentations. Unknown values display as unavailable, never zero. Severity uses text and icon as well as color. Review medical wording with Fatima; this plan makes no clinical efficacy claims.

## 6. Proposed frontend architecture

Use a TypeScript React SPA built with Vite, Tailwind for interface styling, Three.js through R3F, and selected Drei helpers. This is a proposed dependency set, not an installed stack. React Router is proposed for URLs; a small typed external store such as Zustand is optional pending approval. Keep panel state local and avoid adding a server-state library until a real transport exists.

Choose mutually compatible versions during approved foundation work and commit one lockfile. Official R3F guidance pairs Fiber 8 with React 18 and Fiber 9 with React 19; do not mix their majors. Verify Drei/Three peer requirements, Vite's supported Node runtime, and the selected Tailwind generation before installation. Current Tailwind Vite guidance uses its dedicated Vite plugin; avoid mixing that setup with older tutorials. See references below.

Proposed structure (none of these application files exists yet):

```text
src/
  app/                 # providers, router, persistent shell, error boundaries
  features/
    mission/           # initialization, roster, scenario selection
    vitals/            # panels, history adapters and view models
    radiation/
    physical/          # anatomy selection, exercise and SANS forms
    wellbeing/
    diagnostics/       # findings and scripted demo assistant
    emergency/         # global protocol overlay and local acknowledgments
  scene/
    MedicalBayCanvas.tsx
    environment/       # shell, fixtures, lighting and atmosphere
    stations/          # equipment instances and station anchors
    navigation/        # CameraRig, waypoint registry and transitions
    holograms/         # display surfaces, masks and effects
    anatomy/           # rigged body and region visualization
    interaction/       # hotspots, selection and hit proxies
    assets/            # model bindings, manifest and loader configuration
    quality/           # tier selection and instrumentation
  ui/                  # buttons, dialogs, panels, charts, status and forms
  domain/              # frontend contracts, units and view-model mapping
  data/                # adapter interface, fixtures and scenario clock
  state/               # session, navigation, selection and preferences
  styles/              # semantic tokens, typography and global styles
  test/                # contract fixtures and test utilities
public/assets/
  models/              # runtime optimized GLBs, never raw authoring files
  textures/            # compressed texture variants
  environments/        # reduced-resolution environment lighting
  fonts/
  licenses/            # attribution and license records
```

Keep large authoring sources in an agreed separate asset repository/storage location; do not commit unoptimized Blender scenes into the runtime bundle by default. Asset manifest records ID, URL, version/hash, bytes, bounds, tier, station, animations, license and fallback.

### Scene composition and ownership

One persistent Canvas contains scene-level Suspense/error boundaries, one camera rig, lighting, shell, station groups, active anatomy/holograms and optional postprocessing. React DOM outside Canvas owns the mission strip, navigation, roster, active dashboard, dialogs and emergency overlay. Independent station failures must not blank the whole app. Failed essential shell assets trigger a useful dashboard fallback.

Load shell and one hero station first; stream station detail when approached. Shared geometry/material ownership must be documented so unmounting a station does not dispose cached resources used elsewhere. Dispose unique render targets and generated geometry on cleanup. React Strict Mode must not double-create timers, listeners or subscriptions.

### State boundaries

- URL: selected station, astronaut and display mode; validate all values.
- Session store: scenario, transition state, panel selection and local acknowledgments.
- Data adapter: immutable snapshots/events; independent of rendering and camera.
- Preferences: quality, reduced motion and optional audio. Persist preferences only by default.
- Frame state: camera interpolation, shader uniforms and skeletal motion in refs/useFrame; no React state updates at frame rate.

Changing crew cancels or invalidates pending requests using crew/scenario IDs. One scenario clock drives charts, replay and animations. UI rerenders at a modest snapshot rate; high-frequency samples remain bounded buffers. Navigation and emergency states cannot compete for camera ownership.

## 7. Camera and spatial interaction

Use a single perspective camera controlled through a CameraRig and constrained Drei CameraControls. Provide authored overview and station waypoints: position, target, FOV bounds and permitted orbit range. All navigation requests pass through one controller; do not mount competing OrbitControls/CameraControls instances.

Prefer guided waypoint movement over default first-person/pointer-lock travel. Author safe paths around bulkheads; do not rely on interpolating straight through equipment. Limit orbit, zoom and scene bounds at each destination. More complex free-flight/collision physics is a later optional feature, not needed for the core journey.

Transition states are idle, preparing, moving and focused. Resolve asset readiness before moving; new requests supersede old transitions and settle at a valid destination. DOM panels remain usable throughout. Escape closes detail and returns focus; Home/overview has a visible control. Reduced motion uses a cut or brief fade. Reset recovers from a lost camera. Hotspots have generous invisible hit proxies, visible labels on selection and keyboard equivalents; overlays must not click through to the scene.

## 8. Holographic interfaces and visual direction

The distinctive visual anchor is the medical gantry and its layered anatomical projection. Surrounding structure is physically plausible and visually quieter: service rails, cable routing, restraint points, removable panels, ventilation, labeled storage and maintenance access.

Proposed palette: structural navy `#101B2A`, panel slate `#203448`, porcelain `#DCE6ED`, hologram cyan `#63DCEB`, caution amber `#F3BD61`, critical coral `#FF7A73`. These are starting tokens requiring composed contrast checks; translucent surfaces do not guarantee readability. Use a humanist sans such as Source Sans 3 for body/interface and a restrained technical display family such as Space Grotesk for station titles, subject to font license/performance review. Use tabular figures for measurements, 4/8-based spacing, and sentence-case labels.

Separate reusable **content** from **presentation**:

- `StationPanel` owns the shared view model, headings, status, time/source and actions.
- `Metric`, `TrendChart`, `Legend`, `AssessmentForm`, `FindingCard` and `ProtocolSteps` render semantic DOM and accessible summaries/tables.
- `HologramAnchor` positions a limited world-space preview with Drei Html where appropriate.
- `HologramSurface` handles shader edges, low-intensity scan lines and restrained emissive effects; it never owns clinical data semantics.
- `PanelHost` renders the same content in a desktop drawer or mobile full-width sheet.

World-space previews display a few summary values. Full charts and editable forms move into the readable DOM panel. Do not duplicate hundreds of DOM labels in 3D or rasterize all text into inaccessible textures. Avoid flashing alarms, heavy bloom over text, and glass layers that obscure equipment or controls.

## 9. Advanced asset and environment strategy

No asset below has been downloaded, selected or verified as production-ready. A detailed environment requires authored meshes, UVs, texture work and art direction; a room assembled entirely from cubes, cylinders and spheres will not meet the brief. Primitive geometry is acceptable for temporary composition studies, collision/hit proxies and small secondary elements only.

| Asset group | Create, source or generate | Required detail and rationale | Proposed initial budget |
| --- | --- | --- | --- |
| Bay shell kit | Custom authored in Blender or equivalent | Beveled structural ribs, layered wall inserts, pressure hatch, recessed rails, vents, fasteners, cable channels and floor restraints; reusable modular joins | 120–180k visible triangles high tier, 40–60k low |
| Examination bed and gantry | Custom hero asset | Articulated scanner, restraint hardware, cushions, joints, sensor mounts and cable connections; separated animated parts | 70–120k high, 20–40k low |
| Medical equipment | Source with verified license, then adapt; author distinctive devices | Monitor housings, ultrasound-like probe dock, instrument rack, sample containers and emergency cabinet; coherent scale and materials | 20–45k per active station; stream inactive details |
| Human anatomy | License a segmented/rigged educational asset or commission | Body silhouette, skeleton and major muscle regions with stable region IDs; medical content review required | 60–100k active high, 20–35k low |
| Astronaut identity | Custom portraits/crew cards; optional later character model | Start with fictional crew and one reusable anatomy model; avoid five costly character rigs | Character avatars deferred unless approved |
| Surface materials | Source licensed PBR sets plus custom trim sheets/decals | Painted composite, satin metal, polymer, fabric padding, label decals; roughness variation and baked small detail | Mostly 1k/2k; 4k only for justified hero closeups |
| Holograms | Procedural shaders plus authored display meshes | Depth slices, stable silhouette edges, scan mask and selected-region highlighting | One active anatomical projection; limited transparent layers |
| Radiation/exercise visualization | Procedural instanced paths/rig animation | Scenario particle paths, shielding cutaway, selected exercise motion and before/after overlays | Bounded particle pools and a small reusable animation set |
| Repeated fittings | Instanced authored kit pieces; procedural placement | Bolts, vent inserts, lights and rail segments positioned from a layout registry | Shared materials and geometry; avoid per-object unique materials |
| Earth/window/background and lighting | Source approved imagery/environment or create a restrained backdrop | A believable external reference and reflection lighting without a second large scene | Small environment map; no unnecessary full space simulation |

Budgets are provisional engineering targets, not measured facts. Per-asset targets must fit the aggregate budget in section 11; never load every station's maximum detail simultaneously.

### Asset production and handoff

1. Approve a reference board and bay floor plan. NASA's 3D resource hub is a candidate for spacecraft reference/context; it is not evidence that a ready-to-use medical bay exists. Review each download and its usage conditions. Other commercial/open libraries are candidates only after license, geometry and visual review; no purchase is authorized here.
2. Establish meter units, Y-up runtime orientation, consistent forward direction, floor origin, applied transforms, clear pivots and naming. Use IDs such as `station_vitals`, `anchor_panel_vitals`, `hotspot_radiation`, `bone_femur_left`. Supply safe camera bounds and panel anchors as named nodes or a manifest.
3. Build detailed high-poly hero forms, retopologize runtime meshes, UV unwrap, bake normal/AO maps and create reusable trims. Avoid geometry for every scratch or bolt. Author shell and equipment as separate streaming packages.
4. Export GLB/glTF 2.0 with PBR metallic/roughness materials, correct color-space tagging, sensible transparency and animations. Verify base color/emissive versus linear data textures. Audit unsupported materials/modifiers before export.
5. Produce explicit high/low LOD variants, mesh compression using a supported Meshopt or Draco path, and KTX2/Basis texture variants with the corresponding loader/decoder setup. Geometry compression and texture compression solve different costs. Keep decoder assets compatible and locally served for a reliable demo.
6. Validate the GLB, inspect bounds/normals/UV seams, compare Blender and runtime lighting, test node/animation IDs, and inspect real device GPU memory. Record source, creator, license, attribution, modifications, size, triangles, materials and test result before approval.

Bake ambient occlusion/indirect light into appropriate maps or lightmaps while keeping hero lighting dynamic. Never bake a selected-crew alert into a static texture. Retain source files outside the runtime folder so later optimization does not destroy editability.

### Lighting and medical animation

Use an environment reflection map, broad key/fill illumination, authored emissive practical strips and a restrained scanner rim light. Emissive meshes alone do not light surrounding geometry. Use baked indirect light and a small number of actual lights; one tightly bounded shadow-casting hero light is the default. Reserve contact shadows, AO and subtle bloom for tested tiers; avoid overlapping realtime shadow maps, full-volume fog and screen-wide glare. Test PBR metal under reflection lighting rather than increasing metalness to fake detail.

Meaningful motion includes scanner travel on an authored rail, selected bone/muscle region comparison, an exercise rig demonstrating a supplied countermeasure, and radiation paths changing with an explicit scenario/shield selection. A pulse schematic may follow sample timing, but must not fabricate a diagnostic waveform. Label anatomy overlays and particle paths as illustrative; no physical radiation transport or biomechanical model is implied.

## 10. Animation, responsive behavior and accessibility

Use useFrame for continuous shader/scene updates, Three AnimationMixer for exported clips, and CSS transforms/opacity for DOM feedback. Add a timeline library only if choreography cannot be kept simple. One navigation orchestrator owns camera transitions; maintain explicit cleanup and cancellation. Initial targets: immediate feedback under 100ms, panel changes around 150–250ms and skippable station moves around 600–1200ms, tuned to distance and comfort.

Desktop: wide scene, mission strip and docked panel. Tablet: larger touch targets, compact station navigation and expandable panel. Phone: dashboard-first with optional simplified 3D preview; do not shrink the entire desktop cockpit. Suggested layout ranges are below 768, 768–1199 and 1200+ CSS pixels, adapted to available space rather than device names.

Provide 44px preferred touch controls, keyboard navigation, visible focus, semantic headings, labeled forms, text/chart-table alternatives, meaningful error messages and focus restoration. Target WCAG 2.2 AA; test contrast against the final composited background. Do not announce every telemetry tick; announce meaningful status changes at a controlled rate. Respect reduced motion and pause decorative activity. Test 320/375px widths, landscape, 200% zoom, keyboard-only flow and a screen reader. If WebGL is unavailable or context is lost, retain the same crew and station in dashboard mode and offer a scene retry.

## 11. Performance and delivery strategy

These are proposed budgets to validate after target hardware is approved, not current results:

| Measure | Standard desktop tier | Low/mobile tier |
| --- | --- | --- |
| Sustained frame target | About 60fps; p95 frame time <=20ms | At least 30fps; p95 <=33ms |
| Visible triangles | <=500k | <=180k |
| Draw calls | <=150 steady-state | <=80 steady-state |
| Pixel ratio | Cap at 1.5, adapt downward | Cap at 1.0 |
| Estimated resident texture allocation | <=256MiB | <=128MiB |
| First usable shell + one station assets | <=12MB compressed transfer | <=6MB |
| Shadow/effect tier | One shadow light, optional subtle effects | Baked shadows; effects off |

Measure a warm two-minute scripted journey and a ten-minute soak on agreed devices; record browser, resolution and quality tier. A provisional loading goal is first usable interaction within 8 seconds at 20Mbps desktop and 10 seconds at 10Mbps low tier, including decoder/parse overhead. Report actual loading timings rather than assuming transfer size guarantees them. Estimates of texture allocation are engineering estimates, not universally available browser VRAM counters.

Use instancing for repeated fixtures, shared materials, LODs, frustum/station culling, bounded waveform buffers, lazy station assets and controlled texture residency. Split renderer code from initialization/dashboard code. Keep essential fixtures and assets local for the demo, with cache-busted deployment URLs; avoid runtime reliance on third-party asset hosts.

R3F supports demand rendering, resource reuse and adaptive quality; continuously animated stations still require invalidation/frames. Pause offscreen animation and hidden-tab work. Inspect renderer draw calls/triangles and memory trends, browser performance traces and loading waterfalls. Avoid state updates and allocations in frame loops. Quality downgrades need hysteresis so the image does not oscillate. A failing asset must release temporary resources and offer retry or flat mode.

## 12. Frontend integration contracts

These are proposed interfaces for agreement, not backend work or implemented API endpoints.

| Contract | Minimum agreed fields and behavior |
| --- | --- |
| Crew | Stable crewId, displayName, role, optional portrait URL and supplied summary status; fictional demo identity by default |
| Mission snapshot | schemaVersion, missionId, scenarioId, crewId, capturedAt UTC, sequence, source (`fixture` or supplied integration), connection state |
| Measurement | metricId, numeric value or null, explicit unit, measuredAt UTC, quality (`valid`, `missing`, `stale`, `invalid`), supplied severity and optional reference explanation |
| Time series | Metric/unit metadata and bounded timestamped samples; explicit sampling interval and gaps; no silent interpolation across missing intervals |
| Radiation | Dose rate and cumulative dose as separate metrics with explicit units and period; supplied GCR/SPE scenario and risk display text; no automatic conversion or risk inference without an agreed specification |
| Assessments | assessmentId, version, crewId, answers, recordedAt and save status; any interpretation comes from supplied reviewed content/results |
| Finding | findingId, crewId, status, summary, evidence metric IDs/timestamps, source, generatedAt, content version and disclaimer label |
| Protocol content | protocolId, version, scenario label, ordered steps, source references, review status and optional related metrics; supplied by domain owner |
| Adapter | listCrew, getSnapshot, getSeries, subscribeUpdates, saveCheckIn, saveExerciseLog and getProtocol; promise/subscribe semantics, cancellation and unsubscribe defined before coding |
| Errors/events | Normalized code/message/retryable fields; sequence and crew/scenario IDs on events; reject duplicates/out-of-order events and stale responses |

Use UTC ISO timestamps at boundaries; format displayed mission/local time explicitly. Domain owner agrees units and freshness windows per metric. The UI never treats absence as zero or calculates warning severity from invented thresholds. Keep raw supplied measurements distinct from visual scaling and chart formatting.

The initial adapter serves deterministic fixtures and scripted events, including missing/stale/error cases, so all modules work without a backend. No socket server, database or AI key is required. An optional future real adapter can implement the same contract without changing scene components. Store only explicitly approved demo inputs locally, with a visible clear/reset control; persistence is a decision, not a silent default. No real medical data is requested.

Integration responsibility: Zohaib owns station IDs, scene anchors and navigation; Faiz owns common panel interfaces; Saad agrees data contracts and supplies snapshots/fixtures; Fatima approves units/content/protocol versions; Minal maintains acceptance scenarios. Ownership and interfaces should be agreed before separate module work begins.

## 13. Technical risks and mitigation

| Risk | Evidence or likelihood | Mitigation / decision gate |
| --- | --- | --- |
| Wrong checkout assumption | Verified workspace has no code or Git metadata | Confirm this is the intended starting directory before scaffolding |
| Version/tooling mismatch | No manifest or runtime baseline | Approve compatible dependency matrix and supported Node version in Phase 1 |
| Unrealistic asset expectations | No models or textures exist | Approve hero art sample, budget, creator and license before whole-bay production |
| Excess GPU/transparency cost | Dense PBR bay plus holograms is proposed | Layer limits, baked lighting, tier budgets and an early art performance gate |
| Camera clipping/motion discomfort | Navigation paths do not yet exist | Authored waypoints, path checks, cancellation and reduced-motion cuts |
| Canvas accessibility and tiny labels | Spatial-only UI would exclude users | Equal DOM navigation/data access and dashboard fallback |
| Telemetry rerender overload | Real-time-looking charts are required | Separate sample buffers from UI cadence and frame state |
| Crew/scenario data leakage | Multiple astronaut views planned | Key subscriptions by identity, cancel requests and apply snapshots atomically |
| Medical overclaiming | Brief includes diagnostic/calculation requests | Supplied results/fixtures only; domain-reviewed copy and explicit simulation labels |
| Asset decoder/hosting failures | Compression and SPA routing proposed | Test packaged decoders, base paths, MIME/CORS and deep-link refresh before demo |
| Resource leaks/context loss | Persistent Canvas with streamed models proposed | Ownership rules, cleanup, soak testing and retained DOM mode |
| Sensitive check-in persistence | Wellbeing logs are in the requirements | Fictional data and memory-only default until storage approval |
| Schedule/scope expansion | Six modules plus custom art; no deadline supplied | Prioritize one polished vertical slice, then extend common contracts |

No current code defects, bundle regressions or runtime performance problems can be asserted because no executable application exists.

## 14. Phased implementation roadmap

All implementation phases are pending approval. Phase 2 is explicitly not implemented in this audit. Estimates are work packages, not promised dates; duration depends on team availability, asset sourcing and the hackathon deadline.

| Phase | Dependencies | Deliverables | Acceptance criteria | Verification |
| --- | --- | --- | --- | --- |
| 0 — Audit and approval | Supplied workspace and brief | These two planning documents; evidence, scope and decisions | Claims tied to inventory; no application changes or installs | Compare final file inventory and source document hash |
| 1 — Foundation and contracts | User approval; confirm checkout, target devices and stack | React/Vite/TS foundation, tokens, routing shell, fixture adapter, contract definitions, fallback shell | Clean install/build on agreed runtime; routes and crew selection work; empty/error states represented; compatible locked versions | Type/lint/build checks; route/selection contract tests; keyboard smoke test |
| 2 — Art direction and 3D vertical slice | Phase 1; approved assets/licenses and floor plan | Detailed shell section, hero examination station, production PBR sample, light rig, camera rig and one holographic vitals panel | Authored detailed geometry passes art review; overview-to-station journey works; DOM equivalent works; provisional performance budgets met | Side-by-side reference review; model validation; camera clipping checks; timed asset load and GPU/render profiling on target devices |
| 3 — Crew biometrics and radiation | Phase 2 accepted; agreed measurement/unit contracts | Crew-aware vitals/sleep history, radiation panel, scripted event playback and meaningful visuals | Correct crew/time/unit context; missing/stale/error behavior; no false live-source claims; fixture alarm changes both panel and scene | Deterministic scenario playback; contract mapping tests; chart/table comparison; crew switching during load |
| 4 — Physical and wellbeing stations | Phase 3 patterns; approved anatomy and questionnaires | Segmented anatomy, exercise log, SANS observation form, mood/stress check-in and resource library | All inputs labeled; anatomy has text equivalent; save/reset behavior explicit; no frontend diagnosis | Form validation and input retention checks; keyboard/touch; region-ID mapping; persistence behavior test |
| 5 — Diagnostics and emergency flow | Shared contracts stable; domain-approved copy | Scripted/supplied findings, evidence links, protocol overlay and local acknowledgments | Mock/source labels clear; emergency opens immediately from every station and works with failed WebGL; crew/return route preserved | Normal, missing-data and critical scenario walkthroughs; mid-transition emergency test; no real AI/network dependency check |
| 6 — Integration, optimization and demo readiness | All required modules complete | Quality tiers, fallbacks, final optimized assets, accessible responsive UI and repeatable demo | Six-module journey complete; no blocking console errors; agreed frame/load budgets; 10-minute soak has no unbounded growth; keyboard and reduced-motion journey works | Production build preview, target-browser/device matrix, deep-link refresh, slow/offline network, missing GLB, context loss, zoom/screen-reader checks and demo rehearsal |

Critical path: approval → foundation/contracts → detailed vertical slice/performance gate → shared module expansion → diagnostics/emergency → integrated validation. Content preparation and asset research can be scheduled alongside approved foundation work, but no such production work is authorized by this audit. Do not build all six station art packages before the vertical slice proves quality and performance.

Minimum coherent demo includes the detailed central bay, selectable fictional crew, all six module views, one deterministic adverse scenario, emergency steps and dashboard fallback. Custom full-body crew characters, unrestricted free-flight, voice chat, live CANS/NASA feeds, real AI, physical radiation simulation and clinical risk calculations are outside the proposed core.

## 15. Decisions requiring approval

Before Phase 1:

1. Confirm `D:/nasa-hackathon` is the intended starting workspace, or provide the existing code location if one was expected. Approve creating a new frontend and, separately, initializing Git if desired.
2. Approve the TypeScript React/Vite/R3F/Drei/Tailwind SPA direction, proposed routing/state approach and compatible version selection during foundation work.
3. Set the hackathon deadline, team availability, target browsers/devices and minimum acceptable demo hardware. Approve desktop-first immersive mode with equal dashboard access and phone-first dashboard behavior.
4. Approve fictional deterministic data and scripted diagnostics, with medical calculations, backend/database and real AI excluded. Confirm who supplies reviewed content and measurement semantics.
5. Decide memory-only logs versus opt-in local persistence and whether any audio is desired; recommended defaults are memory-only and audio off.

Before Phase 2:

6. Approve floor plan, art direction and whether the bay is an original plausible design or must match a particular real spacecraft.
7. Set custom asset creation capacity and any sourcing budget; approve individual asset licenses before use or purchase. No spending is assumed.
8. Approve guided waypoint navigation, a custom hero gantry/bed, reusable authored shell kit and licensed/commissioned anatomy.
9. Agree the final performance budgets using actual target hardware and the vertical slice results. Approve the fallback/degradation policy.

Before release: approve domain content/protocol versions, hosting target/deep-link strategy, demo scenario and acceptance sign-off. Approval of this report does not imply approval of unselected paid assets or future external integrations.

## 16. Primary technical references

Checked on 14 November 2026; compatibility must be checked again when implementation is authorized. These references inform proposals and do not prove any local feature exists.

- [R3F installation and React major pairing](https://r3f.docs.pmnd.rs/getting-started/installation)
- [R3F rendering, instancing and performance guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [Drei CameraControls](https://drei.docs.pmnd.rs/controls/camera-controls)
- [Three.js GLTFLoader and decoder integration](https://threejs.org/docs/pages/GLTFLoader.html)
- [Vite setup and supported runtime guidance](https://vite.dev/guide/)
- [Tailwind installation with Vite](https://tailwindcss.com/docs/installation/using-vite)
- [NASA 3D resources and linked usage guidance](https://science.nasa.gov/3d-resources/)

