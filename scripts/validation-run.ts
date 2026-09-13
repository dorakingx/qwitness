import { spawnSync,execFileSync } from 'node:child_process';
import { writeFileSync,mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
const cwd=process.argv[2]||process.cwd();
const target=resolve('submission/evidence');mkdirSync(target,{recursive:true});
const sha=execFileSync('git',['rev-parse','HEAD'],{cwd,encoding:'utf8'}).trim();
const records:{command:string;exitCode:number|null;startedAt:string;durationMs:number;output:string}[]=[];
for(const args of [['ci'],['run','typecheck'],['test'],['run','build:verifier'],['run','build'],['run','scan:secrets']]){
 const start=Date.now();const r=spawnSync('npm',args,{cwd,encoding:'utf8',env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'},maxBuffer:3*1024*1024});
 records.push({command:'npm '+args.join(' '),exitCode:r.status,startedAt:new Date(start).toISOString(),durationMs:Date.now()-start,output:r.stdout+r.stderr});
 console.log(`${records.at(-1)!.command}: exit ${r.status}`);
 if(r.status!==0){process.exitCode=1;break;}
}
const out={commit:sha,checkedAt:new Date().toISOString(),environment:'clean git clone with npm ci; no project .env or signer seed copied',node:process.version,records};
writeFileSync(resolve(target,'clean-validation.json'),JSON.stringify(out,null,2)+'\n');
