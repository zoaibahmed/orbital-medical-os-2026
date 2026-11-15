# Team Frontend Integration Handoff

Snapshot: 14 November 2026, Asia/Karachi. Project: `D:\nasa-hackathon`.

## 1. Status and integration boundary

The project is undergoing a **major scroll-driven 3D UI redesign**. Only the new root opening is implemented for visual approval. Remaining chapters are not implemented. Existing operational bay/dashboard routes retain their earlier presentation for functional continuity; neither that layout nor the opening is a finalized medical dashboard design system.

Build medical components against the existing typed data contracts and reusable presentation boundaries. Do not depend on current panel dimensions, global CSS, screen coordinates, opening scroll geometry or the rejected visual layout. Medical calculations, clinical thresholds, radiation risk algorithms, real-time telemetry transport, backend services, databases and real AI must remain separate workstreams. No dashboard implementation or application modification was performed to create this handoff.

Start with `src/domain/contracts.ts`, `src/data/fixtures.ts`, `src/app/Workspace.tsx`, your feature View, `src/scene/SceneViewport.tsx` and `src/scene/MedicalBayCanvas.tsx`. Current source takes precedence over historical planning documents. Appendix A reproduces every current src file in full; the ZIP also provides each original file individually with its exact bytes.

## 2. Complete actual package.json

This is a React/Vite SPA, not Next.js. TypeScript is strict; browser routing uses React Router. Tailwind v4 is integrated through Vite, alongside ordinary CSS. There is no direct dependency for a global state store, chart library, medical engine or AI service.

The entire actual manifest follows, including engines, overrides, scripts, dependencies and devDependencies. Versions are filesystem values, not inferred upstream versions.

### `package.json`

SHA-256: `58614a96a3fcf103006a51df99bda42f5a5094e05ed3674a1eb7f4e25e5203cb`. Complete original file.

```json
{
  "name": "orbital-medical-bay",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "engines": { "node": ">=24.15.0", "npm": ">=11" },
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "npm run typecheck && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --max-warnings 0",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "npm run build && playwright test"
  },
  "overrides": {
    "minimatch": "11.0.8"
  },
  "dependencies": {
    "@react-three/drei": "10.7.9",
    "@react-three/fiber": "9.8.2",
    "react": "19.3.1",
    "react-dom": "19.3.1",
    "react-router-dom": "7.18.5",
    "three": "0.187.0"
  },
  "devDependencies": {
    "@eslint/js": "10.0.1",
    "@playwright/test": "1.65.1",
    "@tailwindcss/vite": "4.3.5",
    "@testing-library/jest-dom": "7.0.1",
    "@testing-library/react": "16.3.3",
    "@testing-library/user-event": "14.6.10",
    "@types/node": "24.19.2",
    "@types/react": "19.3.0",
    "@types/react-dom": "19.3.0",
    "@types/three": "0.187.0",
    "@vitejs/plugin-react": "6.3.0",
    "eslint": "10.15.0",
    "eslint-plugin-react-hooks": "7.1.1",
    "eslint-plugin-react-refresh": "0.5.7",
    "globals": "17.14.0",
    "jsdom": "27.4.0",
    "tailwindcss": "4.3.5",
    "typescript": "6.0.3",
    "typescript-eslint": "8.72.2",
    "vite": "8.3.8",
    "vitest": "4.1.12"
  }
}
```



### Setup for the recipient (instructions, not commands executed by this handoff)

1. Extract the archive into a separate folder. Do not overwrite unrelated work or merge entire directories blindly.
2. Use Node `>=24.15.0` and npm `>=11`, as declared in the manifest. Run `npm ci` against the included package-lock.json. Registry access is required; node_modules is intentionally excluded. No environment variables/API keys are required for this fixture-based frontend.
3. Run `npm run dev` and use Vite's reported port. Example routes: `/`, `/dashboard/vitals?crew=crew-02`, `/bay/vitals?crew=crew-01&quality=low`.
4. Validate future changes with `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and `npm run test:e2e`. Browser tests require the matching Playwright Chromium installation. The Windows test configuration explicitly requests a D3D11 hardware path unless `BAY_RENDERER=software`; GPU/browser behavior may differ elsewhere.
5. Runtime assets are included, so Blender is not required to run the frontend. The included `scripts/build_medical_bay.py` is authoring reference: regeneration requires Blender and `.tools/fonts/BarlowCondensed-Medium.ttf`, neither bundled here. Do not run model authoring as part of medical dashboard work; it overwrites generated assets.

## 3. Complete current src directory tree

This tree is generated from the actual directory. The generated asset manifest is deliberately included: runtime source imports it, so it is not a disposable cache. No dependency directories, build output or generated caches are included.

```text
src/
|-- animation/
|   `-- useMediaQuery.ts
|-- app/
|   |-- App.tsx
|   |-- navigation.ts
|   |-- StationNavigation.tsx
|   `-- Workspace.tsx
|-- data/
|   `-- fixtures.ts
|-- domain/
|   |-- contracts.ts
|   `-- format.ts
|-- features/
|   |-- diagnostics/
|   |   `-- DiagnosticsView.tsx
|   |-- emergency/
|   |   |-- EmergencyDialog.tsx
|   |   `-- EmergencyView.tsx
|   |-- mission/
|   |   |-- MissionView.tsx
|   |   `-- OverviewView.tsx
|   |-- opening/
|   |   `-- OpeningExperience.tsx
|   |-- physical/
|   |   `-- PhysicalView.tsx
|   |-- radiation/
|   |   `-- RadiationView.tsx
|   |-- vitals/
|   |   `-- VitalsView.tsx
|   `-- wellbeing/
|       `-- WellbeingView.tsx
|-- scene/
|   |-- assets/
|   |   |-- generated-manifest.json
|   |   |-- loadModel.ts
|   |   `-- registry.ts
|   |-- environment/
|   |   |-- ContactGrounding.tsx
|   |   |-- LightingRig.tsx
|   |   |-- materials.ts
|   |   |-- MedicalBayEnvironment.tsx
|   |   `-- ScenePlaceholder.tsx
|   |-- interaction/
|   |   `-- stationRegistry.ts
|   |-- navigation/
|   |   |-- CameraRig.tsx
|   |   |-- presets.ts
|   |   |-- ScrollCameraRig.tsx
|   |   `-- scrollPath.ts
|   |-- quality/
|   |   |-- config.ts
|   |   |-- metrics.ts
|   |   `-- SceneTelemetry.tsx
|   |-- detectWebGL.ts
|   |-- MedicalBayCanvas.tsx
|   `-- SceneViewport.tsx
|-- state/
|   |-- session.ts
|   `-- SessionProvider.tsx
|-- styles/
|   |-- immersive.css
|   |-- index.css
|   |-- opening.css
|   `-- tokens.css
|-- test/
|   |-- cameraPaths.test.ts
|   |-- foundation.test.tsx
|   |-- metrics.test.ts
|   |-- openingPath.test.ts
|   `-- setup.ts
|-- ui/
|   |-- holographic/
|   |   `-- HolographicPanel.tsx
|   |-- ErrorBoundary.tsx
|   |-- LoadingState.tsx
|   `-- ModulePlaceholder.tsx
`-- main.tsx
```

53 source files; all are included in the archive and Appendix A.

## 4. Canvas, camera and navigation ownership

```text
main.tsx: one createRoot, StrictMode, outer ErrorBoundary
  App -> BrowserRouter -> AppRoutes -> one SessionProvider
    / -> OpeningExperience
      lazy MedicalBayCanvas (desktop / user-enabled mobile)
        one Canvas -> ScrollCameraRig
                     MedicalBayEnvironment + ContactGrounding
                     LightingRig + lifecycle + SceneTelemetry
    /:mode/:stationId -> Workspace
      mode=bay -> SceneViewport -> lazy MedicalBayCanvas
        one Canvas -> CameraRig (guided controls)
                     same environment/rendering infrastructure
      mode=dashboard -> no SceneViewport and no R3F Canvas
      lazy selected feature View(snapshot) -> React DOM presentation
    one shared EmergencyDialog, independent of the renderer
```

**R3F Canvas definition:** `src/scene/MedicalBayCanvas.tsx` is the only current src file defining an R3F `<Canvas>`. SceneViewport and OpeningExperience are alternative route-level hosts, not two scenes to mount together. Route changes between opening and operational workspace can unmount/remount the scene; the app does not have one immortal Canvas across every route. Ordinary operational module navigation normally retains the scene host. Opening quality/retry keys can intentionally remount it.

MedicalBayCanvas chooses **one** camera owner: a supplied scrollProgress ref mounts ScrollCameraRig; otherwise CameraRig mounts. Do not add a Canvas, OrbitControls, CameraControls or camera-position effect to a medical component. A 2D chart canvas is different from an R3F Canvas, but still needs an accessible textual/table equivalent and careful performance treatment.

| Existing file | Actual responsibility |
| --- | --- |
| `src/scene/MedicalBayCanvas.tsx` | Renderer settings, quality tier, lifecycle, camera-owner switch, authored scene mounting |
| `src/scene/SceneViewport.tsx` | Operational DOM scene host; query-driven view/quality, readiness, retry/context loss, standby action and fallback |
| `src/scene/environment/MedicalBayEnvironment.tsx` | Three GLBs per tier, instance/material cloning, hover/click, bounded indicator pulse, local anchor registration, onLoaded |
| `src/scene/environment/LightingRig.tsx` | Quality-aware lighting/reflection environment |
| `src/scene/environment/materials.ts` | Existing material construction and cleanup; cached model resources must not be mutated by dashboards |
| `src/scene/environment/ContactGrounding.tsx` | Analytical contact-mask planes, not a true AO bake |
| `src/scene/navigation/CameraRig.tsx` | Guided preset movement using Drei CameraControls, reduced-motion cuts, explicit diagnostic benchmark path |
| `src/scene/navigation/ScrollCameraRig.tsx` | Native-scroll camera ownership for opening; modal pause and fixed reduced-motion overview |
| `src/scene/navigation/scrollPath.ts` | Pure opening path sampling inside established clear aisle |
| `src/scene/navigation/presets.ts` | CameraView union, labels and view positions/targets; also exports station-to-preset mapping |
| `src/scene/interaction/stationRegistry.ts` | Local register/get/cleanup structure; not a global event bus or shared selected-station store |
| `src/scene/assets/registry.ts`, `loadModel.ts` | Manifest URLs, bounded two-tier GLTF promise cache, local Draco decoding with two workers and failed-tier retry |
| `src/scene/quality/` | Renderer settings and diagnostics, **not medical telemetry** |
| `src/features/opening/OpeningExperience.tsx` | Root story/scroll DOM, index/crew/preferences, local scene hosting/recovery |
| `src/app/Workspace.tsx`, `StationNavigation.tsx`, `navigation.ts` | Module validation/composition, selected snapshot, routes and functional navigation |

`features/mission/MissionView.tsx` and `scene/environment/ScenePlaceholder.tsx` still exist but are not mounted by current App/Canvas code. Do not integrate against those historical placeholders as if they were the active entry points. Actual full source for all files above is in Appendix A.

### Exact scene-to-DOM communication

1. ModelInstance handles R3F hover/click. Hover changes local material state; a filtered examination/trolley click invokes `onSelect(kind)` with CameraView `examination` or `equipment`.
2. SceneViewport's onSelect writes only the URL `view` query while preserving other parameters. **It does not select a clinical module or change crew.** A Vitals module may remain open while the camera views equipment.
3. OpeningExperience instead passes scrollToBay as onSelect. Clicking equipment scrolls to the opening's end; its view prop remains overview. It does not open a medical dashboard from the model click.
4. CanvasLifecycle.onReady reports lifecycle/Canvas readiness, not completion of GLB loading. MedicalBayEnvironment.onLoaded is separate. Operational readiness requires ready plus the loaded quality tier; the opening has its own loaded/failure state.
5. Context loss calls onContextLost so the host can expose DOM recovery without removing medical access. Failed-tier retry clears the rejected asset promise explicitly rather than retrying during render.
6. The scene registers vitals/diagnostics anchors locally with cleanup. The DOM panels are **not automatically projected onto GLB anchors**. There is no completed world-space holographic medical dashboard or global station event bus.
7. Canvas data-* attributes are diagnostic/test observations. Do not scrape them for clinical state or treat them as a medical integration API.

Medical components render DOM from props. If they need camera focus, coordinate a semantic intent with the host (currently its URL view state), rather than importing the camera or Three objects. Projected overlays belong to the scene integration owner. Medical calculations must never be moved into useFrame.

## 5. Medical feature boundaries and exact placement

| Route ID | Existing adapter | Actual current content/input |
| --- | --- | --- |
| overview | `src/features/mission/OverviewView.tsx` | Overview placeholder; Workspace supplies snapshot but View does not consume it |
| vitals | `src/features/vitals/VitalsView.tsx` | ModuleProps snapshot; heart rate, missing HRV and sleep duration |
| radiation | `src/features/radiation/RadiationView.tsx` | Snapshot dose rate/cumulative dose; no radiation risk calculation |
| physical | `src/features/physical/PhysicalView.tsx` | Snapshot assessment; missing bone-density value and unimplemented questionnaire notice |
| wellbeing | `src/features/wellbeing/WellbeingView.tsx` | Snapshot wellbeing; no response collection/storage |
| diagnostics | `src/features/diagnostics/DiagnosticsView.tsx` | Scripted diagnostic summary; no AI service |
| emergency | `src/features/emergency/EmergencyView.tsx` | Global session trigger; currently consumes no snapshot in its signature |

These are foundations/placeholders, not completed medical dashboard products.

### Recommended future folders (not already implemented)

| Teammate deliverable | Place component here when implementation is authorized |
| --- | --- |
| Vitals display and feature-local charts | `src/features/vitals/components/VitalsDashboard.tsx` |
| Radiation display | `src/features/radiation/components/RadiationDashboard.tsx` |
| Physical assessment display | `src/features/physical/components/PhysicalAssessmentDashboard.tsx` |
| Wellbeing display | `src/features/wellbeing/components/WellbeingDashboard.tsx` |
| Supplied diagnostics/evidence display | `src/features/diagnostics/components/DiagnosticsDashboard.tsx` |
| Protocol content display | `src/features/emergency/components/ProtocolContentView.tsx` — no second global modal |
| Shared medical DOM primitives | Proposed `src/ui/medical/` for measurement rows, units, quality/source labels and accessible charts/tables |

The proposed components/medical folders above are recommendations; they do not exist in this snapshot. Preserve each existing `*View.tsx` default export as the lazy-loaded adapter. Workspace already calls that adapter with `{ snapshot: CrewSnapshot }`. After approval, compose the new medical presentation inside that View and pass the appropriate typed slices. No new route, app shell or Canvas is required. A combined dashboard should compose the same components under one selected snapshot/host.

Current ModuleProps is exported by `src/ui/ModulePlaceholder.tsx` as `{ snapshot: CrewSnapshot }`. That signature is useful; its rejected placeholder appearance is not a requirement. Import domain types directly in presentation components: BiometricMeasurements, RadiationMeasurements, PhysicalAssessment, PsychologicalWellbeing, DiagnosticMessage, ProtocolContent or typed CrewSnapshot slices. Treat snapshot input as immutable even though the contract is not deeply readonly.

Keep data acquisition and routing in the host adapter. Leaf components should not look up their own fixture, create a second crew store, install providers or infer severity. Local UI state such as expanded detail is appropriate; reset crew-specific local state on crewId changes. Time-series/history arrays are not present in CrewSnapshot: coordinate an explicit contract instead of inventing data or pretending point samples are a live waveform.

## 6. Existing medical contracts and fictional telemetry

`src/domain/contracts.ts` defines CrewId, ISODateTime, DataSource, DataQuality, Severity, AstronautProfile, CrewSelection, Measurement<Unit>, BiometricMeasurements, RadiationMeasurements, SleepRecord, PhysicalAssessment, PsychologicalWellbeing, DiagnosticMessage, ProtocolContent, EmergencyStatus and CrewSnapshot. Full original interfaces appear in Appendix A.

- CrewSnapshot schemaVersion is **1**; it contains crewId, scenarioId, capturedAt, source and biometrics/radiation/sleep/physical/wellbeing/diagnostic slices. It represents a snapshot, not a stream/history store.
- Measurement includes nullable numeric value, typed unit, measuredAt, quality, severity and source. Quality is valid/missing/stale/invalid; supplied severity is nominal/attention/critical/unknown. A display must not calculate severity or turn unknown into safe/nominal.
- DataSource permits simulated-fixture/external; DiagnosticMessage.kind permits scripted-demo/supplied-result. Those future boundary values do not imply a connected service.
- Radiation environment currently accepts only GCR-demo/SPE-demo/unavailable. Real instrument adaptation may require an agreed extension; do not force arbitrary payloads into those literals.
- ProtocolContent carries reviewStatus and simulationOnly. EmergencyStatus exists as a contract, but is not the actual session store and does not mean an acknowledgment workflow exists.
- No runtime schema validator, medical API client, WebSocket feed, persistence, clinical engine or real AI is wired to these Views. External input validation/adaptation belongs before the presentation boundary.

`src/data/fixtures.ts` contains two fictional crew members: crew-01 Alex Morgan (Aster, mission commander) and crew-02 Sam Rivera (Vega, flight engineer). getFixtureSnapshot is a static lookup; unknown IDs return undefined. capturedAt is fixed at `2026-11-14T06:00:00Z`; scenario is foundation-demo. Heart rates are 72/81 bpm respectively; most other examples are shared fixed values or missing data. Severity is **unknown** even for valid fixture samples. No random updating, inference, live transport or storage occurs.

`src/domain/format.ts` returns Unavailable for null/missing/invalid, preserves a valid numeric zero and appends Stale to stale values. Never coerce absent values to zero. Preserve units, source and timestamp disclosures. This helper is display formatting, not clinical assessment or complete validation of non-finite external numbers; a future external adapter must validate incoming data separately.

## 7. Crew, shared React state and routing

| State | Actual owner | Integration rule |
| --- | --- | --- |
| Selected crew | URL crew query in Workspace/opening | Existing selector updates the URL. Do not duplicate it in Context/Redux/Zustand |
| Clinical module | stationId path segment | Keep existing station IDs and View adapters |
| Operational camera view | URL view, validated by SceneViewport | overview/examination/equipment intent; no camera mutation in medical components |
| Operational quality | URL quality with validated standard/low and responsive default | Preserve it when updating unrelated query values |
| Operational panel | URL panel=open/closed and module-dependent defaults | Presentation detail under redesign, not a stable medical prop |
| Emergency visibility / motion preference | One SessionProvider/useSession | Reuse setters; OS reduced motion is combined by scene hosts |
| Snapshot | Workspace derives it via selected crew fixture lookup | Pass down atomically; no second stale copy under a new crew name |
| Opening progress | Local ref in OpeningExperience | Scene/presentation detail, not global medical state |
| Opening index, mobile enable, quality/recovery | Local OpeningExperience state | Not global session or shared operational quality |
| GLTF resources | Bounded two-tier cache in loadModel | Do not duplicate loaders or dispose shared assets in dashboard leaves |

SessionState contains only emergencyOpen/setEmergencyOpen and motionReduced/setMotionReduced. It contains no selected crew, snapshot, camera ref, module, patient history or clinical result. App/AppRoutes creates one BrowserRouter/SessionProvider; modules must not nest replacements.

App mounts `/` as OpeningExperience, `/:mode/:stationId` as Workspace and a wildcard recovery page. Workspace validates mode against bay/dashboard, station against its registry and crew against fixtures. Invalid combinations render recovery. Opening behavior differs: unknown crew falls back to the first crew.

There are seven station IDs: overview plus vitals, radiation, physical, wellbeing, diagnostics and emergency. stationPath encodes crew into the URL; it does not automatically preserve view/quality/panel. StationNavigation explicitly retains valid quality and selected crew, while view/panel reset to destination defaults. When changing only crew/view, copy previous URLSearchParams as the existing code does instead of dropping the rest of the query.

SceneViewport defaults vitals/physical to examination, diagnostics to equipment and other modules to overview. A valid explicit view overrides this. On widths <=767px, quality defaults to low unless explicit standard is requested; otherwise it defaults to standard. Opening has separate local quality initially standard, and narrow-screen 3D is opt-in. Do not assume `/dashboard` alone is a valid destination; a station segment is required.

## 8. Existing holographic UI and accessibility

`src/ui/holographic/HolographicPanel.tsx` is a simple **DOM section wrapper** with a CSS class and aria-labelledby=station-title. It is not a shader, Drei Html component, projected world-space panel, charting library or completed design system. ModulePlaceholder supplies a heading, fixture area and scope disclosure. Shared ErrorBoundary/LoadingState are available. The global emergency surface is a native HTML dialog with labels and Escape handling, independent of WebGL.

Old tokens/index/immersive styles and the new opening.css coexist during redesign. Do not build reusable medical components around those global layout selectors, and do not encode medical facts in CSS tokens. Prefer isolated feature styling and coordinate future semantic tokens with the UI integrator.

HolographicPanel/ModulePlaceholder currently use the fixed heading ID station-title. Composing multiple instances creates duplicate IDs and labeling problems. Future multi-panel presentation must assign unique heading IDs or let the composition own headings. This is an integration recommendation, not a code modification in this handoff.

Keep all modules useful without WebGL, animation or colour: explicit labels/units, non-colour quality states, source/timestamps, keyboard focus, reduced motion and accessible chart/table equivalents. Preserve native global emergency ownership, focus/Escape behavior and draft/simulation notices. Current capabilities do not imply complete composited-contrast or screen-reader certification.

## 9. Recommended team workflow and integration risks

1. Develop reusable feature presentation in the proposed feature-local components folder, with typed data/controlled props and semantic callbacks. Keep each existing View default export as its adapter seam.
2. Verify both fictional crew examples, missing/stale/invalid/unknown states, atomic crew switching and valid zero. Do not synthesize clinical history, thresholds, scores, diagnoses or a live label.
3. Coordinate changes to domain contracts, App/Workspace/navigation, scene ownership and global tokens with the frontend integrator. Do not merge an alternate whole package.json or add chart/motion dependencies without agreement.
4. Keep the renderer independent. No per-feature Canvas, duplicated provider/store, camera owner or clinical data processing in useFrame. Existing rendering normally uses demand mode; decorative perpetual animations must not keep WebGL alive. Benchmark mode is diagnostic only.
5. Preserve all six medical destinations and emergency access without WebGL. Feature failure must not block unrelated modules or renderer-free access. Browser Back/reload and URL crew context must remain reliable.
6. Integrate into scroll chapters only after visual approval. Medical presentation work can proceed against stable types without coupling to the current pinned viewport, aperture, rejected dashboard layout or unapproved future chapter positions.

Specific risks: duplicate Canvas/controller ownership; competing URL/global crew state; stale data under a changed name; treating the local station registry as an event bus; confusing render metrics with medical telemetry; global CSS leakage; duplicate heading IDs; unsupported time-series/threshold assumptions; omission of local decoder/models when sharing; and unbounded render-loop activity.

The preserved standard renderer can be slow on modest integrated graphics and software rendering. Historical performance/test records in the included progress report are not fresh measurements for this handoff. No application suite or benchmark was rerun merely to package documentation. Medical calculations, live telemetry transport/adapters and backend integration must remain separate from presentational components.

## 10. Archive contents, exclusions and integrity

`docs/TEAM_FRONTEND_HANDOFF.zip` preserves project-relative paths. It includes all src files, the four existing e2e files, package.json/package-lock.json, root build/test/lint configs, index.html, README and .gitignore. It also includes existing scripts for asset-pipeline/capture reference, all public runtime GLBs/manifests/fonts/local Draco files/licenses, this handoff and selected architecture/status/asset/creative review documents.

Runtime GLBs/decoders/fonts are required assets, not unnecessary build artifacts. Their presence allows the extracted source to render after normal dependency installation. Screenshot/video artifacts referenced by historical review docs are intentionally not bundled; consult the original repository for those large visuals. Blender tool caches and authoring font are not included; the pipeline reference is not a self-contained Blender installation.

An archive-only `HANDOFF_CONTENTS.json` lists path, size and SHA-256 for each included file, excluding the inventory itself to avoid recursive hashing. Source/config/asset bytes are compared against ZIP entries; CRC and forbidden-path checks run, and existing selected file hashes are checked before/after packaging. A positive selection list excludes node_modules, dist, .tools, .git, .env files (including examples), credentials/private-key files, screenshots/videos, caches, browser reports, the Word brief and unrelated local data. Selected text is checked for common credential signatures before packaging; this bounded check is not exhaustive secret-audit certification.

Only the requested Markdown and ZIP are produced. Existing application code/assets/configs remain unchanged. The Appendix embeds original source directly; raw ZIP files preserve exact bytes, including original line endings.

## Appendix A — complete original src source

MedicalBayCanvas and SceneViewport appear first, followed by the camera, mounting, navigation and data integration files, then all other current src files. Nothing in these listings is rewritten, abbreviated or simplified. Complete package.json is already included above. The ZIP contains each source at its original path.

### `src/scene/MedicalBayCanvas.tsx`

SHA-256: `7a031869eb70f714616b766e4e10b5a4639ea818a4af984e2fdbf0f4fab27eb5`. Complete original file.

```tsx
import { Suspense, useEffect, type RefObject } from 'react'
import { ScrollCameraRig } from './navigation/ScrollCameraRig'
import { Canvas, useThree } from '@react-three/fiber'
import { CameraRig } from './navigation/CameraRig'
import { MedicalBayEnvironment } from './environment/MedicalBayEnvironment'
import { LightingRig } from './environment/LightingRig'
import { ContactGrounding } from './environment/ContactGrounding'
import { SceneTelemetry } from './quality/SceneTelemetry'
import { ACESFilmicToneMapping, PCFShadowMap, SRGBColorSpace } from 'three'
import { viewPresets, type CameraView } from './navigation/presets'
import { qualitySettings, type QualityTier } from './quality/config'

interface Props {
  view: CameraView
  onSelect: (view: CameraView) => void
  onLoaded: () => void
  benchmark: boolean
  standbyRun: number
  reducedMotion: boolean
  quality: QualityTier
  resetToken: number
  onReady: () => void
  onContextLost: () => void
  scrollProgress?: RefObject<number>
  scrollPaused?: boolean
}

function CanvasLifecycle({ onReady, onContextLost }: Pick<Props, 'onReady' | 'onContextLost'>) {
  const canvas = useThree(state => state.gl.domElement)
  useEffect(() => {
    const handleLost = (event: Event) => { event.preventDefault(); onContextLost() }
    canvas.addEventListener('webglcontextlost', handleLost)
    onReady()
    return () => canvas.removeEventListener('webglcontextlost', handleLost)
  }, [canvas, onReady, onContextLost])
  return null
}

export default function MedicalBayCanvas({ view, onSelect, onLoaded, benchmark, standbyRun, reducedMotion, quality, resetToken, onReady, onContextLost, scrollProgress, scrollPaused = false }: Props) {
  const settings = qualitySettings[quality]
  return <Canvas camera={{ position: viewPresets.overview.position, fov: 55, near: 0.08, far: 35 }} dpr={settings.dpr} shadows={settings.shadows ? { type: PCFShadowMap } : false} gl={{ antialias: settings.antialias, toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.05, outputColorSpace: SRGBColorSpace, powerPreference: quality === 'low' ? 'low-power' : 'high-performance' }} frameloop={benchmark ? 'always' : 'demand'} fallback={<p>3D renderer unavailable. Station panels remain accessible.</p>}>
    <color attach="background" args={['#18212a']} />
    <LightingRig quality={quality} />
    <CanvasLifecycle onReady={onReady} onContextLost={onContextLost} />
    {scrollProgress ? <ScrollCameraRig progress={scrollProgress} reducedMotion={reducedMotion} paused={scrollPaused} /> : <CameraRig view={view} reducedMotion={reducedMotion} resetToken={resetToken} benchmark={benchmark} />}
    <Suspense fallback={null}><MedicalBayEnvironment quality={quality} view={view} onSelect={onSelect} onLoaded={onLoaded} reducedMotion={reducedMotion} standbyRun={standbyRun} /><ContactGrounding /></Suspense>
    <SceneTelemetry quality={quality} benchmark={benchmark} />
  </Canvas>
}
```

### `src/scene/SceneViewport.tsx`

SHA-256: `4b170a805d691fe2d6325b62e7b50e168e74176ab336feba801f29ffa3d66df1`. Complete original file.

```tsx
import { lazy, Suspense, useCallback, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { stationPath, type StationId } from '../app/navigation'
import { useMediaQuery } from '../animation/useMediaQuery'
import { useSession } from '../state/session'
import { ErrorBoundary } from '../ui/ErrorBoundary'
import { LoadingState } from '../ui/LoadingState'
import { detectWebGL } from './detectWebGL'
import { isCameraView, views, type CameraView } from './navigation/presets'
import type { QualityTier } from './quality/config'

const MedicalBayCanvas = lazy(() => import('./MedicalBayCanvas'))

export function SceneViewport({ station, crewId }: { station: StationId; crewId: string }) {
  const [supported, setSupported] = useState(detectWebGL)
  const [attempt, setAttempt] = useState(0)
  const [ready, setReady] = useState(false)
  const [loadedQuality, setLoadedQuality] = useState<QualityTier | null>(null)
  const [lost, setLost] = useState(false)
  const [resetToken, setResetToken] = useState(0)
  const [standbyRun, setStandbyRun] = useState(0)
  const [search, setSearch] = useSearchParams()
  const systemReduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const smallScreen = useMediaQuery('(max-width: 767px)')
  const { motionReduced } = useSession()
  const requestedView = search.get('view')
  const view: CameraView = isCameraView(requestedView) ? requestedView : station === 'vitals' || station === 'physical' ? 'examination' : station === 'diagnostics' ? 'equipment' : 'overview'
  const quality: QualityTier = search.get('quality') === 'low' || (search.get('quality') !== 'standard' && smallScreen) ? 'low' : 'standard'
  const onReady = useCallback(() => setReady(true), [])
  const onLoaded = useCallback(() => setLoadedQuality(quality), [quality])
  const onContextLost = useCallback(() => { setLost(true); setReady(false); setLoadedQuality(null) }, [])
  const onSelect = useCallback((next: CameraView) => {
    setSearch(previous => { const params = new URLSearchParams(previous); params.set('view', next); return params })
  }, [setSearch])
  async function retry() {
    if (supported) {
      const { retryEnvironmentResource } = await import('./assets/loadModel')
      retryEnvironmentResource(quality)
    }
    setReady(false)
    setLoadedQuality(null)
    setLost(false)
    setSupported(detectWebGL())
    setAttempt(value => value + 1)
  }
  const loaded = ready && loadedQuality === quality
  const recovery = <div className="scene-recovery" role="status"><h2>3D view unavailable</h2><p>{lost ? 'The graphics context was lost.' : supported ? 'The renderer or a required environment asset could not be loaded.' : 'WebGL 2 could not be initialized.'} All station interfaces remain available.</p><div className="action-row"><button className="button" onClick={retry}>Retry 3D view</button><Link className="button button-secondary" to={stationPath('dashboard', station, crewId)}>Use dashboard mode</Link></div></div>
  return <section className="scene-viewport" aria-label="Medical bay environment viewport">
    <ErrorBoundary key={attempt} fallback={recovery}>
      {supported && !lost ? <>
        <div className="canvas-layer" aria-hidden="true" data-testid="scene-host"><Suspense fallback={<LoadingState label="Loading 3D renderer…" />}><MedicalBayCanvas view={view} onSelect={onSelect} onLoaded={onLoaded} reducedMotion={systemReduced || motionReduced} quality={quality} resetToken={resetToken} onReady={onReady} onContextLost={onContextLost} benchmark={search.get('benchmark') === '1' && loaded} standbyRun={standbyRun} /></Suspense></div>
        {!loaded && <div className="environment-loading" role="status">Loading authored medical bay assets…</div>}
        <div className="environment-id" aria-hidden="true"><span>Orbital / Medical</span><strong>Examination bay 01</strong><small>{view === 'overview' ? 'Pressure module · Interior overview' : view === 'examination' ? 'Examination cradle · Selected' : 'Diagnostic trolley · Selected'}</small></div>
        <div className="viewport-status"><span role="status" data-testid="environment-status" data-state={loaded ? 'ready' : 'loading'}>{loaded ? 'Environment ready' : 'Preparing environment…'}</span><button onClick={() => { onSelect('overview'); setResetToken(value => value + 1) }}>Reset camera</button></div>
      </> : recovery}
    </ErrorBoundary>
    {supported && !lost && <div className="scene-tools">
      <div className="camera-views" role="group" aria-label="Camera views">{views.map(item => <button key={item.id} aria-pressed={view === item.id} onClick={() => onSelect(item.id)}>{item.label}</button>)}</div>
      <label className="quality-select">Render quality<select value={quality} onChange={event => setSearch(previous => { const params = new URLSearchParams(previous); params.set('quality', event.target.value); return params })}><option value="standard">Standard</option><option value="low">Low</option></select></label>
      <button className="standby-check" disabled={!loaded} onClick={() => setStandbyRun(value => value + 1)}>Check standby indicator</button>
      <p className="standby-status" role="status">{standbyRun > 0 ? 'Scanner light check · Visual simulation only' : 'Select the cradle or diagnostic trolley to inspect'}</p>
    </div>}
  </section>
}
```

### `src/scene/navigation/CameraRig.tsx`

SHA-256: `c1c1cd30bcda8e0b18b76c436a3d6b9b872f80eef218ccabdf5cf00ad25a79dc`. Complete original file.

```tsx
import { CameraControls } from '@react-three/drei/core/CameraControls'
import { useEffect, useRef } from 'react'
import { Vector3 } from 'three'
import { viewPresets, type CameraView } from './presets'
import { useFrame, useThree } from '@react-three/fiber'

export function CameraRig({ view, reducedMotion, resetToken, benchmark = false }: { view: CameraView; reducedMotion: boolean; resetToken: number; benchmark?: boolean }) {
  const controls = useRef<CameraControls>(null)
  const { camera, gl } = useThree()
  const moving = useRef(false)
  const target = useRef(new Vector3())
  const position = useRef(new Vector3())
  const goalPosition = useRef(new Vector3())
  const goalTarget = useRef(new Vector3())
  const startPosition = useRef(new Vector3())
  const startTarget = useRef(new Vector3())
  const startedAt = useRef(0)
  const benchmarkStart = useRef(0)
  const benchmarkRestored = useRef(false)
  useEffect(() => { benchmarkStart.current = performance.now(); benchmarkRestored.current = false }, [benchmark])
  useEffect(() => {
    const controller = controls.current
    if (!controller) return
    controller.stop()
    controller.getPosition(position.current)
    controller.getTarget(target.current)
    startPosition.current.copy(position.current)
    startTarget.current.copy(target.current)
    startedAt.current = performance.now()
    goalPosition.current.set(...viewPresets[view].position)
    goalTarget.current.set(...viewPresets[view].target)
    moving.current = !reducedMotion
    gl.domElement.dataset.cameraTransition = reducedMotion ? 'settled' : 'moving'
    if (reducedMotion) {
      void controller.setLookAt(...viewPresets[view].position, ...viewPresets[view].target, false)
      controller.update(0)
      gl.domElement.dataset.cameraPose = JSON.stringify({ view, position: camera.position.toArray() })
    }
    return () => { moving.current = false; controller.stop() }
  }, [view, reducedMotion, resetToken, camera, gl, benchmark])
  // Interpolate Cartesian positions/targets through a verified clear convex aisle,
  // rather than camera-controls' spherical orbit path through the medical station.
  useFrame(state => {
    if (benchmark && !reducedMotion && controls.current) {
      if (gl.domElement.dataset.benchmarkStatus === 'complete') {
        if (!benchmarkRestored.current) {
          void controls.current.setLookAt(...viewPresets[view].position, ...viewPresets[view].target, false)
          controls.current.update(0)
          gl.domElement.dataset.cameraTransition = 'settled'
          gl.domElement.dataset.cameraPose = JSON.stringify({ view, position: camera.position.toArray() })
          benchmarkRestored.current = true
        }
        return
      }
      const cycle = ((performance.now() - benchmarkStart.current) % 6000) / 2000
      const segment = Math.floor(cycle)
      const fraction = cycle - segment
      const eased = fraction * fraction * (3 - 2 * fraction)
      const route = [viewPresets.overview, viewPresets.examination, viewPresets.equipment, viewPresets.overview]
      const from = route[segment]!
      const to = route[segment + 1]!
      startPosition.current.set(...from.position)
      goalPosition.current.set(...to.position)
      startTarget.current.set(...from.target)
      goalTarget.current.set(...to.target)
      position.current.lerpVectors(startPosition.current, goalPosition.current, eased)
      target.current.lerpVectors(startTarget.current, goalTarget.current, eased)
      const p = position.current
      const t = target.current
      void controls.current.setLookAt(p.x, p.y, p.z, t.x, t.y, t.z, false)
      controls.current.update(0)
      return
    }
    if (!moving.current || !controls.current) return
    const progress = Math.min((performance.now() - startedAt.current) / 1100, 1)
    const alpha = progress * progress * (3 - 2 * progress)
    position.current.lerpVectors(startPosition.current, goalPosition.current, alpha)
    target.current.lerpVectors(startTarget.current, goalTarget.current, alpha)
    const p = position.current
    const t = target.current
    void controls.current.setLookAt(p.x, p.y, p.z, t.x, t.y, t.z, false)
    if (progress === 1) {
      moving.current = false
      controls.current.update(0)
      state.gl.domElement.dataset.cameraTransition = 'settled'
      state.gl.domElement.dataset.cameraPose = JSON.stringify({ view, position: state.camera.position.toArray() })
    }
    else state.invalidate()
  })
  return <CameraControls ref={controls} makeDefault enabled={false} />
}
```

### `src/scene/navigation/ScrollCameraRig.tsx`

SHA-256: `8335f6a0a376cae0d1ecab1f43f55d44bb6b036254e9fd737dee990834561baf`. Complete original file.

```tsx
import { useEffect, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { openingPose } from './scrollPath'
import { viewPresets } from './presets'

/** Sole camera owner in the opening. Existing workspace CameraRig remains intact. */
export function ScrollCameraRig({ progress, reducedMotion, paused }: { progress: RefObject<number>; reducedMotion: boolean; paused: boolean }) {
  const { invalidate } = useThree()
  const current = useRef(0)
  const initialized = useRef(false)
  useEffect(() => {
    const update = () => invalidate()
    window.addEventListener('scroll', update, { passive: true })
    invalidate()
    return () => window.removeEventListener('scroll', update)
  }, [invalidate, reducedMotion, paused])
  useFrame(({ camera, gl }, delta) => {
    if (paused && initialized.current) return
    const wanted = reducedMotion ? .48 : progress.current
    current.current = !initialized.current || reducedMotion ? wanted : current.current + (wanted - current.current) * (1 - Math.exp(-Math.min(delta, .05) * 14))
    const settling = Math.abs(wanted - current.current) > .0001
    if (!settling) current.current = wanted
    const pose = reducedMotion ? viewPresets.overview : openingPose(current.current)
    camera.position.set(...pose.position)
    camera.lookAt(...pose.target)
    gl.domElement.dataset.openingPose = JSON.stringify({ progress: current.current, position: camera.position.toArray(), target: pose.target, reducedMotion })
    initialized.current = true
    if (settling) invalidate()
  })
  return null
}
```

### `src/scene/navigation/scrollPath.ts`

SHA-256: `34373c9151d295a232fe7d08bbaa9b201d4c2e26ca340c6ce65d15827bed2ac3`. Complete original file.

```ts
import { viewPresets } from './presets'

export function openingPose(progress: number) {
  const p = Math.max(0, Math.min(1, progress))
  const from = p < .48 ? { position: viewPresets.overview.position, target: [-2.15, 1.5, -1.2] } : viewPresets.overview
  const to = p < .48 ? viewPresets.overview : viewPresets.examination
  const fraction = p < .48 ? p / .48 : (p - .48) / .52
  const t = fraction * fraction * (3 - 2 * fraction)
  const interpolate = (a: number[], b: number[]): [number, number, number] => [0, 1, 2].map(i => a[i]! + (b[i]! - a[i]!) * t) as [number, number, number]
  return { position: interpolate(from.position, to.position), target: interpolate(from.target, to.target) }
}
```

### `src/scene/navigation/presets.ts`

SHA-256: `200447f14b350abaebdd7868c563ca9885553895699cd5c66d6e73f61c6d8b6e`. Complete original file.

```ts
import type { StationId } from '../../app/navigation'

export interface CameraPreset {
  position: [number, number, number]
  target: [number, number, number]
}

export type CameraView = 'overview' | 'examination' | 'equipment'
export const views: ReadonlyArray<{ id: CameraView; label: string }> = [
  { id: 'overview', label: 'Bay overview' },
  { id: 'examination', label: 'Examination station' },
  { id: 'equipment', label: 'Equipment detail' },
]

export function isCameraView(value: string | null): value is CameraView {
  return value === 'overview' || value === 'examination' || value === 'equipment'
}

/** All camera positions and interpolated paths remain in the clear right-side aisle.
 * Guided views intentionally disable unconstrained orbit/pan through solid equipment.
 */
export const viewPresets: Record<CameraView, CameraPreset> = {
  overview: { position: [3.3, 2.65, 4.1], target: [-.5, 1.55, -1.0] },
  examination: { position: [2.25, 2.05, 2.35], target: [-.4, 1.1, -.25] },
  equipment: { position: [2.65, 1.98, .65], target: [2.15, 1.4, -2.2] },
}

export const cameraPresets: Record<StationId, CameraPreset> = {
  overview: viewPresets.overview,
  vitals: viewPresets.examination,
  radiation: viewPresets.overview,
  physical: viewPresets.examination,
  wellbeing: viewPresets.overview,
  diagnostics: viewPresets.equipment,
  emergency: viewPresets.overview,
}
```

### `src/scene/environment/MedicalBayEnvironment.tsx`

SHA-256: `1ac5be72ed8539f05eab3bbbfb6d8c19145eaea4fad1326368b9e2baac67fbc6`. Complete original file.

```tsx
import { use, useEffect, useMemo, useRef, useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { useFrame, useThree } from '@react-three/fiber'
import { Mesh, MeshStandardMaterial } from 'three'
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { getEnvironmentResource } from '../assets/loadModel'
import type { QualityTier } from '../quality/config'
import type { CameraView } from '../navigation/presets'
import { createStationRegistry } from '../interaction/stationRegistry'
import { createBayMaterials, disposeBayMaterials } from './materials'

function ModelInstance({ model, materials, kind, selected, onSelect, reducedMotion, standbyRun }: { model: GLTF; materials: Map<string, MeshStandardMaterial>; kind: CameraView; selected: boolean; onSelect: (view: CameraView) => void; reducedMotion: boolean; standbyRun: number }) {
  const [hovered, setHovered] = useState(false)
  const canvas = useThree(state => state.gl.domElement)
  const invalidate = useThree(state => state.invalidate)
  const pulse = useRef({ active: false, started: 0 })
  const { scene, highlightMaterials, indicatorMaterials } = useMemo(() => {
    const scene = model.scene.clone(true)
    const highlightMaterials: MeshStandardMaterial[] = []
    const indicatorMaterials: MeshStandardMaterial[] = []
    scene.traverse(object => {
      if (!(object instanceof Mesh)) return
      object.receiveShadow = true
      object.castShadow = kind !== 'overview'
      if (object.material instanceof MeshStandardMaterial) object.material = materials.get(object.material.name) ?? object.material
      if (kind !== 'overview' && object.material instanceof MeshStandardMaterial && object.material.name === 'Ceramic medical shell') {
        object.material = object.material.clone()
        highlightMaterials.push(object.material)
      }
      if (kind === 'examination' && object.material instanceof MeshStandardMaterial && object.material.name === 'Scanner sensing indicator') {
        object.material = object.material.clone()
        indicatorMaterials.push(object.material)
      }
    })
    return { scene, highlightMaterials, indicatorMaterials }
  }, [model, kind, materials])
  useEffect(() => {
    highlightMaterials.forEach(material => { material.emissive.set('#63dceb'); material.emissiveIntensity = hovered ? .12 : selected ? .045 : 0 })
    invalidate()
  }, [hovered, selected, highlightMaterials, invalidate])
  useEffect(() => {
    if (!hovered) return
    canvas.style.cursor = 'pointer'
    return () => { canvas.style.cursor = '' }
  }, [canvas, hovered])
  useEffect(() => () => { highlightMaterials.forEach(material => material.dispose()); indicatorMaterials.forEach(material => material.dispose()) }, [highlightMaterials, indicatorMaterials])
  useEffect(() => {
    if (kind !== 'examination') return
    pulse.current = { active: standbyRun > 0 && !reducedMotion, started: performance.now() }
    indicatorMaterials.forEach(material => { material.emissiveIntensity = .65 })
    canvas.dataset.scannerAnimation = standbyRun === 0 ? 'idle' : reducedMotion ? 'static' : 'running'
    invalidate()
  }, [standbyRun, reducedMotion, kind, indicatorMaterials, canvas, invalidate])
  useFrame(state => {
    if (!pulse.current.active) return
    const progress = Math.min((performance.now() - pulse.current.started) / 1600, 1)
    indicatorMaterials.forEach(material => { material.emissiveIntensity = .65 + Math.sin(progress * Math.PI) * .45 })
    if (progress === 1) { pulse.current.active = false; canvas.dataset.scannerAnimation = 'complete' }
    state.invalidate()
  })
  const interactive = kind !== 'overview'
  function pick(event: ThreeEvent<MouseEvent>) {
    if (!interactive || event.delta > 5) return
    event.stopPropagation()
    onSelect(kind)
  }
  return <group name={`interactive-${kind}`} onClick={pick} onPointerOver={event => { if (interactive) { event.stopPropagation(); setHovered(true) } }} onPointerOut={() => setHovered(false)}>
    <primitive object={scene} dispose={null} />
  </group>
}

export function MedicalBayEnvironment({ quality, view, onSelect, onLoaded, reducedMotion, standbyRun }: { quality: QualityTier; view: CameraView; onSelect: (view: CameraView) => void; onLoaded: () => void; reducedMotion: boolean; standbyRun: number }) {
  const models = use(getEnvironmentResource(quality))
  const materials = useMemo(() => createBayMaterials(models), [models])
  useEffect(() => () => disposeBayMaterials(materials), [materials])
  const registry = useMemo(() => createStationRegistry(), [])
  useEffect(() => {
    const unregisterBed = registry.register({ stationId: 'vitals', nodeName: 'anchor_vitals', label: 'Examination station', anchor: [-.4, 1.7, -.2] })
    const unregisterEquipment = registry.register({ stationId: 'diagnostics', nodeName: 'anchor_diagnostics', label: 'Diagnostic trolley', anchor: [2.1, 2.35, -2.2] })
    onLoaded()
    return () => { unregisterBed(); unregisterEquipment() }
  }, [onLoaded, registry])
  const kinds: CameraView[] = ['overview', 'examination', 'equipment']
  return <group name="medical-bay-vertical-slice">{models.map((model, index) => <ModelInstance key={kinds[index]} model={model} materials={materials} kind={kinds[index]!} selected={view === kinds[index]} onSelect={onSelect} reducedMotion={reducedMotion} standbyRun={standbyRun} />)}</group>
}
```

### `src/scene/interaction/stationRegistry.ts`

SHA-256: `6af5acca4989cb10cf1583d882b4106af7f1566008b8739872117a016ec50de7`. Complete original file.

```ts
import type { StationId } from '../../app/navigation'

export interface StationInteraction {
  stationId: StationId
  nodeName: string
  label: string
  anchor: readonly [number, number, number]
}

/** Future station components register named GLB anchors and dispose on unmount. */
export function createStationRegistry() {
  const entries = new Map<StationId, StationInteraction>()
  return {
    register(entry: StationInteraction) {
      if (entries.has(entry.stationId)) throw new Error(`Station already registered: ${entry.stationId}`)
      entries.set(entry.stationId, entry)
      return () => { if (entries.get(entry.stationId) === entry) entries.delete(entry.stationId) }
    },
    get(id: StationId) { return entries.get(id) },
  }
}
```

### `src/app/App.tsx`

SHA-256: `d631dbc8d25fbd234bc5c3b3f9ba5b68bc823288d0f49af6e3234157792264fa`. Complete original file.

```tsx
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { SessionProvider } from '../state/SessionProvider'
import { OpeningExperience } from '../features/opening/OpeningExperience'
import { EmergencyDialog } from '../features/emergency/EmergencyDialog'
import { Workspace } from './Workspace'

export function AppRoutes() {
  const pathname = useLocation().pathname
  const immersive = pathname.startsWith('/bay/')
  const opening = pathname === '/'
  return <SessionProvider>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <div className={opening ? 'opening-app' : `app-shell${immersive ? ' bay-shell' : ''}`}>
      {!opening && <header className="app-header"><Link className="brand" to="/" aria-label="Orbital medical bay mission initialization"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="12" stroke="currentColor" /><path d="M16 9v14M9 16h14M3 5l26 22" stroke="currentColor" /></svg><span>Orbital<span className="brand-detail">Medical operations</span></span></Link><span className="simulation-badge">Simulation · Vertical slice</span></header>}
      <Routes><Route path="/" element={<OpeningExperience />} /><Route path="/:mode/:stationId" element={<Workspace />} /><Route path="*" element={<main id="main-content" className="recovery"><h1>Location not found</h1><Link className="button" to="/">Return to mission initialization</Link></main>} /></Routes>
      {!opening && <footer className="app-footer"><span>NASA Space Apps Challenge project</span><span>Educational prototype · No medical decisions</span></footer>}
    </div>
    <EmergencyDialog />
  </SessionProvider>
}

export default function App() { return <BrowserRouter><AppRoutes /></BrowserRouter> }
```

### `src/app/Workspace.tsx`

SHA-256: `a2fe0f44b7ea8ca77ee2808e989607440c8077e253f598f76009149c5fb6e6a9`. Complete original file.

```tsx
import { lazy, Suspense, useEffect, useRef } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { crew, getFixtureSnapshot } from '../data/fixtures'
import { isStationId, stationPath } from './navigation'
import { StationNavigation } from './StationNavigation'
import { SceneViewport } from '../scene/SceneViewport'
import { useSession } from '../state/session'
import { LoadingState } from '../ui/LoadingState'
import { ErrorBoundary } from '../ui/ErrorBoundary'

const views = {
  overview: lazy(() => import('../features/mission/OverviewView')),
  vitals: lazy(() => import('../features/vitals/VitalsView')),
  radiation: lazy(() => import('../features/radiation/RadiationView')),
  physical: lazy(() => import('../features/physical/PhysicalView')),
  wellbeing: lazy(() => import('../features/wellbeing/WellbeingView')),
  diagnostics: lazy(() => import('../features/diagnostics/DiagnosticsView')),
  emergency: lazy(() => import('../features/emergency/EmergencyView')),
}

export function Workspace() {
  const { mode, stationId } = useParams()
  const [search, setSearch] = useSearchParams()
  const { motionReduced, setMotionReduced, setEmergencyOpen } = useSession()
  const crewId = search.get('crew') ?? 'crew-01'
  const astronaut = crew.find(person => person.id === crewId)
  const snapshot = getFixtureSnapshot(crewId)
  const main = useRef<HTMLElement>(null)
  const previousStation = useRef(stationId)
  useEffect(() => {
    if (previousStation.current !== stationId) main.current?.focus()
    previousStation.current = stationId
  }, [stationId])

  if ((mode !== 'bay' && mode !== 'dashboard') || !isStationId(stationId) || !astronaut || !snapshot) return <main id="main-content" className="recovery"><h1>Station or crew unavailable</h1><p>This location does not match a registered station and fictional crew member.</p><Link className="button" to="/dashboard/overview?crew=crew-01">Return to overview</Link></main>
  const View = views[stationId]
  const panelOpen = search.get('panel') === 'open' || (stationId !== 'overview' && search.get('panel') !== 'closed')
  return <div className={`workspace-shell ${mode === 'bay' ? 'immersive-workspace' : 'flat-workspace'}`}>
    <div className="workspace-toolbar"><div className="mission-summary"><p className="mission-context">Mission 01 / Medical operations</p><span>Selected crew: <strong>{astronaut.displayName}</strong></span></div><label className="crew-field">Astronaut<select value={crewId} onChange={event => { const next = new URLSearchParams(search); next.set('crew', event.target.value); setSearch(next) }}>{crew.map(person => <option key={person.id} value={person.id}>{person.displayName} · {person.callSign}</option>)}</select></label></div>
    <StationNavigation mode={mode} crewId={crewId} />
    <div className={`workspace-grid ${mode === 'dashboard' ? 'dashboard-layout' : ''}`}>
      {mode === 'bay' && <SceneViewport station={stationId} crewId={crewId} />}
      <main ref={main} id="main-content" tabIndex={-1} aria-label="Selected medical module" className={`station-content${mode === 'bay' ? ' bay-module-panel' : ''}`}>
        {mode === 'bay' && <button className="module-panel-toggle" aria-expanded={panelOpen} aria-controls="module-panel-content" onClick={() => setSearch(previous => { const next = new URLSearchParams(previous); next.set('panel', panelOpen ? 'closed' : 'open'); return next })}><span>{stationId === 'overview' ? 'Mission notes' : 'Module preview'}</span><span aria-hidden="true">{panelOpen ? '−' : '+'}</span></button>}
        <div id="module-panel-content" hidden={mode === 'bay' && !panelOpen}><ErrorBoundary key={stationId} fallback={<section className="recovery"><h1>Station could not load</h1><p>Other stations and the emergency rehearsal remain available.</p><button className="button" onClick={() => window.location.reload()}>Reload station</button></section>}><Suspense fallback={<LoadingState />}><View snapshot={snapshot} /></Suspense></ErrorBoundary>
          <p className="data-provenance">Static fixture captured {new Date(snapshot.capturedAt).toUTCString()} · No live telemetry · Nothing is saved</p>
        </div>
      </main>
    </div>
    <div className="workspace-controls"><Link to={stationPath(mode === 'bay' ? 'dashboard' : 'bay', stationId, crewId)}>{mode === 'bay' ? 'Use dashboard mode' : 'Open spatial viewport'}</Link><label className="motion-option"><input type="checkbox" checked={motionReduced} onChange={event => setMotionReduced(event.target.checked)} /> Reduce camera motion</label><button className="emergency-trigger" onClick={() => setEmergencyOpen(true)}>Emergency rehearsal</button></div>
    <p className="workspace-disclosure">Educational simulation · Fictional crew · No medical decisions</p>
  </div>
}
```

### `src/app/StationNavigation.tsx`

SHA-256: `ede979f6786b8e924a1d79d45ad8c6b2976c345bf8d154b5bacf63e551b2aa6f`. Complete original file.

```tsx
import { NavLink, useSearchParams } from 'react-router-dom'
import { stations, stationPath, type DisplayMode } from './navigation'

export function StationNavigation({ mode, crewId }: { mode: DisplayMode; crewId: string }) {
  const [search] = useSearchParams()
  const quality = search.get('quality')
  const qualityQuery = quality === 'low' || quality === 'standard' ? `&quality=${quality}` : ''
  return <nav className="station-navigation" aria-label="Medical stations">{stations.map(station =>
    <NavLink key={station.id} to={stationPath(mode, station.id, crewId) + qualityQuery} className={({ isActive }) => `station-link${isActive ? ' active' : ''}`}><span className="station-indicator" aria-hidden="true" />{station.short}</NavLink>,
  )}</nav>
}
```

### `src/app/navigation.ts`

SHA-256: `f306d7ce6331add5b84c889d67a1bac3d87c008457390270233d84856cfe6b2e`. Complete original file.

```ts
export const stationIds = ['overview', 'vitals', 'radiation', 'physical', 'wellbeing', 'diagnostics', 'emergency'] as const
export type StationId = typeof stationIds[number]
export type DisplayMode = 'bay' | 'dashboard'

export const stations: ReadonlyArray<{ id: StationId; label: string; short: string }> = [
  { id: 'overview', label: 'Bay overview', short: 'Overview' },
  { id: 'vitals', label: 'Crew biometrics & vitals', short: 'Vitals' },
  { id: 'radiation', label: 'Space radiation monitoring', short: 'Radiation' },
  { id: 'physical', label: 'Physiological & musculoskeletal assessment', short: 'Physical' },
  { id: 'wellbeing', label: 'Psychological health & wellbeing', short: 'Wellbeing' },
  { id: 'diagnostics', label: 'AI diagnostics', short: 'Diagnostics' },
  { id: 'emergency', label: 'Emergency protocols', short: 'Emergency' },
]

export function isStationId(value: string | undefined): value is StationId {
  return stationIds.some(id => id === value)
}
export function stationPath(mode: DisplayMode, station: StationId, crewId: string): string {
  return `/${mode}/${station}?crew=${encodeURIComponent(crewId)}`
}
```

### `src/features/opening/OpeningExperience.tsx`

SHA-256: `7152bf929cd745baf25703a0d51d74524b02d0eb58ba518a7e5939e2e5454649`. Complete original file.

```tsx
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { crew } from '../../data/fixtures'
import { stations, stationPath } from '../../app/navigation'
import { useSession } from '../../state/session'
import { useMediaQuery } from '../../animation/useMediaQuery'
import { detectWebGL } from '../../scene/detectWebGL'
import { ErrorBoundary } from '../../ui/ErrorBoundary'
import type { QualityTier } from '../../scene/quality/config'

const MedicalBayCanvas = lazy(() => import('../../scene/MedicalBayCanvas'))

export function OpeningExperience() {
  const [search, setSearch] = useSearchParams()
  const astronaut = crew.find(person => person.id === search.get('crew')) ?? crew[0]!
  const { emergencyOpen, setEmergencyOpen, motionReduced, setMotionReduced } = useSession()
  const narrow = useMediaQuery('(max-width: 767px)')
  const prefersReduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const reduced = motionReduced || prefersReduced
  const [enabled, setEnabled] = useState(false)
  const [supported] = useState(detectWebGL)
  const [lost, setLost] = useState(false)
  const [ready, setReady] = useState(false)
  const [sceneFailed, setSceneFailed] = useState(false)
  const [quality, setQuality] = useState<QualityTier>('standard')
  const [attempt, setAttempt] = useState(0)
  const [indexOpen, setIndexOpen] = useState(false)
  const [indexSection, setIndexSection] = useState<'crew' | 'modules'>('modules')
  const root = useRef<HTMLElement>(null)
  const intro = useRef<HTMLDivElement>(null)
  const arrival = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const index = useRef<HTMLDialogElement>(null)
  const renderScene = (!narrow || enabled) && supported && !lost
  const onLoaded = useCallback(() => setReady(true), [setReady])
  const onReady = useCallback(() => {}, [])
  const onLost = useCallback(() => { setLost(true); setReady(false) }, [setReady, setLost])
  const scrollToBay = useCallback(() => {
    const element = root.current
    if (element) window.scrollTo({ top: element.offsetTop + element.offsetHeight - window.innerHeight, behavior: reduced ? 'instant' : 'smooth' })
  }, [reduced])
  useEffect(() => {
    const element = root.current
    if (!element) return
    let frame = 0
    const update = () => {
      frame = 0
      const range = Math.max(1, element.offsetHeight - innerHeight)
      const p = Math.max(0, Math.min(1, -element.getBoundingClientRect().top / range))
      progress.current = p
      // Geometry follows native document scrolling. React doesn't render on each tick.
      const reveal = reduced ? 0 : Math.min(1, p / .58)
      element.style.setProperty('--reveal', String(reveal))
      element.style.setProperty('--intro-alpha', String(Math.max(0, 1 - p / .32)))
      element.style.setProperty('--arrival-alpha', String(Math.max(0, Math.min(1, (p - .65) / .2))))
      element.style.setProperty('--travel', `${p * 100}%`)
      element.dataset.immersed = String(p > .35 && !reduced)
      element.dataset.canvasFilled = String(p >= .565 && !reduced)
      element.dataset.progress = p.toFixed(3)
      if (intro.current) intro.current.inert = p > .34
      if (arrival.current) arrival.current.inert = p < .65
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    update()
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [reduced])
  useEffect(() => {
    const dialog = index.current
    if (!dialog) return
    if (indexOpen && !dialog.open) dialog.showModal()
    if (!indexOpen && dialog.open) dialog.close()
  }, [indexOpen])
  useEffect(() => {
    if (!indexOpen && !emergencyOpen) return
    const previous = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => { document.documentElement.style.overflow = previous }
  }, [indexOpen, emergencyOpen])
  const openIndex = (section: 'crew' | 'modules') => { setIndexSection(section); setIndexOpen(true) }
  async function retry() {
    const { retryEnvironmentResource } = await import('../../scene/assets/loadModel')
    retryEnvironmentResource(quality)
    setLost(false)
    setSceneFailed(false)
    setReady(false)
    setAttempt(value => value + 1)
  }
  const recovery = <div className="opening-recovery"><span className="opening-cross" aria-hidden="true">＋</span><h2>The mission stays within reach.</h2><p>{lost ? 'The graphics connection was interrupted.' : 'The spatial preview is unavailable. The medical workspace remains accessible.'}</p><Link to={stationPath('dashboard', 'overview', astronaut.id)}>Open dashboard mode</Link>{supported && <button onClick={() => { void retry() }}>Retry 3D view</button>}</div>
  return <main ref={root} id="main-content" tabIndex={-1} className={`opening${reduced ? ' opening-reduced' : ''}${narrow && renderScene ? ' opening-live-mobile' : ''}`} aria-label="Orbital medical bay opening">
    <div className="opening-pin">
      <div className="opening-scene" aria-label="Scroll-controlled medical bay">
        {renderScene ? <ErrorBoundary key={`${quality}-${attempt}`} onError={() => setSceneFailed(true)} fallback={recovery}><Suspense fallback={<div className="opening-loading" role="status">Preparing the medical bay…</div>}><MedicalBayCanvas view="overview" onSelect={scrollToBay} onLoaded={onLoaded} onReady={onReady} onContextLost={onLost} quality={quality} reducedMotion={reduced} benchmark={false} standbyRun={0} resetToken={attempt} scrollProgress={progress} scrollPaused={emergencyOpen || indexOpen} /></Suspense></ErrorBoundary> : narrow && !enabled && supported ? <div className="opening-mobile-poster"><svg viewBox="0 0 300 300" fill="none" aria-hidden="true"><circle cx="150" cy="150" r="120"/><path d="M82 192v-65a68 68 0 0 1 136 0v65M95 192v-65a55 55 0 0 1 110 0v65M66 204h170l-24-25H87l-21 25Zm39 4v28m96-28v28M126 158h50v20h-50z"/><path d="M150 0v40m0 220v40M0 150h40m220 0h40"/></svg><span>Examination bay / Spatial preview</span><button onClick={() => setEnabled(true)}>Enable 3D exploration <span aria-hidden="true">↗</span></button></div> : recovery}
        {renderScene && !ready && !sceneFailed && <div className="opening-loading" role="status">Loading the authored environment…</div>}
      </div>
      <div className="opening-curve-label" aria-hidden="true">Human health / Beyond Earth orbit</div>
      <header className="opening-header">
        <Link className="opening-wordmark" to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} aria-label="Orbital mission introduction"><span className="opening-emblem" aria-hidden="true"><i /><i /></span>orbital<span className="opening-wordmark-dot">.</span></Link>
        <div className="opening-edition">A human mission.<br /><span>NASA Space Apps Challenge</span></div>
        <nav aria-label="Mission controls"><button className="opening-crew-trigger" onClick={() => openIndex('crew')}><span className="opening-crew-initials">{astronaut.displayName.split(' ').map(name => name[0]).join('')}</span><span>{astronaut.displayName}</span></button><button onClick={() => openIndex('modules')}>Medical index <span aria-hidden="true">≡</span></button><button className="opening-emergency" onClick={() => setEmergencyOpen(true)} aria-label="Emergency rehearsal"><span aria-hidden="true">＋</span><span>Emergency</span></button></nav>
      </header>
      <div ref={intro} className="opening-intro">
        <p className="opening-kicker"><span /> Medicine for the next frontier</p>
        <h1>Care,<br />beyond<br /><span>Earth.</span></h1>
        <div className="opening-intro-note"><span aria-hidden="true">↳</span><p>Far from home.<br />Closer to what makes us human.</p></div>
        <button className="opening-scroll-invitation" onClick={scrollToBay}><span className="opening-scroll-circle" aria-hidden="true">↓</span><span>Explore the medical bay<small>Scroll to enter</small></span></button>
      </div>
      <div ref={arrival} className="opening-arrival">
        <p className="opening-kicker">Inside the mission / Examination bay</p>
        <h2>Built around<br />the human.</h2>
        <p>An examination cradle. A diagnostic scanner.<br />A space designed around the crew.</p>
        <Link className="opening-enter" to={stationPath(narrow ? 'dashboard' : 'bay', 'overview', astronaut.id)}>Initialize mission <span aria-hidden="true">↗</span></Link>
        <Link className="opening-station-link" to={`${stationPath(narrow ? 'dashboard' : 'bay', 'vitals', astronaut.id)}&view=examination`}>Inspect examination station</Link>
      </div>
      <div className="opening-progress" aria-label="Opening sequence"><span>Arrival</span><div><i /></div><span>Medical bay</span></div>
      <div className="opening-bottom"><Link to={stationPath('dashboard', 'overview', astronaut.id)}>Open dashboard mode <span aria-hidden="true">↗</span></Link><p>Educational simulation. Fictional crew. No medical decisions.</p><span className="opening-render-state" data-testid="opening-status" data-state={sceneFailed ? 'fallback' : ready ? 'ready' : renderScene ? 'loading' : 'fallback'}>{sceneFailed ? 'Spatial preview unavailable' : ready ? 'Examination environment / Ready' : renderScene ? 'Preparing environment' : 'List workspace available'}</span></div>
    </div>
    <dialog ref={index} className="opening-index" aria-labelledby="opening-index-title" onCancel={() => setIndexOpen(false)} onClose={() => setIndexOpen(false)}>
      <div className="opening-index-top"><span>Orbital / Mission access</span><button onClick={() => setIndexOpen(false)} aria-label="Close medical index">×</button></div>
      <h2 id="opening-index-title">{indexSection === 'crew' ? 'The people at the centre.' : 'A mission in good hands.'}</h2>
      <label className="opening-crew-select">Crew context<select aria-label="Astronaut" value={astronaut.id} onChange={event => setSearch(previous => { const next = new URLSearchParams(previous); next.set('crew', event.target.value); return next }, { replace: true })}>{crew.map(person => <option key={person.id} value={person.id}>{person.displayName} / {person.role}</option>)}</select></label>
      <nav aria-label="Medical modules">{stations.map((station, i) => <Link key={station.id} to={stationPath('dashboard', station.id, astronaut.id)}><span>{station.label}</span><span aria-hidden="true">{i === 0 ? '↗' : '＋'}</span></Link>)}</nav>
      <fieldset><legend>Experience preferences</legend><label><input type="checkbox" checked={motionReduced} onChange={event => setMotionReduced(event.target.checked)} /> Reduce camera motion</label>{prefersReduced && <p>Your system motion preference is respected.</p>}<label>Rendering quality<select aria-label="Rendering quality" value={quality} onChange={event => { setReady(false); setSceneFailed(false); setQuality(event.target.value as QualityTier) }}><option value="low">Low / Efficient</option><option value="standard">Standard / Shadows</option></select></label></fieldset>
      <p className="opening-index-disclosure">Static, fictional medical data. No live monitoring, medical calculation or AI diagnosis. This preview contains the opening experience only.</p>
    </dialog>
  </main>
}
```

### `src/main.tsx`

SHA-256: `4a3488fea70528217c17eff71ded4d39c4efcc121cb59d96c12426a88c76f6cf`. Complete original file.

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import { ErrorBoundary } from './ui/ErrorBoundary'
import './styles/index.css'
import './styles/immersive.css'
import './styles/opening.css'

const root = document.getElementById('root')
if (!root) throw new Error('Application root is missing')
createRoot(root).render(<StrictMode><ErrorBoundary><App /></ErrorBoundary></StrictMode>)
```

### `src/domain/contracts.ts`

SHA-256: `94209d918119f261b35241e9ee18f78a081a0cdc42f289104489ad21406a7264`. Complete original file.

```ts
/** Frontend display contracts. Values and severity are supplied, never diagnosed here. */
export type CrewId = string
export type ISODateTime = string
export type DataSource = 'simulated-fixture' | 'external'
export type DataQuality = 'valid' | 'missing' | 'stale' | 'invalid'
export type Severity = 'nominal' | 'attention' | 'critical' | 'unknown'

export interface AstronautProfile {
  id: CrewId
  displayName: string
  role: string
  callSign: string
  fictional: boolean
}
export interface CrewSelection { crewId: CrewId }
export interface Measurement<Unit extends string = string> {
  id: string
  value: number | null
  unit: Unit
  measuredAt: ISODateTime
  quality: DataQuality
  severity: Severity
  source: DataSource
}
export interface BiometricMeasurements {
  heartRate: Measurement<'bpm'>
  systolicPressure: Measurement<'mmHg'>
  diastolicPressure: Measurement<'mmHg'>
  oxygenSaturation: Measurement<'%'>
  heartRateVariability: Measurement<'ms'>
}
export interface RadiationMeasurements {
  doseRate: Measurement<'µSv/h'>
  cumulativeDose: Measurement<'mSv'>
  periodStart: ISODateTime
  environment: 'GCR-demo' | 'SPE-demo' | 'unavailable'
}
export interface SleepRecord {
  id: string
  crewId: CrewId
  start: ISODateTime
  end: ISODateTime
  duration: Measurement<'h'>
  suppliedScore: number | null
}
export interface PhysicalAssessment {
  id: string
  crewId: CrewId
  recordedAt: ISODateTime
  questionnaireVersion: string
  symptoms: ReadonlyArray<{ questionId: string; answer: boolean | null }>
  boneDensityChange: Measurement<'%'>
  muscleMassChange: Measurement<'%'>
  exerciseMinutes: number | null
}
export interface PsychologicalWellbeing {
  id: string
  crewId: CrewId
  recordedAt: ISODateTime
  mood: number | null
  stress: number | null
  scale: { min: number; max: number }
  note: string
}
export interface DiagnosticMessage {
  id: string
  crewId: CrewId
  generatedAt: ISODateTime
  source: DataSource
  kind: 'scripted-demo' | 'supplied-result'
  summary: string
  evidenceIds: readonly string[]
  contentVersion: string
}
export interface ProtocolContent {
  id: string
  version: string
  title: string
  reviewStatus: 'draft' | 'domain-approved'
  simulationOnly: boolean
  steps: ReadonlyArray<{ id: string; text: string }>
  references: readonly string[]
}
export interface EmergencyStatus {
  state: 'inactive' | 'demo-active'
  protocolId: string | null
  acknowledgedStepIds: readonly string[]
}
export interface CrewSnapshot {
  schemaVersion: 1
  crewId: CrewId
  scenarioId: string
  capturedAt: ISODateTime
  source: DataSource
  biometrics: BiometricMeasurements
  radiation: RadiationMeasurements
  sleep: SleepRecord
  physical: PhysicalAssessment
  wellbeing: PsychologicalWellbeing
  diagnostic: DiagnosticMessage
}
```

### `src/domain/format.ts`

SHA-256: `82b56093c7bf19c8a1aa4c7feda4ca500ecc4256f6102ec3daa7ce9193e72442`. Complete original file.

```ts
import type { Measurement } from './contracts'

export function formatMeasurement(measurement: Measurement): string {
  if (measurement.value === null || measurement.quality === 'missing' || measurement.quality === 'invalid') return 'Unavailable'
  return `${measurement.value} ${measurement.unit}${measurement.quality === 'stale' ? ' · Stale' : ''}`
}
```

### `src/data/fixtures.ts`

SHA-256: `5f578c1ac163c140f4ff2e3934552b3995572cdaf6664be0bf34ea58341dce38`. Complete original file.

```ts
import type { AstronautProfile, CrewSnapshot, Measurement, ProtocolContent } from '../domain/contracts'

export const fixtureTime = '2026-11-14T06:00:00Z'
export const crew: readonly AstronautProfile[] = [
  { id: 'crew-01', displayName: 'Alex Morgan', role: 'Mission commander', callSign: 'Aster', fictional: true },
  { id: 'crew-02', displayName: 'Sam Rivera', role: 'Flight engineer', callSign: 'Vega', fictional: true },
]

function metric<U extends string>(id: string, value: number | null, unit: U): Measurement<U> {
  return { id, value, unit, measuredAt: fixtureTime, quality: value === null ? 'missing' : 'valid', severity: 'unknown', source: 'simulated-fixture' }
}

function makeSnapshot(crewId: string, heartRate: number): CrewSnapshot {
  return {
    schemaVersion: 1, crewId, scenarioId: 'foundation-demo', capturedAt: fixtureTime, source: 'simulated-fixture',
    biometrics: {
      heartRate: metric('heart-rate', heartRate, 'bpm'),
      systolicPressure: metric('systolic', 118, 'mmHg'),
      diastolicPressure: metric('diastolic', 76, 'mmHg'),
      oxygenSaturation: metric('spo2', 98, '%'),
      heartRateVariability: metric('hrv', null, 'ms'),
    },
    radiation: { doseRate: metric('dose-rate', 18, 'µSv/h'), cumulativeDose: metric('cumulative-dose', 0.4, 'mSv'), periodStart: '2026-11-13T06:00:00Z', environment: 'GCR-demo' },
    sleep: { id: `sleep-${crewId}`, crewId, start: '2026-11-13T22:00:00Z', end: fixtureTime, duration: metric('sleep-duration', 8, 'h'), suppliedScore: null },
    physical: { id: `physical-${crewId}`, crewId, recordedAt: fixtureTime, questionnaireVersion: 'draft-1', symptoms: [], boneDensityChange: metric('bone-change', null, '%'), muscleMassChange: metric('muscle-change', null, '%'), exerciseMinutes: null },
    wellbeing: { id: `wellbeing-${crewId}`, crewId, recordedAt: fixtureTime, mood: null, stress: null, scale: { min: 1, max: 5 }, note: '' },
    diagnostic: { id: `diagnostic-${crewId}`, crewId, generatedAt: fixtureTime, source: 'simulated-fixture', kind: 'scripted-demo', summary: 'No analysis performed. This entry verifies the diagnostic message interface.', evidenceIds: ['heart-rate'], contentVersion: 'draft-1' },
  }
}

const snapshots: Readonly<Record<string, CrewSnapshot>> = {
  'crew-01': makeSnapshot('crew-01', 72),
  'crew-02': makeSnapshot('crew-02', 81),
}

/** Static lookup only: no service, streaming, random values, calculation or storage. */
export function getFixtureSnapshot(crewId: string): CrewSnapshot | undefined {
  return snapshots[crewId]
}

export const demoProtocol: ProtocolContent = {
  id: 'foundation-protocol', version: 'draft-1', title: 'Emergency interface rehearsal', reviewStatus: 'draft', simulationOnly: true,
  steps: [
    { id: 'demo-1', text: 'This is a navigation rehearsal. No emergency has been detected.' },
    { id: 'demo-2', text: 'Operational medical instructions will be supplied after domain review.' },
  ],
  references: [],
}
```

### `src/state/session.ts`

SHA-256: `05c875ae7f6b25fd3a4ad60490263540ddd1282eef93f32342c2ec5b667f360d`. Complete original file.

```ts
import { createContext, useContext } from 'react'

interface SessionState {
  emergencyOpen: boolean
  setEmergencyOpen: (open: boolean) => void
  motionReduced: boolean
  setMotionReduced: (reduced: boolean) => void
}
export const SessionContext = createContext<SessionState | null>(null)
export function useSession(): SessionState {
  const session = useContext(SessionContext)
  if (!session) throw new Error('SessionProvider is required')
  return session
}
```

### `src/state/SessionProvider.tsx`

SHA-256: `1235beb5c0dccf87d2e5aee21edad82f0b7474e0d3b0faf3adb0acf817bdb1f4`. Complete original file.

```tsx
import { useState, type ReactNode } from 'react'
import { SessionContext } from './session'

export function SessionProvider({ children }: { children: ReactNode }) {
  const [emergencyOpen, setEmergencyOpen] = useState(false)
  const [motionReduced, setMotionReduced] = useState(false)
  return <SessionContext value={{ emergencyOpen, setEmergencyOpen, motionReduced, setMotionReduced }}>{children}</SessionContext>
}
```

### `src/ui/holographic/HolographicPanel.tsx`

SHA-256: `0cb69b2924d0dbcd418ad08073b7a1b3dc440e934a259f9b6de0b2d976527649`. Complete original file.

```tsx
import type { ReactNode } from 'react'

/** DOM presentation boundary; world-space anchors/shaders are a later scene concern. */
export function HolographicPanel({ children }: { children: ReactNode }) {
  return <section className="holographic-panel" aria-labelledby="station-title">{children}</section>
}
```

### `src/ui/ModulePlaceholder.tsx`

SHA-256: `af67de73dd660484047fee850224e03051d6d5ec0afab3a0ef8372d47f400640`. Complete original file.

```tsx
import type { ReactNode } from 'react'
import type { CrewSnapshot } from '../domain/contracts'
import { HolographicPanel } from './holographic/HolographicPanel'

export interface ModuleProps { snapshot: CrewSnapshot }
export function ModulePlaceholder({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return <HolographicPanel>
    <span className="phase-tag">Module foundation</span>
    <h1 tabIndex={-1} id="station-title">{title}</h1>
    <p className="module-description">{description}</p>
    <div className="fixture-preview">{children}</div>
    <p className="scope-note">Placeholder interface · Static simulated fixtures · No medical analysis</p>
  </HolographicPanel>
}
```

### `src/animation/useMediaQuery.ts`

SHA-256: `6b70e54d27a83b2fa24065860ca374b18870bd421bfd925940acc0f8a54e845e`. Complete original file.

```ts
import { useSyncExternalStore } from 'react'

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    callback => {
      const media = window.matchMedia(query)
      media.addEventListener('change', callback)
      return () => media.removeEventListener('change', callback)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
```

### `src/features/diagnostics/DiagnosticsView.tsx`

SHA-256: `43b3a4a7f2aa14a8b5aea26320a54884d605927eabc5b9537c12212d4605b173`. Complete original file.

```tsx
import { ModulePlaceholder, type ModuleProps } from '../../ui/ModulePlaceholder'

export default function DiagnosticsView({ snapshot }: ModuleProps) {
  return <ModulePlaceholder title="AI diagnostics" description="The diagnostic message contract is available for future supplied results. No AI service or diagnostic engine is connected.">
    <p><strong>Scripted interface fixture</strong></p><p>{snapshot.diagnostic.summary}</p>
  </ModulePlaceholder>
}
```

### `src/features/emergency/EmergencyDialog.tsx`

SHA-256: `a687411d58b774bce1286f266c3eccc35fd272e8533bf23f85bf8cedf2919b4b`. Complete original file.

```tsx
import { useEffect, useRef } from 'react'
import { demoProtocol } from '../../data/fixtures'
import { useSession } from '../../state/session'

export function EmergencyDialog() {
  const { emergencyOpen, setEmergencyOpen } = useSession()
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const element = dialog.current
    if (emergencyOpen && element && !element.open) element.showModal()
    if (!emergencyOpen && element?.open) element.close()
  }, [emergencyOpen])
  return <dialog ref={dialog} className="emergency-dialog" aria-labelledby="emergency-title" aria-describedby="emergency-description" onCancel={() => setEmergencyOpen(false)} onClose={() => setEmergencyOpen(false)}>
    <span className="phase-tag">Simulation only · Draft content</span>
    <h2 id="emergency-title">{demoProtocol.title}</h2>
    <p id="emergency-description">No operational emergency action will be taken.</p>
    <ol>{demoProtocol.steps.map(step => <li key={step.id}>{step.text}</li>)}</ol>
    <button className="button" onClick={() => setEmergencyOpen(false)} autoFocus>Return to station</button>
  </dialog>
}
```

### `src/features/emergency/EmergencyView.tsx`

SHA-256: `b736a5737098c20d84aa7528b63204c039dcc06181de03ac9533adb095ba928f`. Complete original file.

```tsx
import { ModulePlaceholder } from '../../ui/ModulePlaceholder'
import { useSession } from '../../state/session'

export default function EmergencyView() {
  const { setEmergencyOpen } = useSession()
  return <ModulePlaceholder title="Emergency protocols" description="The global rehearsal overlay is independent of the 3D renderer. Operational protocol content is pending domain review.">
    <button className="button button-critical" onClick={() => setEmergencyOpen(true)}>Open emergency rehearsal</button>
  </ModulePlaceholder>
}
```

### `src/features/mission/MissionView.tsx`

SHA-256: `e5fecd97b1759726579cbe07b0c49c3a89f66513cd4e1d95285320e99ab4aba8`. Complete original file.

```tsx
import { Link } from 'react-router-dom'
import { useMediaQuery } from '../../animation/useMediaQuery'
import { useSession } from '../../state/session'

export function MissionView() {
  const smallScreen = useMediaQuery('(max-width: 767px)')
  const { motionReduced, setMotionReduced } = useSession()
  return <main id="main-content" tabIndex={-1} className="mission-entry">
    <div className="mission-copy">
    <div className="mission-mark" aria-hidden="true"><svg width="34" height="34" viewBox="0 0 34 34" fill="none"><circle cx="17" cy="17" r="12" stroke="currentColor" /><path d="M17 7v20M7 17h20" stroke="currentColor" /></svg></div>
    <p className="mission-context">NASA Space Apps Challenge · Environment vertical slice</p>
    <h1>Orbital medical bay</h1>
    <p className="mission-intro">Explore an orbital examination bay and its medical equipment. Choose a crew member, inspect the environment, and visit the medical module previews.</p>
    <p className="simulation-note">Educational simulation · Fictional crew · Static sample data</p>
    <label className="motion-option"><input type="checkbox" checked={motionReduced} onChange={event => setMotionReduced(event.target.checked)} /> Reduce camera motion</label>
    <div className="action-row"><Link className="button" to={`/${smallScreen ? 'dashboard' : 'bay'}/overview?crew=crew-01`}>Initialize mission</Link><Link className="button button-secondary" to="/dashboard/overview?crew=crew-01">Open dashboard mode</Link></div>
    <p className="scope-note">First environment vertical slice. Medical dashboards and monitoring workflows remain previews.</p>
    </div>
    <aside className="mission-brief" aria-label="Examination bay mission brief">
      <svg viewBox="0 0 420 310" fill="none" aria-hidden="true"><path d="M44 258h332M78 246V94l45-42h174l45 42v152M94 246V102l37-34h158l37 34v144" stroke="currentColor" strokeWidth="1.2" opacity=".4"/><path d="M130 185v-41a80 80 0 0 1 160 0v41M141 185v-41a69 69 0 0 1 138 0v41" stroke="currentColor" strokeWidth="3"/><path d="M149 188h122l12 17H137l12-17Zm6 20v25m110-25v25m-126 6h142M162 161h96v25h-96zM172 144h76v13h-76z" stroke="currentColor" strokeWidth="1.5"/><path d="M89 118h-22m22 28h-22m264-28h22m-22 28h22M190 42h40m-20-11v22" stroke="currentColor" opacity=".55"/><circle cx="210" cy="93" r="4" fill="currentColor"/><path d="M101 270h218" stroke="currentColor" opacity=".35"/></svg>
      <h2>Examination module 01</h2>
      <p>A guided medical workspace with an examination cradle, diagnostic scanner and crew-focused module previews.</p>
      <p>Choose a station to inspect its equipment. Dashboard mode provides the same module access without 3D rendering.</p>
    </aside>
  </main>
}
```

### `src/features/mission/OverviewView.tsx`

SHA-256: `25853a51119a3e08c091b3fa2b03f1e59248b41b00295b5b55d2ff1e5a3fb87d`. Complete original file.

```tsx
import { ModulePlaceholder } from '../../ui/ModulePlaceholder'

export default function OverviewView() {
  return <ModulePlaceholder title="Medical bay overview" description="Explore the examination bay through the spatial viewport, or select a medical module to inspect its feature boundary and simulated data wiring.">
    <p>In spatial mode, select the examination cradle or diagnostic trolley to inspect it. Medical dashboards remain placeholders; this vertical slice focuses on the environment and equipment.</p>
  </ModulePlaceholder>
}
```

### `src/features/physical/PhysicalView.tsx`

SHA-256: `c4b967e02ba4cc74718c072c623a48a8568ff57fb68bd6dc665c8cd7fd1837d5`. Complete original file.

```tsx
import { ModulePlaceholder, type ModuleProps } from '../../ui/ModulePlaceholder'
import { formatMeasurement } from '../../domain/format'

export default function PhysicalView({ snapshot }: ModuleProps) {
  return <ModulePlaceholder title="Physiological & musculoskeletal assessment" description="The feature boundary is prepared for anatomy selection, exercise records and a reviewed SANS observation questionnaire.">
    <dl><div><dt>Bone density change</dt><dd>{formatMeasurement(snapshot.physical.boneDensityChange)}</dd></div><div><dt>Questionnaire</dt><dd>Not implemented</dd></div></dl>
  </ModulePlaceholder>
}
```

### `src/features/radiation/RadiationView.tsx`

SHA-256: `e4612d291faa30b3ea6d0bd957e3be1f7f6ba0a8f1ee78f9885b5e49cced89b9`. Complete original file.

```tsx
import { ModulePlaceholder, type ModuleProps } from '../../ui/ModulePlaceholder'
import { formatMeasurement } from '../../domain/format'

export default function RadiationView({ snapshot }: ModuleProps) {
  return <ModulePlaceholder title="Space radiation monitoring" description="Separate dose-rate and cumulative-dose contracts are ready. These fixtures are unrelated to a live instrument feed; risk calculations are outside this frontend.">
    <dl><div><dt>Dose rate · simulated</dt><dd>{formatMeasurement(snapshot.radiation.doseRate)}</dd></div><div><dt>Cumulative dose · simulated</dt><dd>{formatMeasurement(snapshot.radiation.cumulativeDose)}</dd></div></dl>
  </ModulePlaceholder>
}
```

### `src/features/vitals/VitalsView.tsx`

SHA-256: `7e2132ce446ab4806d62223d1da34e63e8ca13ccba65e66c0df3c383d34b3981`. Complete original file.

```tsx
import { ModulePlaceholder, type ModuleProps } from '../../ui/ModulePlaceholder'
import { formatMeasurement } from '../../domain/format'

export default function VitalsView({ snapshot }: ModuleProps) {
  return <ModulePlaceholder title="Crew biometrics & vitals" description="A shared interface for cardiovascular, oxygen and sleep measurements. History and live chart interactions are deferred.">
    <dl><div><dt>Heart rate · simulated</dt><dd>{formatMeasurement(snapshot.biometrics.heartRate)}</dd></div><div><dt>HRV · missing sample</dt><dd>{formatMeasurement(snapshot.biometrics.heartRateVariability)}</dd></div><div><dt>Sleep duration · simulated</dt><dd>{formatMeasurement(snapshot.sleep.duration)}</dd></div></dl>
  </ModulePlaceholder>
}
```

### `src/features/wellbeing/WellbeingView.tsx`

SHA-256: `8aa5312a3ade8d603a891677179a3cae3f4fe26667b3ce8589ae24ec4b19a48f`. Complete original file.

```tsx
import { ModulePlaceholder, type ModuleProps } from '../../ui/ModulePlaceholder'

export default function WellbeingView({ snapshot }: ModuleProps) {
  return <ModulePlaceholder title="Psychological health & wellbeing" description="A dedicated boundary for voluntary check-ins and reviewed support resources. No responses are collected or saved in this foundation.">
    <dl><div><dt>Mood check-in</dt><dd>{snapshot.wellbeing.mood ?? 'Not recorded'}</dd></div><div><dt>Storage</dt><dd>None</dd></div></dl>
  </ModulePlaceholder>
}
```

### `src/scene/assets/generated-manifest.json`

SHA-256: `260853e2ad629dca9a5bf669777d8e3d479b731b6e9c82ab703c8c3b25b72fe3`. Complete original file.

```json
[
  {
    "id": "shell-standard",
    "path": "assets/models/shell-standard.glb",
    "bytes": 702636,
    "triangles": 144848,
    "drawCalls": 10,
    "sha256": "fe6b74c1ae53f93b6d89a0eb56d67d2b401b55dc7c79d6fca81097236e96a96b",
    "tier": "standard",
    "authoring": "Original Blender Python mesh authoring; bevels, weighted normals, UV mapping, material batching, embedded procedural textures, Draco compression",
    "license": "Original project geometry/maps; Barlow Condensed glyph outlines under SIL OFL 1.1; no third-party models/images",
    "status": "Vertical slice asset; art review pending"
  },
  {
    "id": "examination-standard",
    "path": "assets/models/examination-standard.glb",
    "bytes": 366368,
    "triangles": 35928,
    "drawCalls": 11,
    "sha256": "117a32ce5f40cbfa8974b2e0d53486a5066a7417c5edfdf0148e39b6485171a0",
    "tier": "standard",
    "authoring": "Original Blender Python mesh authoring; bevels, weighted normals, UV mapping, material batching, embedded procedural textures, Draco compression",
    "license": "Original project geometry/maps; Barlow Condensed glyph outlines under SIL OFL 1.1; no third-party models/images",
    "status": "Vertical slice asset; art review pending"
  },
  {
    "id": "equipment-standard",
    "path": "assets/models/equipment-standard.glb",
    "bytes": 285920,
    "triangles": 18396,
    "drawCalls": 10,
    "sha256": "c9bf696c9b851b195c4646af8e424581132cb04ded18362707ff91d02b23b2c6",
    "tier": "standard",
    "authoring": "Original Blender Python mesh authoring; bevels, weighted normals, UV mapping, material batching, embedded procedural textures, Draco compression",
    "license": "Original project geometry/maps; Barlow Condensed glyph outlines under SIL OFL 1.1; no third-party models/images",
    "status": "Vertical slice asset; art review pending"
  },
  {
    "id": "shell-low",
    "path": "assets/models/shell-low.glb",
    "bytes": 456588,
    "triangles": 59828,
    "drawCalls": 10,
    "sha256": "9f8b0c884cd44f564d071d38174a2e2bd69456d23a09ddca361ab47b8f04e493",
    "tier": "low",
    "authoring": "Original Blender Python mesh authoring; bevels, weighted normals, UV mapping, material batching, embedded procedural textures, Draco compression",
    "license": "Original project geometry/maps; Barlow Condensed glyph outlines under SIL OFL 1.1; no third-party models/images",
    "status": "Vertical slice asset; art review pending"
  },
  {
    "id": "examination-low",
    "path": "assets/models/examination-low.glb",
    "bytes": 307792,
    "triangles": 23532,
    "drawCalls": 10,
    "sha256": "d6adfbccffc2edb1fdc7ef5c3120f6ee3b67cc186556aa2e9a280aa5af6de978",
    "tier": "low",
    "authoring": "Original Blender Python mesh authoring; bevels, weighted normals, UV mapping, material batching, embedded procedural textures, Draco compression",
    "license": "Original project geometry/maps; Barlow Condensed glyph outlines under SIL OFL 1.1; no third-party models/images",
    "status": "Vertical slice asset; art review pending"
  },
  {
    "id": "equipment-low",
    "path": "assets/models/equipment-low.glb",
    "bytes": 275928,
    "triangles": 13020,
    "drawCalls": 10,
    "sha256": "60c892eff1eb6716c6dc6fa8fbfa4bde400860df0d116a25fa2daefa0c7d3274",
    "tier": "low",
    "authoring": "Original Blender Python mesh authoring; bevels, weighted normals, UV mapping, material batching, embedded procedural textures, Draco compression",
    "license": "Original project geometry/maps; Barlow Condensed glyph outlines under SIL OFL 1.1; no third-party models/images",
    "status": "Vertical slice asset; art review pending"
  }
]
```

### `src/scene/assets/loadModel.ts`

SHA-256: `70cf85dd292fd8f97b5abeb367411420fdac01897f03bfdcba9e66a4aa791730`. Complete original file.

```ts
import type { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { getAssetUrl, type ModelAsset } from './registry'
import type { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import type { QualityTier } from '../quality/config'
import { modelAssets } from './registry'

let decoder: Promise<DRACOLoader> | undefined
function getDecoder() {
  decoder ??= import('three/addons/loaders/DRACOLoader.js').then(({ DRACOLoader }) => new DRACOLoader()
    .setDecoderPath({ js: `${import.meta.env.BASE_URL}assets/decoders/draco/draco_wasm_wrapper.js`, wasm: `${import.meta.env.BASE_URL}assets/decoders/draco/draco_decoder.wasm` })
    .setWorkerLimit(2))
  return decoder
}
const environments = new Map<QualityTier, Promise<GLTF[]>>()
const failedEnvironments = new Set<QualityTier>()

export function retryEnvironmentResource(tier: QualityTier) {
  if (failedEnvironments.delete(tier)) environments.delete(tier)
}

/** Bounded two-tier cache. Never mutate/dispose shared cached materials in instances. */
export function getEnvironmentResource(tier: QualityTier): Promise<GLTF[]> {
  const cached = environments.get(tier)
  if (cached) return cached
  const pending = Promise.all(modelAssets.filter(asset => asset.tier === tier).map(asset => loadModel(asset)))
  environments.set(tier, pending)
  // Retain a rejected promise until an explicit retry. Replacing it during render
  // would create an endless Suspense retry loop instead of reaching the boundary.
  void pending.catch(() => failedEnvironments.add(tier))
  return pending
}

/** Local Draco decoding; no CDN. Raw GLBs remain supported for future assets. */
export async function loadModel(
  asset: ModelAsset,
  configure?: (loader: GLTFLoader) => void,
  onProgress?: (event: ProgressEvent) => void,
): Promise<GLTF> {
  const url = getAssetUrl(asset)
  const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js')
  const loader = new GLTFLoader()
  if (asset.compression === 'draco') loader.setDRACOLoader(await getDecoder())
  configure?.(loader)
  try {
    return await loader.loadAsync(url, onProgress)
  } catch (error) {
    throw new Error(`Unable to load model ${asset.id}`, { cause: error })
  }
}
```

### `src/scene/assets/registry.ts`

SHA-256: `4516487ab653870015296658c5bd24607dfc02713bf8723deefd24895662954a`. Complete original file.

```ts
import type { StationId } from '../../app/navigation'
import type { QualityTier } from '../quality/config'
import generated from './generated-manifest.json'

export interface ModelAsset {
  id: string
  path: string
  version: string
  bytes: number
  station: StationId
  tier: QualityTier
  license: { source: string; author: string; name: string; attribution: string }
  animations: readonly string[]
  compression?: 'draco'
  triangles?: number
}

export const modelAssets: readonly ModelAsset[] = generated.map(asset => ({
  id: asset.id,
  path: asset.path,
  version: asset.sha256.slice(0, 12),
  bytes: asset.bytes,
  station: asset.id.startsWith('shell') ? 'overview' : asset.id.startsWith('examination') ? 'vitals' : 'diagnostics',
  tier: asset.tier as QualityTier,
  license: { source: 'scripts/build_medical_bay.py', author: 'Orbital Medical Bay project', name: 'Project-original generated art', attribution: asset.license },
  animations: [],
  compression: 'draco',
  triangles: asset.triangles,
}))

export function getAssetUrl(asset: ModelAsset): string {
  if (!/^assets\/models\/[a-zA-Z0-9_./-]+\.glb$/.test(asset.path) || asset.path.split('/').includes('..')) {
    throw new Error(`Invalid model path: ${asset.id}`)
  }
  return `${import.meta.env.BASE_URL}${asset.path}?v=${encodeURIComponent(asset.version)}`
}
```

### `src/scene/detectWebGL.ts`

SHA-256: `8daae1fde8669658802f18c5417061dd6e6341516c6697f33f4b32675f1fc336`. Complete original file.

```ts
/** Three's WebGLRenderer requires WebGL 2. Release the short-lived probe. */
export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2')
    if (!context) return false
    context.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}
```

### `src/scene/environment/ContactGrounding.tsx`

SHA-256: `0f5f40f1e65ff9d3ee51f0aed229c845a8def20e9137f397c5d639aa74fd3851`. Complete original file.

```tsx
import { useEffect, useMemo } from 'react'
import { DataTexture, LinearFilter, PlaneGeometry, RGBAFormat, UnsignedByteType } from 'three'

/** Art-directed static contact patches, not a claim of ray-traced/baked AO.
 * Authored equipment positions are fixed in this slice; update these if equipment moves.
 */
export function ContactGrounding() {
  const resources = useMemo(() => {
    const size = 128
    const pixels = new Uint8Array(size * size * 4)
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const dx = Math.max(Math.abs((x / (size - 1)) * 2 - 1) - .58, 0)
      const dy = Math.max(Math.abs((y / (size - 1)) * 2 - 1) - .63, 0)
      const alpha = Math.exp(-(dx * dx + dy * dy) * 45) * .58
      const offset = (y * size + x) * 4
      pixels[offset] = pixels[offset + 1] = pixels[offset + 2] = 255
      pixels[offset + 3] = Math.round(alpha * 255)
    }
    const map = new DataTexture(pixels, size, size, RGBAFormat, UnsignedByteType)
    map.magFilter = map.minFilter = LinearFilter
    map.needsUpdate = true
    return { map, geometry: new PlaneGeometry(1, 1) }
  }, [])
  useEffect(() => () => { resources.map.dispose(); resources.geometry.dispose() }, [resources])
  return <group name="static-contact-grounding">
    <mesh geometry={resources.geometry} rotation={[-Math.PI / 2, 0, 0]} position={[-.4, .072, -.18]} scale={[1.9, 3.4, 1]} renderOrder={1} raycast={() => {}}>
      <meshBasicMaterial map={resources.map} color="#07111a" transparent opacity={.78} depthWrite={false} toneMapped={false} />
    </mesh>
    <mesh geometry={resources.geometry} rotation={[-Math.PI / 2, 0, 0]} position={[2.2, .074, -2.25]} scale={[1.35, 1.25, 1]} renderOrder={1} raycast={() => {}}>
      <meshBasicMaterial map={resources.map} color="#07111a" transparent opacity={.70} depthWrite={false} toneMapped={false} />
    </mesh>
  </group>
}
```

### `src/scene/environment/LightingRig.tsx`

SHA-256: `aefa94f1f28c262b23b483a315606a11e8382e12134a7c89ec64165abd5200e1`. Complete original file.

```tsx
import { useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { Object3D, PMREMGenerator } from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { qualitySettings, type QualityTier } from '../quality/config'

export function LightingRig({ quality }: { quality: QualityTier }) {
  const { gl, scene, invalidate } = useThree()
  const targets = useMemo(() => {
    const key = new Object3D()
    key.position.set(-.4, .7, -.25)
    const fill = new Object3D()
    fill.position.set(1, 1, -2)
    return { key, fill }
  }, [])
  useEffect(() => {
    const generator = new PMREMGenerator(gl)
    const room = new RoomEnvironment()
    const environment = generator.fromScene(room, .04, .1, 100, { size: qualitySettings[quality].environmentResolution })
    const previous = scene.environment
    scene.environment = environment.texture
    scene.environmentIntensity = .28
    invalidate()
    return () => { scene.environment = previous; environment.dispose(); generator.dispose(); room.dispose() }
  }, [gl, scene, quality, invalidate])
  const settings = qualitySettings[quality]
  return <>
    <primitive object={targets.key} />
    <primitive object={targets.fill} />
    <hemisphereLight args={['#d5e7ee', '#56534b', .25]} />
    <spotLight position={[-2.25, 3.42, -.8]} target={targets.key} color="#fff0d6" intensity={140} angle={1.05} penumbra={.85} distance={12} decay={2} castShadow={settings.shadows} shadow-mapSize={[settings.shadowMap, settings.shadowMap]} shadow-bias={-.00015} shadow-normalBias={.012} shadow-camera-near={.2} shadow-camera-far={12} />
    <spotLight position={[2.25, 3.42, -1.1]} target={targets.fill} color="#d9efff" intensity={50} angle={1.15} penumbra={1} distance={12} decay={2} />
    <directionalLight position={[0, 2.8, 4]} color="#d4e1e8" intensity={.28} />
  </>
}
```

### `src/scene/environment/ScenePlaceholder.tsx`

SHA-256: `8e677d698fed24c424bb704fd98c6f43596c1ff2ad5dc350875a1b36038aedba`. Complete original file.

```tsx
/** Deliberately no spacecraft meshes, borrowed assets or pretend final environment. */
export function ScenePlaceholder() {
  return <group name="future-medical-bay" />
}
```

### `src/scene/environment/materials.ts`

SHA-256: `8d87a2fd1da089bd230f283462eaf1da47475aed94ab6147a0dec3559b37c0e5`. Complete original file.

```ts
import { Mesh, MeshStandardMaterial, RepeatWrapping, Texture } from 'three'
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js'

/** Calibrated sRGB art palette. GLB metallic/roughness/normal maps remain authoritative. */
const palette: Record<string, string> = {
  'Graphite enamel': '#27343c',
  'Recessed titanium panels': '#53626b',
  'Satin aluminium': '#86959b',
  'Recess and gasket': '#111c22',
  'Ceramic medical shell': '#dedfd5',
  'Medical upholstery': '#234147',
  'Restraint webbing': '#18232b',
  'Ivory equipment marking': '#becfcf',
  'Coated pressure frame': '#34454f',
  'Anodized deck alloy': '#34434b',
}

export function createBayMaterials(models: GLTF[]): Map<string, MeshStandardMaterial> {
  const materials = new Map<string, MeshStandardMaterial>()
  const tiles = new Map<Texture, Texture>()
  models.forEach(model => model.scene.traverse(object => {
    if (!(object instanceof Mesh) || !(object.material instanceof MeshStandardMaterial)) return
    const name = object.material.name
    if (materials.has(name)) return
    const material = object.material.clone()
    for (const slot of ['normalMap', 'roughnessMap', 'metalnessMap'] as const) {
      const source = material[slot]
      if (!source) continue
      if (!tiles.has(source)) {
        const texture = source.clone()
        texture.wrapS = texture.wrapT = RepeatWrapping
        texture.repeat.set(6, 6)
        texture.anisotropy = 2
        texture.needsUpdate = true
        tiles.set(source, texture)
      }
      material[slot] = tiles.get(source)!
    }
    material.normalScale.set(.15, .15)
    if (palette[name]) material.color.set(palette[name])
    if (name === 'Cyan operational indicator') {
      material.color.set('#68c9d1')
      material.emissive.set('#46bdc9')
      material.emissiveIntensity = 1.25
    }
    if (name === 'Scanner sensing indicator') {
      material.color.set('#64b8c2')
      material.emissive.set('#4aa8b8')
      material.emissiveIntensity = .65
    }
    if (name === 'Satin aluminium') { material.metalness = .72; material.roughness = 1 }
    if (name === 'Ceramic medical shell') material.roughness = 1
    materials.set(name, material)
  }))
  return materials
}

export function disposeBayMaterials(materials: Map<string, MeshStandardMaterial>) {
  const textures = new Set<Texture>()
  materials.forEach(material => {
    for (const texture of [material.normalMap, material.roughnessMap, material.metalnessMap]) if (texture) textures.add(texture)
    material.dispose()
  })
  textures.forEach(texture => texture.dispose())
}
```

### `src/scene/quality/SceneTelemetry.tsx`

SHA-256: `9fc59ad1e4188d4a4a57dd28737e116dfaca84458396d194a6c4d1e42ad073d8`. Complete original file.

```tsx
import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, type Camera, type Object3D } from 'three'
import type { QualityTier } from './config'
import { summarizeFrames, type FrameSample } from './metrics'

/** Foreground active rendering, measured only after model readiness and warmup.
 * CPU submission cost is distinct from GPU completion/presentation time.
 */
export function SceneTelemetry({ quality, benchmark }: { quality: QualityTier; benchmark: boolean }) {
  const { gl } = useThree()
  const lastReport = useRef(0)
  const rendererName = useRef('Unknown renderer')
  const sample = useRef({ last: 0, frame: 0, rows: [] as FrameSample[], cpuRenderMs: 0, moved: 0, position: new Vector3(), measuringSince: 0, complete: false })
  useEffect(() => {
    sample.current = { last: 0, frame: 0, rows: [], cpuRenderMs: 0, moved: 0, position: new Vector3(), measuringSince: 0, complete: false }
    gl.domElement.dataset.quality = quality
    const context = gl.getContext()
    const debug = context.getExtension('WEBGL_debug_renderer_info')
    rendererName.current = debug ? context.getParameter(debug.UNMASKED_RENDERER_WEBGL) : context.getParameter(context.RENDERER)
    gl.domElement.dataset.benchmarkStatus = benchmark ? 'warming' : 'idle'
    if (!benchmark) return
    const original = gl.render
    function measuredRender(scene: Object3D, camera: Camera) {
      const started = performance.now()
      try { original.call(gl, scene, camera) }
      finally { sample.current.cpuRenderMs = performance.now() - started }
    }
    gl.render = measuredRender
    return () => { if (gl.render === measuredRender) gl.render = original }
  }, [gl, benchmark, quality])
  useFrame(state => {
    const now = performance.now()
    const current = sample.current
    if (benchmark && !current.complete) {
      current.frame++
      if (current.frame > 3 && current.last) {
        if (!current.measuringSince) current.measuringSince = current.last
        current.rows.push({ intervalMs: now - current.last, cpuRenderMs: current.cpuRenderMs, visible: document.visibilityState === 'visible', alwaysRendering: state.frameloop === 'always' })
        current.moved += current.position.distanceTo(state.camera.position)
        const elapsed = now - current.measuringSince
        current.complete = (elapsed >= 5000 && current.rows.length >= 12) || elapsed >= 30000 || current.rows.length >= 300
      }
      current.position.copy(state.camera.position)
      current.last = now
      gl.domElement.dataset.benchmarkStatus = current.complete ? 'complete' : current.frame <= 3 ? 'warming' : 'measuring'
    }
    if (now - lastReport.current > 500 || current.complete) {
      gl.domElement.dataset.renderStats = JSON.stringify({
        calls: gl.info.render.calls, triangles: gl.info.render.triangles,
        geometries: gl.info.memory.geometries, textures: gl.info.memory.textures,
        quality, frameloop: state.frameloop,
        renderer: rendererName.current,
        visibility: document.visibilityState,
        ...summarizeFrames(current.rows, current.moved),
        benchmarkComplete: current.complete,
      })
      lastReport.current = now
    }
    if (current.complete && state.frameloop !== 'demand') state.setFrameloop('demand')
  })
  return null
}
```

### `src/scene/quality/config.ts`

SHA-256: `957c99153ce2695effe7babc980de1c651c6388f05313e3073146170a23b87ca`. Complete original file.

```ts
export type QualityTier = 'standard' | 'low'
export const qualitySettings = {
  standard: { dpr: [1, 1.5] as [number, number], antialias: true, shadows: true, shadowMap: 1024, environmentResolution: 128 },
  low: { dpr: [1, 1] as [number, number], antialias: false, shadows: false, shadowMap: 512, environmentResolution: 64 },
} satisfies Record<QualityTier, { dpr: [number, number]; antialias: boolean; shadows: boolean; shadowMap: number; environmentResolution: number }>
```

### `src/scene/quality/metrics.ts`

SHA-256: `a18fda6412802efdf03cb49b75e773b71f2f3514d3384568a2089743720386dd`. Complete original file.

```ts
export interface FrameSample {
  intervalMs: number
  cpuRenderMs: number
  visible: boolean
  alwaysRendering: boolean
}

export function summarizeFrames(samples: readonly FrameSample[], movedDistance: number) {
  const periods = samples.map(sample => sample.intervalMs).filter(value => Number.isFinite(value) && value > 0)
  const elapsedMs = periods.reduce((sum, value) => sum + value, 0)
  const sorted = [...periods].sort((a, b) => a - b)
  const percentile = (values: number[], p: number) => values[Math.min(values.length - 1, Math.floor(values.length * p))] ?? null
  const cpu = samples.map(sample => sample.cpuRenderMs).sort((a, b) => a - b)
  const visibilityValid = samples.length > 0 && samples.every(sample => sample.visible)
  const activeModeValid = samples.length > 0 && samples.every(sample => sample.alwaysRendering)
  return {
    sampledFrames: periods.length,
    elapsedMs,
    fps: elapsedMs ? periods.length * 1000 / elapsedMs : null,
    averageFrameMs: periods.length ? elapsedMs / periods.length : null,
    medianFrameMs: percentile(sorted, .5),
    p95FrameMs: percentile(sorted, .95),
    medianCpuRenderMs: percentile(cpu, .5),
    p95CpuRenderMs: percentile(cpu, .95),
    visibilityValid,
    activeModeValid,
    movedDistance,
    representativeNavigation: visibilityValid && activeModeValid && periods.length >= 12 && movedDistance > .1,
    limitedSample: periods.length < 30,
  }
}
```

### `src/styles/immersive.css`

SHA-256: `de1984c844cfb47c842a25772ef92f48016126b210e1b1f39a5880f0f75e3c1c`. Complete original file.

```css
@font-face { font-family: Barlow; src: url('/assets/fonts/barlow-400.woff2') format('woff2'); font-style: normal; font-weight: 400; font-display: swap; }
@font-face { font-family: Barlow; src: url('/assets/fonts/barlow-500.woff2') format('woff2'); font-style: normal; font-weight: 500; font-display: swap; }
@font-face { font-family: Barlow; src: url('/assets/fonts/barlow-600.woff2') format('woff2'); font-style: normal; font-weight: 600; font-display: swap; }
@font-face { font-family: 'Barlow Condensed'; src: url('/assets/fonts/barlow-condensed-500.woff2') format('woff2'); font-style: normal; font-weight: 500; font-display: swap; }

:root { --font-sans: Barlow, 'Segoe UI', sans-serif; --font-display: 'Barlow Condensed', Barlow, sans-serif; }

@layer components {
  .workspace-shell.flat-workspace { flex: 1; display: flex; flex-direction: column; }
  .workspace-disclosure { color: var(--text-muted); font-size: .75rem; margin: .5rem 0 1rem; }
  .app-shell.bay-shell { width: 100%; max-width: none; height: 100dvh; min-height: 540px; padding: 0; overflow: hidden; background: #09131b; }
  .bay-shell .app-header { position: absolute; top: 18px; left: 24px; z-index: 8; border: 0; min-height: 0; gap: 1.1rem; }
  .bay-shell .brand { font-size: 1.3rem; background: rgb(10 23 31 / 92%); border: 1px solid #415561; padding: .65rem .9rem; border-radius: 4px; }
  .bay-shell .brand svg { width: 26px; height: 26px; }
  .bay-shell .brand-detail { font-size: .7rem; }
  .bay-shell .simulation-badge { background: #13232e; color: #bbd1da; font-size: .72rem; padding: .35rem .6rem; }
  .bay-shell .app-footer { display: none; }
  .bay-shell .immersive-workspace { position: relative; height: 100%; min-height: 0; }
  .bay-shell .workspace-toolbar { position: absolute; top: 18px; right: 24px; z-index: 8; padding: .45rem .7rem; border: 1px solid #415561; background: rgb(10 23 31 / 94%); border-radius: 4px; gap: 1rem; }
  .bay-shell .mission-summary { display: none; }
  .bay-shell .crew-field { font-size: .75rem; color: #b5c7d0; }
  .bay-shell .crew-field select { min-height: 42px; font-size: .9rem; border: 0; background: #1c303c; }
  .bay-shell .workspace-grid:not(.dashboard-layout) { display: block; width: 100%; height: 100%; min-height: 0; }
  .bay-shell .workspace-grid:not(.dashboard-layout) .scene-viewport { position: absolute; inset: 0; height: 100%; min-height: 0; border: 0; border-radius: 0; }
  .bay-shell .station-navigation { position: absolute; left: 24px; top: 116px; z-index: 7; width: 142px; display: flex; flex-direction: column; padding: .4rem; gap: .25rem; border: 1px solid #3c5360; background: rgb(10 23 31 / 93%); border-radius: 4px; }
  .bay-shell .station-link { min-height: 42px; padding: .45rem .65rem; font-size: .86rem; color: #b4c9d2; border-radius: 2px; }
  .bay-shell .station-link.active { border-color: #567786; background: #203943; color: #b8edf0; }
  .bay-shell .bay-module-panel { position: absolute; z-index: 7; right: 24px; top: 110px; width: 302px; max-height: calc(100dvh - 255px); border: 1px solid #425e6d; background: rgb(13 28 39 / 96%); border-radius: 4px; overflow: auto; box-shadow: 0 12px 40px rgb(0 0 0 / 18%); }
  .bay-shell .module-panel-toggle { display: flex; align-items: center; justify-content: space-between; width: 100%; min-height: 42px; padding: .6rem .9rem; border: 0; background: #1a303d; font-size: .83rem; color: #cce1e8; }
  .bay-shell .workspace-grid:not(.dashboard-layout) .holographic-panel { padding: 1rem; border: 0; border-radius: 0; background: transparent; }
  .bay-shell .workspace-grid:not(.dashboard-layout) .holographic-panel h1 { font-size: 1.5rem; font-weight: 500; }
  .bay-shell .module-description { font-size: .9rem; line-height: 1.5; }
  .bay-shell .fixture-preview { font-size: .88rem; }
  .bay-shell .data-provenance { font-size: .7rem; line-height: 1.5; margin: .5rem 1rem 1rem; border-top: 1px solid #344c59; padding-top: .75rem; }
  .bay-shell .scope-note { font-size: .75rem; }
  .bay-shell .environment-id { top: auto; bottom: 73px; left: 24px; background: transparent; padding: 0 0 0 .75rem; border-color: #7eb0ba; }
  .bay-shell .environment-id > span { font-size: .7rem; }
  .bay-shell .environment-id strong { font-size: 1.6rem; font-weight: 500; }
  .bay-shell .environment-id small { max-width: 28ch; font-size: .72rem; color: #c0d0d5; }
  .bay-shell .scene-tools { bottom: 87px; left: 50%; right: auto; transform: translateX(-50%); justify-content: center; gap: .5rem; max-width: calc(100vw - 420px); width: max-content; }
  .bay-shell .camera-views { padding: .2rem; background: rgb(10 23 31 / 94%); border-color: #4f6a78; }
  .bay-shell .camera-views button { font-size: .85rem; padding: .4rem .85rem; }
  .bay-shell .scene-tools p { text-align: center; font-size: .7rem; color: #c5d5da; }
  .bay-shell .quality-select { background: rgb(10 23 31 / 94%); border-color: #4f6a78; padding: .25rem .5rem; }
  .bay-shell .quality-select select { min-height: 38px; }
  .bay-shell .viewport-status { left: 50%; right: auto; bottom: auto; top: 24px; transform: translateX(-50%); padding: .1rem .7rem; border: 1px solid #3f5966; border-radius: 4px; background: rgb(10 23 31 / 92%); font-size: .7rem; gap: .75rem; white-space: nowrap; }
  .bay-shell .viewport-status button { font-size: .7rem; min-height: 36px; }
  .bay-shell .workspace-controls { position: absolute; left: 24px; right: 24px; bottom: 24px; z-index: 8; display: flex; gap: 1rem; margin: 0; font-size: .8rem; }
  .bay-shell .workspace-controls > a, .bay-shell .workspace-controls .motion-option, .bay-shell .emergency-trigger { padding: .35rem .7rem; border: 1px solid #3d5765; background: rgb(10 23 31 / 94%); border-radius: 4px; min-height: 40px; font-size: .78rem; }
  .bay-shell .workspace-controls .motion-option input { width: 16px; height: 16px; }
  .bay-shell .workspace-disclosure { position: absolute; left: 24px; bottom: 3px; z-index: 8; margin: 0; font-size: .65rem; color: #a5bcc7; }
  .bay-shell .scene-recovery { margin: 150px auto 0; max-width: 580px; padding: 2rem; background: #142936; border: 1px solid #4b6674; }
  .bay-shell .environment-loading { background: #0e1d27; }
  .bay-shell .standby-check { pointer-events: auto; min-height: 44px; padding: .45rem .8rem; color: #cce7ea; border: 1px solid #4f6a78; background: #142a35; border-radius: 4px; font-size: .8rem; }
  .bay-shell .standby-status { flex-basis: 100%; text-align: center; }
  .mission-entry { max-width: none; display: grid; grid-template-columns: 1.15fr .85fr; align-items: center; column-gap: 4rem; }
  .mission-copy { max-width: 680px; }
  .mission-entry h1 { font-family: var(--font-display); font-weight: 500; font-size: clamp(3rem, 7vw, 6rem); line-height: 1; margin: 1.25rem 0; max-width: 12ch; }
  .mission-entry .mission-mark { display: none; }
  .mission-intro { max-width: 48ch; font-size: 1.1rem; }
  .mission-brief { align-self: center; padding: 2rem; border: 1px solid #3d5261; background: #132330; border-radius: 4px; }
  .mission-brief svg { width: 100%; height: auto; max-height: 300px; color: #8ab9c2; }
  .mission-brief h2 { font-family: var(--font-display); font-size: 1.7rem; font-weight: 500; }
  .mission-brief p { color: #b0c4cf; font-size: .9rem; max-width: 45ch; }
}

@media (max-width: 1100px) {
  .bay-shell .simulation-badge { display: none; }
  .bay-shell .viewport-status { top: 85px; left: auto; right: 24px; transform: none; }
  .bay-shell .bay-module-panel { top: 136px; width: 280px; }
  .bay-shell .scene-tools { bottom: 115px; max-width: calc(100vw - 200px); left: 58%; }
  .bay-shell .environment-id { bottom: 84px; }
  .mission-entry { column-gap: 2rem; }
}
@media (max-width: 767px) {
  .app-shell.bay-shell { min-height: 620px; }
  .bay-shell .app-header { left: 12px; top: 12px; }
  .bay-shell .brand { font-size: 1.1rem; padding: .5rem; }
  .bay-shell .brand svg { display: none; }
  .bay-shell .workspace-toolbar { top: 12px; right: 12px; max-width: 56%; padding: .3rem; }
  .bay-shell .crew-field { gap: .3rem; flex-wrap: nowrap; }
  .bay-shell .crew-field select { font-size: .75rem; min-height: 40px; width: 150px; }
  .bay-shell .station-navigation { top: 88px; left: 12px; width: 110px; padding: .25rem; gap: 0; }
  .bay-shell .station-link { padding: .35rem; font-size: .75rem; min-height: 36px; }
  .bay-shell .viewport-status { left: 12px; right: 12px; top: auto; bottom: 76px; transform: none; padding: 0 .5rem; font-size: .65rem; justify-content: space-between; }
  .bay-shell .bay-module-panel { top: 88px; right: 12px; width: min(250px, calc(100vw - 148px)); max-height: calc(100dvh - 300px); }
  .bay-shell .module-panel-toggle { font-size: .72rem; min-height: 36px; padding: .4rem .55rem; }
  .bay-shell .workspace-grid:not(.dashboard-layout) .holographic-panel { padding: .7rem; }
  .bay-shell .environment-id { bottom: 245px; left: 12px; }
  .bay-shell .environment-id strong { font-size: 1.25rem; }
  .bay-shell .environment-id small { max-width: 23ch; }
  .bay-shell .scene-tools { left: 12px; right: 12px; bottom: 119px; max-width: none; width: auto; transform: none; gap: .35rem; justify-content: flex-start; }
  .bay-shell .camera-views { width: 100%; justify-content: space-between; }
  .bay-shell .camera-views button { font-size: .72rem; padding: .35rem .5rem; }
  .bay-shell .scene-tools p { display: none; }
  .bay-shell .workspace-controls { left: 12px; right: 12px; bottom: 26px; gap: .35rem; flex-wrap: nowrap; }
  .bay-shell .workspace-controls > a, .bay-shell .workspace-controls .motion-option, .bay-shell .emergency-trigger { font-size: .65rem; padding: .3rem; gap: .3rem; }
  .bay-shell .workspace-disclosure { left: 12px; font-size: .58rem; }
  .bay-shell .scene-recovery { margin: 140px 12px 0; padding: 1rem; }
  .mission-entry { display: block; padding-top: 2rem; }
  .mission-entry h1 { max-width: 12ch; }
  .mission-brief { margin: 2rem 0 1rem; padding: 1.5rem; }
  .mission-brief svg { max-height: 180px; }
}
@media (prefers-reduced-motion: reduce) { .mission-entry *, .bay-shell * { transition-duration: 0ms !important; animation-duration: 0ms !important; } }
```

### `src/styles/index.css`

SHA-256: `7f23347ef7810a875de262ba1e286ffe279d83aa7dcbe6bd10eef3b1cbb7f322`. Complete original file.

```css
@import 'tailwindcss';
@import './tokens.css';

@layer base {
  * { box-sizing: border-box; }
  body { margin: 0; min-width: 320px; background: var(--color-hull); color: var(--color-porcelain); font-family: var(--font-sans); font-size: 16px; line-height: 1.6; }
  h1, h2 { font-family: var(--font-display); line-height: 1.18; font-weight: 600; text-wrap: balance; }
  h1 { font-size: clamp(1.65rem, 3vw, 2.6rem); margin: 1rem 0; }
  h2 { font-size: 1.4rem; margin: .75rem 0; }
  p { margin: .75rem 0; }
  button, input, select { font: inherit; }
  button, a, input, select { -webkit-tap-highlight-color: transparent; }
  button, select { cursor: pointer; }
  a { color: var(--color-hologram); text-underline-offset: 4px; }
  button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible, [tabindex='-1']:focus-visible { outline: 2px solid var(--color-hologram); outline-offset: 5px; }
  button { color: inherit; }
  button:disabled { opacity: .65; cursor: wait; }
  ::selection { background: var(--color-hologram); color: var(--color-hull); }
}

@layer components {
  .app-shell { max-width: 1800px; margin-inline: auto; padding: 0 clamp(1rem, 3vw, 3rem); min-height: 100dvh; display: flex; flex-direction: column; }
  .app-header { min-height: 96px; display: flex; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid var(--line); }
  .brand { display: flex; align-items: center; gap: .9rem; color: var(--color-porcelain); text-decoration: none; font-family: var(--font-display); font-size: 1.3rem; line-height: 1.2; }
  .brand svg { color: var(--color-hologram); flex-shrink: 0; }
  .brand-detail { display: block; margin-top: .3rem; color: var(--text-muted); font: .8rem var(--font-sans); }
  .simulation-badge, .phase-tag { color: var(--color-hologram); font-size: .8rem; }
  .simulation-badge { border: 1px solid var(--line); padding: .4rem .7rem; border-radius: var(--radius); }
  .mission-entry { max-width: 850px; padding: clamp(3rem, 8vh, 7rem) 0; flex: 1; }
  .mission-mark { width: 64px; height: 64px; border: 1px solid var(--line); border-radius: 50%; display: grid; place-items: center; font-size: 2rem; color: var(--color-hologram); margin-bottom: 2rem; }
  .mission-entry h1 { font-size: clamp(2.5rem, 6vw, 5rem); max-width: 14ch; }
  .mission-context { color: var(--text-muted); font-size: .85rem; margin: 0 0 .4rem; }
  .mission-intro { color: var(--text-muted); max-width: 60ch; font-size: 1.15rem; }
  .simulation-note { color: var(--color-caution); font-size: .9rem; margin: 1.5rem 0; }
  .action-row { display: flex; align-items: center; flex-wrap: wrap; gap: .75rem; margin: 1.5rem 0; }
  .button { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: .65rem 1.2rem; border: 1px solid var(--color-hologram); border-radius: var(--radius); background: var(--color-hologram); color: var(--color-hull); text-decoration: none; font-weight: 600; transition: background var(--motion-fast), border-color var(--motion-fast); }
  .button:hover { background: #a4edf5; }
  .button-secondary { background: transparent; border-color: var(--line); color: var(--color-porcelain); }
  .button-secondary:hover { background: var(--surface-raised); }
  .button-critical { background: transparent; color: var(--color-critical); border-color: var(--color-critical); }
  .button-critical:hover { background: #462b35; }
  .scope-note { color: var(--text-muted); font-size: .85rem; max-width: 65ch; margin-top: 1.5rem; }
  .workspace-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 1.5rem 0; flex-wrap: wrap; }
  .crew-field { display: flex; align-items: center; gap: .75rem; font-size: .9rem; }
  .crew-field select { background: var(--surface); border: 1px solid var(--line); color: var(--color-porcelain); min-height: 44px; border-radius: var(--radius); padding: .5rem; max-width: 100%; }
  .station-navigation { display: flex; flex-wrap: wrap; gap: .4rem; padding: .5rem 0 1rem; }
  .station-link { display: flex; gap: .6rem; align-items: center; min-height: 44px; padding: .5rem .9rem; color: var(--text-muted); border: 1px solid transparent; border-radius: var(--radius); text-decoration: none; }
  .station-link:hover { background: var(--surface); color: var(--color-porcelain); }
  .station-link.active { background: var(--surface-raised); border-color: var(--line); color: var(--color-hologram); }
  .station-indicator { width: 5px; height: 5px; background: currentColor; border-radius: 50%; }
  .workspace-grid { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(340px, .8fr); gap: 1rem; flex: 1; min-height: 440px; }
  .workspace-grid.dashboard-layout { grid-template-columns: 1fr; max-width: 960px; width: 100%; min-height: 360px; }
  .scene-viewport { position: relative; min-height: 440px; border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; background: var(--color-hull); }
  .canvas-layer { position: absolute; inset: 0; }
  .viewport-caption { position: absolute; inset: 0; padding: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; pointer-events: none; }
  .viewport-caption p { max-width: 38ch; color: var(--text-muted); font-size: .85rem; }
  .viewport-caption h2 { max-width: 22ch; font-size: 1.5rem; }
  .viewport-reticle { color: var(--color-hologram); font-size: 2rem; font-weight: 200; }
  .viewport-status { position: absolute; inset: auto 0 0; display: flex; align-items: center; justify-content: space-between; gap: .5rem; padding: .5rem 1rem; background: var(--surface); border-top: 1px solid var(--line); font-size: .75rem; }
  .viewport-status button { min-height: 44px; padding: .4rem; background: transparent; color: var(--color-hologram); border: 0; }
  .station-content { min-width: 0; }
  .holographic-panel { min-height: 100%; border: 1px solid var(--line); border-top: 2px solid var(--color-hologram); background: var(--surface); border-radius: var(--radius); padding: clamp(1.25rem, 2.5vw, 2.5rem); }
  .module-description { color: var(--text-muted); max-width: 65ch; }
  .fixture-preview { margin: 1.5rem 0; padding-top: 1rem; border-top: 1px solid var(--line); }
  .fixture-preview dl { display: grid; gap: 1rem; margin: 0; }
  .fixture-preview dl > div { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; flex-wrap: wrap; }
  dt { color: var(--text-muted); font-size: .9rem; }
  dd { margin: 0; font-size: 1.1rem; font-variant-numeric: tabular-nums; }
  .workspace-controls { display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap; margin: 1rem 0 0; font-size: .85rem; }
  .workspace-controls > a { min-height: 44px; display: inline-flex; align-items: center; }
  .motion-option { display: flex; align-items: center; min-height: 44px; gap: .7rem; color: var(--text-muted); font-size: .9rem; cursor: pointer; }
  .motion-option input { width: 20px; height: 20px; accent-color: var(--color-hologram); }
  .emergency-trigger { color: var(--color-critical); background: transparent; border: 1px solid var(--line); border-radius: var(--radius); min-height: 44px; padding: .4rem .8rem; margin-left: auto; }
  .data-provenance { color: var(--text-muted); font-size: .75rem; margin: .75rem 0 1.5rem; }
  .app-footer { margin-top: auto; min-height: 72px; border-top: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; gap: .5rem 2rem; flex-wrap: wrap; padding-block: 1rem; font-size: .75rem; color: var(--text-muted); }
  .emergency-dialog { max-width: min(600px, calc(100vw - 2rem)); max-height: calc(100dvh - 2rem); overflow: auto; margin: auto; padding: 2rem; background: var(--surface); color: var(--color-porcelain); border: 1px solid var(--color-critical); border-radius: var(--radius); }
  .emergency-dialog::backdrop { background: rgb(4 10 17 / 85%); }
  .emergency-dialog ol { padding-left: 1.5rem; margin: 1.5rem 0; list-style: decimal; }
  .emergency-dialog li { margin: .75rem 0; }
  .recovery, .scene-recovery { padding: 2rem; }
  .scene-recovery { position: relative; }
  .loading-state { padding: 1rem; color: var(--text-muted); }
  .skip-link { position: fixed; top: 1rem; left: 1rem; z-index: 100; padding: .7rem 1rem; background: var(--color-hologram); color: var(--color-hull); transform: translateY(-200%); }
  .skip-link:focus { transform: translateY(0); }
}

@media (max-width: 1199px) {
  .workspace-grid { grid-template-columns: 1fr; }
  .scene-viewport { min-height: 320px; }
}
@media (max-width: 767px) {
  .app-header { min-height: 88px; }
  .simulation-badge { max-width: 125px; font-size: .7rem; }
  .brand { font-size: 1.1rem; gap: .6rem; }
  .brand-detail { font-size: .7rem; }
  .crew-field { flex-wrap: wrap; width: 100%; }
  .crew-field select { flex: 1; min-width: 0; }
  .station-link { padding: .5rem .7rem; font-size: .85rem; }
  .workspace-grid { min-height: 0; }
  .scene-viewport { min-height: 360px; }
  .viewport-caption { padding: 1.25rem 1.25rem 4rem; }
  .viewport-status { flex-wrap: wrap; }
  .emergency-trigger { margin-left: 0; }
  .holographic-panel { padding: 1.25rem; }
  .mission-entry { padding-top: 2.5rem; }
  .mission-mark { margin-bottom: 1.5rem; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; transition-duration: 0ms !important; animation-duration: 0ms !important; }
}

/* Phase 3: the bay occupies the primary workspace; clinical feature entries stay below. */
@layer components {
  .workspace-grid:not(.dashboard-layout) { grid-template-columns: minmax(0, 1fr); }
  .workspace-grid:not(.dashboard-layout) .scene-viewport { min-height: 660px; height: min(76vh, 900px); }
  .workspace-grid:not(.dashboard-layout) .holographic-panel { min-height: 0; padding: 1.25rem 1.5rem; }
  .workspace-grid:not(.dashboard-layout) .holographic-panel h1 { font-size: 1.45rem; margin: .5rem 0; }
  .workspace-grid:not(.dashboard-layout) .fixture-preview { margin: 1rem 0 0; }
  .workspace-grid:not(.dashboard-layout) .fixture-preview dl { grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); }
  .workspace-grid:not(.dashboard-layout) .scope-note { margin-top: .75rem; }
  .environment-loading { position: absolute; inset: 0; background: #101b2a; display: grid; place-items: center; padding: 2rem; text-align: center; color: var(--text-muted); z-index: 2; }
  .environment-id { position: absolute; left: 1.5rem; top: 1.25rem; display: flex; flex-direction: column; gap: .2rem; padding: .7rem 1rem; background: rgb(12 23 32 / 88%); border-left: 2px solid #79bdc6; pointer-events: none; text-shadow: 0 1px 8px #000; }
  .environment-id > span { color: #c3d6dc; font-size: .75rem; }
  .environment-id strong { font-family: var(--font-display); font-size: 1.25rem; font-weight: 500; }
  .environment-id small { color: #c3d6dc; font-size: .75rem; }
  .scene-tools { position: absolute; bottom: 4.8rem; left: 1.25rem; right: 1.25rem; display: flex; gap: .65rem 1rem; flex-wrap: wrap; align-items: center; pointer-events: none; z-index: 3; }
  .camera-views { display: flex; flex-wrap: wrap; gap: .3rem; pointer-events: auto; padding: .25rem; background: rgb(12 23 32 / 93%); border: 1px solid #59717f; border-radius: 5px; }
  .camera-views button { min-height: 44px; font-size: .82rem; padding: .45rem .8rem; border: 1px solid transparent; background: transparent; border-radius: 3px; }
  .camera-views button[aria-pressed='true'] { border-color: #72949d; background: #28414c; color: #c8f7fa; }
  .camera-views button:hover { background: #304a54; }
  .quality-select { background: rgb(12 23 32 / 93%); display: flex; gap: .65rem; align-items: center; pointer-events: auto; padding: .3rem .65rem; border: 1px solid #59717f; border-radius: 5px; font-size: .75rem; }
  .quality-select select { min-height: 40px; background: #1c303c; color: var(--color-porcelain); border: 0; border-radius: 3px; padding: .3rem; }
  .scene-tools p { flex-basis: 100%; color: #dce6ed; text-shadow: 0 1px 4px #000; margin: 0; font-size: .72rem; }
  .viewport-status { z-index: 3; }
}
@media (max-width: 767px) {
  .workspace-grid:not(.dashboard-layout) .scene-viewport { min-height: 600px; height: 76vh; }
  .scene-tools { bottom: 5.4rem; left: .75rem; right: .75rem; gap: .4rem; }
  .camera-views { gap: 0; }
  .camera-views button { padding: .4rem .5rem; font-size: .72rem; }
  .environment-id { left: 1rem; top: 1rem; }
}
```

### `src/styles/opening.css`

SHA-256: `10b13554b53bb132f8a9134ae5a29b79161f4d58beed84d0f08949a0f74ef3bb`. Complete original file.

```css
@font-face {
  font-family:Antonio;
  src:url('/assets/fonts/antonio-variable.ttf') format('truetype');
  font-weight:100 700;
  font-display:swap
}
.opening {
  --opening-paper:#eeeae2;
  --opening-wine:#602b3a;
  --opening-ink:#292831;
  --opening-quiet:#655960;
  --reveal:0;
  --intro-alpha:1;
  --arrival-alpha:0;
  --travel:0%;
  height:280svh;
  position:relative;
  background:var(--opening-paper);
  color:var(--opening-wine);
  font-family:Barlow,'Segoe UI',sans-serif;
  outline-offset:-4px;
  isolation:isolate;
  color-scheme:light
}
.opening * {
  box-sizing:border-box
}
.opening a {
  color:inherit;
  text-decoration:none
}
.opening button,.opening select {
  font:inherit
}
.opening button {
  color:inherit;
  cursor:pointer
}
.opening button:focus-visible,.opening a:focus-visible,.opening input:focus-visible,.opening select:focus-visible {
  outline:3px solid currentColor;
  outline-offset:6px
}
.opening-pin {
  position:sticky;
  top:0;
  height:100svh;
  min-height:650px;
  overflow:hidden;
  background:var(--opening-paper)
}
.opening-scene {
  position:absolute;
  inset:0;
  background:#18212a;
  clip-path:inset(calc((1 - var(--reveal))*10%) 0 calc((1 - var(--reveal))*9%) calc((1 - var(--reveal))*43%) round calc((1 - var(--reveal))*40vw) 0 0 calc((1 - var(--reveal))*40vw));
  z-index:0
}
.opening-scene canvas {
  display:block;
  width:100%;
  height:100%;
  touch-action:pan-y!important
}
.opening-scene>div:first-child {
  height:100%
}
.opening-header {
  position:absolute;
  z-index:4;
  top:0;
  left:0;
  right:0;
  padding:30px 48px;
  display:flex;
  align-items:center;
  gap:36px;
  color:var(--opening-wine)
}
.opening-wordmark {
  display:flex;
  align-items:center;
  gap:12px;
  font-size:36px;
  letter-spacing:-1.7px;
  font-weight:600;
  line-height:1
}
.opening-wordmark-dot {
  margin-left:-11px
}
.opening-emblem {
  display:block;
  width:34px;
  height:34px;
  position:relative;
  margin-right:3px;
  transform:rotate(-18deg)
}
.opening-emblem i {
  display:block;
  position:absolute;
  background:currentColor;
  inset:0 12px
}
.opening-emblem i+i {
  inset:12px 0
}
.opening-edition {
  font-size:13px;
  line-height:1.5;
  color:var(--opening-quiet);
  padding-left:24px;
  border-left:1px solid #602b3a55
}
.opening-edition span {
  font-size:12px
}
.opening-header nav {
  display:flex;
  align-items:center;
  gap:28px;
  margin-left:auto;
  font-size:14px
}
.opening-header nav button {
  padding:0;
  min-height:44px;
  border:0;
  background:none;
  display:flex;
  align-items:center;
  gap:10px
}
.opening-header nav button:hover {
  text-decoration:underline;
  text-underline-offset:6px
}
.opening-crew-initials {
  display:grid;
  place-items:center;
  width:32px;
  height:32px;
  border:1px solid currentColor;
  border-radius:50%;
  font-size:11px
}
.opening-header .opening-emergency {
  margin-left:4px;
  border-left:1px solid currentColor;
  padding-left:22px
}
.opening-emergency>span:first-child {
  font-size:26px;
  font-weight:400
}
.opening-intro {
  position:absolute;
  z-index:2;
  left:6.6%;
  top:19%;
  opacity:var(--intro-alpha);
  transform:translateY(calc((1 - var(--intro-alpha))*-40px));
  width:42%;
  pointer-events:none
}
.opening-intro button {
  pointer-events:auto
}
.opening-kicker {
  font-size:13px;
  margin:0;
  letter-spacing:.025em;
  font-weight:500;
  display:flex;
  align-items:center;
  gap:10px
}
.opening-kicker>span {
  display:block;
  width:6px;
  height:6px;
  border-radius:50%;
  background:currentColor
}
.opening-intro h1 {
  font-family:Antonio,sans-serif;
  font-weight:500;
  font-size:clamp(94px,10.4vw,164px);
  letter-spacing:-.055em;
  line-height:1.02;
  text-wrap:initial;
  margin:25px 0 24px;
  max-width:none
}
.opening-intro h1>span {
  padding-left:13%
}
.opening-intro-note {
  display:flex;
  gap:16px;
  align-items:start;
  color:var(--opening-quiet);
  margin-left:14%
}
.opening-intro-note>span {
  font-size:28px;
  line-height:1.3
}
.opening-intro-note p {
  font-size:15px;
  line-height:1.5;
  margin:0
}
.opening-scroll-invitation {
  display:flex;
  align-items:center;
  gap:15px;
  border:0;
  background:none;
  margin-top:30px;
  padding:0;
  min-height:52px;
  text-align:left;
  font-size:14px
}
.opening-scroll-circle {
  width:47px;
  height:47px;
  border:1px solid currentColor;
  border-radius:50%;
  display:grid;
  place-items:center;
  font-size:24px;
  transition:transform 180ms
}
.opening-scroll-invitation:hover .opening-scroll-circle {
  transform:translateY(4px)
}
.opening-scroll-invitation small {
  display:block;
  font-size:12px;
  color:var(--opening-quiet);
  margin-top:2px
}
.opening-curve-label {
  position:absolute;
  right:22px;
  top:29%;
  writing-mode:vertical-rl;
  font-size:11px;
  letter-spacing:.08em;
  color:#e8e1d5;
  z-index:2;
  opacity:var(--intro-alpha)
}
.opening-progress {
  position:absolute;
  bottom:112px;
  left:48px;
  right:48px;
  display:flex;
  align-items:center;
  gap:18px;
  font-size:11px;
  z-index:3;
  color:var(--opening-wine)
}
.opening-progress>div {
  width:130px;
  height:1px;
  background:currentColor;
  opacity:.6;
  position:relative
}
.opening-progress i {
  position:absolute;
  left:var(--travel);
  top:-3px;
  width:7px;
  height:7px;
  border-radius:50%;
  background:currentColor;
  transform:translateX(-50%)
}
.opening-bottom {
  position:absolute;
  z-index:3;
  bottom:27px;
  left:48px;
  right:48px;
  display:flex;
  gap:32px;
  align-items:center;
  justify-content:space-between;
  font-size:12px;
  color:var(--opening-wine)
}
.opening-bottom>a {
  min-height:44px;
  display:flex;
  align-items:center;
  gap:20px;
  font-size:13px
}
.opening-bottom p {
  font-size:11px;
  line-height:1.4;
  margin:0
}
.opening-render-state {
  font-size:11px;
  text-align:right
}
.opening-arrival {
  position:absolute;
  left:6.6%;
  top:23%;
  z-index:2;
  color:#f0e8dc;
  opacity:var(--arrival-alpha);
  transform:translateY(calc((1 - var(--arrival-alpha))*20px));
  max-width:350px;
  pointer-events:none
}
.opening-arrival a {
  pointer-events:auto
}
.opening-arrival .opening-kicker {
  font-size:12px
}
.opening-arrival h2 {
  font:500 clamp(44px,4.1vw,62px)/1.12 Antonio,sans-serif;
  letter-spacing:-.03em;
  margin:25px 0 22px;
  text-wrap:initial
}
.opening-arrival>p:not(.opening-kicker) {
  font-size:15px;
  line-height:1.6;
  color:#ddd7cd;
  margin:0 0 25px
}
.opening-enter {
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:32px;
  padding:17px 20px;
  background:#eeeae2;
  color:#602b3a!important;
  font-size:15px;
  font-weight:600;
  min-height:54px;
  width:max-content
}
.opening-enter span {
  font-size:22px
}
.opening-station-link {
  display:block;
  width:max-content;
  font-size:13px;
  min-height:44px;
  padding:16px 0 0;
  border-bottom:1px solid #eeeae288;
  margin-top:10px
}
.opening[data-immersed=true] .opening-header,.opening[data-immersed=true] .opening-progress,.opening[data-immersed=true] .opening-bottom {
  color:#f0e8dc
}
.opening[data-immersed=true] .opening-edition {
  color:#eeeae2;
  border-color:#eeeae277
}
.opening[data-immersed=true] .opening-header {
  background:#18212ae6
}
.opening[data-immersed=true] .opening-bottom {
  padding-top:14px;
  border-top:1px solid #eeeae244;
  background:#18212ad9
}
.opening-arrival:before {
  content:'';
  position:absolute;
  inset:-28px -24px -24px;
  background:#14212bed;
  z-index:-1;
  border-left:2px solid #d7bdad
}
.opening-loading {
  position:absolute;
  inset:0;
  display:grid;
  place-content:center;
  color:#eeeae2;
  background:#18212a;
  font-size:15px;
  text-align:center
}
.opening-recovery {
  height:100%;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  color:#eeeae2;
  text-align:center;
  padding:10%;
  background:#18212a
}
.opening-recovery h2 {
  font:500 36px Antonio,sans-serif;
  max-width:350px
}
.opening-recovery p {
  max-width:300px
}
.opening-recovery a,.opening-recovery button {
  margin-top:14px;
  min-height:44px;
  border:1px solid #eeeae2;
  background:transparent;
  padding:10px 16px;
  color:#eeeae2
}
.opening-cross {
  font-size:56px
}
.opening-index {
  width:min(600px,calc(100vw - 32px));
  max-height:calc(100svh - 40px);
  margin:auto;
  padding:32px 40px;
  background:#eeeae2;
  color:#602b3a;
  border:0;
  box-shadow:0 24px 100px #0005;
  font-family:Barlow,sans-serif;
  color-scheme:light
}
.opening-index::backdrop {
  background:#101b29c9
}
.opening-index a {
  color:inherit;
  text-decoration:none
}
.opening-index-top {
  display:flex;
  align-items:center;
  justify-content:space-between;
  font-size:12px
}
.opening-index-top button {
  min-width:44px;
  min-height:44px;
  border:0;
  background:none;
  color:inherit;
  font-size:30px
}
.opening-index h2 {
  font:500 42px/1.18 Antonio,sans-serif;
  letter-spacing:-.025em;
  margin:20px 0 28px
}
.opening-index label {
  font-size:14px
}
.opening-crew-select {
  display:grid;
  gap:8px;
  margin-bottom:20px
}
.opening-index select {
  color:#602b3a;
  background:#eeeae2;
  border:0;
  border-bottom:1px solid #602b3a77;
  padding:12px 4px;
  min-height:48px;
  font-family:inherit;
  font-size:15px;
  max-width:100%;
  width:100%
}
.opening-index nav {
  display:grid
}
.opening-index nav a {
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  min-height:49px;
  border-bottom:1px solid #602b3a33;
  font-size:15px
}
.opening-index nav a:hover {
  background:#602b3a0a
}
.opening-index fieldset {
  border:0;
  margin:28px 0 0;
  padding:0
}
.opening-index legend {
  font-size:12px;
  margin-bottom:12px
}
.opening-index fieldset label {
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:16px
}
.opening-index input {
  accent-color:#602b3a;
  width:18px;
  height:18px
}
.opening-index fieldset p {
  font-size:12px
}
.opening-index fieldset select {
  width:55%;
  margin-left:auto;
  font-size:13px
}
.opening-index-disclosure {
  font-size:12px;
  line-height:1.5;
  color:#655960;
  margin:22px 0 0
}
.opening-app + .emergency-dialog {
  background:#eeeae2;
  color:#602b3a;
  border:0;
  font-family:Barlow,sans-serif;
  border-top:5px solid #602b3a
}
.opening-app + .emergency-dialog h2 {
  font:500 36px Antonio,sans-serif
}
.opening-app + .emergency-dialog .phase-tag {
  color:#602b3a
}
.opening-app + .emergency-dialog .button {
  border:0;
  background:#602b3a;
  color:#eeeae2;
  border-radius:0
}
.opening-reduced .opening-scene {
  clip-path:none
}
.opening-reduced .opening-intro {
  padding:24px;
  background:#eeeae2ed;
  width:max-content;
  max-width:50%;
  top:17%
}
.opening-reduced .opening-intro h1 {
  font-size:clamp(72px,8vw,116px)
}
.opening-mobile-poster {
  position:absolute;
  inset:0;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  color:#d2b6b9;
  background:#602b3a;
  gap:20px
}
.opening-mobile-poster svg {
  width:68%;
  max-width:380px;
  stroke:currentColor;
  stroke-width:1
}
.opening-mobile-poster>span {
  font-size:11px
}
.opening-mobile-poster button {
  padding:12px 18px;
  background:#eeeae2;
  color:#602b3a;
  border:0;
  min-height:44px;
  font-size:14px
}
@media(min-width:1700px) {
  .opening-intro {
    top:18%
  }
  .opening-intro h1 {
    font-size:164px
  }
}
@media(max-height:800px) and (min-width:768px) {
  .opening-intro {
    top:17%
  }
  .opening-intro h1 {
    font-size:clamp(80px,9.3vw,112px);
    margin:18px 0
  }
  .opening-intro-note {
    display:none
  }
  .opening-scroll-invitation {
    margin-top:20px
  }
  .opening-progress {
    bottom:95px
  }
}
@media(max-width:1100px) and (min-width:768px) {
  .opening-header {
    padding:25px 32px;
    gap:20px
  }
  .opening-header nav {
    gap:18px
  }
  .opening-edition {
    display:none
  }
  .opening-intro {
    left:6%;
    top:24%
  }
  .opening-intro h1 {
    font-size:clamp(85px,11vw,120px)
  }
  .opening-bottom {
    left:32px;
    right:32px;
    gap:16px
  }
  .opening-render-state {
    display:none
  }
  .opening-arrival {
    left:6%;
    max-width:300px
  }
  .opening-arrival h2 {
    font-size:48px
  }
}
@media(max-width:767px) {
  .opening {
    height:230svh
  }
  .opening-pin {
    min-height:640px
  }
  .opening-header {
    padding:22px 22px;
    gap:14px
  }
  .opening-wordmark {
    font-size:30px
  }
  .opening-emblem {
    width:26px;
    height:26px
  }
  .opening-emblem i {
    inset:0 9px
  }
  .opening-emblem i+i {
    inset:9px 0
  }
  .opening-edition,.opening-crew-trigger>span:last-child {
    display:none
  }
  .opening-header nav {
    gap:15px;
    font-size:12px
  }
  .opening-header .opening-emergency {
    padding-left:12px;
    margin:0
  }
  .opening-emergency>span:last-child {
    display:none
  }
  .opening-crew-initials {
    width:28px;
    height:28px
  }
  .opening-scene {
    clip-path:inset(calc((1 - var(--reveal))*48%) 0 0 0 round calc((1 - var(--reveal))*40vw) calc((1 - var(--reveal))*40vw) 0 0)
  }
  .opening-intro {
    top:17%;
    left:7%;
    width:86%
  }
  .opening-intro h1 {
    font-size:clamp(68px,16vw,100px);
    line-height:1.03;
    margin:18px 0
  }
  .opening-intro h1 br:nth-of-type(2) {
    display:none
  }
  .opening-intro h1>span {
    padding-left:12px
  }
  .opening-intro-note {
    display:none
  }
  .opening-kicker {
    font-size:11px
  }
  .opening-scroll-invitation {
    position:absolute;
    right:0;
    top:130px;
    flex-direction:column;
    align-items:start;
    font-size:12px;
    gap:8px;
    margin-top:0;
    max-width:128px
  }
  .opening-scroll-invitation small {
    font-size:11px
  }
  .opening-scroll-circle {
    width:40px;
    height:40px;
    font-size:21px
  }
  .opening-curve-label {
    display:none
  }
  .opening-progress {
    bottom:94px;
    left:22px;
    right:22px;
    gap:12px;
    font-size:10px
  }
  .opening-progress>div {
    width:90px
  }
  .opening-bottom {
    bottom:15px;
    left:22px;
    right:22px;
    flex-wrap:wrap;
    gap:0;
    justify-content:flex-start
  }
  .opening-bottom>a {
    font-size:12px;
    min-height:36px
  }
  .opening-bottom p {
    font-size:10px;
    max-width:100%
  }
  .opening-render-state {
    display:none
  }
  .opening-arrival {
    top:25%;
    left:9%;
    max-width:80%;
    width:280px
  }
  .opening-arrival h2 {
    font-size:44px
  }
  .opening-arrival .opening-kicker {
    font-size:11px
  }
  .opening-arrival>p:not(.opening-kicker) {
    font-size:14px
  }
  .opening-arrival:before {
    inset:-22px -20px
  }
  .opening-index {
    padding:20px 24px
  }
  .opening-index h2 {
    font-size:34px
  }
  .opening-reduced .opening-intro {
    top:16%;
    left:5%;
    max-width:90%;
    width:90%;
    padding:20px
  }
  .opening-reduced .opening-intro h1 {
    font-size:70px
  }
  .opening-reduced .opening-scroll-invitation {
    top:145px;
    right:20px
  }
}
@media(prefers-reduced-motion:reduce) {
  .opening * {
    scroll-behavior:auto!important;
    transition:none!important
  }
}
/* Final opening composition: unboxed editorial text; the bay remains the surface. */
.opening-header {
  padding-top:21px;
  padding-bottom:21px
}
.opening[data-immersed=true] .opening-header {
  background:transparent;
  text-shadow:0 1px 5px #101b29
}
.opening[data-immersed=true] .opening-bottom {
  background:transparent;
  border:0;
  text-shadow:0 1px 4px #101b29
}
.opening-intro {
  top:17%
}
.opening-intro h1 {
  font-size:clamp(94px,9.7vw,148px);
  margin-bottom:22px
}
.opening-scroll-invitation {
  margin-top:23px
}
.opening-progress {
  left:auto;
  right:48px;
  bottom:116px
}
.opening-arrival {
  top:25%;
  max-width:300px
}
.opening-arrival:before {
  background:none;
  inset:-6px auto -6px -22px;
  width:1px;
  border-left:1px solid #eeeae288
}
.opening-arrival h2 {
  font-size:clamp(42px,3.8vw,55px)
}
.opening-arrival>p:not(.opening-kicker) {
  max-width:255px;
  font-size:14px;
  text-shadow:0 1px 3px #101b29
}
.opening-arrival h2,.opening-arrival .opening-kicker {
  text-shadow:0 2px 12px #101b2980
}
.opening-enter {
  padding:12px 17px;
  min-height:48px;
  font-size:14px
}
@media(max-width:767px) {
  .opening-intro {
    top:16%
  }
  .opening-intro h1 {
    font-size:clamp(68px,16vw,100px);
    margin-bottom:12px
  }
  .opening-scroll-invitation {
    position:static;
    flex-direction:row;
    align-items:center;
    gap:12px;
    max-width:none;
    margin-top:16px;
    font-size:12px
  }
  .opening-progress {
    right:22px;
    bottom:99px;
    left:auto
  }
  .opening-arrival {
    top:27%;
    left:10%;
    max-width:78%
  }
  .opening-arrival h2 {
    font-size:46px
  }
  .opening-arrival:before {
    left:-14px
  }
  .opening-reduced .opening-scroll-invitation {
    position:static
  }
}
@media(max-width:767px) {
  .opening-bottom,.opening-progress {
    color:#eeeae2
  }
  .opening-bottom {
    padding-top:10px
  }
  .opening-mobile-poster {
    padding-top:60px
  }
  .opening-mobile-poster svg {
    width:58%;
    max-height:220px
  }
}
@media(max-width:360px) {
  .opening-header .opening-crew-trigger {
    display:none
  }
  .opening-header {
    padding-inline:18px
  }
  .opening-wordmark {
    font-size:28px
  }
  .opening-header nav {
    gap:12px
  }
  .opening-intro h1 {
    font-size:68px
  }
  .opening-intro {
    top:17%
  }
  .opening-scroll-invitation {
    margin-top:14px
  }
  .opening-bottom {
    left:18px;
    right:18px
  }
  .opening-bottom p {
    font-size:10px
  }
}
.opening-progress {
  left:48px;
  right:auto
}
@media(max-width:767px) {
  .opening-progress {
    left:22px;
    right:auto
  }
}
/* Reduced motion retains the branded aperture as a still composition. */
.opening-reduced .opening-scene {
  clip-path:inset(10% 0 9% 43% round 40vw 0 0 40vw)
}
.opening-reduced .opening-intro {
  padding:0;
  background:none;
  width:42%;
  max-width:none
}
.opening-reduced .opening-arrival,.opening-reduced .opening-arrival>p:not(.opening-kicker) {
  color:#602b3a
}
.opening-reduced .opening-arrival h2,.opening-reduced .opening-arrival .opening-kicker,.opening-reduced .opening-arrival>p {
  text-shadow:none
}
.opening-reduced .opening-arrival:before,.opening-reduced .opening-station-link {
  border-color:#602b3a88
}
.opening-reduced .opening-enter {
  background:#602b3a;
  color:#eeeae2!important
}
.opening[data-immersed=true] .opening-header nav {
  background:#14212b;
  padding:0 14px;
  text-shadow:none
}
.opening-reduced .opening-curve-label {
  display:none
}
@media(max-width:767px) {
  .opening-reduced .opening-scene {
    clip-path:inset(48% 0 0 0 round 40vw 40vw 0 0)
  }
  .opening-reduced .opening-intro {
    left:7%;
    width:86%;
    max-width:none;
    padding:0
  }
  .opening-reduced .opening-arrival {
    top:16%
  }
  .opening-reduced .opening-arrival h2 {
    font-size:36px;
    margin:16px 0
  }
  .opening-reduced .opening-arrival>p:not(.opening-kicker) {
    display:none
  }
  .opening-live-mobile:not(.opening-reduced) .opening-arrival {
    top:auto;
    bottom:150px;
    left:22px;
    max-width:85%;
    width:auto
  }
  .opening-live-mobile:not(.opening-reduced) .opening-arrival h2 {
    font-size:36px;
    margin-bottom:14px
  }
  .opening-live-mobile:not(.opening-reduced) .opening-arrival>p:not(.opening-kicker) {
    display:none
  }
  .opening-live-mobile:not(.opening-reduced) .opening-arrival .opening-kicker {
    display:none
  }
  .opening[data-immersed=true] .opening-header nav {
    padding:0 8px
  }
}
@media(max-width:767px) {
  .opening-live-mobile:not(.opening-reduced) .opening-arrival h2 {
    display:none
  }
}
/* The identity changes ink only when the expanding aperture reaches its location. */
.opening[data-immersed=true][data-canvas-filled=false] .opening-wordmark{color:#602b3a;text-shadow:none}
.opening[data-immersed=true][data-canvas-filled=false] .opening-edition{visibility:hidden}
.opening[data-immersed=true][data-canvas-filled=false] .opening-progress{opacity:0}
.opening[data-immersed=true][data-canvas-filled=false] .opening-bottom>a{background:#eeeae2;color:#602b3a;text-shadow:none;padding-inline:8px}
.opening[data-immersed=true][data-canvas-filled=false] .opening-wordmark{color:#fff;mix-blend-mode:difference}
```

### `src/styles/tokens.css`

SHA-256: `9407a471c73094a5f6fa96fcb40bab4bace30852430c431054201074014e0a7c`. Complete original file.

```css
@theme {
  --color-hull: #101b2a;
  --color-panel: #203448;
  --color-porcelain: #dce6ed;
  --color-hologram: #63dceb;
  --color-caution: #f3bd61;
  --color-critical: #ff7a73;
  --font-sans: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  --font-display: 'Bahnschrift', 'Segoe UI', sans-serif;
}

:root {
  color-scheme: dark;
  --surface: #152335;
  --surface-raised: #1a2d40;
  --text-muted: #a8bdce;
  --line: #3b566b;
  --radius: 5px;
  --motion-fast: 160ms;
}
```

### `src/test/cameraPaths.test.ts`

SHA-256: `c0f4dce3f03a80291ac25404438806a2aa2512b8606e024b9cdb49ebdb36d2c4`. Complete original file.

```ts
import { describe, expect, it } from 'vitest'
import { viewPresets } from '../scene/navigation/presets'

describe('guided camera clearance', () => {
  it('keeps every pairwise Cartesian path inside the clear right-hand aisle', () => {
    for (const from of Object.values(viewPresets)) {
      for (const to of Object.values(viewPresets)) {
        for (let i = 0; i <= 20; i++) {
          const t = i / 20
          const position = from.position.map((value, axis) => value + (to.position[axis]! - value) * t)
          // 8m pressure shell; bed ends at x=.75; trolley starts at z=-2.8.
          expect(position[0]).toBeGreaterThan(1.5)
          expect(position[0]).toBeLessThan(3.5)
          expect(position[1]).toBeGreaterThan(1.5)
          expect(position[1]).toBeLessThan(3.0)
          expect(position[2]).toBeGreaterThan(.4)
          expect(position[2]).toBeLessThan(4.2)
        }
      }
    }
  })
})
```

### `src/test/foundation.test.tsx`

SHA-256: `2c842f310c112e593d58c43a423425d48e2f9498f6bd791297511bdeded2d8c2`. Complete original file.

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from '../app/App'
import { getFixtureSnapshot } from '../data/fixtures'
import { formatMeasurement } from '../domain/format'
import { createStationRegistry } from '../scene/interaction/stationRegistry'
import { getAssetUrl, type ModelAsset } from '../scene/assets/registry'

function renderRoute(path: string) { return render(<MemoryRouter initialEntries={[path]}><AppRoutes /></MemoryRouter>) }

describe('foundation workflows', () => {
  it('navigates all six feature boundaries without a renderer', async () => {
    renderRoute('/dashboard/overview?crew=crew-01')
    const user = userEvent.setup()
    const modules = [
      ['Vitals', 'Crew biometrics & vitals'], ['Radiation', 'Space radiation monitoring'],
      ['Physical', 'Physiological & musculoskeletal assessment'], ['Wellbeing', 'Psychological health & wellbeing'],
      ['Diagnostics', 'AI diagnostics'], ['Emergency', 'Emergency protocols'],
    ]
    for (const [link, title] of modules) {
      await user.click(screen.getByRole('link', { name: link }))
      expect(await screen.findByRole('heading', { level: 1, name: title })).toBeInTheDocument()
    }
  })

  it('switches crew atomically and retains selection across stations', async () => {
    renderRoute('/dashboard/vitals?crew=crew-01')
    expect(await screen.findByText('72 bpm')).toBeInTheDocument()
    const user = userEvent.setup()
    await user.selectOptions(screen.getByRole('combobox', { name: 'Astronaut' }), 'crew-02')
    expect(screen.getByText('81 bpm')).toBeInTheDocument()
    expect(screen.queryByText('72 bpm')).not.toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Radiation' }))
    await screen.findByRole('heading', { level: 1, name: 'Space radiation monitoring' })
    expect(screen.getByRole('combobox')).toHaveValue('crew-02')
  })

  it('keeps module navigation and emergency available without WebGL', async () => {
    renderRoute('/bay/vitals?crew=crew-01')
    expect(screen.getByRole('heading', { name: '3D view unavailable' })).toBeInTheDocument()
    expect(await screen.findByText('72 bpm')).toBeInTheDocument()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Emergency rehearsal' }))
    expect(screen.getByRole('dialog')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Return to station' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByText('72 bpm')).toBeInTheDocument()
  })

  it.each(['/bay/unknown?crew=crew-01', '/bay/vitals?crew=unknown', '/unknown/vitals'])('recovers invalid location %s', path => {
    renderRoute(path)
    expect(screen.getByRole('heading', { name: 'Station or crew unavailable' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Return to overview' })).toHaveAttribute('href', '/dashboard/overview?crew=crew-01')
  })
})

describe('contract boundaries', () => {
  it('does not turn missing or invalid measurements into zero', () => {
    const measurement = getFixtureSnapshot('crew-01')!.biometrics.heartRate
    expect(formatMeasurement({ ...measurement, value: null })).toBe('Unavailable')
    expect(formatMeasurement({ ...measurement, quality: 'invalid' })).toBe('Unavailable')
    expect(formatMeasurement({ ...measurement, quality: 'stale' })).toBe('72 bpm · Stale')
    expect(formatMeasurement({ ...measurement, value: 0 })).toBe('0 bpm')
    expect(getFixtureSnapshot('unknown')).toBeUndefined()
  })

  it('prevents duplicate station ownership and cleans registration', () => {
    const registry = createStationRegistry()
    const station = { stationId: 'vitals', nodeName: 'anchor_vitals', label: 'Vitals', anchor: [0, 0, 0] } as const
    const dispose = registry.register(station)
    expect(() => registry.register(station)).toThrow('already registered')
    dispose()
    expect(registry.get('vitals')).toBeUndefined()
  })

  it('rejects model paths outside the local asset boundary', () => {
    const asset: ModelAsset = { id: 'test', path: 'assets/models/test.glb', version: '1', bytes: 0, station: 'overview', tier: 'low', license: { source: '', author: '', name: '', attribution: '' }, animations: [] }
    expect(getAssetUrl(asset)).toBe('/assets/models/test.glb?v=1')
    expect(() => getAssetUrl({ ...asset, path: 'assets/models/../private.glb' })).toThrow('Invalid model path')
  })
})
```

### `src/test/metrics.test.ts`

SHA-256: `22c95c9155b8cc8f1f85ea70615b0774931dc6bf08f9b582d8cc6bcf3512781e`. Complete original file.

```ts
import { describe, expect, it } from 'vitest'
import { summarizeFrames } from '../scene/quality/metrics'

describe('active-navigation measurements', () => {
  it('does not certify an idle or background interval as navigation performance', () => {
    const idle = Array.from({ length: 40 }, () => ({ intervalMs: 1000, cpuRenderMs: 1, visible: true, alwaysRendering: false }))
    expect(summarizeFrames(idle, 0).representativeNavigation).toBe(false)
    expect(summarizeFrames(idle.map(sample => ({ ...sample, visible: false, alwaysRendering: true })), 5).representativeNavigation).toBe(false)
  })
  it('reports elapsed active time and preserves slow frames instead of dropping them', () => {
    const samples = Array.from({ length: 60 }, () => ({ intervalMs: 1000 / 60, cpuRenderMs: 4, visible: true, alwaysRendering: true }))
    const summary = summarizeFrames(samples, 3)
    expect(summary.fps).toBeCloseTo(60)
    expect(summary.representativeNavigation).toBe(true)
    const stalled = summarizeFrames([...samples, { ...samples[0]!, intervalMs: 6000 }], 3)
    expect(stalled.fps).toBeLessThan(10)
    expect(stalled.elapsedMs).toBeCloseTo(7000)
  })
})
```

### `src/test/openingPath.test.ts`

SHA-256: `3bb31cf7d9b9607e7c91ee68cbd0d0bef4dcdc7a3faac657b1fa05b7f9616518`. Complete original file.

```ts
import { describe, expect, it } from 'vitest'
import { openingPose } from '../scene/navigation/scrollPath'
import { viewPresets } from '../scene/navigation/presets'

describe('opening camera route', () => {
  it('keeps continuous, reversible positions inside the established clear aisle', () => {
    let previous = openingPose(0)
    for (let i = 0; i <= 1000; i++) {
      const progress = i / 1000
      const pose = openingPose(progress)
      expect(pose.position[0]).toBeGreaterThan(1.5)
      expect(pose.position[0]).toBeLessThan(3.5)
      expect(pose.position[1]).toBeGreaterThan(1.5)
      expect(pose.position[1]).toBeLessThan(3)
      expect(pose.position[2]).toBeGreaterThan(.4)
      expect(pose.position[2]).toBeLessThan(4.2)
      expect(Math.hypot(...pose.position.map((n, axis) => n - previous.position[axis]!))).toBeLessThan(.02)
      expect(Math.hypot(...pose.target.map((n, axis) => n - previous.target[axis]!))).toBeLessThan(.02)
      previous = pose
    }
    expect(openingPose(1)).toEqual(viewPresets.examination)
    expect(openingPose(-1)).toEqual(openingPose(0))
    expect(openingPose(2)).toEqual(openingPose(1))
  })
})
```

### `src/test/setup.ts`

SHA-256: `af7ea956402b60836472bbc43be1c6e9f96286a411ac7dcf2ed144fea7918d10`. Complete original file.

```ts
import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(cleanup)
Object.defineProperty(window, 'matchMedia', { writable: true, value: vi.fn().mockImplementation((query: string) => ({ matches: false, media: query, addEventListener: vi.fn(), removeEventListener: vi.fn() })) })
// jsdom has no graphics device. Canvas initialization is covered separately in browsers.
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null)
HTMLDialogElement.prototype.showModal = function () { this.open = true }
HTMLDialogElement.prototype.close = function () { this.open = false }
```

### `src/ui/ErrorBoundary.tsx`

SHA-256: `95cc78f7d550a0576f2126f7810f74209cdcff9e1a4f2650da834a4533d35bcb`. Complete original file.

```tsx
import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode; onError?: () => void }
export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onError?.() }
  render() {
    if (this.state.failed) return this.props.fallback ?? <main className="recovery"><h1>Interface unavailable</h1><p>Reload to recover the local demo session.</p><button onClick={() => window.location.reload()}>Reload application</button></main>
    return this.props.children
  }
}
```

### `src/ui/LoadingState.tsx`

SHA-256: `be58cdfa200ac9bc26462804cef4202396a293955e31a9694b75bdf2082841bd`. Complete original file.

```tsx
export function LoadingState({ label = 'Preparing interface…' }: { label?: string }) {
  return <p className="loading-state" role="status">{label}</p>
}
```


