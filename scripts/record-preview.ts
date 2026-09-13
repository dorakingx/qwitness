import { chromium, expect } from '@playwright/test';
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';
import { signReceipt, fingerprint } from '../src/core/receipt';
import { mkdirSync, writeFileSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

// This recording is a silent development preview. It does not impersonate a
// participant or substitute fixtures for live Graph / LLM execution.
const root = process.cwd();
for (const folder of ['video/raw', 'video/public', 'video/qa']) mkdirSync(folder, {recursive:true});
const keys = ml_dsa65.keygen();
const pin = fingerprint(keys.publicKey);
const observedAt = new Date().toISOString();
const receipt = signReceipt({
  purpose:'TEST ONLY — synthetic integrity demonstration. No Graph query or LLM call.',
  question:'TEST ONLY — verify this sample and detect edits',
  issuedAt:observedAt,
  evidence:{mode:'test-only',observedAt,provider:'NONE — SYNTHETIC TEST DATA',chain:'not applicable'},
  calculations:[{label:'TEST ONLY synthetic number',utilizationPercent:'12.34'}],
  analysis:{mode:'test-only',claims:[{text:'TEST ONLY sample text. Not AI analysis or a market recommendation.'}]},
  limitations:['No real market evidence. Created solely to demonstrate signature integrity and signer trust.']
},keys.secretKey);
const receiptPath = resolve('video/public/test-only-receipt.json');
writeFileSync(receiptPath, JSON.stringify(receipt,null,2)+'\n');
writeFileSync('video/public/test-only-pin.txt',pin+'\n');
const browser = await chromium.launch({headless:true});
const context = await browser.newContext({viewport:{width:1920,height:1080},deviceScaleFactor:1,recordVideo:{dir:resolve('video/raw'),size:{width:1920,height:1080}},reducedMotion:'reduce'});
const page = await context.newPage();
const started = Date.now();
const phases:{start:number;end?:number;title:string;caption:string;image:string}[]=[];
const networkRequests:string[]=[];
let offline=false;
page.on('request',request=>{if(offline&&/^https?:/.test(request.url()))networkRequests.push(request.url());});
const elapsed=()=>Math.round((Date.now()-started)/100)/10;
async function scene(title:string,caption:string,action:()=>Promise<void>,holdMs:number) {
 const phase={start:elapsed(),title,caption,image:`video/qa/${String(phases.length+1).padStart(2,'0')}.png`};
 phases.push(phase);
 await action();
 await page.screenshot({path:phase.image});
 console.log(JSON.stringify({phase:title,at:phase.start}));
 await page.waitForTimeout(holdMs);
}
try {
 await scene('An evidence trail, under construction','Silent technical preview. The app is real; the receipt used below is explicitly test-only.',async()=>{
   await page.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle'});
   await expect(page.getByRole('heading',{name:'Every answer. An evidence trail.'})).toBeVisible();
 },10000);
 await scene('Live integration is still blocked','The Graph API key is missing. Receipt generation is disabled; no live market evidence is claimed.',async()=>{
   await expect(page.getByText('Live research is not configured.')).toBeVisible();
   await expect(page.getByRole('button',{name:'Generate evidence receipt'})).toBeDisabled();
   await page.getByText('Live research is not configured.').scrollIntoViewIfNeeded();
 },12000);
 await scene('No generated receipt','The receipt screen stays empty. An unavailable live workflow is not shown as a successful query.',async()=>{
   await page.getByRole('tab',{name:/Receipt/}).click();
   await expect(page.getByRole('heading',{name:'No receipt yet.'})).toBeVisible();
   await page.getByRole('heading',{name:'No receipt yet.'}).scrollIntoViewIfNeeded();
 },8000);
 await scene('Import an explicitly synthetic sample','This JSON was signed with a temporary test key. Its data is not from The Graph and is not AI analysis.',async()=>{
   await page.getByRole('tab',{name:/Verify/}).click();
   await page.locator('input[type=file]').setInputFiles(receiptPath);
   await page.locator('#receipt-input').scrollIntoViewIfNeeded();
 },10000);
 await scene('The original passes with an independent test pin','The test fingerprint is supplied separately. Integrity is valid and the signer matches that pin.',async()=>{
   await page.locator('#signer-pin').fill(pin);
   await page.getByRole('button',{name:'Verify receipt locally'}).click();
   await expect(page.locator('.verification-output .check-value').first()).toHaveText('valid');
   await expect(page.locator('.verification-output')).toContainText('matches pinned key');
   await page.locator('.verification-output').scrollIntoViewIfNeeded();
 },10000);
 await scene('Change a number in a copy','The Tamper Lab changes the sample number while keeping its original signature. Verification fails.',async()=>{
   await page.getByRole('button',{name:/Change a number/}).click();
   await expect(page.locator('.verification-output .check-value').first()).toHaveText('invalid');
   await page.locator('.verification-output').scrollIntoViewIfNeeded();
 },10000);
 await scene('Change the analysis text','A separate copy changes the sample claim. The same original signature cannot authenticate the edited text.',async()=>{
   await page.getByRole('button',{name:/Rewrite a claim/}).click();
   await expect(page.locator('.verification-output .check-value').first()).toHaveText('invalid');
   await page.locator('.verification-output').scrollIntoViewIfNeeded();
 },10000);
 await scene('Another valid signature is another signer','A new temporary test key signs a copy. Integrity passes, but the original pinned signer does not match.',async()=>{
   await page.getByRole('button',{name:/Re-sign with a test key/}).click();
   await expect(page.locator('.verification-output .check-value').first()).toHaveText('valid');
   await expect(page.locator('.verification-output')).toContainText('mismatch');
   await page.locator('.verification-output').scrollIntoViewIfNeeded();
 },12000);
 await scene('No pin means unknown trust','Restore the original and remove the independent pin. A valid signature alone does not establish signer trust.',async()=>{
   await page.getByRole('button',{name:/Restore original receipt/}).click();
   await page.locator('#signer-pin').fill('');
   await page.getByRole('button',{name:'Verify receipt locally'}).click();
   await expect(page.locator('.verification-output .check-value').nth(1)).toHaveText('unknown');
   await page.locator('.verification-output').scrollIntoViewIfNeeded();
 },10000);
 await scene('Verify from a local file, with networking disabled','The standalone HTML bundles its verifier. The original test receipt verifies without an API, LLM, or CDN.',async()=>{
   offline=true;
   await context.setOffline(true);
   await page.goto('file://'+resolve('public/offline-verifier.html'));
   await page.locator('#file').setInputFiles(receiptPath);
   await page.locator('#pin').fill(pin);
   await page.getByRole('button',{name:'Verify offline'}).click();
   await expect(page.locator('#result')).toContainText('"integrity": "valid"');
   await expect(page.locator('#result')).toContainText('matches pinned key');
   await page.locator('#result').scrollIntoViewIfNeeded();
 },12000);
 await scene('Offline tampering is detected too','Change the synthetic number locally. The offline verifier rejects the original signature for this edited copy.',async()=>{
   const edited=structuredClone(receipt);edited.payload.calculations[0].utilizationPercent='99.99';
   await page.locator('#receipt').fill(JSON.stringify(edited,null,2));
   await page.getByRole('button',{name:'Verify offline'}).click();
   await expect(page.locator('#result')).toContainText('"integrity": "invalid"');
   await page.locator('#result').scrollIntoViewIfNeeded();
   expect(networkRequests).toEqual([]);
 },10000);
 await scene('Integrity is not truth','The signature does not prove provider honesty, AI correctness, or quantum resistance of Ethereum. Live data and human narration remain pending.',async()=>{
   await context.setOffline(false);offline=false;
   await page.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle'});
   await page.locator('#trust-boundary summary').click();
   await page.locator('#trust-boundary').scrollIntoViewIfNeeded();
 },10000);
 const end=elapsed();
 for(let i=0;i<phases.length;i++)phases[i].end=phases[i+1]?.start??end;
 const timeline={fps:30,width:1920,height:1080,durationSeconds:end,durationInFrames:Math.ceil(end*30),recordedAt:observedAt,source:'http://127.0.0.1:3000',publicInitialDeployment:'https://qwitness.vercel.app',sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),status:'SILENT TECHNICAL PREVIEW — TEST ONLY — NOT A SUBMISSION VIDEO',networkRequestsWhileOffline:networkRequests,phases};
 writeFileSync('video/src/timeline.json',JSON.stringify(timeline,null,2)+'\n');
 function stamp(sec:number){const ms=Math.round(sec*1000);return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')},${String(ms%1000).padStart(3,'0')}`;}
 writeFileSync('submission/preview-captions.srt',phases.map((p,i)=>`${i+1}\n${stamp(p.start)} --> ${stamp(p.end!)}\n${p.title}\n${p.caption}\n`).join('\n'));
 const video=page.video()!;
 await context.close();
 const path=await video.path();copyFileSync(path,'video/public/browser-recording.webm');
 console.log(JSON.stringify({status:'recorded',seconds:end,recording:'video/public/browser-recording.webm',timeline:'video/src/timeline.json',offlineRequests:networkRequests.length}));
} finally {await browser.close();}
