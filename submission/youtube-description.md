# Preview description — not the final submission video

QWitness is an unaudited prototype for post-quantum evidence receipts for onchain AI agents.

This silent technical preview shows the actual local web app and offline verifier. It demonstrates a valid ML-DSA-65 signature, detection of changed sample content, a different signer failing an independently pinned fingerprint, and verification with networking disabled. The receipt shown is explicitly synthetic TEST-ONLY data. No live The Graph query or LLM analysis is demonstrated in this preview. Live issuance remains blocked by missing provider configuration, which is shown in the app.

The Graph integration is implemented as a fixed server-side adapter for Aave V3 USDC/DAI markets on Ethereum. Its intended output preserves Graph queries, responses, deployment/block metadata and calculation evidence. Successful live execution is still pending. The receipt signature protects signed content; it does not prove provider honesty, AI correctness, trusted time, or quantum resistance of Ethereum itself.

Initial public app: [qwitness.vercel.app](https://qwitness.vercel.app)

Public repository: [dorakingx/qwitness](https://github.com/dorakingx/qwitness)

The initial app URL is available, but this video is recorded locally and does not establish a complete production workflow. Code and documentation were AI-assisted. Participant review, actual narration and final submission are pending. There is no generated voice, music or narration in this preview.

Do not upload this as the final hackathon demo. Replace this description after recording live functionality and the participant's own narration. Final chapters must come from the actual final edit. Any preview chapters below apply only to this preview.

## Preview chapters

00:00 An evidence trail, under construction
00:10 Live integration is still blocked
00:22 No generated receipt
00:31 Import an explicitly synthetic sample
00:41 The original passes with an independent test pin
00:51 Change a number in a copy
01:01 Change the analysis text
01:11 Another valid signature is another signer
01:23 No pin means unknown trust
01:34 Verify from a local file, with networking disabled
01:46 Offline tampering is detected too
01:56 Integrity is not truth
