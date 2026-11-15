# Orbital Medical Bay — UI/UX Creative Direction

Phase 3C-A · 14 November 2026 · Creative exploration awaiting approval

## Decision and scope

Recommend **Concept A: Cinematic Orbital Command**, with its amber operational perimeter, equipment-linked selection and delayed contextual detail. This is a proposal, not an approved redesign. No application code, model, camera controller, feature module, dependency or backend contract has been changed for this phase. The Phase 3B implementation remains available. Historical Phase 3B completion does not imply creative acceptance; the user has rejected that interface.

Open [the visual review](design/phase3c-a/index.html). All concepts have actual 1440×900 browser-rendered mockups, not just written direction. Recommended A also has mission arrival, focused equipment, vitals language, crew selection, emergency interruption and a 390px mobile list composition. These HTML files are static review artifacts, outside the application route tree. Links move between precomposed states; they do not operate real crew selection, scan medical data or demonstrate motion.

The background plates are fresh captures of the unchanged Phase 3B environment, with interface elements temporarily hidden in the capture browser. No new environment art or external imagery is used. See plate-provenance.json. Local licensed Barlow files are reused. Mockups use image plates, so their responsiveness and speed do not validate the live R3F scene or its projection anchors.

## Critical assessment of the rejected interface

Reviewed current Workspace, StationNavigation, SceneViewport, immersive.css, camera presets, master/progress/asset records and fresh production scene captures; the Phase 3B screenshots remain the before evidence.

| Problem | Why it weakens the experience | Directional correction |
| --- | --- | --- |
| Many independently bordered rectangular controls | Every control asks for equal attention; the scene reads as background behind a tool palette | One perimeter hierarchy, fewer persistent surfaces, plain named commands |
| Persistent left rail plus bottom camera toolbar plus right panel | Three navigation grammars compete; controls cross the cradle's lower silhouette | Separate module intent from equipment focus; reserve a clear central field |
| Native crew selector presented as a form | Crew identity feels like a website filter rather than an operating context | Named crew identity trigger with deliberate, keyboard-accessible chooser |
| Mission page headline and schematic in two columns | Typical landing-page arrival, without an operational threshold | Stage an arrival around the actual bay and one clear entry action |
| Generic panel treatment across unrelated modules | Content has little distinct visual identity or relation to equipment | Shared construction rules with module-specific visual instruments |
| “Environment ready”, quality and test controls prominent | Developer/diagnostic functions displace mission tasks | Readiness appears when useful; render/motion/reset controls move into preferences |
| Cyan outlines used across interactive and informational elements | Weak semantic discrimination and repetitive chrome | Amber for intentional action in A; neutral structure; distinct warning/error semantics |
| Fictional data and simulation disclosures fragmented | Users must infer whether a signal is live or illustrative | A compact persistent simulation identifier plus explicit local source/state labels |

The environment has useful visual anchors and consistent camera presets. Preserve those and the existing accessible list fallback, URL navigation, crew context and emergency focus behavior. The reset concerns composition, interaction hierarchy, typography and motion, not replacing the rendering foundation.

## Three distinct directions

### A — Cinematic Orbital Command (recommended)

![Concept A](design/phase3c-a/a-overview.png)

**Philosophy:** the user occupies a mission operator's position. Information lives at the perimeter; a named physical object is the entry into work. A warm operational accent reflects engineered equipment and breaks from generic cyan HUD styling.

**Composition:** compact mission seam at the top, crew at upper right, one lower perimeter command manifold, a restrained lower-left location signature and two equipment-linked labels. A large uninterrupted central region carries the examination bed. Emergency stays at the lower right. No permanent data card is open at overview.

**Navigation:** six named medical destinations share one hierarchy, with overview through the environment identity/return command. Object focus is a separate action. Selecting Vitals/Physical uses the existing examination preset; Diagnostics uses equipment; other modules retain overview. Module names remain discoverable without hover. Small viewport adaptation becomes a named “Medical modules” trigger before labels crowd; it does not shrink targets.

**Holographic style:** short anchored leaders, small selection brackets and an opaque inset instrument surface only on request. No universal glow, transparent paragraph blocks or faux targeting graphics across patient equipment.

**Motion:** intentional camera travel precedes a brief contextual reveal. UI emphasis follows selection, rather than all elements animating simultaneously. Neutral system responses remain quiet.

**Advantages:** clear action hierarchy, strongest connection to the existing camera/selection model, readable operational language, minimal central obstruction and little additional GPU cost. **Limitations:** the bottom manifold needs responsive collision testing; amber must never imply every action is a medical warning. Art direction relies on disciplined positioning, not merely changing colors.

### B — Advanced Holographic Medical Laboratory

![Concept B](design/phase3c-a/b-overview.png)

**Philosophy:** the equipment is an examination field surrounded by instruments. Violet and pale spectral ink identify analytical context rather than spacecraft controls.

**Composition:** asymmetric instrument readout at left, large elliptical examination-field annotation, six vertical module destinations at right and a central lower inspection action. This is an instrument-led composition, not A with another palette. The scene remains full bleed; faint curves are a spatial relation cue, not decoration or a claim that a scan is running.

**Navigation:** instrument categories on the right, field focus on the equipment and contextual tool explanations near the relevant field. No orbiting menu or hover-only radial selection.

**Holographic style:** thin partial arcs, a few calibration brackets and depth-separated labels. Primary copy always sits on a legible surface. The illustrated 72 bpm / 8 h data are explicitly static examples; there is no live signal source.

**Motion:** field geometry resolves after an explicit inspection request; a single bounded tracing sequence communicates “preview prepared”. No continuous scanning or looping physiological motion.

**Advantages:** strongest visual vocabulary for future medical visualization, meaningful spatial framing and more expressive instrument identity. **Limitations:** greater occlusion and visual complexity, risk of implying unsupported clinical instrumentation, more projection/collision work and weaker novice discoverability. Not recommended as the default overview; selected analytical details could be considered later with separate approval.

### C — Premium Minimal Spacecraft Operating System

![Concept C](design/phase3c-a/c-overview.png)

**Philosophy:** quiet physical operating controls, with almost all information deferred until requested. Ceramic, sea-glass and neutral text complement the existing equipment finishes.

**Composition:** a small centered mission seam, quiet crew identity, a pale rounded command dock at the foot, one object action and small availability text at right. The dock is a physical control surface, not a row of interchangeable data cards. No overview metrics.

**Navigation:** six icon-and-label commands in a single dock; selected mode is indicated by position, text and a shallow active inset. Details use a retractable inspector rather than floating multiwindow panels.

**Holographic style:** very little holography; clean annotation points and stable surfaces. The environment carries the atmosphere.

**Motion:** brief positional changes and precise crossfades, with camera motion carrying the main transition. UI waits rather than competes.

**Advantages:** maximum scene clarity, easy accessibility/performance discipline and comfortable repeated use. **Limitations:** less expressive arrival, the dock can resemble a consumer OS, and the experience may feel too understated for the requested creative reset.

## Recommended experience and navigation

A is recommended because it provides a recognizable original operating language while preserving the practical foundations. B is the most expressive but brings unsupported clinical associations into the overview; C is calm but its consumer-like dock weakens the mission-control character. Do not merge all three: approve A's hierarchy first, then evaluate any requested borrowing explicitly.

### Mission arrival

[Visual](design/phase3c-a/a-mission.html) · [PNG](design/phase3c-a/a-mission.png)

The bay is the focal image; a restrained aperture frames the examination area. Identity and compact mission/crew/mode information establish place. “Enter medical bay” is the single dominant action; list mode remains a quieter accessible option. This is an operating threshold, not marketing copy or a signup hero. Use a static existing-bay image for the eventual entry fallback; do not require a second WebGL context or block entry on a decorative animation. Essential initialization must report actual load progress; no invented subsystem checks or fake countdown.

### Overview

At 1440×900, scene imagery fills the viewport; reserve at least 80% of the canvas as unobstructed visual field in the closed-overview state, targeting 80–90% where feasible. Full-bleed area alone does not satisfy that criterion: measure the union of UI surface bounds, keep the bed/scanner silhouette clear and review actual camera projections. The mockups demonstrate composition; they do not provide a certified occlusion measurement. No primary desktop scroll.

Top seam: identity/overview, mission location, crew context. Bottom perimeter: named medical destinations, list-mode access, simulation disclosure, persistent emergency access. Preferences contain quality, motion and camera reset. Readiness appears during state changes, then recedes. Hover/focus hints name objects; click/Enter activates. The equipment marker is backed by a normal DOM command reachable without pointer raycasting.

### Equipment selection and module opening

[Selection visual](design/phase3c-a/a-selection.png) · [Vitals language](design/phase3c-a/a-module.png)

Select cradle → preserve crew and current URL → existing guided camera focuses examination → label selected equipment immediately → reveal contextual inspector after settling. Unrelated markers and normal informational readouts recede; medical navigation and emergency remain operable. Inspector width starts at 290px at 1440px, with a clear collapse/close command. Its edge must stay outside the focal equipment's safe region. Camera return and inspector close are distinct: close hides detail; “Return to bay overview” changes viewpoint. Browser Back restores the prior meaningful station/view state.

Opening crew vitals is a separate intentional command from equipment selection. Existing module destinations remain available without selecting 3D equipment. Do not silently switch crew or claim that selecting a scanner starts a medical examination.

### Crew context

[Visual](design/phase3c-a/a-crew.png). A named identity trigger opens a compact chooser; portrait is optional, initials are sufficient. Selection uses the existing crew registry, never hardcoded extra astronauts. The static study shows only Alex Morgan and does not pretend to switch data. Future implementation preserves module/view, invalidates the old crew's local display immediately and reveals the new context atomically. No stale numbers may remain under the newly selected name.

### Mobile and narrow view

[390px visual](design/phase3c-a/a-mobile.png). The default is a renderer-free medical list: identity, crew context, module destinations and persistent emergency action. It is intentionally a different hierarchy rather than a miniature desktop cockpit. Module details use full-width readable sections. At narrow tablet sizes use the list when the protected central field and 44px controls cannot coexist; use composition capability, not a device-brand assumption. Optional spatial exploration must be user initiated, offer low quality and retain a direct return to list view.

### Emergency interruption

[Visual](design/phase3c-a/a-emergency.png). An always named “Emergency rehearsal” command stays available through loading, camera transitions, module failures and renderer loss. The illustrated surface is static, not a functioning modal. Implementation must reuse the existing modal/focus behavior: pause nonessential motion, trap focus, explain simulation scope, Escape/close restores trigger and prior context. No flashing red takeover, fabricated emergency detection, automatic protocol execution or real alarm audio.

## Visual system specification (A)

### Tokens and palette

Use three layers: raw primitives → purpose aliases → component tokens. Example: `--amber-300:#e9bf77` → `--action-accent:var(--amber-300)` → `--equipment-marker-active:var(--action-accent)`. Preview CSS currently scopes concept palettes for review; production tokens would be extracted only after approval.

| Role | Value | Use |
| --- | --- | --- |
| Deep hull | #0c141b | Primary opaque backing / darkest operational field |
| Instrument surface | #101c25 | Contextual inspector and text backing |
| Structural slate | #657886 | Non-text separators and inactive outline structure |
| Primary ink | #e8edf0 | Body, essential controls and values |
| Secondary ink | #becbd2 | Secondary explanation, source and unit text |
| Operational amber | #e9bf77 | Intentional selection/action, dark text on filled actions |
| Available | #a8d1bd | Availability with named status and shape |
| Caution | #f3ce84 | Caution triangle + explicit reason; separate from action by icon/text/surface |
| Critical interruption | #ffb1a4 on #1c2229 | Rehearsal interruption label and edge; no inferred medical severity |
| Missing data | #becbd2 | “Unavailable” text + gap marker, never zero |

B palette: #101322 background, #171c31 surface, #f0efff primary, #c0bfd9 secondary, #c5b6ff field accent. C palette: #121c23 background, #e8ece9 physical surface, #233831 dark surface ink, #f2f4ef scene ink, #a9d4cb accent. These palettes are proposal tokens, not new app styles.

### Type, hierarchy and spacing

Reuse locally hosted Barlow 400/600 for controls, copy and data; Barlow Condensed 500 for location/equipment headings. Precision comes from consistent alignment, units and weight, not tiny all-caps or ubiquitous monospace. C deliberately uses regular Barlow headings; B emphasizes instrument numerals and smaller condensed titles. A entry title is 48px at 1440px as a location cue; it scales to 36px rather than dominating narrow views.

| Style | Size / line height | Weight / behavior |
| --- | --- | --- |
| Mission arrival | 48 / 52px desktop; 36 / 40px narrow | Condensed 500; short, no marketing paragraph |
| Workspace heading | 32–40 / 40–44px | Condensed 500; one clear heading |
| Equipment/module heading | 26 / 30px | Condensed 500 |
| Key value | 28–38 / 40px | Barlow 400, tabular numerals |
| Body | 16 / 24px | Barlow 400; 45–70 character lines |
| Navigation/control | 14–16 / 20px | Barlow 400/600; sentence case |
| Metadata/source | 12–14 / 18–21px | Barlow 400; no essential state only in microtype |

Spacing primitives: 4, 8, 12, 16, 24, 32, 48, 64px. Prototype perimeter is 36px (optical composition exception); production select 32px desktop, 20px mobile and document any optical adjustment. Minimum hit area 44×44px. Inspector interior 24–28px; headings align with body/value columns. Separate meaning with spacing before adding more borders.

### Construction, icons and state

Use opaque operational surfaces for long content, one edge/seam for hierarchy and restrained 2px corner cuts only where meaningful. Do not apply glass blur to every control. Scene-facing markers use an anchor point, short label and one clear action; they do not draw boxes around the whole model. Keep selection brackets separated from diagnostic warning marks.

Icons use an original 24px stroke grid, ~1.4px stroke, simple medical/instrument metaphors and visible text labels. The static study includes hand-authored SVG paths; refine ambiguous radiation/physical glyphs before production. Avoid fan-shaped radiation symbols that could be mistaken for a measured hazard. No icon-only critical actions.

Default: readable plain command. Hover: local ink/surface emphasis. Keyboard focus: 3px accent outline with offset; selected: explicit label and persistent underline/marker. Pressed: immediate response without scale bounce. Disabled: retain readable label and explain why; a disabled medical action must not imply failed clinical status. Pending: named work state; error: concrete recovery action. Color never carries state alone.

## Medical module language (planned, no functionality)

| Module | Visual instrument | Relation to bay and required semantics |
| --- | --- | --- |
| Crew vitals | Aligned value/unit rows; one bounded trace region, compact trend/range labels | Examination inspector; timestamp/source beside values. Future real waveforms require defined sampling/units; current traces remain explicitly illustrative |
| Radiation | Dose ledger and exposure timeline; cumulative vs interval values clearly separated | Overview-context inspection, no environmental hazard animation without real input. Unknown dose is unavailable, not safe/zero; no thresholds invented |
| Physical assessment | Joint/region schematic, bilateral comparison rows, selected-region legend | Examination focus; original 2D SVG initially, no full anatomy work. Indicate baseline/missing state, avoid unsupported body heatmaps |
| Wellbeing | Quiet check-in sequence, sleep/routine timeline and privacy/source explanation | Overview context; restrained motion and explicit self-report label. Do not infer emotion or psychiatric status from color |
| AI diagnostics | Evidence/review ledger, uncertainty and provenance rows, suggested next interface action | Diagnostic equipment inspector; label as concept/simulated. No fabricated confidence percentage, autonomous diagnosis or model integration |
| Emergency protocols | Numbered procedural sequence only where order matters; current step, next/back/exit | Highest interaction priority; rehearsal label always visible, preserve context and focus; no clinical protocol authorship in frontend scope |

Shared data styling: tabular values, unambiguous units, timestamp and source; separate measurement status from interpretation. Missing, pending, stale and error are distinct. Charts need named axes, units and textual/table equivalents. Never connect a visual scan animation to an invented medical result.

## Motion choreography proposal

All timings are proposed, not implemented or measured in these static studies. Avoid adding a motion dependency until the chosen interactions establish a real need. CSS handles DOM opacity/transform; the existing CameraRig owns all 3D camera changes. Completion events, not duplicate camera tweens, sequence HUD visibility.

| Trigger | Choreography | Reduced-motion / interruption |
| --- | --- | --- |
| Mission entry | Immediate pressed state; actual asset loading shown; existing ~1.1s camera path only if already supported, scene seam reveal 160ms after ready | Static arrival, direct view change and 0–80ms opacity; never wait for decorative motion |
| Equipment selection | Selection name responds immediately; guided camera ~1.1s; old details hide over 100ms; contextual instrument resolves over 180ms after settle | Cut to existing target, show context without travel; cancel stale selection on new intent |
| Module change | Highlight command immediately, preserve context; transition body 120–160ms only when correct module data is ready | Replace content directly; URL and screen-reader state remain reliable |
| Crew switch | Mark old data unavailable, change identity and corresponding snapshot atomically; 120ms content emphasis | No digit rolling or old-data crossfade; direct replacement |
| Context expansion | Origin at selected anchor, 180ms opacity/8px translation; close 120ms | No translation; focus stays predictable; mobile opens normal document section |
| Standby preview | One bounded 1.6s indicator sequence on explicit request, clearly visual-only | Static acknowledgment, reuse existing reduced-motion behavior |
| Future medical scan preview | Explicit start/stop; finite field sweep only to indicate visual preview state | Static progress/state; no automatic inference or fabricated completion result |
| Status change | Brief 120ms label change, announcement for meaningful state only | Static update; no perpetual blinking |
| Emergency | Open immediately; stop nonessential motion and set modal focus | Same immediate access; Escape/close restores state |

Do not animate pointer parallax, floating panels, continuously running traces, arbitrary letters or decorative rotation. In demand rendering, no idle animation may keep the WebGL loop alive. Emergency and new user intent must preempt any pending sequence. Prevent stale completion callbacks from revealing a panel for a previous selection.

## Accessibility and performance acceptance

- Preserve semantic links/buttons, skip navigation, module landmarks, meaningful headings and focus restoration. Provide equivalent DOM commands for all spatial targets. Never require drag, precision hover or a gesture to reach modules.
- Verify WCAG AA contrast targets (4.5:1 ordinary text, 3:1 large text/non-text controls where applicable) against actual composited backgrounds. The palette is a proposal, not a completed accessibility audit. Text over imagery needs a controlled backing; translucent previews require sampled worst-case review.
- Minimum 44px pointer targets; visible focus; no focus beneath a collapsed panel. Test 200% zoom/reflow, 320px width, forced colors, keyboard-only and screen-reader announcements. Do not visually hide useful content from assistive technology with canvas-only labels.
- Honor OS and existing session reduced-motion preference. No flashing, unsolicited sound or mandatory camera travel. Maintain renderer-unavailable recovery and renderer-free list access.
- Do not add shadows/postprocessing/3D widgets to deliver this UI. Reuse fonts and SVG, avoid fullscreen backdrop-filter and persistent WebGL animation. Update projected DOM anchor positions only while the camera moves or viewport changes; use a small bounded marker count, occlusion tests and collision rules before deployment.
- Existing Phase 3B final hardware evidence is approximately 27.86 FPS standard / 59.20 low on UHD 620 with explicit D3D11 flags; SwiftShader is severely limited. Static mockup screenshots do not improve or replace that evidence. Retest active navigation under the same protocol after any approved integration.
- Live scene resources, source models, two quality tiers and existing error recovery must remain unchanged during UI integration. Do not promise general 60 FPS, complete medical accessibility or production art approval.

## Approval-gated implementation plan

This is a future plan only. No stage below is authorized by creation of these mockups.

| Stage after creative approval | Deliverable / dependency | Acceptance and verification |
| --- | --- | --- |
| 1. Lock direction and composition | Approved A/B/C or explicit revision; approved overview, arrival and mobile hierarchy | Review actual 1440×900 images; agree typography/accent/scene-safe region; no mixed design by default |
| 2. Extract tokens and interface primitives | Semantic token layers, MissionSeam, CrewContextTrigger, ModuleCommands, EquipmentMarker, ContextInstrument, Preferences, ListWorkspace | Component state review with keyboard/focus/contrast; no data or backend changes |
| 3. Integrate overview and navigation | Existing App/Workspace/StationNavigation own routes; existing session owns crew/motion/emergency; scene remains mounted | All six module links, Back/reload, crew retention, direct links, Canvas identity; no desktop scroll; measured UI occlusion ≤20% in overview where feasible |
| 4. Add arrival and equipment choreography | Reuse CameraRig and presets, expose completion/cancellation signal if needed; DOM layer manages contextual visibility | Selection through pointer and keyboard; rapid-switch interruption; no duplicate camera owner; reduced-motion cut; emergency interrupts |
| 5. Integrate mobile and failure states | Practical list workspace, contextual expansion, loading/renderer-unavailable states | 320/390/768/1024/1440px plus 200% zoom; all destinations and emergency reachable; no horizontal overflow |
| 6. Review and acceptance | Before/after screenshots, contrast/focus report, same-backend performance comparison | TypeScript, lint, existing unit/browser regressions plus meaningful new interaction tests; production build; no unexpected render-loop activity; user creative review |

Clinical functionality, calculation engines, new modules, anatomy, backend services, databases and real AI remain outside this redesign plan. Existing contracts are integration boundaries, not opportunities to expand scope.

## Review inventory and verification limits

Review folder: `docs/design/phase3c-a/`.

- `index.html` / `index.png`: three-direction review surface.
- `a-overview`, `b-overview`, `c-overview`: each has HTML and actual PNG output at 1440×900.
- `a-mission`, `a-selection`, `a-module`, `a-crew`, `a-emergency`: recommended-direction state studies, HTML + PNG.
- `a-mobile`: 390×844 viewport with full-document capture, HTML + PNG.
- `bay-plate.png`, `examination-plate.png`: captured existing 3D backgrounds.
- `build-concepts.mjs`: reproducible isolated static markup/style authoring; `capture-plate.mjs` and `capture-concepts.mjs`: Playwright capture utilities. Run from repository root with installed tooling. The plate utilities require the existing production preview at port 5175; no package installation is needed.
- `verification.json`: actual browser version, per-page dimensions, loaded image/font observations and page errors from the static capture. No application regression suite or GPU benchmark is claimed for this documentation-only phase.

The PNGs are the authoritative composition review. Open the HTML locally to inspect links/state navigation; desktop concept pages target 1440×900, while the separate mobile page demonstrates the proposed narrow-screen hierarchy. They are not finished responsive production components. The mobile emergency command is shown in document flow for the full-page static composition; persistent positioning and collision behavior remain production acceptance work. Static emergency/crew pages intentionally do not implement modal focus trapping or state management. Those behaviors are specified for approved integration, not claimed as working here.

### Executed static review checks

Ten HTML compositions were captured in Chromium 159.0.8154.6. All reported loaded scene images/fonts and no horizontal overflow; desktop studies remained 1440×900 without document scrolling. The mobile study uses normal vertical flow. The capture recorded zero page errors. Local href/src references resolve for all ten pages. Six opaque palette text pairs were calculated at contrast ratios from 9.38:1 to 14.83:1; see palette-check.json. This does not validate text composited over scene imagery or certify the complete interface. Screenshots were inspected and title wrapping/mobile control collisions corrected before final capture. No application regression suite was rerun because this phase only creates isolated design-review files.

## Decisions requiring creative approval

1. Approve Concept A as the base, choose B/C, or request a concrete composition revision.
2. Approve A's amber operational accent and restrained equipment-marker language.
3. Confirm the entry uses the actual bay as the arrival image rather than a separate cinematic asset.
4. Confirm mobile defaults to list view, with spatial exploration optional.
5. Confirm contextual details stay closed in overview and open only on explicit equipment/module intent.

**Stop after Phase 3C-A. No chosen direction has been integrated into the application.**
