#!/usr/bin/env node
import fs from 'node:fs';
const m=JSON.parse(fs.readFileSync('config/deployed-route-manifest.json','utf8'));const h=JSON.parse(fs.readFileSync('_hallmark_route_state_contract.json','utf8'));
if(h.routes.length!==m.routes.length) throw new Error(`Hallmark route count mismatch ${h.routes.length}/${m.routes.length}`);
for(const r of h.routes){if(!r.required_states?.length) throw new Error(`${r.id}: no states`);if(!['UNPROVEN','PASS','BLOCKED','NOT_APPLICABLE'].includes(r.status)) throw new Error(`${r.id}: invalid status`);if(r.status==='PASS'&&!r.evidence?.length) throw new Error(`${r.id}: PASS without evidence`)}
console.log(`HALLMARK ROUTE/STATE CONTRACT: PASS (${h.routes.length} routes; approval remains evidence-bound)`);
