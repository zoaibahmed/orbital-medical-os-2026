# Runtime asset boundary

Six original GLBs are supplied for the Phase 3 vertical slice: shell, examination cradle/scanner and diagnostic equipment, each in standard and low detail. They contain their own 128px procedural normal/roughness maps. No external model, photographic texture or HDR image is used. Phase 3B supplies locally hosted Barlow/Barlow Condensed fonts under SIL OFL 1.1; source metadata is in fonts/sources.json and both font licenses are retained in licenses/. Equipment lettering uses converted licensed glyph outlines.

Future approved assets go in `models/`, `textures/`, `environments/`, `fonts/` and `licenses/`. Register each GLB in `src/scene/assets/registry.ts` with an explicit version and license record. Use meter units, Y-up runtime orientation, stable node names and documented animation clips. Keep raw authoring sources outside this runtime directory.

GLBs use Draco compression, decoded through the local two-file WASM decoder under `decoders/draco/`. Its Apache 2.0 license is preserved in `licenses/DRACO-LICENSE.txt`. No CDN is used. KTX2 and Meshopt are not used; the embedded 128px PNG maps are small enough for this slice. See `docs/ASSET_MANIFEST.md` and `models/manifest.json` for exact sizes, authorship, usage and review status. Production art acceptance remains pending; these are reviewable vertical-slice assets.

The critical-override opening also supplies the Antonio variable typeface under SIL OFL 1.1. Its source/hash are in fonts/sources.json and license in licenses/ANTONIO-OFL.txt. This addition does not alter the six GLBs.
