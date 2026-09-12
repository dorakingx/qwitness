import { execFileSync } from 'node:child_process';
import { readFileSync,existsSync, readdirSync,statSync } from 'node:fs';
import { join } from 'node:path';
const paths=execFileSync('git',['ls-files','--cached','--others','--exclude-standard'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
function files(dir:string):string[]{return existsSync(dir)?readdirSync(dir).flatMap(name=>{const path=join(dir,name);return statSync(path).isDirectory()?files(path):[path];}):[];}
const secrets:string[]=[];
for(const env of ['.env.local','.secrets/signing.env'])if(existsSync(env))for(const line of readFileSync(env,'utf8').split('\n')){const match=line.match(/^(GRAPH_API_KEY|OPENAI_API_KEY|QWITNESS_SIGNING_SEED)=(.+)$/);if(match&&match[2].length>7)secrets.push(match[2].replace(/^['"]|['"]$/g,''));}
const patterns=[/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/\bgh[pousr]_[A-Za-z0-9]{30,}\b/,/\bsk-proj-[A-Za-z0-9_-]{20,}\b/];
const violations:string[]=[];
for(const path of new Set([...paths,...files('.next/static')])){
 if(!existsSync(path)||statSync(path).isDirectory())continue;
 if(/(^|\/)(\.env\.local|\.secrets)(\/|$)/.test(path)){violations.push(path);continue;}
 const content=readFileSync(path,'utf8');
 if(secrets.some(secret=>content.includes(secret))||patterns.some(pattern=>pattern.test(content)))violations.push(path);
}
if(violations.length){console.error('Secret scan failed. Inspect these files locally (values suppressed):',violations.join(', '));process.exitCode=1;}else console.log(`Secret scan passed for ${paths.length} repository files and client static assets; exact local secret values and credential patterns checked. This is not an exhaustive security audit.`);
