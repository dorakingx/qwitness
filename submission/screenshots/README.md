# Draft screenshots

Captured at 2026-09-13T00:11:45.522Z with Playwright, from the actual app or its standalone local HTML. Browser viewport: 1440 × 1080, device scale: 1. No DOM content was replaced, no API response was mocked, and no decorative overlays were added.

These are **draft screenshots pending successful live Graph and AI/MCP evidence**. They must not be described as a completed live market workflow.

- **draft-01-explore-missing-graph-key.png** — 1440 × 1507 PNG. Actual public UI. Graph key missing; live generation disabled.
- **draft-02-verify-explicit-test-only-receipt.png** — 1440 × 1080 PNG. Actual UI import. TEST ONLY payload is visible. Temporary test signer with separately supplied test pin. No market data.
- **draft-03-standalone-offline-test-verification.png** — 1440 × 1526 PNG. Bundled standalone verifier opened from local file. Network disabled. TEST ONLY receipt and temporary test pin.

The test receipt contains no market observations or invented financial measurements. Its 'purpose' is visibly labeled TEST ONLY. Its throwaway key was generated only for this capture; no private key was saved. The public test fingerprint was entered separately through the normal UI. The offline capture made 0 HTTP requests after network access was disabled.

Regenerate with Node 22+: 'npx tsx scripts/capture-assets.ts'. Optionally set 'QWITNESS_CAPTURE_URL' to the app URL. The script intentionally requires the missing-configuration state; update the capture narrative and assertions only after real live evidence exists.
