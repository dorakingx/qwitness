# QWitness status
Started: 2026-09-12T23:38:33Z (2026-09-13 08:38:33 JST).
Work budget ends: 2026-09-13T15:38:33Z; this is NOT the official deadline.
Official submission deadline: 2026-09-13T16:00:00Z / September 14 01:00 JST.
Reserve final two hours of budget for human upload/submission.

GitHub: https://github.com/dorakingx/qwitness (public). GitHub CLI dorakingx; Vercel CLI doraking.
Participant dashboard read 2026-09-12T23:50Z: fully confirmed; Building from Scratch selected. Project not yet created. No pending check-in was displayed; full check-in completion not independently established.

Implemented shared ML-DSA-65 core, Graph adapter, deterministic analysis and optional LLM path, MCP wrappers, bounded API routes and standalone offline HTML/CLI.
50 unit tests passed; TypeScript check passed. Actual MCP SDK client listed tools and verified a test-only receipt. Live tool call failed honestly due to missing Graph API key.
Stable signer is in .secrets/signing.env (ignored, mode0600); public pin public/signer.json. Do not print private seed.
Node runtime: /Users/hatanakatomoya/.nvm/versions/node/v22.23.1/bin (shell default is older).

Blockers: GRAPH_API_KEY not yet provided; actual live schema/query not yet exercised. LLM key absent; no LLM execution claimed. Web UI integrating, deployment pending. Human technical review/manual testing/narration pending. No submission or video upload performed.
