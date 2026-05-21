const fs = require('fs');
function read(file){ if(!fs.existsSync(file)) throw new Error(`Missing ${file}`); return fs.readFileSync(file,'utf8'); }
function assert(cond,msg){ if(!cond) throw new Error(msg); }
const svc=read('services/video/livekitIngressService.ts');
assert(svc.includes('Ingress/CreateIngress'), 'Ingress service must call the LiveKit CreateIngress API, not fabricate credentials.');
assert(svc.includes('input_type: "RTMP_INPUT"'), 'Ingress service must request RTMP_INPUT.');
assert(!svc.includes('fakeIngressId'), 'Ingress service must not fabricate ingress IDs.');
assert(svc.includes('livekitStreamKey'), 'Ingress service must store stream key operator-only.');
assert(svc.includes('Ready for StreamYard Connection'), 'Ingress service must expose producer-ready status copy.');
const panel=read('components/testing/StreamYardIngressPanel.tsx');
for (const token of ['Click to Copy RTMP URL','Click to Copy Stream Key','Failure plane','keep StreamYard running','Switch attendees to Daily']) assert(panel.includes(token), `Producer panel missing ${token}`);
const publicFiles=['components/venue/MainStageExperience.tsx','components/video/StagePlayer.tsx','components/video/LiveKitIngressStagePlayer.tsx','components/video/DailyFallbackStagePlayer.tsx','components/venue/BreakoutRoomExperience.tsx'];
for (const file of publicFiles) assert(!read(file).includes('livekitStreamKey'), `${file} must not reference StreamYard stream key.`);
console.log('validate_streamyard_ingress_contract: PASS');
