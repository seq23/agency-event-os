#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reportsDir = path.join(root, 'reports', 'tier4');
fs.mkdirSync(reportsDir, { recursive: true });

const failures = [];
const deleted = [];
const retained = [];
const nowIso = () => new Date().toISOString();
const b64 = (input) => Buffer.from(input).toString('base64url');
const redact = (value) => {
  const text = String(value || '');
  if (!text) return '';
  if (text.length <= 12) return 'redacted';
  return `${text.slice(0, 6)}…${text.slice(-4)}`;
};
function livekitApiBaseUrl(url) {
  const trimmed = String(url || '').replace(/\/$/, '');
  if (trimmed.startsWith('wss://')) return `https://${trimmed.slice('wss://'.length)}`;
  if (trimmed.startsWith('ws://')) return `http://${trimmed.slice('ws://'.length)}`;
  return trimmed;
}
function makeToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64(JSON.stringify({
    iss: process.env.LIVEKIT_API_KEY,
    sub: 'agency-event-os-tier4-ingress-cleanup',
    iat: now,
    nbf: now,
    exp: now + 300,
    video: { ingressAdmin: true, roomAdmin: true },
  }));
  const sig = crypto.createHmac('sha256', process.env.LIVEKIT_API_SECRET).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${sig}`;
}
async function twirp(method, body = {}) {
  const res = await fetch(`${livekitApiBaseUrl(process.env.LIVEKIT_URL)}/twirp/livekit.Ingress/${method}`, {
    method: 'POST',
    headers: { authorization: `Bearer ${makeToken()}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text.slice(0, 500) }; }
  return { response: res, text, json };
}
function compactIngress(item) {
  return {
    ingressIdRedacted: redact(item.ingress_id),
    name: item.name || '',
    roomName: item.room_name || '',
    status: item.state?.status || item.status || '',
  };
}
function shouldDelete(item, explicitIds) {
  if (explicitIds.length) return explicitIds.includes(item.ingress_id);
  const haystack = `${item.name || ''} ${item.room_name || ''}`;
  const status = String(item.state?.status || item.status || '').toUpperCase();
  const inactive = !status || /INACTIVE|ENDPOINT_INACTIVE/.test(status);
  return /tier4-auto-/i.test(haystack) && inactive;
}

async function main() {
  if (process.env.TIER4_LIVEKIT_CLEANUP_APPROVED !== '1') failures.push('Set TIER4_LIVEKIT_CLEANUP_APPROVED=1 to delete stale Tier 4 LiveKit ingress objects.');
  for (const key of ['LIVEKIT_URL', 'LIVEKIT_API_KEY', 'LIVEKIT_API_SECRET']) {
    if (!process.env[key]) failures.push(`missing ${key}`);
  }
  const explicitIds = String(process.env.TIER4_LIVEKIT_CLEANUP_INGRESS_IDS || '').split(',').map((item) => item.trim()).filter(Boolean);
  if (failures.length) throw new Error(failures.join('\n'));

  const listed = await twirp('ListIngress', {});
  if (!listed.response.ok) throw new Error(`ListIngress failed ${listed.response.status}: ${listed.text.slice(0, 500)}`);
  const items = listed.json.items || listed.json.ingress || [];
  for (const item of items) {
    if (!item?.ingress_id) continue;
    if (!shouldDelete(item, explicitIds)) {
      retained.push({ ...compactIngress(item), reason: explicitIds.length ? 'not_in_explicit_delete_list' : 'not_tier4_auto_or_not_cleanup_safe' });
      continue;
    }
    const result = await twirp('DeleteIngress', { ingress_id: item.ingress_id });
    const entry = { ...compactIngress(item), deleted: result.response.ok, statusCode: result.response.status };
    if (result.response.ok) deleted.push(entry);
    else {
      failures.push(`DeleteIngress failed for ${redact(item.ingress_id)} (${result.response.status}): ${result.text.slice(0, 300)}`);
      retained.push({ ...entry, reason: 'delete_failed' });
    }
  }
  if (explicitIds.length && deleted.length !== explicitIds.length) failures.push(`explicit cleanup requested ${explicitIds.length} ingress id(s), deleted ${deleted.length}.`);

  const after = await twirp('ListIngress', {}).catch((error) => ({ error }));
  const afterItems = after?.json?.items || after?.json?.ingress || [];
  const report = {
    repo: 'agency-event-os',
    generatedAt: nowIso(),
    result: failures.length ? 'BLOCKED_OR_FAIL' : 'PASS',
    mode: explicitIds.length ? 'explicit_ids' : 'safe_tier4_auto_only',
    deleted,
    retained,
    remainingIngressCount: Array.isArray(afterItems) ? afterItems.length : 'unknown',
    failures,
  };
  fs.writeFileSync(path.join(reportsDir, 'livekit-ingress-cleanup-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
  process.exit(failures.length ? 2 : 0);
}

main().catch((error) => {
  const report = { repo: 'agency-event-os', generatedAt: nowIso(), result: 'BLOCKED_OR_FAIL', failures: [error?.message || String(error)] };
  fs.writeFileSync(path.join(reportsDir, 'livekit-ingress-cleanup-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.error(error?.message || String(error));
  process.exit(2);
});
