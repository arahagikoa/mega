**Reports covered: 33** of the 412 merged into #4471.

## What happens

The booking-v3 form prints `MM/DD/YYYY` under its date field. Its tenants write the day first.
Their people type the date in the order the hint asks for, month first, and the form reads it the
tenant's way, day first. The date flips again — for the opposite reason to the parser bug.

## Who it hits

The 3 tenants on booking-v3: `alder.physio` (de-DE), `copper.studio` (es-ES), `pale.harbour`
(pt-PT). Form reports only. First report 2026-04-17, latest 2026-09-22.

## How the number was reached

`causeOf` in `src/lib/kb/causes.ts` returns `hint` for a day-first tenant whose report came
through a form whose date hint starts with `MM`. 33 of the 412 distinct reports merged into #4471
match.

## Why it is its own ticket

Fixing the parser does not touch this. The wrong thing here is the text under the date field, in
one form version, for tenants whose locale is day-first. After the parser fix ships, these 33
reporters still get the wrong date and will report again.

The kb's own table on the #4471 page already marks this group **"not this ticket — no ticket of
its own"**, and it has been in that state since 17 April.

## Suggested fix

Print the hint from the tenant's locale instead of hard-coding it per form version, so
booking-v3 shows `DD/MM/YYYY` to a day-first tenant.
