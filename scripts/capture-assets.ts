import { chromium, expect } from '@playwright/test';
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { signReceipt, fingerprint } from '../src/core/receipt';

// Original vector assets and unmodified browser captures. No mock API responses.
const baseUrl = process.env.QWITNESS_CAPTURE_URL || 'https://qwitness.vercel.app';
const imageDir = resolve('submission/images');
const screenshotDir = resolve('submission/screenshots');
mkdirSync(imageDir, { recursive: true });
mkdirSync(screenshotDir, { recursive: true });
const ink = '#22302d', ivory = '#f6f7f2', mint = '#ccedc9', muted = '#6f7872';
const shield = '<path d="m16 3 11 4v9c0 6-11 13-11 13S5 22 5 16V7l11-4Z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m11 16 3.5 3.5L22 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" rx="96" fill="${ink}"/><rect x="40" y="40" width="432" height="432" rx="67" fill="none" stroke="#425247"/><g transform="translate(128 66) scale(8)" color="${mint}">${shield}</g><text x="256" y="397" text-anchor="middle" fill="${ivory}" font-family="Arial,sans-serif" font-size="55" font-weight="700" letter-spacing="-2">QWitness<tspan fill="${mint}">.</tspan></text></svg>`;
const cover = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
<rect width="1200" height="675" fill="${ivory}"/>
<g transform="translate(59 49)" color="${ink}">${shield}</g>
<text x="104" y="77" font-family="Arial,sans-serif" font-size="29" font-weight="700" letter-spacing="-1" fill="${ink}">QWitness<tspan fill="#84977c">.</tspan></text>
<text x="1134" y="74" text-anchor="end" font-family="monospace" font-size="12" letter-spacing="1.7" fill="${muted}">ETHONLINE 2026</text>
<path d="M64 112h1072" stroke="#dde2d9"/>
<circle cx="69" cy="172" r="4" fill="#79936c"/>
<text x="86" y="177" font-family="monospace" font-size="12" letter-spacing="1.6" fill="#63765b">EVIDENCE, YOU CAN CARRY.</text>
<text x="61" y="269" font-family="Arial,sans-serif" font-size="65" letter-spacing="-3" fill="${ink}">An evidence trail.</text>
<text x="61" y="345" font-family="Arial,sans-serif" font-size="65" letter-spacing="-3" fill="#84977c">For every answer.</text>
<text x="64" y="410" font-family="Arial,sans-serif" font-size="23" fill="${muted}">Post-quantum evidence receipts</text>
<text x="64" y="444" font-family="Arial,sans-serif" font-size="23" fill="${muted}">for onchain AI agents.</text>
<g transform="translate(845 180) rotate(-6 125 160)"><rect x="-14" y="10" width="250" height="322" rx="11" fill="#e7eee0" stroke="#d0dbca"/></g>
<g transform="translate(849 170) rotate(4 125 160)">
<rect width="250" height="322" rx="11" fill="#fffefa" stroke="#cfd8c8"/>
<text x="25" y="40" font-family="monospace" font-size="10" letter-spacing="1.3" fill="#788d6c">QWITNESS / RECEIPT</text>
<path d="M25 58h200" stroke="#dfe5d9"/>
<text x="25" y="94" font-family="Arial,sans-serif" font-size="19" fill="${ink}">Source evidence</text><text x="25" y="117" font-family="monospace" font-size="10" fill="#829278">QUERY · RESPONSE · BLOCK</text>
<path d="M25 137h200" stroke="#e5eadf"/>
<text x="25" y="174" font-family="Arial,sans-serif" font-size="19" fill="${ink}">Traceable analysis</text><text x="25" y="197" font-family="monospace" font-size="10" fill="#829278">CLAIMS · REFERENCES</text>
<path d="M25 217h200" stroke="#e5eadf"/>
<rect x="25" y="241" width="200" height="51" rx="5" fill="#e9f1e2"/>
<text x="41" y="262" font-family="monospace" font-size="10" fill="#597449">ML-DSA-65</text><text x="41" y="279" font-family="Arial,sans-serif" font-size="11" fill="#597449">A signature you can verify.</text>
</g>
<circle cx="1102" cy="483" r="38" fill="${mint}" stroke="${ivory}" stroke-width="7"/>
<g transform="translate(1085 465) scale(1.1)" color="#416039">${shield}</g>
<path d="M64 555h1072" stroke="#dde2d9"/>
<text x="64" y="602" font-family="monospace" font-size="11" letter-spacing="1" fill="#75846b">THE GRAPH / ETHEREUM</text>
<text x="470" y="602" font-family="monospace" font-size="11" letter-spacing="1" fill="#75846b">ML-DSA-65 / PORTABLE JSON</text>
<text x="1136" y="602" text-anchor="end" font-family="monospace" font-size="10" letter-spacing="1" fill="#8b9682">RESEARCH PROTOTYPE</text>
</svg>`;
for (const [name, svg] of [['qwitness-logo', logo], ['qwitness-cover', cover]]) {
  writeFileSync(`${imageDir}/${name}.svg`, svg);
  await sharp(Buffer.from(svg)).png().toFile(`${imageDir}/${name}.png`);
}

const keys = ml_dsa65.keygen();
const capturedAt = new Date().toISOString();
const testReceipt = signReceipt({
  purpose: 'TEST ONLY — signature demonstration. No Graph query or LLM call.',
  question: 'TEST ONLY — check receipt integrity and an independently supplied test pin.',
  evidence: { mode: 'test-only', provider: 'NONE — NO MARKET OBSERVATIONS', observedAt: capturedAt },
  analysis: { mode: 'test-only', claims: [{ text: 'TEST ONLY — synthetic text. No market data or AI analysis.' }] },
  limitations: ['Created exclusively to demonstrate verification. Not live evidence and not a submission-ready live workflow.'],
}, keys.secretKey);
// Property order has no cryptographic meaning. Put the test-only purpose first so
// it is visible in the real JSON input, without changing the signed payload.
const testJson = JSON.stringify({ payload: testReceipt.payload, protected: testReceipt.protected, publicKey: testReceipt.publicKey, signature: testReceipt.signature }, null, 2);
const testPin = fingerprint(keys.publicKey);
const testPath = `${screenshotDir}/test-only-screenshot-receipt.json`;
writeFileSync(testPath, testJson + '\n');
writeFileSync(`${screenshotDir}/test-only-screenshot-pin.txt`, testPin + '\n');
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1080 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
const page = await context.newPage();
const errors: string[] = [];
page.on('pageerror', error => errors.push(error.message));
const captures: { file: string; width: number; height: number; source: string; state: string }[] = [];
async function capture(file: string, source: string, state: string, fullPage = true) {
  await page.screenshot({ path: `${screenshotDir}/${file}`, fullPage });
  const metadata = await sharp(`${screenshotDir}/${file}`).metadata();
  captures.push({ file, width: metadata.width!, height: metadata.height!, source, state });
}
let requestsWhileOffline = 0;
try {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await expect(page.getByText('Live research is not configured.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Generate evidence receipt' })).toBeDisabled();
  await capture('draft-01-explore-missing-graph-key.png', baseUrl, 'Actual public UI. Graph key missing; live generation disabled.');

  await page.getByRole('tab', { name: /Verify/ }).click();
  await page.locator('input[type=file]').setInputFiles(testPath);
  await page.locator('#signer-pin').fill(testPin);
  await page.getByRole('button', { name: 'Verify receipt locally' }).click();
  await expect(page.locator('.verification-output .check-value').first()).toHaveText('valid');
  await expect(page.locator('.verification-output')).toContainText('matches pinned key');
  await page.locator('.workspace-top').evaluate(element => element.scrollIntoView({ block: 'start' }));
  await capture('draft-02-verify-explicit-test-only-receipt.png', baseUrl, 'Actual UI import. TEST ONLY payload is visible. Temporary test signer with separately supplied test pin. No market data.', false);

  await context.setOffline(true);
  page.on('request', request => { if (/^https?:/.test(request.url())) requestsWhileOffline++; });
  const offlineUrl = 'file://' + resolve('public/offline-verifier.html');
  await page.goto(offlineUrl);
  await page.locator('#file').setInputFiles(testPath);
  await page.locator('#pin').fill(testPin);
  await page.getByRole('button', { name: 'Verify offline' }).click();
  await expect(page.locator('#result')).toContainText('"integrity": "valid"');
  await expect(page.locator('#result')).toContainText('matches pinned key');
  await capture('draft-03-standalone-offline-test-verification.png', offlineUrl, 'Bundled standalone verifier opened from local file. Network disabled. TEST ONLY receipt and temporary test pin.');
  if (requestsWhileOffline !== 0) throw new Error('Unexpected HTTP request during offline screenshot capture');
  if (errors.length) throw new Error('Browser errors: ' + errors.join('; '));
} finally { await browser.close(); }

writeFileSync(`${screenshotDir}/capture-manifest.json`, JSON.stringify({ capturedAt, viewport: { width: 1440, height: 1080 }, baseUrl, status: 'DRAFT — live Graph execution is still unverified', requestsWhileOffline, browserErrors: errors, captures }, null, 2) + '\n');
writeFileSync(`${screenshotDir}/README.md`, `# Draft screenshots\n\nCaptured at ${capturedAt} with Playwright, from the actual app or its standalone local HTML. Browser viewport: 1440 × 1080, device scale: 1. No DOM content was replaced, no API response was mocked, and no decorative overlays were added.\n\nThese are **draft screenshots pending successful live Graph and AI/MCP evidence**. They must not be described as a completed live market workflow.\n\n${captures.map(c => `- **${c.file}** — ${c.width} × ${c.height} PNG. ${c.state}`).join('\n')}\n\nThe test receipt contains no market observations or invented financial measurements. Its 'purpose' is visibly labeled TEST ONLY. Its throwaway key was generated only for this capture; no private key was saved. The public test fingerprint was entered separately through the normal UI. The offline capture made ${requestsWhileOffline} HTTP requests after network access was disabled.\n\nRegenerate with Node 22+: 'npx tsx scripts/capture-assets.ts'. Optionally set 'QWITNESS_CAPTURE_URL' to the app URL. The script intentionally requires the missing-configuration state; update the capture narrative and assertions only after real live evidence exists.\n`);
writeFileSync(`${imageDir}/README.md`, '# Original QWitness branding\n\nThe logo and cover were newly drawn as SVG in scripts/capture-assets.ts, based on the original shield and graphite/ivory/mint palette in this project. PNGs are rendered with sharp. No stock imagery, reused project assets, generated screenshots, or external fonts are used.\n\n- qwitness-logo.png: 512 × 512, square app logo.\n- qwitness-cover.png: 1200 × 675, 16:9 cover.\n- Matching SVG sources are included for editing.\n\nThe cover describes the product and receipt structure. It does not claim successful live execution, an audit, certification, or quantum-resistant Ethereum.\n');
console.log(JSON.stringify({ branding: [{ file: 'qwitness-logo.png', width: 512, height: 512 }, { file: 'qwitness-cover.png', width: 1200, height: 675 }], captures, requestsWhileOffline }, null, 2));
