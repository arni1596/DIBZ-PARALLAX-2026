# R Draconis observational slice

This is a bounded offline preparation of two existing, authentic IRSA SPHEREx cutouts, not a new acquisition. `scripts/prepare_rdra.py` reads original files without modification and checks their SHA-256 against the prior measurement record. Row 52 also matches the checksum in the original target-survey download record. The prior archive table independently records both product URLs and times. The QR2 archive path and Level2 product identifiers are preserved, including pipeline version `6.4+psffix1`. A pipeline version is not an independently verified calibration reference version.

Products:

- `level2_2025W23_2B_0696_2D2_spx_l2b-v20-2025-251.fits`, 2025-06-08T18:56:30.592 UTC, SHA-256 `3d5dbe6632da1755a8ea45a3569c2a39d166a81e395935d72816de2f9faa260e`.
- `level2_2025W50_1A_0661_2D2_spx_l2b-v20-2025-345.fits`, 2025-12-10T20:57:48.807 UTC, SHA-256 `8d416539f59b7dbb355ea06109a348e99a2a3c10f26773efaf2cec35eb6ceaf3`.

Both products contain 47 × 47 IMAGE, FLAGS, and VARIANCE arrays; PSF and WCS-WAVE extensions are present. IMAGE units are MJy/sr; VARIANCE units are (MJy/sr)². The observations are approximately 185.084 days apart.

The result is a data quality warning. All 19 and 21 pixels respectively within 2.5 native pixels of the search-coordinate center are excluded by the conservative policy. Many central IMAGE and VARIANCE pixels are nonfinite. Some bright finite core pixels carry OVERFLOW. No excluded pixels are filled, interpolated, or used for brightness estimates. Source identity at these prior research coordinates is not independently confirmed.

Flags are decoded from each product's own `MP_*` header definitions. SOURCE bit 21 means mapped to a known source and is descriptive; it is retained. Every other set bit, including an unknown bit, is conservatively excluded. Positive finite variance is required; zero variance never means zero uncertainty. The header and official [SPHEREx explanatory supplement](https://irsa.ipac.caltech.edu/data/SPHEREx/docs/SPHEREx_Expsupp_QR.pdf) describe FINAST=0 as a good fine-astrometric solution. This does not establish the astrometric accuracy of a cross-epoch reprojection. The [flag table](https://irsa.ipac.caltech.edu/data/SPHEREx/docs/SPHEREx_Expsupp_QR_v1.2.1.pdf) explains OVERFLOW as reaching the onboard overflow threshold (approximately half full well), not proof of full-well detector saturation. SUR_ERROR with OVERFLOW can indicate early overflow. Calibrated surface brightness alone cannot diagnose detector saturation.

The spatial transform is the primary celestial TAN-SIP WCS in the IMAGE extension. Alternate WCS W is not spatial astrometry. Binary sky coordinates preserve a per-pixel transformation using all SIP terms. Native pixel zero is bottom left; buffers contain increasing native y rows. PNGs are flipped vertically for conventional screen indexing; they retain detector orientation, not a north-up orientation. Neither image is aligned to the other. Independently stretched previews cannot support visual brightness ratios.

The approximate 1.4386 and 1.4396 µm labels originate in the prior WCS-WAVE visualization lookup. This product explicitly calls it an approximated per-pixel wavelength and bandwidth. These labels are classified unavailable or unverified for scientific use and never establish equivalent passbands. Actual wavelength calibration, equivalent response, spatial PSF selection and matching, background/photometric conditions, and external registration have not been validated. Blink, registered difference, photometry, motion and discovery inference are therefore blocked. Side-by-side native inspection is supported.

Accepted reference pixels expose IMAGE, VARIANCE, FLAGS and sqrt(VARIANCE). That uncertainty is the supplied per-pixel statistical uncertainty only; it does not include calibration systematics, covariance, aperture corrections or source photometry. Rejected core pixels have no accepted sigma. This replaces the prior provisional low-five-bit mask with full-bit conservative exclusion based on actual header definitions.

Run reproducibly with an environment containing Astropy, NumPy and Pillow:

```powershell
& 'C:/Users/ishan/Desktop/PARALLAX-Research/.venv/Scripts/python.exe' scripts/prepare_rdra.py
```

Executed verification is recorded in `rdra_processing_report.json`: two original checksum checks, FITS verification/required extensions, identical expected dimensions, celestial SIP presence, all ten binary buffer round trips including NaNs, and finite celestial grids with maximum WCS round-trip residuals below 1.7e-8 pixels. The source files are hashed again after preparation. No network or new data is used. The generated manifest classifies original numeric arrays as Observed; rendering/masks/sky transforms as Processed; and unsupported calibration and comparison claims as Unavailable or unverified. There are no modeled or simulated scientific values.
