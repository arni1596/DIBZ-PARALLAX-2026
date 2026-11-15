# PARALLAX — evidence narrative delivery, 2026-11-03

Implemented in the canonical application:

`C:/Users/ishan/Documents/Codex/2026-10-29/superpowers-plugin-superpowers-openai-curated-remote/outputs/PARALLAX-M101-automated-channel-map/explorer`

Branch: `repair/cohesive-investigation-2026-11-03`. HEAD remains `b7cc749b6e697bc4dbbd08744be1407e075e197f`. The starting worktree already contained the preceding cohesion repair. That work was preserved, not reset or committed. This task's baseline source hashes and isolated before-worktree diff are in `screenshots/narrative-2026-11-03/`. No commit, push or deployment was performed. Review the running local app at http://127.0.0.1:5173/.

## Confirmed causes

The hero explicitly announced the missing-core conclusion in both its headline and paragraph. The default x23/y23 selection had no interaction identity, so it could not distinguish arrival from intentional inspection. Several warnings repeated the overall finding before visitors had examined a sample. The existing alternative-explanation and comparison sections were **populated**, rather than empty as reported in the brief, but used generic interpretation and disclosure. Technical and selected-pixel details occupied the main reading lane.

The source/DOM review again found no Markdown renderer or leaked prose utility. Backgrounds came from `.inv-verdict` and component styles; identifier monospace was intentional. The revised verdict is a restrained status rule, and raw technical records remain readable structured content. Existing design tokens, native rendering, quality masks and the wide workbench were retained.

## Implemented journey

**FIND:** “What can this patch of sky tell us?” introduces two authentic infrared observations and one primary action, “Explore the observations.” The hero no longer states that the core cannot be measured. Its real, hash-verified preview remains explicitly labeled as a processed display with excluded pixels preserved. A scientific-limits/provenance link is immediately available. No anomaly, discovery or physical explanation is suggested.

**SEE:** “Look for yourself” leads to the actual native images. Independent detector views and lack of registration remain persistent status. The existing selected pixel and observation data are authoritative. A separate interaction identity records only an intentional observation/pixel inspection. Mouse click, keyboard arrows/Enter and reference buttons use the same selection callback; pointer handlers support touch. Merely arriving, zooming or choosing an epoch does not count as an inspection.

The “Examine the flagged core” action finds a genuinely excluded pixel inside the documented native core nearest its supplied WCS position. It does not require clicking exactly x23/y23. An accepted reference is also available. Explanations distinguish display appearance, actual native values/flags, and permitted interpretation. Missing IMAGE and invalid VARIANCE are separate from excluding flags; SOURCE is explicitly descriptive. Accepted samples retain their real values and are not labeled excluded. “Understand what this means” opens VERIFY with the same context.

**VERIFY:** “What looks brightest isn’t always measurable” presents the current sample's status, usable value, statistical uncertainty and raw flags. The separate observation-specific core finding is derived from its recorded quality evidence: 19/19 for June 8 and 21/21 for December 10. The complete findings remain available through navigation or a fresh direct `#investigation-verify` load, regardless of narrative state.

“Why this image needs a closer look” contains three complete, conditional interpretation rows: detector threshold, onboard processing and display versus measurement. Accepted pixels correctly state when OVERFLOW/SUR_ERROR are absent. OVERFLOW is described as the onboard threshold condition, not proof of full saturation or an unusual astronomical source. SUR_ERROR is described as an instrument-processing condition, not an astrophysical cause. The definitions were checked against indexed official [IRSA Table 10](https://irsa.ipac.caltech.edu/data/SPHEREx/docs/SPHEREx_Expsupp_QR_v1.2.1.pdf); the full PDF fetch exceeded the web tool's size limit. No cosmic-ray, stray-light or moving-source explanation was invented.

The direct-comparison restriction is explained in the main reading lane. Optional deeper content presents the **actual existing failed gates** for registration, spectral response, PSF, photometry and motion. No numerical registration tolerance was added.

**Technical provenance and calibration:** native HTML disclosure retains raw IMAGE/VARIANCE, coordinates, primary WCS/orientation, source product and recorded parent link, UTC/MJD, release/pipeline, local cutout SHA-256, approximate target-position LVF label, recorded calibration HISTORY, processing policy and previous recorded interpretation. Hashes wrap. Identifiers remain distinct from authenticated calibration files, and the local cutout digest remains distinct from the parent product's checksum. Material quality and comparison limits remain outside the disclosure.

**Why this matters:** a compact conclusion connects trustworthy measurements to the Planet X/SPHEREx challenge and provides functioning routes to native inspection, M101 wavelengths and M101 dates. It explicitly states that the R Draconis case demonstrates quality inspection rather than validated motion detection. Reliable temporal comparison remains an unfinished challenge capability.

## State and access behavior

- Default selection remains a reference, visibly showing its actual exclusion status, but no earned explanation is rendered.
- Explicit inspection stores observation ID plus pixel identity; acceptance/reasons are recomputed from the real sample, never copied into narrative state.
- Epoch changes reset the reference and clear intentional-inspection/display context. Target changes unmount the native investigation and invalidate that context.
- Same-document FIND/SEE/VERIFY anchors and browser Back retain current observation/pixel. Full refresh resets to the native initial reference. A fresh VERIFY deep link displays complete science without marking the reference inspected.
- Explicit section links focus the relevant heading. Initial deep links position the section before focusing the heading. Pixel/epoch selection does not force a page jump.
- At fit, the canvas permits native vertical touch scrolling; zoomed views retain pointer panning. This gesture policy and shared pointer path are implemented, but physical touch hardware was not tested.

## Exact application files changed in this task

| File | Change |
|---|---|
| `src/investigation/Investigation.tsx` | Question-led invitation, intentional-inspection identity, atomic epoch/selection handling, derived evidence response, direct anchor focus, challenge navigation callbacks |
| `src/investigation/ObservationViewer.tsx` | Intentional versus reference label, real core/accepted-reference actions, current-pixel Enter/Space support, immediate interpretation feedback, fit/zoom touch gesture policy |
| `src/investigation/VerifyEvidence.tsx` | Selected-sample payoff, observation-specific core counts, complete flag interpretation/comparison explanation, technical disclosure and challenge bridge; original export retained |
| `src/investigation/interpretation.ts` | Small presentation helper using existing `samplePixel`; interaction identity, conditional explanations and actual excluded-core selection. No new scientific model or quality policy |
| `src/investigation/investigation.css` | Scoped narrative/document hierarchy, accessible controls, restrained status rules, responsive reading lanes and wrapped technical content |
| `src/main.tsx` | Pass the existing Time navigation callback into the investigation; existing routing and source workflows retained |
| `tests/narrative.test.mjs` | Four real-data/state tests |
| `tests/react-render.test.mjs` | Three added React-rendering tests and helper import resolution |
| `tests/e2e/investigation.spec.ts` | Updated invitation selectors and an intentional-inspection/direct-VERIFY scenario |

Documentation changes: `README.md`, the existing `AGENTS.md` and `docs/DECISIONS.md`, this delivery record and the short implementation plan. `source-changes.diff` records the request-specific delta against the dirty starting worktree, rather than presenting earlier changes as new work.

## Executed verification

| Check | Result |
|---|---|
| Baseline lint / typecheck / `npm.cmd test` / build | PASS; **45 Node pass, 0 fail, 0 skipped** |
| Baseline Python `-m unittest discover -s tests -p test_rdra_pipeline.py -v` | **7 pass**, including offline byte-exact reproduction; pipeline unchanged afterward |
| Python `scripts/check_rdra.py` | PASS; both authentic curated FITS originals, arrays, masks, WCS grids and PNG alpha/grayscale |
| Final `npm.cmd run lint` | PASS; existing scope is investigation modules |
| Final `npm.cmd run typecheck` | PASS; whole application |
| Final `npm.cmd test` | **52 pass, 0 fail, 0 skipped** |
| Final `npm.cmd run build` | PASS; `index-DZ_bL5k3.js`, `index-DE7BFveG.css` |
| Source/build hash verification | PASS: **532** M101 artifacts, **14** native assets, **2** curated FITS originals, **11** dated previews, **17** original research inputs |
| `git diff --check` | PASS; informational Windows line-ending notice only |
| `npx.cmd playwright test --list` | **8 cases discovered**; standalone runner **NOT RUN** |
| Remote GitHub Actions | **NOT RUN** |

Actual CUA browser journeys exercised clean first arrival; canvas click, off-center keyboard inspection and reference actions; accepted/excluded states; both epochs and reset; direct VERIFY/refreshed focus; browser Back; provenance keyboard open/close; current selected-pixel exports on desktop and mobile; all **102** rendered mosaic positions and **11** dated previews; and the new challenge bridges. The locally served production bundle also loaded the native data and the direct VERIFY page. A deliberately missing numerical buffer returned an explicit 404, **zero native canvases and zero earned results**, on desktop/mobile layouts. No substitute data was shown.

Desktop 1440×1000, mobile 390×844, tablet 768×1024 and laptop 1280×800 viewport overrides were checked. No horizontal overflow was measured in the checked layouts. The open mobile technical audit had client/scroll widths both 335px, within a 375px document. Before/after captures use matching desktop/mobile overrides. A computed CSS foreground/background check of 65 rendered primary-text samples found a minimum ratio of **8.73:1**. This targeted check excludes image/gradient backgrounds and disabled controls; it is not a full WCAG certification.

The initial new helper test failed before implementation; its four cases subsequently passed. A fit-touch gesture assertion also failed before the gesture-policy correction and passed afterward. All retained scientific invariant tests passed. Tests cover the absent-by-default explanation, accepted SOURCE-only evidence, excluded off-center pixels, epoch identity and direct rendering of complete VERIFY content.

Evidence directory: `screenshots/narrative-2026-11-03/`, including `final-checks.txt`, `integrity.json`, `contrast-check.json`, `browser-acceptance.json`, actual JSON exports, baseline source hashes and the source diff. Formal Playwright/remote-CI execution is distinguished from the executed CUA journeys.

## Actual before / after

| State | Before | After |
|---|---|---|
| Desktop FIND | ![Before FIND](screenshots/narrative-2026-11-03/before-find-desktop.jpg) | ![After FIND](screenshots/narrative-2026-11-03/after-find-desktop.jpg) |
| Desktop VERIFY | ![Before VERIFY](screenshots/narrative-2026-11-03/before-verify-desktop.jpg) | ![After VERIFY](screenshots/narrative-2026-11-03/after-verify-desktop.jpg) |
| Mobile FIND | ![Before mobile](screenshots/narrative-2026-11-03/before-find-mobile.jpg) | ![After mobile](screenshots/narrative-2026-11-03/after-find-mobile.jpg) |

SEE, earned-inspection, technical-audit, production and error screenshots are in the same directory. These are actual browser captures of original scientific assets; no astronomical artwork or observation was generated.

## Preserved limits and remaining gaps

No processing program, scientific gate, observation manifest, original FITS or generated data asset was changed in this task. Native LVF wavelength remains position-dependent; the approximate target-center label is not a selected-pixel calibration. Mosaic wavelength layers remain a separate product, not dates. Native orientation, WCS/RA-wrap, units, variance handling, mask policies and numerical exports are retained. All **55 M101 temporal pairs remain blocked**; native R Draconis registration, blink, difference, photometry, motion and discovery remain unsupported. Calibration UUID linkage and independent source identity remain unverified.

The ten-/thirty-/120-second judge goals are design targets, not results of a timed first-time-user study. Physical touch/high-DPI devices and assistive screen-reader use were not tested. The work improves real inspection and evidence qualification but does not complete validated temporal comparison or establish production readiness.

Current status: local implementation and build verified; **uncommitted**, **not pushed**, **not deployed**. The prior public website was not updated by this task. The temporary production/failure QA servers are removed after verification; the canonical development app remains available on localhost:5173.
