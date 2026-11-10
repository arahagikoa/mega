// The problems inside one ticket. causes.ts places a report by tenant and channel; desk-notes.json
// lists the reports the desk read as something else. Those two together are the split.
import { groupByCause, uniqueById, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = {
  key: string;
  reports: number;
  tenants: number;
  firstSeen: string;
  lastSeen: string;
  taggedAs: Record<string, number>;
  // For a problem the cause logic cannot place: where its reports sit in the ticket today.
  filedUnder: string | null;
};

function stats(rs: Report[]) {
  const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
  return {
    reports: rs.length,
    tenants: new Set(rs.map((r) => r.tenant)).size,
    firstSeen: days[0],
    lastSeen: days[days.length - 1],
    taggedAs: rs.reduce<Record<string, number>>((n, r) => ({ ...n, [r.meta.intakeTag]: (n[r.meta.intakeTag] ?? 0) + 1 }), {}),
  };
}

export function mergedInto(all: Report[], ticket: number): Report[] {
  return uniqueById(all).filter((r) => r.mergedInto === ticket);
}

// One row per problem. A report counts once, under the problem that explains it, so the rows add
// up to the ticket's report count.
export function problemsOf(
  all: Report[],
  tenantOf: (r: Report) => Tenant | undefined,
  ticket: number,
  readDifferently: readonly string[],
): Problem[] {
  const merged = mergedInto(all, ticket);
  const moved = merged.filter((r) => readDifferently.includes(r.id));
  const rest = merged.filter((r) => !readDifferently.includes(r.id));
  const filedUnder = [...new Set(groupByCause(moved, tenantOf).map((g) => String(g.cause)))].sort();
  return [
    ...groupByCause(rest, tenantOf).map((g) => ({ key: String(g.cause), ...stats(g.reports), filedUnder: null })),
    ...(moved.length ? [{ key: 'one-day move', ...stats(moved), filedUnder: filedUnder.join(', ') || null }] : []),
  ].sort((a, b) => b.reports - a.reports);
}
