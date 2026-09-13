# QWitness

**Post-quantum evidence receipts for onchain AI agents.**

[Public prototype](https://qwitness.vercel.app) · [Offline verifier](https://qwitness.vercel.app/offline-verifier.html) · [Repository](https://github.com/dorakingx/qwitness)

QWitness packages a bounded Aave market query, deterministic utilization calculation and labeled analysis into an ML-DSA-65 signed JSON receipt. Web and MCP share the same TypeScript core. Anyone with the receipt can check its integrity offline and compare its signer against an independently supplied fingerprint.

**Current state — 2026-09-13T01:30:19.428364+00:00:** live Graph acquisition and a real MCP SDK client issuance/verification now succeed. Analysis is explicitly deterministic. A provider metadata compatibility bug was fixed; all 77 tests, typecheck and secret scan pass. See [live integration evidence](submission/evidence/live-integration-summary.json). Production verification, participant technical review, narration and final submission are the remaining tasks.

A **silent technical preview** is available locally at `submission/preview-without-narration.mp4`: 2 minutes 7.3 seconds, 1080p, 30 fps, H.264, no audio. It shows real UI with synthetic TEST-ONLY evidence and states that live Graph/LLM execution is absent. [Video source and QA](video/README.md). It is not the final submission demo, and no public video URL is claimed. The inspected ETHGlobal Video tab requires a direct MP4/MOV upload: 2–4 minutes, at least 720p, audio without music. A final participant-narrated file must be uploaded there; the brief additionally requires the participant’s manual YouTube upload.

## Run locally

```sh
nvm install
nvm use
npm ci
cp .env.example .env.local
npm run keygen
```

Configure `GRAPH_API_KEY` in `.env.local` locally; do not paste credentials into chat or commit them. An existing authorized `OPENAI_API_KEY` is optional. Set provider-side quotas with paid overages disabled before enabling public issuance. No subscription purchase is required by the code.

```sh
node --env-file=.secrets/signing.env node_modules/next/dist/bin/next dev --hostname 127.0.0.1
```

Next.js reads `.env.local`. Restart the server after changing secrets. The signer seed is stable and ignored by Git, with file mode 0600. `public/signer.json` contains the public key and fingerprint only. Generating a signer refuses to overwrite an existing local key. A fresh clone generates its own signer and therefore a new public pin; it cannot impersonate the deployed prototype.

## Workflow once live issuance is configured

1. Generate an evidence receipt from the supported comparison.
2. Inspect the exact query, variables, deployment, indexed block, observation time and token units.
3. Download the original JSON. In Verify, independently supply a signer fingerprint; using the site's pin trusts the site's HTTPS delivery channel.
4. Change a number or claim in the Tamper Lab. It edits a copy and reruns signature verification.
5. Re-sign with the explicitly labeled Test signer. Integrity can remain valid while the independently pinned signer mismatches.

No pin means **unknown**, never automatically trusted. Live delivery, cached delivery and a missing provider are visibly different states. A missing LLM selects labeled deterministic analysis; invalid configured LLM output fails issuance.

The independent verifier can already be used with an existing receipt. Tested synthetic examples demonstrate integrity and trust handling, not a successful market-data workflow.

## Offline and reusable tools

```sh
npm run build:verifier
node public/qwitness-verify.mjs receipt.json 'sha384:your-independently-obtained-fingerprint'
npm run test:mcp
```

The CLI is a standalone bundled Node ES module. Download `public/offline-verifier.html` and open it from disk without networking. All dependencies are included; it makes no API or CDN calls. The verifier file and initial pin must themselves come from trusted channels.

See [MCP setup](mcp/README.md), [agent skill](mcp/SKILL.md) and [TypeScript example](scripts/example.ts). Tools: `get_capabilities`, `create_market_receipt`, `verify_receipt`. The MCP wrapper uses stdout exclusively for protocol messages.

## Data and cryptography

The fixed provider is The Graph's Aave V3 Ethereum subgraph, routing ID `Cd2gEDVeqnjBn1hSeqFMitw8Q1iiyV9FYUZkLNRcL87g`. The actual deployment CID is recorded from `_meta` only after a successful live query. USDC and DAI are identified by verified underlying addresses and the Ethereum Aave V3 pool. The adapter pins queries to one indexed block and rejects inconsistent metadata, missing assets or wrong decimals.

Utilization follows the inspected Aave mapping: `(totalLiquidity - availableLiquidity) / totalLiquidity`, truncated to eight decimal places, with zero-total handled explicitly. These are indexed token amounts, not USD TVL and not continuously accrued balances. Raw amounts remain decimal strings. [Provider sources and definitions](docs/graph-provider.md).

The complete canonical protected header and payload are signed with the domain context `QWitness/receipt/v1`. The signature is detached to avoid self-reference. Version, algorithm and SHA-384 signer fingerprint are protected. [Threat model](docs/threat-model.md) · [Dependency provenance](docs/provenance.md).

> This receipt verifies the signed content against a specified public key. It does not prove that the data provider is honest, that the AI analysis is correct, or that Ethereum itself is quantum-resistant.

NIST standardized ML-DSA; this app and JavaScript implementation are not NIST certified. The pinned noble implementation reports no independent audit. QWitness is an unaudited hackathon prototype. A signature may cover false information. issuedAt is a signer assertion, not trusted timestamping. Ethereum accounts, consensus, API transport and funds do not become quantum resistant. Key compromise, initial distribution, rotation and JS side channels remain separate risks.

## Verification and submission

```sh
npm run typecheck
npm test
npm run build
npm run scan:secrets
npx playwright install chromium
npm run test:e2e
npm run test:live
```

Evidence is in [submission/evidence](submission/evidence). Tests using fixture receipts are explicitly identified and are not evidence of a successful live Graph integration. No live receipt benchmark is published until one is measured.

Verified so far: **75 unit tests**, plus **four Playwright tests locally and against the public URL**. They cover missing configuration, original/tampered test receipts, alternate/unknown signers, disk-only offline verification and 390px usability. An actual MCP SDK client listed tools and verified a test-only receipt; live creation returned a configuration error. [Clean-clone evidence](submission/evidence/clean-validation.json) records successful install, typecheck, all 75 tests, verifier build, production build and secret scan for `4d96ea383f665d879ff59720c073d02e9c9c394b`. That result applies to the recorded commit; later edits require final validation. The preview also passed full decode and actual beginning/middle/end playback checks.

[Requirements](submission/requirements.md) · [Judge guide](submission/judge-guide.md) · [Submission draft](submission/submission.md) · [Human review packet](docs/human-review.md) · [AI assistance disclosure](AI_USAGE.md) · [Human contribution record](HUMAN_CONTRIBUTIONS.md).

New project for ETHOnline 2026, Building from Scratch. The source, UI and integration were created in this repository with Codex assistance; existing participant project code and dedicated assets were not reused. Upstream libraries retain their licenses. Author display name: Doraking. MIT license.
