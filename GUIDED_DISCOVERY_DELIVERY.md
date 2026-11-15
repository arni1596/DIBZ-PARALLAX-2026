# Guided discovery delivery — 2026-11-03

Implemented in the running V3.1 application at `http://127.0.0.1:5173/`.

Canonical root: `C:/Users/ishan/Documents/Codex/2026-10-29/superpowers-plugin-superpowers-openai-curated-remote/outputs/PARALLAX-M101-automated-channel-map/explorer`.
Branch: `repair/cohesive-investigation-2026-11-03`. HEAD remains `b7cc749b6e697bc4dbbd08744be1407e075e197f`. The baseline worktree already contained the previous repairs. Those changes were preserved. This task's five investigation-source snapshots are in `.test-work/guided-before/`; its isolated source diff is in the evidence directory. No new app, dependency or dataset was created.

## Actual baseline audit

| Behavior | Baseline classification | Evidence / action |
|---|---|---|
| Accepted initial June selection | Implemented but defective | Actual app opened on excluded x23/y23, contrary to the brief's reported starting point. Now resolves a verified usable native reference. |
| Real core and accepted actions | Already implemented and verified | Native evaluator validated both actions. Preserved same selection callback; reordered and coordinate-labelled them. |
| Single authoritative selection / explicit inspection | Already implemented and verified | Parent observation and pixel drive canvas, sample, VERIFY and export. Default is not intentional inspection. Preserved. |
| Conditional quality explanation | Implemented but defective | Accepted primary interpretation still rendered “No OVERFLOW” and “No SUR_ERROR” rows. Unsupported rows now are absent from React output. |
| Two-step presentation / stable response | Missing | Ordered usable/core controls, actual epoch coordinates, explicit pressed state and reserved line capacity now implemented. |
| Free canvas/keyboard, epoch clearing, direct VERIFY, provenance and export | Already implemented and verified | Retained, then exercised after integration. |
| Wide responsive workbench | Already implemented and verified | Preserved grid; increased desktop native presentation bound from 55svh to 65svh. No native geometry or display pipeline change. |
| Two-minute first-time comprehension; physical touch and screen reader | Unable to verify | No human timing study or physical-device/assistive test was conducted. These remain unverified. |

Baseline commands: `npm.cmd test` **52 passed, 0 failed, 0 skipped**; `npm.cmd run build` and `npm.cmd run lint` passed. Actual before captures: `screenshots/guided-2026-11-03/before-desktop.jpg` and `before-see-desktop.jpg`. The attachment initially ended mid-sentence; implementation used the complete continuation supplied in this chat.

## Implementation and authoritative state

- `src/investigation/interpretation.ts`: `usableReferencePixel` validates recorded references through `samplePixel` using the active native buffers, with a real-data scan if needed and null if no usable pixel exists. Existing `flaggedCorePixel` remains data-derived. An unresolved mask exclusion receives an honest fallback reason, never invented flags.
- `src/investigation/Investigation.tsx`: the existing selected-pixel state now permits an unset default. Its effective reference is derived from the selected observation's validated buffers; explicit user selection still writes that same state. Epoch changes clear selection and intentional-inspection identity. No second coordinate state, step-completion counter or scientific schema was added. FIND asks the question; SEE has one contextual response; VERIFY remains reachable without completing a guide.
- `src/investigation/ObservationViewer.tsx`: the existing viewer contains “1. Inspect a usable pixel” and “2. Examine the excluded core,” each with validated coordinates and the active date. Both call the existing `onSelect`; explicit matching selection controls `aria-pressed`. The actions precede the readout, keeping them closer to the image on mobile. Free pointer and keyboard selection, quality overlay, smoothing, zoom/pan constraints and native y orientation remain intact. Repeated action feedback was removed.
- `src/investigation/VerifyEvidence.tsx`: “What the evidence lets us say” synthesizes the two independently checked examples in the current observation. The redundant status verdict was removed. Detailed flag interpretation now lives in the existing technical provenance disclosure. OVERFLOW and SUR_ERROR rows render only if present; SUR_ERROR mentions the combined condition only if OVERFLOW is also set. Original numerical record, archive references, calibration caveats, comparison gates and export remain available. Core findings and comparison limitations remain outside the disclosure. The Planet X connection explicitly describes evidence qualification, not validated motion detection.
- `src/investigation/investigation.css`: scoped changes only, existing tokens and grids. Tabular readouts, explicit text status, focus indicators, coordinated actions and minimum line capacities stabilize changing content. These are minimum sizes, not clipped fixed-height containers: longer content can grow. No hidden duplicate error panels, decorative animation, scroll traps or global code-style reset.
- Tests changed: `tests/narrative.test.mjs`, `tests/react-render.test.mjs`, `tests/e2e/investigation.spec.ts`. Documentation changed: this report, README, AGENTS pointer, existing decision log and short implementation plan.

## Verified native examples

June `rdra_row_0001`, x21/y18: IMAGE **49.27613067626953 MJy/sr**, VARIANCE **0.0633765161037445 (MJy/sr)²**, calculated double-precision sqrt **0.25174692868780846 MJy/sr**; FLAGS **2097152**, SOURCE alone; accepted. The manifest's rounded/float32 sigma is not substituted for calculation from native VARIANCE.

June x23/y23: IMAGE/VARIANCE nonfinite, usable value and sigma null; FLAGS **2097158**, OVERFLOW, SUR_ERROR and SOURCE; excluded. Actual exported records are `actual-export.json` and `excluded-export.json` in the evidence directory.

December resolves its own usable x19/y27 reference, IMAGE **35.69618225097656 MJy/sr**, calculated sigma **0.2065620503730901 MJy/sr**, SOURCE alone. Its core classification was evaluated independently. An arbitrary June keyboard selection at x22/y18 produced TRANSIENT and SUR_ERROR without OVERFLOW, demonstrating contextual classification beyond the guided examples. None is a calibration standard or validated source photometry.

## Executed final checks

| Command / check | Result |
|---|---|
| `npm.cmd test` | **58 passed, 0 failed, 0 skipped**; `screenshots/guided-2026-11-03/node-tests.txt` |
| `npm.cmd run lint` | PASS (configured scope: investigation source) |
| `npm.cmd run typecheck` | PASS (whole application) |
| `npm.cmd run build` | PASS; `index-TNY3S4tk.css`, `index-BlIUQKGY.js` |
| Research venv Python `-m unittest discover -s tests -p test_rdra_pipeline.py` | **7 passed**, including offline reproduction checks |
| Research venv Python `scripts/check_rdra.py` | PASS; both original FITS hashes, native arrays/preview alpha and SIP checked |
| `git diff --check` | PASS; informational Windows line-ending notice only |
| `git diff --name-only -- public tests/fixtures` | Empty; no scientific asset/fixture changes |
| `npx.cmd playwright test --list` | **10 cases discovered**; standalone runner **not run** |
| Remote CI | **Not run** |

The three new regressions first failed on the missing helper, accepted error panels and missing guided controls, then passed after implementation. Tests use real native buffers for sample resolution, values, variance, SOURCE handling and per-flag conditional rendering. Existing tests still verify all 532 dataset artifact hashes, all102 numerical/image agreements, native scientific contracts, mask handling, WCS and all55 disabled temporal pairs. No tolerance or quality policy was weakened.

Actual CUA browser journeys exercised accepted→excluded→accepted at 1440×1000, 768×1024 and 390×844; arbitrary keyboard inspection; both epoch defaults and identity reset; fresh direct VERIFY; Back; keyboard Enter on guided controls and disclosure; actual accepted/excluded downloads. All **102** wavelength A selections rendered a canvas with the matching actual channel identity. All **11** dated previews loaded with their original filenames. `browser-acceptance.json` records the individual identities and distinguishes these executed journeys from the unrun standalone Playwright suite.

`layout-checks.json` records final element rectangles across all three states at all three sizes. Maximum observed change in document top positions across the checked canvas, workspace, response slot, VERIFY, comparison limitations and challenge bridge was **0.000123 CSS px** (rounding noise); no horizontal overflow. This is an element-geometry check, not a claim of a complete performance/CLS audit. The native canvas remained square: desktop650px, tablet674.54px, mobile333.33px. Opening disclosure intentionally expands content.

`contrast-check.json`: **19** rendered primary-text samples, minimum **8.73:1** using computed foreground/composited solid backgrounds. This targeted test excludes imagery, disabled controls and a complete WCAG certification. Existing visible focus styling and textual accepted/excluded status are retained. Physical touch hardware, screen-reader operation, high-DPI physical devices and judge comprehension timings were not tested.

## Actual screenshots

| State | Capture |
|---|---|
| Before desktop SEE | ![Before](screenshots/guided-2026-11-03/before-see-desktop.jpg) |
| Accepted desktop | ![Accepted desktop](screenshots/guided-2026-11-03/accepted-desktop.jpg) |
| Excluded desktop | ![Excluded desktop](screenshots/guided-2026-11-03/excluded-desktop.jpg) |
| Accepted mobile | ![Accepted mobile](screenshots/guided-2026-11-03/accepted-mobile.jpg) |
| Excluded mobile | ![Excluded mobile](screenshots/guided-2026-11-03/excluded-mobile.jpg) |
| Accepted / excluded tablet | `accepted-tablet.jpg`, `excluded-tablet.jpg` in the same directory |

These are actual browser captures. No new mobile baseline was captured before this task's edits; historical mobile evidence remains in the prior narrative report, not relabelled as a current baseline.

## Scientific and delivery limits

Original FITS-derived assets, numerical buffers, masks, WCS, units, calibration warnings and export engine are unchanged. The original display pipeline still uses accepted-pixel percentile/asinh mapping; enlargement does not add resolution. SOURCE alone remains retained. OVERFLOW denotes the documented onboard threshold (approximately half full well), not proven full saturation; SUR_ERROR records a processing condition, not a physical diagnosis. Native LVF wavelengths remain position-dependent. Calibration UUID linkage and source identity remain unverified.

All **55 M101 temporal pairs remain blocked**. R Draconis registered comparison, PSF matching, difference photometry, motion, significance and discovery remain unsupported. The102 mosaic selections are wavelength views; the11 dated previews remain independent exposures. No fake observation, calibrated measurement or temporal result was introduced.

The user-facing local app remains running on port5173. **No commit, push, merge or deployment was performed.** The public website was not updated. Local setup remains `npm.cmd ci`, `npm.cmd run dev`; build remains `npm.cmd run build`. This task establishes the tested local interaction, not production deployment or independently validated science.
