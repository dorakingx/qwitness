# Final submission checklist

## Latest update — 2026-09-13T01:21:56.382594+00:00

The participant authorized API-key creation and Free-plan setup without an individual spending cap after the UI rejected zero. The key is saved locally with mode 0600, restricted to the intended subgraph, and configured as a sensitive production-only Vercel variable. A fresh clipboard copy matched the local secret exactly. The new production deployment serves commit `4ed5cc963d8984b58f8c0269ccdf846f2cc5090c`.

Live acquisition remains blocked: local gateway requests return `auth error: API key not found`; production receipt creation returns HTTP 503. Configured credentials are not proof of successful integration. See `submission/evidence/graph-activation.json`. The Graph prize requirements remain unmet. No successful live query, participant narration or final submission is claimed. The participant requested prioritizing submission with 11% of Codex weekly usage remaining.

Snapshot: **2026-09-13 00:24 UTC**. Public deadline: September 13, 16:00 UTC / September 14, 01:00 JST. Task-budget end: September 13, 15:38:33 UTC / September 14, 00:38:33 JST. Reserve upload/submission time starting September 13, 13:38:33 UTC / 22:38:33 JST.

This is a partial implementation, **not submission-ready and not submitted**. Checks refer to evidence available at this snapshot; rerun required final checks on the final commit.

## Event and access

- [x] Year-specific public deadline and Graph From Scratch requirements checked; see `requirements.md`.
- [x] Dashboard attendance confirmed and Building from Scratch selected (implementation owner, 23:50 UTC).
- [x] Public repository exists: [dorakingx/qwitness](https://github.com/dorakingx/qwitness), latest recorded public/CI commit `6b40aa972a170047980ca27c04be448773be89e5`; CI succeeded.
- [x] Create dashboard draft project and inspect exact submission fields.
- [x] Participant completed GitHub linkage; repository selected and draft details/technical text saved.
- [x] Original logo, cover and three clearly labelled draft screenshots uploaded and saved; Save & Continue advanced to Tech Stack.
- [ ] Confirm any remaining check-ins; no pending item was visible, but completion was not independently established.

## Implementation and verification

- [x] Receipt core, fixed Graph adapter, analysis paths and MCP wrapper are present.
- [x] Standalone HTML and Node verifier artifacts are built.
- [x] Actual MCP SDK discovery and test-only receipt verification recorded in `evidence/mcp-smoke.json`.
- [ ] Authorized Graph key configured and successful live query recorded. Current creation attempt fails configuration.
- [ ] Actual LLM or meaningful AI-client workflow with live Graph data demonstrated. No LLM call recorded.
- [x] Four Playwright tests passed locally and against the public URL, including missing configuration and synthetic-receipt verification.
- [x] Synthetic content tampering, alternate/unknown signer checks, disconnected HTML and 390px usability tested.
- [x] Seventy-five unit tests passed; clean-clone install/typecheck/test/verifier-build/production-build/secret-scan passed for `4d96ea383f665d879ff59720c073d02e9c9c394b`.
- [ ] Final required checks recorded with final commit and UTC; earlier clean-clone results do not automatically validate later edits.
- [x] Public deployment and server-only signing secret configured; fresh-browser verification passes.
- [ ] Graph credentials and full live production acquisition → analysis → signing → download → verification flow checked.
- [ ] Measured benchmarks only; do not add estimates as results.

## Human and media

- [ ] Participant gives a substantive trust/design judgment and actual test feedback; record only completed contributions.
- [x] Current AI disclosure reconciled with implementation, documentation, tests and video assistance. Recheck before final submission.
- [x] Remotion preview rendered: `preview-without-narration.mp4`, 127.300 seconds, 1080p, 30 fps, H.264, no audio; real UI, visibly synthetic TEST-ONLY evidence.
- [x] Preview metadata/full decode/beginning-middle-end playback passed; evidence is in `video/qa/`.
- [ ] Conditional 326-word narration script reconciled with actual footage.
- [ ] Participant records real narration; no AI voice or cloning.
- [ ] Final live/AI/MCP demonstration recorded and edited, subtitles synchronized to participant speech.
- [ ] Final narrated video checked for duration, resolution, codec, audio and beginning/middle/end playback.
- [ ] Upload the final participant-narrated MP4/MOV directly to ETHGlobal’s Video tab: 2–4 minutes, at least 720p, audio without music. The silent preview is not a compliant substitute.
- [ ] Participant also uploads the final video to YouTube as required by the brief and verifies visibility/HD processing. A YouTube URL alone does not satisfy the inspected direct-upload form.

## Submission

- [ ] Replace this snapshot's draft statements with evidence-backed final state; no fake URLs or unsupported claims.
- [ ] Supply screenshots, architecture, final demo/repo/video links and sponsor evidence.
- [ ] Check final form preview against repository, video, human/AI disclosure and selected Graph From Scratch prize.
- [ ] Obtain user's final Submit confirmation; agent must not submit silently.
- [ ] Preserve actual submission confirmation before reporting submitted.

Evidence: `evidence/clean-validation.json`, `evidence/mcp-smoke.json`, `evidence/participant-dashboard.json`, and `video/qa/`. Synthetic receipt checks do not satisfy live Graph evidence. Administrative GitHub linkage does not replace substantive human review or narration.
