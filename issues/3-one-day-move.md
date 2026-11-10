**Reports covered: 5** of the 412 merged into #4471 in the kb export of 2026-10-04. The desk keeps merging reports into #4471, so this is the count in that export, not a running total.

## What happens

The invite lands one day out, not one month out. A month-first parse cannot turn Tuesday 12 May
into Monday 11 May, so neither the parser bug nor the form-hint bug explains these.

## The reports

| id | tenant | channel | what the reporter said |
|:--|:--|:--|:--|
| R-41202 | kettle.books | email | "Invite says Tuesday 12 May. Calendar says Monday 11 May." |
| R-41209 | alder.physio | app | "Every booking in June is one day off. Only June." |
| R-41236 | nine.lanterns | app | "The invite arrived before I made the booking." |
| R-41344 | pale.harbour | email | "Client in Lisbon got Tuesday. Client in Toronto got Monday. Same meeting." |
| R-41620 | lantern.row | email | "Tuesday 6 October showed as Monday." |

First report 2026-04-02, latest 2026-10-04. Five tenants, so it is not one tenant's setup.

## Why it is its own ticket

Two reports point at time zones rather than at date order: the same meeting arriving on different
days in Lisbon and in Toronto, and an invite arriving before the booking was made. A third says
the shift is confined to one month, which a constant parsing bug would not do. The shape is an
off-by-one day somewhere in conversion, not a swapped month.

## How the number was reached

The desk already separated these by hand: they are listed in
`src/lib/data/desk-notes.json` under `oneDayMove`. The kb's cause logic places a report by tenant
and channel only, so it cannot see this class at all and files all five under `parser`. The
#4471 page carries them as a footnote — "5 reports read as a one-day move" — and no ticket was
ever opened.

Counting them here takes them out of the parser ticket, which is why that one says 374 and not
379. The three tickets add up to the ticket's 412.

## What this needs

Someone has to read the five bodies and reproduce one. The cause is not provable from the export,
only distinguishable from the other two: date order is not what is wrong in these five.
