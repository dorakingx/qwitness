'use client';

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';
import { MAX_RECEIPT_BYTES, parseReceipt, SECURITY_STATEMENT, signReceipt, verifyReceipt, type Receipt, type Verification } from '@/core/receipt';

type View = 'explore' | 'receipt' | 'verify';
type Capabilities = { ready: boolean; graphConfigured: boolean; signingConfigured: boolean; analysisMode: 'llm' | 'deterministic'; fingerprint: string | null; question: string };
type Calculation = { marketId: string; symbol: string; underlyingAsset: string; decimals: number; totalLiquidity: string; availableLiquidity: string; utilizedLiquidity: string; utilizationRatio: string; utilizationPercent: string; formula: string; rounding: string; evidenceRefs: string[] };
type Claim = { text: string; evidenceRefs: string[] };
type MarketPayload = {
  question: string; issuedAt: string; policyVersion: string;
  evidence: { provider: string; protocol: string; chainId: number; subgraphId: string; deployment: string; observedAt: string; block: { number: number | string | null; hash: string | null; timestamp: number | string | null }; queries: { query: string; variables: unknown; response: unknown }[]; reserves: unknown[]; limitations: string[] };
  calculations: Calculation[];
  analysis: { mode: 'llm' | 'deterministic'; model: string | null; claims: Claim[]; limitations: string[]; suggestedMonitoring: Claim[] };
  limitations: string[];
};
type Result = { receipt: Receipt<MarketPayload>; delivery: { mode: 'live' | 'cached'; servedAt: string; cacheAgeSeconds: number }; verification: Verification };
const QUESTION = 'Compare two lending markets using live onchain data. Which has higher utilization, and what should an analyst monitor next?';

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h16m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function Shield({ size = 22 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m16 3 11 4v9c0 6-11 13-11 13S5 22 5 16V7l11-4Z" stroke="currentColor" strokeWidth="1.5" /><path d="m11 16 3.5 3.5L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function time(value: string | null | undefined) {
  if (!value || !Number.isFinite(Date.parse(value))) return 'Unknown';
  return new Date(value).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' }) + ' UTC';
}
function saveJson(value: unknown, name: string) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function openEvidence(id: string) {
  const target = document.getElementById(id);
  if (target instanceof HTMLDetailsElement) target.open = true;
}
function EvidenceLinks({ refs, calculations }: { refs: string[]; calculations: Calculation[] }) {
  return <span className="evidence-links">{refs.map(ref => {
    const match = /^calculations\/(\d+)$/.exec(ref);
    const calculation = match ? calculations[Number(match[1])] : undefined;
    const id = calculation ? 'evidence-' + calculation.symbol : 'source-query';
    return <a key={ref} href={'#' + id} onClick={() => openEvidence(id)}>{ref} <Arrow diagonal /></a>;
  })}</span>;
}
function VerificationCards({ result }: { result: Verification | null }) {
  const statuses = [
    { label: 'Signature integrity', value: result?.integrity ?? 'Not checked', good: result?.integrity === 'valid', bad: result?.integrity === 'invalid', detail: 'Has the signed content changed?' },
    { label: 'Signer trust', value: result?.signerTrust ?? 'No key pinned', good: result?.signerTrust === 'matches pinned key', bad: result?.signerTrust === 'mismatch', detail: 'Does it match your independent pin?' },
    { label: 'Data freshness', value: result?.freshness ?? 'Not checked', good: result?.freshness === 'fresh', bad: false, detail: result?.observedAt ? time(result.observedAt) : 'Based on the signed observation time' },
  ];
  return <div className="verification-cards">{statuses.map((status, i) => <div className="verification-card" key={status.label}><span className="micro">0{i + 1} / {status.label}</span><div className={'check-value ' + (status.bad ? 'bad' : status.good ? 'good' : '')}><span className="status-dot" />{status.value}</div><p>{status.detail}</p></div>)}</div>;
}

export function QWitness({ defaultView = 'explore' }: { defaultView?: View }) {
  const [view, setView] = useState<View>(defaultView);
  const [capabilities, setCapabilities] = useState<Capabilities | null>(null);
  const [configError, setConfigError] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [pin, setPin] = useState('');
  const [editor, setEditor] = useState('');
  const [original, setOriginal] = useState('');
  const [verification, setVerification] = useState<Verification | null>(null);
  const [labStatus, setLabStatus] = useState('Original receipt');
  const [importError, setImportError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const receipt = result?.receipt;

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/capabilities', { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error('Service configuration could not be loaded. You can still verify an existing receipt.');
      setCapabilities(await response.json());
    }).catch(cause => { if (cause.name !== 'AbortError') setConfigError(cause.message); });
    return () => controller.abort();
  }, []);

  async function createReceipt() {
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/receipt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: capabilities?.question || QUESTION }), signal: AbortSignal.timeout(70000) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The provider could not complete this request. Please retry.');
      const next = data as Result;
      parseReceipt(JSON.stringify(next.receipt));
      setResult(next);
      const text = JSON.stringify(next.receipt, null, 2);
      setEditor(text); setOriginal(text); setLabStatus('Original receipt');
      setVerification(verifyReceipt(next.receipt, pin || undefined));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The request failed. Please retry.');
    } finally { setBusy(false); }
  }
  function verify(text = editor, key = pin) {
    const checked = verifyReceipt(text, key.trim() || undefined);
    setVerification(checked);
    return checked;
  }
  function importText(text: string) {
    setImportError('');
    if (new TextEncoder().encode(text).length > MAX_RECEIPT_BYTES) { setImportError('This file exceeds the 256 KiB receipt limit.'); return; }
    setOriginal(text); setEditor(text); setLabStatus('Imported receipt'); setVerification(null);
  }
  async function importFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_RECEIPT_BYTES) { setImportError('This file exceeds the 256 KiB receipt limit.'); return; }
    importText(await file.text()); event.target.value = '';
  }
  function tamper(kind: 'number' | 'analysis' | 'signer') {
    setImportError('');
    try {
      const copy = parseReceipt(original || editor);
      if (!original) setOriginal(editor);
      if (kind === 'number') {
        const calculations = copy.payload.calculations;
        if (!Array.isArray(calculations) || !calculations[0] || typeof calculations[0] !== 'object' || Array.isArray(calculations[0])) throw new Error('This receipt has no market calculation to edit.');
        calculations[0].utilizationPercent = calculations[0].utilizationPercent === '99.99' ? '0.01' : '99.99';
      } else if (kind === 'analysis') {
        const analysis = copy.payload.analysis;
        if (!analysis || typeof analysis !== 'object' || Array.isArray(analysis) || !Array.isArray(analysis.claims) || !analysis.claims[0] || typeof analysis.claims[0] !== 'object' || Array.isArray(analysis.claims[0])) throw new Error('This receipt has no analysis claim to edit.');
        analysis.claims[0].text = 'This claim was changed in the Tamper Lab.';
      }
      const edited = kind === 'signer' ? signReceipt(copy.payload, ml_dsa65.keygen().secretKey) : copy;
      const text = JSON.stringify(edited, null, 2);
      setEditor(text); setLabStatus(kind === 'number' ? 'Copy · changed utilization' : kind === 'analysis' ? 'Copy · changed analysis' : 'Copy · Test signer');
      verify(text);
    } catch (cause) { setImportError(cause instanceof Error ? cause.message : 'Could not edit this receipt.'); }
  }
  function pinSite() {
    if (!capabilities?.fingerprint) return;
    setPin(capabilities.fingerprint);
    if (editor) verify(editor, capabilities.fingerprint);
  }
  function showReceipt() { setView('receipt'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  const originalVerification = useMemo(() => receipt ? verifyReceipt(receipt, pin || undefined) : null, [receipt, pin]);
  const graphReady = capabilities?.graphConfigured;

  return <div className="site-shell">
    <a className="skip-link" href="#workspace">Skip to workspace</a>
    <header className="site-header">
      <a className="brand" href="/" aria-label="QWitness home"><span className="brand-mark"><Shield size={26} /></span>QWitness<span className="brand-period">.</span></a>
      <div className="header-caption">EVIDENCE, YOU CAN CARRY.</div>
      <span className="network"><span className="network-diamond">◇</span> Ethereum <span className="network-type">/ Mainnet data</span></span>
    </header>

    <main id="workspace">
      <section className="hero">
        <div><div className="eyebrow"><span /> THE ONCHAIN RESEARCH WORKSPACE</div><h1>Every answer.<br /><span>An evidence trail.</span></h1><p className="hero-description">Live lending data. Traceable analysis. A signed receipt<br className="desktop-break" /> you can take anywhere and verify independently.</p></div>
        <div className="hero-note"><Shield size={28} /><span>POST-QUANTUM RECEIPTS</span><p>ML-DSA-65 signatures.<br />Integrity you can check.</p><a href="#trust-boundary">Understand the trust boundary <Arrow diagonal /></a></div>
      </section>

      <div className="workspace-top"><div role="tablist" aria-label="Research workflow" className="tabs">{(['explore', 'receipt', 'verify'] as View[]).map((tab, index) => <button key={tab} id={`tab-${tab}`} ref={element => { tabs.current[index] = element; }} role="tab" aria-selected={view === tab} aria-controls={`panel-${tab}`} tabIndex={view === tab ? 0 : -1} className={view === tab ? 'tab active' : 'tab'} onClick={() => setView(tab)} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); const next = (index + (event.key === 'ArrowRight' ? 1 : 2)) % 3; setView((['explore', 'receipt', 'verify'] as View[])[next]); tabs.current[next]?.focus(); } }}><span>0{index + 1}</span>{tab[0].toUpperCase() + tab.slice(1)}{tab === 'receipt' && receipt && <i />}</button>)}</div><span className="workspace-meta">READ-ONLY <span> / </span> NO WALLET REQUIRED</span></div>

      {view === 'explore' && <section id="panel-explore" role="tabpanel" aria-labelledby="tab-explore" className="explore-grid">
        <div className="question-panel panel"><div className="panel-label"><span className="micro">01 / RESEARCH QUESTION</span><span className="small-tag">Lending</span></div><h2>Follow the utilization.</h2><p className="question-text">{capabilities?.question || QUESTION}</p><div className="scope-label micro">ONE PROTOCOL. TWO MARKETS.</div><div className="market-list">{['USDC', 'DAI'].map((symbol, index) => <div className="market-row" key={symbol}><span className={'coin coin-' + symbol.toLowerCase()}>{index === 0 ? '$' : '◈'}</span><div><strong>{symbol}</strong><span>Aave V3 · Ethereum</span></div><span className="market-check">✓</span></div>)}</div><div className="query-boundary"><span>Source</span><strong>The Graph / Aave V3</strong></div><button className="primary-button run-button" onClick={createReceipt} disabled={busy || !capabilities?.ready}>{busy ? <><span className="spinner" /> Fetching evidence & signing…</> : <>{receipt ? 'Run comparison again' : 'Generate evidence receipt'}<Arrow /></>}</button><p className="action-note">{busy ? 'Querying the provider, calculating utilization, then signing the result.' : 'A bounded query. No transactions. No wallet connection.'}</p>
          {configError && <div className="notice error" role="alert">{configError}<div><button className="text-button" onClick={() => window.location.reload()}>Reload configuration ↻</button></div></div>}
          {capabilities && !capabilities.ready && <div className="notice" role="status"><strong>Live research is not configured.</strong><p>{!graphReady ? 'The server needs a The Graph API key to query the configured Aave V3 subgraph.' : 'The server needs its dedicated signing key.'} Existing receipts can still be verified locally.</p><div className="configuration-actions"><button className="text-button" onClick={() => setView('verify')}>Open verifier <Arrow /></button><button className="text-button" onClick={() => window.location.reload()}>Reload configuration ↻</button></div></div>}
          {error && <div className="notice error" role="alert"><strong>Receipt not created</strong><p>{error}</p></div>}
        </div>

        <div className="evidence-panel panel"><div className="panel-label"><span className="micro">02 / SOURCE EVIDENCE</span><span className={'state-badge ' + (result ? 'live' : '')}><span />{busy ? 'Requesting' : result && error ? 'Previous receipt · retry failed' : result ? result.delivery.mode === 'live' ? 'Live query' : 'Cached receipt' : 'Awaiting query'}</span></div>
          {!receipt ? <div className="evidence-empty"><div className="evidence-illustration" aria-hidden="true"><div className="evidence-sheet sheet-back" /><div className="evidence-sheet sheet-front"><span className="sheet-icon">↗</span><span className="sheet-line long" /><span className="sheet-line" /><div className="sheet-chart"><i /><i /><i /><i /><i /><i /></div><span className="sheet-rule" /><span className="sheet-footer">SOURCE → RECEIPT</span></div><div className="sheet-seal"><Shield size={23} /></div></div><h3>{busy ? 'Building your evidence trail' : 'Start with the source.'}</h3><p>{busy ? 'The receipt will appear only after the provider responds and the server signs the evidence.' : 'Run the comparison to inspect real market data, its indexed block, and the exact query behind every claim.'}</p><div className="empty-pipeline"><span>Query</span><span>→</span><span>Analyze</span><span>→</span><span>Sign</span></div></div> : <div className="evidence-content"><div className="evidence-head"><h2>Capital in use.</h2><span>{receipt.payload.evidence.protocol}</span></div><div className="metric-grid">{receipt.payload.calculations.map(calculation => <a className="metric" href={'#evidence-' + calculation.symbol} onClick={() => openEvidence('evidence-' + calculation.symbol)} key={calculation.marketId}><span>{calculation.symbol} utilization <Arrow diagonal /></span><strong>{calculation.utilizationPercent}<small>%</small></strong><div className="metric-track"><i style={{ width: Math.max(0, Math.min(100, Number(calculation.utilizationPercent) || 0)) + '%' }} /></div><small>Inspect deterministic calculation</small></a>)}</div><div className="source-strip"><span>INDEXED BLOCK<strong>{receipt.payload.evidence.block.number ?? 'Unknown'}</strong></span><span>OBSERVED AT<strong>{time(receipt.payload.evidence.observedAt)}</strong></span></div><div className="analysis-heading"><span className="micro">ANALYSIS</span><span className="small-tag">{receipt.payload.analysis.mode === 'llm' ? 'LLM · ' + (receipt.payload.analysis.model || 'Model unspecified') : 'Deterministic · no LLM'}</span></div>{receipt.payload.analysis.claims.map((claim, index) => <div className="claim" key={index}><span>0{index + 1}</span><div><p>{claim.text}</p><EvidenceLinks refs={claim.evidenceRefs} calculations={receipt.payload.calculations} /></div></div>)}<div className="monitoring"><span className="micro">MONITOR NEXT</span>{receipt.payload.analysis.suggestedMonitoring.map((item, index) => <p key={index}>{item.text} <EvidenceLinks refs={item.evidenceRefs} calculations={receipt.payload.calculations} /></p>)}</div><button className="secondary-button" onClick={showReceipt}>Inspect signed receipt <Arrow /></button></div>}
        </div>
        {receipt && <div className="full-width"><EvidenceDetails receipt={receipt} /></div>}
      </section>}

      {view === 'receipt' && <section id="panel-receipt" role="tabpanel" aria-labelledby="tab-receipt" className="receipt-view"><div className="section-intro"><div><span className="micro">THE PORTABLE RECORD</span><h2>Take the evidence with you.</h2><p>The query, response, calculation, and analysis travel together in one signed JSON receipt.</p></div>{receipt && <button className="primary-button" onClick={() => saveJson(receipt, 'qwitness-receipt.json')}>Download original JSON <span aria-hidden="true">↓</span></button>}</div>{receipt ? <><VerificationCards result={originalVerification} /><div className="receipt-details panel"><div className="panel-label"><span className="micro">RECEIPT MANIFEST</span><span className="small-tag">Schema {receipt.protected.schemaVersion}</span></div><dl className="manifest"><div><dt>Algorithm</dt><dd>{receipt.protected.algorithm}</dd></div><div><dt>Issued at</dt><dd>{time(receipt.payload.issuedAt)}</dd></div><div><dt>Delivery</dt><dd>{result?.delivery.mode} · served {time(result?.delivery.servedAt)}{result?.delivery.mode === 'cached' ? ` · ${result.delivery.cacheAgeSeconds}s cache age` : ''}</dd></div><div><dt>Signer fingerprint</dt><dd className="fingerprint">{receipt.protected.signerFingerprint}</dd></div><div><dt>Signed content</dt><dd>Protected header + complete payload · canonical JSON · domain separated</dd></div></dl><div className="receipt-actions"><button className="secondary-button" onClick={() => { const text = JSON.stringify(receipt, null, 2); setEditor(text); setOriginal(text); setLabStatus('Original receipt'); setView('verify'); setVerification(verifyReceipt(text, pin || undefined)); }}>Verify & open Tamper Lab <Arrow /></button><a href="/offline-verifier.html" className="text-button">Standalone verifier <Arrow diagonal /></a></div></div><EvidenceDetails receipt={receipt} /><details className="raw-details"><summary>Inspect complete receipt JSON</summary><pre>{JSON.stringify(receipt, null, 2)}</pre></details></> : <EmptyReceipt onExplore={() => setView('explore')} onVerify={() => setView('verify')} />}</section>}

      {view === 'verify' && <section id="panel-verify" role="tabpanel" aria-labelledby="tab-verify" className="verify-view"><div className="section-intro"><div><span className="micro">INDEPENDENT VERIFICATION</span><h2>Check the signature. Then the signer.</h2><p>Verification runs in your browser. No receipt is uploaded and no provider call is needed.</p></div><a className="secondary-button" href="/offline-verifier.html">Standalone verifier <Arrow diagonal /></a></div><div className="verify-layout"><div className="panel verifier-input"><div className="panel-label"><label htmlFor="receipt-input" className="micro">01 / RECEIPT JSON</label><button className="text-button" onClick={() => fileInput.current?.click()}>Import file <span aria-hidden="true">↑</span></button><input ref={fileInput} type="file" accept=".json,application/json" className="visually-hidden" onChange={importFile} aria-label="Import receipt JSON file" /></div><textarea id="receipt-input" value={editor} spellCheck={false} placeholder="Paste a signed receipt, or import its JSON file." onChange={event => { setEditor(event.target.value); setVerification(null); setLabStatus('Edited input'); }} /><div className="editor-caption"><span>{labStatus}</span><span>256 KiB maximum</span></div><label className="pin-label" htmlFor="signer-pin">02 / INDEPENDENT SIGNER PIN <span>Optional</span></label><input id="signer-pin" className="pin-input" value={pin} onChange={event => { setPin(event.target.value); setVerification(null); }} placeholder="sha384:…" spellCheck={false} /><p className="field-help">Obtain the fingerprint from a source you trust, separately from the receipt. A valid signature alone does not establish signer trust.</p>{capabilities?.fingerprint && <button className="text-button site-pin" onClick={pinSite}>Pin this site’s signer <Arrow /></button>}<p className="pin-channel">This button trusts the key delivered by this site over HTTPS. Independently confirm it for stronger assurance.</p><button className="primary-button verify-button" disabled={!editor.trim()} onClick={() => verify()}>Verify receipt locally <Shield size={19} /></button>{importError && <p className="notice error" role="alert">{importError}</p>}</div><aside className="tamper-panel"><div className="micro">A CONTROLLED EXPERIMENT</div><h3>Tamper Lab<span>↗</span></h3><p>Keep the original. Change a copy.<br />See exactly what the signature protects.</p><button className="lab-action" disabled={!editor.trim()} onClick={() => tamper('number')}><span className="lab-number">01</span><span><strong>Change a number</strong><small>Edit the utilization value</small></span><Arrow /></button><button className="lab-action" disabled={!editor.trim()} onClick={() => tamper('analysis')}><span className="lab-number">02</span><span><strong>Rewrite a claim</strong><small>Edit the analysis text</small></span><Arrow /></button><button className="lab-action" disabled={!editor.trim()} onClick={() => tamper('signer')}><span className="lab-number">03</span><span><strong>Re-sign with a test key</strong><small>Valid signature, different signer</small></span><Arrow /></button><p className="lab-note">Each action verifies a fresh copy of the original. Test signer uses a new temporary browser key; your pin stays unchanged. This is not a quantum attack.</p>{original && <button className="text-button" onClick={() => { setEditor(original); setLabStatus('Original receipt restored'); setImportError(''); verify(original); }}>↶ Restore original receipt</button>}</aside></div><div className="verification-output" aria-live="polite"><VerificationCards result={verification} />{verification && <p className={'verification-reason ' + (verification.integrity === 'invalid' || verification.signerTrust === 'mismatch' ? 'bad' : '')}>{verification.reason}</p>}</div><p className="freshness-note">“Fresh” means the signed observation time is within 15 minutes. It is a signer assertion, not an independent proof of time or current chain state.</p></section>}

      {view === 'explore' && <section className="receipt-preview"><div className="receipt-preview-title"><span className="receipt-icon"><Shield size={25} /></span><div><h3>Your research, with a receipt.</h3><p>Source evidence and analysis, bound by an ML-DSA-65 signature.</p></div></div>{receipt ? <button className="text-button" onClick={showReceipt}>View receipt <Arrow /></button> : <span className="receipt-preview-empty">Generated after your first query</span>}</section>}
      <section className="trust-boundary" id="trust-boundary"><span className="micro">WHAT THE SIGNATURE MEANS</span><p>{SECURITY_STATEMENT}</p><details><summary>Research prototype · security limitations</summary><p>Post-quantum protection applies to this receipt signature. It does not upgrade Ethereum accounts, consensus, API transport, or funds. Signed misinformation is still possible. Issuance and observation times are signer claims, not trusted timestamps. Key distribution, protection, and rotation remain separate trust problems. This hackathon prototype has not been independently audited.</p></details></section>
    </main><footer className="site-footer"><span>QWitness <span className="footer-dot">·</span> Built by Doraking</span><span>The Graph <span>×</span> ML-DSA-65</span><span>ETHOnline 2026 <span className="footer-arrow">↗</span></span></footer>
  </div>;
}

function EvidenceDetails({ receipt }: { receipt: Receipt<MarketPayload> }) {
  const { evidence, calculations, analysis, limitations } = receipt.payload;
  return <div className="evidence-details"><details id="source-query" className="raw-details"><summary><span>Inspect source evidence</span><span className="micro">THE GRAPH / CHAIN {evidence.chainId}</span></summary><dl className="manifest"><div><dt>Subgraph</dt><dd className="fingerprint">{evidence.subgraphId}</dd></div><div><dt>Deployment</dt><dd className="fingerprint">{evidence.deployment || 'Unknown'}</dd></div><div><dt>Indexed block</dt><dd>{evidence.block.number ?? 'Unknown'}</dd></div><div><dt>Block hash</dt><dd className="fingerprint">{evidence.block.hash || 'Unknown'}</dd></div><div><dt>Block timestamp</dt><dd>{evidence.block.timestamp ?? 'Unknown'}</dd></div></dl>{evidence.queries.map((query, index) => <div key={index}><h4>Query {index + 1}</h4><pre>{query.query}</pre><h4>Variables</h4><pre>{JSON.stringify(query.variables, null, 2)}</pre><h4>Provider response</h4><pre>{JSON.stringify(query.response, null, 2)}</pre></div>)}<h4>Normalized reserves · calculation evidence references</h4><pre>{JSON.stringify(evidence.reserves, null, 2)}</pre></details>{calculations.map(calculation => <details className="raw-details" id={'evidence-' + calculation.symbol} key={calculation.marketId}><summary>{calculation.symbol} calculation <span className="micro">{calculation.utilizationPercent}% UTILIZATION</span></summary><dl className="manifest"><div><dt>Formula</dt><dd>{calculation.formula}</dd></div><div><dt>Total liquidity ({calculation.symbol})</dt><dd>{calculation.totalLiquidity}</dd></div><div><dt>Available liquidity ({calculation.symbol})</dt><dd>{calculation.availableLiquidity}</dd></div><div><dt>Utilized liquidity ({calculation.symbol})</dt><dd>{calculation.utilizedLiquidity}</dd></div><div><dt>Decimals</dt><dd>{calculation.decimals}</dd></div><div><dt>Rounding</dt><dd>{calculation.rounding}</dd></div><div><dt>Evidence references</dt><dd><a className="text-button" href="#source-query" onClick={() => openEvidence('source-query')}>{calculation.evidenceRefs.join(', ')} ↗</a></dd></div></dl></details>)}<details className="raw-details"><summary>Analysis & data limitations</summary><ul className="limitations-list">{[...new Set([...limitations, ...evidence.limitations, ...analysis.limitations])].map((item, index) => <li key={index}>{item}</li>)}</ul></details></div>;
}
function EmptyReceipt({ onExplore, onVerify }: { onExplore: () => void; onVerify: () => void }) {
  return <div className="empty-receipt panel"><Shield size={42} /><h3>No receipt yet.</h3><p>Generate a receipt from live data, or bring one you already have to the local verifier.</p><div><button className="primary-button" onClick={onExplore}>Explore markets <Arrow /></button><button className="secondary-button" onClick={onVerify}>Import a receipt</button></div></div>;
}
export default function Page() { return <QWitness />; }
