#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
const root=process.cwd();
const contract=JSON.parse(fs.readFileSync(path.join(root,'_repo_update_contract.json'),'utf8'));
const repo=contract.repo_name;
if(repo!=='agency-event-os') throw new Error(`Unexpected repo_name: ${repo}`);
function gitSha(){const r=spawnSync('git',['rev-parse','--short=8','HEAD'],{cwd:root,encoding:'utf8'});return r.status===0?r.stdout.trim():''}
function sourceSha(){const files=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(['.git','node_modules','.next','.open-next','dist','build','coverage','playwright-report','test-results','.auth','artifacts','logs','.runtime-data'].includes(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else files.push(path.relative(root,p));}}walk(root);files.sort();const h=crypto.createHash('sha256');for(const f of files){h.update(f);h.update('\0');h.update(fs.readFileSync(path.join(root,f)));h.update('\0')}return h.digest('hex').slice(0,8)}
const sha=(process.env.BASELINE_SHA||gitSha()||sourceSha()).replace(/[^0-9a-f]/gi,'').slice(0,8).toLowerCase();
if(sha.length!==8) throw new Error('Unable to resolve an 8-character baseline SHA');
const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',month:'2-digit',day:'2-digit',year:'2-digit'}).formatToParts(new Date());const pick=t=>parts.find(p=>p.type===t)?.value;const date=`${pick('month')}-${pick('day')}-${pick('year')}`;
const name=`${repo}-main_BASELINE_${date}_${sha}.zip`;
const out=path.resolve(process.env.BASELINE_OUTPUT_DIR||path.dirname(root),name);
const excludes=['.git/*','node_modules/*','.next/*','.open-next/*','dist/*','build/*','coverage/*','playwright-report/*','test-results/*','.auth/*','artifacts/diagnostics/*','logs/*','.runtime-data/*','.env','.env.local','.env.preview','.env.production','tsconfig.tsbuildinfo'];
const args=['-q','-r',out,'.'];for(const x of excludes)args.push('-x',x);
const r=spawnSync('zip',args,{cwd:root,stdio:'inherit'});if(r.status!==0)process.exit(r.status??1);
const bytes=fs.readFileSync(out);const digest=crypto.createHash('sha256').update(bytes).digest('hex');
fs.writeFileSync(`${out}.sha256`,`${digest}  ${path.basename(out)}\n`);
console.log(JSON.stringify({repo,filename:path.basename(out),path:out,source_sha8:sha,zip_sha256:digest,schema_version:contract.schema_version},null,2));
