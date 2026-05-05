# PRODUCT.md — ProvenQuote Operating Rules

This document defines how ProvenQuote works at a product level. It is the source of truth for build decisions.

---

## Page States

Every niche × city combination is in one of two states:

### UNLEASED
- Page is live, ranking, collecting leads
- Content: niche guides, cost breakdowns, FAQs, what to look for — useful to humans and AI
- No business names, no phone numbers, no reviews, no links to area businesses
- Quote request form sends leads to our internal queue
- Subtle B2B CTA: businesses can see this page and buy in
- We do not help anyone rank who has not paid

### LEASED
- One business has exclusive access to this niche + city
- Their branding, contact info, reviews, photos, credentials on the page
- Page still follows our SEO rules — they cannot change anything that affects ranking
- Leads from the page go directly to them
- Their lease can be terminated if they fail consumer quality standards

---

## Leasing Rules

- **One business per niche per city.** No exceptions.
- **No lead reselling.** One buyer, one lead.
- **No favoritism.** A brand new company can lease the same as a 20-year-old company. We are infrastructure, not a referral network.
- **No display without payment.** No business info, reviews, or links appear on any page until that business has an active lease for that slot.
- When a lease ends or is terminated, the page reverts to UNLEASED state immediately.

---

## Unleased Page Content Strategy

Goal: rank and convert without benefiting any unpaid business.

Use:
- General niche education ("What does a landscaper do?", "How much does landscaping cost in [city]?")
- Seasonal/local context ("Best time for lawn care in [city]")
- Buying guides ("How to choose a landscaper")
- Cost estimators (interactive or static)
- FAQ schema for AI search visibility
- Quote request form with lead capture

Do NOT use:
- Business names, addresses, phone numbers
- Reviews from area businesses
- Links to area business websites
- Anything that sends a user to a competitor or an unpaid business

---

## Lead Flow

**Unleased pages:** Leads queue in our system. Businesses can purchase individual leads from the queue via provenquote.ai.

**Leased pages:** Leads go directly to the lessee in real time.

**Bidding:** When a page hits threshold traffic/lead volume, the monthly lease slot can go to auction. Highest monthly bid wins.

---

## Consumer Protection

We are on the consumer's side.

- If a leasing business receives complaints or fails to respond to leads, we investigate
- We can terminate a lease and remove all business info immediately
- The page returns to UNLEASED state — leads continue to flow, consumers are not abandoned
- We may build a review/rating system for lessees over time (post-launch)

---

## provenquote.com vs provenquote.ai

| | .com | .ai |
|---|---|---|
| Audience | Consumers | Businesses |
| Purpose | Find local services, request quotes | Buy leads, lease niche/city slots |
| Tone | Helpful, trustworthy | Professional, ROI-focused |
| Primary CTA | "Get a free quote" | "Buy leads" / "Lease this market" |

Both can mention the other. .com pages have small B2B CTAs. .ai dashboard shows all available markets.

---

## Data Rules

**GMB / competitor data (from DataForSEO, Outscraper, etc.):**
- Used for backend: market density, keyword intel, which niches/cities to prioritize
- NEVER displayed on unleased pages
- Only a leasing business's own data appears on their leased page

**Reviews:**
- Not shown on unleased pages
- Lessee adds their own reviews when they lease
- We may eventually allow consumer-submitted reviews (post-launch feature)

---

## Build Priority

1. Niche × city mini-sites (SEO content + quote form) — rank first, sell second
2. Lead capture + queue system
3. provenquote.ai B2B dashboard (lead purchase + lease management)
4. Lease management (page handoff, customization within SEO rules)
5. Consumer protection / termination system
6. Bidding system (for high-traffic pages)

---

*Last updated: 2026-05-06*

