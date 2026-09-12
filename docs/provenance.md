# Provenance and dependencies

QWitness began in a new repository on 2026-09-12 (UTC). No code, dedicated designs or assets from the participant's existing projects were copied. The original project input is preserved in docs/GOAL.md and disclosed as AI-assisted. Original QWitness source is MIT licensed.

Dependency versions are pinned in package.json and package-lock.json. Next.js, React, the official MCP TypeScript SDK, canonicalize, Zod, Vitest, Playwright, esbuild and noble libraries retain their respective upstream licenses; see installed package LICENSE files and lockfile package metadata. No external images or icons are required by the interface.

ML-DSA-65 uses @noble/post-quantum 0.7.1, MIT, with SHA-384 fingerprinting from @noble/hashes. Checked September 12, 2026 UTC. The upstream README states no independent audit and documents JavaScript side-channel limitations. NIST standardization does not certify QWitness or this JS implementation.

- https://github.com/paulmillr/noble-post-quantum/tree/0.7.1
- https://github.com/paulmillr/noble-post-quantum#security
- https://csrc.nist.gov/pubs/fips/204/final
- https://github.com/erdtman/canonicalize
- https://github.com/modelcontextprotocol/typescript-sdk

Aave schema, deployment references and mapping behavior were inspected from the official protocol-subgraphs repository and address book. We wrote our own GraphQL client and independent integer calculations; we did not incorporate Aave mapping code. See docs/graph-provider.md for pinned source references. Referencing a public schema does not imply partnership, endorsement or provider honesty.
