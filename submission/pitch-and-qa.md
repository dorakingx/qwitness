# Pitch and judge questions

Status: **Preparation draft.** Product descriptions below express the intended design until matched to execution evidence. Before submission, reconcile with the actual repository, deployed flow, test results and human-contribution record. Do not claim an unavailable integration or completed human task.

## Short pitch

QWitness turns an onchain market analysis into a portable evidence receipt. It is designed to preserve a real Graph query, its response, deterministic calculations and evidence-linked analysis under an ML-DSA-65 signature. A separate verifier checks content integrity and whether the signer matches a key the user independently trusts. The reusable TypeScript core and MCP tools bring that workflow to AI clients as well as the web interface.

## Questions and answers

**Does the signature prove that the data or the AI answer is true?**

No. It binds signed content to a public key and detects later changes. A provider can return incorrect data and an AI can draw incorrect conclusions. A signed false statement remains possible. Evidence references make inspection easier, not infallible.

**Why post-quantum signatures?**

The experiment applies an existing post-quantum signature scheme to portable AI evidence artifacts. It explores a boundary where a signature format can be adopted without changing Ethereum itself. We did not invent a primitive or demonstrate a quantum attack. This prototype is unaudited, and the algorithm's standardization is not certification of the application or its JavaScript implementation.

**What makes a signer trusted?**

An independently supplied public key or fingerprint. A key inside the receipt is not a trust anchor. The verifier must distinguish an intact signature from a match to the user's pinned signer. Initial key distribution, private-key security, revocation and rotation remain operational trust problems.

**Can someone change a receipt and sign it again?**

Yes, using their own key. That can produce a mathematically valid signature. Comparing it with the original independently pinned key must reveal a signer mismatch. The test signer demonstrates this distinction; it is not an attack on ML-DSA.

**Why use The Graph?**

The intended workflow obtains indexed lending-market evidence through an actual Graph provider. The receipt preserves the query context so an analyst can inspect what the report used. A static fixture does not establish this integration or qualify as its live demonstration. The sponsor submission must identify the actual deployment and successful query evidence.

**Is the timestamp independently trustworthy?**

No. Observation and issue times describe the application's assertions. A signature protects those assertions against editing; it does not certify clock accuracy, freshness, or historical existence.

**Why no new smart contract?**

The experiment concerns offchain analysis provenance and verification. Adding an onchain write does not establish provider truth or signer identity. A contract is not needed for the portable signature-verification workflow.

**What does the AI do?**

The intended analysis uses evidence references, limitations and monitoring suggestions. Numeric calculations belong to deterministic code. Present only the real model or MCP-client path demonstrated in the evidence. A rules-based response must remain labelled as such and must not be called a successful LLM run.

**What did the human participant do?**

At initial drafting, substantive review, manual testing and narration are pending. AI prepared this packet and assisted the goal-driven implementation. After the participant acts, answer with only their recorded decisions, observed tests, feedback and actual recording, linked to `HUMAN_CONTRIBUTIONS.md`. Do not substitute this proposed process for completed contributions or guarantee eligibility.

**What is newly built and what is reused?**

Use the repository's final provenance record for the exact split. The planned new work is the receipt schema, bounded data workflow, integration, interface and verification experience. Existing libraries supply cryptographic primitives and framework infrastructure. No prior project-specific code or assets should be represented as fresh work.

**Can I reproduce the result offline?**

An existing receipt should be verifiable offline with the independent verifier and an independently supplied key. Producing a new live-data analysis requires its external services. Before claiming offline support, demonstrate verification while networking is disabled.
