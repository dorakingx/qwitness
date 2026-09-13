# Next actions

## Latest update — 2026-09-13T01:21:56.382594+00:00

The participant authorized API-key creation and Free-plan setup without an individual spending cap after the UI rejected zero. The key is saved locally with mode 0600, restricted to the intended subgraph, and configured as a sensitive production-only Vercel variable. A fresh clipboard copy matched the local secret exactly. The new production deployment serves commit `4ed5cc963d8984b58f8c0269ccdf846f2cc5090c`.

Live acquisition remains blocked: local gateway requests return `auth error: API key not found`; production receipt creation returns HTTP 503. Configured credentials are not proof of successful integration. See `submission/evidence/graph-activation.json`. The Graph prize requirements remain unmet. No successful live query, participant narration or final submission is claimed. The participant requested prioritizing submission with 11% of Codex weekly usage remaining.

Updated September 13, 2026, 00:24 UTC. Public prototype, GitHub linkage, dashboard details/technical text and draft image save are complete; do not repeat that setup.

1. Obtain the authorized Graph key through this project's `.env.local` or deployment secrets, never chat. Configure provider limits, run `npm run test:live`, inspect actual schema/metadata and save successful query evidence. A configured key or fixture alone is insufficient.
2. Demonstrate full live receipt creation through the public app and a real AI/MCP client. Exercise an authorized LLM path if available; otherwise label deterministic analysis honestly. Existing test-only MCP verification does not establish the live workflow.
3. Ask the participant to perform `docs/human-review.md`: a reasoned trust/design decision, real manual checks and specific feedback. Apply and record only actual contributions. Reconcile the conditional script with working features and receive the participant's own narration.
4. The original logo, cover and three clearly labelled draft screenshots are saved; Save & Continue reached Tech Stack. Reconcile the draft images with final live functionality later. Check remaining event requirements and the Graph From Scratch selection.
5. Record the successful live Graph/AI/MCP flow and independent verification. Edit real participant speech and synchronized subtitles. Keep the existing synthetic silent preview separate; do not rename it as a final demo.
6. Reconcile final README, sponsor/form text, AI/human disclosure and links. Run required tests, public flow, clean build and secret scan on the final commit with SHA/UTC evidence. Existing clean-clone evidence belongs to `4d96ea3`; latest recorded public/CI commit is `6b40aa9`.
7. Reserve time from September 13, 13:38:33 UTC / 22:38:33 JST for direct ETHGlobal MP4/MOV upload of the final participant-narrated video (2–4 minutes, at least 720p, audio without music), plus the participant’s manual YouTube upload required by the brief, visibility/HD checks and form review. Obtain explicit final Submit confirmation and preserve the actual confirmation before reporting submitted.

If the Graph key, substantive human involvement or narration remains unavailable, report unmet requirements. Do not manufacture provider results, human contributions or a submission-ready video.
