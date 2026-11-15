# DIBZ — Technical + Data Research

*NASA Space Apps prep · FITS → browser blink comparator · as of 2026-11-14*

**Short version:** NASA publishes SPHEREx sky images as FITS files (science data, not pictures). We use Python/Astropy to cut out a small region, align repeat visits onto the same pixel grid, and save them as ordinary web images (PNG), then a small JavaScript slider or blink toggle lets anyone flip between two dates and spot what moved.

---

## 1. The pipeline in plain English

Five stages take NASA's raw sky data to a user clicking in our browser:

1. **NASA data (FITS files).** SPHEREx sky images live in NASA's public IRSA archive as FITS files — science-grade number arrays plus a text header, not ready-to-view pictures. A full SPHEREx spectral image is about 2040×2040 pixels and roughly 70 MB each.
2. **Cut it down (IRSA cutout service).** Instead of downloading whole 70 MB files, we ask IRSA for just the small patch of sky around our target (give it a position and a size). The server makes the cutout on the fly and returns a tiny file — huge savings in download and memory.
3. **Process in Python / Astropy.** Open the FITS with Astropy, read the pixel array, use the header's WCS (the sky-coordinate map) to line up images from different dates onto the same grid, and rescale brightness so faint objects are actually visible.
4. **Save as a web image.** Export each processed frame as an ordinary PNG (or JPEG) that any browser can display.
5. **User interaction in the browser.** Load the two PNGs into a small JavaScript before/after slider or a blink toggle; the user flips between the two dates and anything that moved "jumps" against the fixed stars.

---

## 2. Key concepts (SOURCE / WHAT I LEARNED / WHY DIBZ CARES)

| Topic | What I learned | Why DIBZ cares | Source |
| --- | --- | --- | --- |
| **FITS files** | Astronomy's standard format. One or more "HDUs," each a plain-text header (keyword = value metadata) plus a data array of raw numbers — not 0–255 pixels. SPHEREx images are Multi-Extension FITS with several layers (IMAGE, FLAGS, VARIANCE, ZODI, PSF). | We can't just point an `<img>` tag at a FITS file — it must be converted first. But the header is gold: it tells us exactly when and where each image was taken. | [NASA FITS primer](https://fits.gsfc.nasa.gov/fits_primer.html) |
| **Astropy + display** | `astropy.io.fits` opens a FITS into a NumPy array. To make it viewable you apply a stretch (linear, sqrt, log, asinh) plus a min/max or percentile cut, then save as PNG. Astropy even ships a `fits2bitmap` command-line tool. | This is our "FITS → PNG" step. Getting the stretch right is the difference between a black rectangle and a crisp star field. | [Astropy FITS image tutorial](https://learn.astropy.org/tutorials/FITS-images.html) |
| **WCS + alignment** | WCS (World Coordinate System) is header info mapping each pixel to a real sky position (RA/Dec). To compare two dates, images must sit on the same pixel grid; the `reproject` package resamples one onto the other's WCS. Caveat: reproject trusts the WCS — it won't fix images with wrong or missing coordinates. | If two frames aren't aligned, *everything* looks like it moved and the blink is useless. This is the make-or-break technical step. | [reproject docs](https://reproject.readthedocs.io/) |
| **IRSA cutouts** | NASA's IRSA archive hosts SPHEREx data free and public (weekly releases). Append position + size parameters to an image URL and IRSA returns just that cutout; Python wrappers (PyVO, astroquery) handle the querying. | Full images are ~70 MB — far too heavy for a web demo. Cutouts keep files tiny and the app responsive. | [IRSA SPHEREx cutouts](https://irsa.ipac.caltech.edu/data/SPHEREx/docs/cutout_tool.html) |
| **Slider vs. blink** | Before/after sliders are a solved problem — drop-in components like `img-comparison-slider` or `@cloudfour/image-compare` (tiny, accessible). A blink comparator just rapidly swaps or fades between two aligned images so a moving object flickers. Both need the two images to be the same size and aligned. | We don't build the viewer from scratch: reuse a slider library and add a simple blink toggle. The real work is upstream (alignment), not the widget. | [img-comparison-slider](https://img-comparison-slider.sneas.io/) · [blink comparator](https://en.wikipedia.org/wiki/Blink_comparator) |

---

## 3. Five things most likely to cause problems

1. **Alignment (WCS) errors.** If two frames aren't reprojected onto the exact same grid, fixed stars appear to shift and you get false "movement" everywhere. `reproject` only works when the headers' coordinates are correct — it does not fix bad or missing WCS.
2. **Brightness scaling.** Raw FITS pixel values span an enormous range. The wrong stretch or cut gives an all-black or blown-out image, and the two frames must be scaled *the same way* or a real change gets hidden (or a scaling difference gets mistaken for one).
3. **File size and performance.** Full SPHEREx images are ~70 MB. Shipping FITS (or big images) to the browser makes the app crawl. Everything must be pre-cut and pre-converted to small PNGs before it reaches the user.
4. **SPHEREx's awkward geometry.** It's a spectral survey (102 wavelengths) stored as Multi-Extension FITS, and it shoots six slightly-offset images at a time rather than re-photographing the exact same spot. Finding two clean, overlapping epochs of the same patch at the same wavelength takes some digging.
5. **The Python-to-browser gap.** Astropy is Python; browsers run JavaScript. You can't realistically run Astropy live in a visitor's browser, so all the FITS processing has to happen ahead of time (pre-generate the images) or on a server. Underestimating this bridge is a classic time sink.

---

## 4. Three ways to keep it manageable in 48 hours

1. **Pre-process offline; the website just loads PNGs.** Do all the FITS → aligned-PNG work in Python early, commit a handful of ready-made image pairs, and make the web app a plain static image viewer. No live astronomy code in the browser means far fewer things that can break on demo day.
2. **Lean on IRSA cutouts + an off-the-shelf slider.** Pull small cutouts instead of 70 MB files, and drop in a ready-made component (`img-comparison-slider`, `@cloudfour/image-compare`) rather than building the viewer from scratch. Spend the saved time on the experience and the story.
3. **Hard-wire one or two hand-picked targets — don't "search the whole sky."** Choose a couple of known examples where two good epochs already exist (a moving asteroid, or a striking brown dwarf) and build the demo around them. A polished, reliable story on two objects beats a fragile live search that breaks in front of the judges.

---

> **Reminder for the pitch:** our tool could help **search for** faint moving objects — it does **not** "find Planet Nine." Planet Nine is still hypothetical.
