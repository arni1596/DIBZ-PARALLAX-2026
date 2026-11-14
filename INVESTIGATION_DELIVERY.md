# Integrated observational investigation

The canonical V3.1 application now opens with a complete R Draconis search-field FIND → SEE → VERIFY journey. M101 Spectral Reveal, all 102 authentic wavelength positions, numerical investigation, and the separate 11-exposure dated gallery remain integrated. No M101 dataset was regenerated.

## Implemented modules

- `src/investigation/Investigation.tsx`: field introduction, genuine epoch selection, independent side-by-side views, loading/retry states.
- `ObservationViewer.tsx`: native numerical rendering, quality mask, mask-safe optional smoothing, keyboard selection, bounded zoom/pan, DPR-aware canvas, cached presentation raster.
- `VerifyEvidence.tsx`: selected-pixel IMAGE, VARIANCE, eligible statistical uncertainty, WCS coordinates, flags, comparison gates, provenance and actual JSON report download.
- `model.ts` / `integrity.ts`: explicit typed evidence contracts, SHA-256 asset verification, full-array mask validation, stale-evidence rejection, blocked scientific comparisons and report generation.
- `investigation.css`, `src/main.tsx`, `index.html`: cohesive responsive design, integrated navigation and field-specific evidence.
- `scripts/prepare_rdra.py`, `scripts/check_rdra.py`: reproducible offline preparation and independent FITS-to-buffer/mask/preview verification.
- `public/investigations/rdra-v1/`: versioned manifest, ten numerical buffers, four preview/quality PNGs and two original-header JSON records.
- `tests/investigation.test.mjs`, `tests/react-render.test.mjs`, `tests/test_rdra_pipeline.py`, `tests/e2e/investigation.spec.ts`, `playwright.config.ts`: contract, rendering, scientific pipeline and complete browser-journey tests.
- `.github/workflows/scientific-investigation.yml`, `requirements-ci.txt`, `eslint.config.mjs`, package lock, `.gitattributes`: Windows CI, pinned scientific dependencies, scoped linting, byte preservation and reproducible builds.

## Actual observations and verified science

The bundled FITS fixtures are copies of existing authentic local IRSA cutouts, not generated test astronomy. They are outside `public/` and are not downloaded by the browser. The manifest links each to its original QR2 archive product. SHA-256 identifies the **local cutout bytes**, not the remotely linked full-frame FITS.

| Cutout | UTC | Local cutout SHA-256 |
|---|---|---|
| rdra_row_0001.fits | 2025-06-08T18:56:30.592Z | 3d5dbe6632da1755a8ea45a3569c2a39d166a81e395935d72816de2f9faa260e |
| rdra_row_0052.fits | 2025-12-10T20:57:48.807Z | 8d416539f59b7dbb355ea06109a348e99a2a3c10f26773efaf2cec35eb6ceaf3 |

Required extensions, dimensions, units, dates, integer FLAGS, primary TAN-SIP WCS, raw numerical buffers, quality masks, preview grayscale/alpha and unchanged source hashes were checked. All 17 generated files reproduce byte-for-byte offline using the pinned Windows scientific environment. Numerical WCS serialization tolerance is 1e-9 degree; this tests serialization, not independent astrometric accuracy.

SOURCE bit 21 alone is retained. All other flags, nonfinite IMAGE, and nonfinite/nonpositive VARIANCE are excluded. Accepted pixels: 2051/2209 and 2077/2209. Search-coordinate core: 19/19 and 21/21 excluded. The central native pixel has NaN IMAGE/VARIANCE and FLAGS 2097158 (OVERFLOW, SUR_ERROR, SOURCE) in both observations. No core photometry is inferred. FINAST=0 records a good pipeline fine-astrometric solution; it does not validate a cross-epoch registration.

Approximate 1.4386/1.4396 µm labels originate in WCS-WAVE visualization metadata. They are explicitly unverified for scientific calibration. Recorded calibration UUIDs are provenance evidence, not authenticated external calibration bytes or equivalent bandpasses. Search-coordinate source identity is not independently confirmed.

## Deliberately blocked conclusions

Registration residuals, effective response compatibility, PSF matching, background/photometric conditions and motion validation are not established. Blink, registered difference, photometry and motion inference remain disabled. Side-by-side views are independent native grids with independent display stretches. All 55 M101 temporal pairs remain disabled. No discovery, variability, institutional approval or scientifically certified 102-channel coverage is claimed.

Rendering uses accepted-pixel 2–99.5 percentile asinh grayscale, softening 8, independently per epoch. PNG alpha preserves excluded pixels; black is the presentation background. Amber is a quality overlay. Optional interpolation affects presentation only and never fills excluded pixels. Native 47×47 sampling is stated visibly; zoom creates no extra resolution. Statistical sqrt(VARIANCE) excludes calibration systematics and covariance and is not source photometry.

## Executed verification and reproducibility

See `test-results.json`, `test-results.txt`, `rdra_validation_results.json` and `screenshots/investigation-browser-acceptance.json` for executed results. Node tests cover all original M101 invariants plus the real R Draconis contracts, hashes, error/retry behavior, stale reports and React server rendering. Seven Python tests include malformed-input failures and actual offline reproduction. Lint applies to the new investigation modules; TypeScript checking covers the complete application.

Desktop 1440×1000 and mobile 390×844 browser journeys were executed through the actual running application: epoch changes, keyboard pixel selection, side-by-side, accepted/excluded evidence, masks, zoom, pan limits, provenance and JSON export. A real local 404 fixture produced explicit errors with no synthetic fallback in both viewports. At zoom 8 the native pan bound was exactly 20.5625 pixels. All 102 M101 channel switches finished loading real buffers. Mobile had no horizontal overflow. Physical touch hardware, assistive screen-reader behavior and independent scientific registration were not tested.

Four Playwright cases (two scenarios × desktop/mobile) are included and discoverable. Their matching journeys were exercised through the browser-control interface; the standalone Playwright runner and remote GitHub Actions have **not** been executed here. CI is configured for a future GitHub mirror; the hosting source repository is not GitHub. Do not describe configured CI as a passed remote run.

Current tooling retains React/TypeScript and upgrades Vite/ESLint to supported registry releases. A minimatch override resolves the observed dependency advisory. No new application framework or fabricated imagery was introduced.

## Recovery and delivery

There was no Git repository at baseline. A complete source/public recovery snapshot was made before edits: `../PARALLAX-V3.1-before-investigation.zip`, SHA-256 `dd07393e3f4d1931bb1a873a410d2409d2c2d916e4f793a3e91639968af39c5c`. Generated dist can be rebuilt. The initial simultaneous snapshot/build caused a transient file-lock failure; the sequential baseline build and all 29 baseline tests passed. Later preview-alpha checks caught and corrected a real excluded-pixel transparency problem. The final navigation check caught and corrected a stale investigation anchor entering M101.

Screenshots under `screenshots/investigation-*.jpg` are actual local browser captures. `examples/rdra-investigation-evidence.json` is an actual downloaded report. Setup and deployment instructions are in `README.md`. Hosting records and any successful public URL are reported separately after the native deployment result; a configured expected URL is not proof of a live deployment.
