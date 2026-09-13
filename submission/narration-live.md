# QWitness — live-demo narration

Record this script in your own English voice, around 2–3 minutes. Live Graph and MCP issuance now pass. This replaces the earlier blocked-integration narration. No TTS. The final edit will use actual live app and MCP footage. Save your recording in video/input/ or share its path.

An AI answer is not an audit trail. When an agent compares onchain markets, how do we preserve the evidence it saw, and detect changes to its report later?

This is QWitness: post-quantum evidence receipts for onchain AI agents.

I start with one question: compare two lending markets. Which has higher utilization, and what should an analyst monitor next?

QWitness queries a live provider on The Graph. Here are the returned market records, their source, and the observation time. The receipt also preserves the query and available block metadata. Unknown metadata stays unknown.

The application calculates utilization in code, using the protocol's units. The displayed analysis is explicitly deterministic: no language model is called in this demo. Each claim refers back to its evidence.

The same core is available through MCP. An AI client can create a receipt, inspect capabilities, and verify a receipt with an explicitly supplied trusted key. An actual MCP client has created and verified a live receipt. The tooling is reusable beyond this interface.

Now I download the signed JSON and open the independent verifier. It checks the receipt without querying The Graph or calling a language model.

The original signature verifies. I change a number in a copy, keeping the original signature. Verification fails. Changing the analysis text is detected too.

Next, I use the clearly labelled test signer. This copy has a valid signature from another key. But it does not match the key I pinned. Signature integrity and signer trust are different results. Without a trusted key, the signer remains unknown.

QWitness uses ML-DSA-65 through an existing cryptographic library. The post-quantum claim concerns this receipt signature. It does not make Ethereum quantum resistant, prove the provider is honest, or prove the analysis is correct. The timestamp is the signer's claim, not an independent time certificate.

This is an unaudited hackathon prototype. The repository includes the core, verification tools, tests, and AI-use disclosure.

QWitness gives an AI report a portable evidence trail that others can inspect and check.

