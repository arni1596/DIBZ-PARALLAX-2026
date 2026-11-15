# UX engineering review and selective integration

November 15, 2026. Release baseline: `6342492d72987330581f6fc8cbdb7725dce10e9e`. Review branch: `review/zak-ux-quality-hardening`. No merge or deployment command is part of this review.

## 1. Executive verdict

The selectively integrated UX interactions are ready for review with the corrections below. The entire `ux` branch is **not ready for direct release integration**: it is eight commits behind and eleven commits ahead of this release baseline, omits the later narration/editorial integrations, and reproduces inherited first-visit and source-disclosure problems. This is an integration hold, not evidence of a defective scientific pipeline or an award prediction.

## 2. Actual contribution and release inventory

Git history identifies eleven `leizakaryah` commits on `ux` (`19a56d5` through `6d0c5f7`): font preferences, touch targets, profile navigation, evidence tabs, landscape sizing, loading inset, mobile evidence navigation, dropdowns, motion, chapter transitions and a shared source menu. The branch is unmerged. Its dedicated detached review worktree built successfully, passed its 65 Node tests, and verified all 630 assets. Those checks alone did not reveal its first-visit defect.

The release already contains the RC2 source/data, observation-led Journey, R Draconis/Atlas inspection, spectral comparison, dated gallery, Evidence Ladder/Passport, source navigation fix, six-part narration and the PR #12 editorial refinement. These are preserved, not replaced by older pages.

| Work | Verified state and consequence |
|---|---|
| PR #7 / #8 | Merged observation-led experience and source-navigation correction; authorship follows Git, not the UX lane assignment |
| PR #9 / #12 | Merged narration and editorial refinement; current baseline |
| `ux` at `6d0c5f7` | Eleven commits by `leizakaryah`, unmerged; inspected in source and at localhost:5192 |
| PR #11 at `fab5dfa` | Open, targets `ux`; proposes first-visit/evidence/source corrections for that branch, not a release merge |
| PR #10 at `055cbbf` | Open, overlaps the later merged PR #12; do not overwrite current scripts or audio revision paths with it |

The integration reuses interaction hunks from `03620230cd8f41865ab020b13abc21c8d0a8b79b` and `6420cfa862533b42c765703180e5ef6a053fd4e0`, plus the mobile evidence-shortcut intent of `94e6c6c`. A source-file patch conflict was resolved by preserving the current editorial copy and applying only the tab behavior. Original contributor commits/branches remain intact; attribution is retained in the integration commit.

## 3. Verified defects and corrections

No P0 scientific corruption or P1 critical-workflow blocker was demonstrated in the current release. The following P2 findings are observed behavior, not formal claims of complete WCAG conformance or failure.

| ID / location | Reproduction and actual result before correction | Expected / root cause / correction |
|---|---|---|
| Q1 — `src/main.tsx:28`, `:72` | Open `#single`, choose The evidence, focus DATA and press Right. SOURCE stays unselected; panels have no tab association. | A tab interface needs coherent keyboard navigation and labels. Selectively integrated wrapping Left/Right, Home/End, roving focus, panel IDs/labels and focusable panels from `6420cfa`. |
| Q2 — `src/components.tsx:15`, `:42` | Open `#single` → Investigate a region. The real 102-channel profile has 102 chart Tab stops and small direct-hit dots. | Make the chart practical to traverse without removing samples. Integrated `0362023`: one chart Tab stop, arrows/Home/End, selected state and a transparent nearest-channel pointer area. CSV values and numerical calculations are unchanged. The existing values table remains available. |
| Q3 — `src/style.css:54` | At 390 CSS pixels, `#single` has no visible header evidence shortcut. | An older mobile rule hides every header anchor. Restore the shortcut and wrap the navigation at narrow widths instead of squeezing or hiding it. This carries forward `94e6c6c` without importing the entire old header. |
| Q4 — `src/main.tsx:76`, `src/reveal.tsx:55` | SOURCE says remote origin is unverified; copied spectral summary calls it unauthenticated. The recorded public FITS receipt says it matched. | Old presentation copy survived the later verification. Bind the corrected label to both the exact SHA-256 and URL through `src/sourceIdentity.ts`, cite the recorded November 14 match, and retain unresolved calibration/exposure/DOI qualifications. Remove an unnecessary local filesystem path from the visitor panel; the original metadata remains accessible and unchanged. |

An additional **unmerged-branch** finding was reproduced at exact commit `6d0c5f7`: a blank URL displays “2 of 6 · Light” and hides the opening. `git blame` traces the `act=1` default to the original imported `e8828057`, **not to a Zak-authored change**. Current release defaults to act 0 and already fixes it; no redundant fix was applied. The old shared menu also repeats superseded byte-identity/clearance language. PR #11 addresses that branch; its whole-file versions were not copied into the release.

## 4. Visitor experience and evidence

The current opening still presents one primary action and the real M101 image. The review makes existing investigation paths easier to use rather than adding another introduction. First click, actual pixel selection, scientific error recovery, Passport export, optional narration, keyboard close/focus restoration and reduced motion were exercised in the browser suite.

| Evidence | Interpretation |
|---|---|
| [Unmerged UX first visit](quality-preview/ux-branch-first-visit.png) / [preserved release opening](quality-preview/release-opening.png) | Different commits, explicitly labeled: why replacing current pages with `ux` would lose the corrected entry flow. This is not represented as a new hero redesign. |
| [Old UX source menu](quality-preview/ux-branch-source-menu.png) / [corrected release source notice](quality-preview/source-after-mobile.png) | Different source surfaces: superseded remote-identity wording versus the guarded recorded-match notice. |
| [Focused profile after integration](quality-preview/profile-after.png) | Actual scientific samples with one chart Tab stop; the regression records 102 before and 1 after. |

Normal layout checks found zero horizontal overflow at 320×568, 390×844, 768×1024, 844×390 and a 720×450 reflow viewport. Original hero image dimensions remain 267×267. Separate 200% **CSS body-zoom stress**, which is not native browser zoom, produced overflow of 105/21/87 CSS pixels at tablet/mobile/narrow sizes; desktop had zero. Do not call that a native-browser-zoom pass or a proven WCAG violation. Actual browser zoom, manual screen-reader output, physical touch devices and full contrast conformance remain human/browser verification items.

## 5. Scientific integrity

- All 630 cleared assets, totaling 114,751,955 bytes, pass the original verifier unchanged. Source FITS, masks, scientific JSON, provenance, calculations and dataset hashes were not edited.
- Unit/browser checks retain all 55 blocked temporal comparisons, missing/rejected-pixel handling, original samples, native geometry, predicted-position versus detection distinctions, and source-aware Passport values. No independent R Draconis variability finding is claimed.
- `release/M101_REMOTE_RECEIPT.json` records the public source byte match. Matching bytes do not establish release DOI, exposure identity, calibration, registered temporal comparison or scientific significance. Frozen historical metadata remains unchanged; the presentation correction supersedes only its outdated remote-identity wording.
- Apparent concerns about off-center Fit marked region were checked against the transform and bounds math. No defect was demonstrated; that math was deliberately left unchanged.

## 6. Executed checks

All commands below ran from the review checkout. Browser testing used an existing local-only config override for Edge at localhost:5191 because the pinned Playwright Chromium executable is absent; no browser or new dependency was installed.

| Exact command | Result |
|---|---|
| `npm.cmd ci --no-audit --no-fund` | PASS, existing lockfile; first attempt hit a Windows native-binding lock from the running local preview, then passed after that preview was stopped |
| `npm.cmd run typecheck` | PASS |
| `npm.cmd run lint` | PASS; repository-defined investigation scope |
| `npm.cmd test` | 68 passed, 0 failed |
| `npm.cmd run check:contracts` | 8 passed, 0 failed |
| `npm.cmd run build` | PASS |
| `npm.cmd run test:e2e -- --config editorial.local.config.ts --workers=3 --output ../quality-final-results` | 86 passed, 0 failed, desktop/mobile Edge projects; includes 10 new cases |
| `python release/verify_assets.py` | PASS: 630 unchanged assets |
| Existing scientific Python: `-m unittest discover -s tests -p test_rdra_pipeline.py` | 7 passed |
| Existing scientific Python: `-m unittest discover -s tests -p test_atlas_assets.py` | BLOCKED: `.local-data/atlas/observation-evidence.json` absent; suite fails during import before its 3 reproduction cases execute |
| `git diff HEAD --check` | PASS |

The default Python lacks Astropy; the already installed scientific environment was used. Initial targeted browser tests failed on the tab/profile defects as expected. A later source-copy assertion needed case-insensitive matching of “Calibration”; the final complete run passed. Narration and clipboard lifecycle fixtures are explicit mocks; they do not claim audible Azure playback or external clipboard-service validation.

## 7. Acceptance and remaining risks

| Criterion | Observed assessment |
|---|---|
| Scientific integrity | Tested guards and protected bytes preserved; full Atlas reproduction remains blocked by its local acquisition record |
| Reliability | Critical release journeys and error recovery pass the 86-case browser run; no demonstrated P0/P1 in this scope |
| First impression | Current entry and primary action retained; unmerged `ux` blank-URL entry fails and must not replace it |
| Experience quality | Targeted keyboard, profile selection, mobile evidence access and source text improved; no blanket accessibility certification |
| Distinctiveness | Actual inspection, evidence limits and traceable Passport remain the product interaction; no new simulated science or decoration |

Highest priorities remain: reconcile any further whole-branch UX integration against the current release; complete human scientific/demo acceptance and independent eligibility/licensing decisions; obtain the original Atlas acquisition record for full reproduction; generate/review narration tracks if desired; verify native browser zoom, screen-reader behavior and physical mobile use. No new Azure MP3s are generated or claimed. No award, user-comprehension study, production availability or competition eligibility is asserted.

## 8. GitHub delivery

Focused branch: `review/zak-ux-quality-hardening`, based on the captured release SHA above. The PR contains only reviewed interaction/source-disclosure changes, regression tests and this evidence. It must not be used as authorization to merge another PR, deploy, change DNS or submit.
