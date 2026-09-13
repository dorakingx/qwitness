import { test,expect } from '@playwright/test';
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';
import { signReceipt, fingerprint } from '../src/core/receipt';
import { resolve } from 'node:path';
const testKeys=ml_dsa65.keygen();
const testPin=fingerprint(testKeys.publicKey);
const testReceipt=signReceipt({question:'TEST ONLY — browser integrity verification; not live market data',issuedAt:new Date().toISOString(),evidence:{observedAt:new Date().toISOString()},calculations:[{utilizationPercent:'12.34'}],analysis:{claims:[{text:'TEST ONLY qualitative claim'}]}},testKeys.secretKey);

test('public landing, keyboard tabs and configuration state are usable',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.getByRole('heading',{name:'Every answer. An evidence trail.'})).toBeVisible();
 const caps=await (await page.request.get('/api/capabilities')).json();
 if(!caps.ready){await expect(page.getByRole('button',{name:'Generate evidence receipt'})).toBeDisabled();await expect(page.getByText('Live research is not configured.')).toBeVisible();}
 await page.getByRole('tab',{name:/Explore/}).focus();await page.keyboard.press('ArrowRight');await expect(page.getByRole('heading',{name:'Take the evidence with you.'})).toBeVisible();
 await page.keyboard.press('ArrowRight');await expect(page.getByRole('heading',{name:'Check the signature. Then the signer.'})).toBeVisible();
 expect(errors).toEqual([]);
});

test('browser verifies original, altered copies, new key and unknown signer',async({page})=>{
 await page.goto('/verify');
 await page.locator('#receipt-input').fill(JSON.stringify(testReceipt));
 await page.locator('#signer-pin').fill(testPin);
 await page.getByRole('button',{name:'Verify receipt locally'}).click();
 await expect(page.locator('.verification-output')).toContainText('matches pinned key');
 await expect(page.locator('.verification-output .check-value').first()).toHaveText('valid');
 await page.getByRole('button',{name:/Change a number/}).click();await expect(page.locator('.verification-output .check-value').first()).toHaveText('invalid');
 await page.getByRole('button',{name:/Rewrite a claim/}).click();await expect(page.locator('.verification-output .check-value').first()).toHaveText('invalid');
 await page.getByRole('button',{name:/Re-sign with a test key/}).click();await expect(page.locator('.verification-output .check-value').first()).toHaveText('valid');await expect(page.locator('.verification-output')).toContainText('mismatch');
 await page.getByRole('button',{name:/Restore original receipt/}).click();await expect(page.locator('.verification-output .check-value').first()).toHaveText('valid');
 await page.locator('#signer-pin').fill('');await page.getByRole('button',{name:'Verify receipt locally'}).click();await expect(page.locator('.verification-output .check-value').nth(1)).toHaveText('unknown');
 await page.locator('#receipt-input').fill('{bad json');await page.getByRole('button',{name:'Verify receipt locally'}).click();await expect(page.locator('.verification-output .check-value').first()).toHaveText('invalid');
});

test('standalone HTML loads from disk with networking disabled',async({page,context})=>{
 const requests:string[]=[];page.on('request',r=>requests.push(r.url()));
 await context.setOffline(true);
 await page.goto('file://'+resolve('public/offline-verifier.html'));
 await page.locator('#receipt').fill(JSON.stringify(testReceipt));await page.locator('#pin').fill(testPin);await page.getByRole('button',{name:'Verify offline'}).click();
 await expect(page.locator('#result')).toContainText('"integrity": "valid"');await expect(page.locator('#result')).toContainText('matches pinned key');
 const altered=structuredClone(testReceipt);altered.payload.calculations[0].utilizationPercent='77';await page.locator('#receipt').fill(JSON.stringify(altered));await page.getByRole('button',{name:'Verify offline'}).click();await expect(page.locator('#result')).toContainText('"integrity": "invalid"');
 expect(requests.filter(url=>/^https?:/.test(url))).toEqual([]);
});

test('390px viewport has no horizontal overflow and verifier remains usable',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.getByRole('heading',{name:'Every answer. An evidence trail.'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await page.getByRole('tab',{name:/Verify/}).click();await page.locator('#receipt-input').fill(JSON.stringify(testReceipt));await page.getByRole('button',{name:'Verify receipt locally'}).click();await expect(page.locator('.verification-output .check-value').first()).toHaveText('valid');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
