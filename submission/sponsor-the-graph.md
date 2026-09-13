# The Graph prize explanation — draft

Target: **Best AI Tooling or AI Use Case with The Graph (From Scratch)**. Live qualification is **not yet established**. Snapshot: 2026-09-12 23:51 UTC.

## Actual integration

`src/core/graph.ts` implements a fixed gateway query for Aave V3 on Ethereum, chain ID `1`, USDC and DAI. It uses subgraph routing ID `Cd2gEDVeqnjBn1hSeqFMitw8Q1iiyV9FYUZkLNRcL87g` from the official Aave listing. The key-free configured endpoint is [The Graph gateway](https://gateway.thegraph.com/api/subgraphs/id/Cd2gEDVeqnjBn1hSeqFMitw8Q1iiyV9FYUZkLNRcL87g); requests use a server-only authorization header. This link is an endpoint reference, not proof of a successful authenticated query.

The actual deployment CID remains unknown until a successful `_meta.deployment` response. A routing ID is not a deployment CID. `docs/graph-provider.md` documents the inspected Aave schema, source references, token units, snapshot limitations and formula.

The adapter first reads metadata, then fixes the reserve query to the returned block and checks consistency. It retains query text, variables, safe responses, timestamp and block/deployment evidence. It rejects unavailable or mismatched data rather than issuing a fixture receipt. `src/core/service.ts` orchestrates acquisition, calculations, analysis and signing for web and MCP.

## Why the data matters

The comparison depends on indexed liquidity from actual protocol reserves. Without this data, QWitness cannot issue the proposed live market receipt. Static test cases validate mechanics only. The signed evidence context is intended to let an analyst inspect what the report used and distinguish later edits from the original signed observation.

## Reusable AI tooling

`mcp/server.ts` exposes `get_capabilities`, `create_market_receipt` and `verify_receipt` over stdio using the official MCP SDK. Creation accepts the supported question, not arbitrary evidence or a user-controlled URL. Verification accepts receipt JSON plus an optional independently supplied trusted fingerprint. `src/core/service.ts` is shared with the web API; `src/core/receipt.ts` supplies the independent verification logic.

For reuse, clone the [public repository](https://github.com/dorakingx/qwitness), install the pinned dependencies, configure this project's local server environment, and run the MCP server. The client can issue this actual tool-call shape:

```json
{"method":"tools/call","params":{"name":"create_market_receipt","arguments":{}}}
```

Live issuance now succeeds; see `evidence/live-integration-summary.json` and the latest `evidence/mcp-smoke.json`. The older configuration failure is historical. `submission/evidence/mcp-smoke.json` records a real SDK-client session at 2026-09-12T23:47:45.573Z: discovery and test-only receipt verification succeeded; live issuance failed. Neither this test nor the deterministic mode establishes successful LLM reasoning over live Graph data.

## Required evidence before applying

Run `npm run test:live` with an authorized Graph key. Record the actual deployment, block, response and observation time. Then record a successful real AI/MCP-client creation workflow and a public demo using the same service. Supply the runnable README/SKILL, final public commit, and 2–4 minute participant-narrated video. No sponsor endorsement, prize eligibility or award is claimed here.
