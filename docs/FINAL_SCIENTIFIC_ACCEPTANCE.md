# PARALLAX — scientific acceptance audit (15 November 2026)

**Verdict: CONDITIONAL PASS (read-only review; no independent numerical execution).** This report evaluates source and recorded execution evidence at `release/rc2-collaboration`; it does **not** certify a new test run, archival calibration, source author consent, or competition eligibility.

## Checked source contracts

| Area | Inspected basis | Finding | Evidence status |
|---|---|---|---|
| Native R Draconis pixels | `src/investigation/model.ts` (`accepted`, `validateObservationData`, `samplePixel`) | Finite IMAGE, finite positive VARIANCE and non-SOURCE-21 flag rejection; mask disagreement fails; invalid samples have no eligible measurement value | SOURCE INSPECTED; not independently executed |
| Data integrity | `loadObservation`, `verifiedBytes` | Asset byte lengths and SHA-256 checked before decoding; rejected fetch results fail explicitly | SOURCE INSPECTED |
| Unsupported R Dra temporal conclusions | `validateInvestigation`, `comparisonAllowed` | Disabled registered/blink/difference/photometry/motion gates checked at model layer | SOURCE INSPECTED |
| Negative scientific fixtures | `tests/investigation.test.mjs`, `tests/test_rdra_pipeline.py` | Tests cover invalid timestamps, incorrect units, noninteger flags, mask mismatch, missing quality, disallowed comparisons | TEST CODE INSPECTED; current run NOT EXECUTED |
| M101, Atlas and 55 M101 pairs | `submission/RC2/FINAL_SCIENTIFIC_METHODS.md`, `release/PARALLAX_RELEASE_VALIDATION.md`, PR #14 | Reports describe quality contracts and 55 disabled pairs; full numerical independent calculation not reproduced here | DOCUMENTED, NOT INDEPENDENTLY VERIFIED |
| Asset manifest | `release/verify_assets.py`, `release/PARALLAX_CLEARED_ASSETS_MANIFEST.json` | Script checks 630 files, declared sizes, SHA-256, contained paths, CLEARED status | SOURCE INSPECTED; current run NOT EXECUTED |

## Scientific provenance

Recorded public M101 FITS byte identity is reported in `submission/RC2/FINAL_SOURCES_AND_CREDITS.md` and PR #13; current `src/journey.tsx` reflects this fact while continuing to qualify unknown release DOI and calibration lineage. Older `FINAL_SCIENTIFIC_METHODS.md` text still says the parent has not been authenticated, and must be interpreted as historical rather than the latest identity check. File-byte identity does **not** prove calibration or contributing exposure lineage.

## Defects and blockers

- **P1 / Verification blocker:** No independent numerical recomputation was completed in this audit for a representative M101 statistic, R Dra quality decision, or Atlas native sample; do not claim completed scientific certification.
- **P1 / External dependency:** Full Atlas source reproduction was previously blocked by missing `.local-data/atlas/observation-evidence.json` (PRs #12 and #13). This is a test environment blocker, not evidence of corrupted astronomy.
- **P2 / Document consistency:** Update archived scientific-method source wording only after preserving the distinction between byte identity and unresolved calibration/DOI.
- **No confirmed P0 scientific defect** was established by this read-only audit. Absence of a demonstrated defect is not a completed exhaustive verification.

## Reproduction sequence (NOT RUN in this audit)

```powershell
python release/verify_assets.py
npm.cmd ci
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
python -m unittest discover -s tests -p 'test_*.py' -v
npm.cmd run test:e2e
```

Run on a checkout containing all approved scientific assets, the documented Python science environment, and installed browser tooling. Record actual commands and complete counts. For independent numerical checks, compute sample values from source buffers using a separate calculation and verify them against exported evidence; report expected, actual, tolerance, source checksum and software version.

## Accepted scientific interpretation

PARALLAX offers spectral inspection, independent dated evidence inspection, quality-flag screening and provenance export. It does **not** establish new comet detection, R Draconis variability, registered temporal motion, or calibrated source photometry. Keep all 55 unsupported M101 temporal comparisons blocked.
