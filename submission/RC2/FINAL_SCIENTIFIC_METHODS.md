# PARALLAX — scientific methods

RC2 preserves existing processing; no new dataset or pipeline.

|Product|Verified local evidence|Supported interpretation|
|---|---|---|
|M101 mosaic|102 nominal channels ×267×267 samples; IMAGE, NHITS, FLAGS, SPECTRAL_CHANNELS and WCS-WAVE; 9 arcsec native sampling|Stored spectral appearance and accepted-pixel statistics; not dates, calibrated photometry or chemical detection.|
|M101 dated gallery|11 native exposures;55 possible pairs,0 enabled|Independent inspection only; no registered blink/video, motion or validated change.|
|R Draconis search field|Two 47×47 QR2 cutouts; June8 and December10,2025; original flags, variance and celestial WCS|Quality warning; source identity at prior research coordinates and independent variability remain unestablished.|
|Atlas fields|Four 117×117 QR2 ROIs across August1, August7, December14,2025|Independent dated inspection; marker is prediction, not measured detection. Published activity is external research.|

Scientific samples come from original-derived arrays, never screen colors. Native QR2 eligibility requires finite IMAGE, finite positive VARIANCE and the existing conservative flag policy: SOURCE bit 21 alone is retained; other/unknown bits are excluded. Mosaic masking uses its own IMAGE/NHITS/propagated-flag contract. No rejected or missing values become filled measurements or zeros.

Primary celestial WCS and source orientation control spatial inspection; display flips are explicit. Approximate detector-position wavelength does not establish response equivalence. Equal dimensions or display boundaries do not certify registration. The supplied sqrt(VARIANCE) is per-pixel statistical uncertainty, excluding unvalidated covariance/systematics/photometry. No new variability curve was produced from problematic flagged research.

M101 comparison uses common eligible support and pooled shared asinh/linear contrast; settings expose current limits. Audit PNGs retain recorded shared linear scaling. Atlas uses manifest-recorded independent stretches. Optional interpolation changes presentation only, preserves exclusions and adds no measured detail. Screen recordings are not measurement products.

Read-only inspection of seven FITS inputs matched pinned hashes and verified actual HDUs. DATE-OBS was not used as a release identifier. FITS_LINEAGE_INSPECTION.json records the evidence. The raw M101 mosaic is not bundled or authenticated against its candidate remote URL.

Run from the canonical root:

```powershell
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
& 'C:/Users/ishan/Desktop/PARALLAX-Research/.venv/Scripts/python.exe' -m unittest discover -s tests -p 'test_*.py' -v
npm.cmd run build
```

The existing Python tests reproduce to temporary directories and compare bytes. Reproduction from originals requires matching recorded source files; the packaged app itself needs no live FITS download.

QR2 collection citation is DOI 10.26131/IRSA652, supported by preserved product paths and publisher documentation; a collection DOI does not uniquely identify a cutout or authenticate a parent-file checksum. M101: **Archive lineage not independently verified from available provenance.** No QR3/DR1 DOI is assigned to it. All 55 blocked temporal pairs remain blocked; no discovery or measured activity result was introduced.


## Final local integration — November 14, 2026

Project: PARALLAX. Team: DIBZ (user-provided identity; registration not independently verified). The user reports acquisition of parallaxbydibz.earth. No domain attachment or public RC2 deployment has occurred. The release checkout is on `release/parallax-rc2-dibz-2026-11-14`; see FINAL_RELEASE_HANDOFF.md for the final revision, verification evidence and precise external gates. The frozen canonical source and historical records remain preserved.
