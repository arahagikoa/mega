**Reports covered: 374** of the 412 merged into #4471 in the kb export of 2026-10-04. The desk keeps merging reports into #4471, so this is the count in that export, not a running total.

## What happens

The shared date parser reads every date month first. Every tenant on file writes the day first,
so a date entered as `12/05` comes back as 5 December instead of 12 May. Invites, reminders and
partner syncs then carry the flipped date.

## Who it hits

All 11 tenants on file, over every channel (app, email, form). First report 2026-04-01, latest
2026-10-04.

## How the number was reached

`src/lib/kb/causes.ts` in the kb export places a report by its tenant's locale and the form it
runs: a day-first tenant whose report is not a booking-v3 form report is the parser bug. Of the
412 distinct reports merged into #4471 (the export holds 427 rows, with 15 repeated ids across
overlapping export pages), 379 land in that group, and 5 of those describe something else
(see the one-day move ticket), which leaves 374.

## Why it is its own ticket

This is the bug #4471 names, and the queued fix is the right fix for it. It is listed separately
only so the other two problems stop being counted as part of it.

## Note

Intake tagged 23 of these 374 as `hint`. Intake guesses from the reporter's browser locale and
never looks up the tenant, so its tag does not decide the cause.
