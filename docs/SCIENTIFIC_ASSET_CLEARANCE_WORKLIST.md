# PARALLAX RC2 — scientific asset-sharing clearance worklist

**Scope:** 630 withheld files in `docs/LOCAL_ASSET_REQUIREMENTS.json`, about 114.75 MB total. This file is an actionable clearance matrix, **not a grant of permission**. The source-only PR remains draft; do not upload the data bundle until each included asset's origin and applicable terms are verified.

## What the official rules establish

1. NASA images/media generally may be used for factual, educational or informational presentations with NASA acknowledged as source, subject to exclusions for third-party copyright, NASA logos/endorsement, and other media-specific restrictions: https://www.nasa.gov/nasa-brand-center/images-and-media/
2. SPHEREx science products are released for public access through Caltech/IPAC IRSA. Public archive availability establishes access, **not automatically a blanket copyright/redistribution license for every derivative**: https://spherex.caltech.edu/page/data-products
3. The NASA Space Apps 2026 participant terms require rights to distribute submitted materials, source citations, and license documentation for non-NASA materials. Original team content must be free to use or OSI-open-source licensed; absent a specified license, the terms say NASA will distribute original content under Apache-2.0: https://www.spaceappschallenge.org/legal/

## Asset groups / decisions

| Assets | Recorded evidence | Next definitive clearance step | Share status |
|---|---|---|---|
| `public/investigations/atlas-v1/**`, `public/investigations/rdra-v1/**`, `tests/fixtures/rdra/**` | QR2 FITS acquisition references and DOI 10.26131/IRSA652 in `submission/RC2/FINAL_SOURCES_AND_CREDITS.md`; preserved local hashes | Match each original FITS and derivative to its IRSA product ID; confirm applicable NASA/IPAC product terms and required credits; identify any non-NASA inputs | **Conditional — hold** |
| `public/dataset/assets/channel_*.png` (102 images), `public/dataset/numerical/**` (408 files), other `public/dataset/**` | M101 parent `M101_irsa.fits` has a candidate IRSA demo URL, but exact source lineage and remote byte equality were not established | Reconstruct chain from parent FITS/source headers and processing report to each generated file; establish parent license/rights and creators' rights for processing | **Hold: M101 provenance unresolved** |
| `public/data/**`, `public/temporal/**` | Mixed processed imagery, science metadata, diagnostic reports, temporal restrictions | Trace each to its parent input(s) and any original code/text; keep blocked comparisons blocked; do not assume NASA rights cover third-party graphics or narrative | **Conditional — hold** |
| Team-authored JSON/CSV/reports included in those folders | Likely team-created numerical or metadata derivations but origin/ownership must be established | Identify authors, external inputs, sensitive or restricted content; confirm team approval and license | **Conditional — hold** |
| Third-party imagery, logos, articles or package assets, if any | No comprehensive file-by-file identification yet | Verify creator's actual license/permission, cite; avoid NASA insignia or misleading endorsements | **Hold until verified** |

## One-pass executable release procedure (local Codex / release checkout)

1. Parse all 630 rows from `docs/LOCAL_ASSET_REQUIREMENTS.json` into a file-by-file rights matrix with `path, sha256, bytes, parent_source, creator, source_url, source_product_id, applicable_terms_url, attribution, rights_basis, decision` columns. **Do not automatically mark a file cleared solely because its URL uses nasa.gov, ipac.caltech.edu, irsa.ipac.caltech.edu or s3.**
2. For QR2 FITS products, cross-check the original product IDs/URLs in the science manifests and QR2 DOI record. For M101, trace the parent exact bytes and lineage before attributing any derived channel or numerical asset.
3. Distinguish a team's independently generated metadata/visualization from the source data underlying it; document processing and any third-party inputs.
4. Group exact derivations under a verified common parent and processing pipeline so 630 decisions do not require 630 unrelated permission inquiries. Leave exceptions individually flagged.
5. Produce `docs/ASSET_RIGHTS_DECISIONS.csv` with per-file evidence and one of **CLEARED / HOLD / EXCLUDE**; default HOLD for missing evidence. Record a working source/terms URL or documented owner authorization for every CLEARED group.
6. Ask the project owner to confirm an appropriate open-source license for **original team-owned code/content**; do not silently assert ownership or apply a license to NASA/IRSA or third-party data.
7. When rights are established, provision *only* CLEARED assets into a new temporary test checkout, verify every required SHA-256 against the existing manifest, rerun science + browser tests, and check runtime requests. Keep prohibited/unresolved files out of GitHub and public hosting.
8. If a required asset remains HOLD, choose a transparent degraded experience, link users to authorized source downloads where possible, or retain the local demo. Never swap in synthetic data, invent source lineage, or claim the full investigation works remotely.

## What is not resolved by this document

- Permission to distribute all 630 assets is **not established**.
- Exact M101 mosaic lineage, derivative rights, and remote byte comparison remain open.
- Publishing rights for team-authored code and original content require an owner/license decision.
- Pre-hackathon eligibility is a separate issue. Do not modify original provenance or dates to imply later authorship.
- Neither a passing local build nor a NASA URL automatically resolves submission/IP requirements.

**Acceptance gate:** Only mark complete when an actual rights-evidence matrix exists, all assets necessary for the promised public experience are marked CLEARED with appropriate attribution, their hashes match, and the resulting site is tested with the legally provisioned bundle.


## Verified closure — November14,2026

The preceding hold statements document the initial state. They are superseded for the enumerated630 scientific files by ASSET_RIGHTS_DECISIONS.csv and ../release/PARALLAX_ASSET_RIGHTS_SUMMARY.md:630CLEARED,0HOLD,0EXCLUDE,114,751,955bytes. New decisive evidence: IRSA public-data terms and full M101 remote/local byte equality. Do not infer a M101 release DOI, calibration validation, original application license or competition eligibility. The preserved630-file bytes/hashes remain unchanged.
