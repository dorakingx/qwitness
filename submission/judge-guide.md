# Judge guide — current build

**Work in progress:** public demo and live receipt creation are not yet available. The repository includes the core and standalone verifier artifacts. Source: [dorakingx/qwitness](https://github.com/dorakingx/qwitness). Snapshot: 2026-09-12 23:51 UTC.

## Start with independent verification

Obtain `public/offline-verifier.html` or `public/qwitness-verify.mjs` from a trusted repository checkout. Use a real receipt once the live flow is available, and obtain its expected signer fingerprint independently. Do not infer trust from the receipt's embedded key.

For HTML, open the downloaded file, import receipt JSON, provide the trusted fingerprint and select **Verify offline**. Dependencies are bundled and the page forbids network connections. An actual disconnected-browser test is still required before marking offline verification fully validated.

For the bundled CLI with Node 22 or later:

```sh
node public/qwitness-verify.mjs receipt.json
```

Without a pin, successful signature verification must still report an unknown signer. To check identity, pass the independently obtained `sha384:` fingerprint as the second argument. Exit code zero without a pin means integrity success only; it does not mean trusted identity.

## Inspect the three distinctions

1. Untouched receipt: integrity should be valid; trust should match only when the independently obtained pin matches.
2. Edit a numeric or analysis field in a copy, preserving the original signature: integrity should become invalid.
3. Use the app's Test signer action once available: a different valid signature must show a mismatch against the original pin. With no pin, it must show unknown. This is a key-substitution demonstration, not a quantum attack.

Freshness is separate and depends on claimed observation time and the verifier's clock. A valid signature does not prove truth, freshness or an independent timestamp.

## Live workflow once configured

Open the verified public URL when supplied. Select the supported Aave V3 USDC/DAI comparison, create a receipt, inspect source/block/time and evidence references, download JSON, then repeat verification independently. Check whether delivery is Live or Cached and whether analysis is LLM or deterministic. Any provider/configuration error is an incomplete live workflow, not a successful demo.

## Reproduce the available MCP check

After `npm ci`, run `npm run test:mcp`. The stored `submission/evidence/mcp-smoke.json` shows an actual MCP SDK stdio client discovering tools and verifying an explicitly test-only receipt. At that run, `create_market_receipt` returned a missing Graph-configuration error. A successful smoke command alone therefore does not prove sponsor readiness; inspect each recorded result.

For live evidence, configure `GRAPH_API_KEY` in this project's gitignored `.env.local` or server secrets, then run `npm run test:live`. Do not paste credentials into a receipt or a client configuration visible to judges. Confirm the new evidence file before claiming the query passed.
