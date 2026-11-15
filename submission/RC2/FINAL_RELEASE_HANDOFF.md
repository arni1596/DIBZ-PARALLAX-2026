> **Current collaboration update:** active working copy `DIBZ-PARALLAX-2026`, branch `release/rc2-collaboration`, based on DIBZ main5fdabef. This branch contains verified application source, not the restricted scientific assets. See ../../docs/INTEGRATION_VALIDATION.md and ../../docs/LOCAL_DATA_SETUP.md. The frozen local release receipt below is retained as historical provenance; its dated checkout paths and earlier push status are not current collaboration instructions. No deployment or submission is authorized here.

# PARALLAX — final release handoff

Verified locally November 14, 2026. Project PARALLAX; team DIBZ (user-provided). **CONDITIONAL GO for local release delivery; NO-GO for public submission until external gates close.** Technical completion does not establish competition eligibility or redistribution rights.

## Release identity

- Checkout: `C:\Users\ishan\Downloads\Ishani-OS\work\rc2-release-2026-11-14\sites-source-open\.sites-checkout`
- Branch: `release/parallax-rc2-dibz-2026-11-14`
- Commit: `d30040923e8a3d8999174e4f8f4bc753a42bf4e2` — `release: ship PARALLAX RC2 for DIBZ`
- Rollback: `b7cc749b6e697bc4dbbd08744be1407e075e197f`; local main is preserved at that commit. Switch branches only in a clean checkout; no reset/clean or force push is required.
- GitHub collaboration: https://github.com/arni1596/DIBZ-PARALLAX-2026 (private, empty when inspected; no push performed).
- Sites source remote: `https://git.chatgpt-team.site/ee9c6e46-6016-410a-b62f-e63f5aa5508e/appgprj_6ae5b3520b4c81918f3bb8dfa1ef4938.git`; distinct from GitHub.
- Site project: `appgprj_6ae5b3520b4c81918f3bb8dfa1ef4938`; static `dist`, existing audience/configuration preserved.
- Frozen canonical Mission Control source remains untouched. The older October 31 Sites tree required 103 differing/missing snapshot file copies. No directory synchronization or deletion occurred. Runtime code/data remain RC2; only release README, decision log and license notices were additionally updated.
- Runtime digest: `caf7f1dbc8e61fd585a0c2437840ca110fbae6f8dce234a3d528983bae85a7c1`.

## Executed verification

65/65 Node; 10/10 Python; 18/18 existing browser; 12/12 P0 browser cases PASS on the integrated release. Typecheck, existing scoped lint and production build PASS. Existing installed dependencies reused via an ignored local junction; none installed or changed. Four actual Chrome viewport runs (1440×900,1280×800,390×844,375×667) exercise mouse/touch-emulated/keyboard divider, date/evidence navigation, refresh, source drawer and native image fit; no runtime errors, failed required requests or horizontal overflow. Browser cases also exercise missing assets, Retry and Passport. Touch emulation is not physical-device testing, and automated checks do not establish subjective human acceptance or a complete accessibility audit.

Reports/screenshots: `../../work/final-ship-2026-11-14/`. Representative files: FINAL-FIND-1440x900.png, FINAL-SEE-390x844.png, FINAL-VERIFY-390x844.png, FINAL-SOURCES-390x844.png. Source, built assets and Git scientific blobs are hash-checked by FINAL_SHIP_MANIFEST.json. All596 scientific files and48 original JSON files remain unchanged; all624 public assets are copied into dist. All55 unsupported temporal pairs remain disabled. Git's additional whitespace check warns about frozen formatting including CRLF scientific JSON and existing trailing whitespace; retained deliberately, not reported as passed.

## Production artifact and current public status

`PARALLAX_DIBZ_RC2_SITE.tar.gz` is the actual native Sites package, built locally with the installed package-site helper; its embedded hosting identity and every dist file are checked. FINAL_SHIP_MANIFEST.json records its SHA-256 and sizes. Earlier source/static ZIPs and the real26.111-second PARALLAX_RC2_DEMO.webm remain preserved with original hashes. This recording still matches unchanged runtime source; no new voiceover or upload is claimed.

No push, saved hosted version, deployment, DNS mutation or submission occurred. Historical Site version1 corresponds to October31 commit b7cc749…, not RC2. Its unauthenticated URL returned403 during inspection; it is not an accepted judge link. No public RC2 URL exists yet. Local production was verified at http://127.0.0.1:5182/; the task-owned preview is stopped after verification. Restart locally with `npm.cmd run preview -- --port 5182` from the checkout. Localhost is not public delivery.

## Exact authorized-next release operations

**Do not run these publication operations until approval explicitly covers the destinations and any triggered CI/integration.** The checked-in GitHub workflow runs verification on push/PR and contains no deployment step. Remote branch protection/rulesets and repository-level integrations were not exposed by the available tools; they remain unverified. Do not bypass rules or force push.

GitHub command, from the release checkout, after precise authorization to publish this history to DIBZ main:

```powershell
Set-Location -LiteralPath 'C:\Users\ishan\Downloads\Ishani-OS\work\rc2-release-2026-11-14\sites-source-open\.sites-checkout'
git push dibz HEAD:refs/heads/main
```

Established Sites workflow launch (after separate authorization to push this revision to this Site's main and deploy publicly):

```powershell
node 'C:/Users/ishan/.codex/plugins/cache/openai-curated-remote/sites/1.1.6/scripts/site-workflow.mjs' --project-id appgprj_6ae5b3520b4c81918f3bb8dfa1ef4938
```

Run from the release checkout in a retained TTY. Obtain a fresh native source credential for that same Site; supply only through hidden stdin as `credential`, with `commands: []` because unchanged checks/build already passed, and a fresh absolute archivePath. Never put credentials in arguments/files/logs. Retain helper-returned project_id/commit_sha/archive; confirm expected revision before using native `save_site_version`, then `deploy_site_version` for the existing audience. The helper performs its source push and packages; the launch command alone is not a deployment. Never deploy from the original stale main checkout. Do not substitute the manually packaged TAR for a helper result claiming a source push occurred. Verify actual public access without login and demo hosting after deployment.

## Domain

Acquisition of `parallaxbydibz.earth` is user-reported. Sites custom-domain list is empty. Current Windows resolver returned NXDOMAIN for apex NS/A/AAAA and www CNAME; this is a resolver observation, not proof ownership is absent. No DNS was changed. A TLS-validating DoH attempt failed local certificate validation and was not treated as DNS evidence; validation was not disabled.

After explicit authorization, native `sites_add_custom_domain(hostname='parallaxbydibz.earth', project_id='appgprj_6ae5b3520b4c81918f3bb8dfa1ef4938')` must first return this host's actual apex_proxy_ipv4_targets/cname_target/validation_records. Exact DNS values are currently unknown. Apply only those returned records at the existing registrar, then verify validation, HTTPS and public page/assets. Do not invent A/CNAME destinations or switch providers. Domain approval does not imply submission approval.

## Eligibility, rights and scope — unresolved

1. Written authoritative permission for pre-event challenge-specific software/assets reuse and actual permitted window is absent. Development-start guidance is user-reported; it does not resolve reuse. Official FAQ's early-work restriction remains relevant; do not attest compliance without authority. Registered challenge/event/timezone, original-concept authorship and individual contributions remain unverified.
2. M101_irsa.fits (`44e89f460c55f46f7e384ba7dfe8927fa8e56163875aba3766499a5646813447`) and public/dataset plus public/data derivatives have unresolved acquisition/release/redistribution lineage. Native QR2 public/investigations and public/temporal products require applicable reuse terms/acknowledgment confirmation. Their core removal would break the frozen working experience; no assets were silently removed. No root project-wide LICENSE was found; ownership/license decision remains external. Library notices do not license original application or astronomy data.
3. QR2 citation is10.26131/IRSA652. QR3=662,DR1 spectral=678,DR1 cube=679 are not assigned to unknown M101 lineage. No measured R Draconis variability, registration, comet detection or independent reproduction of NASA's Atlas findings is claimed.
4. Current curated experience does not deliver arbitrary-coordinate time films or an application demonstration for all five challenge targets. This substantive challenge-scope gap remains, not a cosmetic release defect. No challenge-completion claim is approved.
5. Human visual/clarity/science acceptance and precise publication/attestation approval remain pending.

## Submission files

FINAL_PROJECT_DESCRIPTION.md; FINAL_SCIENTIFIC_METHODS.md; FINAL_SOURCES_AND_CREDITS.md; HACKATHON_PROVENANCE.md; FINAL_DEMO_SCRIPT.md; FINAL_SUBMISSION_CHECKLIST.md; this FINAL_RELEASE_HANDOFF.md. Supporting: OPEN_SOURCE_NOTICES.txt, FINAL_SHIP_MANIFEST.json, OFFICIAL_RECEIPTS.json, DEMO_RECORDING.json and actual PARALLAX_RC2_DEMO.webm. Existing private sources and historical reports remain preserved. Five updated submission notes have backups in the evidence folder/document-backups.

Official source receipts were retrieved November14,2026 UTC; exact provider timestamps are in OFFICIAL_RECEIPTS.json. Guide: https://www.spaceappschallenge.org/resources/project-submission-guide/ . FAQ: https://www.spaceappschallenge.org/resources/participant-faqs/ . Challenge: https://www.spaceappschallenge.org/2026/challenges/planet-x-and-spherex/ . The guide permits a≤30-second video OR≤7-slide deck, requires accessible final/demo links and AI/SI/resource disclosures. November15 23:59 uses the event-local timezone with the stated Universal Event exception; actual registration remains unknown. November15 13:30 Central is the user-provided internal target, not independently verified organizer deadline. The existing recording is26.111seconds; no longer optional submission video is assumed permitted.

## Final external actions — priority order

1. Resolve authoritative reuse/originality, actual event/timezone, core asset/application rights and human acceptance; accurately address the partial challenge scope before any attestations.
2. Authorize exact GitHub/Sites pushes, public deployment and domain attachment/DNS changes; execute through the existing host, then verify public project/demo URLs without login.
3. Complete/review the actual team form, disclosures and terms, authorize submission and preserve its real confirmation. No submission is claimed here.

## Final artifact receipt

Native archive SHA-256: `3a1b23117e165df879714c8172b61f4df895e94d48e7186656c565e89dc26e86`; 38259019 bytes. All628 generated dist files match archive members; additional native hosting metadata is included. OPEN_SOURCE_NOTICES.txt is copied from the committed root notice into generated dist for runtime redistribution. This packaging-only addition does not change runtime code, scientific assets or the frozen earlier ZIPs. Largest static file: 809114 bytes (`dataset/channel_coverage_102.json`); largest snapshot source file is12,387,889bytes, below GitHub’s50MiB warning threshold. Hosting upload/save acceptance remains untested until authorized.
