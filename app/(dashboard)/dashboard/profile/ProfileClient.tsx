'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

// ─── Types ──────────────────────────────────────────────────────────────────

type BusinessTypeKey = 'home_service' | 'professional' | 'health' | 'other' | '';

interface Business {
  id: string;
  user_id: string;
  business_name: string;
  slug: string;
  niche: string;
  phone: string;
  email: string;
  website: string;
  city: string;
  state: string;
  description: string;
  logo_url: string;
  verified: boolean;
  onboarding_completed: boolean;
  business_type?: BusinessTypeKey;
  industry_category?: string;
  primary_niche?: string;
  service_areas_list?: string[];
  years_in_business?: number;
}

interface Props {
  initialBusiness: Business | null;
  userId: string;
}

// ─── Business Type Config ───────────────────────────────────────────────────

const BUSINESS_TYPE_META: Record<string, { emoji: string; label: string; servicesLabel: string; bioPlaceholder: string }> = {
  home_service: {
    emoji: '🔨',
    label: 'Home Service & Trades',
    servicesLabel: 'Services Offered',
    bioPlaceholder: 'Tell homeowners what makes your business the best choice…',
  },
  professional: {
    emoji: '⚖️',
    label: 'Professional Services',
    servicesLabel: 'Practice Areas',
    bioPlaceholder: 'Tell clients what makes your firm the best choice…',
  },
  health: {
    emoji: '🏥',
    label: 'Health & Wellness',
    servicesLabel: 'Specialties',
    bioPlaceholder: 'Tell patients what makes your practice stand out…',
  },
  other: {
    emoji: '🏪',
    label: 'Other Business',
    servicesLabel: 'Service Specialties',
    bioPlaceholder: 'Tell clients what makes your business stand out…',
  },
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function ProfileClient({ initialBusiness, userId }: Props) {
  const supabase = createClient();
  const [business, setBusiness] = useState<Business | null>(initialBusiness);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'billing'>('profile');

  // Form state
  const [businessName, setBusinessName] = useState(initialBusiness?.business_name ?? '');
  const [phone, setPhone] = useState(initialBusiness?.phone ?? '');
  const [email, setEmail] = useState(initialBusiness?.email ?? '');
  const [website, setWebsite] = useState(initialBusiness?.website ?? '');
  const [city, setCity] = useState(initialBusiness?.city ?? '');
  const [stateVal, setStateVal] = useState(initialBusiness?.state ?? '');
  const [description, setDescription] = useState(initialBusiness?.description ?? '');
  const [primaryNiche, setPrimaryNiche] = useState(initialBusiness?.primary_niche ?? initialBusiness?.niche ?? '');
  const [serviceAreaInput, setServiceAreaInput] = useState('');
  const [serviceAreas, setServiceAreas] = useState<string[]>(initialBusiness?.service_areas_list ?? []);
  const [yearsInBusiness, setYearsInBusiness] = useState(initialBusiness?.years_in_business?.toString() ?? '');

  const businessType: BusinessTypeKey = (initialBusiness?.business_type as BusinessTypeKey) || 'home_service';
  const meta = BUSINESS_TYPE_META[businessType] ?? BUSINESS_TYPE_META.home_service;

  // Completeness: count meaningful fields
  const completenessFields = [businessName, phone, email, website, city, stateVal, description, primaryNiche];
  const filledCount = completenessFields.filter(Boolean).length;
  const completePct = Math.round((filledCount / completenessFields.length) * 100);

  // Service area helpers
  const addServiceArea = () => {
    const trimmed = serviceAreaInput.trim();
    if (trimmed && !serviceAreas.includes(trimmed)) {
      setServiceAreas(prev => [...prev, trimmed]);
    }
    setServiceAreaInput('');
  };
  const removeServiceArea = (area: string) => setServiceAreas(prev => prev.filter(a => a !== area));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    const slug =
      businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') +
      '-' +
      (business?.slug?.split('-').pop() || Math.random().toString(36).substring(2, 6));

    const { data, error: upsertError } = await supabase
      .from('pq_businesses')
      .upsert(
        {
          user_id: userId,
          business_name: businessName,
          niche: primaryNiche,
          primary_niche: primaryNiche,
          phone,
          email,
          website,
          city,
          state: stateVal,
          description,
          service_areas_list: serviceAreas,
          years_in_business: yearsInBusiness ? parseInt(yearsInBusiness) : undefined,
          slug: business?.slug || slug,
          onboarding_completed: true,
        },
        { onConflict: 'user_id' },
      )
      .select()
      .single();

    if (upsertError) {
      setError(upsertError.message);
    } else {
      setBusiness(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }

    setSaving(false);
  };

  const publicProfileUrl = business?.slug
    ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://provenquote.ai'}/business/${business.slug}`
    : null;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Business Profile</h1>
          {/* Business type badge */}
          {businessType && BUSINESS_TYPE_META[businessType] && (
            <span className="inline-flex items-center gap-1.5 mt-1 text-xs font-medium text-slate-400 bg-white/5 border border-white/[0.08] rounded-full px-3 py-1">
              <span>{meta.emoji}</span>
              {meta.label}
            </span>
          )}
        </div>
        {publicProfileUrl && (
          <a
            href={publicProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#2563EB] hover:text-white transition-colors border border-[#2563EB]/30 px-4 py-2 rounded-lg hover:border-white/30"
          >
            Preview Listing ↗
          </a>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#0F1729] border border-white/[0.08] rounded-xl p-1 w-fit">
        {(['profile', 'billing'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              activeTab === tab ? 'bg-[#2563EB] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'profile' ? 'Profile' : 'Billing'}
          </button>
        ))}
      </div>

      {activeTab === 'billing' ? (
        <BillingSection />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Profile form ────────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
              <h2 className="text-base font-semibold text-white mb-5">Business Information</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>
              )}
              {saved && (
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">
                  ✓ Profile saved successfully
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Business Name</label>
                  <input
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none"
                  />
                </div>

                {/* Primary niche / vertical — label is business-type aware */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">{meta.servicesLabel}</label>
                    <input
                      value={primaryNiche}
                      onChange={e => setPrimaryNiche(e.target.value)}
                      placeholder={
                        businessType === 'professional' ? 'e.g. Personal Injury Attorney'
                          : businessType === 'health' ? 'e.g. Dentist'
                          : 'e.g. Roofing'
                      }
                      className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone</label>
                    <input
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="(555) 000-0000"
                      className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Website</label>
                    <input
                      value={website}
                      onChange={e => setWebsite(e.target.value)}
                      placeholder="https://"
                      className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">City</label>
                    <input
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">State</label>
                    <input
                      value={stateVal}
                      onChange={e => setStateVal(e.target.value.toUpperCase())}
                      maxLength={2}
                      placeholder="TX"
                      className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Years in Business</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={yearsInBusiness}
                      onChange={e => setYearsInBusiness(e.target.value)}
                      placeholder="5"
                      className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none"
                    />
                  </div>
                </div>

                {/* Service areas */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Service Areas</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={serviceAreaInput}
                      onChange={e => setServiceAreaInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addServiceArea(); } }}
                      placeholder="City, State (e.g. Austin, TX)"
                      className="flex-1 bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-2.5 text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={addServiceArea}
                      disabled={!serviceAreaInput.trim()}
                      className="px-3 py-2.5 bg-[#2563EB]/20 hover:bg-[#2563EB]/30 text-[#2563EB] rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
                    >
                      + Add
                    </button>
                  </div>
                  {serviceAreas.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {serviceAreas.map(area => (
                        <span
                          key={area}
                          className="flex items-center gap-1.5 bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] text-xs font-medium px-2.5 py-1 rounded-full"
                        >
                          {area}
                          <button
                            type="button"
                            onClick={() => removeServiceArea(area)}
                            className="hover:text-white text-[#2563EB]/60"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bio — label adapts to business type */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Tell clients about your business</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={4}
                    placeholder={meta.bioPlaceholder}
                    className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Verification */}
            <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Verification Status</h3>

              {business?.verified ? (
                <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <span className="text-xl">✅</span>
                  <div>
                    <p className="text-sm font-semibold text-emerald-400">Verified Business</p>
                    <p className="text-xs text-slate-400 mt-0.5">Your badge appears on your public profile</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-4">
                    <span className="text-xl">🔶</span>
                    <div>
                      <p className="text-sm font-semibold text-amber-400">Not Verified</p>
                      <p className="text-xs text-slate-400 mt-0.5">Get verified to build trust with clients</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    Verified pros get more clicks and higher lead quality scores. We verify:
                  </p>
                  <ul className="text-xs text-slate-500 space-y-1 mb-4">
                    <li>✓ Business license</li>
                    <li>✓ Insurance or credentials</li>
                    <li>✓ Phone number</li>
                  </ul>
                  <a
                    href="mailto:verify@provenquote.ai?subject=Verification Request"
                    className="block w-full text-center text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 py-2.5 rounded-lg transition-colors"
                  >
                    Request Verification
                  </a>
                </div>
              )}
            </div>

            {/* Completeness */}
            <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Profile Completeness</h3>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>{filledCount}/{completenessFields.length} fields</span>
                <span className="font-semibold text-white">{completePct}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2563EB] rounded-full transition-all"
                  style={{ width: `${completePct}%` }}
                />
              </div>
              {completePct < 100 && (
                <p className="text-xs text-slate-500 mt-2">Complete your profile to appear higher in search results.</p>
              )}
            </div>

            {/* Public URL */}
            {publicProfileUrl && (
              <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-2">Your Public URL</h3>
                <p className="text-xs text-slate-500 break-all">{publicProfileUrl}</p>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(publicProfileUrl)}
                  className="mt-2 text-xs text-[#2563EB] hover:text-white transition-colors"
                >
                  Copy Link
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Billing Section (unchanged) ─────────────────────────────────────────────

function BillingSection() {
  const ACTIVE_LEASES = [
    { niche: 'Roofing', city: 'Austin, TX', cost: 2400, nextBilling: 'June 1, 2026', status: 'Active' },
    { niche: 'HVAC', city: 'Phoenix, AZ', cost: 1800, nextBilling: 'June 3, 2026', status: 'Active' },
    { niche: 'Solar', city: 'Denver, CO', cost: 2600, nextBilling: 'June 8, 2026', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <p className="text-xs text-slate-500 mb-1">Monthly total</p>
          <p className="text-3xl font-bold text-white">$6,800</p>
        </div>
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <p className="text-xs text-slate-500 mb-1">Active leases</p>
          <p className="text-3xl font-bold text-white">3</p>
        </div>
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <p className="text-xs text-slate-500 mb-1">Next charge</p>
          <p className="text-lg font-bold text-white">June 1, 2026</p>
        </div>
      </div>

      <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.08]">
          <h2 className="text-sm font-semibold text-white">Active Leases</h2>
        </div>
        <div className="divide-y divide-white/[0.06]">
          {ACTIVE_LEASES.map(lease => (
            <div key={`${lease.niche}-${lease.city}`} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-semibold text-white">{lease.niche} — {lease.city}</p>
                <p className="text-xs text-slate-500 mt-0.5">Next charge: {lease.nextBilling}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-white">${lease.cost.toLocaleString()}/mo</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                <button className="text-xs text-slate-600 hover:text-red-400 transition-colors">Cancel</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Payment Method</h2>
          <button className="text-xs text-[#2563EB] hover:text-white transition-colors">Update</button>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#1A2342] border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-300 font-mono">
            Visa ending in 4242
          </div>
          <span className="text-xs text-slate-500">Expires 12/27</span>
        </div>
      </div>

      <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.08]">
          <h2 className="text-sm font-semibold text-white">Invoice History</h2>
        </div>
        <div className="divide-y divide-white/[0.06]">
          {[
            { date: 'May 1, 2026', desc: '3 active market leases', amount: '$6,800', status: 'Paid' },
            { date: 'Apr 1, 2026', desc: '3 active market leases', amount: '$6,800', status: 'Paid' },
            { date: 'Mar 1, 2026', desc: '2 active market leases', amount: '$4,200', status: 'Paid' },
          ].map((inv, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm text-white">{inv.date}</p>
                <p className="text-xs text-slate-500">{inv.desc}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-white">{inv.amount}</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{inv.status}</span>
                <button className="text-xs text-[#2563EB] hover:text-white transition-colors">Download</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
