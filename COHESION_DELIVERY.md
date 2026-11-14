# PARALLAX V3.1 repair — 2026-11-03

Implemented and verified locally in `C:/Users/ishan/Documents/Codex/2026-10-29/superpowers-plugin-superpowers-openai-curated-remote/outputs/PARALLAX-M101-automated-channel-map/explorer`.

Baseline: clean Git revision `b7cc749b6e697bc4dbbd08744be1407e075e197f`, branch `main`. Work is uncommitted on `repair/cohesive-investigation-2026-11-03`. This is the same React/TypeScript/Vite application and hosting identity as the prior delivery. No replacement project, package installation, push, merge or public deployment was performed. Local development runs at http://127.0.0.1:5173/; the production bundle was additionally exercised on localhost:5175.

## Confirmed causes and direct repairs

| Confirmed source | Effect | Repair |
|---|---|---|
| `src/main.tsx` baseline condition `mode !== 'investigation'` around shared evidence | Actual Time DOM included the mosaic's “102 FITS-derived layers” and spectral technical panels below native dated exposures. | Evidence/narrative/footer now remain spectral-specific (`src/main.tsx:63`); Time owns `#dated-evidence` in `src/datedGallery.tsx:15`. The header opens the relevant evidence. |
| `src/main.tsx` baseline routing recognized only saved `#dated=` and `#reveal/#compare` states; `src/reveal.tsx` attempted to parse any initial anchor | Ordinary Time navigation did not survive refresh, and section anchors could be treated as rejected saved spectral records. | Explicit field/section anchors and navigation (`src/main.tsx:13`, `:20`); saved spectral decoding only for its actual prefixes (`src/reveal.tsx:15`, `:22`). Existing saved-view codecs remain intact. |
| `src/style.css` mobile rule hid navigation buttons after the first, except Time | Actual 390px UI hid the wavelengths button. | Three stable field buttons remain available at mobile widths; single-view, guide and numerical controls are retained inside the spectral workspace. |
| `.inv-viewers` in `src/investigation/investigation.css` capped at 850px, measured as 850px in the actual desktop DOM | A large square image separated pixel selection from its values and controls below. | Wide workbench with a bounded square native image and adjacent actual pixel evidence; stacks on narrow screens. Full VERIFY and downloads remain. See `src/investigation/ObservationViewer.tsx:48`. |
| `src/investigation/model.ts` lacked RA normalization and several uncertainty/display metadata checks; `src/science.ts` lacked some finite-value/plane-uniqueness guards | Malformed metadata could pass these shape validators despite pinned bytes being an independent gate. | Extend existing validators; reject invalid RA/Dec, nonfinite values, invalid variance units/display limits, duplicate mosaic planes and incomplete comparison gates. Preserve the established celestial transform and spherical RA-wrap calculation. |
| `src/data.ts:17` cached planes by integer channel alone | An executed regression test changed an asset checksum but received the previously cached plane. | Cache identity includes numerical descriptors; changed bytes must be fetched and verified. Native cache identity also includes processed asset descriptors. |
| Separate component styles, inherited rounded controls and different evidence layouts | Dated exposures and native inspection had different hierarchy and label sizes. | Shared root color/font tokens and scoped component adjustments in `src/style.css:28` and `src/investigation/investigation.css:10`; readable labels, restrained controls, bounded prose and wider working areas. |

No Markdown, prose utility or syntax-highlighter wrapper was present in the reviewed DOM. `document.fonts.status` was `loaded`; typography uses available system fallbacks. Raw HISTORY metadata uses an intentional monospace `pre` with transparent background and wrapping; checksums remain technical evidence. No imagined beige-block defect, fake font failure or global pre/code reset was used to justify changes.

## Actual source-to-render map

| Path / entry | Data responsibility |
|---|---|
| `scripts/prepare_rdra.py:27`, `:52`, `:53` | Read the two preserved real FITS cutouts; conservative full-bit mask, supplied variance, primary TAN-SIP transform; emit versioned native buffers, transparent PNGs, headers and manifest. **Unmodified in this repair.** |
| `scripts/check_rdra.py:12`, `:22` | Independent extension, dimensional, source-byte, buffer, mask, WCS-grid and PNG checks. **Unmodified.** |
| `public/investigations/rdra-v1/manifest.json`, `src/investigation/integrity.ts` | Actual native observation contracts and pinned manifest digest. **Unmodified.** |
| `src/investigation/model.ts:12`, `:24`, `:32` | Validate native contract and all decoded arrays; authenticate local bytes against pinned hashes, cache processed descriptors and reject failed loads. Cryptographic integrity is not source/calibration authentication. |
| `src/investigation/Investigation.tsx` | Select actual epoch, load native assets, reset selection on epoch change, send matching observation/data to viewer and VERIFY. |
| `src/investigation/ObservationViewer.tsx:7`, `:20`, `:48` | DPR-aware native canvas, documented asinh presentation, optional mask-safe interpolation, quality overlay, bounded zoom/pan and readout from `samplePixel`. Values come from numerical buffers. |
| `src/investigation/VerifyEvidence.tsx:6`, `:16`; `model.ts:27` | Exact selected observation/pixel, source records, warnings, uncertainty and local JSON export. New report fields identify native LVF scope and define statistical uncertainty, with no invented confidence level. |
| `public/dataset/channels_102.json`, `image_manifest.json`, `science_metadata.json` | Pinned spectral mosaic contract: 102 actual nominal channel planes, independent of native LVF detector-position labels and dates. **Unmodified.** |
| `src/data.ts:7`, `:17`; `src/science.ts:45` | Hash-verified mosaic contracts/buffers, finite physical metadata, channel/plane joins and mask policy. Mosaic mask 1 means eligible; native mask 0 means accepted. The distinction is retained. |
| `src/reveal.tsx:13`, `:14`; `src/theater.tsx`; `src/components.tsx` | Real spectral canvas views, common-support comparison, preserved single-wavelength viewer and raw-buffer numerical profile. Display colors are never measurements. |
| `src/temporal.ts:5`; `src/datedGallery.tsx:7`, `:8`, `:14` | Pinned dated gallery joins original filenames/checksums/dates, loads real native PNGs and exports independent-view evidence. No registration or scientific change is asserted. |
| `src/main.tsx:14`, `:20`, `:45` | Actual entry point, field routing, navigation and contextual evidence. Vite uses `index.html` directly; there is no `App.tsx`, `scientificData.ts` or project-specific `vite.config.ts` in this app. |

## Protected science and uncertainty

All scientific assets and identities remain unchanged. The same real `rdra_row_0001.fits` (2025-06-08) and `rdra_row_0052.fits` (2025-12-10) power the investigation. The local cutout hashes, original parent IRSA references, pipeline version, units, masks, WCS and provenance records remain intact. The core still has 19/19 and 21/21 excluded pixels respectively. No excluded pixels are filled.

The approximate R Draconis labels are prior **target-center WCS-WAVE visualization lookups**. The UI and actual exported report now explicitly explain that native LVF wavelength varies across detector position. No fixed integer channel or calibrated wavelength is assigned to every native pixel. The mosaic's 102-channel metadata remains its separate authoritative product contract.

Reports define per-accepted-pixel uncertainty as `sqrt(native VARIANCE)` with image/variance units, a scope statement, and `confidenceLevel: null`. Calibration systematics, covariance and source photometry are not established. A selected accepted reference at x19/y27 in the second observation exported IMAGE `35.69618225097656` MJy/sr and sigma `0.2065620503730901` MJy/sr, computed in JavaScript from the supplied native variance. Missing core measurements remain null.

All **55 M101 temporal pairs remain disabled**. Native side-by-side views remain independent grids with independent stretches. Registration residuals, effective response equivalence, PSF matching, calibration UUID linkage, source identity confirmation and validated photometry remain unresolved. No moving-object, variability, discovery, institutional-approval or scientifically certified 102-channel coverage claim was added.

## Executed checks

| Check / command | Baseline | Final |
|---|---|---|
| `npm.cmd run lint` | PASS | PASS; existing scope is investigation modules |
| `npm.cmd run typecheck` | PASS | PASS; whole application |
| `npm.cmd test` | 39 pass, 0 fail, 0 skipped | **45 pass, 0 fail, 0 skipped** |
| `npm.cmd run build` | PASS | PASS; final JS `index-CoUieGVo.js`, CSS `index-ecBLx5nO.css` |
| Python environment: `-m unittest discover -s tests -p test_rdra_pipeline.py -v` | Not rerun as a separate baseline | **7 pass**, including offline byte-exact reproduction and malformed-input cases |
| Python: `scripts/check_rdra.py` | Prior record inspected | PASS; both authentic originals, arrays, masks, primary SIP grid and PNG alpha/grayscale |
| Read-only source/build hashes | Existing pinned records inspected | PASS: 532 M101 artifacts, 14 native assets, 2 original native FITS copies, 11 dated previews and 17 original research inputs |
| `git diff --check` | Clean initial tree | PASS; only an informational Windows LF/CRLF notice for the E2E source |
| `npx.cmd playwright test --list` | Existing cases inspected | 6 cases discoverable, desktop/mobile |
| Standalone Playwright runner / remote GitHub Actions | NOT RUN | **NOT RUN**; no claim that configured CI executed |

Six new Node tests exercise malformed RA/Dec, variance/display metadata, native sky buffers, mosaic plane identity, spherical zero-wrap, product/uncertainty report scope and stale asset caches. Five initial boundary tests failed before their fixes; the added cache regression separately failed before changing the cache key. All are green in the final suite. Existing scientific invariant tests were retained.

Actual browser controls exercised FIND → SEE → VERIFY on desktop/mobile, arrow-key native selection, epoch reset, independent two-epoch views, quality and provenance, real exports, zoom 1–8 boundaries, all **102 mosaic positions**, numerical profile, and all **11 dated previews**. Time refresh and correct evidence context were verified in both the development app and the locally served production build. A deliberate real buffer 404 produced an explicit error and **zero native canvases**, with no synthetic fallback. Final production-native, dated and spectral assets loaded successfully.

One long browser sweep timed out and its tab became unresponsive; it is not recorded as a pass. A fresh tab completed all 102 positions in smaller batches. This is not a performance benchmark or proof of the cause of that tooling timeout. Pan-bound mathematics and mask-safe fidelity are covered by retained executed tests; physical pointer-drag travel was not remeasured in this repair.

Viewport overrides were desktop 1440×1000 and mobile 390×844. Captured web-content images are 1425×968 and 375×812 respectively; matching before/after states have identical capture dimensions. Tablet 768×1024 and laptop 1280×800 were also inspected for overflow. No horizontal overflow was measured in these checked layouts. Canvas keyboard focus produced a solid 2px outline. DPR-aware bitmap dimensions were inspected at the current approximately 1× device ratio; physical high-DPI hardware, touch hardware and assistive screen-reader behavior were not tested. Existing reduced-motion CSS was inspected, not emulated as a user preference. No external font dependency was introduced.

Persistent evidence: `screenshots/cohesion-2026-11-03/final-checks.txt`, `integrity.json`, `browser-acceptance.json`, actual downloaded `native-evidence.json` and `dated-evidence.json`. Historical delivery and test reports were not rewritten.

## Before / after browser evidence

These are actual captures of the same application and original scientific assets. The SEE comparison shows the change from a centered image with controls below to a wider workbench with visible selected-pixel evidence. The TIME comparison shows the shared typography and native-image framing; its evidence is now field-specific. Mobile navigation now exposes all three workflows. The complete FIND, SEE, VERIFY and Time set is in the same screenshot directory.

| State | Before | After |
|---|---|---|
| Desktop SEE | ![Before SEE](screenshots/cohesion-2026-11-03/before-see-desktop.jpg) | ![After SEE](screenshots/cohesion-2026-11-03/after-see-desktop.jpg) |
| Desktop Time | ![Before Time](screenshots/cohesion-2026-11-03/before-time-desktop.jpg) | ![After Time](screenshots/cohesion-2026-11-03/after-time-desktop.jpg) |
| Mobile FIND | ![Before mobile](screenshots/cohesion-2026-11-03/before-find-mobile.jpg) | ![After mobile](screenshots/cohesion-2026-11-03/after-find-mobile.jpg) |

## Continuity and final review

`AGENTS.md` now requires future sessions to read existing scientific decisions and the single `docs/DECISIONS.md` log before relevant changes. It distinguishes current evidence from historical claims and requires explicit publishing authorization. The log records confirmed causes, affected modules, rejected detached/HUD/synthetic approaches, and acceptance limits. The short implementation plan is `docs/superpowers/plans/2026-11-03-cohesion-repair.md`.

The actual Git diff was reviewed under four responsibilities: scientific/system boundaries, editorial/responsive composition, adversarial regressions/accessibility, and continuity/completion claims. Review caught and corrected the single-wavelength view losing its accessible page heading after removing the inappropriate Time heading. Scientific files, dependency lock, hosting identity and comparison-gate definitions were not modified. No new framework, duplicate scientific model or production mock data was introduced.

Remaining limits: calibration and comparison science remain unverified as above; the native sampling is still honestly 47×47, and dated cutouts are small. Fine print in historical technical panels can remain dense when expanded. A formal screen-reader audit and physical-device usability study remain outstanding. App startup still verifies the shared M101 contracts before mounting the chosen workflow; independent offline boot for a missing entire mosaic package is outside this focused repair. This work is a tested local improvement, not a blanket production-readiness certification.

**Deployment:** no public version was pushed, merged or deployed in this task. The prior public deployment was not changed. The new build is available locally through the existing scripts. To reproduce, run `npm.cmd ci`, the verification commands above, then `npm.cmd run dev` from the canonical root. Deployment requires a separate explicit authorization under the latest brief.
