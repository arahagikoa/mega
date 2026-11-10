import { readFileSync, readdirSync } from 'node:fs';
import { problemsOf, mergedInto } from './kb/support-kb/src/lib/kb/problems.ts';

const D = './kb/support-kb/src/lib/data';
const reports = JSON.parse(readFileSync(`${D}/reports-4471.json`, 'utf8'));
const notes = JSON.parse(readFileSync(`${D}/desk-notes.json`, 'utf8'));
const byHandle = new Map(readdirSync(`${D}/tenants`).map((f) => {
  const t = JSON.parse(readFileSync(`${D}/tenants/${f}`, 'utf8'));
  return [t.handle, t];
}));
const tenantOf = (r) => byHandle.get(r.tenant);

const merged = mergedInto(reports, 4471);
const rows = problemsOf(reports, tenantOf, 4471, notes.oneDayMove);
console.log('merged into 4471:', merged.length);
for (const p of rows) console.log(JSON.stringify(p));
console.log('rows sum:', rows.reduce((n, p) => n + p.reports, 0));
if (rows.reduce((n, p) => n + p.reports, 0) !== merged.length) throw new Error('rows do not add up to the merged count');
if (rows.length !== 3) throw new Error('expected three problems, got ' + rows.length);
console.log('OK: three problems, counts add up to the ticket');
