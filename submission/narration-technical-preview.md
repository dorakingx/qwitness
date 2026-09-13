# Recordable technical-preview narration

This script describes only demonstrated functionality. It does not qualify the project for the intended Graph live-data prize. Record in your own voice, about 2–3 minutes, and leave short pauses between paragraphs. Save the recording in `video/input/` or provide its file path. Do not read the old conditional live-demo script.

An AI answer is not an audit trail. When a report changes, how can another person check what was originally signed, and whose signature they are trusting?

This is QWitness, a prototype for portable evidence receipts for onchain AI agents. This demonstration focuses on the working verification flow. The market receipt shown here is a clearly labelled synthetic test sample.

The Graph adapter and a production API key are configured. However, live acquisition currently fails provider authentication. No successful live market query or language model analysis is claimed. The application reports the failure rather than inventing a result.

Now I import the test receipt into the verifier. I also provide its test signer fingerprint separately. The original signature verifies, and the signer matches that independent pin. The pin must come from a source the verifier already trusts.

Next, I change a number while keeping the original signature. Verification fails. Editing the analysis text also fails. These checks show that signed content cannot be silently changed while retaining its original signature.

Another test signs a copy with a different key. That signature is mathematically valid, but the signer does not match the original pin. When I remove the pin, trust becomes unknown. A public key bundled inside a receipt does not establish trust by itself.

The standalone HTML verifier works with networking disabled. It needs neither The Graph nor a language model. A Node verifier and reusable MCP tools are also included. An actual MCP client has discovered the tools and verified a test receipt.

QWitness uses ML-DSA-65 through an existing library. This protects receipt integrity. It does not prove provider honesty, analysis correctness, or Ethereum's quantum resistance.

This is an unaudited, AI-assisted hackathon prototype. The public repository includes source, tests and limitations. QWitness separates an intact report from a trustworthy report.
