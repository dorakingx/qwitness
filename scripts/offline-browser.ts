import { verifyReceipt, MAX_RECEIPT_BYTES } from '../src/core/receipt';
const input=document.querySelector<HTMLTextAreaElement>('#receipt')!;
const pin=document.querySelector<HTMLInputElement>('#pin')!;
const output=document.querySelector<HTMLElement>('#result')!;
const file=document.querySelector<HTMLInputElement>('#file')!;
file.addEventListener('change',async()=>{const selected=file.files?.[0];if(!selected)return;if(selected.size>MAX_RECEIPT_BYTES){output.textContent='Receipt exceeds 256 KiB';return;}input.value=await selected.text();output.textContent='Receipt loaded. Supply an independent signer pin, then verify.';});
document.querySelector('#verify')!.addEventListener('click',()=>{
 const result=verifyReceipt(input.value,pin.value.trim()||undefined);
 output.textContent=JSON.stringify(result,null,2);
 output.dataset.integrity=result.integrity;
});
