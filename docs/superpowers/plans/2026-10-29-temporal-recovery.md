# Temporal evidence recovery implementation plan

Goal: independently reassess the 55 local dated-exposure pairs and expose exactly the supported capability in the existing application.
Architecture: immutable spectral contracts remain pinned. A reproducible Python audit reads local FITS files and emits a separate temporal evidence contract. The UI consumes this new contract without modifying original pair decisions; a dedicated gate rejects absent or inconsistent evidence. Existing dated previews remain Level 1 unless a candidate establishes Level 2.
Tech stack: existing React/TypeScript, Python/Astropy/NumPy/SciPy.
Spec: user V3.1 supplied attachment, execution explicitly requested; no design approval requested.

- [x] Independently run the V3 24-test and 532-artifact/17-input checksum baseline.
- [ ] Audit all 55 pairs, separate fundamental/missing/implementation/processing reasons, record available bandwidth and geometric overlap.
- [ ] Rank and execute at most three deeper candidates, preserve arrays and document spatial SIP/quality/spectral uncertainty.
- [ ] Review the resulting GO/NO-GO evidence before enabling any comparator.
- [ ] Test a temporal-contract gate against fabricated metadata and absent registration; implement only justified UI capability.
- [ ] Execute existing and added tests, browser desktop/mobile interactions and measured loading; recheck all input hashes.
- [ ] Deliver required reports, screenshots, README and decision summary.

Scope boundaries: no new observations, mosaic regeneration, simulated pixels, physical change claims, or blanket pair enablement. No Git repository exists in this workspace, so changes remain reviewable local files rather than a commit.
