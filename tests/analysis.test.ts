import { afterEach, describe, expect, it, vi } from 'vitest';
import { analyzeMarkets, validateAnalysis } from '../src/core/analysis';
import type { MarketCalculation } from '../src/core/graph';
const valid = { higherUtilization: 'USDC', monitoringFocus: ['availableLiquidity', 'indexedUpdates'], limitations: ['snapshotOnly'] };
const markets: MarketCalculation[] = ['USDC', 'DAI'].map((symbol, index) => ({ marketId: `test-${symbol}`, symbol: symbol as 'USDC' | 'DAI', underlyingAsset: 'test-address', decimals: index ? 18 : 6, totalLiquidity: '100', availableLiquidity: index ? '91.01' : '90.9', utilizedLiquidity: index ? '8.99' : '9.1', utilizationRatio: index ? '0.0899' : '0.091', utilizationPercent: index ? '8.99' : '9.1', providerUtilizationRatio: '0', formula: 'Test fixture', rounding: 'Test fixture', evidenceRefs: [] }));
function response(selection: unknown, extra: Record<string, unknown> = {}) {
  return Response.json({ model: 'test-model', choices: [{ finish_reason: 'stop', message: { content: JSON.stringify(selection) } }], ...extra });
}
afterEach(() => { vi.useRealTimers(); });
describe('bounded model selection and deterministic rendering', () => {
  it('accepts only supported enum choices with the independently checked ranking', () => {
    expect(validateAnalysis(valid, 'USDC')).toEqual(valid);
    expect(() => validateAnalysis(valid, 'DAI')).toThrow('contradicted');
  });
  it.each([
    { ...valid, claims: [{ text: 'USDC utilization is ９９％.', evidenceRefs: ['calculations/0'] }] },
    { ...valid, explanation: 'Supply is ninety per cent.' },
    { ...valid, monitoringFocus: ['inventedMarket'] },
    { ...valid, monitoringFocus: ['availableLiquidity', 'availableLiquidity'] },
    { ...valid, limitations: ['snapshotOnly', 'snapshotOnly'] },
    { ...valid, limitations: [] },
    { ...valid, higherUtilization: 'Everything is safe' },
    'not JSON', null,
  ])('rejects arbitrary prose, numeric additions, unknown enums and malformed output', (input) => {
    expect(() => validateAnalysis(input, 'USDC')).toThrow('allowed selection schema');
  });
  it('renders ranking itself and records the actual model selection as LLM mode', async () => {
    const fetcher = vi.fn().mockResolvedValue(response(valid)) as typeof fetch;
    const analysis = await analyzeMarkets(markets, { apiKey: 'test-api-key', fetcher });
    expect(analysis.mode).toBe('llm'); expect(analysis.model).toBe('test-model');
    expect(analysis.claims[0].text).toContain('USDC has higher');
    expect(analysis.claims[0].evidenceRefs).toEqual(['calculations/0', 'calculations/1']);
    expect(analysis.suggestedMonitoring).toHaveLength(2);
    expect(analysis.limitations).toContain('LLM-selected monitoring; comparison and wording rendered by deterministic policy.');
    expect(analysis.limitations.some((text) => text.startsWith('Indexed data can lag'))).toBe(true);
    expect(JSON.stringify(analysis)).not.toContain('test-api-key');
    const body = JSON.parse(vi.mocked(fetcher).mock.calls[0][1]!.body as string);
    expect(body.max_completion_tokens).toBe(700); expect(body.tools).toBeUndefined();
  });
  it('fails issuance if the model ranks the lower-utilization reserve higher', async () => {
    await expect(analyzeMarkets(markets, { apiKey: 'test-key', fetcher: vi.fn().mockResolvedValue(response({ ...valid, higherUtilization: 'DAI' })) as typeof fetch })).rejects.toThrow('contradicted');
  });
  it('handles equal values and reverse market ordering with exact decimal comparison', async () => {
    expect((await analyzeMarkets([...markets].reverse())).claims[0].text).toContain('USDC has higher');
    const tied = structuredClone(markets); tied[1].utilizationPercent = '9.100000';
    expect((await analyzeMarkets(tied)).claims[0].text).toContain('equal');
  });
  it('marks absent model credentials as a deterministic fallback without calling a model', async () => {
    const fetcher = vi.fn(); const analysis = await analyzeMarkets(markets, { fetcher });
    expect(analysis.mode).toBe('deterministic'); expect(analysis.model).toBeNull();
    expect(analysis.limitations[0]).toContain('no LLM was called'); expect(fetcher).not.toHaveBeenCalled();
  });
  it('rejects malformed numeric inputs instead of silently misranking them', async () => {
    for (const value of ['9.1234567', '101', '-1', 'NaN', '9e1']) {
      const changed = structuredClone(markets); changed[0].utilizationPercent = value;
      await expect(analyzeMarkets(changed)).rejects.toThrow('Analysis utilization');
    }
  });
  it('does not expose a fetch error containing a key', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('LLM leaked test-secret')) as typeof fetch;
    await expect(analyzeMarkets(markets, { apiKey: 'test-secret', fetcher })).rejects.toThrow('LLM output was unavailable or invalid; no receipt was issued.');
  });
  it('rejects oversized provider bodies and incomplete outputs', async () => {
    await expect(analyzeMarkets(markets, { apiKey: 'test-key', fetcher: vi.fn().mockResolvedValue(new Response('x'.repeat(24_001))) as typeof fetch })).rejects.toThrow('size limit');
    await expect(analyzeMarkets(markets, { apiKey: 'test-key', fetcher: vi.fn().mockResolvedValue(response(valid, { choices: [{ finish_reason: 'length', message: { content: '{}' } }] })) as typeof fetch })).rejects.toThrow('incomplete');
  });
  it('enforces an overall deadline even when a fetcher ignores its AbortSignal', async () => {
    vi.useFakeTimers();
    const pending = analyzeMarkets(markets, { apiKey: 'test-key', fetcher: vi.fn(() => new Promise(() => {})) as typeof fetch });
    const check = expect(pending).rejects.toThrow('timed out after 15 seconds');
    await vi.advanceTimersByTimeAsync(15_000); await check;
  });
});
