/** Minimal server-side reuse. Run with the project Graph and signer environment configured. */
import { createMarketReceipt } from '../src/core/service';
import { verifyReceipt } from '../src/core/receipt';
import { readFileSync } from 'node:fs';
const independentlyObtainedPin=JSON.parse(readFileSync('public/signer.json','utf8')).fingerprint as string;
const {receipt,delivery}=await createMarketReceipt();
console.log(JSON.stringify({delivery,verification:verifyReceipt(receipt,independentlyObtainedPin)},null,2));
