'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { NICHES } from '@/lib/niches';

const SAMPLE_MARKETS = [
  { niche: 'Roofing', city: 'Austin', state: 'TX', leasePrice: 2400, estLeads: 38 },
  { niche: 'HVAC', city: 'Phoenix', state: 'AZ', leasePrice: 1800, estLeads: 52 },
  { niche: 'Solar', city: 'San Diego', state: 'CA', leasePrice: 3200, estLeads: 61 },
  { niche: 'Plumbing', city: 'Denver', state: 'CO', leasePrice: 1600, estLeads: 30 },
  { niche: 'Landscaping', city: 'Seattle', state: 'WA', leasePrice: 1200, estLeads: 25 },
  { niche: 'Electrical', city: 'Portland', state: 'OR', leasePrice: 1400, estLeads: 27 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Step 1 fields
  const [businessName, setBusinessName] = useState('');
  const [niche, setNiche] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [description, setDescription] = useState('');

  // Step 2 fields
  const [selectedMarket, setSelectedMarket] = useState<typeof SAMPLE_MARKETS[0] | null>(null);

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/sign-in'); return; }

    const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Math.random().toString(36).substring(2, 6);

    const { error: updateError } = await supabase
      .from('pq_businesses')
      .upsert({
        user_id: user.id,
        business_name: businessName,
        niche,
        phone,
        website,
        city,
        state,
        description,
        slug,
      }, { onConflict: 'user_id' });

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setStep(2);
  };

  const handleStep2 = async () => {
    if (!selectedMarket) {
      // Skip to dashboard
      await completeOnboarding();
      return;
    }

    setSaving(true);
    // Redirect to Stripe checkout for the lease
    const res = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'lease',
        niche: selectedMarket.niche,
        city: selectedMarket.city,
        state: selectedMarket.state,
        leasePrice: selectedMarket.leasePrice,
      }),
    });
    const { url, error: checkoutError } = await res.json();
    if (checkoutError) {
      setError(checkoutError);
      setSaving(false);
      return;
    }
    window.location.href = url;
  };

  const completeOnboarding = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('pq_businesses')
      .update({ onboarding_completed: true })
      .eq('user_id', user.id);

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#080C14]">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s ? 'bg-[#2563EB] text-white' : 'bg-white/10 text-slate-500'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && <div className={`flex-1 h-0.5 w-12 ${step > s ? 'bg-[#2563EB]' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            Step {step} of 3 — {step === 1 ? 'Business Info' : step === 2 ? 'Choose Your Market' : 'Complete'}
          </p>
        </div>

        {step === 1 && (
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8">
            <h1 className="text-xl font-bold text-white mb-2">Tell us about your business</h1>
            <p className="text-slate-400 text-sm mb-6">This info will appear on your public profile and help us match you with leads.</p>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>
            )}

            <form onSubmit={handleStep1} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Business Name *</label>
                <input
                  required
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  placeholder="Smith Roofing LLC"
                  className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Your Niche *</label>
                  <select
                    required
                    value={niche}
                    onChange={e => setNiche(e.target.value)}
                    className="w-full bg-[#1A2342] border border-white/10 text-white rounded-lg px-4 py-3 text-sm outline-none"
                  >
                    <option value="">Select niche...</option>
                    {NICHES.map(n => (
                      <option key={n.slug} value={n.name}>{n.name}</option>
                    ))}
                  </select>
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
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">City</label>
                  <input
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Austin"
                    className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">State</label>
                  <input
                    value={state}
                    onChange={e => setState(e.target.value)}
                    placeholder="TX"
                    maxLength={2}
                    className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Website</label>
                <input
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  placeholder="https://yoursite.com"
                  className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Business Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Tell homeowners what makes your business the best choice..."
                  className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {saving ? 'Saving...' : 'Continue →'}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8">
            <h1 className="text-xl font-bold text-white mb-2">Choose your first market</h1>
            <p className="text-slate-400 text-sm mb-6">Leasing a market gives you exclusive access to all leads in that niche and city. You can add more later.</p>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {SAMPLE_MARKETS.map((market, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedMarket(selectedMarket?.city === market.city && selectedMarket?.niche === market.niche ? null : market)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    selectedMarket?.city === market.city && selectedMarket?.niche === market.niche
                      ? 'border-[#2563EB] bg-[#2563EB]/10'
                      : 'border-white/[0.08] hover:border-white/20 bg-[#1A2342]/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-white text-sm">{market.niche}</p>
                      <p className="text-xs text-slate-400">{market.city}, {market.state}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">${market.leasePrice.toLocaleString()}/mo</p>
                      <p className="text-xs text-emerald-400">~{market.estLeads} leads/mo</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={completeOnboarding}
                className="flex-1 text-slate-400 hover:text-white border border-white/10 py-3 rounded-lg text-sm font-medium transition-colors"
              >
                Skip for now
              </button>
              <button
                onClick={handleStep2}
                disabled={saving || !selectedMarket}
                className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {saving ? 'Redirecting...' : selectedMarket ? `Lease ${selectedMarket.niche} — ${selectedMarket.city} →` : 'Select a Market'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-12 text-center">
            <p className="text-4xl mb-4">🎉</p>
            <h1 className="text-xl font-bold text-white mb-2">You&apos;re all set!</h1>
            <p className="text-slate-400 mb-6">Your business profile is live and you&apos;re ready to start receiving leads.</p>
            <button
              onClick={completeOnboarding}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Go to Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
