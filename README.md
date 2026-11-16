> **Release branch to clone:** `release/rc2-collaboration`. Follow [Browse and run](#browse-and-run) below. Historical UX notes remain in [docs/UX_FIRST_IMPRESSION.md](docs/UX_FIRST_IMPRESSION.md). Public pages checked on 2026-11-15, both serving this release build: https://parallaxbydibz.ishanitalukder16.workers.dev/ and https://parallaxbydibz.earth/ . Deployment does not establish competition eligibility.

> **Current scientific-data release:** all630 enumerated scientific assets are now cleared and included on `release/rc2-collaboration`, with114,751,955bytes verified. The older source-only snapshots below remain historical. Start with [complete setup](release/PARALLAX_DATA_INSTALL.md), [rights summary](release/PARALLAX_ASSET_RIGHTS_SUMMARY.md), [file decisions](docs/ASSET_RIGHTS_DECISIONS.csv), [actual staged validation](release/PARALLAX_RELEASE_VALIDATION.md), and [credits](release/ATTRIBUTION.md). Clone this branch, run `python release/verify_assets.py`, install the existing lockfile dependencies if needed/permitted, then `npm.cmd run build` and `npm.cmd run dev` (http://127.0.0.1:5173/). No separate private Windows data folder is required for the runtime. All55 unsupported comparisons remain blocked; data clearance does not establish event eligibility or license the original app.

> **Current branch: application source is integrated.** The older coordination snapshot below is retained for history. Read [current setup and restrictions](#current-collaboration-branch--dibz-parallax-2026). The public runtime files are in this branch under `public/`.

# PARALLAX — DIBZ

**FIND → SEE → VERIFY** · NASA Space Apps Challenge 2026

Team DIBZ is preparing a scientifically responsible interactive investigation of authentic SPHEREx / NASA-IPAC IRSA observations.

> **Historical coordination note:** The checklist in this section described the repository before the RC2 source import. Setup for the imported application is [Current collaboration branch](#current-collaboration-branch--dibz-parallax-2026).

## Team workstreams

These are collaboration lanes, **not permanent roles**. Everyone can contribute across the hackathon.

| Teammate | Immediate workstream | Brief |
|---|---|---|
| Ishani | Science, product integration and final release | [Science and release](team/ISHANI_SCIENCE.md) |
| Bea | Technical/data research and source inspection | [Technical/data](team/BEA_TECH_DATA.md) |
| Zak | UX/UI and accessibility | [UX/UI](team/ZAK_UX_UI.md) |
| Damian | Storytelling, pitch and visitor clarity | [Story/pitch](team/DAMIAN_STORY_PITCH.md) |

## How to contribute immediately

1. Open your assigned GitHub Issue and read your brief.
2. Work in your own document or branch; don't modify or replace the protected release.
3. Bring back specific actionable findings: **source/link, what you learned or saw, why DIBZ cares**.
4. Give an explicit **GO / BLOCKER / NEEDS VERIFICATION** conclusion. Include a screenshot or source for any blocker.
5. The product lead triages changes; only one integration writer changes production code.

## Release integrity

The separate RC2 release report **reports** 65/65 Node, 10/10 Python, 18/18 browser and 12/12 P0 tests passing. Those tests were not rerun in this coordination repository. The original scientific files and provenance JSONs must remain unchanged; all 55 unverified M101 temporal comparisons remain blocked.

Do not claim that the app independently proved R Draconis brightness changes or uncovered temporal changes from mismatched wavelengths. Only assign a dataset DOI when its product lineage is established. Do not disguise development history or misstate eligibility.

## What remains before submission

- [ ] Import the **exact** verified RC2 source archive, keeping its provenance and a reversible checkpoint.
- [ ] Complete human scientific, visual and narrative acceptance.
- [ ] Obtain necessary rights and eligibility clarification.
- [ ] Human approval of the public site. Reachable on 2026-11-15 at https://parallaxbydibz.ishanitalukder16.workers.dev/ and https://parallaxbydibz.earth/ .
- [ ] Complete the actual competition submission and retain confirmation.

## Links

- [Team working agreement](CONTRIBUTING.md)
- [Agent/integration safety rules](AGENTS.md)
- [Release acceptance](submission/RELEASE_CHECKLIST.md)
- [Team issues](../../issues)

**DIBZ** owns the team presentation; **PARALLAX** is the product name. NASA/IPAC data attribution does not imply NASA sponsorship or endorsement.


## Current collaboration branch — DIBZ-PARALLAX-2026

This section supersedes the scaffold-only status above **on this branch**. The actual React/Vite/TypeScript RC2 application source, lockfile and tests are now integrated. Remote main/team documents and their history are preserved. The source was imported from frozen RC2 commit `d30040923e8a3d8999174e4f8f4bc753a42bf4e2` into a new child of the independent collaboration history, without merging unrelated histories, rewriting dates or claiming new event-period authorship. Historical details remain in docs/RC2_APPLICATION_README.md and the scientific notes.

### Browse and run

```powershell
git clone --branch release/rc2-collaboration https://github.com/arni1596/DIBZ-PARALLAX-2026.git DIBZ-PARALLAX-2026
Set-Location -LiteralPath DIBZ-PARALLAX-2026
# On a new computer, install the locked existing dependencies when permitted:
npm.cmd ci
npm.cmd run build
npm.cmd run dev
```

Open http://127.0.0.1:5173/ . This branch includes the public runtime files, so a normal clone is data-enabled after install and build. For a production preview use `npm.cmd run preview -- --port 5183`.

### Scientific assets — explicit limitation

`release/rc2-collaboration` tracks 624 files under `public/` and 6 files under `tests/fixtures/`, including `public/dataset/assets/channel_035.png`. The scientific redistribution decision is [CLEARED for the enumerated files](release/PARALLAX_ASSET_RIGHTS_SUMMARY.md). That decision does not license the application itself and does not establish event eligibility. Paths and hashes remain in [docs/LOCAL_ASSET_REQUIREMENTS.json](docs/LOCAL_ASSET_REQUIREMENTS.json).

### Review and release restrictions

All55 unverified M101 temporal comparisons stay blocked. Wavelength is not time. No independent R Draconis variability, motion or comet detection is established. Verify source provenance; don't change FITS, masks or manifest bytes, regenerate datasets, merge this branch, publish or change DNS without specific authorization. `wrangler.jsonc` is in this branch. Do not deploy or change DNS without authorization.

Existing scientific preparation uses relative paths or explicit parameters. Optional Atlas reproduction uses `PARALLAX_ATLAS_RECORDS` (or `.local-data/atlas/observation-evidence.json`); that source record/FITS dependency is not distributed. Preserved historical reports may name old local paths as provenance; those are not current runtime configuration.

Current submission-copy locations: [submission package](submission/RC2/FINAL_RELEASE_HANDOFF.md), [project](submission/RC2/FINAL_PROJECT_DESCRIPTION.md), [methods](submission/RC2/FINAL_SCIENTIFIC_METHODS.md), [credits](submission/RC2/FINAL_SOURCES_AND_CREDITS.md), [provenance](submission/RC2/HACKATHON_PROVENANCE.md), [demo script](submission/RC2/FINAL_DEMO_SCRIPT.md), [checklist](submission/RC2/FINAL_SUBMISSION_CHECKLIST.md). These are local-delivery records, not evidence of competition eligibility, rights clearance or public deployment.
