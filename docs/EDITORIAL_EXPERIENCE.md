# Editorial experience refinement

November 15, 2026. Based on `release/rc2-collaboration` at `9778fe03b685ba897e256dddee38d501258c9a69`, including PR #9. This is an incremental refinement of the existing application, not a new event-period implementation.

## Implemented

- Kept “The universe leaves evidence.” and changed the primary action to “Begin exploring.” Removed repeated assurances, recommendation badges and footer slogans. Reviewed the Journey, spectral viewer, single-wavelength workspace, R Draconis, Atlas, evidence and transcript copy. Numerical explanations that qualify measurements remain in place.
- Retained the navy/serif identity. Reduced framing around the actual observation; on mobile, the image now sits above its caption at no more than 267 CSS pixels instead of sharing a narrow column with the caption. Original image bytes and nearest-pixel display are unchanged.
- Moved narration out of its fixed overlay and into document flow. Transcripts, play/stop, visible focus, close/Escape and focus return remain accessible. No autoplay or new animation.
- Rewrote all six scripts. Both the main Evidence action and narrated Evidence action now visit the historical chapter before Passport. Archived inspection state is retained.
- Shared `src/story.ts` between UI, browser speech and the existing local Azure generator. Revision-specific audio paths prevent stale MP3s from narrating revised text. The generator retains an American voice, measured rate and short sentence pauses.

## Scientific boundaries

No scientific assets, measurements, numerical renderers, quality policies, hashes, native-pixel semantics or export schemas changed. All 55 unsupported M101 temporal comparisons remain blocked. Wavelengths are not dates; a predicted marker is not a detection. Independent exposure switching is not a motion or brightness measurement. These qualifications remain beside the corresponding interaction. Original source URLs, DOI qualifications, AI-use and pre-event reuse disclosures remain accessible in Sources & Methods.

## Actual local screenshots

Captured with installed Microsoft Edge through Playwright, at 1440 × 900 and 390 × 844. Full-page images show real runtime assets. No generated astronomy or simulated measurements.

| | Before | After |
|---|---|---|
| Desktop | [Before](editorial-preview/before-desktop.png) | [After](editorial-preview/after-desktop.png) |
| Mobile | [Before](editorial-preview/before-mobile.png) | [After](editorial-preview/after-mobile.png) |

## Thirty-second walkthrough

1. Opening: the actual M101 observation and “Begin exploring.”
2. Light: move the divider with a drag or arrow key. Explain that wavelengths, not dates, change.
3. Time/Evidence: open an exposure and inspect a native pixel. Its recorded flags determine eligibility; the comparison remains limited.
4. Passport: show the selected source, inspection and “Not validated” change status.

This is a suggested recording sequence, not a claim that a new timed video or user study was completed.

## Audio limits

No new MP3s were generated, Azure accounts connected or audio published. Browser speech varies with installed voices. Automated lifecycle tests use explicitly mocked speech/media failures; they do not validate audible delivery. Generating and listening to all six revised Azure tracks remains a separate acceptance step; see [local workflow](AZURE_NARRATION.md). No merge, deployment or submission is performed by this change.

## Verification

Final local verification on November 15, 2026:

| Check | Result |
|---|---|
| Typecheck and Vite production build | PASS |
| Node unit tests | 67 passed, 0 failed |
| Existing lint command (investigation scope) | PASS |
| Desktop/mobile browser regression, including 6 new narration cases | 76 passed, 0 failed |
| Scientific asset verifier | 630 assets, 114,751,955 bytes unchanged |
| R Draconis Python reproduction/negative fixtures | 7 passed in the existing scientific environment |
| Atlas Python reproduction | BLOCKED: missing `.local-data/atlas/observation-evidence.json`; import fails before the 3 cases execute |
| Independent read-only review | No blocking findings |

Browser command: `node node_modules/@playwright/test/cli.js test --config editorial.local.config.ts --workers=3 --output ../editorial-final-browser-results`. The local-only override uses the existing desktop/mobile projects, installed Edge, reduced motion and the local server on port 5191. The standard repository command remains `npm run test:e2e` with its configured browser. Test requirements for touch and reduced motion are now explicit in their respective suites.

Browser testing used Edge because the pinned Playwright Chromium download is absent; no browser was installed. Physical mobile hardware, other browser engines and audible delivery remain unverified. Initial browser runs exposed an obsolete button selector, an invalid mock voice object, and missing desktop touch setup; these were corrected before the complete 76-case passing run. The default Python lacks Astropy; the existing documented scientific environment ran the 7 R Draconis cases successfully. No software was installed.
