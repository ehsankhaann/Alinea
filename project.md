# alinea — Project Specification

**Product:** Portfolio & dealflow intelligence platform for a venture investment firm
**Version:** interactive prototype v1.0 · 24 November 2026
**Audience for this document:** the engineering team building the production system, a reviewing investor, or an evaluator scoring the build against a product brief

This file specifies what the product *does*, screen by screen, including the rules that must survive contact with a real backend. `README.md` is the short version. `proposal/` holds the commercial plan.

---

## 1. Product identity

A private, bilingual web platform that maintains **one verified record** of every portfolio company and every deal under consideration. It ingests company reports and deal correspondence as they arrive, files them against the correct record automatically, and quarantines every machine-read figure until a human decides what it means.

The product's central claim is not "AI reads your documents." It is: **you can always answer where a number came from, and an unread number never becomes a fact.**

**In scope:** portfolio intelligence, dealflow pipeline, document library, review queue, founder portal, assistant, data operations, activity and audit.

**Out of scope by design:** anything investor-facing — no investor book, no investor portal, no fund or club-deal vehicles, no partner/expert ecosystem. No outbound sending of any kind.

---

## 2. Principles, operationalised

Each principle below maps to a specific enforcement point in the implementation. These are the acceptance criteria for the production build.

### 2.1 Provenance
A claim stores its source document, source excerpt, capture method, received timestamp, period and metric identity **separately** from the reviewer, decision and decision timestamp. In the UI, any verified figure can be clicked to reveal its capture method, last-verified date and a link into the review history. Provenance is never inferred from the approval record.

### 2.2 Human review
There is exactly one promotion path: a Reviewer or Administrator opens the claim, ticks *I checked this figure against the source document*, then accepts, corrects, rejects or marks not applicable. The confirm checkbox gates the accept control — it is `disabled`, not merely styled. Extraction, inbox sync and founder submission all create `pending` claims; none of them can write to the verified record.

### 2.3 Append-only history
A correction never mutates the prior value. Accepting with a correction writes a **revision** row carrying metric, previous value, new value, reviewer, timestamp and reason; the company record points at the new value while the revision list retains the chain. Every decision also writes an activity entry naming the actor, the value, the company and the prior value.

### 2.4 Missing is not zero
`VerifiedMetrics` fields are optional. Every render site resolves absence to the localized string *Missing* — company tables, the Financial KPIs tab, the traction grid, the founder portal metric cards, and the assistant's answers. The founder report form states explicitly that a blank field is stored as Missing. No default of `0`, `—`, or empty string is permitted for a required-but-unreported field.

### 2.5 Idempotent ingestion
Three identity keys, each surfaced in the UI so the guarantee is inspectable rather than asserted:
- **Email** → Internet Message-ID
- **Document** → SHA-256 of bytes
- **Deal** → normalised name key (`lowercase`, alphanumerics and hyphens only)

Data operations exposes each job's idempotency key and attempt count; retrying re-runs under the same key. Intake staging flags a duplicate row from the normalised key and disables *Create deal* for it.

### 2.6 Editable in place, except system dates
Deal table cells for amount, stage and owner edit without opening the record. Received timestamps, decision timestamps, due dates computed from a period rule, and audit times are read-only everywhere.

### 2.7 One language per screen
A single `lang` value drives the entire tree: 367 copy keys, all record-level `Localized` fields, `Intl.DateTimeFormat` and `Intl.RelativeTimeFormat` locales, and generated strings. No screen mixes. Proper nouns — company names, person names, document filenames, email subjects written by a founder — stay as written.

### 2.8 No outbound sending
The dealflow *Draft pass reply* produces a bilingual draft with an EN/FR toggle and a copy action. Nothing is transmitted. The toast states it: *Reply draft created. No message is sent automatically.*

---

## 3. Roles and access control

Five roles. Permission flags are derived once from the signed-in role and gate both the control and the handler, so a disabled button cannot be bypassed by calling the action.

| Flag | True for | Gates |
|---|---|---|
| `canEdit` | Administrator, Editor | create company / deal / meeting / document / note; inline deal edits; bulk stage moves; dealflow approve and reply drafting; meeting completion; task toggling; team membership; message re-filing |
| `canReview` | Administrator, Reviewer | accept, correct, reject, mark not applicable, reconcile conflicts |
| `isAdmin` | Administrator | Data operations page and nav entry; access & invitations; per-company viewer grants; pipeline configuration; custom fields |
| scoped read | Viewer | company list filtered to granted IDs; ungranted company detail replaced by an *Access restricted* panel |
| isolated | Founder | separate portal shell; Canopy only; no workspace navigation |

**Enforcement points worth preserving in production:**

1. `openModal` checks `canEdit` before opening and toasts the read-only message — the guard is in the action, not the button.
2. `decideReview` re-checks `canReview` and returns early, so a Reviewer-only control cannot be invoked by an Editor through any path.
3. `openDetail` refuses a company outside a Viewer's grants, which means search results, activity links and notifications cannot become a bypass.
4. Read-only controls render `disabled` rather than disappearing, so a Viewer sees the product's full shape and understands what upgrading their role would unlock.

Viewer grants default to Canopy, Luma Health and Mosaic and are editable by an Administrator in Settings → *Per-company grants*, as toggle chips per portfolio company.

---

## 4. Information architecture

```
Sign in
├── Founder role ─────────────────────────────► Founder portal (isolated shell)
└── Staff roles ─► Workspace shell
                   ├── Overview
                   ├── Companies ──► Company drawer (9 tabs)
                   ├── Deal pipeline ──► Deal drawer (8 tabs)
                   ├── Smart inbox ──► Company mailbox | Dealflow mailbox
                   ├── Meetings ──► Meeting drawer
                   ├── Documents ──► Document drawer
                   ├── Review queue ──► Claim drawer (decision states)
                   ├── Activity log
                   ├── Data operations  (Administrator only)
                   └── Settings
Global: Cmd/Ctrl+K search · notifications · account · create menu · assistant dock · toasts
```

Navigation is grouped **Workspace** (Overview, Companies, Deal pipeline, Smart inbox, Meetings) and **Library** (Documents, Review queue, Activity log, Data operations), with Settings pinned to the sidebar foot alongside a *Private & secure* panel. Inbox and Review queue carry live count badges.

---

## 5. Screen specification

### 5.1 Sign in
Two-panel split. Left: full-bleed architectural photograph with a four-stop vertical scrim, the wordmark, a large display headline and a supporting line. Right: the form.

- Language toggle (EN / FR) in the top rail, functional before authentication
- **Role picker** — five tiles (Admin, Reviewer, Editor, Viewer, Founder); selecting one autofills email and password and clears any error state
- Email and password with show/hide toggle
- Credential validation against the role table; a mismatch shows an inline error naming the autofill affordance rather than a generic failure
- Footnote stating this is a private demo environment with no real company data stored

Below 820px the photograph compresses to a 155px band rather than disappearing, so the identity survives on mobile.

### 5.2 Workspace shell
- **Sidebar** — wordmark (returns to Overview), workspace identity card, grouped navigation, review-queue and inbox badges, Settings, security panel. Collapsible to a 70px icon rail on desktop via a chevron control; the collapse state persists. Below 820px it becomes an off-canvas drawer with a scrim and its own close control.
- **Top bar** — mobile menu control, breadcrumb (root is clickable), global search field with `⌘K` hint, EN/FR toggle, notifications bell with an unread dot, avatar menu (Settings, Sign out). Popovers close on outside click via a full-viewport catcher, and on `Esc`.
- **Notifications popover** — up to three pending claims, each opening its claim drawer, plus a footer link into the activity log. Empty state reads *You are all caught up.*
- **Create menu** — Overview-only, offers Add company, New deal, Schedule meeting, Upload document.

### 5.3 Overview
Time-of-day greeting with the user's first name. Four-figure stat strip: portfolio count, reporting health (complete-or-on-track over total), claims and conflicts awaiting review, active dealflow opportunities.

- **Needs your attention** — pending claims with metric, company, received date, proposed value and an *Awaiting review* marker; each row opens the claim drawer. Empty state explains that new figures from incoming sources will appear here.
- **Portfolio companies** — verified-ARR snapshot with the subtitle *Only human-verified figures appear in this record*; rows open the company drawer.
- **Reporting calendar** (side rail) — the four nearest due dates sorted ascending, each with a status dot and badge.
- **Recent activity** — four most recent entries with kind-coloured icons.
- **Next meeting** — date tile, title, company, time.

### 5.4 Companies
Summary strip: portfolio count, reports overdue or missing, conflicts needing reconciliation, and average completeness — labelled *deterministic, not estimated*.

Filters: record type (All / Portfolio / Watchlist) as tabs with counts, plus a reporting-status select (Complete, On track, Due soon, Overdue, Missing, Conflict) and free-text search across name, sector and location.

Table columns: company (monogram, name, location) · sector (with stage beneath) · reporting status badge · period · completeness (meter + percentage) · last report (or *Missing*) · verified ARR (or *Missing*). Rows are keyboard-focusable and open on `Enter`.

**Company drawer — nine tabs**

| Tab | Contents |
|---|---|
| Executive summary | Description, website/founded/owner meta, clickable verified-figure grid with inline claim expansion, reporting status card with completeness meter, linked deals |
| Financial KPIs | Trust note; every metric row showing value or *Missing* with a verified/not-received marker; pending and conflicting claims; full revision history with prior → new, reason, reviewer, date |
| Traction & sales | Clickable ARR, growth and retention cards; concentration and evidence-strength facts; outstanding evidence questions |
| Corporate & governance | Legal entity, jurisdiction, board seats, ownership; governance note explaining how unreported items stay Missing |
| Files & correspondence | Every document filed to the company with extension, date and uploader |
| Notifications | Pending and conflicting claims as alerts; an overdue-reporting alert card; acknowledge / snooze controls with a *simulate new evidence* reopen action |
| Calls | Meetings filed to the company with date, duration, attendees; schedule-meeting action |
| Contacts | Founder and record-owner contacts with a copy-email action |
| History | Manually added notes plus the append-only activity feed for this company |

Sticky footer: *Add note* and *Schedule meeting*.

**Alert lifecycle:** open → acknowledged or snoozed (state persisted per company) → reopened automatically when new evidence arrives. Inbox sync and founder submission both clear the alert for the affected company, which is the "reopen on new evidence" rule expressed in reverse.

### 5.5 Deal pipeline
Summary strip: active opportunities, in due diligence, at IC review, committed this quarter, and a pipeline-health meter with new-opportunity count.

Toolbar: stage tabs with counts (All plus the seven steps), search, and a Board/Table view switcher.

**Board** — one column per active step, each with a colour-coded dot, name and count; cards carry monogram, priority pill, name, sector, round, amount, next step with a clock icon, owner initial and relative last-activity. Cards are focusable and open on `Enter`. The board scrolls horizontally as a unit below 1050px rather than crushing cards.

**Table** — select-all and per-row checkboxes, company with priority, sector, round, **inline-editable amount**, **inline stage select**, **inline owner select**, next step, last activity, and an open control. A sticky bulk bar appears on selection with count, bulk *Move to* stage, CSV export of the selection, and clear.

Inline edits write immediately, update `updatedAt`, and toast that the figure was saved with a new revision. All inline controls are `disabled` for read-only roles.

**Deal drawer — eight tabs**

| Tab | Contents |
|---|---|
| Overview | Thesis, amount, round, priority, source, next step, stage select, linked portfolio company |
| Calls | Meetings for the linked company plus a Granola sync explainer (matched by attendee email and domain) |
| Due diligence | Five-item checklist with evidence state per item |
| Q&A | Three standing questions with answers and status badges (Answered / Follow-up / Open) |
| Files | Documents linked to the deal or its portfolio company |
| Team | Deal team with owner/member badges and an *Add me* action |
| Tasks | Checkable task list with add-task |
| Activity timeline | Creation, stage change and evidence-filing events on a connector line |

### 5.6 Smart inbox
Mailbox switcher: **Company inbox** / **Dealflow mailbox**. Filters: All / Needs filing / Filed, with counts; plus search across sender, subject, company and deal.

Master–detail layout: message list (sender, unread dot, date, subject, preview, filing tag) beside the reader (received date, subject, from line, filing badge, full body with preserved line breaks).

**Auto-filing panel** — shows the matched company or deal, match confidence percentage, and two selects to re-file manually. Re-filing marks the message processed and sets confidence to 100.

**Extracted figures** — listed with the explicit banner *Not part of the verified record until reviewed*; each opens its claim drawer.

**Attachment** — opens the document drawer.

**Dealflow intake decision** (Dealflow mailbox only) — Approve & open deal (creates a `mapped` deal owned by the user, links the message, queues enrichment, writes activity), Draft pass reply (bilingual draft with EN/FR toggle and copy), and Attach to existing deal. A note records that the mailbox is reviewed every two minutes with Message-ID deduplication.

*Sync new mail* runs the whole arrival path end to end and is the demo's clearest expression of the product's thesis: mail arrives → matched by domain → report filed to the library → ARR extracted → **queued as pending, not published**.

### 5.7 Meetings
Upcoming / Past / All tabs with counts; search across title, company and attendees. Rows show a date tile, title, company and meeting type, day and time with duration, and a status badge. Drawer shows the full date line, company link, type, attendees, notes, and a *Mark complete* action that writes activity and disables itself once completed.

### 5.8 Documents
Filters: All / Reports / Decks / Memos; search across title and related record. Table shows a file icon with name, extension and size, related company or deal, type, added-by (which distinguishes *Inbox automation* from a named person) and relative date.

Drawer shows a paper-style preview, summary, provenance facts (related record, added by, date, type), and every claim extracted from that source with its review state. Download returns the uploaded file for session uploads, or a generated plain-text source summary for seeded records — the button label changes between *Download source* and *Download demo summary* so the difference is never hidden.

Upload accepts a real file, computes size, derives the extension, records the uploader, and creates a session-scoped object URL that is deliberately stripped before persisting so no stale `blob:` reference survives a reload.

### 5.9 Review queue
Principle banner: *Human verification required · This proposed value is isolated from the company record until you verify it.*

Count panel: pending, conflicts, validated, plus total revisions recorded with the note that no value is overwritten.

Tabs: Pending · Conflicts · Verified · Rejected · Not applicable, each with counts. Table: company, metric, new figure (conflicts render as `value / conflictValue`), current record, source document, period, received, and a status badge.

**Claim drawer** has three shapes:

1. **Pending** — proposed vs current value comparison, source excerpt, capture method, source document link, confirm-source checkbox, optional correction field with reviewer note, and Accept / Reject / Mark not applicable. A correction labels the primary action *Verify correction* and shows a note that the original is preserved.
2. **Conflict** — two side-by-side source cards (Company reported vs Public filing), each with its own value, excerpt and document link, and its own keep/use action, both gated by the confirm checkbox. Nothing is averaged, nothing is last-write-wins.
3. **Decided** — a decision record naming the reviewer, date and note.

Every state renders the **revision history** for that company and metric, with prior → new, reason, reviewer and date, under an *Append-only record* heading. On acceptance a confirmation banner shows the company and the before/after values.

Read-only roles see the claim but get an explanatory panel instead of decision controls.

### 5.10 Activity log
Searchable append-only feed. Each entry shows a kind-coloured icon (review, document, email, meeting, company, deal), title, description, a link into the related company record, and a medium-format date. Every mutation in the product writes here — decisions, creations, stage moves, filings, alert changes, completions, imports and invitations.

### 5.11 Data operations (Administrator)
KPI row: jobs today, idempotency rate, items awaiting human review. Live-worker indicator.

- **Worker queue** — job rows with kind icon, title, detail, status pill (complete / running / queued / failed), attempts and duration, the idempotency key in monospace, and a retry control that preserves the key. Side notes explain that Claude never publishes a figure, that no data trains a model, and how deduplication works.
- **Integrations** — Gmail, Dropbox, Granola and Anthropic Claude cards with description, a detail line stating the mechanism, last-sync time, sync-now and connect/disconnect controls.
- **Intake staging** — link-parsing input plus a staged table of PDF, CSV and link imports showing source, company, normalised key, confidence, claims found, and SHA identity or a duplicate flag. Duplicates cannot be approved. Approving creates a `mapped` deal and removes the row.
- **Pipeline config** — the seven steps, each renamable inline, reorderable up/down, and retirable or restored with a reached-count; plus a custom-field manager supporting text, number, date, dropdown, checkboxes and yes/no.

### 5.12 Settings
Profile card with avatar, name, email, role and firm. **Access & invitations** (Administrator): a five-role matrix stating each role's scope, marking the current user, offering an invite action that records the invitation in the activity log with an MFA-enrolment note, and per-company viewer grants as toggle chips. **Preferences**: language, email notifications, daily digest. **AI & data privacy**: Claude's grounding and no-training position; session security stating hashed role-bound tokens and invitation-only MFA enrolment. **Demo data**: browser-only disclosure and reset.

### 5.13 Founder portal
Replaces the workspace entirely — separate top bar with wordmark, *Secure founder portal* marker, language toggle and sign-out; separate sidebar with the company monogram, four-item navigation, an isolated-access notice and the founder's account card.

- **Company home** — four metric cards showing verified values or *Missing* with an explicit *Not yet reported* state; reporting status card with a due-date tile, period, frequency rule (*quarterly · due 15 days post-period*), completeness meter, and the note that missing values are never shown as zero and nothing publishes without review; open requests list; guidance on what makes a strong update.
- **Submit report** — two numbered steps (operating period and cash; headline metrics), operating-update textarea, and a source-document attachment. Context banner when responding to a specific firm request, clearable. Validation requires ARR, growth and the narrative. Footer states the submission enters a human review queue and that original values are preserved. Sidebar checklist plus a *what happens next* explainer.
- **Firm requests** — cards per request with status (Open / Submitted / Complete), detail, due date, requester, and a respond action that preloads the report form in request context.
- **My files** — submitted sources with review state.

On submit: a document record is created, a `pending` claim is created with capture method *Founder portal · structured form* and a digest acting as the idempotency key, activity is written, the company's alert state clears, and a success banner explains that the figure will not appear as verified until a reviewer accepts it.

### 5.14 Assistant
Docked bottom-right on every workspace page; collapses to a pill launcher. Header shows a live indicator and *Source-grounded · Claude*; a standing banner reads *No training on firm data · sources cited · review required*.

Empty state offers four suggestion prompts. Answers resolve against local records and always include a **Sources** block — document citations are buttons that open the document drawer; record and queue citations render as labels. Footer: *Answers are decision support, not verified facts.*

Question routing covers company lookups, overdue reporting, pipeline state, review/conflict state, and a capability fallback. Every answer reports Missing as Missing and never presents an unreviewed figure as established.

### 5.15 Global search
`Cmd/Ctrl + K` opens a dialog searching companies, deals, documents, meetings and contacts. Results show an icon, label and context line; `Enter` opens the first. With an empty query it offers quick links into Companies, Deal pipeline and the Review queue. Footer states the keyboard affordances.

---

## 6. Data model

```ts
Company   { id, name, initials, brand, ink, sector: Localized, stage: Localized,
            location, kind: 'portfolio'|'watchlist', website, description: Localized,
            founded, owner, verified: VerifiedMetrics, updatedAt,
            reportingStatus: 'complete'|'on_track'|'due_soon'|'overdue'|'missing'|'conflict',
            period: Localized, dueDate, lastReport: string|null,
            completeness: number, reportingFrequency: 'quarterly'|'semiannual' }

Deal      { id, name, companyId, sector, round, amount, stage: DealStage, owner,
            updatedAt, description, brand, ink, priority?, source?, nextStep?,
            team?: string[], tasks?: { id, label: Localized, done }[] }

ReviewItem{ id, companyId, metric: Localized, metricKey, value, previousValue,
            sourceDocId, excerpt: Localized, receivedAt,
            status: 'pending'|'verified'|'rejected'|'not_applicable'|'conflict',
            decidedBy?, decidedAt?, captureMethod?, reviewedValue?,
            reviewerNote?: Localized, conflictValue?, conflictDocId?,
            conflictExcerpt?, digest? }

DocumentRecord { id, title, companyId, dealId?, kind, extension, size,
                 uploadedBy, uploadedAt, summary: Localized, fileUrl? }

InboxItem { id, sender, senderEmail, subject, preview, body, companyId, dealId?,
            confidence: number|null, receivedAt, attachmentId?, reviewIds: string[],
            processed, unread, mailbox?: 'company'|'dealflow' }

Meeting   { id, title, companyId, kind: 'board'|'founder'|'internal'|'update',
            startsAt, duration, attendees, location, notes: Localized, completed }

Revision  { id, companyId, metric: Localized, previousValue, newValue,
            reviewer, date, reason: Localized }

ActivityItem { id, title: Localized, description: Localized, kind, companyId?, date }

PipelineStep { id: DealStage, label: Localized, active, reached }
Integration  { id, name, description: Localized, status, lastSync, detail: Localized }
AutomationJob{ id, kind, title, detail, status, startedAt, duration, attempts, idempotencyKey }
StagedImport { id, fileName, source: 'pdf'|'csv'|'link', companyName, normalizedKey,
               hash, found, confidence, duplicate, importedAt }
DueRequest   { id, companyId, title, detail, dueDate, status, requestedBy }
```

`Localized` is `{ en: string; fr: string }`. Every human-readable field written by the system uses it, which is what makes the one-language-per-screen rule enforceable at the type level rather than by discipline.

`DealStage` is `'mapped' | 'analyse' | 'first_call' | 'diligence' | 'ic' | 'invested' | 'no_go'`.

---

## 7. State and persistence

| Concern | Mechanism |
|---|---|
| Signed-in role | `sessionStorage`, cleared on sign-out |
| Language, records, preferences | `localStorage`, 13 keys under `alinea-demo-` |
| Uploaded files | Session-scoped `URL.createObjectURL`; the URL is stripped before persisting so no stale `blob:` reference survives a reload |
| Derived data | Never persisted — pending counts, sorted activity, future meetings and search results are computed |
| Seed hydration | Versioned keys (`companies-v2`, `deals-v2`) with a length guard, so an older cached set cannot mask new seed data |
| Reset | Settings → Reset demo data restores every seed array and clears derived keys |

---

## 8. Internationalisation contract

- 367 copy keys in `src/i18n.ts`, each a `bi(en, fr)` pair; `t(lang, key)` is the only accessor and is typed against the key union, so a typo is a compile error.
- Record-level content uses `Localized`; `localized(value)` resolves it.
- Dates and times: `Intl.DateTimeFormat` with `fr-FR` / `en-US`. Relative dates: `Intl.RelativeTimeFormat` with `numeric: 'auto'`, producing *yesterday* / *hier*.
- Inline helpers (`txtLocal`, `txt`) exist for strings local to a component; both require an EN and an FR argument, so a monolingual string will not compile without an obvious choice.
- Numbers, currency symbols and percentages are authored per language rather than formatted from a single source, because `€8.4M` and `8,4 M€` are both correct and the brief forbids mixing.

**Production requirement:** a CI test must fail the build on any key missing either language. In the prototype the type system provides the equivalent guarantee.

---

## 9. Interaction and motion

Motion is restricted to state transitions and never decorates a static layout:

| Element | Behaviour |
|---|---|
| Page change | 10px rise and fade, 200ms, `AnimatePresence` cross-fade |
| Detail drawer | Spring slide from the right (damping 30, stiffness 320) with a scrim fade |
| Modal / search dialog | Scale-and-rise entry, bottom-sheet treatment under 620px |
| Popovers and create menu | `pop-in` keyframe, 180ms |
| Toast | Rise and settle, auto-dismiss at 3.8s, manual close |
| Sign-in photograph | One 18s scale-settle on load, then still |
| Rows, cards, buttons | Border, background, translate and gap transitions on hover; chevrons shift on row hover |

Everything is disabled under `prefers-reduced-motion: reduce`. Focus is visible everywhere via a 2px accent outline with 3px offset, including custom checkboxes and table rows.

---

## 10. Responsive behaviour

| Breakpoint | Changes |
|---|---|
| 1280px | Overview grid narrows; page padding tightens; toolbars wrap |
| 1050px | Sidebar to 218px; overview side rail becomes a two-column band under the main column |
| 820px | Sidebar becomes off-canvas with a scrim; sign-in photograph compresses to a 155px band; mobile menu and search controls appear; desktop search field hides |
| 700px | Stat strips reflow to two columns; toolbars stack; board scrolls horizontally; job and staging tables drop low-priority columns; modals become bottom sheets; assistant and toasts reposition |
| 620px | Table toolbars reverse to search-first; meeting rows drop time and badge; settings rows stack |
| 390px | Role picker to two columns; low-priority table cells hide; comparison cards compress |

Verified at 390px and 1440px with zero horizontal document overflow.

---

## 11. Accessibility

- Landmark roles: `dialog` with `aria-modal` on drawers, modals, search and the assistant; `tablist` / `tab` with `aria-selected` on every tab strip; `switch` with `aria-checked` on toggles; `status` on toasts
- Every icon-only control carries an `aria-label`, including row chevrons, retries, copy actions, collapse and close
- Table rows that open records are focusable with `Enter` handlers
- Company monograms expose the company name as an accessible label
- Colour is never the sole signal: status badges pair a tint with a word, reporting dots pair with a text badge, and job status pairs a dot with a label
- Contrast is maintained on the dark sign-in scrim by a four-stop gradient rather than a single overlay

---

## 12. Verification log

Workflows exercised end to end in a headless browser at 1440×960 and 390×844, with zero console errors:

1. Role autofill for all five roles; credential rejection; EN/FR switch pre- and post-authentication
2. Viewer scoping — ungranted company absent from the list, inline deal controls disabled
3. Reviewer correction — accept with a corrected value produces a revision, a confirmation banner and an activity entry
4. Conflict reconciliation — both sources gated behind the confirm checkbox, either value selectable
5. Inbox sync — arrival, domain match, document filing, pending claim, no publication
6. Dealflow intake — approve creates a `mapped` deal and links the message; pass reply toggles EN/FR and copies without sending
7. Founder submission — isolated shell, validation, request context, claim created as pending, alert cleared
8. Creation flows — company, deal (with company auto-match), meeting (title-based auto-match), document upload and download, note
9. Operations — job retry preserves the idempotency key, integration sync, duplicate import blocked, pipeline step rename/reorder/retire, custom field add/remove
10. Search — `Cmd/Ctrl + K`, `Enter` opens the first result, contact results included
11. Alerts — acknowledge, snooze, reopen on new evidence
12. Sidebar collapse persistence; mobile off-canvas navigation; settings preferences and reset

Build: `tsc --noEmit` clean; `vite build` produces a single 708 kB HTML document (202 kB gzipped).

---

## 13. Known limitations

Stated plainly, because the gap between prototype and product is the point of the exercise:

- Authentication is simulated; there is no password hashing, no session token, no origin check and no MFA
- No server, database or queue — ingestion is scripted, so idempotency is displayed rather than exercised against real duplicates
- Extraction is seeded; there is no model call, no locator extraction and no accuracy measurement
- The assistant pattern-matches over local records; it is not an LLM call and its citations are limited to seeded documents
- Connectors are state objects; no OAuth, no polling, no Granola matching logic
- No dark mode, no per-user resizable dashboard modules, no board drag-and-drop, no saved filter views, no PDF generation
- `localStorage` is per browser and per origin — it is a demo store, not persistence
- Single workspace; no multi-fund separation, no per-company grant enforcement on deals (the pipe is shared, as specified)

---

## 14. Production delta

What changes when a real backend arrives, and what must not:

| Prototype | Production | Must not change |
|---|---|---|
| `localStorage` | PostgreSQL, EU region, versioned migrations | The append-only audit ledger and revision chain |
| Simulated role switch | Invitation-only accounts, argon2id passwords, hashed rotating session tokens, separate staff and founder session systems | The five-role matrix and per-company grant enforcement at the data layer |
| Scripted inbox sync | Gmail read-only connector, 2-minute poll, Message-ID keyed, resumable job queue | Extraction stages a pending claim; nothing auto-publishes |
| Seeded claims | Locator-first extraction with SHA-256, page/cell locator, source span, model and prompt version | Provenance stored separately from approval |
| Pattern-matched assistant | Claude via a gateway logging prompt version, tokens and cost per call | Permission-scoped actions recorded as the user; every answer cites its records |
| Object URLs | EU object storage, immutable originals, grant-checked downloads | Missing renders as Missing in every surface, including exports |
| Single language state | Full i18n with a CI test failing on a missing key | One language per screen, system strings stored bilingually |

---

## 15. File map

| Path | Lines | Responsibility |
|---|---:|---|
| `src/App.tsx` | 668 | Shell, routing, RBAC gates, all workspace pages, drawers, modals, overlays |
| `src/i18n.ts` | 373 | 367 bilingual copy keys and the typed accessor |
| `src/data.ts` | 241 | Domain types and seed records |
| `src/extended.css` | 228 | Reporting, pipeline, review, operations, assistant and founder styling |
| `src/workspace-data.ts` | 158 | Pipeline steps, integrations, jobs, staging, requests, revisions, audit, custom fields |
| `src/OperationsPage.tsx` | 144 | Administrator data-operations centre |
| `src/FounderPortal.tsx` | 110 | Isolated external-founder experience |
| `src/Assistant.tsx` | 81 | Source-citing assistant dock |
| `src/index.css` | 559 | Core design system, shell, tables, drawers, responsive rules |
| `src/main.tsx` | 11 | Entry point |
