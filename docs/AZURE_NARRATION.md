# Azure AI Speech narration for PARALLAX

The optional Guided Evidence Tour uses the reviewed six-chapter script in `src/story.ts`. If audio files `public/narration/editorial-2026-11-15/chapter-01.mp3` through `chapter-06.mp3` in the same revision directory exist, it plays those; otherwise it falls back to a visitor's browser speech synthesis. Transcripts are always visible. Nothing in the astronomical data requires Azure.

## One-time account setup

In [Azure Portal](https://portal.azure.com/), create or select an **Azure AI Speech** resource, review the pricing tier and quota, then open its **Keys and Endpoint** page. Use the resource's *region* and a key **only in your own local terminal or secure build environment**, never in chat, GitHub, Vite client-side variables, or browser code. You can keep your existing Cloudflare Worker.

## Generate reviewed narration locally (PowerShell)

```powershell
# Run from this repository's root
$env:AZURE_SPEECH_REGION = 'YOUR_RESOURCE_REGION'
$env:AZURE_SPEECH_KEY = Read-Host 'Azure Speech resource key'
$env:AZURE_SPEECH_VOICE = 'en-US-JennyNeural'
node scripts/generate-azure-narration.mjs
Remove-Item Env:AZURE_SPEECH_KEY
```

The generator reads all six stories from the exact on-screen text, escapes XML safely, calls the authenticated Azure REST endpoint on the **developer machine only**, and saves validated MP3s in `public/narration/`. It fails clearly on missing credentials, API errors, or incomplete narration.

You must explicitly review the MP3s and decide whether to commit the six generated audio assets through your normal rights and release process. Do not commit or publish any secret. The current pull request contains **no Azure-generated MP3s**, so do not say Azure is live until they are actually generated, committed, deployed, and smoke-tested.

## QA and safeguards

- Verify source-approved wording, native audio playback, browser fallback, transcripts, keyboard controls, mobile layout and stopping narration when changing chapter
- Run `npm.cmd run typecheck`, `npm.cmd test`, `npm.cmd run build`, and `python release/verify_assets.py`
- Verify all 630 scientific asset hashes, all 55 temporal gates and unchanged scientific exports
- Monitor Azure use and billing; Speech resource cost depends on account and tier
- Record Azure use and the actual service in the competition submission only if used. Azure use alone does not establish eligibility for a prize

Official [Azure Speech REST reference](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech).

## Editorial revision — November 15, 2026

The current script uses revision-specific audio paths. Older unversioned MP3 files are preserved but never played against revised transcripts. The local generator reads the same shared `src/story.ts` as the UI and adds short sentence pauses at a measured pace. No new MP3s were generated in this revision. Browser voice quality depends on installed voices; composed delivery requires listening review of the generated tracks. Browser speech is not an Azure recording. Node 24 (the verified local runtime) supports the shared TypeScript module directly.
