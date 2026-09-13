# QWitness submission draft

## Latest update — 2026-09-13T01:21:56.382594+00:00

The participant authorized API-key creation and Free-plan setup without an individual spending cap after the UI rejected zero. The key is saved locally with mode 0600, restricted to the intended subgraph, and configured as a sensitive production-only Vercel variable. A fresh clipboard copy matched the local secret exactly. The new production deployment serves commit `4ed5cc963d8984b58f8c0269ccdf846f2cc5090c`.

Live acquisition remains blocked: local gateway requests return `auth error: API key not found`; production receipt creation returns HTTP 503. Configured credentials are not proof of successful integration. See `submission/evidence/graph-activation.json`. The Graph prize requirements remain unmet. No successful live query, participant narration or final submission is claimed. The participant requested prioritizing submission with 11% of Codex weekly usage remaining.

**Not ready for final submission.** Snapshot: 2026-09-13 00:24 UTC. Latest recorded public/CI commit: `6b40aa972a170047980ca27c04be448773be89e5`, with successful CI. The public web prototype is deployed. The participant completed GitHub linkage; repository selection, project details and technical text were saved in the dashboard draft. The original logo, cover and three clearly labelled draft screenshots were uploaded and saved; Save & Continue advanced to Tech Stack. Live Graph query, actual LLM analysis, substantive human review and narrated video remain pending. No final Submit has occurred.

## Title

QWitness

## Short description

Portable signed evidence and independent verification for onchain AI agents.

## Description

QWitness is a prototype for carrying the evidence behind an onchain market report into a signed, independently verifiable JSON receipt. Its TypeScript core includes a bounded The Graph adapter for Aave V3 USDC and DAI markets on Ethereum, exact integer calculations, structured analysis, ML-DSA-65 receipt signing and a verifier that separates signature integrity from trust in a pinned signer.

The project includes reusable MCP tools and bundled offline HTML and Node verifiers. An actual MCP SDK client has discovered the tools and verified a test-only receipt. End-to-end receipt creation from live Graph data has not succeeded yet because the gateway rejects the configured key with `auth error: API key not found`. No real LLM request has been demonstrated. These are open completion requirements, not working-feature claims.

## How it is made

The fixed Graph adapter obtains deployment and block metadata, then pins its reserve query to that block. Query text, variables, responses and observation metadata become evidence. Token amounts stay integer/decimal strings; calculations use the Aave snapshot formula instead of treating USD TVL as supply. Optional OpenAI analysis must pass a schema and evidence-reference checks; missing credentials select a labelled deterministic mode.

The complete canonical protected header and payload are signed with ML-DSA-65 using `@noble/post-quantum`. Web issuance and the MCP wrapper call the same service. Offline verification uses an independently supplied SHA-384 signer fingerprint; an embedded public key does not establish trust. Next.js and React provide the developing web interface.

## Challenges

The central design problem is distinguishing an intact report from a trustworthy report. Signatures do not establish provider honesty, analysis correctness or an independently certified timestamp. Other implementation challenges include preserving token precision, pinning indexed evidence, failing visibly on provider errors, and exposing the same logic through web, MCP and offline tools.

## What is new

QWitness-specific source was created in a new repository for this event. The new work combines the receipt format, fixed Graph acquisition, calculation and analysis pipeline, trust-aware verification, MCP interface and web workflow. Public libraries supply cryptography and framework infrastructure; their use is documented in `docs/provenance.md`. No new cryptographic primitive or smart contract is claimed.

## AI and human contribution

The specification was AI-assisted, and Codex generated and assisted implementation, documentation, testing and preview-video work. The goal is retained in `docs/GOAL.md`. The participant completed GitHub linkage; this is an administrative contribution. Participant design review, hands-on test feedback and narration are still pending. Reconcile this section with `AI_USAGE.md` and `HUMAN_CONTRIBUTIONS.md` before submitting.

## Verification so far

Seventy-five unit tests passed, as did four Playwright tests locally and against the public URL. Browser evidence uses explicitly synthetic receipts to check integrity, tampering, alternate/unknown signers, offline verification and mobile-width usability. Clean-clone install, typecheck, 75 tests, verifier build, production build and secret scan passed for earlier commit `4d96ea383f665d879ff59720c073d02e9c9c394b`; see `submission/evidence/clean-validation.json`. These checks do not establish live Graph or LLM execution, and earlier clean-clone results must not be attributed to untested later edits.

## Links and prize

- Public source: [github.com/dorakingx/qwitness](https://github.com/dorakingx/qwitness).
- Public prototype: [qwitness.vercel.app](https://qwitness.vercel.app). Browser verification passes using test-only receipts; live issuance fails provider authentication despite configured credentials.
- Technical preview: `submission/preview-without-narration.mp4`, 127.300 seconds, 1920×1080, 30 fps, H.264, no audio. It records actual UI using a synthetic receipt with missing live Graph/LLM labels. Decode and beginning/middle/end playback passed. It is not the final hackathon demo; no participant narration or YouTube video is available yet. The actual ETHGlobal Video tab requires a direct MP4/MOV upload, 2–4 minutes, at least 720p, with audio and without music. A final participant-narrated file must be uploaded directly there; the brief also requires the participant’s manual YouTube upload.
- Intended prize: The Graph — Best AI Tooling or AI Use Case with The Graph (From Scratch). Live-data and final evidence requirements remain unmet.

This receipt verifies signed content against a specified public key. It does not prove the provider is honest, the AI analysis is correct, or Ethereum itself is quantum-resistant. This is an unaudited prototype.
