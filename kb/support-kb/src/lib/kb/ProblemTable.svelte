<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { mergedInto, problemsOf } from '#lib/kb/problems';

  let { ticket }: { ticket: number } = $props();

  const merged = $derived(mergedInto(reports as Report[], ticket));
  const rows = $derived(problemsOf(reports as Report[], tenantOf, ticket, notes.oneDayMove));
  const tags = (t: Record<string, number>) =>
    Object.entries(t)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, n]) => `${tag} ×${n}`)
      .join(' · ');
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} ·
  <strong>{rows.length}</strong> {rows.length === 1 ? 'problem' : 'problems'}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>intake tagged them</th><th>tenants</th><th>seen</th></tr>
  </thead>
  <tbody>
    {#each rows as p (p.key)}
      <tr>
        <td><code>{p.key}</code></td>
        <td>{p.reports}</td>
        <td class="tags">{tags(p.taggedAs)}</td>
        <td>{p.tenants}</td>
        <td>{p.firstSeen} → {p.lastSeen}</td>
      </tr>
    {/each}
  </tbody>
</table>

{#each rows as p (p.key)}
  {#if p.filedUnder}
    <p class="note">
      <code>{p.key}</code>: {p.reports} reports the cause logic cannot place. They sit under
      <code>{p.filedUnder}</code> in the ticket today, counted there by tenant.
    </p>
  {/if}
{/each}

<style>
  .sum { font-size: 1.1rem; }
  .tags { color: var(--muted); font-size: 0.85em; }
  .note { color: var(--muted); font-size: 0.85em; }
</style>
