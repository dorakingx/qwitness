/** Regression expectations found by independent review. Fixtures are not live evidence. */
import { describe, expect, it, vi } from 'vitest';
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';
import { analyzeMarkets, validateAnalysis } from '../src/core/analysis';
import type { MarketCalculation } from '../src/core/graph';
import { signReceipt, verifyReceipt, fingerprint } from '../src/core/receipt';
const markets: MarketCalculation[] = [
  { marketId: 'test-usdc', symbol: 'USDC', underlyingAsset: 'test-address', decimals: 6, totalLiquidity: '100', availableLiquidity: '90.9', utilizedLiquidity: '9.1', utilizationRatio: '0.091', utilizationPercent: '9.1', providerUtilizationRatio: '0.091', formula: 'Test fixture', rounding: 'Test fixture', evidenceRefs: [] },
  { marketId: 'test-dai', symbol: 'DAI', underlyingAsset: 'test-address', decimals: 18, totalLiquidity: '100', availableLiquidity: '91.01', utilizedLiquidity: '8.99', utilizationRatio: '0.0899', utilizationPercent: '8.99', providerUtilizationRatio: '0.0899', formula: 'Test fixture', rounding: 'Test fixture', evidenceRefs: [] },
];
describe('independent security review regressions', () => {
  it('compares utilization with unlike decimal lengths correctly', async () => {
    const analysis = await analyzeMarkets(markets);
    expect(analysis.claims[0].text).toContain('USDC has higher');
  });
  it.each(['USDC utilization is ９９％.', 'USDC utilization is ninety per cent.'])('rejects unsupported numeric typography: %s', (text) => {
    expect(() => validateAnalysis({ higherUtilization: "USDC", monitoringFocus: ["availableLiquidity"], limitations: ["snapshotOnly"], explanation: text }, "USDC")).toThrow();
  });
  it('does not return a model ranking that contradicts deterministic calculations', async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ model: 'test-model', choices: [{ finish_reason: 'stop', message: { content: JSON.stringify({ higherUtilization: 'DAI', monitoringFocus: ['availableLiquidity'], limitations: ['snapshotOnly'] }) } }] })) as typeof fetch;
    let result: Awaited<ReturnType<typeof analyzeMarkets>> | undefined;
    try { result = await analyzeMarkets(markets, { apiKey: 'test-model-key', fetcher }); } catch { return; }
    // Rejecting the output or substituting a deterministic ranking are both acceptable.
    expect(result.claims.every((c) => !c.text.startsWith('DAI has higher'))).toBe(true);
  });
  it('rejects duplicate JSON property names instead of silently choosing a signed last value', () => {
    const keys = ml_dsa65.keygen(), pin = fingerprint(keys.publicKey);
    const receipt = signReceipt({ question: 'Original claim' }, keys.secretKey);
    const ambiguous = JSON.stringify(receipt).replace('"question":"Original claim"', '"question":"Injected claim","question":"Original claim"');
    expect(verifyReceipt(ambiguous, pin).integrity).toBe('invalid');
  });
  it('rejects escaped duplicate names nested inside evidence arrays', () => {
    const keys = ml_dsa65.keygen(), pin = fingerprint(keys.publicKey);
    const receipt = signReceipt({ evidence: { reserves: [{ amount: '100' }] } }, keys.secretKey);
    const ambiguous = JSON.stringify(receipt).replace('"amount":"100"', '"amount":"999","amou\\u006et":"100"');
    expect(JSON.parse(ambiguous).payload.evidence.reserves[0].amount).toBe('100');
    expect(verifyReceipt(ambiguous, pin)).toMatchObject({ integrity: 'invalid', reason: 'Duplicate JSON object member' });
  });
  it('allows identical names in separate sibling objects and quoted JSON inside strings', () => {
    const keys = ml_dsa65.keygen(), pin = fingerprint(keys.publicKey);
    const receipt = signReceipt({ evidence: [{ amount: '100' }, { amount: '200' }], note: '"amount":"100","amount":"200"' }, keys.secretKey);
    expect(verifyReceipt(JSON.stringify(receipt), pin).integrity).toBe('valid');
  });
  it('binds the domain and algorithm metadata into receipt verification', () => {
    const keys = ml_dsa65.keygen(), pin = fingerprint(keys.publicKey);
    const receipt = signReceipt({ question: 'Original claim' }, keys.secretKey);
    for (const [field, value] of [['domain', 'OtherApp/receipt/v1'], ['algorithm', 'ML-DSA-44']]) {
      const edited = structuredClone(receipt);
      (edited.protected as unknown as Record<string, string>)[field] = value;
      expect(verifyReceipt(edited, pin).integrity).toBe('invalid');
    }
  });
});
