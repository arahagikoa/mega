# #4471 — one ticket, more than one problem

The support desk merged 412 reports about wrong dates into ticket #4471 and marked it known,
with one fix queued. Running the desk's own cause logic over its kb export splits those 412
reports into three problems that need three different fixes.

| problem | reports | needs |
|:--|--:|:--|
| [parser](../../issues/1) — the shared parser reads every date month first | 374 | the queued fix |
| [hint](../../issues/2) — booking-v3 prints `MM/DD/YYYY` to day-first tenants | 33 | a fix of its own |
| [one-day move](../../issues/3) — the invite lands a day out, not a month out | 5 | a person to reproduce it |

374 + 33 + 5 = 412. `node --experimental-strip-types check.mjs` recomputes the three counts from
the export and fails if they do not add up to the ticket.

## The page added to the kb

- `kb/support-kb/src/routes/kb/incidents/4471-split/+page.svx` — the page, signed with the course ticket in its frontmatter
- `page.html` — the same page as the desk will see it, rendered from that `.svx`
