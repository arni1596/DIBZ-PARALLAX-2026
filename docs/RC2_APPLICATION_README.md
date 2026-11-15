# Mission Control local preview — 5 November 2026

This is an integration-ready patch tested against a snapshot of the canonical PARALLAX V3.1 application, including its existing uncommitted work. It is pre-event development, **not a competition-compliant submission or deployed update**. Current global rules did not establish permission for pre-event implementation; organizer confirmation is required before competition integration. Canonical source, branch and original data remain unchanged.

The default route now introduces four authentic 3I/ATLAS observations with an attributed NASA activity finding. `#investigation-find` retains R Draconis; `#spectral` and `#time` retain M101. No raw FITS or live archive request is required by the browser.

```powershell
npm.cmd run build
npm.cmd run preview -- --port 5174
# Open http://127.0.0.1:5174/
npm.cmd test
npm.cmd run lint
npm.cmd run typecheck
npx.cmd playwright test --config playwright.mission.config.ts
```

Comet asset reproduction: use the existing scientific Python environment to run `scripts/prepare_atlas.py --output <scratch-directory>`; tests/test_atlas_assets.py compares original samples, PNG masking and complete offline reproduction. Input paths and hashes are recorded in the existing target-selection receipts. No original FITS is modified or downloaded.

Claims and asset lineage: `public/investigations/atlas-v1/manifest.json`. Findings are attributed to NASA/mission-team research, positions are predicted, and dates/wavelengths/stretches differ. No PARALLAX brightening, motion, composition or source-photometry claim is enabled. All 55 M101 pairs remain disabled.

The remainder of this README preserves the earlier canonical documentation and its historical delivery reports.

---

# PARALLAX — Observations & Evidence

Latest local delivery (2026-11-03): [GUIDED_DISCOVERY_DELIVERY.md](GUIDED_DISCOVERY_DELIVERY.md) records the verified two-sample interaction, conditional explanations, responsive geometry, screenshots and exact checks. [NARRATIVE_DELIVERY.md](NARRATIVE_DELIVERY.md) preserves the preceding narrative changes. The preceding repair remains documented in [COHESION_DELIVERY.md](COHESION_DELIVERY.md). These changes have not been committed, pushed or publicly deployed. Future coding sessions must follow [AGENTS.md](AGENTS.md) and the single [decision log](docs/DECISIONS.md).

The existing V3.1 application now opens with an integrated **R Draconis search-field FIND → SEE → VERIFY investigation**. Explore two authentic SPHEREx observations, inspect actual native pixels and quality flags, and export an accurate evidence record. M101's 102-channel Spectral Reveal and separate dated gallery remain available. This is exploratory visualization, not validated source photometry or a discovery claim.

Read [INVESTIGATION_DELIVERY.md](INVESTIGATION_DELIVERY.md) for changed modules, exact observation provenance, executed verification, screenshots and limitations; [RDRA_SCIENCE.md](RDRA_SCIENCE.md) explains the scientific decisions.

## Quick start (Windows, Node 24.11.1)

Run from this directory:

```powershell
npm.cmd ci
npm.cmd run build
npm.cmd run preview
```

Open http://127.0.0.1:5173/. If the existing preview already occupies 5173, use it after rebuilding; do not launch another listener on the same port. For source development use `npm.cmd run dev` instead of preview. The browser loads packaged numerical buffers and PNGs, never raw FITS. No archive credentials or network astronomy request is required.

## Reproduce and verify the real observational slice

The two bundled FITS fixtures and curated acquisition records in `tests/fixtures/rdra/` are authentic copies, not simulated data. Use Python 3.14 with the pinned scientific dependencies:

```powershell
py -3.14 -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements-ci.txt
.venv\Scripts\python.exe -m unittest discover -s tests -p test_rdra_pipeline.py -v
.venv\Scripts\python.exe scripts/check_rdra.py
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
node scripts/verify-package.mjs
```

To reproduce the versioned assets for comparison without overwriting them:

```powershell
.venv\Scripts\python.exe scripts/prepare_rdra.py --output .test-work\rdra --report .test-work\rdra-report.json
```

`--source` can point at another directory containing the same original cutouts and curated records. Do not bypass checksum failures. Preparing a different scientific product requires review and a new version, not silently replacing the pinned manifest. Neither preparation nor verification downloads data or modifies original FITS.

Browser regression tests: `npx.cmd playwright install chromium`, then `npm.cmd run test:e2e`. The Windows CI workflow runs lint, whole-app type checking, Node tests, scientific validation, reproducibility, production build and desktop/mobile browser tests. Remote CI and the standalone Playwright runner have not been executed in this delivery; actual desktop/mobile journeys were executed with the browser-control interface and recorded separately.

## Deployment

The application is a static Vite build. Publish the complete `dist/` directory over HTTPS, preserving all binary assets byte-for-byte and serving `.f32`, `.f64`, `.u32`, `.u8` as binary files. Use the tracked `.openai/hosting.json` project identity for the existing Sites destination; never create another PARALLAX app to update it. The supported Sites workflow pushes exact source, packages matching `dist/`, saves that commit and deploys the saved version. No runtime secrets are needed. Only a successful native deployment result establishes a live URL.

## Preserved M101 V3.1 experience

Explore the same M101 field in 102 authentic SPHEREx infrared wavelength channels. The primary experience compares Wavelength A and Wavelength B with a draggable divider or synchronized side-by-side views. Wavelength selection is spectral, never a passage of time.

## V3.1 temporal evidence recovery

Verdict: **DATED_IMAGES_ONLY**. All 55 original temporal comparisons remain disabled. Eleven genuine, quality-masked native observations can be inspected independently in the **Time** gallery; the 102-channel Spectral Reveal remains a separate wavelength experience.

The two closest same-detector pairs were actually resampled in memory using their primary TAN-SIP spatial WCS, with all contributing pixels required to pass the exposure quality policy. Shared valid coverage was 80.80% (D2) and 82.99% (D5). Neither independent registration residual nor matched effective spectral response was established. Approximate rectangular passband overlap is only ~55%; the D2 external-value surrogate is 56.52% with unverified calibration linkage. These are screening diagnostics, not instrumental equivalence or variability validation.

Time uses **independent native grids and independent 1–99% display scales**. It offers dates, bandwidths, source checksums, contextual VERIFY, JSON evidence export and `#dated=` view restoration. No synchronized zoom, divider, blink or image subtraction is enabled for these unregistered observations. SOURCE-only flags remain eligible; all other set bits, missing IMAGE and nonpositive/nonfinite VARIANCE are excluded conservatively. No excluded pixels are filled. Filenames and SHA-256 identify products uniquely because observation IDs repeat across detectors.

Required reports: `temporal_pair_audit.csv` (55 rows), `temporal_candidate_ranking.csv`, `temporal_registration_report.json`, `temporal_verdict.json`, `temporal_science_limitations.md`, and `TEMPORAL_DECISION_SUMMARY.md`. The gallery contract and 11 native PNGs are in `public/temporal/`; root reports are copied there for VERIFY links. Original `public/dataset/` is unchanged.

Reproduce only the bounded temporal audit and independently verify its native image masks:

```powershell
& 'C:\Users\ishan\Desktop\PARALLAX-Research\.venv\Scripts\python.exe' scripts/audit_temporal.py
& 'C:\Users\ishan\Desktop\PARALLAX-Research\.venv\Scripts\python.exe' scripts/verify_temporal_assets.py
npm.cmd test
npm.cmd run build
node scripts/verify-package.mjs
```

The audit uses existing local input paths from the accepted processing report. It does not download observations or rebuild spectral assets. Reproducing elsewhere requires those originals at their recorded paths or adjusting local source-path configuration. If derived gallery bytes change, review the evidence and update the pinned hash in `src/temporalIntegrity.ts`; never bypass a failed integrity gate. Python dependencies: Astropy, NumPy, SciPy, Pillow. Normal website operation uses only the packaged assets and needs no IRSA connection.

## Run on Windows

```powershell
Set-Location 'C:\Users\ishan\Documents\Codex\2026-10-29\superpowers-plugin-superpowers-openai-curated-remote\outputs\PARALLAX-M101-automated-channel-map\explorer'
& 'C:\Users\ishan\Desktop\PARALLAX-Research\.venv\Scripts\python.exe' -m http.server 5173 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:5173/ using HTTP rather than file URLs. `start-local.ps1` also accepts `-Python` and `-Port`. Stop the server with Ctrl+C.

For source development and verification:

```powershell
npm.cmd ci
npm.cmd test
npm.cmd run build
node scripts/verify-package.mjs
npm.cmd run dev
```

Use the included locked dependencies. Dev and preview bind localhost:5173. Build before serving dist after source changes. These commands do not regenerate the dataset.

## Investigate

Choose independent A/B wavelengths, move the divider, switch layouts, and pan or zoom the shared field. Central-region framing highlights the measured demonstration; full-field fit and reset remain available. Controls support keyboard and touch. Display settings offer shared asinh or robust linear contrast, common-coverage masking, optional presentation smoothing and original native sampling. The optional guided investigation moves through Discover, Reveal, Investigate, Verify and Takeaway.

Inspect a native pixel or region to retrieve original IMAGE values, NHITS and FLAGS. Profiles and region means use eligible numerical buffers, never display colors. VERIFY exposes exact channel identities, common support, source hashes, display settings and contextual limits. Save or copy a discovery record to preserve wavelengths, region, view and display state, exploratory values and provenance. Restored records validate their metadata and recompute the displayed measurements from the original buffers; link text is not scientific authority.

The original single-channel explorer, numerical profiles, evidence panels and exposure inspection remain available. All 55 unsupported temporal comparisons remain disabled.

## Evidence-selected comparisons

| Channels | Wavelengths (µm) | Common valid region | Core/surround mean ratio A → B |
|---|---|---|---|
| 35 / 86 | 1.656 / 4.429 | 88.60% | 9.17 → 4.85 |
| 45 / 75 | 2.089 / 4.034 | 89.04% | 8.70 → 5.90 |
| 25 / 63 | 1.315 / 3.293 | 81.89% | 8.29 → 7.15 |

All use native zero-based center (133,133), radius ≤45 pixels; the report crop is 85 ≤ x,y <181. Core radius ≤8; surrounding annulus 27 ≤ radius ≤40. A/B means use identical eligible pixel centers within each region. The annulus is not validated blank sky and these ratios are not calibrated source flux ratios.

Reproduce selection without downloads or dataset writes:

```powershell
& 'C:\Users\ishan\Desktop\PARALLAX-Research\.venv\Scripts\python.exe' scripts/select_reveals.py
```

The selector checks all 408 original numerical-buffer hashes, evaluates all 5,151 pairs, and writes only `public/reveals.json` and `REVEAL_SELECTION.md`. It ranks coverage, shared block structure, core/surround differences and nine common display trials. It rejects weak coverage/noise/structure candidates and isolated surrounding-level jumps, then chooses separated wavelength neighborhoods. 940 pairs pass; 4,211 fail one or more checks. The full score-ordered candidate audit, rejected reasons, exact masks and limitations are in `REVEAL_SELECTION.md`. The small frontend JSON includes selected metrics and all input hashes. Selection display trials are documented exploratory robustness checks; the live viewer uses the shared transform described below.

## Rendering and integrity

See `RENDER_DIAGNOSIS.md` for the distinction between source holes, display clipping and browser sampling. Spectral Reveal derives one transform from pooled A/B values on their common eligible native pixels, in the active field or central region. Asinh uses q0.005 and the maximum; softness is `max(0.12*(q0.99-low), 0.0001*(high-low), 1e-9)`. Robust linear uses q0.005/q0.995. Both layers receive identical limits. Optional interpolation changes display luma only and never fills excluded native pixels. Native sampling preserves the original 267×267 grid. Archived audit PNGs remain unchanged and retain their original shared linear display clipping. The separate legacy single-channel presentation labels its per-channel contrast explicitly.

The accepted dataset, original PNGs, numerical buffers, masks and exposure assets are unchanged. Dataset verification checks the 532 accepted artifact hashes and acceptance marker; original research-input checks are possible where their local paths exist. Accepted ZIP SHA-256: `840dfc08cd7f69a03b8ab028a4ae01bda1bf883ea3eb04c9ac5fdee5f7fcdb03`. Pinned acceptance marker: `15acc5fd8a06dc98b4572dbd74e5f06ea6893a98ac8f93e46c8f19683f44e3c0`.

## Scientific limits

This is an exploratory spectral mosaic. Its contributing exposure inventory, per-plane dates and calibration UUID lineage are not supplied; cube origin and calibration provenance remain unverified. Shared native WCS demonstrates common-grid geometry, not independently certified astrometry. Only propagated OVERFLOW, OUTLIER and SOURCE flags are assessed. Finite IMAGE, positive NHITS and accepted flags are required; SOURCE alone is retained. Unknown bits are excluded. A missing variance model, correlated noise, differing PSFs and bandpasses, and unvalidated aperture/background choices prevent scientific-grade spectra or calibrated photometric conclusions. No discovery, physical-cause attribution or temporal variability is claimed.

## Verification and deployment

Automated tests, checksum verification, actual browser captures and runtime measurements are separate evidence artifacts delivered with this build. Use the executed reports for results and machine-specific performance numbers; this README makes no unmeasured speed or memory claim. The report and screenshots describe the tested viewports and their actual results.

`src/reveal.tsx` provides comparison interaction; `src/comparison.ts` provides common native statistics, contrast and records; `src/display.ts` provides mask-safe display sampling; `src/science.ts` preserves scientific rules; `src/data.ts` verifies and loads source assets. `public/dataset/` contains immutable accepted data.

Deployment is local. A static HTTPS host must serve the complete dist directory at the origin root and preserve integrity-checked `/dataset/` bytes. No backend, API key, FITS download or original-exposure reprocessing is needed. No public publication was performed.


## Evidence Observatory journey — November 14, 2026

The bare application URL opens the existing verified M101 Light view. The optional skippable introduction remains at `#journey=0`. Chapters 1–5 connect authentic M101 spectral exploration, four Atlas observations across three dates, explicit quality limitations, a cited historical comparison and a downloadable actual-state Atlas Evidence Passport. Light stays mounted after first entry; Atlas keeps its active view between Time and Evidence. Date changes clear stale inspection state. No automatic achievement or scientific-change claim is recorded.

All prior tools remain at `#spectral`, `#single`, `#atlas`, `#time` and `#investigation-find`; saved spectral and dated hashes retain their existing handlers. No scientific source arrays, manifests, masks or processing were changed. Smooth presentation adds no measured detail. All 55 unsupported M101 temporal comparisons remain disabled. The Passport records the selected Atlas product, actual loaded view settings and any intentional pixel inspection; the spectral tool retains its separate evidence export. No deployment or eligibility determination is implied.


## P0 closure — November 14, 2026

The existing Sources & Methods disclosure now exposes source links, product/release limitations, actual display methods, unresolved DOI status, AI-assisted development and installed-package acknowledgments. No DOI is assigned to the packaged products without matching evidence; no NASA endorsement or competition eligibility is claimed. Metadata and dated-preview failures have actual Retry controls. Pending spectral layers show a real loading status. A direct Passport visit links to an observation; a hidden, never-viewed default canvas cannot create an invented viewport record.

Final local checks: 65 Node tests, 10 scientific Python tests, 18 existing browser cases and 12 P0 browser cases pass. The P0 cases were checked against both development and production previews, including 1440×900, 1280×800, 390×844 and 375×667. Typecheck, existing scoped lint and build pass. All 596 protected files and 48 non-dist JSON files remain unchanged; all 55 M101 temporal pairs stay disabled. Machine-local evidence and the reversible pre-edit ZIP are under `C:/Users/ishan/Downloads/Ishani-OS/work/p0-closure-2026-11-14/`. No public deployment or submission occurred.


## RC2 source of truth — November 14, 2026

For this release, this preview directory is canonical because all 11 P0 diff files were verified against the recorded patch. It is not a Git checkout; older branch/hosting references above describe the historical prototype and do not identify the RC2 build. The older explorer remains a separate dirty repository at b7cc749; its existing Sites destination publishes historical version 1, not RC2. No folder synchronization, commit, push or deployment occurred. The current release package and source/build hashes are under `C:/Users/ishan/Downloads/Ishani-OS/shareable/PARALLAX/`.

Official archive documentation and the IPAC publisher now establish QR2 collection DOI10.26131/IRSA652 for the recorded QR2 native cutouts. M101 archive lineage remains unverified; do not assign QR3/DR1 DOIs to that mosaic. RC2 changes are limited to the citation disclosure and AI-development HTML metadata. All science arrays, provenance JSON, quality policies and 55 blocked temporal pairs are preserved. Local regression gates pass; eligibility, original-code licensing, complete rights clearance, public RC2 access and human acceptance are not established.


## DIBZ RC2 local release — 2026-11-14

This release branch integrates the frozen Mission Control RC2 snapshot without changing runtime code or scientific data. Main at b7cc749b6e697bc4dbbd08744be1407e075e197f remains the rollback. Existing Sites identity and hosting configuration are preserved. No push, deployment, domain change or submission is authorized by this local integration. The GitHub collaboration target is https://github.com/arni1596/DIBZ-PARALLAX-2026; Sites uses a separate source remote. The checked-in CI verifies code and has no deployment step; repository-level rules/integrations remain unverified.
