'use client';

import { useState, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface ServiceItem {
  id: string;
  name: string;
  description: string;
  minPrice: string;
  maxPrice: string;
}

interface CertItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
  verified: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
}

interface ProfileData {
  // Basic Info
  businessName: string;
  tagline: string;
  phone: string;
  email: string;
  website: string;
  slug: string;
  about: string;
  founded: string;
  employeeCount: string;
  roofsReplaced: string;

  // Service area
  serviceAreaCities: string;
  serviceAreaStates: string;

  // Contact / social
  facebook: string;
  instagram: string;
  yelp: string;
  googleProfile: string;

  // Logistics
  businessHours: string;
  paymentMethods: string[];
  licenseNumber: string;
  insurancePolicyType: string;
  insuranceCoverage: string;
  insuranceExpiry: string;

  // Services
  services: ServiceItem[];

  // Certifications
  certifications: CertItem[];

  // Team
  team: TeamMember[];
}

// ─── Default data ─────────────────────────────────────────────────────────────
const DEFAULT_PROFILE: ProfileData = {
  businessName: '',
  tagline: '',
  phone: '',
  email: '',
  website: '',
  slug: '',
  about: '',
  founded: '',
  employeeCount: '',
  roofsReplaced: '',
  serviceAreaCities: '',
  serviceAreaStates: '',
  facebook: '',
  instagram: '',
  yelp: '',
  googleProfile: '',
  businessHours: 'Mon–Fri 7am–6pm, Sat 8am–2pm',
  paymentMethods: [],
  licenseNumber: '',
  insurancePolicyType: '',
  insuranceCoverage: '',
  insuranceExpiry: '',
  services: [],
  certifications: [],
  team: [],
};

const PAYMENT_OPTIONS = ['Cash', 'Check', 'Credit Card', 'Financing', 'Insurance Claim', 'Zelle', 'Venmo'];

const ROOFING_CERTS = [
  'GAF Master Elite',
  'GAF Certified Contractor',
  'Owens Corning Platinum Preferred',
  'Owens Corning Preferred Contractor',
  'CertainTeed SELECT ShingleMaster',
  'Atlas ProCraft Platinum',
  'HAAG Certified Inspector',
  'NRCA Member',
  'OSHA 30-Hour Certified',
  'Better Business Bureau A+',
];

// ─── Progress calculation ─────────────────────────────────────────────────────
function calcScore(profile: ProfileData): number {
  let score = 0;
  if (profile.businessName) score += 10;
  if (profile.tagline) score += 5;
  if (profile.phone) score += 8;
  if (profile.email) score += 5;
  if (profile.website) score += 5;
  if (profile.slug) score += 5;
  if (profile.about && profile.about.length > 100) score += 8;
  if (profile.serviceAreaCities) score += 6;
  if (profile.licenseNumber) score += 8;
  if (profile.insurancePolicyType) score += 6;
  if (profile.businessHours) score += 4;
  if (profile.paymentMethods.length > 0) score += 4;
  if (profile.services.length >= 3) score += 10;
  else if (profile.services.length > 0) score += 4;
  if (profile.certifications.length >= 2) score += 8;
  else if (profile.certifications.length > 0) score += 4;
  if (profile.team.length > 0) score += 5;
  if (profile.facebook || profile.instagram) score += 3;
  return Math.min(score, 100);
}

type Section = 'basic' | 'services' | 'certifications' | 'area' | 'team' | 'insurance';

const SECTIONS: { id: Section; label: string; icon: string }[] = [
  { id: 'basic', label: 'Basic Info', icon: '🏢' },
  { id: 'area', label: 'Service Area', icon: '📍' },
  { id: 'services', label: 'Services', icon: '🔨' },
  { id: 'certifications', label: 'Certifications', icon: '🏅' },
  { id: 'insurance', label: 'Insurance & License', icon: '🛡' },
  { id: 'team', label: 'Team', icon: '👷' },
];

function newService(): ServiceItem {
  return { id: `svc-${Date.now()}`, name: '', description: '', minPrice: '', maxPrice: '' };
}
function newCert(): CertItem {
  return { id: `cert-${Date.now()}`, name: '', issuer: '', year: '', verified: false };
}
function newMember(): TeamMember {
  return { id: `tm-${Date.now()}`, name: '', role: '', bio: '' };
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<Section>('basic');
  const [profile, setProfile] = useState<ProfileData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('pq_business_profile');
        if (saved) return JSON.parse(saved) as ProfileData;
      } catch {}
    }
    return DEFAULT_PROFILE;
  });
  const [saved, setSaved] = useState(false);

  const score = calcScore(profile);

  const set = <K extends keyof ProfileData>(key: K, val: ProfileData[K]) => {
    setProfile(prev => ({ ...prev, [key]: val }));
  };

  const saveProfile = () => {
    localStorage.setItem('pq_business_profile', JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Auto-generate slug from business name
  useEffect(() => {
    if (profile.businessName && !profile.slug) {
      set('slug', profile.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  }, [profile.businessName]);

  const togglePayment = (method: string) => {
    set(
      'paymentMethods',
      profile.paymentMethods.includes(method)
        ? profile.paymentMethods.filter(m => m !== method)
        : [...profile.paymentMethods, method]
    );
  };

  // Service CRUD
  const addService = () => set('services', [...profile.services, newService()]);
  const updateService = (id: string, field: keyof ServiceItem, val: string) =>
    set('services', profile.services.map(s => (s.id === id ? { ...s, [field]: val } : s)));
  const removeService = (id: string) => set('services', profile.services.filter(s => s.id !== id));

  // Cert CRUD
  const addCert = () => set('certifications', [...profile.certifications, newCert()]);
  const updateCert = (id: string, field: keyof CertItem, val: string | boolean) =>
    set('certifications', profile.certifications.map(c => (c.id === id ? { ...c, [field]: val } : c)));
  const removeCert = (id: string) => set('certifications', profile.certifications.filter(c => c.id !== id));

  // Team CRUD
  const addMember = () => set('team', [...profile.team, newMember()]);
  const updateMember = (id: string, field: keyof TeamMember, val: string) =>
    set('team', profile.team.map(m => (m.id === id ? { ...m, [field]: val } : m)));
  const removeMember = (id: string) => set('team', profile.team.filter(m => m.id !== id));

  const inputCls = 'w-full bg-[#1A2342] border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-600 focus:outline-none focus:border-[#2563EB]/50 transition-colors';
  const labelCls = 'block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2';
  const sectionHeaderCls = 'text-base font-bold text-white mb-5 pb-3 border-b border-white/[0.08]';

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Business Profile</h1>
          <p className="text-sm text-slate-500 mt-1">
            Your public profile on ProvenQuote — visible to homeowners
          </p>
        </div>
        <div className="flex items-center gap-3">
          {profile.slug && (
            <a
              href={`/business/${profile.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[#2563EB] hover:text-white px-4 py-2.5 rounded-lg border border-[#2563EB]/30 hover:border-white/20 transition-all"
            >
              Preview Profile ↗
            </a>
          )}
          <button
            onClick={saveProfile}
            className={`text-sm font-semibold px-5 py-2.5 rounded-lg transition-all ${
              saved
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
            }`}
          >
            {saved ? '✓ Saved!' : 'Save Profile'}
          </button>
        </div>
      </div>

      {/* Completion score */}
      <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-white">Profile Completion</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {score < 40 ? 'Incomplete profiles get 70% fewer leads. Keep going!' :
               score < 70 ? 'Good progress — add certifications and services to stand out.' :
               score < 90 ? 'Almost there! Add team members and social links.' :
               'Excellent! Your profile is complete and highly visible.'}
            </p>
          </div>
          <div className={`text-4xl font-bold ${score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-yellow-400' : 'text-orange-400'}`}>
            {score}%
          </div>
        </div>
        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-yellow-500' : 'bg-orange-500'}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { label: 'Business name', done: !!profile.businessName },
            { label: 'Phone & email', done: !!(profile.phone && profile.email) },
            { label: 'About section', done: profile.about.length > 100 },
            { label: 'Service area', done: !!profile.serviceAreaCities },
            { label: 'Services listed', done: profile.services.length >= 3 },
            { label: 'Certifications', done: profile.certifications.length >= 1 },
            { label: 'License #', done: !!profile.licenseNumber },
            { label: 'Team members', done: profile.team.length > 0 },
          ].map(({ label, done }) => (
            <span
              key={label}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${
                done
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-white/[0.04] text-slate-600 border-white/[0.06]'
              }`}
            >
              {done ? '✓' : '○'} {label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Section nav */}
        <div className="w-48 shrink-0">
          <nav className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-3 sticky top-6">
            {SECTIONS.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all mb-0.5 ${
                  activeSection === id
                    ? 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Form area */}
        <div className="flex-1 bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8">

          {/* BASIC INFO */}
          {activeSection === 'basic' && (
            <div className="space-y-6">
              <h2 className={sectionHeaderCls}>Basic Information</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Business Name *</label>
                  <input type="text" className={inputCls} value={profile.businessName} onChange={e => set('businessName', e.target.value)} placeholder="Apex Roofing Co." />
                </div>
                <div>
                  <label className={labelCls}>Tagline</label>
                  <input type="text" className={inputCls} value={profile.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Austin's most trusted roofer since 2008" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Phone *</label>
                  <input type="tel" className={inputCls} value={profile.phone} onChange={e => set('phone', e.target.value)} placeholder="(512) 555-0100" />
                </div>
                <div>
                  <label className={labelCls}>Business Email *</label>
                  <input type="email" className={inputCls} value={profile.email} onChange={e => set('email', e.target.value)} placeholder="owner@apexroofing.com" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Website</label>
                  <input type="url" className={inputCls} value={profile.website} onChange={e => set('website', e.target.value)} placeholder="https://apexroofing.com" />
                </div>
                <div>
                  <label className={labelCls}>Profile URL Slug</label>
                  <div className="flex items-center bg-[#1A2342] border border-white/10 rounded-xl overflow-hidden focus-within:border-[#2563EB]/50 transition-colors">
                    <span className="px-3 py-3 text-slate-600 text-sm border-r border-white/[0.08] whitespace-nowrap">provenquote.ai/business/</span>
                    <input
                      type="text"
                      value={profile.slug}
                      onChange={e => set('slug', e.target.value)}
                      placeholder="apex-roofing-austin"
                      className="flex-1 bg-transparent text-white px-3 py-3 text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelCls}>About Your Business</label>
                <textarea
                  className={`${inputCls} resize-none h-32`}
                  value={profile.about}
                  onChange={e => set('about', e.target.value)}
                  placeholder="Tell homeowners who you are, what you specialize in, and why they should choose you. Mention your experience, certifications, and what makes your company different..."
                />
                <p className="text-[10px] text-slate-700 mt-1 text-right">{profile.about.length} chars (100+ recommended)</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Founded Year</label>
                  <input type="text" className={inputCls} value={profile.founded} onChange={e => set('founded', e.target.value)} placeholder="2008" />
                </div>
                <div>
                  <label className={labelCls}>Team Size</label>
                  <input type="text" className={inputCls} value={profile.employeeCount} onChange={e => set('employeeCount', e.target.value)} placeholder="12 employees" />
                </div>
                <div>
                  <label className={labelCls}>Roofs Replaced</label>
                  <input type="text" className={inputCls} value={profile.roofsReplaced} onChange={e => set('roofsReplaced', e.target.value)} placeholder="500+" />
                </div>
              </div>

              <div>
                <label className={labelCls}>Business Hours</label>
                <input type="text" className={inputCls} value={profile.businessHours} onChange={e => set('businessHours', e.target.value)} placeholder="Mon–Fri 7am–6pm, Sat 8am–2pm" />
              </div>

              <div>
                <label className={labelCls}>Payment Methods Accepted</label>
                <div className="flex flex-wrap gap-2">
                  {PAYMENT_OPTIONS.map(method => (
                    <button
                      key={method}
                      onClick={() => togglePayment(method)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                        profile.paymentMethods.includes(method)
                          ? 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/30'
                          : 'bg-white/[0.04] text-slate-500 border-white/[0.08] hover:text-white'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelCls}>Social & Review Links</label>
                <div className="grid grid-cols-2 gap-3">
                  <input type="url" className={inputCls} value={profile.facebook} onChange={e => set('facebook', e.target.value)} placeholder="Facebook URL" />
                  <input type="url" className={inputCls} value={profile.instagram} onChange={e => set('instagram', e.target.value)} placeholder="Instagram URL" />
                  <input type="url" className={inputCls} value={profile.yelp} onChange={e => set('yelp', e.target.value)} placeholder="Yelp URL" />
                  <input type="url" className={inputCls} value={profile.googleProfile} onChange={e => set('googleProfile', e.target.value)} placeholder="Google Business URL" />
                </div>
              </div>
            </div>
          )}

          {/* SERVICE AREA */}
          {activeSection === 'area' && (
            <div className="space-y-6">
              <h2 className={sectionHeaderCls}>Service Area</h2>
              <div>
                <label className={labelCls}>Cities Served (comma separated)</label>
                <textarea
                  className={`${inputCls} resize-none h-24`}
                  value={profile.serviceAreaCities}
                  onChange={e => set('serviceAreaCities', e.target.value)}
                  placeholder="Austin, Round Rock, Cedar Park, Georgetown, Pflugerville, Kyle, Buda, San Marcos"
                />
              </div>
              <div>
                <label className={labelCls}>States</label>
                <input type="text" className={inputCls} value={profile.serviceAreaStates} onChange={e => set('serviceAreaStates', e.target.value)} placeholder="TX" />
              </div>
              <div className="bg-[#1A2342] rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-2">💡 Tip: Adding more cities to your service area increases how many hub pages can feature your profile and send you leads.</p>
              </div>
            </div>
          )}

          {/* SERVICES */}
          {activeSection === 'services' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white">Services Offered</h2>
                <button onClick={addService} className="text-xs font-semibold text-[#2563EB] hover:text-white transition-colors">
                  + Add Service
                </button>
              </div>
              <p className="text-xs text-slate-500 -mt-3">List every service you offer with pricing to help homeowners understand your scope and compare.</p>

              {profile.services.length === 0 && (
                <div className="border-2 border-dashed border-white/[0.08] rounded-2xl p-10 text-center">
                  <p className="text-slate-500 mb-4">No services added yet.</p>
                  <button onClick={addService} className="text-sm font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-lg transition-colors">
                    + Add First Service
                  </button>
                </div>
              )}

              {profile.services.map((svc, i) => (
                <div key={svc.id} className="bg-[#1A2342] border border-white/[0.06] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-slate-600">Service #{i + 1}</span>
                    <button onClick={() => removeService(svc.id)} className="text-xs text-slate-600 hover:text-red-400 transition-colors">Remove</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className={labelCls}>Service Name</label>
                      <input type="text" className={inputCls} value={svc.name} onChange={e => updateService(svc.id, 'name', e.target.value)} placeholder="Full Roof Replacement" />
                    </div>
                    <div>
                      <label className={labelCls}>Price Range</label>
                      <div className="flex gap-2">
                        <input type="text" className={`${inputCls} flex-1`} value={svc.minPrice} onChange={e => updateService(svc.id, 'minPrice', e.target.value)} placeholder="$8,500" />
                        <span className="text-slate-600 self-center">–</span>
                        <input type="text" className={`${inputCls} flex-1`} value={svc.maxPrice} onChange={e => updateService(svc.id, 'maxPrice', e.target.value)} placeholder="$22,000" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Description</label>
                    <textarea className={`${inputCls} resize-none h-20`} value={svc.description} onChange={e => updateService(svc.id, 'description', e.target.value)} placeholder="Describe what's included, materials used, warranties..." />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CERTIFICATIONS */}
          {activeSection === 'certifications' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white">Certifications & Awards</h2>
                <button onClick={addCert} className="text-xs font-semibold text-[#2563EB] hover:text-white transition-colors">+ Add</button>
              </div>

              <div>
                <label className={labelCls}>Quick Add — Common Roofing Certifications</label>
                <div className="flex flex-wrap gap-2">
                  {ROOFING_CERTS.map(cert => {
                    const already = profile.certifications.some(c => c.name === cert);
                    return (
                      <button
                        key={cert}
                        onClick={() => {
                          if (!already) {
                            set('certifications', [...profile.certifications, { id: `cert-${Date.now()}`, name: cert, issuer: cert.split(' ')[0], year: '2024', verified: false }]);
                          }
                        }}
                        disabled={already}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                          already
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 cursor-default'
                            : 'bg-white/[0.04] text-slate-500 border-white/[0.08] hover:text-white hover:border-white/20'
                        }`}
                      >
                        {already ? '✓ ' : '+ '}{cert}
                      </button>
                    );
                  })}
                </div>
              </div>

              {profile.certifications.length === 0 && (
                <div className="border-2 border-dashed border-white/[0.08] rounded-2xl p-10 text-center">
                  <p className="text-slate-500 mb-2">No certifications added.</p>
                  <p className="text-xs text-slate-600">GAF, Owens Corning, and HAAG certifications significantly increase lead quality.</p>
                </div>
              )}

              {profile.certifications.map((cert, i) => (
                <div key={cert.id} className="bg-[#1A2342] border border-white/[0.06] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-600">Certification #{i + 1}</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                        <input type="checkbox" checked={cert.verified} onChange={e => updateCert(cert.id, 'verified', e.target.checked)} className="rounded border-white/20 bg-[#0F1729] text-[#2563EB]" />
                        Verified
                      </label>
                      <button onClick={() => removeCert(cert.id)} className="text-xs text-slate-600 hover:text-red-400 transition-colors">Remove</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className={labelCls}>Certification Name</label>
                      <input type="text" className={inputCls} value={cert.name} onChange={e => updateCert(cert.id, 'name', e.target.value)} placeholder="GAF Master Elite" />
                    </div>
                    <div>
                      <label className={labelCls}>Issuing Organization</label>
                      <input type="text" className={inputCls} value={cert.issuer} onChange={e => updateCert(cert.id, 'issuer', e.target.value)} placeholder="GAF" />
                    </div>
                    <div>
                      <label className={labelCls}>Year Earned</label>
                      <input type="text" className={inputCls} value={cert.year} onChange={e => updateCert(cert.id, 'year', e.target.value)} placeholder="2023" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* INSURANCE & LICENSE */}
          {activeSection === 'insurance' && (
            <div className="space-y-6">
              <h2 className={sectionHeaderCls}>License & Insurance</h2>
              <p className="text-xs text-slate-500 -mt-4">Displaying your license number and insurance details builds homeowner trust and differentiates you from unlicensed competitors.</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Business License Number</label>
                  <input type="text" className={inputCls} value={profile.licenseNumber} onChange={e => set('licenseNumber', e.target.value)} placeholder="TX-ROC-44821" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Insurance Policy Type</label>
                  <input type="text" className={inputCls} value={profile.insurancePolicyType} onChange={e => set('insurancePolicyType', e.target.value)} placeholder="General Liability + Workers Comp" />
                </div>
                <div>
                  <label className={labelCls}>Coverage Amount</label>
                  <input type="text" className={inputCls} value={profile.insuranceCoverage} onChange={e => set('insuranceCoverage', e.target.value)} placeholder="$2,000,000" />
                </div>
                <div>
                  <label className={labelCls}>Policy Expiry</label>
                  <input type="text" className={inputCls} value={profile.insuranceExpiry} onChange={e => set('insuranceExpiry', e.target.value)} placeholder="Dec 2026" />
                </div>
              </div>

              <div className="bg-[#1A2342] rounded-xl p-4 border border-amber-500/10">
                <p className="text-xs text-amber-400 font-semibold mb-1">⚠ Verification Coming Soon</p>
                <p className="text-xs text-slate-500">License verification will be added in a future update. For now, enter your details — they&apos;ll display on your public profile with an &ldquo;Unverified&rdquo; badge until we can confirm.</p>
              </div>
            </div>
          )}

          {/* TEAM */}
          {activeSection === 'team' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white">Team Members</h2>
                <button onClick={addMember} className="text-xs font-semibold text-[#2563EB] hover:text-white transition-colors">+ Add Member</button>
              </div>
              <p className="text-xs text-slate-500 -mt-3">Put faces to your company — homeowners trust businesses they can see.</p>

              {profile.team.length === 0 && (
                <div className="border-2 border-dashed border-white/[0.08] rounded-2xl p-10 text-center">
                  <p className="text-slate-500 mb-4">No team members added yet.</p>
                  <button onClick={addMember} className="text-sm font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-lg transition-colors">
                    + Add First Member
                  </button>
                </div>
              )}

              {profile.team.map((member, i) => (
                <div key={member.id} className="bg-[#1A2342] border border-white/[0.06] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-600">Team Member #{i + 1}</span>
                    <button onClick={() => removeMember(member.id)} className="text-xs text-slate-600 hover:text-red-400 transition-colors">Remove</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className={labelCls}>Name</label>
                      <input type="text" className={inputCls} value={member.name} onChange={e => updateMember(member.id, 'name', e.target.value)} placeholder="John Smith" />
                    </div>
                    <div>
                      <label className={labelCls}>Role / Title</label>
                      <input type="text" className={inputCls} value={member.role} onChange={e => updateMember(member.id, 'role', e.target.value)} placeholder="Lead Installer" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Bio</label>
                    <textarea className={`${inputCls} resize-none h-16`} value={member.bio} onChange={e => updateMember(member.id, 'bio', e.target.value)} placeholder="15 years of roofing experience, GAF certified..." />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Save button at bottom of form */}
          <div className="mt-8 pt-6 border-t border-white/[0.08] flex justify-end">
            <button
              onClick={saveProfile}
              className={`text-sm font-semibold px-6 py-3 rounded-xl transition-all ${
                saved
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
              }`}
            >
              {saved ? '✓ Saved!' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
