# Get the complete scientific-data-enabled collaboration build

The existing private repository branch contains the approved630 assets at their original paths; no separate account or private Windows path is required. After the clearance commit is pushed:

```powershell
git clone --branch release/rc2-collaboration https://github.com/arni1596/DIBZ-PARALLAX-2026.git DIBZ-PARALLAX-2026
Set-Location -LiteralPath DIBZ-PARALLAX-2026
python release/verify_assets.py
# On a new machine, install only the existing lockfile dependencies when permitted.
npm.cmd ci
npm.cmd run build
npm.cmd run dev
```

Open http://127.0.0.1:5173/ . Existing developers can fetch and fast-forward the branch only with a clean tree; preserve their changes. No data regeneration or scientific-file editing is required. For production preview run `npm.cmd run preview -- --port 5184`. Runtime data is packaged locally; archive access is not needed while exploring the app. No arbitrary-coordinate service, measured variability, validated motion or independent NASA discovery is promised.

Working experiences: M101102-channel Light/reveal controls; independent QR2 dated M101-field gallery; R Draconis native-pixel/quality investigation; Atlas dated evidence and Passport. All55 unsupported temporal pairs remain disabled; native/independent displays do not establish comparability.

Run `npm.cmd test`, `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`. Existing installed Python NumPy/Astropy/Pillow supports `python -m unittest discover -s tests -p test_rdra_pipeline.py -v` (seven tests using included authentic fixtures). Browser suites are in tests/e2e; use the existing Playwright environment/browser and project configuration. No browser or Python packages were installed by this release.

The three additional Atlas original-FITS reproduction tests require four larger source products outside the runtime630 assets. Their public access URLs, expected hashes, exact retained filenames and relative local paths are in ATLAS_VALIDATION_RECORDS.json. When those original inputs have been obtained from the exact `actual_url` entries and hashes verified, store them at the listed `.local-data/atlas/` paths, then set `$env:PARALLAX_ATLAS_RECORDS='release/ATLAS_VALIDATION_RECORDS.json'` and run `python -m unittest discover -s tests -p test_atlas_assets.py -v`. The record itself does not download files or certify a currently available cutout service; a mismatched or unavailable source is a prerequisite failure, never a pass. Do not substitute arbitrary current products. The full10-test staging run used separately preserved originals; the seven-fixture test run is self-contained in this bundle.

A local shareable archive PARALLAX_CLEARED_ASSETS.zip is generated under the existing shareable/PARALLAX directory and contains exactly the cleared630 paths plus manifest/attribution documents. It has not been published to a separate download service. Prefer cloning this existing repository; do not invent a public ZIP URL. When an authorized recipient uses a copy of the archive, extract to a new staging folder first, verify all checksums, and only copy into an empty or hash-matching destination. Never overwrite divergent scientific files.
