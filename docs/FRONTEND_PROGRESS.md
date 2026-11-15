# Space Station Medical Bay Frontend Progress

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


## Historical reference-driven 3D upgrade — prior approval gate

New independently authored GLBs now serve both the operational scene and the review view. Warm ceramic, teal upholstery, ochre/copper services, a deeper gantry, hardware and textured traction deck replace the rejected grey benchmark. UI/nav/modules/chapter choreography are unchanged. See [asset specification](REFERENCE_ASSET_SPEC.md) and [reference-driven review](REFERENCE_QUALITY_REVIEW.md). Earlier visual approvals/statuses below are historical. Verification: TypeScript/build/lint passed; 19 unit tests and 14 browser tests passed. Final unrecorded Intel UHD 620 result: low 53.85 FPS, standard 24.62 FPS. Both tiers retained resource identities, with zero repeated GLB requests across six camera legs. Standard remains below target and the reference realism is not yet matched. Stop after this environment review.

## Visual environment reset — review required

A separate `/visual-benchmark` now demonstrates the new authored environment and a reversible 2.2-second overview/examination camera move. This is the current art approval gate. Verification: TypeScript/build/lint passed; 18 unit and 14 browser tests passed. Intel UHD 620 unrecorded demonstration: low 54.89 FPS, standard 38.33 FPS; resource identities retained and zero repeated GLB requests. Actual screenshots and a verified 23.2-second recording are included in the review. Previous three-chapter layouts remain functional for continuity but are not approved visual references. No full UI, extra modules or additional chapter choreography was implemented in this phase. See [visual quality review](VISUAL_QUALITY_RESET.md).


## Historical corrective integration — awaiting review

The rejected opening and legacy routed UI have been superseded by one persistent, dark Orbital Medical OS experience with three working scroll chapters: Arrival, Explore and Biometrics. Existing /bay and /dashboard URLs resolve into this same presentation. Detailed assets and typed contracts are preserved. No remaining full medical modules or backend services were added. See [corrective integration report](CORRECTIVE_INTEGRATION_REPORT.md) for actual GPU measurements, code changes and executed checks. Earlier opening-only and legacy phase statuses below are historical. Stop for review.


## Historical opening approval gate — critical override

The user rejected the existing UI and authorized a new scroll-driven presentation. The root route now contains one working opening: **Care, beyond Earth**, with new Antonio typography, porcelain/oxblood identity, a live R3F aperture and reversible scroll-controlled camera travel. This replaces the root mission page; it does not implement the remaining two chapters. See [Opening experience review](OPENING_EXPERIENCE_REVIEW.md) for actual captures, recording, technical changes and limitations.

Existing operational bay/dashboard routes remain reachable for functional continuity and have not been creatively approved or restyled by this opening-only gate. Models, pipeline, contracts and backend boundaries are preserved. Earlier Phase 3B and Phase 3C-A creative recommendations are historical; this opening is a new direction under the explicit override. Verification: TypeScript/build/lint passed, 13 unit tests and 12 browser regressions passed; the focused opening rerun also passed all 3 tests. Final production captures include a 27.36-second live scroll recording, 0 healthy desktop page errors and unchanged hashes for all 6 GLBs. **Stop for user visual approval before remaining chapters.**


Last updated: 14 November 2026, Asia/Karachi.

## Historical status and phase mapping

**Phase 3B visual polish is implemented and tested, awaiting user visual review.** This refines user Phase 3 without starting medical dashboards or the next phase. Hardware and software measurements are now recorded separately; standard performance remains below the 60 FPS aspiration on the tested adapter. Work stops here for review.

The user explicitly authorized this refinement through the attached Phase 3B request. The original requirements Word document is preserved with the same SHA-256 as the audit. No Git repository was initialized and nothing was deployed. Earlier Phase 3 and Phase 2 records below are historical snapshots; the Phase 3B record is current.

## Phase 3B completion record

### Delivered visual and interaction changes

The primary desktop bay is a full-viewport spatial workspace rather than a scrollable page containing a scene. At 1440x900, browser assertions confirm a 1440x900 scene and exactly 900px document height. The project header, crew selector, module rail, camera controls, quality and emergency controls float over the environment. Clinical content opens in a collapsible contextual panel; overview starts with mission notes collapsed. Valid explicit quality selection survives station navigation. Dashboard mode remains a separate accessible layout and the mobile initialization default.

Mission entry received a limited two-column layout, original static equipment schematic and locally hosted technical typography. It does not mount a cinematic intro or implement new medical screens.

The existing three Blender assets were refined, not replaced by external props: service cartridges and seams vary the wall construction; coated pressure ribs have joint shoes; a ceiling spine adds purposeful engineering detail; deck material differs from the walls. The cradle has a smaller keyed base, exposed pivots/crossmembers, actuator and scanner cable looms, scanner sensor cassettes/drive housings and clearer labels. The diagnostic trolley gains protective display caps and a smooth probe cable. All original interaction anchor names and coordinates are preserved.

Material contrast and light balance were refined. A warmer stronger key, restrained cool fill and lower broad fill separate ceramic equipment from the hull. Standard retains one PCF shadow caster. A shared analytical contact mask provides two static grounding patches in both tiers. These are contact approximations, not a true AO bake. No bloom, heavy fog, particles or postprocessing composer was added.

The user-triggered standby indicator check is one 1.6-second emission pulse, with a static reduced-motion response and no camera movement. It is explicitly a visual simulation. No automatic rotating props, continuous idle scan or real diagnostics were added.

### Changed files and assets

| Area | Concrete changes |
| --- | --- |
| Application presentation | App.tsx adds a bay-scoped shell; Workspace.tsx adds contextual panel controls and compact mission presentation; StationNavigation.tsx preserves explicit quality; MissionView.tsx adds the brief/schematic |
| Styles and typography | New src/styles/immersive.css; main.tsx imports it; 4 locally hosted WOFF2 font files, source metadata and two OFL license files |
| Authoring | scripts/build_medical_bay.py refines the same environment/equipment and converts licensed Barlow Condensed outlines; removes the retired bitmap alphabet |
| Runtime scene | MedicalBayCanvas, SceneViewport, MedicalBayEnvironment, LightingRig and materials updated; new ContactGrounding.tsx; indicator animation remains isolated from medical UI/data |
| Camera and telemetry | CameraRig gains explicit diagnostic navigation using the same safe paths; SceneTelemetry records active intervals, visibility, CPU submission, camera travel and sampling validity; new quality/metrics.ts |
| Models | Six re-exported standard/low GLBs and both generated manifests; no third-party model/image asset |
| Verification | New scripts/review_phase3b.mjs; legacy capture utility delegates to it; new e2e/immersion.spec.ts and unit metrics tests; existing browser selectors updated to semantic environment-ready status |
| Test configuration | Playwright uses explicit D3D11 hardware arguments on Windows, with BAY_RENDERER=software available; no system/browser settings changed |
| Documentation | Master plan, this progress record, asset manifest, README and screenshots updated |

No npm dependency was added. Medical contracts, static fixtures, six feature boundaries, session state ownership, emergency modal semantics, error boundaries and original Word brief are preserved. No Git initialization, external deployment or next phase was performed.

### Screenshot review and evidence

Before images are preserved as `docs/screenshots/phase3b/before-full-bay.png` and `before-overview.png`; previous software measurements are copied as `phase3-baseline-measurements.json`.

Final images were captured from the running production app and visually inspected:

- [Mission entry](screenshots/phase3b/mission-entry.png)
- [Full medical bay overview at 1440x900](screenshots/phase3b/medical-bay-overview.png)
- [Examination station close-up](screenshots/phase3b/examination-station.png)
- [Scanner context and diagnostic equipment detail](screenshots/phase3b/equipment-detail.png)
- [Contextual module navigation](screenshots/phase3b/bay-navigation.png)
- [Low-quality overview](screenshots/phase3b/medical-bay-low.png)
- [375px mobile dashboard fallback](screenshots/phase3b/mobile-dashboard.png)

The full bay has no primary desktop scrolling, and its hero equipment remains visible between the overlays. Labels are materially clearer than the former voxel lettering. The close-up shows sensor cassettes and cable connections; standard and low both retain visible grounding. The contextual panel is intentionally readable/opaque enough for data and can be collapsed. The mobile fallback uses normal vertical document flow, not a shrunken cockpit. No healthy-path page errors occurred during capture. Some secondary room geometry is naturally cropped in close-ups; the selected equipment is the intended focal subject.

### Actual performance protocol and investigation

The old sampler forced active rendering, so its approximately 0.145/0.259 FPS cannot be explained merely by the scene normally using demand mode. It did not, however, establish foreground pacing or representative active navigation. The revised diagnostic discards three warmup frames after model readiness, explicitly renders continuously, moves the same controlled camera through safe presets, and records visibility/active mode/camera distance. It samples around five seconds/up to 300 intervals, with a 30-second measurement budget for a slow renderer, then returns to demand mode. Slow/background/idle or motionless samples are not certified as representative.

The host has an Intel UHD Graphics 620, driver 31.0.101.2135. Default headless Chromium initialized SwiftShader; an explicit D3D11 launch initialized the matching Intel adapter. Hardware test arguments were `--use-angle=d3d11 --ignore-gpu-blocklist --enable-gpu`. Performance runs additionally disabled background timer/renderer/occlusion throttling and foregrounded the page. Software runs explicitly requested SwiftShader. These are test-process options only; the app does not alter system/browser settings.

Chromium 159.0.8154.6; Windows; Node 25.2.1 / npm 11.6.2. Both paths reported a visible page and an idle rAF baseline about 16.67ms. Measured active mode was always-rendering, and actual camera distance was nonzero. This rules out idle demand-mode gaps in the new samples; software rendering/presentation/scheduling remains a likely dominant limitation. Exact driver/compositor contribution is unresolved because no GPU timer was collected. CPU render-submission time is explicitly not GPU-completion time.

| First-pass 1440x900 hardware measurement | Standard | Low |
| --- | ---: | ---: |
| Active average FPS | 28.71 | 60.03 |
| Sampled intervals / elapsed time | 198 / 6896.1ms | 300 / 4997.7ms |
| Mean / median frame period | 34.83 / 16.6ms | 16.66 / 16.7ms |
| p95 frame period | 61.0ms | 23.5ms |
| Median / p95 CPU submission | 3.8 / 6.1ms | 2.4 / 3.1ms |
| Draw calls / rendered triangles | 54 / 253500 | 32 / 96384 |
| Geometry / texture counters | 34 / 20 | 33 / 18 |
| Navigation to environment-ready status on localhost | 3375ms | 2127ms |
| Experimental JS used heap | about 21.7MB | about 21.7MB |
| Representative navigation validation | Passed | Passed |

Standard includes its shadow pass; low does not. Counts are renderer resource counts, not bytes of VRAM. JS heap is a coarse Chromium API observation and excludes GPU memory. Localhost ready timings include app/decode/shader/automation work and are not Internet loading claims. These are short, explicitly configured hardware runs, not sustained/all-device/default-browser performance guarantees. Standard did not meet a 60 FPS aspiration. Low averaged approximately 60 FPS in this particular run, with a p95 above a strict 16.7ms budget.

Forced SwiftShader yielded only 3 intervals over 35.3s in standard (about 0.085 FPS) and 7 over 33.9s in low (about 0.207 FPS). Visibility and active mode were valid, but both samples hit the slow-backend budget and are flagged limited/nonrepresentative for smooth navigation. They are not hidden, discarded as fake readings or used to represent physical-GPU performance. Software rendering remains unsuitable for smooth use; dashboard mode is the practical fallback.

Model body payloads: 1,354,924 bytes standard and 1,040,308 low, including embedded maps. Final resource entries measured GLBs plus local Draco decoder encoded bodies at 1,559,092 encoded bytes standard and 1,244,476 low, excluding app JavaScript and UI fonts. Compression/HTTP overhead differs from disk file sizes. First-pass metrics above are retained in first-pass-measurements.json. Final exact entries, launch arguments, intervals, sample validity and memory counters are retained in [render-measurements.json](screenshots/phase3b/render-measurements.json).

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

### Executed verification

| Command / check | Actual result |
| --- | --- |
| Existing Blender 4.5.15 background script | Six refined GLBs exported successfully |
| npm run typecheck | Passed |
| npm run lint | Passed with zero allowed warnings; rerun after QA utility updates also passed |
| npm test | 12 tests passed in 3 files |
| npm run test:e2e | Final production build plus 9 Chromium browser tests passed, 37.7s test execution (earlier pass: 42.4s) |
| npm run build | Passed; existing large lazy renderer chunk warning remains (~601.84kB minified / 159.76kB gzip, plus shared Three core) |
| npm audit --omit=dev | 0 production vulnerabilities |
| node scripts/review_phase3b.mjs | Required captures, real mesh hover/click and reduced-motion indicator assertions completed; 0 healthy-path page errors; hardware/software samples recorded |
| Fresh-page resource check | Actual GLB + local decoder byte totals recorded for both tiers |
| Model metadata checks | All six GLB sizes/hashes and Draco extensions verified; source triangle totals consistent |
| Original requirements document | SHA-256 unchanged: B267B9EFFDA7250C61CC3D11FF1464C40C91BF99E488E11924CB7EB307E66F3B |

Regression coverage includes all module entries/invalid locations, crew selection, Canvas identity, normal camera settling, model-failure retry, actual graphics context loss/retry, unavailable-WebGL fallback, emergency dialog focus/Escape/restoration, keyboard skip navigation, deep-link reload/Back, responsive widths, exact no-scroll desktop layout, keyboard panel toggling, quality retention and bounded/reduced-motion light feedback. The expected missing-model console error is fault injection, not a healthy-path runtime failure. Active benchmark validity also has unit checks that reject idle/background intervals and preserve slow frames.

### Remaining issues and recommendation

User visual approval remains open. The environment is refined review art, not final AAA production content. Contact patches are approximate; UV-baked AO, bespoke higher-resolution decals, richer equipment internals and independent mechanical articulation are not implemented. Low detail can show reduced curve/edge fidelity. Some background seams/panel families remain deliberately modular and repetitive.

Standard performance on the tested UHD 620 is approximately 28 FPS average, not 60. Default-headless SwiftShader is still very slow. No sustained soak, real-phone GPU, Safari/Firefox run, full screen-reader/contrast audit or GPU memory-byte measurement was performed. Native target-browser testing is still appropriate because hardware launch flags differ from default headless behavior. The existing renderer bundle warning/upstream Three.Clock deprecation remain known; no warning threshold was raised or dependency patched to conceal them.

Recommend user review of the actual 1440x900 screenshots and low-tier operation on the verified UHD 620 before proceeding. Technical regression evidence is complete for this pass; art acceptance and a broader performance target are not automatically granted. No full holographic medical UI, live telemetry engine, risk calculations, anatomy, AI, backend/database or unrelated page was implemented. **Stop after Phase 3B and wait for review.**

## Historical Phase 3 implementation record

### New files and assets

- `scripts/build_medical_bay.py`: original Blender authoring/export source, meter scale, beveled geometry, custom profiles, UVs, procedural image maps, material batching, two detail tiers and Draco compression.
- `scripts/capture_environment.mjs`: reproducible four-view screenshot capture, actual examination-station raycast/hover assertion and bounded render sampling.
- `src/scene/environment/MedicalBayEnvironment.tsx`: cached GLB instances, shared material application, raycast selection, hover, named station registration and resource cleanup.
- `src/scene/environment/materials.ts`: calibrated sRGB PBR palette, tiled normal/roughness maps, cross-model sharing and disposal.
- `src/scene/environment/LightingRig.tsx`: practical-corresponding light sources, one standard-tier shadow caster, fill and locally generated PMREM reflection lighting.
- `src/scene/quality/SceneTelemetry.tsx`: completed-frame draw/triangle/memory counters and explicitly requested bounded active-frame measurements.
- `src/scene/assets/generated-manifest.json`: exact model sizes, source triangle/material counts, hashes, authorship and review status.
- `public/assets/models/`: six GLBs and public manifest; standard set 1,095,276 bytes / 167,892 triangles; low set 813,620 bytes / 78,244 triangles.
- `public/assets/decoders/draco/`: local WASM wrapper and decoder, with Apache 2.0 license under `public/assets/licenses/`.
- `e2e/environment.spec.ts`: guided views, selected state, normal-motion settling, tier switching, preserved Canvas/crew/emergency and aborted-model recovery.
- `src/test/cameraPaths.test.ts`: pairwise Cartesian camera-path clearance through the modeled aisle.
- `docs/ASSET_MANIFEST.md` and `docs/screenshots/`: authorship, license, optimization/review status and four review images; render measurement JSON is recorded alongside them when available.

### Updated files and preserved behavior

`MedicalBayCanvas`, `SceneViewport`, `CameraRig`, presets, quality settings, registry and loader now mount the authored environment with local Draco, two-tier caching, loading/errors/retry, view selection and rendering options. Canvas still persists across crew/station/view/quality changes. URL crew selection and all six medical feature entry points remain unchanged. Emergency remains a native DOM modal independent of graphics.

`src/styles/index.css` makes the bay full width with compact feature content below, adds camera/quality controls and readable scene labels. App/Mission/Overview copy reflects the delivered environment instead of claiming the viewport is empty. No full medical interface was implemented.

`package.json` now makes `test:e2e` build first; Playwright runs serially against production preview to avoid HMR affecting the regression evidence. TypeScript and existing lint rules remain active. The React immutability rule is exempted only for `src/scene/**/*.tsx`, where R3F deliberately exposes mutable Three objects; other hook rules and all DOM immutability checks remain enabled. Node QA scripts declare their Node and browser-evaluation globals. `.tools/` and decoder distribution scripts are excluded from inappropriate lint scanning. No new npm dependency was added.

### Materials, lighting and interaction

The first render revealed blank normal/roughness exports and a uniformly reflective result. Blender image color space is now assigned before pixel data, followed by update/pack. The delivered GLBs were checked for their embedded maps. Runtime color calibration, fine texture tiling and controlled fill now distinguish dark panels, satin structural metal, off-white ceramic and muted upholstery. No bloom or postprocessing disguises geometry.

The examination station and trolley respond to actual mesh pointer events; hover changes cursor and ceramic emission, selection changes view and a subtle highlight. All three views have keyboard/touch DOM equivalents. Overview is reachable via its button or Reset camera. Guided motion is interruptible, respects reduced motion and follows a tested clear aisle; it is not a free-flight collision system.

Shadow, lighting, material and GLB caches are explicit. Shared source GLBs remain bounded to two tiers; runtime material/texture clones and generated PMREM render targets clean up on unmount/tier changes. No KTX2 or Meshopt pipeline is claimed. The retained ScenePlaceholder file is legacy foundation code and is no longer mounted.

### Verification status

- Original GLB byte counts and SHA-256 values verified for all six files; required Draco extension, embedded image counts and named expansion anchors checked.
- All ten component/contract/path tests passed.
- A complete production-preview suite passed all seven browser workflows, including the original five foundation checks and two environment checks. A subsequent targeted run adds direct normal-motion settling verification.
- Four screenshots were generated and inspected; examination hover/click was asserted against the actual canvas, not an HTML hotspot.
- Development and production rendering both executed without healthy-path page errors in capture checks. The expected aborted-model test intentionally exercises an error boundary; its console error is expected fault-injection evidence.
- Final lint, TypeScript, ten unit/contract/path tests and production build passed. The subsequent two-test environment rerun passed, including direct normal-motion camera settling at the expected native camera coordinates and model-failure retry.
- The final production-preview capture script completed successfully: pointer selection true, hover cursor pointer, four refreshed images and zero healthy-path page errors. The source GLB checks verified all six sizes/hashes, Draco extensions, embedded images and named anchors.
- `npm audit --omit=dev` reported zero production dependency vulnerabilities. No npm dependency was added in Phase 3.
- Original requirements SHA-256 remains `B267B9EFFDA7250C61CC3D11FF1464C40C91BF99E488E11924CB7EB307E66F3B`.

### Remaining quality limits and next approval

This is original vertical-slice art awaiting user review. It has no bespoke photographic texture set, baked AO/lightmaps, independent mechanical animation clips, patient anatomy or complete holographic displays. Some stenciled markings and equipment internals need further art polish. The room is an original plausible concept, not a certified real spacecraft or medical device.

Only software WebGL has been exercised so far: ANGLE/SwiftShader. Graphics checks are substantially slower than DOM-only checks. No 60 FPS, physical-GPU, real-phone or long-soak performance claim is made. Bounded sampling is used rather than leaving an unrestricted benchmark running. The renderer chunk-size warning and upstream Three.Clock deprecation remain; unused decoder variants can be emitted by the dependency bundler but runtime uses the explicit local decoder URLs.

Review the four images and running bay before approving further work. Next recommended work is art/hardware acceptance and, only after separate approval, one bounded holographic panel integration. Do not begin remaining medical modules automatically.

### Actual render sample

Final measurement source: `docs/screenshots/render-measurements.json`, generated by `BAY_URL=http://127.0.0.1:5175 node scripts/capture_environment.mjs` against the production preview. Browser: Chromium 159.0.8154.6. Windows / Node 25.2.1 / npm 11.6.2. Renderer: ANGLE Vulkan SwiftShader (software). No physical GPU was exercised.

The browser viewport was 1920x1080; the actual bay canvas was approximately 1702x819 CSS pixels / 1702x818 drawing-buffer pixels inside the application shell. The bounded sample requests 20 active frames after model readiness, discards three warmup frames, and returns to demand rendering; one queued frame yielded 18 measured frame intervals. This is a small local sample, not a sustained hardware benchmark.

| Actual measurement | Standard | Low |
| --- | ---: | ---: |
| Completed-frame draw calls, including shadows where active | 42 | 24 |
| Rendered triangles, including shadow pass where active | 210888 | 78244 |
| Renderer geometry counter | 27 | 26 |
| Renderer texture counter | 15 | 13 |
| Average sampled frame period | 6882.96ms | 3861.54ms |
| Sampled active FPS | 0.1453 | 0.2590 |
| Automated navigation to environment-ready status | 26710ms | 13673ms |
| GLB encoded body bytes loaded | 1095276 | 813620 |

These software results are **very slow and do not meet interactive frame-rate targets**. The 60 FPS desktop aspiration and original frame/load acceptance budgets are not verified or passed. GLB resource timings on localhost were about 3.8–8.6ms per request; readiness includes script loading, decode/shader work, main-thread contention and automation overhead, not just file transfer. Do not extrapolate these numbers to Internet loading or physical-GPU performance.

Normal operation is demand-rendered; idle FPS is not reported. Guided transitions use elapsed wall time so a slow renderer does not extend the animation through a fixed number of frames. Low mode removes dynamic shadows and reduces geometry, but software rendering remains unsuitable for smooth operation in this environment. Dashboard mode remains the practical fallback. Test the real intended demo hardware before performance sign-off; optimize only from that profile rather than claiming the target has been reached.

### Final commands and screenshot evidence

| Command / check | Actual result |
| --- | --- |
| Portable Blender background authoring/export | Six valid review GLBs created after correcting authoring/export issues |
| npm run lint | Passed, zero allowed warnings |
| npm run typecheck | Passed |
| npm test | Passed, 10 tests / 2 files |
| npm run test:e2e | Passed complete production-preview suite, 7 tests |
| npx playwright test e2e/environment.spec.ts | Passed focused rerun, 2 tests including new normal-motion pose assertions |
| npm run build | Passed; renderer chunk warning remains (~597.18kB minified / 158.25kB gzip plus shared Three core ~383.44kB / 101.92kB gzip) |
| npm audit --omit=dev | 0 production vulnerabilities |
| Production capture script | Passed; four screenshots, real bed raycast, hover and measurements; 0 healthy-path page errors |
| Source GLB structural/hash checks | Passed for all six files; hashes, sizes, compression, maps and anchors verified |
| Original Word requirements hash | Unchanged |

Inspected final images:

- [Medical bay overview](screenshots/medical-bay-overview.png)
- [Examination station close-up](screenshots/examination-station.png)
- [Equipment detail](screenshots/equipment-detail.png)
- [Low quality overview](screenshots/medical-bay-low.png)
- [Raw render measurements](screenshots/render-measurements.json)

Initial failures are not hidden: a Blender batching error, blank exported maps, over-reflective/poorly scaled surface treatment and failed-promise retry loop were corrected. Earlier concurrent/HMR graphics tests timed out under the software renderer; serial production-preview checks passed. The first unrestricted measurement run was stopped because it overloaded software rendering; the delivered utility uses a bounded sample and completed successfully. The delivered software FPS remains a significant limitation, not a solved hardware-performance result.

## Historical Phase 2 completed tasks and components

- React/Vite/TypeScript entry point, exact-version npm dependencies and package lock.
- Tailwind Vite plugin, semantic dark spacecraft color tokens, system font roles, responsive layout and reduced-motion styles.
- BrowserRouter, mission initialization, registered station navigation, URL-based fictional crew selection, unknown-location recovery and browser-history support.
- Persistent bay Canvas across station/crew changes, isolated from DOM feature panels. Switching to dashboard or initialization intentionally releases Canvas.
- Lazy renderer and module entry points; dashboard routes avoid loading the 3D renderer bundle.
- One CameraRig with constrained CameraControls, neutral future station presets and camera reset.
- Scene loading, error boundary, WebGL 2 detection, context-loss fallback and scene-only retry.
- Empty production model registry, validated local model paths, dynamic GLB loader configuration boundary and cleanup-based future station registration.
- Independent placeholder entries for vitals, radiation, physical assessment, wellbeing, diagnostics and emergency protocols.
- Astronaut, measurement, sleep, physical, wellbeing, diagnostic, protocol and emergency TypeScript contracts.
- Two fictional static crew profiles and coherent crew-specific snapshots; no random simulation, clinical inference or service calls.
- Shared DOM HolographicPanel and ModulePlaceholder primitives, loading/recovery states and clear simulation labels.
- Route-preserving native emergency rehearsal dialog with focus trapping, Escape dismissal and focus restoration. Content is explicitly draft rehearsal copy, not medical instructions.
- In-memory context for motion preference and emergency visibility. No persistence or data-entry forms are implemented.
- Strict type checks, ESLint, Vitest/Testing Library and Playwright infrastructure with meaningful contract/workflow coverage.
- README, runtime asset handoff note, updated master plan and this verification record.

## Historical Phase 2 project structure

Generated `node_modules/`, `dist/` and `test-results/` are excluded below and ignored by Git. The Word document's original filename is preserved.

```text
D:/nasa-hackathon/
  .gitignore
  README.md
  index.html
  package.json
  package-lock.json
  tsconfig.json
  vite.config.ts
  eslint.config.js
  playwright.config.ts
  NASA SPACE APP CHALANGE PROJET RECUIREMENT AND GUID LINES.docx
  docs/
    FRONTEND_MASTER_PLAN.md
    FRONTEND_PROGRESS.md
  public/assets/
    README.md
  e2e/
    foundation.spec.ts
  src/
    main.tsx
    animation/
      useMediaQuery.ts
    app/
      App.tsx
      Workspace.tsx
      StationNavigation.tsx
      navigation.ts
    data/
      fixtures.ts
    domain/
      contracts.ts
      format.ts
    features/
      mission/
        MissionView.tsx
        OverviewView.tsx
      vitals/
        VitalsView.tsx
      radiation/
        RadiationView.tsx
      physical/
        PhysicalView.tsx
      wellbeing/
        WellbeingView.tsx
      diagnostics/
        DiagnosticsView.tsx
      emergency/
        EmergencyView.tsx
        EmergencyDialog.tsx
    scene/
      MedicalBayCanvas.tsx
      SceneViewport.tsx
      detectWebGL.ts
      assets/
        registry.ts
        loadModel.ts
      environment/
        ScenePlaceholder.tsx
      interaction/
        stationRegistry.ts
      navigation/
        CameraRig.tsx
        presets.ts
      quality/
        config.ts
    state/
      SessionProvider.tsx
      session.ts
    styles/
      tokens.css
      index.css
    test/
      setup.ts
      foundation.test.tsx
    ui/
      ErrorBoundary.tsx
      LoadingState.tsx
      ModulePlaceholder.tsx
      holographic/
        HolographicPanel.tsx
```

## Installed dependencies and compatibility

Direct runtime dependencies:

| Package | Exact installed version |
| --- | --- |
| react / react-dom | 19.3.1 / 19.3.1 |
| three | 0.187.0 |
| @react-three/fiber | 9.8.2 |
| @react-three/drei | 10.7.9 |
| react-router-dom | 7.18.5 |

Direct development dependencies:

| Package | Exact installed version |
| --- | --- |
| vite / @vitejs/plugin-react | 8.3.8 / 6.3.0 |
| typescript | 6.0.3 |
| tailwindcss / @tailwindcss/vite | 4.3.5 / 4.3.5 |
| eslint / @eslint/js | 10.15.0 / 10.0.1 |
| typescript-eslint | 8.72.2 |
| eslint-plugin-react-hooks / eslint-plugin-react-refresh | 7.1.1 / 0.5.7 |
| globals | 17.14.0 |
| vitest / jsdom | 4.1.12 / 27.4.0 |
| @testing-library/react | 16.3.3 |
| @testing-library/jest-dom | 7.0.1 |
| @testing-library/user-event | 14.6.10 |
| @playwright/test | 1.65.1 |
| @types/node | 24.19.2 |
| @types/react / @types/react-dom | 19.3.0 / 19.3.0 |
| @types/three | 0.187.0 |

Registry metadata was queried before installation, including peerDependencies, engines and optional peers. React 19.3.1 is inside Fiber 9.8.2's `>=19 <19.4` range; Drei requires Fiber 9 and React 19. Vite 8 is supported by the selected React and Tailwind plugins. TypeScript 6.0.3 satisfies typescript-eslint's `<6.1` range; the latest TypeScript 7 did not. Latest Vitest 5 and jsdom 31 excluded the available Node 25 runtime, so compatible Vitest 4 and jsdom 27 were selected deliberately.

No additional timeline animation library or external state library was necessary. CSS transitions and CameraControls provide current motion; React context provides the limited shared state.

Environment actually executed: Windows, Node 25.2.1, npm 11.6.2. Package engines require Node >=24.15 and npm >=11. Node 24 LTS is recommended but has not been run here.

The initial install reported seven moderate advisories, all propagated from minimatch through development lint tooling. A `minimatch: 11.0.8` npm override, followed by deduplication, resolved the vulnerable copy. Final `npm ls minimatch` shows the patched version shared by ESLint and typescript-eslint; final npm audit reports zero vulnerabilities. Retain the override until upstream ranges are patched and a verified removal is possible. No forced audit downgrade was used.

## Entry points, routing and scene lifecycle

`src/main.tsx` mounts StrictMode, a root ErrorBoundary and App. App provides BrowserRouter, the global shell and in-memory SessionProvider. Routes are `/`, `/bay/:stationId?crew=:crewId`, and `/dashboard/:stationId?crew=:crewId`. Registered IDs are overview, vitals, radiation, physical, wellbeing, diagnostics and emergency. Unknown modes, stations and crew IDs get recovery UI.

Workspace keeps SceneViewport in the same position across bay station routes and query-string changes. Module content changes inside its own boundary; Canvas is not keyed by station or crew. Scene retries replace only the renderer boundary. Context loss releases the failed scene and preserves all DOM controls. CameraRig is the sole camera owner; provisional presets intentionally share the commissioning pose and are not final station paths.

The initial scene is an empty named group with background and foundation lighting, without models, particles, room primitives or clinical holograms. Future loader callers can configure GLTFLoader with local decoders. No Draco/Meshopt/KTX2 decoder pipeline or production GLB has been added.

## Historical Phase 2 UI and module status

The interface uses navy structural surfaces, restrained cyan focus/selection accents, coral emergency rehearsal controls, opaque readable panels and technical system typography. Desktop bay mode has a large reserved spatial viewport beside a station panel. Phone initialization defaults to dashboard mode; optional spatial mode remains available. Navigation wraps rather than requiring precision scrolling.

| Module | Actual current behavior | Not implemented |
| --- | --- | --- |
| Mission / bay | Initialization, crew selector, mode switch, navigation, empty Canvas, fallback and reset | Detailed architecture, equipment, final camera paths, asset loading experience |
| Vitals | Static heart rate, missing HRV and static sleep sample; switching crew updates heart rate | Live charts, full histories, alerts and sleep tracking workflow |
| Radiation | Static dose rate and cumulative dose with explicit units | Feed, interactive shielding, charts or risk calculations |
| Physical | Missing-data presentation and independent view | Anatomy, exercise inputs and SANS questionnaire |
| Wellbeing | Not-recorded placeholder and no-storage message | Check-in forms, support library and logging |
| AI diagnostics | Clearly scripted contract demonstration | AI, analysis, findings workflow or recommendations |
| Emergency | Independent entry and global accessible rehearsal modal | Reviewed operational protocols and acknowledgments |

None of these placeholders counts as a completed medical feature. Measurements have a fixed UTC fixture timestamp; severity is unknown rather than clinically inferred. No API, backend, database, auth or persistent storage was introduced.

## Historical Phase 2 verification results

| Command / check | Final result and evidence |
| --- | --- |
| npm install | Passed; exact direct versions and package-lock created |
| npm ls minimatch | Passed; patched 11.0.8 deduplicated under lint tooling |
| npm audit | Passed; 0 vulnerabilities after override/deduplication |
| npm run dev -- --port 5174 --strictPort | Passed; Vite started and served the app locally |
| npm run typecheck | Passed; tsc --noEmit |
| npm run lint | Passed; ESLint with zero allowed warnings |
| npm test | Passed; 9 component/contract tests in 1 file |
| npm run build | Passed; typecheck and production output in dist |
| npx playwright install chromium | Passed; matching Chromium 159.0.8154.6 / revision 1255 installed |
| npm run test:e2e | Passed; 5 Chromium workflow tests |
| npm run preview -- --port 5175 --strictPort | Passed; production bundle served locally |
| Production browser smoke | Passed; vitals deep link, crew-02 value, WebGL initialization, reload and 0 page errors; dashboard request check showed no MedicalBayCanvas chunk load |
| Visual review | Desktop 1280px and mobile 375px full-page screenshots generated and inspected; no observed clipping or unreadable panel content |
| Original requirements hash | Unchanged; hash below |

Unit/component coverage verifies all six module routes, atomic crew switching and navigation retention, unavailable-WebGL UI, emergency open/close, invalid location recovery, missing/invalid/stale measurement display, legitimate zero handling, duplicate station registration cleanup and local asset path validation.

Browser coverage verifies initialization and all six modules without page errors; forced WebGL-unavailable fallback; native modal focus, Escape and focus restoration; actual Canvas element identity across station/crew navigation; actual WEBGL_lose_context loss and retry; phone initialization with reduced motion; no horizontal overflow at 320, 375, 768 and 1440px widths and 812x375 landscape; keyboard skip-link focus; deep-link reload and browser Back.

The graphics context reported `WebGL 2.0 (OpenGL ES 3.0 Chromium)` using `ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero)), SwiftShader driver)`. This is software WebGL verification, not a physical-GPU performance result.

Initial validation failures were resolved: two TypeScript annotations in the browser tests, missing matching Chromium installation, and minimatch's initially retained vulnerable transitive copy. Final results supersede those failed attempts. Browser screenshots and traces are generated local QA outputs under ignored test-results, not production assets.

Original Word document SHA-256:

`B267B9EFFDA7250C61CC3D11FF1464C40C91BF99E488E11924CB7EB307E66F3B`

## Historical Phase 2 issues and untested areas

- Vite warns that the lazy renderer chunk is large: about 967.04kB minified / 253.93kB gzip. Initial app JS is about 273.94kB / 87.39kB gzip, with separate lazy module entries. The renderer is loaded only for bay mode; no warning threshold was raised to hide this.
- Three 0.187 warns that Clock is deprecated because R3F uses it internally. Functionality passed; no node_modules patch or arbitrary library downgrade was made.
- The intentional context-loss test can produce a WEBGL_lose_context warning during renderer teardown. Loss, fallback and retry passed.
- npm emits harmless NO_COLOR/FORCE_COLOR messages in the Playwright server environment. npm also lists optional WASM helper remnants as extraneous on this Windows installation; no invalid dependency peer was reported and application checks pass. A clean npm ci on another supported machine remains a useful integration check.
- No physical-GPU benchmark, FPS/load budget acceptance, ten-minute GPU soak, real mobile device, Firefox, Safari, screen-reader run, exhaustive contrast audit or complete WCAG audit was performed. Keyboard, labels, dialog focus, reduced-motion input and responsive fundamentals were exercised; this is not accessibility certification.
- No production assets exist, so PBR fidelity, model/texture budgets, decoder behavior and safe navigation paths cannot yet be accepted.
- Deployment is not configured. BrowserRouter hosting requires SPA rewrites; subdirectory hosting requires matching Vite base and router basename.
- User deadline, target hardware, final floor plan, content review and asset budget remain unspecified. They do not block this completed foundation but are needed for the detailed slice.

## Historical Phase 2 next milestone and approval gate

Recommended next work is a detailed 3D vertical slice: approved floor plan, one authored spacecraft section, hero examination station, material/lighting sample, safe waypoint navigation and one holographic vitals preview, with measured target-device acceptance. Source or create assets only after license and budget decisions. Develop the remaining full module interfaces after the slice establishes visual/performance feasibility.

**Stop here for user review. Do not begin the detailed 3D medical bay or complete dashboards automatically.** Backend, databases, medical calculations, real AI, authentication and persistent storage remain excluded.




## Completion upgrade / phase 1 verification

CC0 MakeHuman patient sourced, posed and exported with a 163-bone rig, five skinned meshes and original licensed skin/hair/eye maps. Numerical Blender fit corrected a 53mm pillow intersection; final sampled body clearance 1.33mm, uniform 2.75mm, zero penetrating sampled vertices. Runtime checks: patient loads once, renderer and resource identities retained across clear/prepare, breathing morph changes. Two flat restraint bands and buckles partitioned from immutable source geometry and stowed outside the port rail. Evidence: assets/source/patient/placement-audit.json and docs/measurements/final/patient-verification.json. No image/video captures. Artistic/clinical approval remains distinct from numerical validation.


## Completion upgrade / phase 2 verification

Five-second activation-relative optical scan, shared scan epoch, Chest monitoring context, head-to-SANS link and exterior body picking implemented. Two examination lifecycle unit/component tests passed. Physical GPU browser patient workflow passed after correcting its label locator; reduced-motion patient workflow also passed. Browser verifies breathing changes, scan completion, two-crew isolation and retained patient cache/renderer. No internal medical anatomy is claimed.


## Completion upgrade / phase 3

Preserved room meshes and all high-tier GLB hashes. Added a shared 64px seamless normal weave to previously smooth webbing/seals, corrected dielectric glass/gasket metalness, separated coated metal response and reduced upholstery normal strength. Key light targets the examination support; normal shadow bias reduced from 12mm to 3.5mm, with cached shadows refreshed on occupancy. Existing detailed equipment, authored seams/labels/cables, Earth and warm/cool lights retained. Material source-immutability tests passed; image-free numerical verification cannot certify artistic fidelity or shadow-acne appearance.


## Completion upgrade / phase 4 verification

Existing camera/navigation presentation preserved. Monitoring audio now uses one shared master gain, a 60ms exit fade, hidden-tab suspension, and a persisted sound-only permission preference. Muted preference avoids creating/resuming audio on gestures. All five audio unit tests and seven targeted medical/audio/recovery browser scenarios passed. Local clinical logs remain transient and separate from that UI preference.


## Completion upgrade / phases 5 and 6 verified

Selected UHD 620 production test: twelve seconds active scroll plus five repeated chapter/scanner focus/return cycles; 27.38 navigation FPS, p95 49.0ms, max interval 254.1ms, 52.47 monitoring FPS and 9.33s environment readiness. No multi-second navigation stall in that sample, no asset reloads, same renderer and resource identities. Faster uncapped trials stalled; GPU-fence trial was too slow and was rejected. Navigation still misses 45–60 FPS. First-use patient async shader preparation reduced the largest traced task from 2.27s to 727ms; prepared visibility later measured 2.78s. Steady breathing 59.96 FPS; scanner 305 frames/max 67ms. Loading variability and residual first-use stalls remain explicit.

Final tests: TypeScript/build, zero-warning ESLint, 37 unit/component tests in 14 files, and all 31 browser tests passed with no flaky/skipped tests. Original Word brief re-read/hash unchanged; all six module statuses audited. Full final bed triangle audit: zero intersections for each of the five patient meshes after posterior hair correction. Master plan, asset manifest, traceability and FINAL_FRONTEND_DELIVERY_REPORT.md updated. No screenshots/videos/galleries generated. Work stopped for review; backend/calculation/scientific approval boundaries preserved.
