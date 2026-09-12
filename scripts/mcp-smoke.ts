import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { mkdirSync,writeFileSync,readFileSync } from 'node:fs';
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';
import { signReceipt, fingerprint } from '../src/core/receipt';
const client=new Client({name:'qwitness-smoke-client',version:'0.1.0'});
const transport=new StdioClientTransport({command:process.execPath,args:['--env-file-if-exists=.env.local','--env-file-if-exists=.secrets/signing.env','--import','tsx','mcp/server.ts'],cwd:process.cwd(),stderr:'pipe',maxBufferSize:512*1024});
const records:unknown[]=[];
try {
 await client.connect(transport);
 records.push({method:'tools/list',result:await client.listTools()});
 const caps=await client.callTool({name:'get_capabilities',arguments:{}});records.push({name:'get_capabilities',result:caps});
 const fixtureKeys=ml_dsa65.keygen();
 const testReceipt=signReceipt({purpose:'TEST ONLY: MCP verification transport smoke. No live Graph data.',evidence:{observedAt:new Date().toISOString()}},fixtureKeys.secretKey);
 records.push({name:'verify_receipt',inputKind:'explicit test-only receipt',result:await client.callTool({name:'verify_receipt',arguments:{receipt:JSON.stringify(testReceipt),trustedFingerprint:fingerprint(fixtureKeys.publicKey)}})});
 const live=await client.callTool({name:'create_market_receipt',arguments:{}});
 records.push({name:'create_market_receipt',result:live});
 const text=(live.content as {type:string;text?:string}[]).find(c=>c.type==='text')?.text;
 if(!live.isError&&text){const parsed=JSON.parse(text);mkdirSync('submission/evidence',{recursive:true});writeFileSync('submission/evidence/live-receipt.json',JSON.stringify(parsed.receipt,null,2));const signer=JSON.parse(readFileSync('public/signer.json','utf8'));records.push({name:'verify_receipt',inputKind:'actual live receipt with separately loaded public/signer.json pin',result:await client.callTool({name:'verify_receipt',arguments:{receipt:JSON.stringify(parsed.receipt),trustedFingerprint:signer.fingerprint}})});}
 mkdirSync('submission/evidence',{recursive:true});
 const report={checkedAt:new Date().toISOString(),client:'@modelcontextprotocol/sdk stdio Client',records};
 const serialized=JSON.stringify(report,null,2);
 for(const secret of [process.env.GRAPH_API_KEY,process.env.OPENAI_API_KEY,process.env.QWITNESS_SIGNING_SEED])if(secret&&serialized.includes(secret))throw new Error('Secret scan failed; evidence not written');
 writeFileSync('submission/evidence/mcp-smoke.json',serialized+'\n');
 console.log(JSON.stringify({toolsListed:true,offlineToolCalled:true,liveIssuance:live.isError?'FAILED (see sanitized evidence)':'succeeded',evidence:'submission/evidence/mcp-smoke.json'}));
}finally{await client.close();}
