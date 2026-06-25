const fs = require('fs');
function read(file){ if(!fs.existsSync(file)) throw new Error(`Missing ${file}`); return fs.readFileSync(file,'utf8'); }
function includes(file, terms){ const text=read(file); const missing=terms.filter(t=>!text.includes(t)); if(missing.length) throw new Error(`${file} missing: ${missing.join(', ')}`); }
includes('types/stageStream.ts', ['STREAMYARD_FEED','LIVEKIT_DISTRIBUTION','producerStudioSource','mainStageAttendeeJoinEnabled']);
includes('services/video/stageStreamStateService.ts', ['evaluateStageFallbackDecision','ingress_ended','keep StreamYard running','LIVEKIT_DISTRIBUTION','STREAMYARD_FEED']);
includes('app/api/video/livekit-webhook/route.ts', ['verifyWebhook','ingress_started','ingress_ended','verification failed closed']);
console.log('validate_stage_stream_contract: PASS');
