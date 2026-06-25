#!/usr/bin/env node
import fs from 'node:fs';
const m=JSON.parse(fs.readFileSync('config/deployed-route-manifest.json','utf8')); const i=JSON.parse(fs.readFileSync('RUNTIME_ACTION_INVENTORY.json','utf8'));
if(i.route_count!==m.routes.length||i.actions.length!==m.routes.length) throw new Error(`Inventory/manifest mismatch ${i.actions.length}/${m.routes.length}`);
const required=['route-render','identity','authorization'];
for(const a of i.actions){for(const x of required) if(!a.required_proof.includes(x)) throw new Error(`${a.id}: missing ${x}`); if(a.action_class==='mutation-capable'){for(const x of ['mutation','persistence-readback','reload-reentry','negative-authorization']) if(!a.required_proof.includes(x)) throw new Error(`${a.id}: missing ${x}`)}}
console.log(`RUNTIME ACTION INVENTORY: PASS (${i.actions.length} routes)`);
