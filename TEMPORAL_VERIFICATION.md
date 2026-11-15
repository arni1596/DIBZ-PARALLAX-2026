# V3.1 executed verification

The independent pre-change baseline passed all 24 V3 tests, all 532 accepted artifact hashes, and all 17 original research-input hashes. No spectral dataset was regenerated.

The added temporal suite checks original source identity (filename + SHA, not repeated OBSID alone), genuine timestamps, detector and wavelength/bandwidth agreement, all55 preserved original pairs, fail-closed Level1-only capability, dated records, pinned gallery and11 assets, null independent registration residual and executed bounded candidate matching. The existing 24 tests remain intact. Final exact totals and integrity results are in `test-results.json` and `test-results.txt`.

The independent Python verifier reads every original dated FITS and compares every new PNG grayscale sample and alpha value against IMAGE, FLAGS and VARIANCE. All11 pass; all original file hashes remain unchanged. `temporal_asset_verification.json` records each product. The two scientific resampling/matching attempts and55 pair decisions are in the required root reports.

## Actual browser tests

Production build at http://127.0.0.1:5173/, local Chromium:

- Every one of11 native observations loaded through selector A and selector B (22 successful transitions).
- All102 spectral A-channel selections rendered after returning from Time. Their wavelength attributes exactly matched accepted spectral metadata (zero mismatches).
- Time and Spectral navigation, keyboard observation selection, contextual VERIFY, authentic timestamps and available-but-unverified D2 external CWAVE/CBAND inspected.
- Copied dated link restored files row136 and row53 from Spectral mode. JSON save action exercised. Product identity uses filenames/source hashes, so shared detector OBSIDs cannot silently select the wrong product.
- No temporal range slider/divider, synchronized temporal zoom, blink or measurement control exists. These tests are not applicable to Level1; enabling them would contradict the NO-GO. The spectral divider/zoom remain separate.
- Mobile content width375 CSS pixels equals scroll width375: no horizontal overflow. Desktop1440×900 and mobile390×844 viewport screenshots captured and reviewed. Corrected mobile date wrapping during screenshot review.
- Browser console error sample: zero errors. Loading states and integrity failures use explicit errors with no fabricated fallback. During development, a stale bundle correctly blocked a changed temporal contract until reload.

Screenshots: `v31-time-desktop.jpg`, `v31-time-verify.jpg`, `v31-time-mobile.jpg`, `v31-time-mobile-image.jpg`; existing V3 Spectral Reveal screenshots remain included.

## Measured local performance

Time entry to two loaded previews: **542 ms** wall clock around browser actions and the loaded-image wait; includes automation overhead. Verified temporal contract readiness: **207.9 ms** on initial entry and **47.8 ms** on a later cached entry. Whole application Chromium JS heap sampled after Time/Spectral switching: **47.05 MiB**; retained numerical spectral buffers6.19 MiB across7 planes. These are observed local-session values, not Time-only memory, total browser/GPU memory or an improvement benchmark. Browser HTTP cache may be warm. The gallery does not load raw FITS or require IRSA.

Physical touchscreen, screen-reader and first-time-user comprehension studies were not executed. Pointer/keyboard paths at mobile width and responsive layout were inspected. This report does not turn scientific NO-GO into a pass: Level1 gallery tests pass; Level2 registration and Level3 quantitative change are not validated.
