# V3 executed verification and performance

The existing application was extended in place. The accepted scientific dataset was not regenerated.

## Browser acceptance

Executed in the local Chromium in-app browser against the production build at http://127.0.0.1:5173/.

- A selector: 102/102 channel transitions; B selector: 102/102. All observed A wavelength attributes exactly match accepted channel metadata (zero mismatches).
- Side-by-side source transforms and dimensions matched exactly. Full-field fit remained at zero pan after an arrow-key pan attempt.
- Divider arrow keys, Home (0), End (100), and pointer dragging at mobile width (50 to 73) worked.
- Mobile viewport content width: 375 CSS pixels, scroll width: 375. Screenshots also captured at 1440×900 and 1280×800.
- Native sampling canvas: 267×267. Shared linear/asinh presets and common/native mask controls exercised.
- Guided journey completed all five steps; Reveal continuation required actual divider movement.
- Coordinate inputs changed the shared selection to (100,120), radius 8. VERIFY and the copied record reported 166/197 common pixels, means 0.2376068487808288 and 0.18073615465447845 MJy/sr. Opening the saved URL recomputed those values. Same-page hash changes now also restore state.
- Original-buffer 102-channel profile rendered and JSON export action executed. Temporal comparison button remained disabled.
- Browser console error sample: zero errors.

Machine-readable details: `screenshots/v3-browser-acceptance.json`. Source integrity and numerical rendering checks: `test-results.json` and `test-results.txt`.

## Performance measurements

Final production build, local session, 1440×900: first comparison painted 2445.2 ms since navigation; verified pair load, shared contrast and both canvas draws 1227.3 ms; Chromium JS heap sample 35.76 MiB; 6.19 MiB retained numerical buffers across 7 planes (including adjacent preloads).

Six cached channel-switch samples during an investigation session: 981.3, 642.0, 423.3, 410.3, 560.3, 1024.4 ms. Retaining all 102 numerical planes uses 90.15 MiB. JS heap samples in that session ranged 113.22–138.25 MiB. Earlier navigation in the same local QA session measured 419.6 ms; this variation is why no speed improvement is claimed.

These observations include browser scheduling and source verification; HTTP cache may be warm. JS heap is not total browser/GPU memory. Responsive presentation rasterization is capped at 1100 pixels, original sampling at 267. Divider/pan operations reuse canvases rather than decode images. This is not a cross-device benchmark.

## Review corrections

Read-only review found and implementation corrected: comparison/profile region desynchronization; missing keyboard path to investigation; misleading fixed-center Fit marked region; unknown saved-state keys; same-page saved-link restoration. Fresh automated tests reject unsupported saved flags and reproduce all three demonstration metrics from original buffers.

## Limits of acceptance

No physical touchscreen, assistive screen-reader session, or new-visitor timing study was executed. Pointer events were tested at mobile width and keyboard paths were exercised. The 15-second comprehension goal remains a product objective, not an empirically established usability result. No calibration, independent astrometry, physical-cause, discovery, variability, or scientific-grade spectrum claim is made. All 55 temporal pairs remain disabled.
