import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { getGraphEvidence, calculateMarkets, GraphError } from '../src/core/graph';

// Read only this project's explicitly designated secret file; never print its contents.
if (existsSync('.env.local')) process.loadEnvFile('.env.local');
try {
  const startedAt = new Date().toISOString();
  const evidence = await getGraphEvidence();
  const result = { kind: 'live-graph-smoke', startedAt, finishedAt: new Date().toISOString(), evidence, calculations: calculateMarkets(evidence) };
  const serialized = JSON.stringify(result, null, 2);
  if (process.env.GRAPH_API_KEY && serialized.includes(process.env.GRAPH_API_KEY)) {
    throw new GraphError('GRAPH_SECRET', 'Provider output unexpectedly contained a credential; nothing was saved.');
  }
  const directory = resolve('submission/evidence');
  await mkdir(directory, { recursive: true });
  const filename = `graph-live-${startedAt.replace(/[:.]/g, '-')}.json`;
  await writeFile(resolve(directory, filename), `${serialized}\n`, { flag: 'wx' });
  console.log(JSON.stringify({ status: 'passed', mode: evidence.mode, block: evidence.block.number,
    deployment: evidence.deployment, observedAt: evidence.observedAt, file: `submission/evidence/${filename}` }));
} catch (error) {
  console.error(JSON.stringify({ status: 'failed', code: error instanceof GraphError ? error.code : 'SMOKE_FAILED',
    message: error instanceof GraphError ? error.message : 'Live smoke failed; check the local environment and output directory.' }));
  process.exitCode = 1;
}
