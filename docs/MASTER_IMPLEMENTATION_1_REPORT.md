# Master implementation 1 — consolidated engineering report

15 November 2026. Scope: Phase 1A interface replacement, Phase 1B navigation/render scheduling, then Phase 1C animated biometrics. The latest user prompt accepts the 3D architecture as the foundation and supersedes earlier environment-only approval gates. No room, bed, scanner, trolley, viewport or material asset was remodelled. No medical workflow beyond the requested biometrics scope, backend or service was implemented.

## 1. Phase 1A — operations interface

The active application imports `src/styles/operations.css`. The previous full-width header/footer presentation and generic central dialogs are replaced with corner-mounted mission/crew/station controls, a compact selected-chapter instrument, contextual equipment annotations and an asymmetric inspection interface. The main room remains the central subject. Mission arrival uses the concise “Care in orbit” composition rather than an oversized editorial hero.

The palette is grounded in the accepted environment: ceramic text #edf1e9, structural carbon #111919, teal diagnostic feedback #94d2c1, copper station/illumination context #d6a777 and a separate emergency/attention tint #ffbaaa. Local Barlow and Barlow Condensed provide interface and numeric hierarchy. Structural borders distinguish active controls and instrument groupings; no background blur, decorative particle system or postprocessing was added.

Native dialogs retain Escape, focus containment and focus restoration. Context dismissal retains its content through a cancellable 180ms fade/travel and is immediate with reduced motion; pending animations are cancelled on route changes/unmount. Emergency remains immediately available without 3D. All medical entries and the selected astronaut remain accessible. Mobile uses the same identity, legible DOM monitoring and optional 3D. Lower-height viewports permit intentional instrument scrolling rather than clipping controls behind navigation.

## 2. Phase 1B — spatial navigation and rendering

`CameraDirector` is the sole camera owner in the main experience. Native scrolling follows the continuous arrival/overview/trolley path in either direction. Direct station commands use distance-aware 1.4–4-second quintic travel from the actual current pose, with a small safe-aisle lift. A new command interrupts the old journey. Inspection temporarily overrides chapter navigation; scrolling releases inspection. Emergency temporarily selects its overview destination and restores the previous ownership on dismissal. No wheel interception or GSAP controller was introduced.

Destinations include arrival, overview, examination, vitals, radiation, physiological assessment, wellbeing, diagnostics and emergency. Vitals targets the existing trolley monitor. Four future medical modules explicitly use provisional viewpoints and retain their accessible boundary previews. These are not claims of new physical equipment or completed workflows.

One R3F Canvas remains mounted across routes, crew changes, chapters and inspection. GLB promises, geometries, materials and textures remain cached. Context-loss retry is an intentional renderer reconstruction, not ordinary navigation. Retry clears stale motion state and the new director publishes its initial settled state, so a context lost during travel cannot leave the recovered monitor in standby.

Texture initialization, asynchronous compilation and an all-mesh offscreen preparation pass now finish before environment-ready. This warms uniform/shadow paths that compileAsync alone did not initialize. Static caster shadows are reused. Runtime pose instrumentation is limited to 10Hz instead of serializing every frame.

The GPU trace reproduced a roughly 2.65-second WebGL command-buffer flush with about 1.6ms GPU-process thread CPU time. This locates a driver/graphics-service wait; it does not establish a particular Intel driver defect. The multi-second interval did not coincide with a similarly sized React/main-thread task. Removing MSAA alone improved ordinary intervals but retained multi-second gaps. Bounded submission plus removal of MSAA on the detected UHD 620 eliminated those gaps in the pre-monitoring test. Detailed GLBs, PBR maps, 2048px cached shadows, reflections and the actual pixel dimensions were retained. No public graphics-tier selector was restored.

On matching Intel UHD/HD bandwidth-limited adapters, the application uses a 30 FPS submission budget for camera, monitor and scanner animation. Other adapters retain display-rate rendering and MSAA. This is an explicit quality/performance tradeoff: the high authored scene is retained, but hardware antialiasing and temporal resolution are reduced. It is not a 60 FPS claim.

## 3. Phase 1C — animated medical instruments

The selected crew has one `MonitoringFeed`. Its snapshots use existing `CrewSnapshot` / `Measurement` contracts, source/quality/units and supplied severity. Authored samples advance every four seconds while monitoring is active and the document is visible. Crew switching atomically replaces the feed; unavailable/invalid/external measurements are not fabricated. HRV is displayed in milliseconds, distinct from heart-rate BPM.

The DOM ECG updates SVG attributes directly at up to 45Hz, independently of React. The actual trolley display uses one 512×288 CanvasTexture with no mipmap regeneration, updated at up to 24Hz and uploaded by the existing renderer. The previous baked illustrative screen ink is hidden only in the live-display instance. Geometry/assets are unchanged. Both displays use the same selected crew, heartbeat clock and fictional samples.

The instrument includes current heart rate, illustrative ECG, selectable heart-rate/SpO₂/HRV sample trends, blood pressure, oxygen saturation, HRV, previous sleep interval, a supplied demo sleep score and a circadian preview. A user-selected demonstration alert is explicitly unrelated to any inferred clinical threshold. The focused DOM ledger includes timestamps, quality, units and provenance. Reduced motion freezes the waveform and screen motion while discrete data remains readable.

## 4. Files and integration boundaries

| Area | Principal files |
| --- | --- |
| Application and identity | `src/app/App.tsx`, `src/main.tsx`, `src/features/experience/UnifiedExperience.tsx`, `OperationsNavigation.tsx`, `src/styles/operations.css` |
| Reusable presentation | `src/ui/medical/MedicalPrimitives.tsx`, `src/ui/useDialogDismiss.ts`, `src/features/experience/BiometricMonitor.tsx` |
| Typed simulation and motion | `src/features/vitals/monitoring.ts`, `useMonitoringFeed.ts`, `ECGTrace.tsx`, `HeartbeatAudio.tsx`, `src/data/fixtures.ts` |
| Camera | `src/scene/navigation/CameraDirector.tsx`, `experiencePath.ts` |
| Rendering and physical display | `src/scene/MedicalBayCanvas.tsx`, `src/scene/environment/MedicalBayEnvironment.tsx`, `LiveMedicalDisplay.tsx`, `src/scene/detectWebGL.ts`, `src/scene/quality/FrameBudget.tsx` |
| Diagnostics | `src/scene/quality/RuntimeProbe.tsx`, `probeStore.ts`, `scripts/measure_operations.mjs`, `profile_operations.mjs` |
| Tests/configuration | `playwright.config.ts`, `e2e/operations.spec.ts`, `monitoring.spec.ts`, updated regression assertions, `src/test/monitoring.test.ts`, `stationTravel.test.ts`, `heartbeatAudio.test.tsx`, updated fixture assertions |

Medical teammates should place presentation under `src/features/vitals/` (or their corresponding feature directory) and share the primitives from `src/ui/medical/`. Compose into `BiometricMonitor` / `BiometricDetails`; inject a `MonitoringFeed` or supplied typed snapshot. Preserve the URL-owned crew selection. Never create another Canvas, global crew store, animation loop for camera transforms or a second telemetry timer. `MedicalBayCanvas.monitoring` is the scene bridge. The external transport/calculation owner can supply a compatible subscribe/getSnapshot adapter later; the authored simulation is not a backend implementation. Historical `Workspace`/`SceneViewport` layouts are not the active route host.

## 5. Interaction behavior

Station clicks initiate physical camera travel; the contextual copy recedes during motion and the instrument activates as the camera settles. Overview returns through the same clear aisle. Native page scroll is reversible, touch/keyboard compatible and cancellable. Crossing a chapter boundary also replaces the URL without resetting the camera, so a previously visited provisional module cannot suppress the live monitor. Zero-size layout measurements are ignored, and queued route animation frames are cancelled on interruption. The skip link focuses the content without scrolling or replacing a chapter/history entry. Controlled context-dialog dismissal does not let a delayed native close event reset a newly opened inspection. Equipment hover, actual mesh clicks, scanner standby feedback, selected station indication, chart tabs, waveform inspection, crew selection and emergency rehearsal remain available. Existing bay/dashboard URLs resolve through the same presentation.

## 6. ECG and sound

The ECG is a normalized graphic, not acquired physiology. Its animation and original synthesized 740→660Hz sine pulse share the simulated BPM and epoch. The sound has a short quiet envelope and no external audio licence dependency. A 25ms scheduler detects actual phase wraps instead of restarting deduplication at every telemetry epoch; the 60-second sample-update test verifies no repeated/overlapping pulses. It rejects late pulses after suspension. A visibility listener is mounted even during pending audio enablement, and cancellation/current-context checks after resume prevent a hidden-tab race from enabling sound unexpectedly. Browser user activation and explicit enablement are required. Leaving the station closes its AudioContext and stops voices; hidden tabs suspend/mute it. Returning starts muted. No autoplay, overlapping visit schedulers or clinical alarm claims.

## 7. Browser performance

Final measurements use Chromium 159, real ANGLE D3D11 on Intel UHD Graphics 620, a 1440x900 drawing buffer, high authored assets, MSAA off and a 30 FPS submission budget. The workflow includes 12 seconds of native forward/back scrolling followed by three repeated overview/vitals/scanner/return cycles (about 48 seconds total), plus six seconds with the monitor active. GPU workflows ran sequentially.

| Metric | Fresh baseline | Final production | Final development |
| --- | ---: | ---: | ---: |
| Active-navigation renderer FPS | 28.85 | **27.25** | **25.73** |
| Active p95 interval | 75.0ms | **49.3ms** | **50.4ms** |
| Active p99 interval | 100.3ms | **57.2ms** | **55.2ms** |
| Largest active gap | 2687ms | **349.8ms** | **209.4ms** |
| Navigation to ready | 5839ms | **10128ms** | **11158ms** |
| Maximum draw calls | 53 | 53 | 53 |
| Maximum rendered triangles | 362556 | 357014 | 357014 |
| Renderer/resource identities retained | true | true | true |
| Extra GLB requests | 0 | 0 | 0 |
| Page errors | 0 | 0 | 0 |

The final validated production sample contains 1173 in-motion intervals over 43.042 seconds. Its recorded navigation long tasks are retained in the raw JSON. The final six-second monitor sample rendered at **21.35 FPS**, with a **127.3ms** maximum gap and **111 texture updates**. Development monitoring measured 23.83 FPS and a 67.7ms maximum gap. Discrete readings advanced during both monitor samples. A preceding production sample measured 25.99 FPS navigation / 344.2ms maximum gap and 24.55 FPS monitoring / 56.7ms maximum gap, illustrating run-to-run variation; it remains in `final-production.json`. Current final-source results are in [final-production-validated.json](measurements/master-1/final-production-validated.json). Development's React Profiler recorded 73 commits including initial loading and the navigation workflow, with a maximum actualDuration of 117.60ms; this is React work, not shader preparation or GPU completion time.

Average FPS is deliberately capped and is lower than the uncapped baseline; p95/p99 pacing and maximum gaps improved. No multi-second navigation freeze recurred in these final samples. This does not certify 45-60 FPS, zero dropped frames or a universal Intel driver fix. The remaining 350ms maximum interval is still perceptible. Cold readiness remains slow (roughly 10-13 seconds across these runs); preparation now happens before ready, and timing also depends on load/cache/order. The development sample being faster to ready is not a claim that development is intrinsically faster. The 5542-triangle difference is the hidden historical screen ink replaced by a two-triangle live display, not simplified room assets. Accepted GLB hashes remain exact; see `asset-integrity.json`. Raw baseline, isolation, bounded-submission and final measurements live under `docs/measurements/master-1/`. These are renderer submission intervals, not GPU-completion or compositor presentation timestamps. Settled demand-render gaps are excluded from the motion metric by explicit camera state, not a duration cutoff. Every long in-motion gap is retained.

## 8. Verification

TypeScript and the production build passed. Zero-warning ESLint and **29 unit tests in 11 files** passed. The complete final production **24-scenario browser suite passed (24/24)**, including five repeated chapter/inspection cycles, actual mesh interaction, all module boundaries, crew switching, deep links/Back, emergency focus, responsive widths, real touch, reduced motion, asset retry, and WebGL recovery both settled and during travel. Audio checks include native enable/mute/hidden-tab/exit behavior, denied audio, a 60-second sample-update test without duplicated pulses, and a delayed-resume hide race. An earlier interrupted full run timed out during an hour-long pause; it is not counted as success. The subsequent complete 24-test run passed in 3.8 minutes. [Machine-readable verification](measurements/master-1/verification.json). Screenshot/video/trace-image capture is disabled in Playwright. Only DOM assertions, JSON measurements and an image-free Chromium GPU trace were generated in this task.

## 9. Remaining limitations

- A final active-frame gap of 350ms remains perceptible, and readiness took 10.13 seconds in the final production run (12.63 seconds in the preceding sample). The tested multi-second navigation freezes were eliminated, but smoothness is not perfect.
- The UHD 620 budget deliberately targets 30 FPS; it does not meet a 45–60 FPS aspiration. Stronger GPUs and other browsers have not been certified in this pass.
- Driver and system load can affect cold preparation and frame pacing; measured samples are not universal guarantees.
- Medical waveforms, trends, scores and values are fictional; no clinical acquisition, interpretation, thresholds or real alerts exist.
- Audio is verified through native context state and emitted-oscillator assertions, not a recorded demonstration or subjective listening review.
- The existing renderer/shared bundle still produces a >500kB chunk warning.
- No screenshot-based visual review was performed, as explicitly prohibited. DOM/geometry assertions establish functional layout and interactions, not artistic approval.

## 10. Unfinished NASA requirements

Radiation history/GCR/SPE visualization, shielding explanation, physiological anatomy/bone/muscle trends, exercise logging, SANS questionnaire, wellbeing check-ins/resources, supplied diagnostics/evidence workflows and domain-approved emergency instructions remain future frontend work. Current previews are deliberately labelled. Real telemetry, calculations, clinical content approval, transport/backend, storage and real AI belong to their respective owners. See `REQUIREMENTS_TRACEABILITY.md`.

## 11. Recommended next major prompt

Master Prompt 2 should implement radiation and physiological assessment against supplied typed results and approved content, using the existing operations shell, feed/presentation boundary and single camera director. It should include missing/stale/error states and domain-reviewed wording without adding medical inference to the frontend. Wellbeing, diagnostics and expanded emergency workflows remain for Master Prompt 3. Stop after this report; no next-prompt work is implied.
