/** Server-only defense against an upstream response accidentally echoing credentials. */
export function assertNoServerSecrets(value: unknown): void {
 const serialized=JSON.stringify(value);
 for(const key of ['GRAPH_API_KEY','OPENAI_API_KEY','QWITNESS_SIGNING_SEED'] as const) {
  const secret=process.env[key];
  if(secret&&serialized.includes(secret))throw new Error('Upstream content contained protected server data; no receipt was issued.');
 }
}
