# PARALLAX — QA and release acceptance

**Status: CONDITIONAL / not a new executed browser test report.**

## Live repository findings

- PR #12 (editorial/narration) and PR #13 (keyboard navigation and source disclosure) are **merged** to `release/rc2-collaboration`.
- PR #14 (landscape containment, Evidence simplification, Escape focus restoration) is **open, not merged**. Its PR description reports 68 Node tests, two targeted Edge Playwright cases, build/typecheck/lint, and 630 asset integrity checks; it explicitly says the full browser suite was not rerun. Treat these as developer-reported historical results.
- `docs/EDITORIAL_EXPERIENCE.md` reports an earlier 76-case browser run, while PR #13 reports a later 86-case run; neither substitutes for release verification after PR #14.
- PR #12/#13 state full Atlas Python reproduction was blocked by an absent optional local input; do not mark it green.

## Acceptance gates

1. Fix baseline: document the final merge commit and compare PR #14 against current release, including collision checks.
2. Scientific: run 630 asset verification, Node scientific tests, Python available suites, independently sample data, and ensure 55 disabled M101 pairs remain disabled.
3. UI: desktop and 390x844 portrait plus 844x390 landscape; first visit, Light divider, Time/Evidence selection, Passport export, Sources Escape/focus, deep links, responsive overflow and failures.
4. Audio: browser speech and optional Azure MP3 behavior with **real audible review**, not mocks alone.
5. Browser reliability: production build served without localhost-specific assumptions; no required network errors, corrupted data or console crashes.
6. External: accessible no-login project URL and publicly hosted <30 second demo or compliant deck as specified in official guide, with credits/disclosures.
7. Human release decision: eligible original work, licensed publication, exact destination approvals, team form submission and receipt.

## Result

No new test suite or production deployment was run through the GitHub connector. This is an evidence-based acceptance plan, not a claim that QA passed. **No authorization to merge or deploy is inferred.**
