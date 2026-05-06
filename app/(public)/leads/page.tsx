import Link from 'next/link';
import { NICHES } from '@/lib/niches';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buy Individual Leads',
  description: 'Buy individual local service leads. No subscription required. Filter by niche, city, and service type.',
};

const SAMPLE_LEADS = [
  { niche: 'Roofing', city: 'Frisco', state: 'TX', zip: '75034', submitted: '2 hours ago', service: 'Hail Damage Repair', message: 'Had hail damage last week, need inspection and estimate for repair or replacement...', price: 85 },
  { niche: 'Landscaping', city: 'Boulder', state: 'CO', zip: '80301', submitted: '4 hours ago', service: 'Full Landscaping Design', message: 'Looking to redo my entire backyard — need design, hardscape, plants, and irrigation...', price: 45 },
  { niche: 'HVAC', city: 'Scottsdale', state: 'AZ', zip: '85251', submitted: '6 hours ago', service: 'AC System Replacement', message: 'My AC is 15 years old and not cooling properly. Want quotes for a full replacement...', price: 65 },
  { niche: 'Solar', city: 'Tempe', state: 'AZ', zip: '85281', submitted: '12 hours ago', service: 'New Solar Install', message: 'Want to go solar on a 2,200 sqft home. Monthly bill is $280. Need full site assessment...', price: 120 },
  { niche: 'Electrical', city: 'Brentwood', state: 'TN', zip: '37027', submitted: '1 day ago', service: 'Panel Upgrade', message: 'Have a 100 amp panel, want to upgrade to 200 amp for an EV charger I need installed...', price: 50 },
  { niche: 'Plumbing', city: 'Gilbert', state: 'AZ', zip: '85234', submitted: '1 day ago', service: 'Water Heater Replacement', message: 'Old water heater is failing, interested in tankless options, need 3 quotes...', price: 55 },
];

export default function LeadsPublicPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Buy Individual Leads</h1>
        <p className="text-xl text-slate-400 max-w-2xl">
          No subscription required. Browse available leads by niche and city, pay per lead, get instant access.
        </p>
      </div>

      {/* Value props */}
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {[
          { title: 'No subscription', body: 'Buy one lead or a hundred. Pay only for what you want.' },
          { title: 'Verified contacts', body: 'Every lead is validated — real phone numbers, real emails, real service needs.' },
          { title: 'Shared, not exclusive', body: 'Leads are shared with up to 3 buyers. Upgrade to a lease for exclusivity.' },
        ].map(({ title, body }) => (
          <div key={title} className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      {/* Niche filter chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="text-xs font-semibold text-slate-500 self-center mr-2">Filter:</span>
        {NICHES.map(n => (
          <button
            key={n.slug}
            className="bg-[#0F1729] hover:bg-[#1A2342] border border-white/[0.08] rounded-full px-4 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-all"
          >
            {n.name}
          </button>
        ))}
      </div>

      {/* Leads list */}
      <div className="space-y-4 mb-16">
        {SAMPLE_LEADS.map((lead, i) => (
          <div key={i} className="bg-[#0F1729] border border-white/[0.08] hover:border-white/[0.16] rounded-2xl p-6 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <p className="text-base font-semibold text-white">{lead.niche} Lead — {lead.city}, {lead.state}</p>
                  <span className="text-xs text-slate-500">{lead.submitted}</span>
                </div>
                <p className="text-sm font-medium text-slate-300 mb-1">Service: {lead.service}</p>
                <p className="text-sm text-slate-500 mb-3 leading-relaxed">&ldquo;{lead.message}&rdquo;</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>ZIP: {lead.zip}</span>
                  <span className="text-slate-700">|</span>
                  <span className="blur-sm select-none text-slate-400">Phone: (555) 000-0000</span>
                  <span className="text-slate-700">|</span>
                  <span className="blur-sm select-none text-slate-400">name@email.com</span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-2xl font-bold text-white mb-1">${lead.price}</p>
                <p className="text-xs text-slate-600 mb-3">per lead</p>
                <Link
                  href="/sign-up"
                  className="block bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap text-center"
                >
                  Buy Lead
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upsell */}
      <div className="bg-[#0F1729] border border-[#2563EB]/20 rounded-2xl p-8 text-center">
        <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-widest mb-3">Want every lead?</p>
        <h2 className="text-2xl font-bold text-white mb-3">Lease the whole market</h2>
        <p className="text-slate-400 text-sm mb-6 max-w-lg mx-auto">
          Stop splitting leads with competitors. Lease a niche in your city and every quote request comes exclusively to you.
        </p>
        <Link
          href="/markets"
          className="inline-flex items-center justify-center min-h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-8 rounded-lg transition-colors"
        >
          Browse Market Leases
        </Link>
      </div>
    </div>
  );
}
