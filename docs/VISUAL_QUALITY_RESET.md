# Visual quality reset — environment review

14 November 2026. **Art approval pending.** This phase delivers one isolated environment benchmark and one reversible overview/examination movement. It does not declare the artwork production-ready or implement the next interface phase.

Open the running production review at http://127.0.0.1:5187/visual-benchmark. Root and existing medical URLs retain working functionality. They remain historical presentation references, not approved art. No dashboards, medical engines, backend services, extra modules or additional scroll chapters were added.

## Browser audit before changes

[Before capture](reviews/visual-reset/before.png) was taken from the actual running application before this phase. The scene was compared against professional environment-art criteria: silhouette, construction logic, scale cues, material response, occlusion, motivated light and readable composition. No external screenshot was used as an unlicensed asset or falsely presented as work produced here.

| Area | Observed weakness | Treatment |
| --- | --- | --- |
| Architecture | Repeated shallow wall rectangles, broad unarticulated surfaces and limited service construction | New formed aft cassettes, pressure ribs/flanges, stowage racks, vents, side service lines, overhead raceways, ceiling cassettes, deck grilles and hatch hardware |
| Examination bed | Flat stacked platform, coarse cushions, sparse lower mechanism | Replacement profile-lofted chassis, variable cross-section, double-curved cushion meshes, seams, actuator sleeves/rams, guard hinges, bearing carriages and restraint anchors |
| Scanner | Thin uniform U arch, shallow sensor detail | Replacement structural backplane, rear flange, 18 separated ceramic wedges, cooling fins, sensor apertures, seal, motor cowlings, screws and service loom |
| Diagnostic trolley | Box-like enclosure with text-led display | Improved protective frame, connector barrels, strain relief, managed leads, rear heatsink and VESA mount; underlying enclosure retained and still a limitation |
| Materials | Runtime forced aluminium and ceramic roughness to 1, obscuring intended differences | Benchmark uses authored PBR values and maps without the legacy palette/roughness overrides |
| Lighting | Excessively uniform fill and weak contact depth | Lower fill, warm task key and cool equipment fill, PMREM reflection environment, standard shadow map, baked vertex cavity occlusion and retained contact patches |
| Camera | Fast exponential settling in the operational experience | Separate benchmark camera with fixed FOV and a 2.2-second quintic overview/examination move, reversible and interruptible |
| Presentation | Rejected website navigation and large panels obscured the art | Benchmark omits operational navigation and modal panels; small temporary review transport only. Full UI redesign deferred |

The old geometry/material naming, loader and interaction contracts were reusable engineering; the old bed/scanner/shell art was not treated as production-quality artwork. The trolley is improved rather than honestly described as entirely replaced.

## Authoring and provenance

Blender **4.5.15 LTS** was executed locally. Existing Blender helpers, local fonts, GLB export/Draco tooling and the R3F renderer were inspected. No paid assets, downloaded models, generated-image textures, extra authoring applications or new npm packages were introduced. This route uses original project geometry/maps; it makes no claim of third-party production-asset quality.

- Generator: [build_visual_benchmark.py](../scripts/build_visual_benchmark.py), using shared manufacturing helpers from build_medical_bay.py.
- Full assembled standard-tier Blender source: [visual-benchmark.blend](../assets/source/visual-benchmark.blend). Exported parts are material-batched; the generator retains the unbatched construction recipe.
- Runtime assets: public/assets/models/benchmark/, with six low/standard GLBs. Original operational GLBs were preserved.
- Manifest: [benchmark-manifest.json](../src/scene/assets/benchmark-manifest.json), mirrored beside the GLBs. Includes exact hashes, bytes, triangles, tier, authorship and review status.
- Source art and maps: original project work, no third-party model/image rights asserted. Existing Barlow Condensed glyph outlines carry SIL OFL 1.1 attribution. No external asset purchase is required for this benchmark.

The primary equipment is not assembled solely from scaled cubes: the chassis uses longitudinal custom profile sections; cushion crowns use tessellated double-curved surfaces; the gantry uses annular wedge meshes; cables/structural knees are swept curves. Ordinary fasteners, rails and fixtures use primitive-based manufacturing helpers where appropriate. Bevels, weighted normals, UVs, smooth upholstery normals and material batching are applied before Draco export.

Normal maps include original 512px brushed/weave/coating patterns and inherited 128px maps. There is no outsourced photogrammetry, hand-painted wear atlas or high-resolution scanned PBR library. Maintained surfaces have restrained detail; richer surface storytelling remains an art limitation. Geometry is authored in meters, but this is a conceptual spacecraft device, not an ergonomically or mechanically certified medical design. Human-reference scale and adjustment travel require domain/art review.

## Material and lighting changes

The benchmark bypasses createBayMaterials' legacy palette and roughness=1 overrides. Brushed aluminium uses high metalness and moderate roughness; painted composite, ceramic, cushion, elastomer and dark sensor glass have distinct responses. Subtle tangent-space normals add material structure without postprocessing. Materials are not uniformly glossy.

Eight hemispherical rays per vertex, up to 0.38 authored units, bake local cavity occlusion into mesh colors. A real export verification found the bake on COLOR_1 while COLOR_0 was white; final GLBs promote the baked channel to COLOR_0. The generation recipe now explicitly selects/exports the active color layer. Asset metrics verify that every exported mesh primitive has COLOR_0. This is vertex AO, not an AO texture atlas or baked indirect illumination; cross-asset occlusion is not baked because parts export separately.

LightingRig's optional study variant lowers hemisphere/directional fill and adjusts task/equipment spot intensities while preserving the original default behavior. Existing PMREM RoomEnvironment provides reflections. Overhead emissive fixtures align with the light concept; individual emissive fixtures do not cast physically simulated light. Standard uses realtime shadow mapping; low relies on the vertex bake and fixed contact patches. No bloom, runtime SSAO or cinematic grading hides the geometry. Shadows and indirect illumination remain approximate.

## Camera demonstration and lifecycle

VisualBenchmark owns one demand-rendered Canvas. It does not mount the operational CameraDirector/OrbitControls or compete with scroll controllers. Overview and examination share a constant 48-degree FOV; position and look target interpolate with a quintic ease over 2,200 ms, with zero endpoint velocity/acceleration. Buttons and the range control can reverse a move from its current pose. Reduced motion cuts directly. No additional chapter timeline was implemented; the old operational choreography is left for the next approved phase.

The overview/examination path was visually reviewed in browser captures and the recording. Its purpose is to approach the patient support and gantry together without crossing equipment. This is a reviewed path, not a general collision-avoidance navigation system. The transport is temporary review UI, not the proposed final navbar/holographic design.

Both tiers cache the same Promise-backed model resources for reuse. Across three repeated out-and-back cycles (six legs), renderer identity and exact geometry/material/texture UUID sets stayed constant, with zero new GLB requests. Explicit tier changes reuse the Canvas and legitimately replace the model tier. Browser tests caught and fixed a missing warm-up dependency that kept readiness at loading after a tier change. Failure boundaries, explicit retry, WebGL fallback and accessible medical links are retained.

## Final hardware measurements

Production Chromium 159 / ANGLE D3D11 on **Intel UHD Graphics 620**, 1440×900 viewport. Low DPR 0.85, no AA/realtime shadows. Standard DPR up to 1.5, AA and shadow map. Unrecorded samples used three repeated 2.2-second overview/examination/return movements. Frame counts include every observed interval, including settled polling gaps; these are renderer sample rates, not hardware compositor/GPU-completion timers.

| Tier | Average frames / elapsed second | p95 / p99 interval | Ready | Max draw calls | Max rendered triangles | Renderer texture counter |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| low | 54.89 | 17.8 / 18.4 ms | 3583 ms | 30 | 145,416 | 20 |
| standard | 38.33 | 65.6 / 77.9 ms | 3336 ms | 58 | 528,924 | 22 |

Low: 801 rendered frames over 14.59 seconds; largest observed interval 244.1 ms. Standard: 568 frames over 14.82 seconds; largest interval 267.7 ms. There were zero PerformanceObserver main-thread long-task entries during either final active sample. The largest render gaps include idle/poll intervals between settled moves, so they must not all be labeled animation stalls. Wall-clock click-to-settled observations were about 2.4–2.56 seconds because browser polling adds observation latency to the 2.2-second camera timeline.

Standard remains below 45–60 FPS on this adapter. Low is the default and the practical recommendation. Standard shadow work increases the recorded triangle count through extra rendering passes: its 528,924 maximum is not the unique asset triangle count. The low maximum is 145,416 with 30 draw calls; standard maximum 58 calls. Renderer geometry counters were 31 in both tiers.

Total GLB transfer sizes: low 2.671 MB; standard 2.971 MB, decimal units. Unique authored triangles: low 145,412; standard 264,460. Embedded image dimensions imply approximately **10.08 MiB** RGBA8 texture storage including mip levels per tier across the three source GLBs, before environment/shadow resources. This is an estimate, not measured driver VRAM; shared sampler/image allocation and driver formats may differ. The texture counters include environment/render resources and are counts, not memory bytes. Exact asset-by-asset sizes/maps are in [asset-metrics.json](reviews/visual-reset/asset-metrics.json).

Readiness is navigation-to-ready for low. Standard's figure includes initial low initialization plus selecting standard; it is not an isolated cold standard startup. Cache, shader state and system load affect these observations. Prior captures and first passes are retained, not silently replaced with a best result. Recording itself showed larger standard gaps, including an approximately 3.3-second gap; its precise driver/compositor/recording split was not isolated. It is excluded from the unrecorded benchmark and remains a limitation of recording on this machine. No claim of stable 60 FPS, precise GPU time or equivalent results on other hardware is made.

## Verification and captures

TypeScript and production build passed. ESLint passed with zero warnings. Eighteen unit tests across six files passed. All 14 final Chromium browser tests passed in 1.4 minutes. The 23.2-second 1440×900 recording was verified to decode, seek at 4/8/12 seconds and play; an intermediate frame was also captured. New checks exercise deliberate movement duration, endpoint reversal/interrupt, one renderer, tier-switch readiness, reduced motion, narrow-screen controls and unavailable WebGL. Existing medical/routing/crew/emergency/error-recovery tests are preserved. An existing native-scroll test race was corrected to wait for the new progress value before waiting for settled; its endpoint equality requirement was retained.

Actual artifacts:

- [Before](reviews/visual-reset/before.png)
- [New overview](reviews/visual-reset/standard-overview.png)
- [Examination close-up](reviews/visual-reset/standard-close.png)
- [Scanner detail](reviews/visual-reset/scanner-detail.png)
- [Lighting/material composition](reviews/visual-reset/lighting-materials.png)
- [Motion recording](reviews/visual-reset/camera-demonstration.webm)
- [Gallery](reviews/visual-reset/index.html)
- [Raw unrecorded measurements](reviews/visual-reset/performance.json)
- [Separate recording measurements](reviews/visual-reset/final-capture-performance.json)

These are actual browser outputs. Detail images crop actual browser frames, not offline illustrations. The before/after overview camera framing differs, so this is a design comparison rather than a pixel-identical A/B. Visual inspection confirmed stronger equipment silhouettes and construction layers; the result still has clean, regular procedural surfaces and approximate light transport. It should be judged as an improved review asset, not declared AAA/cinematic production artwork solely because it builds or renders.

## Remaining decisions / stop gate

Review the actual room, bed/scanner construction, material response, camera comfort and low-mode aliasing. Remaining art gaps include regular/repetitive storage, a partly retained trolley enclosure, limited bespoke wear/texture storytelling, approximate contact/indirect light and unvalidated human scale/mechanics. A higher realism target may warrant a specialist asset-art pass or legally licensed art with a separately agreed budget; no paid asset is introduced without approval.

The next phase may replace navigation, holographic displays, popups and full scroll presentation only after the environment standard is approved. This phase stops at the scene and camera benchmark. Existing full interface styling has not been promoted as approved; no additional medical modules or chapters were built.
