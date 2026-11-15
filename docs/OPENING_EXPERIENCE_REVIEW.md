# Opening experience — visual approval review

14 November 2026 · Critical override implementation · Opening only

## Scope and review gate

The user authorized replacing the rejected UI presentation, with one working opening required before the remaining two chapters. The new `/` route is a live React/R3F scroll experience. It is not a static concept, a reskin of the module dashboard or an implementation of all three chapters. No subsequent story chapter has been built. Creative acceptance belongs to the user.

Existing operational `/bay/:stationId` and `/dashboard/:stationId` routes remain available so functionality is never removed during the design gate. They retain their previous presentation for now; their presence is functional continuity, not an endorsement or reimplementation of the rejected design. The root opening imports none of the rejected mission page, workspace layout or visual panel components. Native emergency behavior is preserved and restyled for the opening.

## New direction: Care, beyond Earth

A porcelain field (#eeeae2) and oxblood ink (#602b3a) establish a human medical identity rather than a cyan spacecraft dashboard. A new Antonio variable display face creates a tall, deliberately asymmetric title. Barlow supplies readable operational copy. An original offset medical emblem, compact wordmark, restrained text commands and a curved aperture form one coherent composition.

The authored bay is rendered live behind the aperture. Native document scroll opens that aperture across the viewport while the real Three camera changes its target and then approaches the cradle. Introductory typography recedes before equipment inspection takes priority. At arrival, short unboxed text and explicit mission/station actions resolve beside the equipment. The environment is never a static background image in the desktop experience.

There are no persistent metric cards, stacked module rails, horizontal tabs, glowing borders, multipass effects, decorative particle systems or fake medical scan results in this opening. UI reveals communicate arrival, crew context or a user's request to inspect the mission index.

## Substantive comparison with the rejected interface

Existing screenshots were not used as the new design's visual reference. The comparison below describes changes in the previous implementation's structure and behavior.

| Rejected interface structure | New opening implementation |
| --- | --- |
| Mission entry as a two-column website heading/schematic | Large asymmetric typographic composition with a live curved window into the authored bay |
| Standard page header, separately boxed controls | A compact, custom wordmark and sparse text commands sharing one top seam |
| Always-visible module rail and bottom camera toolbar | Medical destinations and rendering preferences live in an intentional, on-demand mission index |
| Scene presented with HUD boxes above/beside it | Scene composition itself changes across native scrolling, revealing the environment |
| Click-only preset navigation | Continuous reversible scroll-to-camera mapping, with the existing guided workspace controls retained separately |
| Cyan/blue repeated surfaces | Porcelain, oxblood and neutral scene tones; no glow-dependent identity |
| Module panel overlays dominate the view | Opening arrival uses unboxed copy; no clinical dashboard is built in this gate |
| Small desktop cockpit forced into narrow layout | Mobile starts with an original static scanner graphic and user-initiated optional 3D; full module access is immediate |

The new opening should be judged on actual screenshots and the recording, not on labels such as “premium.” This remains a creative review candidate.

## Working interaction details

- Native document scroll, no wheel interception, custom scroll engine or mandatory scroll snap. The opening spans 280svh desktop / 230svh narrow view with one sticky viewport. Those are travel distances within one opening, not three chapters.
- A shared progress ref and CSS properties update from one requestAnimationFrame-batched passive scroll listener; React does not rerender on each scroll tick.
- `ScrollCameraRig` is the sole camera owner in the opening. The existing `CameraRig` mounts instead in operational workspaces. They never compete in one Canvas.
- Camera begins at the established clear-aisle overview position with a deliberately offset target. The first 48% resolves the target toward the equipment; the remainder approaches the existing examination position. Cartesian motion remains in the established clear aisle. A short bounded damping response follows scroll input, then demand rendering settles.
- Camera movement is reversible. “Explore the medical bay” provides an alternative to wheel/trackpad scrolling. Keyboard PageDown/End and ordinary document navigation remain native. Hidden beat controls become inert and do not pollute the Tab order.
- Crew selection uses the existing fixture registry. Selection updates the URL; links carry the selected crew into the same medical data contracts and existing feature routes.
- The native dialog mission index provides all six clinical destinations plus overview, crew selection, reduced-motion preference and standard/low rendering tiers. Escape closes it and native focus returns to the initiating control.
- Emergency rehearsal remains available in the opening header, including during model loading/failure. Existing emergency semantics, draft protocol content and focus handling are preserved; its opening presentation uses the new identity. Modal opening pauses camera travel and locks document scrolling until close.
- OS/session reduced motion freezes the camera at overview and retains a still branded aperture instead of expanding it; interface translation is removed. The same content and destination actions remain accessible; no forced camera journey is required.
- Narrow screens do not mount the R3F scene by default. They show an original, labeled SVG schematic with optional 3D enablement. The dashboard link is always available. No medical module requires enabling WebGL.
- Asset failure shows a recovery surface and explicit retry, clearing only the failed tier's resource cache. Context loss also exposes retry. Loading/status layers no longer intercept recovery actions.

## Foundation boundaries preserved

The original Word brief also retains its audit SHA-256, B267B9EFFDA7250C61CC3D11FF1464C40C91BF99E488E11924CB7EB307E66F3B. No GLB was rebuilt or altered. The six Phase 3B model sizes/hashes still match their generated manifest. The Blender authoring script, asset pipeline, local Draco decoding, lighting/material infrastructure, standard/low model tiers, medical contracts, fixtures and backend boundaries are retained.

No new npm dependency, backend service, medical calculation, AI service, anatomy system or clinical feature module was added. A new local Antonio font is the only new third-party runtime art asset. It is sourced from the official [Google Fonts Antonio directory](https://github.com/google/fonts/tree/main/ofl/antonio); the bundled font is 74,104 bytes and its SIL OFL 1.1 file is retained at `public/assets/licenses/ANTONIO-OFL.txt`. Source URL, size and SHA-256 are appended to `public/assets/fonts/sources.json`. No runtime font CDN is required.

## Files and integration

- `src/features/opening/OpeningExperience.tsx`: new root presentation, scroll geometry, native mission index, crew/preferences, fallback and retry.
- `src/styles/opening.css`: independently scoped opening visual system, aperture, responsive compositions, focus and motion alternatives. Earlier styles remain for operational continuity outside `/`.
- `src/scene/navigation/scrollPath.ts` and `ScrollCameraRig.tsx`: pure path sampling and demand-rendered opening camera ownership.
- `MedicalBayCanvas.tsx`: optional scroll controller input, selecting either the new opening controller or the existing guided controller.
- `App.tsx` / `main.tsx`: root route replacement and opening style registration; no old application header/footer on `/`.
- `ErrorBoundary.tsx`: optional failure callback permits loading UI to yield to the actual recovery state; existing boundaries retain prior behavior.
- `src/test/openingPath.test.ts`, `e2e/opening.spec.ts`: meaningful continuity/clearance, scroll/reverse, crew/emergency, reduced motion, mobile and fault-recovery checks. Existing foundation entry selectors reflect the new heading/action; clinical regressions remain.
- `scripts/capture_opening.mjs`: production screenshots and actual browser video capture, with camera-pose/renderer/model evidence.
- ESLint tooling globals now cover documentation capture scripts as well as scripts/; a previously unused import in the isolated Phase 3C-A concept generator was removed. No lint rule was disabled.

## Review artifacts

All under `docs/reviews/opening-experience/`:

1. [Opening introduction](reviews/opening-experience/01-introduction.png)
2. [Scroll transition](reviews/opening-experience/02-scroll-transition.png)
3. [Examination arrival](reviews/opening-experience/03-arrival.png)
4. [Working mission index](reviews/opening-experience/04-mission-index.png)
5. [Mobile opening](reviews/opening-experience/05-mobile-introduction.png)
6. [Emergency rehearsal](reviews/opening-experience/06-emergency.png)
7. [Mobile 3D after user opt-in](reviews/opening-experience/07-mobile-3d-opt-in.png)
8. [Reduced-motion opening](reviews/opening-experience/08-reduced-motion.png)
9. [Actual scrolling recording](reviews/opening-experience/opening-scroll.webm)
10. [Capture and model evidence](reviews/opening-experience/verification.json)

Production capture uses a 1440×900 browser viewport, with recording output at 1280×800. The review gallery is [index.html](reviews/opening-experience/index.html). The final recording is 27.36 seconds (7,811,609 bytes). It shows forward wheel scrolling, real camera travel, reversal and working mission controls. Native End/Home finish the wheel journey at exact document boundaries to avoid fractional-pixel input rounding. Playback metadata and frames at 4s/10s were inspected in Chromium. It is a live browser recording, not a rendered animation or mockup sequence. Video encoding is not a frame-rate benchmark. The capture utility retains its original browser-generated file in raw-video/ in addition to the named review copy.

## Verification and limitations

Executed checks: TypeScript and production build passed; ESLint passed with zero allowed warnings; 13 unit tests passed in four files. The complete 12-test Chromium regression suite passed (1.1m), followed by a focused rerun of all three opening browser tests after the final responsive/reduced-motion changes (20.3s). Production capture recorded no healthy desktop page errors, no horizontal overflow at 320/390/768/1024/1440px, reversible camera poses, and matching SHA-256 values for all six GLBs. The final presentation-only ink/contrast adjustment was rebuilt and captured again. The capture completed successfully with the expected initial/examination poses and a verified reverse journey.

A deliberate missing-model test initially exposed a loading overlay intercepting the Retry button. The error boundary now reports failure to the opening state, which removes that loading layer; the targeted regression passed after correction. This was fixed in application behavior rather than bypassed with a forced test click.

The existing large lazy renderer bundle warning and upstream Three.Clock warning remain. This opening adds no postprocessing or continuous decorative animation, but the preserved standard environment is still substantial on an Intel UHD 620. This phase does not establish a new 60 FPS, sustained-load, VRAM or all-device performance claim. Prior Phase 3B timings are historical baseline evidence, not measurements of this new composition. Hardware-backed Chromium recording is distinguished from SwiftShader; exact launch arguments and renderer identity are in verification.json.

Real-phone Safari, Firefox, full assistive-technology certification, worst-case composited contrast and extended thermal/soak testing are not claimed. The opening has responsive/reduced-motion and keyboard/failure checks, but those do not constitute complete accessibility certification. The on-demand native mission index is functional; it is not a new medical dashboard. Operational workspaces remain reachable with their older presentation until an approved rollout is authorized.

## Approval request

Review the introduction, moving aperture/camera sequence, arrival composition and recording as one opening experience. Approve this direction or identify specific changes to its typography, composition, motion or interaction hierarchy. **Do not start the remaining chapters until the user grants visual approval.**
