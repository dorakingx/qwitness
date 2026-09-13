# Human review packet

Status: **Not yet performed.** This packet was prepared by AI. It does not record a human review or certify prize eligibility. The original goal is an AI-assisted specification; do not attribute its authorship to the participant.

## The design to assess

QWitness is intended to preserve the content of an onchain-data analysis in a portable, signed receipt. The signature covers the question, provider evidence, calculation results, analysis and protected signing metadata. Changing signed content should invalidate the signature.

It does not prove the provider told the truth, the AI reasoned correctly, the data is current, or the receipt existed at an independently certified time. It does not make Ethereum, wallets, funds, network transport, or consensus quantum resistant. A valid signature can accompany false information.

The proposed trust decision is to supply a trusted public key independently of the receipt. A receipt's own key establishes mathematical signature integrity only. Users must deliberately choose which signer to trust. The initial key distribution channel, protection of the private key, and key rotation remain separate risks.

Please assess whether that trust model is appropriate for the intended analyst workflow. Explain which channel you would use to obtain the trusted key, what could go wrong, and one change you want in the product or documentation. A confirmation without actual consideration is not a substitute for substantive contribution.

## Review that can start before Graph credentials arrive

The public integrity verifier is available at https://qwitness.vercel.app/verify. Use the explicitly synthetic `video/public/test-only-receipt.json` and the separately supplied `video/public/test-only-pin.txt`. They were prepared by AI for testing and contain no real market observations. Their temporary test signer is different from the production signer: do not use **Pin this site's signer** for this sample.

Import the test-only JSON into Verify, paste the test fingerprint, and run verification. Keep the original. Exercise **Change a number**, **Rewrite a claim**, **Re-sign with a test key**, and **Restore original receipt**. Record what you actually observe for integrity and signer trust after each action. Remove the pin and verify the original again. Observation time may now be stale; a valid signature does not establish freshness.

Download `public/offline-verifier.html`, open it from disk, disconnect networking, and repeat verification. Both the verifier and test pin are supplied through this project; this demonstrates separate inputs, not an independently authenticated real-world trust channel. Decide which independent distribution channel you would require for a real deployment and explain why.

This partial review can establish human feedback on the integrity/trust interface. It does **not** complete the live Graph/evidence review below or establish eligibility. Report the current build commit from `/api/capabilities` with your observations; the preview test artifacts were verified on `a2e6e387ea3d3f5c4196e1004d25280a52794679`.

## Manual test once the build is ready

Use the actual build/commit supplied by the implementation owner. Record its URL or path and commit SHA. Keep an untouched copy of the downloaded receipt. These are expected results, not recorded results.

1. Run the example market comparison. Read the data status and timestamp. Check the source, block metadata, utilization definition, units, and one evidence reference. Note anything unclear or unsupported.
2. Download a receipt. Obtain the intended trusted key through the independently supplied channel. Verify the original: signature should be valid and the signer should match the pinned key.
3. In a copy, change an evidence number while keeping its signature. Verify again: integrity should fail. Restore from the original and repeat by changing an analysis sentence.
4. Use the explicitly labelled Test signer action to sign a copy with another key. With the original trusted key still pinned, the new signature may be mathematically valid but signer trust must report mismatch. This is a key-substitution test, not a quantum attack.
5. Remove the externally supplied trusted key. Verify the untouched original. The signer must be unknown, never automatically trusted.
6. Disconnect networking and use the independent verifier on the original and edited copies. Record what actually works. Do not count a browser page that secretly depends on a server as offline verification.
7. Identify one defect, ambiguity, or design tradeoff yourself. Describe the change you propose and retest after it is implemented.

Reply with the build/commit tested, your own trust decision and reasoning, the observed result of each step, and specific feedback. Only the actual response and resulting changes should enter `HUMAN_CONTRIBUTIONS.md`; unsuccessful tests should also be retained. No result is pre-filled here.

## Voice recording

After the script is reconciled with working features, read `submission/narration-script.md` in your own voice. On the Mac, use QuickTime Player → File → New Audio Recording, choose the microphone, and start recording yourself. Save or export the recording to `video/input/narration.m4a` (WAV is also acceptable). The agent will not open or record the microphone without an explicit request.

Speak naturally; leave short pauses between paragraphs. If you make a mistake, pause and repeat that sentence. The editor may trim silence and adjust volume, but must not generate, clone, or replace your spoken content. A preview without your audio will remain clearly labelled as a preview.
