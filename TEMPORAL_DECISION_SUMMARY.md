# PARALLAX V3.1 — decision for the team

**Decision: DATED_IMAGES_ONLY. Level 2 NO-GO; Level 3 not validated.** All 55 original temporal comparisons remain disabled. The product now offers a clearly separated Time gallery of 11 genuine, quality-masked native exposures with authentic dates, approximate wavelengths/bandwidths, original FITS references, exact hashes, contextual VERIFY and reproducible dated-view records.

All 55 pairs were audited. Only the two strongest same-detector candidates were analyzed further:

| Candidate | Files | Shared valid pixels after actual WCS resampling | Spectral evidence | Decision |
|---|---|---:|---|---|
| temporal-20 / D2 | row136 / row53 | 80.80% of A | 55.61% approximate rectangular overlap; 56.52% using available external CWAVE/CBAND, linkage unverified | Level 2 not established |
| temporal-53 / D5 | row240 / row321 | 82.99% of A | 55.29% approximate rectangular overlap; external calibration unavailable | Level 2 not established |

Primary TAN-SIP spatial solutions were retained. Resampling used bilinear interpolation and required every contributing input pixel to pass the conservative quality mask. Original arrays and FITS files were preserved. Numerical WCS inversion and image correlation were measured, but a bounded mutual-nearest field-peak matching attempt was executed. With a complete valid 5×5 kernel, a five-MAD threshold and the central four-pixel galaxy core excluded, D2 produced zero accepted peaks in A and one in B; D5 produced none. Both yielded zero mutual matches. No independent residual fit or validated registration uncertainty can be supplied. This is insufficient evidence under the stated criteria, not proof that background sources are absent.

A similar center wavelength does not establish equivalent effective response. The rectangular overlap model remains a screening surrogate. Missing calibration lineage alone was not used as an automatic rejection of exploratory Level 2. D2 external CWAVE/CBAND values were retained as available-but-unverified. Source bit21 alone remains eligible; other flags, missing IMAGE and nonpositive/nonfinite VARIANCE are excluded under a conservative display policy, not an assertion that every such pixel is universally unusable.

The original app had an additional implementation ambiguity: OBSID repeats across detector products. The audit verifies the exact original pair sequence and keys products by unique filenames/SHA-256; the gallery and saved dated records now use those identities. This correction does not turn missing scientific evidence into a pass.

No temporal divider, blink, synchronized-grid measurement, motion, variability or discovery claim is enabled. The two native gallery images have independent grids and independent 1–99% display scales. Their apparent differences must not be interpreted as astronomical change. The 102-channel Spectral Reveal remains a wavelength experience.

Evidence: `temporal_pair_audit.csv`, `temporal_candidate_ranking.csv`, `temporal_registration_report.json`, `temporal_verdict.json`, `temporal_science_limitations.md`. Independent per-pixel image checks: `temporal_asset_verification.json`. Execution and browser checks: `TEMPORAL_VERIFICATION.md`, `screenshots/v31-browser-acceptance.json`, `test-results.json`.
