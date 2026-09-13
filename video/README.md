# QWitness video source

The current artifact is a **silent technical preview**, not a submission-ready demo. It uses real browser actions against the local app and the standalone verifier. Its temporary receipt is marked TEST ONLY and contains no live Graph evidence or LLM analysis. No microphone, narration, synthesized voice, cloned voice, music or simulated UI result is used.

## Re-record and render

Run the local app at `http://127.0.0.1:3000`. The current script deliberately checks that live generation is unavailable. If credentials become available, replace this preview scenario with a new evidence-backed live recording; do not remove the labels from this synthetic recording.

From the repository root:

```sh
npx tsx scripts/record-preview.ts
cd video
npm ci
npm run render:preview
```

`scripts/record-preview.ts` runs the actual app through Playwright at 1920×1080. It generates a temporary test key only in memory, saves the signed test receipt and separate public fingerprint, records browser video at normal elapsed speed, checks expected verification results, and switches the browser context offline before opening the standalone HTML from disk. Network requests while offline are asserted absent.

The script outputs `video/public/browser-recording.webm`, `video/src/timeline.json`, checkpoint PNGs in `video/qa`, and `submission/preview-captions.srt`. Timing comes from the recorded execution. These are explanatory preview captions, not transcriptions of human speech.

The minimal Remotion composition uses that real recording throughout, with a persistent test-only status strip and timed explanatory captions. It does not recreate app screens or accelerate processing. Playwright's source recording is 25 fps; Remotion samples it on a 30 fps timeline while preserving elapsed time. The rendered output is 1920×1080, H.264 MP4 without audio. The image is actual running UI for the complete timeline. Remotion 4.0.524 is pinned in this separate video package; its [OffthreadVideo documentation](https://www.remotion.dev/docs/offthreadvideo) describes frame-accurate source-video rendering.

## Before a final video

Record the successful live Graph request, actual AI/MCP workflow, receipt export and independent verification. Reconcile the narration script with those features. The participant must record their own English narration into `video/input/` themselves. Preserve their words and align subtitles to the real audio. Do not create `demo-final.mp4` until the completed video meets the rules and has passed playback QA. The participant uploads to YouTube and confirms final submission.

The current preview and its missing integration notice are useful development evidence; they do not meet the final narrated-video or live-data requirement.

## Current preview QA

Rendered on September 13, 2026 UTC: `submission/preview-without-narration.mp4`, 127.300 seconds, 1920×1080, 30 fps, H.264, 8,301,671 bytes, no audio track. `video/qa/ffprobe-preview.json` records metadata and a successful complete decode without errors. `video/qa/playback-check.json` records actual browser playback at the beginning, middle and end. Playback advanced normally at all three points, with no media error; the corresponding screenshots were visually inspected for readable labels and verification states.

To repeat browser playback QA, run `node video/check-playback.mjs` from the root. To inspect technical metadata, run `ffprobe -v error -show_streams -show_format submission/preview-without-narration.mp4`. This QA applies only to the preview; repeat it after any edit, live recording or participant audio integration.
