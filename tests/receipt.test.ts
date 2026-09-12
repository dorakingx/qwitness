import { describe, it, expect } from 'vitest';
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';
import { signReceipt, verifyReceipt, fingerprint, canonicalBytes, parseReceipt, base64, MAX_RECEIPT_BYTES } from '../src/core/receipt';
const keys = ml_dsa65.keygen();
const pin = fingerprint(keys.publicKey);
const payload = {issuedAt:'2026-09-12T23:50:00Z',question:'Compare markets',evidence:{observedAt:'2026-09-12T23:50:00Z',chainId:1,deployment:'test-deployment',block:{number:123,hash:'test'},queries:[{query:'test query',variables:{block:123}}],reserves:[{totalLiquidity:'123456789123456789123456789',symbol:'USDC'}]},analysis:{claims:[{text:'Observe liquidity'}]}};
const original = signReceipt(payload,keys.secretKey);
describe('ML-DSA-65 receipt integrity and independent trust',()=>{
 it('accepts original with pinned key and preserves big decimal strings',()=>{expect(verifyReceipt(original,pin).integrity).toBe('valid');expect(verifyReceipt(original,pin).signerTrust).toBe('matches pinned key');expect(parseReceipt(JSON.stringify(original)).payload).toEqual(payload);});
 it('does not trust an embedded key automatically',()=>expect(verifyReceipt(original).signerTrust).toBe('unknown'));
 it('detects an attacker signature even when mathematically valid',()=>{const attacker=ml_dsa65.keygen();const r=signReceipt(payload,attacker.secretKey);expect(verifyReceipt(r,pin)).toMatchObject({integrity:'valid',signerTrust:'mismatch'});});
 const modifications: [string,(r:typeof original)=>void][]=[
 ['number',r=>r.payload.evidence.reserves[0].totalLiquidity='123'],
 ['analysis',r=>r.payload.analysis.claims[0].text='Everything is safe'],
 ['chain',r=>r.payload.evidence.chainId=2],
 ['deployment',r=>r.payload.evidence.deployment='another'],
 ['query',r=>r.payload.evidence.queries[0].query='another query'],
 ['variables',r=>r.payload.evidence.queries[0].variables.block=124],
 ['block',r=>r.payload.evidence.block.number=124],
 ['timestamp',r=>r.payload.evidence.observedAt='2020-01-01T00:00:00Z'],
 ['fingerprint',r=>r.protected.signerFingerprint='sha384:'+'0'.repeat(96)],
 ['signature',r=>r.signature=base64(new Uint8Array(3309))],
 ];
 for(const [label,mutate] of modifications) it(`rejects changed ${label}`,()=>{const r=structuredClone(original);mutate(r);expect(verifyReceipt(r,pin).integrity).toBe('invalid');});
 it('canonicalizes key order Unicode and equivalent JSON numbers',()=>{expect(canonicalBytes({b:1.0,a:'日本語🪷'})).toEqual(canonicalBytes({a:'日本語🪷',b:1e0}));const reordered=JSON.parse(JSON.stringify(original));reordered.payload=Object.fromEntries(Object.entries(reordered.payload).reverse());expect(verifyReceipt(reordered,pin).integrity).toBe('valid');});
 it('does not normalize different Unicode sequences',()=>expect(canonicalBytes({a:'é'})).not.toEqual(canonicalBytes({a:'é'})));
 it.each(['{','null','[]','{"protected":{}}','x'.repeat(MAX_RECEIPT_BYTES+1)])('fails safely on malformed or oversized input',input=>expect(verifyReceipt(input).integrity).toBe('invalid'));
 it('rejects invalid base64, unknown version and unsigned envelope fields',()=>{for(const r of [{...original,signature:'!!!!'},{...original,protected:{...original.protected,schemaVersion:'2'}},{...original,extra:'unsigned'}])expect(verifyReceipt(r).integrity).toBe('invalid');});
 it('rejects unsafe numbers and invalid Unicode',()=>{expect(()=>canonicalBytes({n:9007199254740992})).toThrow();expect(()=>canonicalBytes({s:'\ud800'})).toThrow();expect(()=>canonicalBytes({n:NaN})).toThrow();});
 it('separates freshness and timestamps from validity',()=>{expect(verifyReceipt(original,pin,Date.parse('2026-09-12T23:55:00Z')).freshness).toBe('fresh');expect(verifyReceipt(original,pin,Date.parse('2026-09-13T23:55:00Z')).freshness).toBe('stale');expect(verifyReceipt(original,pin,Date.parse('2020-01-01T00:00:00Z')).freshness).toBe('unknown');});
 it('has no network dependency',()=>{const previous=globalThis.fetch;globalThis.fetch=()=>{throw new Error('Network disabled')};try{expect(verifyReceipt(original,pin).integrity).toBe('valid');}finally{globalThis.fetch=previous;}});
});
