/** Fixed, server-side Aave V3 adapter. No arbitrary URL or GraphQL forwarding. */
export const GRAPH_CONFIG = {
  provider: 'The Graph', protocol: 'Aave V3', chainId: 1,
  subgraphId: 'Cd2gEDVeqnjBn1hSeqFMitw8Q1iiyV9FYUZkLNRcL87g',
  endpoint: 'https://gateway.thegraph.com/api/subgraphs/id/Cd2gEDVeqnjBn1hSeqFMitw8Q1iiyV9FYUZkLNRcL87g',
  pool: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
  markets: [
    { symbol: 'USDC', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', decimals: 6 },
    { symbol: 'DAI', address: '0x6b175474e89094c44da98b954eedeac495271d0f', decimals: 18 },
  ],
  timeoutMs: 12_000, maxResponseBytes: 128 * 1024, maxRequests: 3,
} as const;
export const DEMO_QUESTION = 'Compare two lending markets using live onchain data. Which has higher utilization, and what should an analyst monitor next?';
export interface GraphReserve {
  id: string; underlyingAsset: string; symbol: 'USDC' | 'DAI'; decimals: 6 | 18;
  totalLiquidity: string; availableLiquidity: string; totalCurrentVariableDebt: string;
  totalPrincipalStableDebt: string; utilizationRate: string; lastUpdateTimestamp: number;
  pool: { id: string; pool: string };
}
export interface GraphBlock { number: number; hash: string | 'unknown'; timestamp: number | 'unknown' }
export interface GraphQueryRecord { query: string; variables: Record<string, unknown>; response: unknown }
export interface GraphEvidence {
  mode: 'live'; provider: 'The Graph'; protocol: 'Aave V3'; chainId: 1;
  subgraphId: string; deployment: string; observedAt: string; block: GraphBlock;
  queries: GraphQueryRecord[]; reserves: GraphReserve[]; limitations: string[];
}
export interface MarketCalculation {
  marketId: string; symbol: 'USDC' | 'DAI'; underlyingAsset: string; decimals: 6 | 18;
  totalLiquidity: string; availableLiquidity: string; utilizedLiquidity: string;
  utilizationRatio: string; utilizationPercent: string; providerUtilizationRatio: string;
  formula: string; rounding: string; evidenceRefs: string[];
}
export class GraphError extends Error {
  constructor(public readonly code: string, message: string) { super(message); this.name = 'GraphError'; }
}
const fail = (code: string, message: string): never => { throw new GraphError(code, message); };
const schemaError = (): never => fail('GRAPH_SCHEMA', 'The Graph response does not match the supported Aave V3 schema.');
const META_QUERY = 'query QWitnessMeta { _meta { deployment hasIndexingErrors block { number hash timestamp } } }';
const META_COMPAT_QUERY = 'query QWitnessMeta { _meta { deployment hasIndexingErrors block { number hash } } }';
const reserveQuery = (timestamp: boolean) => `query QWitnessMarkets($block: Int!, $assets: [Bytes!]!, $pool: Bytes!) {
  _meta(block: {number: $block}) { deployment hasIndexingErrors block { number hash${timestamp ? ' timestamp' : ''} } }
  reserves(first: 2, orderBy: id, orderDirection: asc, block: {number: $block}, where: {underlyingAsset_in: $assets, pool_: {pool: $pool}}) {
    id underlyingAsset symbol decimals totalLiquidity availableLiquidity totalCurrentVariableDebt
    totalPrincipalStableDebt utilizationRate lastUpdateTimestamp pool { id pool }
  }
}`;
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return schemaError();
  return value as Record<string, unknown>;
}
function integer(value: unknown): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) return schemaError();
  return value;
}
function string(value: unknown, max = 512): string {
  if (typeof value !== 'string' || !value || value.length > max) return schemaError();
  return value;
}
function amount(value: unknown): string {
  const result = string(value, 100);
  if (!/^(0|[1-9]\d*)$/.test(result)) return schemaError();
  return result;
}
function parseMeta(value: unknown): { deployment: string; block: GraphBlock } {
  const meta = record(value), block = record(meta.block);
  if (meta.hasIndexingErrors !== false) fail('GRAPH_INDEXING', 'The subgraph reports indexing errors or missing indexing status.');
  const deployment = string(meta.deployment, 128);
  if (!/^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z2-7]{20,100})$/.test(deployment)) return schemaError();
  const hash = block.hash == null ? 'unknown' : string(block.hash, 66);
  if (hash !== 'unknown' && !/^0x[0-9a-fA-F]{64}$/.test(hash)) return schemaError();
  return { deployment, block: { number: integer(block.number), hash,
    timestamp: block.timestamp == null ? 'unknown' : integer(block.timestamp) } };
}
function parseReserve(value: unknown): GraphReserve {
  const r = record(value), address = string(r.underlyingAsset, 42).toLowerCase();
  const market = GRAPH_CONFIG.markets.find((m) => m.address === address);
  if (!market || r.symbol !== market.symbol || r.decimals !== market.decimals) return schemaError();
  const pool = record(r.pool);
  if (typeof pool.pool !== 'string' || pool.pool.toLowerCase() !== GRAPH_CONFIG.pool) return schemaError();
  const utilizationRate = string(r.utilizationRate, 100);
  if (!/^(0|1)(\.\d{1,40})?$/.test(utilizationRate) || (utilizationRate.startsWith('1.') && /[1-9]/.test(utilizationRate.slice(2)))) return schemaError();
  const parsed: GraphReserve = { id: string(r.id), underlyingAsset: address,
    symbol: market.symbol, decimals: market.decimals, totalLiquidity: amount(r.totalLiquidity),
    availableLiquidity: amount(r.availableLiquidity), totalCurrentVariableDebt: amount(r.totalCurrentVariableDebt),
    totalPrincipalStableDebt: amount(r.totalPrincipalStableDebt), utilizationRate,
    lastUpdateTimestamp: integer(r.lastUpdateTimestamp), pool: { id: string(pool.id), pool: pool.pool.toLowerCase() } };
  if (BigInt(parsed.availableLiquidity) > BigInt(parsed.totalLiquidity)) fail('GRAPH_UNITS', 'Available liquidity exceeds total liquidity in the indexed reserve snapshot.');
  return parsed;
}
function parseReserves(value: unknown): GraphReserve[] {
  if (!Array.isArray(value) || value.length !== 2) return fail('GRAPH_EMPTY', 'Both supported Aave V3 reserves were not returned. No receipt was created.');
  const reserves = value.map(parseReserve);
  if (new Set(reserves.map((r) => r.underlyingAsset)).size !== 2 || new Set(reserves.map((r) => r.id)).size !== 2) return schemaError();
  return GRAPH_CONFIG.markets.map((m) => reserves.find((r) => r.underlyingAsset === m.address)!);
}
async function boundedJson(response: Response): Promise<unknown> {
  const size = response.headers.get('content-length');
  if (size && Number(size) > GRAPH_CONFIG.maxResponseBytes) fail('GRAPH_SIZE', 'The Graph response exceeded the response size limit.');
  if (!response.body) return schemaError();
  const reader = response.body.getReader(), chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > GRAPH_CONFIG.maxResponseBytes) { await reader.cancel(); fail('GRAPH_SIZE', 'The Graph response exceeded the response size limit.'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(total); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); } catch { return schemaError(); }
}
/** Two requests normally; one schema-compatibility retry if _Block_.timestamp is unsupported. */
export async function getGraphEvidence(apiKey?: string, fetcher: typeof fetch = fetch): Promise<GraphEvidence> {
  const key = apiKey ?? (typeof process !== 'undefined' ? process.env.GRAPH_API_KEY : undefined);
  if (!key?.trim()) return fail('GRAPH_KEY_MISSING', 'Set GRAPH_API_KEY on the server to query live evidence.');
  if (!/^[A-Za-z0-9_-]{8,256}$/.test(key)) fail('GRAPH_KEY_INVALID', 'GRAPH_API_KEY has an invalid format.');
  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout>;
  const expiry = new Promise<never>((_, reject) => { timeout = setTimeout(() => {
    controller.abort(); reject(new GraphError('GRAPH_TIMEOUT', 'The Graph request timed out after 12 seconds.'));
  }, GRAPH_CONFIG.timeoutMs); });
  const query = async (queryText: string, variables: Record<string, unknown>) => {
    let response: Response;
    try { response = await fetcher(GRAPH_CONFIG.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }, body: JSON.stringify({ query: queryText, variables }), signal: controller.signal, redirect: 'error', cache: 'no-store' }); }
    catch { return fail('GRAPH_NETWORK', 'The Graph request failed. Check server connectivity and provider configuration.'); }
    if (!response.ok) return fail('GRAPH_HTTP', `The Graph returned HTTP ${response.status}. Check provider access and quota.`);
    const result = record(await boundedJson(response));
    // Classify known authentication failures without exposing untrusted provider text.
    if (Array.isArray(result.errors) && result.errors.some((error: unknown) => {
      const message = error && typeof error === 'object' ? (error as Record<string, unknown>).message : null;
      return typeof message === 'string' && /^auth error: API key not found$/i.test(message.trim());
    })) fail('GRAPH_AUTH', 'The Graph did not recognize the configured API key. Check its activation or replace it in server secrets.');
    return result;
  };
  const work = async (): Promise<GraphEvidence> => {
    const queries: GraphQueryRecord[] = [];
    let withTimestamp = true, metaQuery = META_QUERY;
    let metaResponse = await query(metaQuery, {});
    if (Array.isArray(metaResponse.errors) && metaResponse.errors.some((e: unknown) => {
      const message = e && typeof e === 'object' ? (e as Record<string, unknown>).message : null;
      return typeof message === 'string' && /Cannot query field ["']timestamp["'] on type ["']_Block_?["']/.test(message);
    })) { withTimestamp = false; metaQuery = META_COMPAT_QUERY; metaResponse = await query(metaQuery, {}); }
    if (metaResponse.errors) fail('GRAPH_QUERY', 'The Graph rejected the supported metadata query.');
    const first = parseMeta(record(metaResponse.data)._meta);
    queries.push({ query: metaQuery, variables: {}, response: metaResponse });
    const variables = { block: first.block.number, assets: GRAPH_CONFIG.markets.map((m) => m.address), pool: GRAPH_CONFIG.pool };
    const queryText = reserveQuery(withTimestamp), response = await query(queryText, variables);
    if (response.errors) fail('GRAPH_QUERY', 'The Graph rejected the supported reserve query.');
    const data = record(response.data), final = parseMeta(data._meta);
    // A number-pinned _meta response can omit hash/timestamp. Missing optional
    // metadata is not a conflicting value; keep it unknown in the final evidence.
    const hashConflict = first.block.hash !== 'unknown' && final.block.hash !== 'unknown' && first.block.hash !== final.block.hash;
    const timeConflict = first.block.timestamp !== 'unknown' && final.block.timestamp !== 'unknown' && first.block.timestamp !== final.block.timestamp;
    if (first.deployment !== final.deployment || first.block.number !== final.block.number || hashConflict || timeConflict) fail('GRAPH_METADATA', 'The Graph deployment or pinned block changed between requests. Retry to obtain a consistent snapshot.');
    const reserves = parseReserves(data.reserves);
    if (final.block.timestamp !== 'unknown' && reserves.some((r) => r.lastUpdateTimestamp > (final.block.timestamp as number))) return schemaError();
    queries.push({ query: queryText, variables, response });
    return { mode: 'live', provider: 'The Graph', protocol: 'Aave V3', chainId: 1,
      subgraphId: GRAPH_CONFIG.subgraphId, deployment: final.deployment, observedAt: new Date().toISOString(), block: final.block, queries, reserves,
      limitations: ['Indexed reserve snapshots reflect indexed events, not continuously accrued balances at query time.', 'Utilization follows the Aave subgraph mapping: 1 − availableLiquidity / totalLiquidity, truncated to 8 decimal places; totalLiquidity is a token amount, not USD TVL.', 'Provider honesty, indexing accuracy, and current Ethereum state are not independently proven.', ...(final.block.timestamp === 'unknown' ? ['Block timestamp is unavailable from the provider.'] : [])] };
  };
  try { return await Promise.race([work(), expiry]); }
  catch (error) { if (error instanceof GraphError) throw error; return fail('GRAPH_RESPONSE', 'The Graph returned an unreadable or unsupported response.'); }
  finally { clearTimeout(timeout!); controller.abort(); }
}
function decimal(units: bigint, decimals: number): string {
  if (!decimals) return units.toString();
  const padded = units.toString().padStart(decimals + 1, '0');
  return `${padded.slice(0, -decimals)}.${padded.slice(-decimals)}`.replace(/\.?0+$/, '');
}
/** Exactly reproduces the Aave mapping's 8-place truncation, using integers only. */
export function calculateMarkets(input: GraphEvidence | GraphReserve[]): MarketCalculation[] {
  const reserves = parseReserves(Array.isArray(input) ? input : input.reserves);
  return reserves.map((r, index) => {
    const total = BigInt(r.totalLiquidity), available = BigInt(r.availableLiquidity), utilized = total - available;
    const ratio = total === 0n ? 0n : utilized * 100_000_000n / total;
    return { marketId: r.id, symbol: r.symbol, underlyingAsset: r.underlyingAsset, decimals: r.decimals,
      totalLiquidity: decimal(total, r.decimals), availableLiquidity: decimal(available, r.decimals), utilizedLiquidity: decimal(utilized, r.decimals),
      utilizationRatio: decimal(ratio, 8), utilizationPercent: decimal(ratio * 100n, 8), providerUtilizationRatio: r.utilizationRate,
      formula: 'totalLiquidity == 0 ? 0 : (totalLiquidity - availableLiquidity) / totalLiquidity',
      rounding: 'Truncate utilization ratio toward zero to 8 decimal places, matching Aave subgraph mapping.',
      evidenceRefs: [`reserves[${index}].totalLiquidity`, `reserves[${index}].availableLiquidity`, `reserves[${index}].decimals`] };
  });
}
