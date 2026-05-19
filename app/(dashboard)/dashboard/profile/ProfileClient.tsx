'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { NICHES } from '@/lib/niches';

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
}

interface Props {
  initialBusiness: Business | null;
  userId: string;
}

export default function ProfileClient({ initialBusiness, userId }: Props) {
  const supabase = createClient();
  const [business, setBusiness] = useState<Business | null>(initialBusiness);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [businessName, setBusinessName] = useState(initialBusiness?.business_name ?? '');
  const [niche, setNiche] = useState(initialBusiness?.niche ?? '');
  const [phone, setPhone] = useState(initialBusiness?.phone ?? '');
  const [email, setEmail] = useState(initialBusiness?.email ?? '');
  const [website, setWebsite] = useState(initialBusiness?.website ?? '');
  const [city, setCity] = useState(initialBusiness?.city ?? '');
  const [stateVal, setStateVal] = useState(initialBusiness?.state ?? '');
  const [description, setDescription] = useState(initialBusiness?.description ?? '');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '-' + (business?.slug?.split('-').pop() || Math.random().toString(36).substring(2, 6));

    const { data, error: upsertError } = await supabase
      .from('pq_businesses')
      .upsert({
        user_id: userId,
        business_name: businessName,
        niche,
        phone,
        email,
        website,
        city,
        state: stateVal,
        description,
        slug: business?.slug || slug,
        onboarding_completed: true,
      }, { onConflict: 'user_id' })
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Business Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your public listing and verification status</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile form */}
        <div className="lg:col-span-2">
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-5">Business Information</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>
            )}
            {saved && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">✓ Profile saved successfully</div>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Niche / Industry</label>
                  <select
                    value={niche}
                    onChange={e => setNiche(e.target.value)}
                    className="w-full bg-[#1A2342] border border-white/10 text-white rounded-lg px-4 py-3 text-sm outline-none"
                  >
                    <option value="">Select...</option>
                    {NICHES.map(n => <option key={n.slug} value={n.name}>{n.name}</option>)}
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

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Business Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Tell homeowners what makes your business stand out..."
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

        {/* Verification Status */}
        <div className="space-y-4">
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
                    <p className="text-xs text-slate-400 mt-0.5">Get verified to build trust with homeowners</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  Verified pros get more clicks and higher lead quality scores. We verify:
                </p>
                <ul className="text-xs text-slate-500 space-y-1 mb-4">
                  <li>✓ Business license</li>
                  <li>✓ Insurance certificate</li>
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

          {/* Profile completeness */}
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Profile Completeness</h3>
            {(() => {
              const fields = [businessName, niche, phone, email, website, city, stateVal, description];
              const filled = fields.filter(Boolean).length;
              const pct = Math.round((filled / fields.length) * 100);
              return (
                <>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>{filled}/{fields.length} fields</span>
                    <span className="font-semibold text-white">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2563EB] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {pct < 100 && (
                    <p className="text-xs text-slate-500 mt-2">Complete your profile to appear higher in search results.</p>
                  )}
                </>
              );
            })()}
          </div>

          {/* Public URL */}
          {publicProfileUrl && (
            <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-2">Your Public URL</h3>
              <p className="text-xs text-slate-500 break-all">{publicProfileUrl}</p>
              <button
                onClick={() => navigator.clipboard.writeText(publicProfileUrl)}
                className="mt-2 text-xs text-[#2563EB] hover:text-white transition-colors"
              >
                Copy Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
