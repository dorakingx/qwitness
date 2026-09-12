import { getGraphEvidence, calculateMarkets, DEMO_QUESTION } from './graph';
import { analyzeMarkets } from './analysis';
import { signReceipt, verifyReceipt, fingerprint, SECURITY_STATEMENT } from './receipt';
import { getSigner } from './key-store';

export const LIMITS = { markets:2, graphRequestsPerReceipt:3, graphTimeoutSeconds:12, llmTimeoutSeconds:15, llmOutputTokens:700, cacheSeconds:60, executionsPerHourPerInstance:12, receiptBytes:262144 };
let cached: {receipt:Awaited<ReturnType<typeof generate>>;at:number}|undefined;
let running:Promise<Awaited<ReturnType<typeof generate>>>|undefined;
let started:number[]=[];
export function getCapabilities() {
 let pin:string|null=null;
 try{pin=fingerprint(getSigner().publicKey);}catch{}
 return {name:'QWitness',schemaVersion:'1',algorithm:'ML-DSA-65',ready:!!process.env.GRAPH_API_KEY&&!!pin,graphConfigured:!!process.env.GRAPH_API_KEY,signingConfigured:!!pin,analysisMode:process.env.OPENAI_API_KEY?'llm':'deterministic',fingerprint:pin,markets:['USDC','DAI'],question:DEMO_QUESTION,limits:LIMITS,securityStatement:SECURITY_STATEMENT};
}
async function generate() {
 const signer=getSigner();
 const evidence=await getGraphEvidence(process.env.GRAPH_API_KEY);
 const calculations=calculateMarkets(evidence);
 const analysis=await analyzeMarkets(calculations,{apiKey:process.env.OPENAI_API_KEY,model:process.env.OPENAI_MODEL});
 return signReceipt({question:DEMO_QUESTION,issuedAt:new Date().toISOString(),evidence,calculations,analysis,policyVersion:'qwitness-policy-1',limitations:[SECURITY_STATEMENT,'Research prototype. No independent security audit or certification.','issuedAt and observedAt are signer assertions, not trusted timestamps.','Key distribution, key compromise and JavaScript side channels are outside receipt integrity guarantees.',...evidence.limitations,...analysis.limitations]},signer.secretKey);
}
export async function createMarketReceipt(question=DEMO_QUESTION) {
 if(question!==DEMO_QUESTION)throw new Error('Only the published comparison question is supported');
 const now=Date.now();
 if(cached&&now-cached.at<LIMITS.cacheSeconds*1000) return deliver(cached.receipt,'cached',cached.at);
 if(running) return deliver(await running,'cached',Date.now());
 started=started.filter(at=>now-at<3600000);
 if(started.length>=LIMITS.executionsPerHourPerInstance)throw new Error('Execution limit reached. Try again after the hourly window.');
 if(!getCapabilities().ready)throw new Error('Live receipt unavailable: configure the Graph API key and stable signing key on the server.');
 started.push(now);
 running=generate();
 try{const receipt=await running;cached={receipt,at:Date.now()};return deliver(receipt,'live',cached.at);}finally{running=undefined;}
}
function deliver(receipt:Awaited<ReturnType<typeof generate>>, mode:'live'|'cached',at:number) {
 return {receipt,delivery:{mode,servedAt:new Date().toISOString(),cacheAgeSeconds:Math.max(0,Math.floor((Date.now()-at)/1000))},verification:verifyReceipt(receipt,getCapabilities().fingerprint||undefined)};
}
