# PARALLAX — paste-ready Space Apps fields

Prepared 2026-11-15 from the working application and official guides. This file is a draft. It is not a submitted project, and it does not establish eligibility.

Official form: [Project Submission Guide](https://www.spaceappschallenge.org/resources/project-submission-guide/) (dated November 13, 2026). Challenge page used below: [Planet X and SPHEREx](https://www.spaceappschallenge.org/2026/challenges/planet-x-and-spherex/).

Public application today: https://parallaxbydibz.ishanitalukder16.workers.dev/

`parallaxbydibz.earth` resolves, but it does not serve this application. Use the workers.dev URL.

## Project name

PARALLAX

## High-level summary

PARALLAX lets anyone compare real SPHEREx infrared images of the galaxy M101, read a core-to-surround measurement, and open the source and quality record behind it. The same site keeps 3I/ATLAS and R Draconis available for inspection. It shows what the observations support, and what they do not: these wavelength comparisons are not a time-lapse, a calibrated flux, or a discovery.

## Project demo

Not hosted in this draft. The official demo must be a video of 30 seconds or less, or a slide deck of at most 7 slides, on a public link. A longer file is not a substitute.

30-second narration, if a teammate records the live site:

0:00 Team DIBZ. This is PARALLAX.
0:02 SPHEREx maps the sky in 102 infrared bands. We built a way to inspect those images instead of guessing what they mean.
0:05 Open M101. Drag the divider between channel 35 at 1.656 micrometers and channel 86 at 4.429 micrometers.
0:12 The core is about 9.17 times its surroundings in A, and about 4.85 times in B. Those are mean image values on the same eligible pixels, not a change over time.
0:20 Open Verify. The source file, the hash, and the limits are on the page.
0:26 The question stays open. The evidence does not.

## Final project

https://parallaxbydibz.ishanitalukder16.workers.dev/

Repository: https://github.com/arni1596/DIBZ-PARALLAX-2026

Direct comparison: https://parallaxbydibz.ishanitalukder16.workers.dev/#journey=1

## Project details

PARALLAX is a public viewer for packaged SPHEREx / NASA/IPAC IRSA observations.

A visitor opens M101 and compares two of 102 infrared channels on one 267 by 267 native grid. The default pair is channel 35 and channel 86. Dragging the divider changes which wavelength is visible. It does not change the date. The central contrast is the ratio of mean IMAGE values in a core (radius at most 8 native pixels) to a surrounding annulus (27–40 pixels), using the identical eligible-pixel intersection in both layers. On the default pair that contrast is about 9.17 times in A and 4.85 times in B. Verify opens the channel identities, the common-pixel count, the means in MJy/sr, the source SHA-256, and the limits. The record can be saved. Display stretching does not feed the numbers.

3I/ATLAS remains a separate path: four archived exposures, a predicted position rather than a detection, and quality flags on native pixels. R Draconis remains available to show why a bright-looking pixel can fail the recorded mask. All 55 unsupported M101 date-to-date comparisons stay disabled.

The interface is React, TypeScript, and Vite, served as a static site. Measurements are computed in the browser from the shipped numerical buffers.

What this does not do: it does not accept arbitrary right ascension and declination, it does not play a time-lapse of Barnard's Star, Epsilon Indi B, WISE 0855, or RW Aurigae, and it does not claim a new moving object or a calibrated spectrum.

## Use of AI / SI tools

AI tools assisted code, tests, documentation, and interface writing. They did not generate or alter the observational images or the numerical measurements. The observations are the archived SPHEREx products described below. The site states this in Sources & Methods.

## NASA data

SPHEREx data via NASA/IPAC IRSA.

- M101 demonstration cube: https://irsa.ipac.caltech.edu/data/demos/notebooks/spherex/M101_irsa.fits
- SHA-256 of that file: 44e89f460c55f46f7e384ba7dfe8927fa8e56163875aba3766499a5646813447
- SPHEREx QR2 collection, used for the dated cutouts that have a recorded QR2 lineage: https://doi.org/10.26131/IRSA652
- IRSA public-data terms: https://irsa.ipac.caltech.edu/data_use_terms.html#public

The M101 mosaic's data-release DOI, contributing exposures, and calibration lineage are not established. Do not label that cube as QR2, QR3, or DR1.

## References

- SPHEREx mission and IRSA archive acknowledgments, in `release/ATTRIBUTION.md`
- IPAC image-use policy: https://www.ipac.caltech.edu/page/image-use-policy
- QR overview: https://irsa.ipac.caltech.edu/data/SPHEREx/docs/overview_qr.html
- Lowell Observatory, Pluto discovery exhibit, linked from the optional history chapter: https://collectionslowellobservatory.omeka.net/exhibits/show/pluto/the-discovery
- Application libraries: React and React DOM (MIT), Vite (MIT), TypeScript (Apache-2.0)
- AI assistance, as stated above
- Challenge statement: https://www.spaceappschallenge.org/2026/challenges/planet-x-and-spherex/

## 90-second live path for a judge who opens the site

The public site still uses the previous opening button, Begin exploring. The review branch names that button Compare wavelengths. Either one opens the same comparison.

1. Land on M101. The image is a real SPHEREx mosaic, channel 35.
2. Open the comparison. Two channels appear: 35 at 1.656 µm and 86 at 4.429 µm.
3. Drag the divider. The sky is the same. The light is not.
4. Read the central contrast under the image.
5. Choose Show these measurements, then Verify. Check the means, the shared pixel count, and the source hash.

3I/ATLAS and R Draconis stay in the header and on the opening page. They are not required for this path.

## Credits recorded in this repository

Git history on the release branch records commits by Ishani Talukder, Beatriz Jardim, damiangarsanz, leizakaryah, and arni1596. Team briefs name Ishani, Bea, Zak, and Damian as the working lanes. This draft does not add affiliations or awards.

## Limitations to keep in the submission

- Wavelength contrast is an image measurement. It is not calibrated flux, temporal variability, or a physical cause.
- Arbitrary-coordinate time comparison of the five named challenge targets is not implemented.
- 3I/ATLAS views are prepared cutouts. A local hash of a prepared product is not an independent reproduction from an unavailable original exposure.
- Pre-event work exists in the repository history. Whether that is allowed is an organizer question. Do not check the originality box unless the team can attest it.
