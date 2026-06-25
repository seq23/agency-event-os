#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const file=path.join(root,'.github/workflows/deploy-cloudflare-worker.yml');
const failures=[];
if(!fs.existsSync(file)) failures.push('Missing .github/workflows/deploy-cloudflare-worker.yml');
const s=fs.existsSync(file)?fs.readFileSync(file,'utf8'):'';
const required=[
  'timeout-minutes: 45',
  'concurrency:',
  'cancel-in-progress: true',
  'CLOUDFLARE_API_TOKEN:',
  'CLOUDFLARE_ACCOUNT_ID:',
  'npm ci --no-audit --no-fund',
  'npm run release:prepush:container',
  'npm run cf:build:recoverable',
  'test -f .open-next/worker.js',
  'npm run cf:deploy -- --keep-vars',
  'npm run postdeploy:smoke',
  'timeout --signal=TERM'
];
for(const token of required) if(!s.includes(token)) failures.push(`Cloudflare workflow missing: ${token}`);
if(/npm run deploy:production:safe/.test(s)) failures.push('Workflow must not call the unbounded composite deploy:production:safe command.');
if(/\bcontinue-on-error:\s*true\b/.test(s)) failures.push('Deployment workflow may not hide failures with continue-on-error.');
const wrangler=JSON.parse(fs.readFileSync(path.join(root,'wrangler.jsonc'),'utf8'));
if(wrangler.name!=='west-peek-live') failures.push(`Unexpected Cloudflare Worker name: ${wrangler.name}`);
if(wrangler.main!=='.open-next/worker.js') failures.push(`Unexpected Cloudflare Worker entrypoint: ${wrangler.main}`);
const report={schema_version:'1.0',workflow:'.github/workflows/deploy-cloudflare-worker.yml',worker:wrangler.name,failures,verdict:failures.length?'FAIL':'PASS'};
fs.mkdirSync(path.join(root,'reports'),{recursive:true});
fs.writeFileSync(path.join(root,'reports','cloudflare-workflow-contract.json'),JSON.stringify(report,null,2)+'\n');
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log('Cloudflare deployment workflow contract: PASS');
