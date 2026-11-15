# Existing Sites hosting — prepared, not deployed

Existing project:appgprj_6ae5b3520b4c81918f3bb8dfa1ef4938. Existing provider:Sites static dist workflow. Domain ownership is user-reported; attachment/HTTPS for parallaxbydibz.earth is not established here. No public UX URL is claimed.

The local production build is tested at port5186. A native archive is prepared separately from this non-deploying GitHub branch; receipt/hashes are retained with the output artifacts. No source repository credential is stored in this branch. No .openai manifest or deployment workflow is committed here.

After explicit authorization covering the exact Sites source push and public deployment of this reviewed UX revision:

1. Obtain fresh native source access for the same project; run the installed workflow helper from a separate Sites working copy to open/synchronize the existing source. Preserve its hosting identity and source history. Do not treat the October31 hosted source as this UX release or force-push unrelated GitHub history.

```powershell
node 'C:/Users/ishan/.codex/plugins/cache/openai-curated-remote/sites/1.1.6/scripts/site-workflow.mjs' --project-id appgprj_6ae5b3520b4c81918f3bb8dfa1ef4938
```

The helper waits for workflow JSON on hidden stdin. For opening:pass the fresh native credential; omit archivePath. Do not place credentials in command arguments, files or logs.

2. Controlled-import the reviewed source tree/cleared assets from this UX branch into that Sites checkout, retaining `.openai/hosting.json`, existing Git history and unrelated work. Compare hashes against the reviewed revision; do not copy node_modules, caches, Git metadata or older app trees. Build/check the resulting source with existing dependencies. Run the same helper in package mode with the complete opening result as `source`, fresh `credential`, ordered check/build commands (`npm run typecheck`, existing lint, tests, build) and an absolute new archivePath. This step commits/pushes the Sites source and packages, so it requires the stated authorization. Retain the exact returned project_id,commit_sha,archive.

3. Use native save_site_version with those exact values, then deploy_site_version for the unchanged existing audience; retain version/deployment receipts. Verify actual public project/assets/exports without login. Do not mistake localhost or a saved source commit for deployment. Do not publish the old RC2 archive in place of the UX artifact. Domain attachment/DNS is a separate explicitly authorized native operation using actual host-returned values; none are invented here.

No interactive login flow, source push to Sites, public deployment, DNS change or competition submission was executed in this task.
