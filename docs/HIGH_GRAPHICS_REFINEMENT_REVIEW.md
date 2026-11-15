# High-only medical bay refinement — review gate

15 November 2026. Substantial additional geometry/material/lighting refinement is implemented. **Visual approval remains pending; this is not a claim of reference-equivalent realism or acceptable UHD 620 performance.**

Public review: http://127.0.0.1:5187/visual-benchmark. Operational scenes load the same high assets. The supplied second reference remains the primary visual benchmark. No medical modules, full UI redesign or new scroll chapters were implemented.

## Public high-graphics policy

- Production always selects the highest authored tier, whose internal identifier remains standard. Existing quality=low and devQuality=low URLs cannot downgrade production.
- Visible low/standard selectors are removed from the review footer and active crew/display settings. The operational status reads High fidelity.
- Antialiasing, standard-tier models/textures, 2048px shadow map, 256px reflection environment and the existing DPR range 1–1.5 are active. At the measured browser device ratio the actual buffer is 1440×900.
- There is no automatic hardware-driven reduction. Unavailable/context-lost WebGL still offers the existing accessible medical view/retry. Narrow-screen 3D opt-in is preserved; enabling it uses high quality.
- Only a development build can use the explicit devQuality=low diagnostic parameter. Archived lower-tier assets remain internal diagnostics, not the public review target. Every new screenshot and the delivered recording uses high quality.

The shared initialGraphicsQuality function and production-policy unit/browser tests enforce this behavior. The rest of the interface composition is unchanged.

## Substantial art changes

| Component | Additional refinement in this pass |
| --- | --- |
| Patient platform | Rebuilt cushion arrangement with inclined thoracic support and cervical pillow; load-bearing support shell and braces; wide woven restraint ribbons with stitched edges and buckles; crossed pantograph links, bearings, actuator sleeves/pistons, hinge collars, release catches and connected service leads |
| Scanner | Segmented inner detector liner and gaskets; deeper optical collars; crown detector pod with paired lenses; lower protected drive bearings/teeth; service legend plates/fasteners; optical-head intake and connected ceiling service loop |
| Console | Thin-wall transparent reservoirs with separate fluid volumes, neck fittings and label bands; monitor protection/ports; managed signal loop; drawer guides/catches; docked ergonomic probe, transducer and cable; lower thermal return and identification legends |
| Walls and storage | Real chamfered pressure viewport with layered frame/flange/gasket/reveal and thin glazing; surrounding hull panels; retained structural webs; additional aft access leaves and vents; counter specimen case/latches and vial rack |
| Ceiling | Denser routed data/service conduits with saddle clamps, existing practical fixtures and optical-head connections |
| Exterior scale/depth | Independently modelled textured Earth sphere beyond the viewport. The opening has actual geometry and camera parallax; no room photograph or reference-image background is used |
| Materials/light | Thin optical glazing, silicone seals, seam thread and applied graphite legends; calmer paint relief; higher-resolution shadow/reflection infrastructure; cached static-caster shadows |

Browser inspection caught an exterior leak beside the viewport and unsupported raised cushion geometry. The actual hull gap was closed, corner fields filled, and the backrest received supporting geometry. The globe was lowered/rotated to show a curved horizon rather than a wall-sized land map. These were geometry corrections, not screenshot edits. Final close-up QA also removed duplicated legacy bed lettering and placed the patient-interface and clearance legends onto the actual shell surfaces; the recorded fix is in scripts/correct_bed_legends.py.

Custom profile/swept meshes, sculpted cushion grids, annular components and linked mechanisms remain independent geometry. Ordinary manufactured fasteners/caps use primitive helpers where appropriate. Static geometry is batched by material, UV mapped and Draco compressed. Existing authored PBR colors, roughness and map scale remain authoritative; there is no reinstated global grey palette override.

## Lighting, rendering and camera

Camera controls, the reversible 2.2-second quintic demonstration and existing chapter/inspection ownership are preserved. Static equipment/light positions permit reusing the real shadow map while the camera moves. Geometry readiness/context retry explicitly requests a fresh map; camera travel and emissive standby checks do not regenerate it every frame. This is appropriate only while casters and lights remain fixed. Moving equipment would require explicit shadow invalidation or a different policy.

The room uses task/key/fill lighting, local practical illumination, PMREM reflections, real high-tier shadows, retained contact patches and existing vertex cavity shading. New corrective support/infill pieces use conservative vertex tones. Glass is thin alpha-blended shading rather than physically refracted fluids or full ray-traced glazing. No bloom, room-image projection, fake background render or postprocessing hides the equipment.

## Provenance and source files

- [build_premium_bay.py](../scripts/build_premium_bay.py): high-tier independent geometry recipe, reusing the verified project authoring/export helpers.
- [correct_high_geometry.py](../scripts/correct_high_geometry.py) and [close_viewport_corners.py](../scripts/close_viewport_corners.py): recorded corrections to the exported geometry.
- [medical-bay-high.blend](../assets/source/high-refinement/medical-bay-high.blend): complete assembled final high scene.
- [benchmark-manifest.json](../src/scene/assets/benchmark-manifest.json): current hashes, sizes, topology and provenance, mirrored beside the GLBs.
- Prior models are preserved under assets/source/high-refinement/prior/.

Geometry and supplemental maps are original project work. Existing Poly Haven Metal Plate 03 deck maps remain CC0 with Charlotte Baglioni attribution; Barlow Condensed glyphs remain SIL OFL 1.1. No paid model or new npm dependency was introduced.

The globe uses [NASA Earth Observatory Blue Marble data](https://science.nasa.gov/earth/earth-observatory/the-blue-marble-true-color-global-imagery-at-1km-resolution/), credited to NASA Goddard / Reto Stöckli and Robert Simmon, subject to [NASA Media Usage Guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/). The exact NASA-hosted download URL, byte count and SHA-256 are recorded in [NASA_SOURCE.json](../assets/source/high-refinement/NASA_SOURCE.json). It is a texture on an exterior sphere, not an image substituted for the medical bay. The user-supplied reference exists only in review documentation.

## Asset budget

| High asset | Bytes | Unique triangles | Material batches |
| --- | ---: | ---: | ---: |
| shell-standard | 4,920,508 | 150,796 | 20 |
| examination-standard | 2,667,644 | 154,476 | 13 |
| equipment-standard | 2,901,504 | 55,576 | 16 |

Total high GLB size: 10.490 MB, decimal units; 360,848 unique triangles. The embedded image dimensions imply approximately 41.33 MiB RGBA8 texture storage with mipmaps before reflection/shadow allocations and possible sharing. This is an estimate, not measured driver VRAM. The source image maps are mostly 512px, with a 2048×1024 NASA globe map; this pass does not claim a new hand-painted 4K wear atlas. Detailed per-image metrics are in [asset-metrics.json](reviews/high-refinement/asset-metrics.json).

## Actual profiling and performance limitations

Measured adapter: Intel UHD Graphics 620, ANGLE D3D11, Chromium 159, 1440×900. This is the high public presentation; no automatic or manual lower-tier mode was used for the new review.

Initial high tests exposed multi-second gaps. Chrome CPU profiling attributed **2,271 ms sampled self time** to Three's first-use shader diagnostics path containing program/shader log and link-status queries. The installed Three renderer source recommends keeping diagnostics during development while allowing them to be disabled in production. Production now does that. Development was separately executed with diagnostics enabled and reported zero shader/page errors.

A further profile identified cold uniform-reflection queries (WebGLUniforms constructor: getProgramParameter/getActiveUniform/getUniformLocation). These are not removed from Three. The diagnostic policy does **not** resolve all hardware/rendering limitations. The initial CPU trace, sampled attribution, post-change trace and earlier measurements are preserved; no causal claim that disabling diagnostics alone fixes FPS is made.

The first frame-rate summaries mixed settled demand-render intervals with camera motion. The final probe records the camera's actual moving state. The motion metric includes every interval beginning with a moving camera, including long in-motion stalls; it excludes settled gaps by state, not by a time threshold.

| Final high-only metric | Measured result |
| --- | ---: |
| In-motion renderer rate | **22.84 FPS** |
| In-motion p95 / p99 interval | 101.0 / 116.6 ms |
| Largest in-motion gap | **3438.9 ms** |
| Motion sampling | 443 intervals over 19.396 s |
| Wall-clock frames / elapsed second | 20.55 FPS over 21.852 s |
| Navigation to ready | 4549 ms |
| Maximum draw calls / rendered triangles | 53 / 362,556 |
| Renderer geometry / texture counters | 52 / 30 |
| Renderer and exact resource UUID sets retained | true |
| Additional GLB requests across six camera legs | 0 |

These are renderer sample intervals, not GPU-completion or compositor presentation timers. Cold-start/order/system load affect readiness. Previous samples around 14–16 wall-clock FPS and long gaps are retained in the review folder. The final in-motion gap confirms that the problem is not entirely settled-time measurement. It remains unresolved on this adapter. The post-change CPU trace did not isolate the same active pause; a precise driver/GPU/compositor split has not been established.

**This high scene is not acceptably fluid on UHD 620 and does not meet a 45–60 FPS target.** Public quality was kept high as requested rather than silently downgraded. Initial lighting/program preparation, large JS chunk warnings, frame pacing and intermittent stalls remain review risks. Baked lighting/material consolidation and testing on a stronger GPU are future optimization options, not work claimed complete here.

## Review artifacts — all high quality

1. [Full room](reviews/high-refinement/standard-overview.png)
2. [Patient platform close-up](reviews/high-refinement/standard-close.png)
3. [Scanner close-up](reviews/high-refinement/scanner-detail.png)
4. [Console/equipment](reviews/high-refinement/equipment-detail.png)
5. [Architecture detail](reviews/high-refinement/architecture-detail.png)
6. [Lighting/material beauty view](reviews/high-refinement/beauty-detail.png)
7. [High-quality camera recording](reviews/high-refinement/camera-demonstration.webm)
8. [Reference comparison](reviews/high-refinement/reference-versus-render.png)
9. [Raw performance measurements](reviews/high-refinement/performance.json)
10. This report explains the geometry/material/rendering changes and limits.

[Gallery](reviews/high-refinement/index.html) · [Operational integration capture](reviews/high-refinement/operational-integration.png)

Still images hide only the existing review DOM controls so the 3D construction is exposed. Detail crops are actual browser output. The 11.44-second 1280×800 recording uses high quality, retains the renderer, and was verified to decode, seek at 2/5/8 seconds and play. There were zero healthy page errors. Operational request verification recorded exactly three standard-tier GLBs despite a legacy quality=low URL. No lower-quality recording is presented as the new review.

## Verification

TypeScript, production build and zero-warning ESLint passed. **21 unit tests across eight files and all 14 browser tests passed.** Coverage retains medical fixture/crew behavior, navigation, real equipment clicks, five persistent chapter/inspection cycles, keyboard/deep links, responsive access, reduced motion, failed assets and WebGL context-loss recovery. New checks enforce the production high policy and absence of a public graphics selector. Development shader diagnostics remain enabled and were executed successfully. Tests do not prove visual approval, acceptable FPS or complete accessibility certification.

## Critical visual assessment / approval

This pass adds visible load paths, wider restraints, meaningful inner detector construction, connected peripherals and spatial depth through a real viewport. It is substantially more than a colour adjustment. However, it still falls short of the reference:

- Body shells, access covers and mechanisms are less intricate and more regular.
- Cushion seams/strain and straps remain cleaner and less organically manufactured.
- Surface wear, small decals and detailed trim maps are limited.
- Thin glazing and the luminous globe are approximations; fluid refraction and physically accurate atmospheric scattering are absent.
- Indirect illumination and reflection locality are approximate. The room retains a computer-generated appearance.
- Medical-device mechanics, clearances and human factors are conceptual, not validated engineering.
- High-mode frame pacing on UHD 620 remains unacceptable despite persistent resources and rendering optimizations.

**Stop here for review.** No approval is inferred from successful tests or from completion of this additional art pass. Do not begin full interface, navigation or new module work until the environment direction is approved.
