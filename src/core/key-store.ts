import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';
import { unbase64 } from './receipt';
export function getSigner() {
  const seed = process.env.QWITNESS_SIGNING_SEED;
  if (!seed) throw new Error('Signing key is not configured. Run npm run keygen and configure the server secret.');
  return ml_dsa65.keygen(unbase64(seed, 32));
}
