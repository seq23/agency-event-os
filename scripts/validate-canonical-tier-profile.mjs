#!/usr/bin/env node
import fs from 'node:fs';
const p=JSON.parse(fs.readFileSync('_canonical_tier_profile.json','utf8'));
const ids=p.tiers.map(x=>x.id); const required=['tier1','tier2','tier3a','tier3b','tier4a','tier4b','tier4c'];
for(const id of required) if(!ids.includes(id)) throw new Error(`Missing canonical tier ${id}`);
if(!String(p.completion_rule||'').includes('UNPROVEN')) throw new Error('Completion rule must block UNPROVEN rows');
console.log(`CANONICAL TIER PROFILE: PASS (${ids.join(',')})`);
