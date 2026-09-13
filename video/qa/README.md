# Preview QA evidence

- `ffprobe-preview.json`: exact final preview metadata and complete ffmpeg decode result.
- `playback-check.json`: actual Chromium playback advanced at 5, 66 and 122 seconds; 1920×1080 decoding, no media error.
- `01.png` through `12.png`: original browser checkpoints from the recording. Generated PNGs are kept locally and gitignored.
- `playback-beginning.png`, `playback-middle.png`, `playback-end.png`: screenshots taken after actual playback, visually checked for labels and result states.

The output is 127.300 seconds, 30 fps, H.264, 8,301,671 bytes, with **zero audio tracks**. Human narration is absent. The timeline uses real running UI throughout; the sample receipt is explicitly synthetic. No live Graph or LLM execution is represented.

All recording assertions passed: unavailable live issuance notice, original signature plus independent test pin, changed-number failure, changed-text failure, alternate key with valid signature and trust mismatch, unknown trust without a pin, and offline valid/tampered verification with zero HTTP requests while offline.

This evidence does not certify final submission readiness, production live execution, participant contribution or compliance with the final narration requirement.
