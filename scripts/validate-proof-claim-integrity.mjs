#!/usr/bin/env node
import fs from 'node:fs';
const files=['RUNTIME_ACTION_INVENTORY.json','_hallmark_route_state_contract.json'];
for(const file of files){const data=JSON.parse(fs.readFileSync(file,'utf8'));const rows=data.actions||data.routes||[];for(const r of rows){if(r.status==='PASS'&&!(r.evidence||[]).length)throw new Error(`${file}:${r.id} PASS without evidence`);if(r.status==='NOT_APPLICABLE'&&!r.not_applicable_reason)throw new Error(`${file}:${r.id} N/A without reason`)}}
console.log('PROOF CLAIM INTEGRITY: PASS');
