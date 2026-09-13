# QWitness status

## Latest update — 2026-09-13T01:21:56.382594+00:00

The participant authorized API-key creation and Free-plan setup without an individual spending cap after the UI rejected zero. The key is saved locally with mode 0600, restricted to the intended subgraph, and configured as a sensitive production-only Vercel variable. A fresh clipboard copy matched the local secret exactly. The new production deployment serves commit `4ed5cc963d8984b58f8c0269ccdf846f2cc5090c`.

Live acquisition remains blocked: local gateway requests return `auth error: API key not found`; production receipt creation returns HTTP 503. Configured credentials are not proof of successful integration. See `submission/evidence/graph-activation.json`. The Graph prize requirements remain unmet. No successful live query, participant narration or final submission is claimed. The participant requested prioritizing submission with 11% of Codex weekly usage remaining.

Updated: **2026-09-13 00:24 UTC**. Start: September 12, 23:38:33 UTC. Budget end: September 13, 15:38:33 UTC / September 14, 00:38:33 JST. Official deadline: September 13, 16:00 UTC / September 14, 01:00 JST. Reserve upload/submission time from September 13, 13:38:33 UTC / 22:38:33 JST.

Public repository: [dorakingx/qwitness](https://github.com/dorakingx/qwitness). Latest verified app/deployment commit: `a2e6e387ea3d3f5c4196e1004d25280a52794679`; CI succeeded and public capabilities report the same commit. See `submission/evidence/release-verification.json`. Public prototype: [qwitness.vercel.app](https://qwitness.vercel.app). Public browser integrity verification works; live receipt creation does not work yet.

Dashboard attendance is confirmed and Building from Scratch is selected. The draft project exists. The participant completed GitHub linkage; the agent selected the repository and saved project details and technical text. The original logo, cover and three clearly labelled draft screenshots were uploaded; Save & Continue advanced to Tech Stack, confirming the draft image save. No final submission occurred. No pending check-in was visible; complete check-in status is not independently established.

Implemented: shared receipt/signature core, bounded Aave V3 Graph adapter, exact calculations, labelled deterministic and optional LLM paths, web/API workflow, MCP tools, and bundled offline HTML/Node verifiers. Actual MCP SDK discovery and verification of a test-only receipt succeeded; live creation returned a missing-configuration error.

Seventy-five unit tests passed. Four Playwright tests passed locally and against the public URL, including synthetic tampering, alternate/unknown signer checks, offline verification and 390px usability. Clean-clone install/typecheck/test/verifier-build/production-build/secret-scan passed for **`4d96ea383f665d879ff59720c073d02e9c9c394b`**; see `submission/evidence/clean-validation.json`. That record applies to the earlier commit, not automatically to later edits.

The Remotion preview is complete: `submission/preview-without-narration.mp4`, **127.300 seconds, 1920×1080, 30 fps, H.264, 8,301,671 bytes, no audio**. It shows real UI with a synthetic TEST-ONLY receipt and discloses missing live Graph/LLM execution. Full decode and actual beginning/middle/end playback passed. This is not the final submission demo. Source/QA are in `video/`; explanatory captions are `submission/preview-captions.srt`.

Blockers: `GRAPH_API_KEY` is missing; no live provider query or real deployment metadata has been demonstrated. No actual LLM call has been demonstrated. The Graph live-data requirement remains unmet. Human technical judgment, hands-on review and narration remain pending. GitHub linkage is an administrative contribution, not a substitute for those tasks. No final narrated video, direct ETHGlobal video upload, YouTube upload or submission confirmation exists. The actual Video tab requires a direct MP4/MOV upload, 2–4 minutes, at least 720p, with audio and without music. The participant’s real narrated video must be uploaded there; the brief additionally requires the participant’s manual YouTube upload.

Signer seed: ignored `.secrets/signing.env`, mode 0600, and server-only deployment secrets. Never print it. Public pin: `public/signer.json`. Preferred Node: `/Users/hatanakatomoya/.nvm/versions/node/v22.23.1/bin`; shell default may be older.

A test-only review packet is available in the thread outputs so the participant can assess integrity/trust before Graph credentials arrive. It is not evidence of participant review or live Graph execution.
