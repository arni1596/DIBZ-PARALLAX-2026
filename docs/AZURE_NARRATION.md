# Azure AI Speech narration for PARALLAX

The Guided Evidence Tour uses the reviewed six-chapter script in `src/GuidedStory.tsx`. If audio files `public/narration/editorial-v2/chapter-01.mp3` through `editorial-v2/chapter-06.mp3` exist, it plays those; otherwise it falls back to a visitor's browser speech synthesis. Transcripts are always visible. Nothing in the astronomical data requires Azure.

## One-time account setup

In [Azure Portal](https://portal.azure.com/), create or select an **Azure AI Speech** resource, review the pricing tier and quota, then open its **Keys and Endpoint** page. Use the resource's *region* and a key **only in your own local terminal or secure build environment**, never in chat, GitHub, Vite client-side variables, or browser code. You can keep your existing Cloudflare Worker.

## Generate reviewed narration locally (PowerShell)

```powershell
# Run from this repository's root
$env:AZURE_SPEECH_REGION = 'eastus'
$env:AZURE_SPEECH_KEY = Read-Host 'Azure Speech resource key'
$env:AZURE_SPEECH_VOICE = 'en-US-JennyNeural'
node scripts/generate-azure-narration.mjs
Remove-Item Env:AZURE_SPEECH_KEY
```

The generator reads all six stories from the exact on-screen text, escapes XML safely, calls the authenticated Azure REST endpoint on the **developer machine only**, and saves validated MP3s in `public/narration/editorial-v2/`. It fails clearly on missing credentials, API errors, or incomplete narration.

You must explicitly review the MP3s and decide whether to commit the six generated audio assets through your normal rights and release process. Do not commit or publish any secret. The revised narration has new wording. Older six-track MP3s must not be reused for it. The new `editorial-v2` filenames deliberately separate those audio versions. Do not claim this release contains Azure audio until the revised tracks have been generated, committed, deployed and checked.

## QA and safeguards

- Verify source-approved wording, native audio playback, browser fallback, transcripts, keyboard controls, mobile layout and stopping narration when changing chapter
- Run `npm.cmd run typecheck`, `npm.cmd test`, `npm.cmd run build`, and `python release/verify_assets.py`
- Verify all 630 scientific asset hashes, all 55 temporal gates and unchanged scientific exports
- Monitor Azure use and billing; Speech resource cost depends on account and tier
- Record Azure use and the actual service in the competition submission only if used. Azure use alone does not establish eligibility for a prize

Official [Azure Speech REST reference](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech).
