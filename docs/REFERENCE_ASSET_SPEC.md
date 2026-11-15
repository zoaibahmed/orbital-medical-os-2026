# Reference-driven asset specification — before modelling

The attached image is an art-direction reference only. It will not be used in the renderer, as a room texture, background or projected photograph. Review copies belong only in documentation.

## Composition and proportions

The reference compresses the scene into a coherent, enclosed treatment bay: diagonal patient platform in front, a deep gantry behind, work consoles to one side, a framed aft hatch, and a dark ceiling service zone. The bed owns the composition. Its silhouette, machinery and restrained teal cushions establish scale. Our prior render's unbroken light walls, repetitive drawers and shallow gantry lose that hierarchy.

Target: keep actual independent GLBs and the existing two-pose camera; reduce visual repetition and place warm ceramic treatment equipment against graphite structure, with a dark patterned deck and warmer utility runs. No new navbar or chapter animation.

## Component specification

| Component | Mesh construction and visual goal | Materials / colour | Budget technique |
| --- | --- | --- | --- |
| Patient platform | Deeper contoured chassis, three visible mechanical layers, linked lift arms and pivot hubs, side service recesses, collar connectors, restraint straps/buckles, raised head support, rounded cushion crowns | Warm ceramic #d8d0bb, dark teal #28585b, black webbing, satin machined fittings; small ochre locking tabs | Custom profile meshes and curved grids; batch by material; map fine seams rather than tessellating all scratches |
| Scanner | Deep outer shell with six substantial service sectors, recessed inner ring, vented cowlings, optical sensor pods, exposed gear/drive features, side support feet, managed corrugated cable | Warm off-white housing, graphite apertures, titanium rails; narrow pale mint indicators | Angular sampling proportional to arc length; authored vent ribs, cavity bake; low omits tiny corrugations |
| Ceiling detector | Connected telescoping mount, two pivots, sculpted housing and paired optical apertures | Ceramic / brushed metal / dark glass | Static model; no new controller |
| Aft architecture | Framed hatch with chamfered layered pressure boundary, latches, seals, uneven technical inset arrangement; avoid identical drawer wallpaper | Muted warm composite and charcoal frames, ochre low-level caution details | Shared material batches, large bevel silhouettes, smaller details in texture/bake |
| Side services | One medical supply recess with independent bottles, one counter/storage zone, service panel seams, routed manifold, asymmetrical installation | Restrained amber glass, off-white housings, brushed couplings, copper/ochre service pipe | Opaque/tinted vial materials in low mode; no transmission ray tracing |
| Floor | Dark metal panels with dense purposeful traction pattern, anchor channels, access fasteners and grounded equipment | Dark worn steel with nonuniform roughness, exposed metal highlights | Licensed CC0 PBR maps and planar UVs; low-resolution maps, no geometric displacement |
| Console | Proper mobile chassis, recessed drawers, articulated screen arm, physical controls, detailed connection points; actual plotted screen geometry or small authored texture, explicitly simulated | Ceramic body, dark drawer inserts, warm task-light slot, restrained medical display colour | One static screen atlas/geometry, no duplicate live DOM/Canvas |
| Light | Broad overhead practicals, examination key, warm service strips, cool-neutral fill; readable equipment with recess depth | Neutral-white key, amber local practicals, subtle cool fill | One standard shadow caster; low uses baked cavity/contact detail; no bloom |

## Surface / colour plan

Approximately 50% warm-neutral medical/composite surfaces, 30% dark structure/deck, 15% muted teal upholstery and cool metal, 5% ochre/amber and controlled status light. These are art-direction goals, not measured pixel ratios. Avoid cyan flooding, uniform grey and uniformly polished shells. Use localized metal reflections, grain, roughness variation and restrained wear.

## Asset provenance plan and honest limits

Local Blender 4.5 and the existing exporter are available. Geometry will be authored independently with custom profiles and swept forms, not inferred from the photograph. Source suitable CC0 PBR surfaces and record original download metadata/license. No paid models. An exact match to the reference's dense bespoke equipment, high-resolution wear atlases, glazing and indirect lighting may still require a specialist hard-surface artist and a more extensive authored texture set; do not call low-detail substitutes equivalent. Domain validation of medical-device construction remains outside this art pass.

## Required review

Capture prior scene, new full view, patient platform, scanner, console detail, reference/render gallery and existing two-pose movement. Measure unrecorded low/standard samples separately from recording on Intel UHD 620. Record draw calls, triangles, model sizes, texture estimate, readiness, frame distribution and resource reuse. Inspect results and list unresolved differences before approval.
