'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// ─── Business Type Definitions ─────────────────────────────────────────────

type BusinessTypeKey = 'home_service' | 'professional' | 'health' | 'other';

interface BusinessTypeOption {
  key: BusinessTypeKey;
  emoji: string;
  label: string;
  subtitle: string;
}

const BUSINESS_TYPES: BusinessTypeOption[] = [
  {
    key: 'home_service',
    emoji: '🔨',
    label: 'Home Service & Trades',
    subtitle: 'Roofing, HVAC, Plumbing, Electrical, Landscaping, etc.',
  },
  {
    key: 'professional',
    emoji: '⚖️',
    label: 'Professional Services',
    subtitle: 'Attorney, Financial Advisor, Insurance Agent, Real Estate, etc.',
  },
  {
    key: 'health',
    emoji: '🏥',
    label: 'Health & Wellness',
    subtitle: 'Dentist, Chiropractor, Med Spa, Physical Therapy, etc.',
  },
  {
    key: 'other',
    emoji: '🏪',
    label: 'Other Business',
    subtitle: 'Any other local service business',
  },
];

// ─── Verticals per Business Type ───────────────────────────────────────────

const VERTICALS: Record<BusinessTypeKey, string[]> = {
  home_service: [
    'Roofing', 'HVAC', 'Plumbing', 'Electrical', 'Landscaping',
    'Solar', 'Pest Control', 'Painting', 'Fencing', 'Flooring',
    'Concrete', 'Windows', 'Gutters', 'Garage Doors', 'Siding',
    'Pressure Washing', 'Handyman',
  ],
  professional: [
    'Personal Injury Attorney', 'Family Attorney', 'Criminal Defense',
    'Financial Advisor', 'Insurance Agent', 'Real Estate Agent',
    'Mortgage Broker', 'Accountant / CPA', 'Business Consultant',
  ],
  health: [
    'Dentist', 'Orthodontist', 'Chiropractor', 'Physical Therapy',
    'Med Spa', 'Mental Health Therapist', 'Optometrist', 'Dermatologist',
  ],
  other: [],
};

// ─── Component ─────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Step 1
  const [businessType, setBusinessType] = useState<BusinessTypeKey | ''>('');

  // Step 2
  const [vertical, setVertical] = useState('');
  const [customVertical, setCustomVertical] = useState('');

  // Step 3
  const [serviceAreas, setServiceAreas] = useState<string[]>([]);
  const [areaInput, setAreaInput] = useState('');
  const [nationwide, setNationwide] = useState(false);

  // Step 4
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [yearsInBusiness, setYearsInBusiness] = useState('');
  const [description, setDescription] = useState('');

  // ── Helpers ──────────────────────────────────────────────────────────────

  const saveProgress = async (extra: Record<string, unknown> = {}) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const resolvedVertical = businessType === 'other' ? customVertical : vertical;

    await supabase.from('pq_businesses').upsert(
      {
        user_id: user.id,
        business_type: businessType || undefined,
        industry_category: businessType || undefined,
        primary_niche: resolvedVertical || undefined,
        niche: resolvedVertical || undefined,
        service_areas_list: nationwide ? ['Nationwide'] : serviceAreas.length ? serviceAreas : undefined,
        ...extra,
      },
      { onConflict: 'user_id' },
    );
  };

  const addArea = () => {
    const trimmed = areaInput.trim();
    if (trimmed && !serviceAreas.includes(trimmed)) {
      setServiceAreas(prev => [...prev, trimmed]);
    }
    setAreaInput('');
  };

  const removeArea = (area: string) => {
    setServiceAreas(prev => prev.filter(a => a !== area));
  };

  // ── Step handlers ─────────────────────────────────────────────────────────

  const handleStep1 = async () => {
    if (!businessType) return;
    setSaving(true);
    await saveProgress();
    setSaving(false);
    setStep(2);
  };

  const handleStep2 = async () => {
    const resolvedVertical = businessType === 'other' ? customVertical : vertical;
    if (!resolvedVertical) return;
    setSaving(true);
    await saveProgress();
    setSaving(false);
    setStep(3);
  };

  const handleStep3 = async () => {
    setSaving(true);
    await saveProgress();
    setSaving(false);
    setStep(4);
  };

  const handleStep4 = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/sign-in'); return; }

    const resolvedVertical = businessType === 'other' ? customVertical : vertical;
    const slug = (businessName || 'business')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') +
      '-' + Math.random().toString(36).substring(2, 6);

    const { error: upsertError } = await supabase.from('pq_businesses').upsert(
      {
        user_id: user.id,
        business_name: businessName,
        business_type: businessType,
        industry_category: businessType,
        primary_niche: resolvedVertical,
        niche: resolvedVertical,
        service_areas_list: nationwide ? ['Nationwide'] : serviceAreas,
        phone,
        website,
        years_in_business: yearsInBusiness ? parseInt(yearsInBusiness) : undefined,
        description,
        slug,
        onboarding_completed: true,
      },
      { onConflict: 'user_id' },
    );

    if (upsertError) {
      setError(upsertError.message);
      setSaving(false);
      return;
    }

    router.push('/dashboard?onboarded=1');
    router.refresh();
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const STEP_LABELS = ['Business Type', 'Your Specialty', 'Service Areas', 'Profile'];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#080C14]">
      <div className="w-full max-w-2xl">

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${
                  step > s ? 'bg-[#2563EB] text-white' : step === s ? 'bg-[#2563EB] text-white ring-2 ring-[#2563EB]/30' : 'bg-white/10 text-slate-500'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                {s < 4 && (
                  <div className={`flex-1 h-0.5 ${step > s ? 'bg-[#2563EB]' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            Step {step} of 4 — {STEP_LABELS[step - 1]}
          </p>
        </div>

        {/* ── STEP 1: Business Type ─────────────────────────────────────────── */}
        {step === 1 && (
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8">
            <h1 className="text-xl font-bold text-white mb-2">What type of business are you?</h1>
            <p className="text-slate-400 text-sm mb-6">We'll personalise your dashboard and leads to match your industry.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {BUSINESS_TYPES.map(bt => (
                <button
                  key={bt.key}
                  onClick={() => setBusinessType(bt.key)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    businessType === bt.key
                      ? 'border-[#2563EB] bg-[#2563EB]/10'
                      : 'border-white/[0.08] hover:border-white/20 bg-[#1A2342]/50'
                  }`}
                >
                  <span className="text-2xl mb-2 block">{bt.emoji}</span>
                  <p className="font-semibold text-white text-sm mb-1">{bt.label}</p>
                  <p className="text-xs text-slate-400">{bt.subtitle}</p>
                </button>
              ))}
            </div>

            <button
              onClick={handleStep1}
              disabled={!businessType || saving}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : 'Continue →'}
            </button>
          </div>
        )}

        {/* ── STEP 2: Vertical ──────────────────────────────────────────────── */}
        {step === 2 && businessType && (
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8">
            <h1 className="text-xl font-bold text-white mb-2">What's your primary specialty?</h1>
            <p className="text-slate-400 text-sm mb-6">Choose the service that brings in the most leads for you.</p>

            {businessType === 'other' ? (
              <div className="mb-6">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Describe your business type</label>
                <input
                  value={customVertical}
                  onChange={e => setCustomVertical(e.target.value)}
                  placeholder="e.g. Dog groomer, personal trainer, photography…"
                  className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                {VERTICALS[businessType].map(v => (
                  <button
                    key={v}
                    onClick={() => setVertical(v)}
                    className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left ${
                      vertical === v
                        ? 'border-[#2563EB] bg-[#2563EB]/10 text-white'
                        : 'border-white/[0.08] hover:border-white/20 text-slate-400 hover:text-white'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-lg border border-white/10 text-slate-400 hover:text-white text-sm transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleStep2}
                disabled={saving || (businessType === 'other' ? !customVertical.trim() : !vertical)}
                className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {saving ? 'Saving...' : 'Continue →'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Service Areas ─────────────────────────────────────────── */}
        {step === 3 && (
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8">
            <h1 className="text-xl font-bold text-white mb-2">Where do you serve customers?</h1>
            <p className="text-slate-400 text-sm mb-6">Add the cities or regions you work in. We'll match you with nearby leads.</p>

            {/* Nationwide toggle */}
            <button
              onClick={() => setNationwide(prev => !prev)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border mb-4 transition-all text-left ${
                nationwide
                  ? 'border-[#2563EB] bg-[#2563EB]/10'
                  : 'border-white/[0.08] hover:border-white/20 bg-[#1A2342]/50'
              }`}
            >
              <span className="text-xl">🌎</span>
              <div>
                <p className="text-sm font-medium text-white">Nationwide / Remote services</p>
                <p className="text-xs text-slate-400">I serve customers anywhere in the US</p>
              </div>
              <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${nationwide ? 'border-[#2563EB] bg-[#2563EB]' : 'border-white/20'}`}>
                {nationwide && <span className="text-white text-xs">✓</span>}
              </div>
            </button>

            {!nationwide && (
              <>
                {/* Tag input */}
                <div className="flex gap-2 mb-3">
                  <input
                    value={areaInput}
                    onChange={e => setAreaInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addArea(); } }}
                    placeholder="City, State (e.g. Austin, TX)"
                    className="flex-1 bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={addArea}
                    disabled={!areaInput.trim()}
                    className="px-4 py-3 bg-[#2563EB]/20 hover:bg-[#2563EB]/30 text-[#2563EB] rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
                  >
                    + Add
                  </button>
                </div>

                {/* Tags */}
                {serviceAreas.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {serviceAreas.map(area => (
                      <span
                        key={area}
                        className="flex items-center gap-1.5 bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] text-xs font-medium px-3 py-1.5 rounded-full"
                      >
                        {area}
                        <button
                          onClick={() => removeArea(area)}
                          className="hover:text-white ml-0.5 text-[#2563EB]/60"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-3 rounded-lg border border-white/10 text-slate-400 hover:text-white text-sm transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleStep3}
                disabled={saving || (!nationwide && serviceAreas.length === 0)}
                className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {saving ? 'Saving...' : 'Continue →'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Quick-fill profile ────────────────────────────────────── */}
        {step === 4 && (
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8">
            <h1 className="text-xl font-bold text-white mb-2">Almost done! A few details.</h1>
            <p className="text-slate-400 text-sm mb-6">This appears on your public profile and helps clients find you.</p>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>
            )}

            <form onSubmit={handleStep4} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Business Name *</label>
                <input
                  required
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  placeholder="Smith Law Firm LLC"
                  className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Business Phone</label>
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none"
                  />
                </div>
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

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Business Website (optional)</label>
                <input
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  placeholder="https://yoursite.com"
                  className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Brief Bio — what makes you different?</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Tell clients what sets you apart…"
                  className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-3 rounded-lg border border-white/10 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {saving ? 'Finishing setup…' : 'Finish Setup →'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
