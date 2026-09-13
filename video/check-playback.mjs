import {chromium} from '@playwright/test';
import {writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1920,height:1080}});
try{
 await page.goto('file://'+resolve('video/qa/playback.html'));
 await page.locator('video').evaluate(video=>new Promise((ok,bad)=>{if(video.readyState>=1)return ok();video.addEventListener('loadedmetadata',()=>ok(),{once:true});video.addEventListener('error',()=>bad(video.error?.message),{once:true});}));
 const checks=[];
 for(const [name,time] of [['beginning',5],['middle',66],['end',122]]){
  await page.locator('video').evaluate((video,time)=>new Promise(ok=>{video.addEventListener('seeked',()=>ok(),{once:true});video.currentTime=time;}),time);
  await page.locator('video').evaluate(video=>video.play());
  await page.waitForTimeout(1200);
  const result=await page.locator('video').evaluate(video=>({currentTime:video.currentTime,videoWidth:video.videoWidth,videoHeight:video.videoHeight,readyState:video.readyState,paused:video.paused,error:video.error?.message??null}));
  if(result.error||result.paused||result.currentTime<time+0.5)throw new Error('Playback did not advance: '+JSON.stringify(result));
  await page.locator('video').evaluate(video=>video.pause());
  await page.screenshot({path:`video/qa/playback-${name}.png`});
  checks.push({name,seekTo:time,...result});
 }
 writeFileSync('video/qa/playback-check.json',JSON.stringify({checkedAt:new Date().toISOString(),file:'submission/preview-without-narration.mp4',checks},null,2)+'\n');
 console.log(JSON.stringify({status:'passed',checks}));
}finally{await browser.close();}
