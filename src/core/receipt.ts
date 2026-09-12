import canonicalize from 'canonicalize';
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';
import { sha384 } from '@noble/hashes/sha2.js';

export const MAX_RECEIPT_BYTES = 256 * 1024;
export const DOMAIN = 'QWitness/receipt/v1';
export const SECURITY_STATEMENT = 'This receipt verifies the signed content against a specified public key. It does not prove that the data provider is honest, that the AI analysis is correct, or that Ethereum itself is quantum-resistant.';
export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
export type Receipt<T extends object = Record<string, Json>> = {
  protected: { schemaVersion: '1'; domain: typeof DOMAIN; algorithm: 'ML-DSA-65'; signerFingerprint: string };
  payload: T;
  publicKey: string;
  signature: string;
};
export type Verification = {
  integrity: 'valid' | 'invalid';
  signerTrust: 'matches pinned key' | 'unknown' | 'mismatch';
  freshness: 'fresh' | 'stale' | 'unknown';
  observedAt: string | null;
  fingerprint: string | null;
  reason: string;
};

export function base64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
export function unbase64(text: string, length?: number): Uint8Array {
  if (typeof text !== 'string' || text.length > 16000 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(text)) throw new Error('Invalid base64');
  const out = Uint8Array.from(atob(text), c => c.charCodeAt(0));
  if (base64(out) !== text || (length !== undefined && out.length !== length)) throw new Error('Invalid encoding or key length');
  return out;
}
export function fingerprint(publicKey: Uint8Array): string {
  return 'sha384:' + Array.from(sha384(publicKey), x => x.toString(16).padStart(2, '0')).join('');
}
function validJson(value: unknown, depth = 0): void {
  if (depth > 24) throw new Error('JSON is nested too deeply');
  if (value === null || typeof value === 'boolean') return;
  if (typeof value === 'string') {
    if (/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(value)) throw new Error('Invalid Unicode');
    return;
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || (Number.isInteger(value) && !Number.isSafeInteger(value))) throw new Error('Unsafe JSON number; use a decimal string');
    return;
  }
  if (typeof value !== 'object' || (Object.getPrototypeOf(value) !== Object.prototype && !Array.isArray(value))) throw new Error('Not a JSON value');
  for (const [key, child] of Object.entries(value)) { validJson(key, depth + 1); validJson(child, depth + 1); }
}
export function canonicalBytes(value: unknown): Uint8Array {
  validJson(value);
  const serialized = canonicalize(value);
  if (!serialized) throw new Error('Empty canonical value');
  const bytes = new TextEncoder().encode(serialized);
  if (bytes.length > MAX_RECEIPT_BYTES) throw new Error('Receipt exceeds 256 KiB');
  return bytes;
}
export function signReceipt<T extends object>(payload: T, secretKey: Uint8Array): Receipt<T> {
  const publicKey = ml_dsa65.getPublicKey(secretKey);
  const protectedHeader: Receipt['protected'] = { schemaVersion: '1', domain: DOMAIN, algorithm: 'ML-DSA-65', signerFingerprint: fingerprint(publicKey) };
  const signed = { protected: protectedHeader, payload };
  const signature = ml_dsa65.sign(canonicalBytes(signed), secretKey, { context: new TextEncoder().encode(DOMAIN) });
  const receipt = { ...signed, publicKey: base64(publicKey), signature: base64(signature) };
  canonicalBytes(receipt);
  return receipt;
}
export function parseReceipt(text: string): Receipt {
  if (new TextEncoder().encode(text).length > MAX_RECEIPT_BYTES) throw new Error('Receipt exceeds 256 KiB');
  const value: unknown = JSON.parse(text);
  canonicalBytes(value);
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Receipt must be an object');
  const r = value as Receipt;
  if (Object.keys(r).sort().join(',') !== 'payload,protected,publicKey,signature') throw new Error('Unexpected receipt envelope');
  const h = r.protected;
  if (!h || Object.keys(h).sort().join(',') !== 'algorithm,domain,schemaVersion,signerFingerprint' || h.schemaVersion !== '1' || h.domain !== DOMAIN || h.algorithm !== 'ML-DSA-65') throw new Error('Unsupported receipt header');
  if (!r.payload || typeof r.payload !== 'object' || Array.isArray(r.payload)) throw new Error('Invalid payload');
  unbase64(r.publicKey, ml_dsa65.lengths.publicKey);
  unbase64(r.signature, ml_dsa65.lengths.signature);
  if (typeof h.signerFingerprint !== 'string' || !/^sha384:[0-9a-f]{96}$/.test(h.signerFingerprint)) throw new Error('Invalid fingerprint');
  return r;
}
export function verifyReceipt(input: unknown, trustedFingerprint?: string, now = Date.now()): Verification {
  const result: Verification = {integrity:'invalid', signerTrust:'unknown', freshness:'unknown', observedAt:null, fingerprint:null, reason:'Invalid receipt'};
  try {
    if (trustedFingerprint && !/^sha384:[0-9a-f]{96}$/.test(trustedFingerprint)) throw new Error('Pinned fingerprint must be sha384 followed by 96 lowercase hexadecimal digits');
    const receipt = parseReceipt(typeof input === 'string' ? input : JSON.stringify(input));
    const pk = unbase64(receipt.publicKey, ml_dsa65.lengths.publicKey);
    result.fingerprint = fingerprint(pk);
    result.signerTrust = trustedFingerprint ? (result.fingerprint === trustedFingerprint ? 'matches pinned key' : 'mismatch') : 'unknown';
    if (receipt.protected.signerFingerprint !== result.fingerprint) throw new Error('Signer metadata does not match public key');
    const valid = ml_dsa65.verify(unbase64(receipt.signature), canonicalBytes({protected:receipt.protected,payload:receipt.payload}), pk, {context:new TextEncoder().encode(DOMAIN)});
    if (!valid) throw new Error('Signed content or signature has changed');
    result.integrity = 'valid';
    const evidence = receipt.payload.evidence as Record<string, Json> | undefined;
    const observed = evidence?.observedAt;
    if (typeof observed === 'string' && /^\d{4}-\d{2}-\d{2}T.*Z$/.test(observed) && Number.isFinite(Date.parse(observed))) {
      result.observedAt = observed;
      const age = now - Date.parse(observed);
      result.freshness = age < -60000 ? 'unknown' : age > 15 * 60 * 1000 ? 'stale' : 'fresh';
    }
    result.reason = result.signerTrust === 'matches pinned key' ? 'Signature valid; signer matches the independently supplied pin.' : result.signerTrust === 'mismatch' ? 'Signature valid, but this is not the pinned signer.' : 'Signature valid; no independent signer pin was supplied.';
  } catch (error) { result.reason = error instanceof Error ? error.message : 'Invalid receipt'; }
  return result;
}
