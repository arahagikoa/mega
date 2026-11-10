import { readFileSync, readdirSync } from 'node:fs';
import { groupByCause, uniqueById, ticketCause, readAs, causeOf } from './kb/support-kb/src/lib/kb/causes.ts';

const D = './kb/support-kb/src/lib/data';
const reports = JSON.parse(readFileSync(`${D}/reports-4471.json`, 'utf8'));
const notes = JSON.parse(readFileSync(`${D}/desk-notes.json`, 'utf8'));
const tenants = readdirSync(`${D}/tenants`).map((f) => JSON.parse(readFileSync(`${D}/tenants/${f}`, 'utf8')));
const byHandle = new Map(tenants.map((t) => [t.handle, t]));
const tenantOf = (r) => byHandle.get(r.tenant);

console.log('raw', reports.length);
const uniq = uniqueById(reports);
console.log('unique', uniq.length);
console.log('merged into 4471', uniq.filter((r) => r.mergedInto === 4471).length);
console.log('mergedInto values', [...new Set(uniq.map((r) => r.mergedInto))]);

const groups = groupByCause(uniq, tenantOf);
for (const g of groups) {
  console.log('---', g.cause, 'n=' + g.reports.length, 'tenants=' + g.tenants,
    g.firstSeen, '->', g.lastSeen, 'mergedInto=' + JSON.stringify(g.mergedInto),
    'taggedAs=' + JSON.stringify(g.taggedAs), 'oneDayMove=' + readAs(g, notes.oneDayMove));
  console.log('   tenants:', [...new Set(g.reports.map((r) => r.tenant))].join(', '));
  console.log('   channels:', JSON.stringify(g.reports.reduce((n, r) => ({ ...n, [r.channel]: (n[r.channel] ?? 0) + 1 }), {})));
}
console.log('ticketCause(4471) =', ticketCause(groups, 4471));
