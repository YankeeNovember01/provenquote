'use client';

import { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
type AdStatus = 'Active' | 'Paused' | 'Ended' | 'Draft';

interface AdSlot {
  id: string;
  page: string;
  slotName: string;
  placement: string;
  hub: string;
  niche: string;
  city: string;
  state: string;
  monthlyImpressions: number;
  avgCTR: number;
  cpm: number; // cost per thousand impressions
  available: boolean;
}

interface AdCampaign {
  id: string;
  name: string;
  slotId: string;
  slotName: string;
  hub: string;
  headline: string;
  body: string;
  cta: string;
  status: AdStatus;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  startDate: string;
  endDate: string;
}

// ─── Ad Slot Map ──────────────────────────────────────────────────────────────
// Based on the AUDIT_UNLEASED_TEMPLATE.md slot map (unleased hubs)
const AD_SLOTS: AdSlot[] = [
  // Hub main page slots
  { id: 'slot-hero-banner', page: 'Hub Page', slotName: 'Hero Banner (Above Form)', placement: 'Top of page, above lead form', hub: 'Roofing — Frisco, TX', niche: 'Roofing', city: 'Frisco', state: 'TX', monthlyImpressions: 8400, avgCTR: 2.8, cpm: 28, available: true },
  { id: 'slot-contractor-card', page: 'Hub Page', slotName: 'Contractor Card Feature', placement: 'Primary featured slot below form', hub: 'Roofing — Frisco, TX', niche: 'Roofing', city: 'Frisco', state: 'TX', monthlyImpressions: 7200, avgCTR: 3.4, cpm: 45, available: true },
  { id: 'slot-about-sidebar', page: 'Hub Page', slotName: 'About Section Sidebar', placement: 'Right sidebar in About section', hub: 'Roofing — Frisco, TX', niche: 'Roofing', city: 'Frisco', state: 'TX', monthlyImpressions: 5600, avgCTR: 1.9, cpm: 18, available: false },
  { id: 'slot-services-banner', page: 'Hub Page', slotName: 'Services Section Banner', placement: 'Banner between service cards', hub: 'Roofing — Frisco, TX', niche: 'Roofing', city: 'Frisco', state: 'TX', monthlyImpressions: 6100, avgCTR: 2.1, cpm: 22, available: true },
  { id: 'slot-pricing-cta', page: 'Hub Page', slotName: 'Pricing Table CTA Block', placement: 'Below pricing table', hub: 'Roofing — Frisco, TX', niche: 'Roofing', city: 'Frisco', state: 'TX', monthlyImpressions: 4800, avgCTR: 2.6, cpm: 25, available: true },
  { id: 'slot-faq-inline', page: 'Hub Page', slotName: 'FAQ Inline Ad', placement: 'After 3rd FAQ item', hub: 'Roofing — Frisco, TX', niche: 'Roofing', city: 'Frisco', state: 'TX', monthlyImpressions: 3900, avgCTR: 1.6, cpm: 15, available: true },
  { id: 'slot-reviews-banner', page: 'Hub Page', slotName: 'Reviews Section Banner', placement: 'Top of reviews section', hub: 'Roofing — Frisco, TX', niche: 'Roofing', city: 'Frisco', state: 'TX', monthlyImpressions: 4200, avgCTR: 1.8, cpm: 17, available: true },
  { id: 'slot-bottom-cta', page: 'Hub Page', slotName: 'Bottom CTA Bar', placement: 'Final CTA before footer', hub: 'Roofing — Frisco, TX', niche: 'Roofing', city: 'Frisco', state: 'TX', monthlyImpressions: 5100, avgCTR: 3.2, cpm: 32, available: false },
  // Cost Guide page slots
  { id: 'slot-costguide-hero', page: 'Cost Guide', slotName: 'Cost Guide Hero Strip', placement: 'Below hero heading', hub: 'Roofing — Frisco, TX', niche: 'Roofing', city: 'Frisco', state: 'TX', monthlyImpressions: 3400, avgCTR: 2.2, cpm: 20, available: true },
  { id: 'slot-costguide-pricing', page: 'Cost Guide', slotName: 'Cost Guide Pricing Sidebar', placement: 'Sticky sidebar next to pricing table', hub: 'Roofing — Frisco, TX', niche: 'Roofing', city: 'Frisco', state: 'TX', monthlyImpressions: 2900, avgCTR: 2.5, cpm: 24, available: true },
  // FAQ page slots
  { id: 'slot-faq-page-top', page: 'FAQ Page', slotName: 'FAQ Page Top Banner', placement: 'Above FAQ list', hub: 'Roofing — Frisco, TX', niche: 'Roofing', city: 'Frisco', state: 'TX', monthlyImpressions: 2200, avgCTR: 1.4, cpm: 12, available: true },
  { id: 'slot-faq-page-mid', page: 'FAQ Page', slotName: 'FAQ Page Mid Banner', placement: 'Between FAQ sections', hub: 'Roofing — Frisco, TX', niche: 'Roofing', city: 'Frisco', state: 'TX', monthlyImpressions: 1800, avgCTR: 1.2, cpm: 10, available: true },
  // Storm Damage page
  { id: 'slot-storm-hero', page: 'Storm Damage', slotName: 'Storm Page Hero CTA', placement: 'Prominent CTA in storm hero', hub: 'Roofing — Frisco, TX', niche: 'Roofing', city: 'Frisco', state: 'TX', monthlyImpressions: 4600, avgCTR: 4.1, cpm: 40, available: true },
  { id: 'slot-storm-checklist', page: 'Storm Damage', slotName: 'Storm Checklist Sidebar', placement: 'Next to storm checklist', hub: 'Roofing — Frisco, TX', niche: 'Roofing', city: 'Frisco', state: 'TX', monthlyImpressions: 3100, avgCTR: 2.8, cpm: 28, available: true },
  // Insurance page
  { id: 'slot-insurance-hero', page: 'Insurance Page', slotName: 'Insurance Page Feature', placement: 'Main featured contractor block', hub: 'Roofing — Frisco, TX', niche: 'Roofing', city: 'Frisco', state: 'TX', monthlyImpressions: 3800, avgCTR: 3.6, cpm: 36, available: true },
  // Austin market slots
  { id: 'slot-austin-hero', page: 'Hub Page', slotName: 'Hero Banner (Above Form)', placement: 'Top of page, above lead form', hub: 'Roofing — Austin, TX', niche: 'Roofing', city: 'Austin', state: 'TX', monthlyImpressions: 12400, avgCTR: 2.9, cpm: 32, available: true },
  { id: 'slot-austin-contractor', page: 'Hub Page', slotName: 'Contractor Card Feature', placement: 'Primary featured slot below form', hub: 'Roofing — Austin, TX', niche: 'Roofing', city: 'Austin', state: 'TX', monthlyImpressions: 10800, avgCTR: 3.6, cpm: 50, available: true },
  { id: 'slot-austin-storm', page: 'Storm Damage', slotName: 'Storm Page Hero CTA', placement: 'Prominent CTA in storm hero', hub: 'Roofing — Austin, TX', niche: 'Roofing', city: 'Austin', state: 'TX', monthlyImpressions: 6200, avgCTR: 4.2, cpm: 44, available: false },
  // HVAC Phoenix slots
  { id: 'slot-hvac-phx-hero', page: 'Hub Page', slotName: 'Hero Banner (Above Form)', placement: 'Top of page, above lead form', hub: 'HVAC — Phoenix, AZ', niche: 'HVAC', city: 'Phoenix', state: 'AZ', monthlyImpressions: 9100, avgCTR: 2.7, cpm: 26, available: true },
  { id: 'slot-hvac-phx-contractor', page: 'Hub Page', slotName: 'Contractor Card Feature', placement: 'Primary featured slot below form', hub: 'HVAC — Phoenix, AZ', niche: 'HVAC', city: 'Phoenix', state: 'AZ', monthlyImpressions: 7600, avgCTR: 3.3, cpm: 42, available: true },
];

const INITIAL_CAMPAIGNS: AdCampaign[] = [
  {
    id: 'CMP-001',
    name: 'Frisco Storm Season Push',
    slotId: 'slot-storm-hero',
    slotName: 'Storm Page Hero CTA',
    hub: 'Roofing — Frisco, TX',
    headline: 'Storm Damage? We Handle Insurance Claims',
    body: 'Apex Roofing — GAF Certified. Free inspection, same-day response.',
    cta: 'Get Free Inspection',
    status: 'Active',
    budget: 1200,
    spent: 840,
    impressions: 21000,
    clicks: 588,
    startDate: 'May 1, 2026',
    endDate: 'May 31, 2026',
  },
  {
    id: 'CMP-002',
    name: 'Austin Contractor Card',
    slotId: 'slot-austin-contractor',
    slotName: 'Contractor Card Feature',
    hub: 'Roofing — Austin, TX',
    headline: 'Austin\'s #1 Roofing Contractor',
    body: 'Owens Corning Platinum. 500+ roofs replaced. Free quotes in 24 hours.',
    cta: 'View Profile & Request Quote',
    status: 'Active',
    budget: 2400,
    spent: 1680,
    impressions: 33600,
    clicks: 1210,
    startDate: 'May 1, 2026',
    endDate: 'Jun 30, 2026',
  },
];

// ─── Status styles ────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<AdStatus, string> = {
  Active: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Paused: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  Draft: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
  Ended: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

// ─── Campaign Builder Modal ───────────────────────────────────────────────────
function CampaignBuilderModal({
  slot,
  onClose,
  onSave,
}: {
  slot: AdSlot;
  onClose: () => void;
  onSave: (campaign: AdCampaign) => void;
}) {
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [body, setBody] = useState('');
  const [cta, setCta] = useState('Get Free Quote');
  const [budget, setBudget] = useState(500);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const estimatedImpressions = Math.round((budget / slot.cpm) * 1000);
  const estimatedClicks = Math.round(estimatedImpressions * (slot.avgCTR / 100));

  const handleSave = () => {
    const campaign: AdCampaign = {
      id: `CMP-${String(Math.floor(Math.random() * 9000) + 100).padStart(3, '0')}`,
      name,
      slotId: slot.id,
      slotName: slot.slotName,
      hub: slot.hub,
      headline,
      body,
      cta,
      status: 'Draft',
      budget,
      spent: 0,
      impressions: 0,
      clicks: 0,
      startDate,
      endDate,
    };
    onSave(campaign);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0F1729] border border-white/[0.12] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/[0.08]">
          <div>
            <h2 className="text-xl font-bold text-white">Create Campaign</h2>
            <p className="text-sm text-slate-500 mt-0.5">{slot.slotName} · {slot.hub}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
          {/* Slot stats */}
          <div className="bg-[#1A2342] rounded-xl p-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xl font-bold text-white">{slot.monthlyImpressions.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Monthly Impressions</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-white">{slot.avgCTR}%</p>
              <p className="text-xs text-slate-500">Avg CTR</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-white">${slot.cpm} CPM</p>
              <p className="text-xs text-slate-500">Cost per 1K</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Campaign Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Storm Season Push — Frisco"
              className="w-full bg-[#1A2342] border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-600 focus:outline-none focus:border-[#2563EB]/50"
            />
          </div>

          {/* Ad creative */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest">Ad Creative</label>
            <div>
              <p className="text-xs text-slate-600 mb-1">Headline (60 chars max)</p>
              <input
                type="text"
                value={headline}
                onChange={e => setHeadline(e.target.value.slice(0, 60))}
                placeholder="Storm Damage? We Handle Insurance Claims"
                className="w-full bg-[#1A2342] border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-600 focus:outline-none focus:border-[#2563EB]/50"
              />
              <p className="text-[10px] text-slate-700 mt-1 text-right">{headline.length}/60</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">Body (120 chars max)</p>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value.slice(0, 120))}
                placeholder="GAF Certified contractor. Free inspection, same-day response. 500+ roofs replaced."
                className="w-full bg-[#1A2342] border border-white/10 text-white rounded-xl px-4 py-3 text-sm resize-none h-20 placeholder-slate-600 focus:outline-none focus:border-[#2563EB]/50"
              />
              <p className="text-[10px] text-slate-700 mt-1 text-right">{body.length}/120</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">CTA Button Text</p>
              <input
                type="text"
                value={cta}
                onChange={e => setCta(e.target.value)}
                placeholder="Get Free Inspection"
                className="w-full bg-[#1A2342] border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-600 focus:outline-none focus:border-[#2563EB]/50"
              />
            </div>
          </div>

          {/* Budget + dates */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Budget ($)</label>
              <input
                type="number"
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                min={100}
                step={100}
                className="w-full bg-[#1A2342] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB]/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full bg-[#1A2342] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB]/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full bg-[#1A2342] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB]/50"
              />
            </div>
          </div>

          {/* Projection */}
          <div className="bg-[#1A2342] rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Estimated Performance</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-lg font-bold text-white">{estimatedImpressions.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Est. Impressions</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#2563EB]">{estimatedClicks.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Est. Clicks</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">${budget}</p>
                <p className="text-xs text-slate-500">Total Budget</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-white/[0.08]">
          <button onClick={onClose} className="text-sm font-medium text-slate-500 hover:text-white px-4 py-2.5 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name || !headline}
            className="text-sm font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg transition-colors"
          >
            Save as Draft
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdsPage() {
  const [tab, setTab] = useState<'campaigns' | 'slots'>('campaigns');
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(INITIAL_CAMPAIGNS);
  const [selectedSlot, setSelectedSlot] = useState<AdSlot | null>(null);
  const [nicheFilter, setNicheFilter] = useState('');
  const [pageFilter, setPageFilter] = useState('');
  const [showUnavailable, setShowUnavailable] = useState(false);

  const filteredSlots = AD_SLOTS.filter(s => {
    if (nicheFilter && s.niche !== nicheFilter) return false;
    if (pageFilter && s.page !== pageFilter) return false;
    if (!showUnavailable && !s.available) return false;
    return true;
  });

  const uniqueNiches = [...new Set(AD_SLOTS.map(s => s.niche))];
  const uniquePages = [...new Set(AD_SLOTS.map(s => s.page))];

  const totalSpend = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const blendedCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0';

  const handleCampaignSave = (campaign: AdCampaign) => {
    setCampaigns(prev => [campaign, ...prev]);
  };

  return (
    <div className="p-8">
      {selectedSlot && (
        <CampaignBuilderModal
          slot={selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onSave={c => { handleCampaignSave(c); setSelectedSlot(null); }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Ads Manager</h1>
          <p className="text-sm text-slate-500 mt-1">
            Advertise on unleased hub pages across ProvenQuote
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Campaigns', value: campaigns.filter(c => c.status === 'Active').length.toString(), sub: `${campaigns.length} total` },
          { label: 'Total Spend', value: `$${totalSpend.toLocaleString()}`, sub: 'this month' },
          { label: 'Total Impressions', value: totalImpressions.toLocaleString(), sub: 'all campaigns' },
          { label: 'Blended CTR', value: `${blendedCTR}%`, sub: `${totalClicks.toLocaleString()} clicks` },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
            <p className="text-xs text-slate-500 mb-2">{label}</p>
            <p className="text-2xl font-bold text-white mb-1">{value}</p>
            <p className="text-xs text-slate-600">{sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#0F1729] border border-white/[0.08] rounded-xl p-1 w-fit">
        {(['campaigns', 'slots'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              tab === t ? 'bg-[#1A2342] text-white' : 'text-slate-500 hover:text-white'
            }`}
          >
            {t === 'campaigns' ? 'Active Campaigns' : 'Browse Ad Slots'}
          </button>
        ))}
      </div>

      {/* ── CAMPAIGNS TAB ── */}
      {tab === 'campaigns' && (
        <div className="space-y-4">
          {campaigns.length === 0 && (
            <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-12 text-center">
              <p className="text-slate-500 mb-4">No campaigns yet.</p>
              <button
                onClick={() => setTab('slots')}
                className="text-sm font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-lg transition-colors"
              >
                Browse Ad Slots →
              </button>
            </div>
          )}

          {campaigns.map(c => {
            const ctr = c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(2) : '0.00';
            const pctSpent = Math.round((c.spent / c.budget) * 100);

            return (
              <div key={c.id} className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono text-slate-600">{c.id}</span>
                      <h3 className="text-base font-semibold text-white">{c.name}</h3>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[c.status]}`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{c.slotName} · {c.hub}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{c.startDate} → {c.endDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCampaigns(prev => prev.map(x => x.id === c.id ? { ...x, status: x.status === 'Active' ? 'Paused' : 'Active' } : x))}
                      className="text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-2 rounded-lg transition-colors"
                    >
                      {c.status === 'Active' ? 'Pause' : 'Resume'}
                    </button>
                  </div>
                </div>

                {/* Ad preview */}
                <div className="bg-[#1A2342] rounded-xl p-4 mb-4 border border-white/[0.06]">
                  <p className="text-xs text-slate-600 mb-2 uppercase tracking-widest font-semibold">Ad Preview</p>
                  <p className="text-sm font-bold text-white mb-1">{c.headline}</p>
                  <p className="text-xs text-slate-400 mb-2">{c.body}</p>
                  <span className="text-xs font-semibold text-[#2563EB]">{c.cta} →</span>
                </div>

                {/* Performance */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Impressions</p>
                    <p className="text-lg font-bold text-white">{c.impressions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Clicks</p>
                    <p className="text-lg font-bold text-white">{c.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">CTR</p>
                    <p className="text-lg font-bold text-[#2563EB]">{ctr}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Spend</p>
                    <p className="text-lg font-bold text-white">${c.spent.toLocaleString()} / ${c.budget.toLocaleString()}</p>
                  </div>
                </div>

                {/* Budget bar */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Budget used</span>
                    <span>{pctSpent}%</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2563EB] rounded-full transition-all"
                      style={{ width: `${Math.min(pctSpent, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── SLOTS TAB ── */}
      {tab === 'slots' && (
        <div>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <select
              value={nicheFilter}
              onChange={e => setNicheFilter(e.target.value)}
              className="bg-[#1A2342] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm"
            >
              <option value="">All Niches</option>
              {uniqueNiches.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <select
              value={pageFilter}
              onChange={e => setPageFilter(e.target.value)}
              className="bg-[#1A2342] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm"
            >
              <option value="">All Page Types</option>
              {uniquePages.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer ml-auto">
              <input
                type="checkbox"
                checked={showUnavailable}
                onChange={e => setShowUnavailable(e.target.checked)}
                className="rounded border-white/20 bg-[#1A2342] text-[#2563EB]"
              />
              Show unavailable
            </label>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredSlots.map(slot => (
              <div
                key={slot.id}
                className={`bg-[#0F1729] border rounded-2xl p-5 transition-all ${
                  slot.available
                    ? 'border-white/[0.08] hover:border-[#2563EB]/40'
                    : 'border-white/[0.04] opacity-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{slot.page}</p>
                    <h3 className="text-sm font-semibold text-white">{slot.slotName}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{slot.hub}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    slot.available
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {slot.available ? 'Available' : 'Taken'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-3 leading-relaxed">{slot.placement}</p>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-[#1A2342] rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-white">{(slot.monthlyImpressions / 1000).toFixed(1)}K</p>
                    <p className="text-[10px] text-slate-600">Impressions</p>
                  </div>
                  <div className="bg-[#1A2342] rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-white">{slot.avgCTR}%</p>
                    <p className="text-[10px] text-slate-600">Avg CTR</p>
                  </div>
                  <div className="bg-[#1A2342] rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-white">${slot.cpm}</p>
                    <p className="text-[10px] text-slate-600">CPM</p>
                  </div>
                </div>

                <button
                  onClick={() => slot.available && setSelectedSlot(slot)}
                  disabled={!slot.available}
                  className="w-full text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-30 disabled:cursor-not-allowed text-white py-2.5 rounded-xl transition-colors"
                >
                  {slot.available ? 'Create Campaign →' : 'Slot Unavailable'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
