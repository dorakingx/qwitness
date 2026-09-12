import { GraphError } from '@/core/graph';
import { createMarketReceipt } from '@/core/service';
export const runtime='nodejs';
export const maxDuration=45;
export async function POST(request:Request){
 try{
  const origin=request.headers.get('origin');
  if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'Cross-origin issuance is not allowed'},{status:403});
  if(!request.headers.get('content-type')?.startsWith('application/json'))return Response.json({error:'Expected application/json'},{status:415});
  if(Number(request.headers.get('content-length'))>1024)return Response.json({error:'Request too large'},{status:413});
  const reader=request.body?.getReader();if(!reader)throw new Error('Empty request');
  const parts:Uint8Array[]=[];let total=0;
  while(true){const {done,value}=await reader.read();if(done)break;total+=value.length;if(total>1024){await reader.cancel();return Response.json({error:'Request too large'},{status:413});}parts.push(value);}
  const bytes=new Uint8Array(total);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length;}
  const body=JSON.parse(new TextDecoder().decode(bytes));
  if(!body||typeof body!=='object'||Array.isArray(body)||Object.keys(body).some(key=>key!=='question')||(body.question!==undefined&&typeof body.question!=='string'))throw new Error('Invalid request; only the fixed question is accepted');
  return Response.json(await createMarketReceipt(body.question),{headers:{'Cache-Control':'no-store'}});
 }catch(error){
  const message=error instanceof Error?error.message:'Receipt creation failed';
  const safe=error instanceof GraphError ? message : /^(Live receipt unavailable|Only the published|Execution limit|Graph |LLM |Analysis |Signing key|Invalid request|Empty request)/.test(message)?message:'Receipt creation failed; no receipt was issued.';
  return Response.json({error:safe},{status:safe.startsWith('Execution limit')?429:safe.startsWith('Invalid request')||safe.startsWith('Only the published')?400:503,headers:{'Cache-Control':'no-store'}});
 }
}
