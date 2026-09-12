# QWitness narration draft

**DRAFT — conditional on implementation and recorded evidence. Do not record as a completed-feature claim yet.** Reconcile every present-tense sentence below with the actual app, live Graph request, analysis mode, MCP call, independent verification and test-signer recording first. Remove unsupported sentences rather than illustrating simulated success. Numbers and URLs are deliberately omitted until observed.

The participant must record their own voice. No TTS, AI voiceover or voice cloning. Target about three minutes, with screen interaction pauses. Narration is approximately 320 words; timing must be measured from the actual recording.

## Spoken script

An AI answer is not an audit trail. When an agent compares onchain markets, how do we preserve the evidence it saw, and detect changes to its report later?

This is QWitness: post-quantum evidence receipts for onchain AI agents.

I start with one question: compare two lending markets. Which has higher utilization, and what should an analyst monitor next?

QWitness queries a live provider on The Graph. Here are the returned market records, their source, and the observation time. The receipt also preserves the query and available block metadata. Unknown metadata stays unknown.

The application calculates utilization in code, using the protocol's units. The analysis refers back to that evidence and separates conclusions from limitations. A recorded sample or a rules-based fallback must be labelled clearly.

The same core is available through MCP. An AI client can create a receipt, inspect capabilities, and verify a receipt with an explicitly supplied trusted key. This makes the workflow reusable beyond this interface.

Now I download the signed JSON and open the independent verifier. It checks the receipt without querying The Graph or calling a language model.

The original signature verifies. I change a number in a copy, keeping the original signature. Verification fails. Changing the analysis text is detected too.

Next, I use the clearly labelled test signer. This copy has a valid signature from another key. But it does not match the key I pinned. Signature integrity and signer trust are different results. Without a trusted key, the signer remains unknown.

QWitness uses ML-DSA-65 through an existing cryptographic library. The post-quantum claim concerns this receipt signature. It does not make Ethereum quantum resistant, prove the provider is honest, or prove the analysis is correct. The timestamp is the signer's claim, not an independent time certificate.

This is an unaudited hackathon prototype. The repository includes the core, verification tools, tests, and AI-use disclosure.

QWitness gives an AI report a portable evidence trail that others can inspect and check.

## Recording cues, not spoken

| Approximate segment | Required actual footage |
| --- | --- |
| Opening / live query | Brief title, app example, successful Graph response and metadata. |
| Evidence / AI / MCP | Calculations and evidence references; genuine client tool call and result. |
| Receipt / tampering | Download, independent verification, edited number and analysis failure. |
| Trust | Test signer copy, original pinned key, valid signature with trust mismatch. |
| Limits / close | Short architecture view and actual repository/demo links. |

Generate final subtitles and chapters from the real voice and edited timeline, not these approximate cues. If no participant audio is available, export `preview-without-narration.mp4` only; do not label it `demo-final.mp4`.
