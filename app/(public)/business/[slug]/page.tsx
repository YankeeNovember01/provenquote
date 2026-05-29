import { createClient as createBrowserClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, Globe, Star, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getBusiness(slug: string) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data } = await supabase
    .from('pq_businesses')
    .select('*')
    .eq('slug', slug)
    .single();
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusiness(slug);
  if (!business) return { title: 'Business Not Found' };
  return {
    title: `${business.business_name} | ProvenQuote.ai`,
    description: business.description || `${business.business_name} — Verified service provider on ProvenQuote.ai`,
  };
}

export default async function BusinessProfilePage({ params }: Props) {
  const { slug } = await params;
  const business = await getBusiness(slug);

  if (!business) notFound();

  return (
    <div className="min-h-screen bg-[#080C14] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back */}
        <Link href="/markets" className="text-sm text-slate-500 hover:text-white transition-colors mb-8 inline-block">
          ← Back to Markets
        </Link>

        {/* Header Card */}
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-6">
            {/* Logo / Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-[#2563EB]/20 flex items-center justify-center text-3xl font-bold text-[#2563EB] shrink-0">
              {business.logo_url ? (
                <img src={business.logo_url} alt={business.business_name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                business.business_name.charAt(0).toUpperCase()
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-2xl font-bold text-white">{business.business_name}</h1>
                {business.verified && (
                  <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Verified
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-slate-400 mb-3">
                {business.niche && (
                  <span className="bg-white/5 px-2.5 py-0.5 rounded-full text-xs">{business.niche}</span>
                )}
                {business.city && business.state && (
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{business.city}, {business.state}</span>
                )}
                {business.phone && (
                  <a href={`tel:${business.phone}`} className="flex items-center gap-1 hover:text-white transition-colors"><Phone className="w-3.5 h-3.5" />{business.phone}</a>
                )}
                {business.website && (
                  <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors truncate"><Globe className="w-3.5 h-3.5" />{business.website}</a>
                )}
              </div>

              {business.description && (
                <p className="text-slate-400 text-sm leading-relaxed">{business.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8 mb-6">
          <h2 className="text-lg font-semibold text-white mb-6">Request a Quote</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Your Name</label>
                <input
                  type="text"
                  placeholder="Jane Smith"
                  className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone</label>
                <input
                  type="tel"
                  placeholder="(555) 000-0000"
                  className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Service Needed</label>
              <input
                type="text"
                placeholder="e.g. Roof inspection, HVAC repair..."
                className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Message</label>
              <textarea
                rows={4}
                placeholder="Tell us about your project..."
                className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Send Request
            </button>
          </form>
        </div>

        {/* Trust Signals */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-xl p-5 text-center">
            <Star className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Rated on ProvenQuote</p>
          </div>
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-xl p-5 text-center">
            <ShieldCheck className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400">{business.verified ? 'Verified Pro' : 'Registered Pro'}</p>
          </div>
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-xl p-5 text-center">
            <Zap className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Fast Response</p>
          </div>
        </div>
      </div>
    </div>
  );
}
