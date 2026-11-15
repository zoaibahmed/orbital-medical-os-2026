# Final frontend delivery report

15 November 2026. This report supersedes FINAL_FRONTEND_COMPLETION_REPORT.md and older status summaries. The accepted room and existing medical demonstrations were preserved. No dependencies, backend, medical calculation engine, real AI service, screenshots, videos or presentation galleries were added.

## 1. Summary of the six phases and exact changes

| Phase | Delivered | Verification |
| --- | --- | --- |
| 1 / Patient | Licensed, clothed MakeHuman patient; measured supine fit; retained 163-bone skin; independent loading/retry; empty/ready/active/scan/completed states | Blender surface/contact audit, delivered GLB contract test, actual browser asset/cache/crew checks |
| 2 / Animation and scanning | Local 3mm chest morph, five-second breathing cycle, activation-relative optical sweep, exterior body picking, six accessible regions, Chest observations and head-to-SANS link | Morph binary test, timer/component tests, browser picking/scan/reduced-motion checks |
| 3 / Room refinement | Material separation, fine webbing/seal normals, reduced upholstery normal strength, tighter shadow contact; restraints released clear of patient | Source-immutability tests, unchanged room hashes, full bed intersection audit, numeric rendered colour/depth comparisons |
| 4 / Integration | Existing modules/navigation preserved; one audio context/master gain, exit fade and persisted sound preference | Medical, audio, emergency, keyboard, responsive and recovery regressions |
| 5 / Performance | Stationary HDR colour/depth cache, live geometry overlay, constrained-adapter pixel budget, bounded full-room navigation, explicit display-program warmup, asynchronous patient shader preparation | Physical UHD 620 render measurements, Chromium CPU/GPU event profiles, development React Profiler, repeated transitions |
| 6 / Audit | Re-read original Word brief, refreshed requirements/asset/progress records, executed checks and documented limitations | See section 12 and machine-readable measurements |

Principal application changes:

- `src/scene/environment/PatientAsset.tsx`: actual cached skeletal asset, instance-owned materials, preparation against room lights, restrained fade, chest morph and exterior-region picking. Replaces the unused bone-scale scaffold.
- `src/scene/environment/ExaminationPatient.tsx`: persistent patient host with its own Suspense/error boundary; asset failure never replaces the room.
- `src/scene/assets/patient.ts` and `patient-manifest.json`: one retained local-loader promise, source/hash/size/budget metadata, independent status and retry.
- `src/scene/environment/releasedRestraints.ts`: immutable source geometry partition; two original flat straps, stitching and buckle parts stow at the port rail during occupancy. No entire equipment material batch is hidden.
- `MedicalBayEnvironment.tsx`: occupancy/indicator integration, cache invalidation, transparent-layer ordering, and both offscreen/default-framebuffer warmup. Shared source GLBs remain immutable.
- `MedicalBayCanvas.tsx`: mounts patient in the existing Canvas, includes the dynamic picking layer, and applies internal UHD pixel budgeting. No second WebGL Canvas or camera controller.
- `ExaminationScan.tsx`, `src/state/clinical.ts`, `src/domain/frontend.ts`: shared activation epoch, scan-state cleanup, patient-region synchronization and Chest region.
- `src/features/physical/Examination.tsx` / `PhysicalConsole.tsx`: actual patient controls, separate preparation/retry status and links to existing assessments.
- `src/scene/environment/materials.ts`, `LightingRig.tsx`, `ContactGrounding.tsx`: targeted PBR/contact adjustments and correct cached transparency ordering.
- `src/scene/quality/StationaryRoomCache.ts`, `FrameBudget.tsx`: camera-dependent HDR/depth cache and bounded navigation scheduling. `RuntimeProbe.tsx` counts complete submitted frames, not individual cache passes.
- `LiveMedicalDisplay.tsx` and `src/features/vitals/ECGTrace.tsx`: 45Hz target cadence with elapsed-time carry, avoiding the previous effective 30Hz quantization on a 60Hz display.
- `AutomaticMonitoringAudio.tsx` and `UnifiedExperience.tsx`: shared master gain, 60ms exit fade, immediate mute/hidden suspension and sound-only preference persistence.
- Authoring/QA: `scripts/build_patient.py`, `audit_patient.py`, patient/profiling/measurement scripts and new examination, asset, patient and composite regression tests.

## 2. Realistic astronaut asset status

An actual human mesh is delivered, rather than a primitive mannequin or a missing-asset placeholder. Runtime file: `public/assets/models/patient/patient-examination.glb`. It contains 42,610 authored triangles, five skinned meshes, 163 joints, detailed face/hands, short hair, brows, eyes and a fitted lightweight teal uniform. It is a generic fictional exterior patient shared by both selected crew contexts, not a likeness or a sex/body-type match for either fictional name.

Sources are official MakeHuman core data and explicitly CC0 system assets: base mesh, default rig/weights, high-poly eyes, brown eye map, young light-skinned male skin, male_casualsuit01, short01 and eyebrow001. The MakeHuman application code was not imported. See [official licensing](https://www.makehumancommunity.org/about/license.html), [asset-pack manifest](https://static.makehumancommunity.org/assets/assetpacks/makehuman_system_assets.html), and the retained `public/assets/licenses/MAKEHUMAN-PATIENT-CC0.md`. Exact selected source URLs/hashes are in `assets/source/patient/core-source-manifest.json` and `download-manifest.json`.

Source: `assets/source/patient/patient-examination.blend`; repeatable authoring: `scripts/build_patient.py`. Runtime skin/hair/eye maps are bounded to 1024px; fabric normal detail to 512px. No external anatomy or paid/unlicensed model was substituted. This is a legitimate rigged realtime human asset, not a claim of scan-derived skin, photorealism, bespoke character art or medically accurate internal anatomy.

## 3. Positioning and rigging

The imported accepted mattress triangles supply actual support heights through a Blender BVH. Garment, hair and eyes use their supplied barycentric bindings. Skin weights retain the four strongest normalized influences. Sourced shoulder/forearm/leg joints articulate the examination pose; the resulting posed mesh is rebound to its corresponding supine rest skeleton. Future animation retargeting is not claimed or tested.

Verified lying length: 1.77385m. Browser bounds are approximately x [-0.696,-0.111], y [1.062,1.608], z [-1.158,0.615]. The bed is centred at x -0.4. Head/pillow, torso, pelvis and heels were fitted from geometry rather than visual guesses. Minimum sampled clearances: head 1.33mm, thorax 2.77mm, pelvis 2.75mm, legs 2.93mm, heels 2.98mm. The rest skin/bone binding discrepancy is below 0.001mm.

The first fit exposed a 53mm pillow intersection; continuous support correction fixed it. A later complete surface audit found posterior hair-card contact, which was corrected by compressing only the rear cards against the pillow. Final BVH audit reports zero bed surface intersections for skin/body, uniform, hair, brows and eyes. The original flat restraint triangles are excluded using the same measured partition predicate used at runtime; released parts hang from the port rail clear of the patient. This is a geometric intersection/contact check, not a clinical posture or artistic certification. Raw evidence: `assets/source/patient/placement-audit.json` and `patient-metrics.json`.

## 4. Breathing animation

Two delivered sparse glTF morph targets deform anterior chest skin and clothing outward by at most 3mm. A smooth five-second cycle changes their influence; it does not scale or bounce the whole character. The binary asset test decodes sparse accessors and verifies bounded outward-only displacement. Reduced motion keeps the morph static; hidden tabs stop requesting breathing frames. Fade-in/out lasts approximately 650ms and is immediate with reduced motion.

Actual UHD 620 steady-patient verification: approximately 59.96 submitted FPS, p95 19.1ms, largest interval 25.4ms, 361 frames sampled. This steady sample excludes initial loading/preparation. The avatar remains cached through clear/prepare and crew changes.

## 5. Scanner and body interaction

Preparation exposes the selected crew's generic patient. Direct Physical navigation already approaches the bed through the existing camera director. Start examination enables the five-second scan. Fixed optical equipment indicators brighten while a restrained light sheet sweeps from the head end to the foot region; no gantry translation, spinning ring or CT acquisition is implied. The animation and DOM timer use the same activation epoch rather than the scene's modulo clock. Completion returns indicators to standby. Leaving an active scan cancels its timer and returns the session to examination-active.

The patient exterior can be clicked to select an observation region; the same six regions are available as keyboard-accessible DOM buttons. Chest shows supplied HR/SpO2/HRV; head/eyes links to the existing draft SANS checklist. Spine, arms, legs and muscle groups retain general supplied observations and exercise context, explicitly stating that regional measurements are unavailable. There are no invented internal scan findings.

The final scan check observed 305 submitted frames, a 67ms maximum interval, one retained renderer, no additional GLB requests and temporary scan geometry returning to baseline. See `docs/measurements/final/scanner.json`.

## 6. 3D materials and lighting

All three accepted high room GLBs retain their original SHA-256 hashes. Their equipment mechanisms, support arms, medical trolley, cables, labels, panel seams, hatches and Earth viewport remain intact. The room was not rebuilt.

Targeted runtime changes distinguish dielectric optical glass and rubber gaskets from metal, reduce the metallic response of coated framing/enamel, retain the warm ceramic palette, reduce coarse upholstery normals and add one shared 64px seamless normal weave to smooth webbing/seals. Existing texture detail, seams, fasteners and baked vertex occlusion remain. The key light targets the examination support; normal shadow bias is reduced from 12mm to 3.5mm. Occupancy and fade completion refresh the cached shadow map. Warm/cool sources, PMREM reflections and contact patches remain; no bloom/SSR/postprocessing stack was added.

Cached rendering preserves HDR opaque colour plus depth, then renders real patient/display/indicator and transparent geometry. Tests caught and fixed incorrect transparency/tone-mapping order. Final numeric comparison at three camera/resize states sampled 35 positions each: maximum channel error 1/255, mean about 0.01–0.03/255. This is limited numerical equivalence evidence, not a screenshot review or proof of cinematic artistic quality.

## 7. Medical module status

| Module | Frontend status | External boundary |
| --- | --- | --- |
| Immersive bay | Persistent scene, three scroll chapters, direct context/focus, exterior patient and scan | Final art approval; reviewed internal anatomy absent |
| Crew biometrics | Shared simulated ECG, HR, BP, SpO2, HRV, supplied sleep/score and circadian preview; real trolley display | Actual telemetry, clinical severity/thresholds and validated sleep scoring |
| Radiation | GCR/SPE scenarios, supplied cumulative dose/rate, period/channel selection, neutron history, chart/table | Actual CANS data, dose/risk calculations and scientific approval |
| Physical | Examination flow, six regions, supplied bone/muscle trends, exercise plans/completion and SANS answers/review | Validated regional anatomy, imaging, questionnaire and physiological calculations |
| Wellbeing | Per-crew mood/stress/notes, session history, shared supplied sleep logs, draft coping/communication resources | Reviewed content, operational support pathways and durable storage |
| Diagnostics/emergency | Scripted assistant, supplied context, pending/error states; three manual emergency rehearsals and acknowledgments | Real AI, medically authoritative recommendations and approved operational procedures |

All medical data remains labelled fictional/simulated. Logs remain in memory. Only a sound preference is persisted locally. None of these demonstrations acquires measurements, predicts risk, diagnoses or provides approved treatment.

## 8. Camera and scrolling

The existing single CameraDirector remains the sole main camera authority. Its distance-aware, interruptible travel, safe right-aisle route, reversible native scroll and direct chapter/module access were preserved. Equipment inspection and return remain functional. No second scroll/camera system, sidebar or legacy dashboard presentation was introduced. Existing /bay and /dashboard addresses still resolve into the same experience. Tests exercise clipping clearance, interruption, direct destinations, reverse scroll and repeated focus/return.

## 9. Monitoring audio

The first permitted interaction attempts native Web Audio unlock. Vitals activates quiet ECG-phase-coordinated pulses; unrelated modules remain silent. One AudioContext and shared master gain are reused, with a 60ms exit fade. Hidden tabs and explicit mute stop/suspend immediately. Browser autoplay denial remains respected and produces a readable status. The existing crew/display preference offers an accessible stop without a prominent audio developer control. The sound-only preference survives reload; a saved refusal avoids creating/resuming a context on interaction. Browser/OS audio routing and mute remain authoritative.

Five executed audio unit tests include 60 seconds of supplied rate changes, no overlapping voices, delayed unlock/hidden-tab handling, cleanup and context reuse. Browser tests cover navigation, mute, visibility, saved refusal and reload.

## 10. Rendering performance and confirmed bottlenecks

Physical adapter: Intel UHD Graphics 620 through ANGLE / Direct3D11. Viewport 1440x900. Final internal render buffer 1224x765 on this constrained adapter, with the accepted high GLBs/PBR/shadows retained. Public quality selectors remain absent. Other adapters retain the ordinary quality configuration.

| Measurement | Previous user baseline | Fresh pre-pass | Selected bounded-navigation build |
| --- | ---: | ---: | ---: |
| Active navigation FPS | 27.52 | 28.46 | 27.38 |
| Navigation p95 | 49.4ms | 49.1ms | 49.0ms |
| Maximum active gap | 427.7ms | 89.4ms | 254.1ms |
| Monitoring FPS | 21.99 | 26.98 | 52.47 |
| Monitoring maximum gap | 79.9ms | 51.4ms | 45.9ms |

Figures are submitted render cadence measured around actual gl.render calls on physical hardware, not hardware timestamp or OS presentation-completion measurements. Cache/composite passes are combined into one frame; they are not counted as extra FPS. The production run includes twelve seconds of active forward/reverse scroll and five repeated chapter/scanner-focus/return cycles, plus ten seconds monitoring. Renderer/resource identities persisted and there were zero new navigation GLB requests or page errors.

Confirmed findings: the old fixed cap also constrained stationary monitoring; the room was being redrawn for each monitor frame; new skinned programs triggered synchronous first-use queries; default-framebuffer programs needed warmup separate from HDR offscreen variants. A fresh CPU/GPU trace also observed GPU-process raster/flush tasks around 354ms before optimization and 248–254ms in the selected profile. Development App Profiler recorded 33 active commits over 25.13s, max 51.8ms/p95 45.8ms; this is real transition/UI work, not a React commit for every render frame. Production React Profiler callbacks are disabled by React, so zero production records must not be interpreted as zero React work.

Rejected trials are retained: uncapped navigation reached 30.67 FPS with a 2.59s gap; an uncapped cached trial reached 44.12 FPS with a 1.82s gap; explicit GPU fences reduced the maximum gap to 369ms but fell to 18 FPS. Those approaches were rejected. The selected design bounds full-room camera submission near 30Hz on UHD hardware and lets stationary cached monitoring run faster. Its residual 254ms gap is still perceptible; **45–60 FPS navigation was not achieved**. The fresh pre-pass had a smaller worst gap than the selected run, so a universal pacing improvement is not claimed.

Development comparison: 27.40 navigation FPS / 46.63 monitoring FPS, 10.61s readiness, zero repeated GLB requests. It uses the same twelve-second scroll but one repeat cycle rather than five, plus StrictMode/shader diagnostics; it is diagnostic evidence, not an identical-length performance contest. In that run stationary monitoring used six draws and 1,528 triangles per frame, compared with roughly 53 full-room draws and 357,014 triangles. See `docs/measurements/master-1/completion-stable.json`, `completion-development.json`, and `completion-selected-*` traces/CPU profile.

## 11. Loading performance

Selected environment readiness was 9.33s versus the earlier reported 10.92s. However, the fresh pre-pass measured 3.97s and other trials ranged higher; default-framebuffer warmup adds real initial work. **Consistently faster cold loading is not proven.** System/driver/cache variance and shader preparation remain material limitations.

The patient is loaded separately on first use, so it cannot blank/remount the bay. First unprepared visibility measured 4.72s. The initial trace exposed a 2.27s main-thread frame, with synchronous program queries around 450ms each. Asynchronous preparation against the actual room lights reduced the largest observed traced task to 727ms, with residual program queries up to 251ms. A later untraced prepared visibility measurement was 2.78s. These runs differ in profiling/cache conditions; the reliable conclusion is reduced first-use blocking, not a guaranteed latency.

A one-time roughly 0.73s preparation/render stall and roughly 0.54s loading/event task remain on this driver in the traced cold path. Steady navigation does not repeat the patient request or compilation on each crew/module change. Further worker parsing, texture transcode/decode work and shadow-program preparation could be investigated, but are not delivered or claimed here. The primary renderer chunk fell from approximately 93kB to 26kB minified by avoiding the Drei barrel/useGLTF loader path; Three's shared renderer chunk remains around 548kB and the build warning remains visible.

## 12. Exact test results

Executed TypeScript, zero-warning ESLint and production build passed. Unit/component suite: **37 tests in 14 files passed**. The final complete browser suite passed **31/31**, with **zero failures, skips or flaky cases**, in 271.68 seconds. This run includes asynchronous patient preparation and the additional loaded-patient WebGL-recovery test. The earlier complete 30-case run also passed.

Machine evidence: `docs/measurements/final/unit-tests.json`, `browser-tests.json`, `patient-verification.json`, `scanner.json`, `composite-verification.json`; full geometric evidence under `assets/source/patient/placement-audit.json`. Playwright screenshots, video and trace captures remain disabled. CPU/GPU event traces contain no media capture.

Coverage includes all six module routes, simulated chart synchronization, crew/session isolation, exercise/SANS/sleep/wellbeing/assistant flows, emergency focus/return, keyboard navigation, responsive layouts, reduced motion, autoplay/audio lifecycle, saved sound preference, direct and native-scroll navigation, camera clearance/interruption, patient rig/morph loading, real patient picking, timed scans, asset failure/retry, actual WebGL loss/recovery, Canvas persistence, GLB caching and sampled cached-render depth/colour equivalence.

Known non-blocking tool messages: large Three renderer chunk warning; Node localstorage-file warning in the test environment; Three/R3F Clock deprecation and intentional context-loss messages. These are not hidden or presented as functional test failures. Real mobile devices, Firefox/Safari, a screen-reader session, comprehensive WCAG certification, a long thermal soak and universal device performance have not been verified.

## 13. Outstanding technical and art dependencies

No external character dependency blocks this frontend anymore. Remaining work includes professional review of face/hands/uniform finish and bed posture; optional diverse crew-specific avatars; validated internal anatomy if required; finer scan-derived skin/fabric detail and subsurface response; further UHD navigation and first-use shader optimization; device/browser coverage; durable storage and actual data services by the responsible team. Lower internal diagnostic room assets were not revalidated as a patient-placement target; the measured patient fit is for the accepted public high scene.

The original reference's full cinematic realism is not certified. No new visual captures were created; numerical/browser assertions cannot replace a human art review. The new asset/material work is real and inspectable, with its remaining artistic limits stated explicitly.

## 14. Scientific approval required

Fatima / the medical domain owner must review all units, context, SANS questions, radiation explanations, warning language, sleep labels/scoring semantics, wellbeing resources, assistant wording and emergency content. Scanner output and exterior-region selection must continue to be described as demonstrations. Approved clinical/radiation thresholds, actual risk calculations, medical recommendations and emergency procedures must be supplied externally. NASA/CSA references are background sources, not approval of this application.

The original Word brief is unchanged: SHA-256 `b267b9effda7250c61cc3d11ff1464c40c91bf99e488e11924cb7eb307e66f3b`. It requests capabilities such as calculations/real AI whose computation is explicitly outside this frontend task. The 38-item traceability matrix distinguishes those boundaries.

## 15. Team integration readiness

Verified package versions: React 19.3.1, Vite 8.3.8, TypeScript 6.0.3, Three 0.187.0, R3F 9.8.2, Drei 10.7.9 and Tailwind 4.3.5. No dependencies were installed or changed.

Keep reusable module components in their existing `src/features/vitals`, `radiation`, `physical`, `wellbeing` and `diagnostics` directories. Continue accepting the existing typed CrewSnapshot/Measurement contracts from `src/domain/contracts.ts`. ClinicalSession additions in `src/domain/frontend.ts` are frontend workflow fields; scanStartedAt is a monotonic presentation epoch, not a medical timestamp or backend contract.

Use the existing URL-selected crew, per-crew clinical store and shared monitoring feed. Supply real measurements/severity, storage and assistant adapters through the established boundaries. Do not mount another Canvas, introduce another global crew store, mutate cached source GLTFs or add a competing camera controller. Dynamic meshes use layer 1; camera and pointer raycaster include it. Static geometry/material/light changes must invalidate the stationary room cache (the current environment does so through sceneRevision/shadow invalidation). New arbitrary moving equipment must be added to the dynamic layer or invalidate cached content appropriately.

Medical domain review, data/calculation integration and QA ownership remain with the named team members in the original brief. No medical data is transmitted by these frontend demonstrations.

## 16. Honest demo-readiness assessment

This is a substantially more complete interactive frontend: an actual licensed patient, measured bed placement, restrained breathing, real scan geometry, body selection, all existing medical demonstrations and a persistent coherent room are working. Stationary medical rendering is materially faster on the tested UHD 620. It is suitable for a supervised fictional-data hackathon demonstration with the stated preparation/performance limits.

It is not a medically approved product, a verified photorealistic character showcase, or a 45–60 FPS navigation experience on UHD 620. The residual first-use and frame-pacing limits, artistic review, scientific review and backend dependencies remain explicit. Stop after final verification/documentation for user review.
