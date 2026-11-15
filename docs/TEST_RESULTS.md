# Executed integration verification

Date: **15 November 2026**. Workspace: `D:\nasa-hackathon`. Windows host: Node **25.2.1**, npm **11.6.2**; declared supported minimums remain Node 24.15.0 / npm 11. No screenshots, videos or trace images were created.

## Final software checks

| Executed command / check | Verified result |
| --- | --- |
| `npm run typecheck` (also part of build) | Pass, no TypeScript errors |
| `npm run lint` | Pass, zero warnings/errors |
| `npm test` | **16 files / 47 tests passed** |
| `npm run test:backend` | **21 original assertions + 10 Node HTTP tests passed** |
| `npm run test:e2e -- --reporter=line` | **41/41 browser scenarios passed**, final complete run **7.1 minutes** |
| `npm run build` | Pass, Vite built **120 modules** |
| `npm run dev:all` | Actual API 5001 + Vite 5186 startup; frontend/proxied API return 200/ONLINE |
| `npm start` after build | Actual single-origin application/API startup on 5001; `/`, `/bay/vitals?crew=crew-02`, `/bay/physical`, `/dashboard/radiation` return 200 HTML; health returns ONLINE |
| Runtime assets/manifests | **35 SHA-256 comparisons, zero changes** against protected baseline |
| CRLF-aware Git whitespace check | Pass with existing Windows newline style acknowledged |

The frontend suite adds team component, response schema/unit/gap, polling ownership, retry/cancellation, timeout and shared-feed tests. HTTP coverage includes every read route, modes, emergency state, per-crew isolation, persistence/restart, corrupt files, zero intensity, invalid/malformed/oversized bodies, origin rejection and SPA hosting boundaries.

Browser coverage includes actual production-frontend HTTP reads/writes, crew selection/cancellation, exercise creation/completion, SANS persistence, sleep/wellbeing, diagnostic assistance, radiation, emergency, malformed responses/outages/recovery, graph updates, five repeated connected equipment/chapter cycles, one Canvas/no GLB refetches, patient visibility/breathing, scanner timing, sound permission/context reuse, mobile layouts, keyboard/focus, reduced motion, fractional viewport startup and actual WebGL context loss/recovery.

Existing authored-fixture regressions explicitly intercept the aggregate telemetry endpoint. Seven full-stack scenarios use actual HTTP against a separate API on 5002. All browser capture modes are off. Initial failing runs exposed controlled-checkbox timing, hidden-radio obstruction and an ambiguous same-label test selector; these were corrected before the final complete 41/41 run. No test was deleted or forced through a blocked control.

## Production hardware measurement

Executed `scripts/measure_operations.mjs` against the actual `npm start` application at `http://127.0.0.1:5001/`. The measurement includes **12 seconds of reversible native scrolling**, **five repeated chapter/inspection cycles** and a separate **10-second active monitoring sample**.

Adapter: **Intel UHD Graphics 620**, driver **31.0.101.2135**, Chromium ANGLE D3D11 renderer verified at runtime. Viewport/drawing buffer **1440×900**, existing standard/high assets retained, Intel-specific MSAA disabled, stationary room cache active.

| Measurement | Verified value |
| --- | ---: |
| Initial ready time (including loading/warmup/native presentation) | **18,136 ms** |
| Active navigation submission FPS | **20.28** |
| Navigation p95 / p99 interval | **55.2 / 62.2 ms** |
| Largest active submission interval | **405 ms** |
| Largest navigation draw count | **66** |
| Largest submitted triangle count | **403,496** |
| Active monitor submission FPS | **58.69** |
| Monitor maximum interval | **29.4 ms** |
| Stationary monitor draw count / median triangles | **6 / 1,528** |
| Trolley texture updates in monitor sample | **446** |
| Completed aggregate HTTP requests | **48** |
| Mean / maximum aggregate request completion | **5.92 / 11.69 ms** |
| Failed API requests / browser page errors | **0 / 0** |
| Renderer/resource identities retained | **Yes / yes** |
| New GLB requests after preparation/transitions | **0** |
| Sampled cached/full-render mean/max channel difference | **0.019 / 1** |

The accepted detailed moving scene remains hardware-limited, around 20 FPS on this adapter; connected stationary monitoring is near 59 FPS. API completion was under 12 ms in this local run and caused no Canvas rebuild or asset reload. The historical frontend-only report measured approximately 20.09 FPS navigation / 53.72 FPS monitoring, but it is not a controlled same-session A/B comparison and cannot establish a precise performance improvement.

Two main-thread long tasks were recorded during the navigation measurement, maximum **554 ms**. The 405 ms interval had no overlapping reported long task; its adjacent measured renderer CPU submissions were 13.7 and 16.8 ms. Individual frame gaps cannot be conclusively attributed to GPU work from these probes alone. Submission intervals do not measure GPU completion, compositor presentation or input-to-photon latency. We do not claim 45–60 FPS while moving through the full detailed room, zero stalls, or a GPU-level diagnosis unsupported by measurements.

Raw production numeric report remains locally at `docs/measurements/master-1/fullstack-production.json` (ignored generated artifact). It contains sampled frames, request timings, resource identities and long-task entries; no image data.

## Development comparison

The same script was executed against Vite development on 5186 with the same adapter/buffer, 12-second native scrolling, one equipment/navigation cycle and a 10-second monitor interval (production used five cycles). Development results: **24,040 ms** ready, **20.08 FPS** active navigation, **50.91 FPS** monitoring, **127.3 ms** maximum active interval, **21.45 / 145.90 ms** mean/max completed API request time, one cancelled request, zero page errors, retained renderer/resources and zero new GLBs. Development StrictMode deliberately cancels the first transport effect; the aborted request does not publish a stale result. The run does not attribute every cancellation to one cause beyond the exercised cleanup behavior.

React Profiler recorded **67** development commits, maximum **112.90 ms**, across initial preparation, navigation, DOM instruments and transport updates. This is a whole-application profile, not a claim that all commits originate in telemetry. Production React Profiler callbacks are disabled by React's normal production build and returned zero records, so no production React timing is claimed. The dev and production runs are sequential samples with different cycle counts and shared-host conditions, not a controlled GPU benchmark.

Raw development numeric report: ignored `docs/measurements/master-1/fullstack-development.json`.

## Security verification

`npm audit --json` returned **0 vulnerabilities** in all severity categories. The staged-file/reachable-history pattern and document-XML scan examined **303 indexed files**, **250 historical blobs / 225,778,764 bytes**, with **0 findings**. It checked provider tokens, private keys, credential-bearing URIs, secret assignments and forbidden publication artifacts. Actual stores, environment values, archives, caches, dependency folders and generated output are excluded. These results are scoped source/dependency checks, not a medical-security certification or penetration test.

## Remaining verification limits

- Vite retains the existing warning about a Three-dependent chunk larger than 500 kB (the contact/Three chunk is about 548.29 kB minified / 146.93 kB gzip). Existing Node jsdom localStorage-path and Playwright color-environment warnings are non-failing.
- Only available Chromium/Windows/UHD 620 behavior was executed; Safari, Firefox and dedicated mobile GPU testing are not claimed.
- All calculation/clinical outputs remain unvalidated educational simulations. Passing these tests establishes software behavior, not clinical accuracy, certification or NASA endorsement.
- No live hosted deployment, real telemetry feed, external AI, production authentication or clinical persistence system was tested or claimed.
