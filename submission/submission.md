# QWitness submission draft

**Not ready for final submission.** Snapshot: 2026-09-12 23:51 UTC, implementation commit `393a658e48605b0bf620f433133a85780a335084`. The public Web prototype is deployed. Live Graph query, actual LLM analysis, human review and narrated video remain pending. The authenticated form was inspected; repository selection is blocked by GitHub installation access.

## Title

QWitness

## Short description

Portable signed evidence and independent verification for onchain AI agents.

## Description

QWitness is a prototype for carrying the evidence behind an onchain market report into a signed, independently verifiable JSON receipt. Its TypeScript core includes a bounded The Graph adapter for Aave V3 USDC and DAI markets on Ethereum, exact integer calculations, structured analysis, ML-DSA-65 receipt signing and a verifier that separates signature integrity from trust in a pinned signer.

The project includes reusable MCP tools and bundled offline HTML and Node verifiers. An actual MCP SDK client has discovered the tools and verified a test-only receipt. End-to-end receipt creation from live Graph data has not succeeded yet because the API key is missing. No real LLM request has been demonstrated. These are open completion requirements, not working-feature claims.

## How it is made

The fixed Graph adapter obtains deployment and block metadata, then pins its reserve query to that block. Query text, variables, responses and observation metadata become evidence. Token amounts stay integer/decimal strings; calculations use the Aave snapshot formula instead of treating USD TVL as supply. Optional OpenAI analysis must pass a schema and evidence-reference checks; missing credentials select a labelled deterministic mode.

The complete canonical protected header and payload are signed with ML-DSA-65 using `@noble/post-quantum`. Web issuance and the MCP wrapper call the same service. Offline verification uses an independently supplied SHA-384 signer fingerprint; an embedded public key does not establish trust. Next.js and React provide the developing web interface.

## Challenges

The central design problem is distinguishing an intact report from a trustworthy report. Signatures do not establish provider honesty, analysis correctness or an independently certified timestamp. Other implementation challenges include preserving token precision, pinning indexed evidence, failing visibly on provider errors, and exposing the same logic through web, MCP and offline tools.

## What is new

QWitness-specific source was created in a new repository for this event. The new work combines the receipt format, fixed Graph acquisition, calculation and analysis pipeline, trust-aware verification, MCP interface and web workflow. Public libraries supply cryptography and framework infrastructure; their use is documented in `docs/provenance.md`. No new cryptographic primitive or smart contract is claimed.

## AI and human contribution

The specification was AI-assisted, and Codex generated and assisted implementation, documentation and test work. The goal is retained in `docs/GOAL.md`. Participant design review, hands-on test feedback and actual narration are still pending; do not claim they have happened. Reconcile this section with the final `AI_USAGE.md` and `HUMAN_CONTRIBUTIONS.md` before submitting.

## Links and prize

- Public source: [github.com/dorakingx/qwitness](https://github.com/dorakingx/qwitness).
- Public prototype: [qwitness.vercel.app](https://qwitness.vercel.app). Browser verification passes using test-only receipts; live issuance awaits credentials.
- Demo video: not recorded; no participant narration available yet.
- Intended prize: The Graph — Best AI Tooling or AI Use Case with The Graph (From Scratch). Live-data and final evidence requirements remain unmet.

This receipt verifies signed content against a specified public key. It does not prove the provider is honest, the AI analysis is correct, or Ethereum itself is quantum-resistant. This is an unaudited prototype.
