# alinea — Portfolio & Dealflow Intelligence Platform

**One verified record of every portfolio company and every deal. Nothing counts as fact until a human has reviewed it.**

A private, bilingual (English / French) web platform for a venture investment firm. It reads company reports and deal emails as they arrive, files meetings and documents against the right company on its own, and keeps every extracted figure quarantined in a review queue until a person accepts, corrects or rejects it.

> **Status:** interactive front-end prototype. No database, no real authentication, no outbound email. All data lives in `localStorage`. Built to prove the interaction model, the review workflow and the bilingual behaviour before a production build is commissioned. See `proposal/GoSmartEx-Portfolio-Dealflow-Proposal.pdf` for the priced production plan.

---

## Contents

- [Why it exists](#why-it-exists)
- [The seven principles](#the-seven-principles)
- [Demo accounts](#demo-accounts)
- [Quick start](#quick-start)
- [Feature tour](#feature-tour)
- [Roles and permissions](#roles-and-permissions)
- [Founder portal](#founder-portal)
- [Data operations centre](#data-operations-centre)
- [Assistant](#assistant)
- [Architecture](#architecture)
- [Data model](#data-model)
- [Design system](#design-system)
- [What is deliberately not here](#what-is-deliberately-not-here)
- [Roadmap to production](#roadmap-to-production)

---

## Why it exists

A six-person investment team running 17 portfolio companies and a live dealflow pipe ends up with the same number written down in four places: a founder's PDF, a Notion page, a board deck, an analyst's spreadsheet. Three of them are stale. Nobody knows which one is true, or who checked it.

alinea makes the question "is this figure true?" structurally answerable. Every number carries its source document, its locator, its period, its currency, and how it was captured — stored separately from who approved it and when. Anything read automatically is staged, not published. A correction creates a new revision and keeps the original. A conflict between two sources is shown side by side until a person reconciles it. An unreported value renders as **Missing**, never as `0`.

---

## The seven principles

These are enforced in the interaction design, not just stated on a settings page.

| Principle | How it shows up in the product |
|---|---|
| **Provenance** | Every claim opens its source excerpt, capture method, period and review history from the company record |
| **Human review** | Extraction stages a claim; only Accept / Correct / Reject / Not applicable promotes it |
| **Append-only history** | Corrections create revisions; the prior value is preserved and diffable in the company Financial KPIs tab |
| **Missing is not zero** | Unreported metrics render as `Missing` in tables, drawers, the founder portal and the assistant |
| **Idempotent ingestion** | Emails keyed on Message-ID, documents on SHA-256, deals on a normalised name key — visible in Data operations |
| **Editable in place** | Deal table cells edit on click without opening the record; system dates stay read-only |
| **One language per screen** | EN or FR everywhere, including dates, relative times and system-written strings. Never mixed |

Plus: **no outbound sending.** The platform drafts; a person sends from their own mail.

---

## Demo accounts

Select a role on the sign-in screen to autofill its credentials. Password for every account: **`demo1234`**.

| Role | Email | What it unlocks |
|---|---|---|
| **Administrator** | `camille@alinea.vc` | Everything, including Data operations and access & invitations |
| **Reviewer** | `noah@alinea.vc` | Decides the review queue; cannot create records |
| **Editor** | `elise@alinea.vc` | Creates and edits records; cannot decide claims |
| **Viewer** | `luc@alinea.vc` | Read-only, scoped to three granted companies |
| **Founder** | `sophie@canopy.earth` | Isolated portal — Canopy only |

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # single self-contained dist/index.html
npm run preview
```

Built with React 19, TypeScript, Vite 7 and Tailwind 4, plus `lucide-react` for iconography and `framer-motion` for transitions. The production build inlines JS and CSS into one HTML file via `vite-plugin-singlefile`, so it can be opened from disk or hosted anywhere static.

**Keyboard:** `Cmd/Ctrl + K` opens global search. `Esc` closes any drawer, modal, popover or the mobile navigation.

**Reset:** Settings → Demo data → *Reset demo data* restores every seeded record.

---

## Feature tour

### Overview
Greeting keyed to time of day, a four-figure stat strip (portfolio size, reporting health, claims awaiting review, active dealflow), a *Needs your attention* queue of unreviewed figures, the verified-ARR portfolio snapshot, a reporting calendar sorted by due date, recent activity, and the next meeting.

### Companies — 17 portfolio + 1 watchlist
Reporting dashboard with lifecycle status, period, due date, deterministic completeness percentage, last report date and verified ARR. Filters by record type and reporting status; search across name, sector and location. Each row opens a drawer with **nine tabs**:

`Executive summary` · `Financial KPIs` · `Traction & sales` · `Corporate & governance` · `Files & correspondence` · `Notifications` · `Calls` · `Contacts` · `History`

Click any figure to expand its claim inline — capture method, last verified date, source link, review history. Notifications hold alerts that can be **acknowledged** or **snoozed**, and reopened on new evidence (arriving mail or a founder submission clears them automatically).

### Deal pipeline — 12 opportunities, 7 steps
`Mapped → To analyse → First call → Due diligence → IC review → Invested → No go`

- **Board view** — columns with counts, priority pills, round, amount, next step, owner and last activity; horizontally scrollable on small screens
- **Table view** — row selection, inline editing of amount / stage / owner without opening the record, bulk stage moves, CSV export
- **Deal record** — eight tabs: `Overview` `Calls` `Due diligence` `Q&A` `Files` `Team` `Tasks` `Activity timeline`
- Dealflow summary strip with active opportunities, diligence count, IC count, committed capital and pipeline health

### Smart inbox — two mailboxes
Switch between the **Company inbox** and the shared **Dealflow mailbox**. Each message shows its auto-filing decision and match confidence, the extracted figures (explicitly marked as *not part of the verified record until reviewed*), attachments, and manual re-filing to any company or deal.

Dealflow intake decisions: **Approve & open deal** (queues enrichment), **Draft pass reply** (bilingual, EN/FR toggle, copy only — never sent), or **Attach to existing deal**.

*Sync new mail* simulates an arrival end to end: a message lands, is matched to a company by domain, its report is filed to the document library, and its extracted ARR goes to the review queue as pending — never published.

### Review queue
Tabs for Pending, Conflicts, Verified, Rejected and Not applicable. The conflict case (Basis) shows two ARR values from two sources — company-reported €8.1M and a public registry €7.7M — side by side with both excerpts, and *Keep this value* / *Use this value* buttons that stay disabled until the reviewer confirms they checked the source.

Decisions: **Accept** (optionally with a correction that creates a revision), **Reject**, **Mark not applicable**. Every decision writes an activity entry with actor, timestamp and prior value, and the revision history is rendered in the drawer.

### Meetings, Documents, Activity
- **Meetings** — upcoming / past / all, filed against a company, mark-complete with audit trail
- **Documents** — library with real file upload (SHA-style record, session-scoped object URL), download of the original or a generated source summary, extracted-claim linkage, provenance
- **Activity log** — searchable append-only feed of every mutation across the workspace

### Global search
`Cmd/Ctrl + K` across companies, deals, documents, meetings and contacts, with `Enter` opening the first result.

---

## Roles and permissions

| Capability | Admin | Reviewer | Editor | Viewer | Founder |
|---|:--:|:--:|:--:|:--:|:--:|
| Browse granted records | ● | ● | ● | ◐ | own company only |
| Create company / deal / meeting / document / note | ● | — | ● | — | — |
| Inline-edit deal table, move pipeline stage | ● | — | ● | — | — |
| Approve dealflow intake, draft pass reply | ● | — | ● | — | — |
| Accept / correct / reject / mark N-A a claim | ● | ● | — | — | — |
| Reconcile a conflict | ● | ● | — | — | — |
| Data operations: worker queue, integrations, intake staging, pipeline config | ● | — | — | — | — |
| Invitations, role matrix, per-company viewer grants | ● | — | — | — | — |
| Submit periodic report, answer firm requests | — | — | — | — | ● |

◐ Viewer sees only companies granted in Settings → *Per-company grants* (default: Canopy, Luma Health, Mosaic). Opening an ungranted company by any route shows an *Access restricted* panel instead of the record. Read-only roles get disabled controls, not hidden ones, so the product's shape stays legible.

---

## Founder portal

Sign in as `sophie@canopy.earth` and the workspace chrome disappears entirely — no sidebar, no pipeline, no other companies. An isolated shell with its own navigation:

- **Company home** — verified metrics with *Missing* rendered honestly, reporting status and due date, completeness meter, open requests
- **Submit report** — structured two-step form (period + cash, then ARR + growth + operating update + source attachment). Blank fields submit as Missing, never zero
- **Firm requests** — the three standing information requests from the investment team, each answerable
- **My files** — what the founder has submitted and its review state

A submitted report creates a document record, a pending claim with capture method *Founder portal · structured form*, an activity entry, and clears any snoozed alert for that company. It does **not** update the verified record.

---

## Data operations centre

Administrator-only. Four tabs:

- **Worker queue** — six background jobs (mail reading, extraction, Granola sync, enrichment, Dropbox mirroring, reply drafting) with status, attempts, duration and their **idempotency keys**. Retry re-runs with the same key
- **Integrations** — Gmail (read-only, Message-ID dedup), Dropbox (per-deal folder mirroring, SHA-256 identity), Granola (hourly, matched by attendee email and domain), Anthropic Claude (zero training on firm data, EU residency, cited answers). Connect / disconnect / sync each
- **Intake staging** — parsed PDF, CSV and shared-link imports held in a table before anything is created. Duplicate rows are flagged from the normalised name key and blocked. Paste a link to parse a new candidate
- **Pipeline config** — rename, reorder, retire and restore the seven steps; manage custom fields across six types

---

## Assistant

Docked to every page. Answers questions about the portfolio, reporting, the pipeline and conflicts, and **cites the records it used** — document citations open the document drawer. Every answer is framed as decision support, with an explicit note that it is not a verified fact, and a standing banner: *No training on firm data · sources cited · review required.*

---

## Architecture

```
src/
├── App.tsx              workspace shell, routing, all pages, drawers, modals, RBAC gates
├── FounderPortal.tsx    isolated external-founder experience
├── OperationsPage.tsx   admin data-operations centre
├── Assistant.tsx        source-citing assistant dock
├── data.ts              domain types + seed records (companies, deals, claims, docs, mail…)
├── workspace-data.ts    pipeline steps, integrations, jobs, staging, requests, revisions, audit
├── i18n.ts              367 bilingual copy keys
├── index.css            core design system
└── extended.css         reporting, pipeline, review, operations, assistant, founder portal
```

State lives in `App.tsx` and flows down; there is no external store. Thirteen `localStorage` keys under the `alinea-demo-` prefix persist language, companies, deals, documents, inbox, meetings, reviews, activity, notes, revisions, pipeline steps, alert state, viewer grants and preferences. Uploaded file object URLs are stripped before persisting so a stale `blob:` reference can never survive a reload. The signed-in role lives in `sessionStorage` and clears on sign-out.

---

## Data model

| Entity | Count in seed | Notes |
|---|---:|---|
| Companies | 18 | 17 portfolio + 1 watchlist; reporting status, period, due date, completeness, frequency |
| Deals | 12 | Across all 7 stages; priority, source, next step, team, tasks |
| Review claims | 7 | 3 pending, 1 conflict, 1 verified, 1 rejected, 1 not applicable |
| Documents | 6 | Report / deck / memo / notes, with provenance and extracted-claim links |
| Inbox messages | 4 | Company and dealflow mailboxes, match confidence, filing state |
| Meetings | 4 | Typed board / founder / internal / update |
| Revisions | 3 | Prior value → new value, reviewer, reason |
| Worker jobs | 6 | With idempotency keys and attempt counts |
| Integrations | 4 | Gmail, Dropbox, Granola, Claude |
| Pipeline steps | 7 | Renamable, reorderable, retirable |
| Custom fields | 5 | Six supported types |

A claim carries: metric (bilingual), metric key, proposed value, prior value, source document, source excerpt, capture method, received timestamp, status, reviewer, decision timestamp, optional reviewed value, reviewer note, and — for conflicts — the competing value, competing document and competing excerpt.

---

## Design system

Manrope for display, DM Sans for body. Light theme only; ink-green `#1c2922` on paper white, with a muted sage-and-brass accent set drawn from the company marks rather than a single brand colour. Company identity is carried by a tinted monogram tile (`brand` / `ink` pair per record), so 18 companies stay visually distinguishable without icon noise.

Three elevation levels: flat hairline tables, 1px bordered cards, and shadowed floating layers (drawers, modals, popovers, assistant). Motion is confined to state changes — drawer slide on a spring, page fade, popover pop, toast rise — and is fully disabled under `prefers-reduced-motion`.

Responsive from 390px to 1600px: the sidebar becomes an off-canvas drawer with a backdrop, the overview's two columns stack, the board scrolls horizontally, table toolbars reflow, modals become bottom sheets, and the founder portal collapses to a single column.

---

## What is deliberately not here

Honest limits of a prototype:

- No database, server, authentication or session security — role switching is simulated client-side
- No real Gmail, Dropbox, Granola or Anthropic connections; ingestion is simulated and connectors are state only
- Extraction is seeded, not performed — there is no model call and no accuracy measurement
- Assistant answers are pattern-matched over local records, not generated; citations point at real seeded documents
- Document downloads return the uploaded file for the current session, or a generated source summary for seeded records
- No dark mode, no per-user resizable dashboard modules, no drag-and-drop on the board
- No PDF generation of deal profiles or investment memos
- Single workspace; no multi-fund or multi-entity separation

---

## Roadmap to production

Eight acceptance-gated work packages, 2,600 hours, 26 weeks — fully specified and priced in `proposal/GoSmartEx-Portfolio-Dealflow-Proposal.pdf`:

1. **P0** Discovery, architecture, programme management, handover
2. **M1** Accounts, roles, data model, design system
3. **M2** Document library, mail intake, review queue
4. **M3** Portfolio intelligence
5. **M4** Dealflow: pipe, inbox, board, table, configuration
6. **M5** Founder portal
7. **M6** Assistant
8. **M7** Granola, Dropbox, hardening, cutover

---

## Related documents

| File | What it is |
|---|---|
| `project.md` | Full feature and behaviour specification, screen by screen |
| `sales/go-to-market.md` | ICP, positioning, LinkedIn discovery playbook, outreach templates, packaging |
| `proposal/proposal.html` | Editable source of the client proposal |
| `proposal/GoSmartEx-Portfolio-Dealflow-Proposal.pdf` | 22-page priced proposal |
| `proposal/outreach-email.md` | Short-form quote transmittal email |
