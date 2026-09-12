import { statSync, readFileSync } from 'node:fs';
import { verifyReceipt, MAX_RECEIPT_BYTES } from '../src/core/receipt';
const [path, pin] = process.argv.slice(2);
if (!path) { console.error('Usage: npm run verify -- receipt.json [sha384:trusted-fingerprint]'); process.exit(2); }
try {
  if (statSync(path).size > MAX_RECEIPT_BYTES) throw new Error('Receipt exceeds 256 KiB');
  const result = verifyReceipt(readFileSync(path,'utf8'),pin);
  console.log(JSON.stringify(result,null,2));
  process.exitCode = result.integrity === 'valid' && (!pin || result.signerTrust === 'matches pinned key') ? 0 : 1;
} catch (error) { console.error(error instanceof Error ? error.message : 'Invalid input'); process.exitCode=2; }
