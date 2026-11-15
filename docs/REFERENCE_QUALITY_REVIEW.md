# Reference-driven medical bay — visual approval review

15 November 2026. Status: **improved actual 3D environment; visual approval pending. The supplied reference's realism has not been matched.** This report documents both the work completed and the remaining visual distance. Successful tests do not establish art approval or photorealism.

Open http://127.0.0.1:5187/visual-benchmark for room inspection. The operational /bay and /dashboard scenes also load the same new asset set. Their UI, navigation, crew state, medical contracts and chapter choreography remain unchanged. No new medical modules, backend services, navbar redesign or additional scroll animation was implemented.

## Reference analysis and specification

The supplied reference uses an enclosed, layered room; a diagonal bed is the focal object, a deep ring reinforces its silhouette, a side console balances it, and dark ceiling/floor construction surrounds warm medical housings. Its colour separation comes from off-white shells, dark metal/recesses, muted teal upholstery, copper services and small warm practicals. It avoids cyan flooding. Reflections and contact shadows vary by material; detailed seals, fasteners, interlocks, vents and glass provide scale.

A component-by-component specification was created **before modelling**: [REFERENCE_ASSET_SPEC.md](REFERENCE_ASSET_SPEC.md). It covers proportions/composition, architecture, patient platform, scanner, optical head, clinical storage, floor, console, materials, lighting and tier budgets. The reference is stored only with review documentation, never used behind the Canvas, as a room texture, on a display or as a replacement for geometry. All renders and movement are produced by independently modelled, separately loaded GLBs.

## Actual modelling changes

| Component | Implemented change | Remaining difference |
| --- | --- | --- |
| Patient platform | Contoured chassis retained and deepened with removable actuator covers, exposed pivots/linkages, service vents, harnesses, shortened platform proportions, real restraint geometry/buckles, release tabs and raised head support | Less complex bodywork, seat articulation and load-bearing engineering than the reference; device ergonomics remain unvalidated |
| Scanner | Replaced thin prior arch with a deep backplane, six substantial service sectors, metal edge trims, recessed vent inlays, captive screws, patient liner, narrow light guides, pedestal motors, grilles and power hoses | Service sectors remain regular; internal drives and nested access geometry are simpler than the reference |
| Optical head | Connected telescoping ceiling mount, pivot sleeve, articulated support, housing and paired lens apertures | Static conceptual equipment, not a kinematically validated robot |
| Architecture | Chamfered hatch layers, vision recess, hinges/latches, framed aft installations, copper feed lines/couplings, ventilated ceiling trays and practical housings | Large wall fields still look cleaner and less intricately constructed; no exterior Earth view or planted decoration was copied |
| Wall services | Fitted side manifold with gauge bezels/needles, valve grips and separate copper service loops; asymmetrical counter and supply shelf with independent vials | Supply cabinet is sparse; manifolds use simplified functional detail rather than an externally authored production assembly |
| Console | New body/drawer inserts, caster structure, protection rails, double-link display support, control keys, connector collars, managed leads, pole and reservoirs | Reservoir glazing and tubing are simplified, shell mechanisms lack the reference's density |
| Physical instrument screen | Independently authored chart lines, text and reticles; corrected Bezier overshoot by using an actual polyline | Static simulated prop graphics, not live crew telemetry or a new medical module |
| Deck | Licensed PBR traction metal, planar UVs, geometry-based expanded-metal inserts, fasteners, anchor rails and clamps | Grating pattern and wear remain more regular; some hard shadow/aliasing remains |

Custom profile meshes, curved upholstery grids, swept tubing, annular sector meshes and connected mechanisms define the important silhouettes. Boxes/cylinders are still used for appropriate manufactured parts, not asserted to be equivalent to a specialist production model. Export applies bevels, weighted normals, UVs, material batching and Draco compression. Narrow ring sectors now use sampling proportional to arc length rather than full-semicircle subdivisions.

## Materials, colour and lighting

The operational renderer previously forced a palette over GLB colours and set aluminium/ceramic roughness to 1. Those overrides are removed. Instance-owned material/map clones now preserve authored linear colour, PBR values, normal strength and UV scale. A new regression test protects warm ceramic response and map scale from being flattened again.

The art palette separates warm ceramic, muted teal upholstery, ochre releases, copper utilities, dark charcoal recesses/deck, machined metal and glass. It includes original roughness/micro-normal maps with restrained relief. The sourced floor map receives a documented cool material tint to neutralize its brown cast. Surface maps are 256px in low mode and 512px in standard; source maps were obtained at the provider's 1k option and retained separately.

Lighting combines overhead task/key illumination, cool-neutral fill, PMREM reflections and warm local practicals. Two local point lights are standard-only; low retains the key/fill and uses approximate baked/contact depth. Standard uses realtime shadows. Local cavity occlusion is baked from eight rays per vertex for the authored parts. The post-optimized traction strips use a conservative constant vertex tone while retaining the original bake elsewhere. Existing contact patches remain approximate; they are not full physically baked lighting. There is no bloom or reference-image projection.

This improves depth and material separation but does not provide reference-quality global illumination, ray-traced glossy reflections, transmission or hand-painted wear/decals. Some painted surfaces and equipment still read as clean computer-generated artwork.

## Provenance, licensing and authoring files

Blender **4.5.15 LTS** was executed locally. No paid asset or npm dependency was added. Model geometry and supplemental maps are original project authoring using the shared manufacturing helpers. Existing Barlow Condensed glyphs retain SIL OFL 1.1 attribution.

Floor maps: **Metal Plate 03, Charlotte Baglioni, Poly Haven, CC0**, verified on the [primary asset page](https://polyhaven.com/a/metal_plate_03). Original API download metadata, author information and exact file hashes are retained in assets/source/reference-upgrade/. The diffuse, OpenGL normal and roughness downloads were checked against the provider's published MD5 values, with local SHA-256 recorded in [SOURCES.json](../assets/source/reference-upgrade/SOURCES.json). Derivatives are resized/tinted and embedded in GLBs. No third-party medical model was purchased or misrepresented as original work.

- Main authoring recipe: [build_reference_bay.py](../scripts/build_reference_bay.py).
- Floor topology optimization: [optimize_reference_gratings.py](../scripts/optimize_reference_gratings.py).
- Exact assembled final standard scene: [medical-bay.blend](../assets/source/reference-upgrade/medical-bay.blend).
- Final runtime manifest: [benchmark-manifest.json](../src/scene/assets/benchmark-manifest.json), mirrored beside the GLBs.
- Prior rejected review assets are preserved under assets/source/reference-upgrade/previous-glbs/; original earlier operational models also remain on disk.

## Source integration

| File | Change |
| --- | --- |
| src/scene/assets/registry.ts | Operational scene now resolves the new two-tier manifest and its actual provenance |
| src/scene/environment/materials.ts | Preserve authored PBR/map scale with owned clones; dispose only instance-owned resources |
| src/scene/environment/LightingRig.tsx | Warm/neutral study lighting and tier-specific local lights; retains PMREM and existing shadow infrastructure |
| src/scene/MedicalBayCanvas.tsx | Uses the revised lighting with the existing rendering lifecycle |
| src/scene/VisualBenchmark.tsx | Uses new assets without overriding normal strength; static equipment review angle available through ?detail=equipment |
| scripts/review_reference_bay.mjs | Actual captures and separate unrecorded measurements |
| scripts/finalize_reference_review.mjs | Clean low-mode recording, comparison capture, playback verification and operational model-request proof |
| src/test/materials.test.ts | Protect authored material appearance and cached-source ownership |

The existing two-pose 2.2-second camera demonstration remains reversible and interruptible. No extra scroll timeline was added. Temporary review controls and the operational navbar were not redesigned. The reference was not used as website UI inspiration or copied branding.

## Optimization and measured performance

The first unrecorded reference-led pass measured 41.26 FPS low and 19.86 FPS standard. Geometry inspection identified wasteful bevel tessellation in the traction strips. Optimizing those strips reduced shell triangles from 133,460 to **75,092** in low and from 275,048 to **118,376** in standard. Medical bed/scanner detail was preserved. The monitor polyline also removed unnecessary curve subdivisions. Removing the two local point lights from low reduced fragment work. The improvement below reflects these combined changes, not a claim that floor geometry alone caused all frame cost.

Final production test hardware: **Intel UHD Graphics 620**, ANGLE D3D11, Chromium 159, viewport 1440×900. Active tests use three overview/examination/return cycles, six camera legs, approximately 15 seconds per tier. They do not record video or capture screenshots concurrently.

| Tier | Frames / elapsed second | p95 / p99 interval | Navigation to ready | Max calls | Max rendered triangles | Texture count |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| low | 53.85 | 17.8 / 18.2 ms | 4034 ms | 42 | 146,676 | 27 |
| standard | 24.62 | 83.4 / 246.5 ms | 4255 ms | 82 | 497,212 | 29 |

Low: 806 frames / 14.969 seconds; median CPU render submission 1.7 ms. Standard: 366 / 14.864 seconds; median CPU submission 2.5 ms. Maximum observed frame gaps were 289.9 and 299.6 ms respectively, including inter-leg polling/settled intervals. Low recorded zero active main-thread long-task entries; standard recorded one 51 ms entry. No GPU-completion timer, precise VRAM measurement or driver/compositor attribution was collected. CPU submission time is not GPU time.

**Low mode is the recommended operating tier on UHD 620. Standard mode does not meet a 45–60 FPS target on this adapter.** The standard visual gain is higher-resolution textures, antialiasing, realtime shadows and local service lighting; it costs substantial rendering headroom. The shadow pass explains why its maximum rendered triangles are approximately twice its unique asset triangles. This is a verified hardware tradeoff, not a universal performance guarantee.

Both tiers retained the same renderer and exact geometry/material/texture UUID sets through six legs, with **zero new GLB requests**. Canvas did not remount during the measured movement. Explicit tier changes intentionally load a different cached tier. Startup measurements depend on shader/cache/order/system state; standard's readiness includes navigating into low and selecting standard, not an isolated cold standard startup. Main-scene five-cycle persistence remains covered by browser tests.

| Asset | GLB bytes | Unique triangles | Material batches |
| --- | ---: | ---: | ---: |
| shell-low | 1,254,744 | 75,092 | 16 |
| examination-low | 732,172 | 51,844 | 11 |
| shell-standard | 4,220,472 | 118,376 | 16 |
| examination-standard | 2,429,600 | 100,108 | 11 |
| equipment-low | 689,100 | 19,736 | 13 |
| equipment-standard | 2,767,676 | 30,120 | 13 |

Totals: low 2.676 MB / 146,672 triangles; standard 9.418 MB / 248,604 triangles. Embedded source-image dimensions imply about 7.33 MiB low / 29.33 MiB standard RGBA8 storage including mipmaps, before environment/shadow allocations and possible sharing. These are estimates from image dimensions, not measured VRAM. Renderer geometry counters were 43 in both samples. Raw measurements and pre-optimization results are preserved in the review folder.

## Visual review and mandatory artifacts

[Comparison gallery](reviews/reference-upgrade/index.html) · [Reference-versus-render image](reviews/reference-upgrade/reference-versus-render.png)

1. [Full medical bay](reviews/reference-upgrade/standard-overview.png)
2. [Patient platform close-up](reviews/reference-upgrade/standard-close.png)
3. [Scanner close-up](reviews/reference-upgrade/scanner-detail.png)
4. [Equipment detail](reviews/reference-upgrade/equipment-detail.png)
5. [Reference comparison](reviews/reference-upgrade/reference-versus-render.png)
6. [Low-mode camera demonstration](reviews/reference-upgrade/camera-demonstration.webm)
7. [Real unrecorded measurements](reviews/reference-upgrade/performance.json)
8. Unresolved differences below

Still captures hide only the unchanged temporary review DOM controls to expose the actual WebGL room. Detail crops are actual browser frames. No geometry is replaced or composited with the reference. The camera framing differs from the reference, so this is an art comparison rather than a matched-lens reconstruction. The delivered low-mode recording is 9.76 seconds at 1280×800, verified to decode, seek at 2/5/8 seconds and play. It retained the renderer and recorded zero healthy page errors. A separate operational capture verified exactly three new benchmark GLB requests, proving the upgrade is used outside the review route.

A separately retained standard capture recording is slower and is not the smooth low-mode demonstration or the unrecorded FPS sample.

Rendered full view, platform, scanner, console, low tier and lighting detail were inspected. They show improved material/colour hierarchy and deeper equipment construction compared with the previous grey scene. They still show visibly simpler surfaces and mechanisms than the reference. The supplied image is not evidence of what this application renders.

## Executed checks

TypeScript: passed. ESLint: passed with zero warnings. Production build: passed, with the existing large Three/R3F chunk warning retained. Unit tests: **19 passed in seven files**. Browser regressions: **14 passed** with the new models integrated into the operational scene. Coverage includes camera reversal/interruption, cached resource identity, tier switching, equipment raycasting/standby, crew selection, URL compatibility, keyboard/deep links, responsive access, reduced motion, failed assets and WebGL context-loss recovery. No full accessibility certification, other GPU, real mobile device, Safari or Firefox test is claimed.

## Unresolved visual differences and required external art

- The reference has much denser, less regular panel construction, cut-outs, interlocks and mechanical layering. Our gantry and service panels remain visibly simpler.
- Cushion segmentation, realistic straps, stitching and biomechanical adjustment require a more detailed patient-platform model and ergonomic validation.
- Realistic clear reservoirs, optical glass depth and fluid/tube construction are not implemented; current opaque prop materials are explicitly approximations.
- The room lacks the reference's detailed wear/decal atlas, small manufacturing labels and varied surface history. There is limited material storytelling beyond the sourced deck and authored micro-surfaces.
- Indirect lighting/reflections and some contact/shadow edges remain approximate. Low mode has visible aliasing and less localized service-light illumination.
- Standard mode is too slow for comfortable use on UHD 620; 53.85 FPS low is an observation, not locked 60 FPS.

To close those gaps realistically, the next art investment would be an externally authored high-detail hard-surface medical platform/gantry with proper retopology and baked normals, a manufacturing trim/decal/wear atlas, a medical-prop set with credible containers/connectors, and a baked-lighting pass for the final fixed environment. These assets must carry verifiable redistribution rights; no unlicensed or paid substitutes were silently added. No specific purchasable medical model has been verified or budget approved in this task.

**Stop here for visual approval.** The environment is more detailed and coherent, but it is not represented as photoreal, AAA production-ready or equivalent to the reference. Do not proceed to navbar, modules or further scroll work until reviewed.
