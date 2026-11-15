# Medical Bay Vertical Slice Asset Manifest

## Current completion upgrade / 15 November 2026

The accepted room and medical demonstrations are preserved. An actual CC0 MakeHuman patient is now integrated: 42,610 triangles, 163 bones, five skinned meshes, measured supine fit, outward 3mm breathing morph, independent load/retry and crew-scoped examination/scan states. The final Blender audit reports zero bed intersections across all five patient meshes; released restraints are stowed at the port rail. Internal medical anatomy and final art/scientific approval remain external.

Targeted PBR/contact refinements, stationary HDR/depth caching, asynchronous patient preparation, synchronized scan timing and persisted permitted monitoring audio are implemented. Selected UHD 620 measurement: 27.38 FPS navigation, p95 49.0ms, max gap 254.1ms; 52.47 FPS monitoring; 9.33s environment readiness. Navigation remains below 45–60 FPS, cold loading varies, and a one-time prepared-patient trace still shows a 727ms task. No new screenshots/videos were generated.

Final verification passed: TypeScript/build, zero-warning ESLint, **37 unit/component tests in 14 files** and **31 browser integration tests**, with zero skips or flaky cases. The authoritative [FINAL_FRONTEND_DELIVERY_REPORT.md](FINAL_FRONTEND_DELIVERY_REPORT.md) contains exact evidence and limitations. Older gates/status summaries below are historical and do not revoke the latest authorized six-phase task.


## Delivered patient asset / current

- Runtime: `assets/models/patient/patient-examination.glb`; **4,892,812 bytes**, **42,610 triangles**, **163 bones**, five skinned meshes.
- SHA-256: `ee1f3f00a5a6fffb21e9a88d94aa9a11973b76e200135ef270ca0ff2c1328e8e`. Exact runtime metadata: `src/scene/assets/patient-manifest.json`.
- Authoring: `scripts/build_patient.py`; source `assets/source/patient/patient-examination.blend`; numeric audit `placement-audit.json` and `patient-metrics.json` in the same directory.
- Provenance: [MakeHuman core data](https://github.com/makehumancommunity/makehuman), [official CC0 system manifest](https://static.makehumancommunity.org/assets/assetpacks/makehuman_system_assets.html), [licensing](https://www.makehumancommunity.org/about/license.html). Core source hashes/URLs and selected asset-pack entry hashes are retained in `core-source-manifest.json` and `download-manifest.json`.
- Asset data: CC0; MakeHuman application code was not imported. Copyright credits in the supplied headers include MakeHuman contributors, Data Collection AB, Joel Palmius and Jonas Hauquier. Retained licence: `public/assets/licenses/MAKEHUMAN-PATIENT-CC0.md`.
- Used: base mesh/default rig/weights; high-poly eyes/brown map; young light-skinned male diffuse; casualsuit01 geometry/normal; short01 hair and eyebrow001 geometry/maps. Clothing diffuse/AO source files are retained for authoring but are not claimed as runtime maps; the runtime uniform uses a restrained teal material plus supplied normal detail.
- Runtime texture ceilings: 1024px skin/eye/hair/brow, 512px garment normal. Sparse chest morphs deform skin/uniform outward by at most 3mm. No EVA suit or internal organ mesh.
- Placement: 1.77385m lying length, head/pillow and all support regions checked against accepted high bed triangles; zero final bed surface intersections, including rear hair correction. Original flat strap parts are released/stowed in the instance without altering source GLBs.
- Status: delivered real rigged exterior patient; generic for both fictional crew, artistic/clinical review pending. Not a crew portrait, validated anatomy or certified photorealistic asset.

The accepted room remains 360,848 unique authored triangles across its high GLBs. Their hashes remain unchanged. Runtime material changes add one original shared 64px seamless weave normal, dielectric material corrections and tighter contact bias; the reference image is not used as a runtime room texture. Stationary HDR/depth cache content is generated from the actual live 3D room and invalidated on camera/scene changes; it is not a static image substitute for geometry.

## Historical completion snapshot — superseded

Verified: TypeScript/build, zero-warning ESLint, 33 unit/component tests and 25 browser tests passed. Final UHD 620: 27.52 FPS navigation / 427.7ms max active gap; 21.99 FPS monitoring; 10.92s readiness. Actual scanner geometry rendered for 135 frames with 66.7ms max interval, then resources returned to baseline. All high GLB hashes are unchanged.

All medical feature interfaces now contain working educational demonstrations, per-crew in-memory logs, draft SANS/emergency content and automatic permitted monitoring audio. Accepted room assets are unchanged. Realistic patient/anatomy assets, verified bed placement and visible breathing remain blocked; no crude character substitute was added. See [final report](FINAL_FRONTEND_COMPLETION_REPORT.md) and [38-item audit](REQUIREMENTS_TRACEABILITY.md). Older records below are historical.


## Master Prompt 1 runtime display integration

15 November 2026: all three accepted high GLBs retain their exact hashes; see `measurements/master-1/asset-integrity.json`. No source models/material maps were rebuilt. `LiveMedicalDisplay.tsx` adds a reusable original 512x288 runtime screen texture at the existing trolley monitor; it is not a new external asset or a replacement room image. The historical static screen ink is hidden only in that live-display instance. Optional sound is synthesized locally; no audio file or third-party licence was added. The measured UHD 620 runtime MSAA/submission tradeoff is documented in [Master Prompt 1 report](MASTER_IMPLEMENTATION_1_REPORT.md).

Older art-pass records below remain historical.

## Current public high assets — additional refinement

[High-only review, provenance and performance](HIGH_GRAPHICS_REFINEMENT_REVIEW.md). Public production uses only the standard identifiers below, representing the highest presentation. Lower records are internal diagnostic/history. Source: scripts/build_premium_bay.py plus recorded geometry corrections; assembled source: assets/source/high-refinement/medical-bay-high.blend. Original project geometry/maps, CC0 Poly Haven deck maps, OFL font glyphs; the exterior sphere uses NASA Earth Observatory Blue Marble data under NASA media guidelines, credited in the review and NASA_SOURCE.json. Reference is documentation only.

| Asset | Bytes | Triangles | Material batches |
| --- | ---: | ---: | ---: |
| shell-standard | 4,920,508 | 150,796 | 20 |
| examination-standard | 2,667,644 | 154,476 | 13 |
| equipment-standard | 2,901,504 | 55,576 | 16 |

Current exact hashes are in src/scene/assets/benchmark-manifest.json. Earlier tables describe preserved prior assets.


## Current reference-led assets — visual approval pending

[Review and provenance](REFERENCE_QUALITY_REVIEW.md). These six independently authored assets now serve both operational and review scenes. Source: scripts/build_reference_bay.py, with optimized traction topology; complete Blender source: assets/source/reference-upgrade/medical-bay.blend. Floor maps: Charlotte Baglioni / Poly Haven Metal Plate 03, CC0. Other geometry/maps: original project art. Font glyphs: Barlow Condensed, SIL OFL 1.1. Reference image is documentation only. Exact hashes are in src/scene/assets/benchmark-manifest.json and public/assets/models/benchmark/manifest.json.

| Asset | Bytes | Triangles | Batches |
| --- | ---: | ---: | ---: |
| shell-low | 1,254,744 | 75,092 | 16 |
| examination-low | 732,172 | 51,844 | 11 |
| shell-standard | 4,220,472 | 118,376 | 16 |
| examination-standard | 2,429,600 | 100,108 | 11 |
| equipment-low | 689,100 | 19,736 | 13 |
| equipment-standard | 2,767,676 | 30,120 | 13 |

Earlier tables below describe preserved historical assets. Current material response and UV scale are authored in the GLBs rather than forced to the old grey palette.


## Current environment benchmark — unapproved art

New original assets are isolated to /visual-benchmark; operational GLBs below are preserved. [Visual review](VISUAL_QUALITY_RESET.md) documents provenance, materials, actual captures and measured limitations. Authoring: scripts/build_visual_benchmark.py and assets/source/visual-benchmark.blend. Geometry/maps are original project work; inherited Barlow Condensed glyphs use SIL OFL 1.1. No purchased/downloaded models or maps. The machine-readable [benchmark manifest](../src/scene/assets/benchmark-manifest.json) contains exact hashes. Status: art review pending, not production-ready.

| Asset | Bytes | Authored triangles | Material batches |
| --- | ---: | ---: | ---: |
| assets/models/benchmark/shell-low.glb | 1042768 | 60420 | 9 |
| assets/models/benchmark/examination-low.glb | 763144 | 67688 | 9 |
| assets/models/benchmark/equipment-low.glb | 865232 | 17304 | 10 |
| assets/models/benchmark/shell-standard.glb | 1147772 | 98072 | 9 |
| assets/models/benchmark/examination-standard.glb | 943396 | 141532 | 9 |
| assets/models/benchmark/equipment-standard.glb | 879796 | 24856 | 10 |

All six export baked local vertex occlusion as COLOR_0, UVs and embedded PBR maps, with Draco compression. Low and standard retain the new custom chassis, curved cushions and segmented scanner geometry. Earlier source/quality statuses below are historical.


Updated 14 November 2026 for Phase 3B. Models and procedural surface maps remain original project art authored through `scripts/build_medical_bay.py` in Blender 4.5.15 LTS. Lettering now uses Barlow Condensed outlines under SIL OFL 1.1; the interface uses locally hosted OFL Barlow fonts. No third-party model, photographic texture or NASA insignia is included. This is an original plausible spacecraft concept, not an engineering replica or endorsed NASA product.

## Delivered models

| Asset | Purpose and refined detail | File | Bytes | Mesh triangles | Static material batches |
| --- | --- | --- | ---: | ---: | ---: |
| Standard pressure module | Varied cassettes, service cartridges, frame joint shoes, ceiling service spine, inset lights, hatch, vents, conduits, deck and storage labels | public/assets/models/shell-standard.glb | 702636 | 144848 | 10 |
| Standard examination station | Compact lift plinth, exposed pivots/crossmembers, actuator loom, scanner sensor cassettes, drive housings, safety rails and readable lettering | public/assets/models/examination-standard.glb | 366368 | 35928 | 11 |
| Standard diagnostic equipment | Protective display caps, drawers, articulated monitor, readable standby display, probe dock, smooth cable and utility ports | public/assets/models/equipment-standard.glb | 285920 | 18396 | 10 |
| Low pressure module | Same structural hierarchy with reduced bevel segments, fins and small fasteners | public/assets/models/shell-low.glb | 456588 | 59828 | 10 |
| Low examination station | Same silhouette/mechanisms, reduced curves and secondary details | public/assets/models/examination-low.glb | 307792 | 23532 | 10 |
| Low diagnostic equipment | Same functional equipment, reduced curves and ventilation detail | public/assets/models/equipment-low.glb | 275928 | 13020 | 10 |

Standard GLBs: **1,354,924 bytes / 199,172 mesh triangles**. Low GLBs: **1,040,308 bytes / 96,380 mesh triangles**. Runtime counts also include contact planes and, for standard, the shadow pass. Machine-readable hashes, sizes, source/usage and review status are in `src/scene/assets/generated-manifest.json` and `public/assets/models/manifest.json`. Registry cache versions use these hashes. All six file sizes and SHA-256 values were verified after export.

## Source, scale and optimization

Geometry uses meter units, Blender Z-up converted to glTF Y-up, bevels, weighted normals, UVs, custom deck profiles and curved scanner/hatch meshes. Repeated static details are merged by material before export rather than submitted as individual fastener/glyph draw calls. Cables now use smooth authored curves converted to meshes. Smaller lift supports expose assembly detail without changing the station layout or interaction anchors. Final close-up review corrected the trolley caster and bed-track contact heights to meet the deck.

All six GLBs use Draco compression and embedded original 128x128 normal/roughness PNG maps. The runtime sRGB material palette differentiates graphite paint, satin aluminium, coated pressure ribs, anodized deck, ceramic, upholstery and rubber. Fine texture tiling, shared materials/textures and independent highlight/indicator materials remain explicit. No KTX2 or Meshopt is used or claimed.

Preserved empty anchors are `anchor_display`, `anchor_vitals` and `anchor_diagnostics`. Models remain static batches without mechanical animation clips. The bounded standby check animates emission on an isolated scanner material; it does not move the scanner, simulate anatomy or perform a diagnosis.

## Contact grounding and lighting assets

`ContactGrounding.tsx` creates one original 128px analytical soft-contact mask shared by two floor planes at the fixed equipment positions. This is an art-directed contact approximation, not a ray-traced AO bake. Standard quality also uses one real PCF-shadow-casting key light. Low quality retains the contact patches while disabling dynamic shadows. There is no multipass SSAO, bloom, fog or particle layer.

Reflection lighting comes from Three.js RoomEnvironment/PMREM generated locally at runtime. No external HDR image is downloaded. The reflection render target and cloned materials/textures have cleanup paths; original GLB resources are shared in a bounded two-tier cache.

## Font sources and licenses

The old small voxel/stencil alphabet is replaced by converted Barlow Condensed glyph meshes, improving equipment labels without embedding a font binary inside the GLBs. The authoring font is `.tools/fonts/BarlowCondensed-Medium.ttf`, sourced from [Google Fonts Barlow Condensed](https://github.com/google/fonts/tree/main/ofl/barlowcondensed). Its [SIL OFL 1.1 license](https://github.com/google/fonts/blob/main/ofl/barlowcondensed/OFL.txt) is retained as `public/assets/licenses/BARLOW-CONDENSED-OFL.txt`.

The UI uses these locally served Latin WOFF2 files; no runtime font CDN is required:

| File under public/assets/fonts | Weight | Bytes |
| --- | ---: | ---: |
| barlow-400.woff2 | 400 | 22196 |
| barlow-500.woff2 | 500 | 22008 |
| barlow-600.woff2 | 600 | 22772 |
| barlow-condensed-500.woff2 | 500 | 21424 |

Supplied UI font files total **88,400 bytes**; browsers request only the faces needed. Exact download URLs are recorded in `public/assets/fonts/sources.json`. Barlow's license is retained as `public/assets/licenses/BARLOW-OFL.txt`. Font author credit: Copyright 2017 The Barlow Project Authors. Font licenses are supplied alongside the original project geometry/maps; no new third-party model or image source was introduced.

## Authoring tool and decoder provenance

- The existing portable Blender 4.5.15 LTS installation is reused. It was obtained from [Blender's official release directory](https://download.blender.org/release/Blender4.5/) and its ZIP checked against the official SHA-256 `52dd02fd74877fa08e74b67d7854cf32468a232c02aaa19b6844c91285574f8d`. Ignored `.tools/` is not deployed.
- Local Draco files remain from the installed Three 0.187.0 glTF decoder distribution: `draco_wasm_wrapper.js` is 58,456 disk bytes and `draco_decoder.wasm` is 192,420 disk bytes. The Apache 2.0 license is retained at `public/assets/licenses/DRACO-LICENSE.txt`. A shared decoder uses two workers and no CDN.
- Three.js RoomEnvironment remains part of the existing MIT-licensed Three dependency. No new npm dependency was installed for Phase 3B.

## Measured delivery and review status

Production-preview resource entries measured GLBs plus the actual local decoder requests at **1,559,092 encoded body bytes standard** and **1,244,476 low**, excluding application JavaScript and UI fonts. The wrapper was delivered as 11,748 encoded bytes in this server configuration; disk size and network encoding are distinct. HTTP transfer totals additionally include response overhead. Raw entries are in the Phase 3B report's per-measurement `assets` and `decoderAssets` arrays (the earlier fresh-page check is preserved in first-pass-measurements.json).

These assets remain **reviewable vertical-slice art pending user approval**. Phase 3B improves assembly detail, lettering, surface separation and grounding; it is not a claim of finished AAA art or engineering/medical validation. Bespoke high-resolution decals, true UV-baked local occlusion, richer equipment internals and independent mechanical articulation remain possible later refinements. No full holographic medical dashboards, patient anatomy, medical calculations or backend services were added.

## Critical-override opening font addition

The opening adds Antonio variable (100–700) from the official Google Fonts Antonio repository: public/assets/fonts/antonio-variable.ttf, 74,104 bytes. Copyright 2013 The Antonio Project Authors. SIL OFL 1.1 is retained in public/assets/licenses/ANTONIO-OFL.txt; source URL/hash are in public/assets/fonts/sources.json. No GLB, Blender source, texture or decoder was changed for the opening. The new identity and scroll scene are documented in OPENING_EXPERIENCE_REVIEW.md.
