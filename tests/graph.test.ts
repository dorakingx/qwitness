import { afterEach, describe, expect, it, vi } from 'vitest';
import { calculateMarkets, getGraphEvidence, GRAPH_CONFIG, type GraphReserve } from '../src/core/graph';
const key = 'unit_test_key_12345';
const meta = { deployment: `Qm${'a'.repeat(44)}`, hasIndexingErrors: false, block: { number: 22000000, hash: `0x${'a'.repeat(64)}`, timestamp: 1750000000 } };
function reserves(): GraphReserve[] {
  return GRAPH_CONFIG.markets.map((m) => ({ id: `${m.address}-pool`, underlyingAsset: m.address, symbol: m.symbol, decimals: m.decimals,
    totalLiquidity: (100n * 10n ** BigInt(m.decimals)).toString(), availableLiquidity: (25n * 10n ** BigInt(m.decimals)).toString(),
    totalCurrentVariableDebt: (75n * 10n ** BigInt(m.decimals)).toString(), totalPrincipalStableDebt: '0', utilizationRate: '0.75',
    lastUpdateTimestamp: 1749999999, pool: { id: 'ethereum-v3', pool: GRAPH_CONFIG.pool } }));
}
function mockFetch(second: unknown = { data: { _meta: meta, reserves: reserves() } }): typeof fetch {
  return vi.fn().mockResolvedValueOnce(Response.json({ data: { _meta: meta } })).mockResolvedValueOnce(Response.json(second)) as unknown as typeof fetch;
}
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); });
describe('bounded Aave V3 provider', () => {
  it('records real requests and responses at one block without credentials', async () => {
    const fetcher = mockFetch(), evidence = await getGraphEvidence(key, fetcher);
    expect(evidence.mode).toBe('live'); expect(evidence.chainId).toBe(1);
    expect(evidence.queries).toHaveLength(2); expect(evidence.queries[1].variables.block).toBe(meta.block.number);
    expect(evidence.deployment).toBe(meta.deployment); expect(evidence.block.timestamp).toBe(meta.block.timestamp);
    expect(JSON.stringify(evidence)).not.toContain(key);
    expect(vi.mocked(fetcher).mock.calls[0][0]).toBe(GRAPH_CONFIG.endpoint);
    expect(vi.mocked(fetcher).mock.calls[0][1]?.redirect).toBe('error');
    expect(calculateMarkets(evidence).map((m) => m.utilizationPercent)).toEqual(['75', '75']);
  });
  it('requires an explicitly configured key', async () => {
    vi.stubEnv('GRAPH_API_KEY', ''); const fetcher = vi.fn();
    await expect(getGraphEvidence(undefined, fetcher)).rejects.toMatchObject({ code: 'GRAPH_KEY_MISSING' });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('fails on empty results', async () => {
    await expect(getGraphEvidence(key, mockFetch({ data: { _meta: meta, reserves: [] } }))).rejects.toMatchObject({ code: 'GRAPH_EMPTY' });
  });
  it.each(['deployment', 'number', 'hash', 'timestamp'])('rejects changed %s metadata between requests', async (field) => {
    const changed = structuredClone(meta);
    if (field === 'deployment') changed.deployment = `Qm${'b'.repeat(44)}`;
    if (field === 'number') changed.block.number++;
    if (field === 'timestamp') changed.block.timestamp++;
    if (field === 'hash') changed.block.hash = `0x${'b'.repeat(64)}`;
    await expect(getGraphEvidence(key, mockFetch({ data: { _meta: changed, reserves: reserves() } }))).rejects.toMatchObject({ code: 'GRAPH_METADATA' });
  });
  it('fails on indexing errors', async () => {
    await expect(getGraphEvidence(key, mockFetch({ data: { _meta: { ...meta, hasIndexingErrors: true }, reserves: reserves() } }))).rejects.toMatchObject({ code: 'GRAPH_INDEXING' });
  });
  it('does not leak provider error text or fetch exception credentials', async () => {
    await expect(getGraphEvidence(key, vi.fn().mockRejectedValue(new Error(`network ${key}`)) as typeof fetch)).rejects.toThrow('The Graph request failed.');
    await expect(getGraphEvidence(key, mockFetch({ errors: [{ message: key }] }))).rejects.toThrow('The Graph rejected the supported reserve query.');
  });
  it('rejects oversized bodies even without a content-length header', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('x'.repeat(GRAPH_CONFIG.maxResponseBytes + 1))) as typeof fetch;
    await expect(getGraphEvidence(key, fetcher)).rejects.toMatchObject({ code: 'GRAPH_SIZE' });
  });
  it('times out even when a fetcher does not honor abort', async () => {
    vi.useFakeTimers();
    const pending = getGraphEvidence(key, vi.fn(() => new Promise(() => {})) as typeof fetch);
    const check = expect(pending).rejects.toMatchObject({ code: 'GRAPH_TIMEOUT' });
    await vi.advanceTimersByTimeAsync(12_000); await check;
  });
  it('records an unknown timestamp if the provider lacks the optional field', async () => {
    const oldMeta = { ...meta, block: { number: meta.block.number, hash: meta.block.hash } };
    const fetcher = vi.fn().mockResolvedValueOnce(Response.json({ errors: [{ message: 'Cannot query field "timestamp" on type "_Block_".' }] }))
      .mockResolvedValueOnce(Response.json({ data: { _meta: oldMeta } }))
      .mockResolvedValueOnce(Response.json({ data: { _meta: oldMeta, reserves: reserves() } })) as typeof fetch;
    const evidence = await getGraphEvidence(key, fetcher);
    expect(evidence.block.timestamp).toBe('unknown'); expect(fetcher).toHaveBeenCalledTimes(3);
    expect(evidence.queries[1].query).not.toContain(' hash timestamp');
  });
});
describe('deterministic calculation and units', () => {
  it('normalizes different token units without converting through floating point', () => {
    const results = calculateMarkets(reserves());
    expect(results.map((r) => r.totalLiquidity)).toEqual(['100', '100']);
    expect(results.map((r) => r.availableLiquidity)).toEqual(['25', '25']);
    expect(results.map((r) => r.utilizedLiquidity)).toEqual(['75', '75']);
  });
  it('truncates repeating decimals exactly at eight places', () => {
    const inputs = reserves(); inputs[0].totalLiquidity = '3'; inputs[0].availableLiquidity = '1';
    const result = calculateMarkets(inputs)[0];
    expect(result.utilizationRatio).toBe('0.66666666'); expect(result.utilizationPercent).toBe('66.666666');
  });
  it('preserves integers far beyond Number.MAX_SAFE_INTEGER and subtoken precision', () => {
    const inputs = reserves(); inputs[1].totalLiquidity = '123456789012345678901234567890'; inputs[1].availableLiquidity = '1';
    expect(calculateMarkets(inputs)[1].totalLiquidity).toBe('123456789012.34567890123456789');
    expect(calculateMarkets(inputs)[1].availableLiquidity).toBe('0.000000000000000001');
  });
  it('handles zero denominator using the documented Aave mapping convention', () => {
    const inputs = reserves(); inputs[0].totalLiquidity = '0'; inputs[0].availableLiquidity = '0';
    expect(calculateMarkets(inputs)[0].utilizationRatio).toBe('0');
  });
  it.each(['decimals', 'underlyingAsset', 'symbol', 'totalLiquidity', 'pool'])('rejects schema/unit mismatch in %s', (field) => {
    const inputs = reserves(); const r = inputs[0] as unknown as Record<string, unknown>;
    if (field === 'decimals') r.decimals = 18;
    if (field === 'underlyingAsset') r.underlyingAsset = GRAPH_CONFIG.markets[1].address;
    if (field === 'symbol') r.symbol = 'DAI';
    if (field === 'totalLiquidity') r.totalLiquidity = '100.000001';
    if (field === 'pool') r.pool = { id: 'other', pool: GRAPH_CONFIG.markets[0].address };
    expect(() => calculateMarkets(inputs)).toThrow();
  });
  it('rejects cross-unit sized available liquidity exceeding total', () => {
    const inputs = reserves(); inputs[0].availableLiquidity = inputs[1].availableLiquidity;
    expect(() => calculateMarkets(inputs)).toThrow('Available liquidity exceeds total liquidity');
  });
  it('does not silently substitute total debt for the mapping numerator', () => {
    const inputs = reserves(); inputs[0].totalCurrentVariableDebt = '1';
    expect(calculateMarkets(inputs)[0].utilizationPercent).toBe('75');
  });
});
