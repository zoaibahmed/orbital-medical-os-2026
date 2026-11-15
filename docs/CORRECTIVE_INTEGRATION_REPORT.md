# Orbital Medical OS — corrective integration review

14 November 2026. Implemented corrective scope: three connected chapters, unified visual presentation and rendering lifecycle. Stop here for visual review. No backend, real telemetry, medical calculation engines or remaining full medical modules were implemented.

## Confirmed diagnosis

The rejected opening and legacy bay were separate route subtrees. Browser instrumentation verified renderer identity changed from renderer-1 to renderer-2 during opening-to-bay navigation; model-instance clones and material sets were recreated. The transition took 1,651 ms. GLB network requests during that transition were already zero: network caching was not the root problem. React itself did not reload the entire document; replacing its routed scene reconstructed GPU-facing resources.

The baseline Chrome CPU profile attributed 3,291.26 ms of sampled self time across cold loading and navigation to Three.js WebGLProgram.onFirstUse diagnostics, a path containing program/shader status and log queries. This is aggregate sampled CPU time across eight matching call-tree nodes, not an isolated API-query duration or GPU completion measurement. See baseline/main-thread.cpuprofile, chrome-trace.json and shader-attribution.json under the review folder.

Baseline production standard scrolling achieved 24.81 FPS, p95 69.5 ms and p99 76.9 ms. Disabling expensive clipping/blending/shadow CSS raised it only to 26.50 FPS. Low quality achieved 39.34 FPS after starting in standard. The latter initial-ready measurement belongs to standard initialization, not cold low mode.

Source inspection found no GSAP/ScrollTrigger dependency or initialization. The old opening already used a ref for scroll; its React scroll commits were zero in the baseline. Those were not invented as bottlenecks. Active camera controllers were conditionally selected rather than simultaneously competing in that opening. Standard graphics cost, initial shader work and scene reconstruction were the confirmed problems; exact GPU/compositor/driver timing is not available.

Generated review artifacts also fell within Tailwind's implicit source scan. Two clean controlled builds proved a utility appearing only in a docs sentinel was emitted with automatic scanning and absent with explicit src/index.html scanning. CSS decreased from approximately 27 KB to 20.60 KB. A prior incremental HMR experiment was inconclusive and is retained separately. The explicit source configuration follows [Tailwind's source detection documentation](https://tailwindcss.com/docs/detecting-classes-in-source-files).

## Exact source changes

| Files | Final behavior |
| --- | --- |
| src/app/App.tsx; src/main.tsx | One SessionProvider and UnifiedExperience under BrowserRouter, existing emergency dialog, only the new os.css active; opt-in profiler instrumentation. |
| src/features/experience/UnifiedExperience.tsx | Persistent scene host, three chapters, URL/crew recovery, direct chapter navigation, contextual equipment inspection, responsive fallback, quality selection, modal focus/scroll coordination, legacy URL mapping. |
| src/features/experience/BiometricMonitor.tsx | Memoized persistent DOM instrument: fictional HR, BP, SpO2, HRV availability, sleep preview, inspectable plotted illustrative ECG, detailed provenance. Missing/invalid values are unavailable, never fabricated. |
| src/features/experience/ModulePreview.tsx; experienceRoutes.ts | Existing typed module previews and validated compatibility routing; no full new medical modules. |
| src/scene/navigation/CameraDirector.tsx; experiencePath.ts | One frame-rate-aware camera owner, three actual spatial compositions, reversible scroll travel, inspection override and interruptible return; reduced-motion cuts. |
| src/scene/MedicalBayCanvas.tsx; environment/MedicalBayEnvironment.tsx | Demand rendering, initial asynchronous shader warm-up, stable callbacks, visible failure recovery; detailed authored environment retained. |
| src/scene/quality/config.ts | Conservative low-mode rendering at DPR 0.85, no low shadows/AA; standard remains available. |
| src/scene/quality/RuntimeProbe.tsx; probeStore.ts | Opt-in renderer-object identity, frame/CPU submission, React commits and actual geometry/material/texture UUID evidence. |
| src/styles/os.css | One charcoal aerospace/medical identity, local professional typography, room-led composition, contextual instruments and readable native dialogs; explicit Tailwind source scope. |
| e2e/*; src/test/*; playwright.config.ts | Updated unified functional regressions, lifecycle/resource checks, actual mesh clicks, recovery and responsive coverage. |
| scripts/profile_unified.mjs; capture_unified.mjs; verify_tailwind_build_scope.mjs | Reproducible profiling, actual visual capture and controlled build-scan verification. |

Original old presentation files remain on disk but are inactive. Root, /bay and /dashboard addresses mount the unified experience; the rejected sidebar and developer-style bottom control rows are not mounted. Existing model files, asset pipeline, medical contracts, fixtures and package dependencies were preserved. No dependency installation was performed.

## Working user journey

Arrival establishes the actual spacecraft room. Native scrolling moves the camera through exploration into a closer biometric composition. The header can jump directly to any chapter without mandatory scrolling. Examination cradle, diagnostic scanner and equipment controls take temporary camera ownership; native scrolling or direct navigation interrupts inspection. Real model raycast interaction is tested. Scanner standby is a bounded equipment indicator check, not a medical scan result.

Crew selection updates the typed fixture snapshot together. Biometrics include heart rate, blood pressure, SpO2, an unavailable HRV reading when the fixture has no value, and an eight-hour sleep preview with its stated time window. The ECG is a plotted interactive illustrative trace, explicitly not a live clinical stream. Detailed DOM measurements retain source/time/data-quality context. Emergency rehearsal is persistently accessible, including WebGL failure. Existing future-module boundaries remain accessible as previews only.

## Lifecycle and cache proof

Five repeated Arrival → Explore → Biometrics cycles plus scanner focus/return retained the same WebGLRenderer object and identical geometry, material and texture UUID sets. No additional GLB requests occurred, environment readiness never left ready, and a settled 2.1-second observation produced zero scene frames. Camera positions change through the real environment, rather than merely changing text.

Essential environment resources preload in parallel with the scene chunk. Initial shader preparation still has a cost; responsive DOM and an explicit status/fallback remain available. Normal chapter, crew and module transitions do not unmount the Canvas. Exceptions are an explicit failed/context-lost renderer retry or a hard page reload. Explicit quality changes keep the Canvas but legitimately replace the asset/material tier after preloading it. Narrow screens initially offer readable 2D access with optional 3D; enabling 3D persists across subsequent viewport resizing.

## Measured performance

Physical adapter: Intel UHD Graphics 620, driver 31.0.101.2135; Chromium 159.0.8154.6 using ANGLE D3D11 on the actual Intel adapter, not SwiftShader. Viewport 1440×900. Each active sample lasted at least 12 seconds. Frame rates are scene-render sample rates during scripted active scroll, not an assertion of every compositor presentation.

| Run | FPS | p95 / p99 frame interval | Initial ready | Largest active long task |
| --- | ---: | ---: | ---: | ---: |
| Rejected dev standard | 25.09 | 68.4 / 92.2 ms | 6,732 ms | see raw baseline |
| Rejected production standard | 24.81 | 69.5 / 76.9 ms | 3,710 ms | see raw baseline |
| Rejected production low, selected after standard | 39.34 | 43.8 / 70.1 ms | not a cold-low sample | see raw baseline |
| Corrected dev low | 53.20 | 28.8 / 70.2 ms | 4,130 ms | 118 ms |
| Corrected production low | 58.12 | 23.1 / 32.3 ms | 2,043 ms | 103 ms |
| Corrected production standard | 33.97 | 71.0 / 92.3 ms | 2,082 ms | 85 ms |

Final low sample: 698 frames over 12,008.7 ms, median interval 16.5 ms, median CPU render submission 2.6 ms, two active long tasks. Initial largest task 244 ms. Last visible frame: 29 draw calls / 94,004 triangles, renderer memory counters 33 geometries / 18 textures; path maximum includes 32 calls / 96,384 triangles. Changes in visible triangle counts follow camera culling. Low drawing buffer is 1224×765 at this viewport; the resolution reduction is a deliberate tradeoff, not removal of the detailed medical models. Standard last frame uses 52 calls / 250,368 triangles, 34 geometries / 20 textures.

The first corrected production low pass achieved 58.30 FPS; an intermediate repeat achieved 53.37 FPS with p95 36.7 ms and a 129 ms task. Both are retained. One intermediate development cold start took 22.5 seconds; the final scoped-source dev run took 4.13 seconds. CSS scanning/HMR involvement was separately demonstrated, but the entire outlier is not attributed exclusively to it. Cache/order/system load affect initial readiness, so these are observations rather than controlled network cold-start guarantees.

Development React Profiler measured ten commits during the final active sample, associated with chapter boundaries rather than each frame. Standard production React disables Profiler callbacks; its empty callback array does not prove zero React commits. KHR_parallel_shader_compile was available. CPU submission timing is not GPU completion timing; GPU timer queries, VRAM byte usage and exact driver/compositor attribution were not measured.

## Verification and review evidence

Final executed checks: TypeScript passed; ESLint passed with zero warnings; production build passed; 18 unit tests across six files passed. The final production Chromium browser suite passed all 12 tests in 1.1 minutes. Coverage includes five resource-stable cycles, actual mesh hover/click, scanner indicator completion, inspection interruption, missing GLB recovery, actual WebGL context-loss retry, legacy URLs, invalid crew/path handling, crew selection, detailed measurement values and provenance, emergency focus, keyboard navigation, deep links/Back, genuine scroll/reversal, reduced motion, mobile 3D opt-in, quality changes and widths 320/390/768/1024/1440.

Final visual capture verified zero healthy page errors, retained renderer identity and unchanged SHA-256 hashes for all six GLBs. Desktop, mobile, standard quality, scanner, measurements, emergency and WebGL-fallback screenshots were visually inspected. Unlike the rejected cream/pink introduction and separate sidebar dashboard, all three chapters share one dark identity, room-led camera compositions and contextual instruments.

[Actual visual gallery](reviews/correction/index.html) · [Scrolling recording](reviews/correction/unified-scroll.webm) · [Biometric screenshot](reviews/correction/biometrics.png)

Actual captures, recording and raw evidence: [review directory](reviews/correction/). Screenshots and video are browser output, not mockups. Video recording is separate from the performance benchmark because recording adds overhead. The earlier TEAM_FRONTEND_HANDOFF.zip is a historical snapshot; its old routed presentation architecture is superseded by this report, while its medical contracts remain applicable.

## Outstanding limitations / approval

Low mode approaches the requested 45–60 FPS on this UHD 620 but does not guarantee locked 60 FPS or eliminate every long task. Standard mode does not meet that target on this adapter. Initial shader/loading latency remains, with responsive recovery/status rather than a blank blocking transition. The renderer chunk remains 606.83 KB minified plus 383.44 KB Three core; the build's large-chunk warning is retained. Upstream Three.Clock deprecation warnings remain. Other GPUs, real mobile devices, Safari and Firefox were not executed. Responsive and reduced-motion checks are Chromium checks, not a complete accessibility certification.

Review the three chapters, low-mode detail/legibility and contextual medical instruments before further development. No remaining full module work should begin until this corrective experience is approved.
