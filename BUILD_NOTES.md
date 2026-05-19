# ProvenQuote B2B — Build Notes

**Date:** 2026-05-14  
**Built by:** Echo (ECH0-01) — subagent  
**Build status:** ✅ Production build clean (zero TypeScript errors, zero lint errors)

---

## What Was Built

### 1. Business Profile Builder
**File:** `app/(dashboard)/dashboard/profile/page.tsx`  
**Status:** ✅ Fully wired (localStorage state, no Supabase yet)

- **6-section form** with left nav: Basic Info, Service Area, Services, Certifications, Insurance & License, Team
- **Profile completion score** (0–100%) with gamified badge checklist — pushes contractors to fill out critical fields
- **Quick-add certifications** for common roofing certs (GAF Master Elite, Owens Corning Platinum Preferred, HAAG, etc.)
- **Service CRUD** with pricing range (min/max) and description per service
- **Team member CRUD** with name, role, bio
- **Auto-slug generation** from business name
- **Payment methods selector** (multi-select toggles)
- **Insurance & license section** with coverage amount, expiry, policy type
- **"Preview Profile" button** links to `/contractor/[slug]` (public profile route — future)
- **Save/auto-save** to `localStorage` key `pq_contractor_profile`
- Profile URL format: `provenquote.ai/contractor/[slug]`

---

### 2. Leads Inbox (Upgraded)
**File:** `app/(dashboard)/dashboard/leads/page.tsx`  
**Status:** ✅ Full upgrade over previous version

Previous version had a basic 2-tab interface (available leads / my leads). Replaced with:

- **Full qualification data** on every lead card:
  - Urgency badge (Critical / High / Medium / Low) with color coding
  - Insurance flag + "Adjuster Visited" badge
  - "Wants Inspection" badge
  - Budget range badge
  - Damage cause
  - Roof age + size in sqft
- **Lead scoring algorithm** (0–100 score based on: urgency, insurance status, adjuster visited, budget, wants inspection)
- **Status workflow** buttons: New → Contacted → Bid Sent → Won / Lost (inline on each card, no modal needed)
- **Expandable detail panel** with: contact info (phone/email/zip), full qualification table, notes textarea, "Create Bid" CTA, "Call Now" button
- **Pipeline filter tabs** (All / New / Contacted / Bid Sent / Won / Lost) with per-status counts
- **Sort** by lead score or newest first
- **"Create Bid" button** passes lead context via URL params to `/dashboard/bids`

---

### 3. Bids & Proposals
**File:** `app/(dashboard)/dashboard/bids/page.tsx`  
**Status:** ✅ New page — fully functional

- **3-step bid builder modal**: Info → Line Items → Review
- **Template system**: 3 pre-built templates (Full Replacement, Hail Repair, Inspection)
- **Line item editor**: description, qty, unit price — dynamic total calculation
- **Scope of work + internal notes** fields
- **Bid validity days** selector (7/14/30/60 days)
- **Save as Draft or Send** directly from the review step
- **Status pipeline**: Draft → Sent → Viewed → Accepted / Rejected
- **Summary stats**: total pipeline value, won revenue, win rate
- **Expandable bid rows** showing full line items, scope, notes
- **"Send Bid" action** directly from expanded row for draft bids
- **"Download PDF" stub** (wiring to PDF generation is a separate phase)
- Mock data: 4 bids in various states for demo

---

### 4. Ads Manager
**File:** `app/(dashboard)/dashboard/ads/page.tsx`  
**Status:** ✅ New page — fully functional

#### Tab 1: Active Campaigns
- Campaign cards with: name, slot, hub, status badge, ad preview (headline/body/CTA)
- Performance metrics: impressions, clicks, CTR per campaign
- Budget progress bar (spent / total)
- Pause/Resume toggle on each campaign

#### Tab 2: Browse Ad Slots
- **20 ad slots** across Roofing/HVAC hubs and multiple page types:
  - Hub Page (Hero Banner, Contractor Card Feature, Services Banner, FAQ Inline, etc.)
  - Cost Guide (Hero Strip, Pricing Sidebar)
  - FAQ Page (Top Banner, Mid Banner)
  - Storm Damage (Hero CTA, Checklist Sidebar)
  - Insurance Page (Feature slot)
- Per-slot stats: monthly impressions, avg CTR, CPM
- Available/Taken indicator
- Filters: by niche, by page type, show/hide unavailable
- **Campaign builder modal** on slot click:
  - Slot stats displayed (impressions, CTR, CPM)
  - Campaign name, headline (60 char limit), body (120 char limit), CTA
  - Budget input + date range
  - **Estimated performance projection** (calculated from budget / CPM * CTR)
  - Saves to campaign list as "Draft"

---

### 5. Updated Sidebar Navigation
**File:** `app/(dashboard)/layout.tsx`  
**Status:** ✅ Updated

- Expanded from flat 6-item nav to **grouped nav** with section labels
- Groups: Leads & Sales, Markets, Profile, Insights, Account
- **Active route highlighting** using `usePathname()` — correct highlight for all new routes
- **Lead count badge** (6) on Lead Inbox nav item
- Sidebar width: 256px (up from 240px) to accommodate longer labels
- Updated user avatar placeholder to "Apex Roofing Co."

---

## Architecture Decisions

### State Management
All pages use **React `useState`** with mock data for now. No Supabase wiring.

- Profile data persists via **`localStorage`** (key: `pq_contractor_profile`)
- Leads, bids, campaigns are in-memory (reset on page refresh) — Supabase wiring is Phase 2

### Data Model (ready for Supabase)
Each page's data types are fully typed in TypeScript. When wiring to Supabase:

| Page | Suggested table |
|------|----------------|
| Profile | `contractor_profiles` |
| Leads | `leads` (from consumer form submissions) |
| Bids | `bids` + `bid_line_items` |
| Campaigns | `ad_campaigns` |

### Lead Scoring Algorithm
```
score = 0
+ urgency: Critical=30, High=20, Medium=10, Low=5
+ hasInsurance: +15
+ insuranceAdjusterVisited: +20
+ wantsInspection: +10
+ budget known: +5–15 based on range
```
Implemented inline in the `calcScore()` style function using field weights. Easy to extract to `lib/leadScore.ts` in Phase 2.

---

## What's Wired vs. Stubbed

| Feature | Status |
|---------|--------|
| Business profile form (all sections) | ✅ Wired (localStorage) |
| Profile completion score | ✅ Live |
| Lead cards with all qualification data | ✅ Mock data |
| Lead status workflow | ✅ Live (in-memory) |
| Lead scoring | ✅ Live (static formula) |
| Bid builder (3-step modal) | ✅ Live (in-memory) |
| Bid templates | ✅ Live (3 templates) |
| Bid status progression | ✅ Live (in-memory) |
| Bid PDF download | 🔲 Stub (button exists, no PDF logic) |
| Ads campaign builder | ✅ Live (in-memory) |
| Ad slot browse + filter | ✅ Live |
| Campaign performance metrics | ✅ Mock data |
| Supabase wiring (all) | 🔲 Phase 2 |
| Public profile page (`/contractor/[slug]`) | 🔲 Phase 2 |
| Real lead flow from consumer hub | 🔲 Phase 2 |
| Storm alerts / Roofing niche sub-app | 🔲 Phase 3 |
| Email/SMS lead notifications | 🔲 Phase 3 |

---

## Files Modified / Created

| File | Action |
|------|--------|
| `app/(dashboard)/layout.tsx` | Modified — expanded nav |
| `app/(dashboard)/dashboard/leads/page.tsx` | Rewritten — full upgrade |
| `app/(dashboard)/dashboard/profile/page.tsx` | **Created** |
| `app/(dashboard)/dashboard/bids/page.tsx` | **Created** |
| `app/(dashboard)/dashboard/ads/page.tsx` | **Created** |

No other files were modified. All existing pages (dashboard, analytics, billing, leases, markets) are untouched.

---

## Next Steps (Phase 2)

1. **Supabase wiring** — connect leads, bids, profile, campaigns to real DB tables
2. **Consumer → B2B lead pipeline** — when a homeowner submits a form on a hub page, create a `leads` row and notify the contractor
3. **Public contractor profile** — `app/(public)/contractor/[slug]/page.tsx`
4. **Roofing niche sub-app** — `/dashboard/roofing/` with storm alerts, inspection queue, insurance claim tracker
5. **Real ad impression/click tracking** — integrate with hub page render to count slot exposure
6. **Bid PDF generation** — use `@react-pdf/renderer` or Puppeteer
7. **Email/SMS notifications** — Resend + Twilio for new lead alerts
