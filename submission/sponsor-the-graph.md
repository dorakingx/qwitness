# The Graph — From Scratch AI tooling

Target: **Best AI Tooling or AI Use Case with The Graph (From Scratch)**. The Graph partner-only selection and usage explanation are saved in the ETHGlobal draft. Final submission has not occurred; participant narration, final video and technical review remain pending.

QWitness is reusable TypeScript/MCP infrastructure, with a web example and independent offline verifiers. The Graph is essential: it supplies the live Aave V3 USDC/DAI reserve evidence that the service calculates, analyzes deterministically and signs. No static substitute is used for successful issuance. No actual LLM request is claimed.

## Actual integration

- Provider endpoint: `https://gateway.thegraph.com/api/subgraphs/id/Cd2gEDVeqnjBn1hSeqFMitw8Q1iiyV9FYUZkLNRcL87g`, with server-only bearer authorization.
- Observed deployment: `QmX2VfvEspbShTdcjefWeG3CKBVXKWm9naxH6TVhqPb9qY`.
- First successful recorded acquisition: block 25965223 on September 13, 2026 UTC. Subsequent public issuance passed at block 25965234; actual browser generation passed at block 25965243.
- Code: [fixed adapter](https://github.com/dorakingx/qwitness/blob/54bdc9c4ef32079c48389ee85dd4aafecda9c9bc/src/core/graph.ts#L116), [shared service](https://github.com/dorakingx/qwitness/blob/main/src/core/service.ts), [MCP server](https://github.com/dorakingx/qwitness/blob/main/mcp/server.ts).
- Reuse: [MCP README](https://github.com/dorakingx/qwitness/blob/main/mcp/README.md) and [MCP SKILL](https://github.com/dorakingx/qwitness/blob/main/mcp/SKILL.md).

## Reproduce and inspect

Configure authorized credentials as described in the README, then run `npm run test:live` and `npm run test:mcp`. The latter uses the actual MCP SDK stdio client and calls tool discovery, capabilities, live creation and verification with a separately supplied public pin. Preserved tool calls/results are in `evidence/mcp-smoke.json`; the signed live receipt is `evidence/live-receipt.json`.

Public receipt creation returns HTTP 200. The original verifies against the public signer pin, altered content fails, and an alternate valid signer yields a trust mismatch. See `evidence/production-live-verification.json` and `evidence/live-integration-summary.json`. All 77 unit tests and CI passed for implementation commit `54bdc9c4ef32079c48389ee85dd4aafecda9c9bc`.

## Limits

Number-pinned provider metadata omits optional hash/timestamp; these remain unknown. Known conflicts still fail. Signatures establish integrity relative to a specified key, not provider honesty, analysis correctness, independently certified time or Ethereum quantum resistance. This is an unaudited prototype. A final 2–4 minute participant-narrated demo is still required.

[Official prize requirements](https://ethglobal.com/events/ethonline2026/prizes/the-graph), rechecked September 13, 2026: the track accepts reusable AI tooling, requires meaningful use of live Graph data, public source and a short demo video.
