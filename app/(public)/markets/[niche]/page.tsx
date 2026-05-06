import { NICHES, getNiche } from '@/lib/niches';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ niche: string }>;
}

export async function generateStaticParams() {
  return NICHES.map(n => ({ niche: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { niche: nicheSlug } = await params;
  const niche = getNiche(nicheSlug);
  if (!niche) return {};
  return {
    title: `${niche.name} Markets`,
    description: `Browse available ${niche.name.toLowerCase()} market leases across hundreds of US cities. Exclusive leads — one ${niche.roleLabel} per city.`,
  };
}

const MARKETS_BY_NICHE: Record<string, { city: string; state: string; estLeads: number; price: number; available: boolean }[]> = {
  roofing: [
    { city: 'Austin', state: 'TX', estLeads: 38, price: 2400, available: true },
    { city: 'Tampa', state: 'FL', estLeads: 41, price: 2400, available: false },
    { city: 'Kansas City', state: 'MO', estLeads: 34, price: 2400, available: true },
    { city: 'Nashville', state: 'TN', estLeads: 30, price: 2400, available: true },
    { city: 'Minneapolis', state: 'MN', estLeads: 29, price: 2400, available: true },
    { city: 'Denver', state: 'CO', estLeads: 35, price: 2400, available: true },
  ],
  hvac: [
    { city: 'Phoenix', state: 'AZ', estLeads: 52, price: 1800, available: true },
    { city: 'Atlanta', state: 'GA', estLeads: 48, price: 1800, available: true },
    { city: 'Las Vegas', state: 'NV', estLeads: 44, price: 1800, available: false },
    { city: 'Denver', state: 'CO', estLeads: 39, price: 1800, available: true },
    { city: 'Charlotte', state: 'NC', estLeads: 36, price: 1800, available: false },
    { city: 'Indianapolis', state: 'IN', estLeads: 32, price: 1800, available: true },
  ],
  solar: [
    { city: 'San Diego', state: 'CA', estLeads: 61, price: 3200, available: true },
    { city: 'Sacramento', state: 'CA', estLeads: 55, price: 3200, available: false },
    { city: 'Denver', state: 'CO', estLeads: 33, price: 3200, available: false },
    { city: 'Austin', state: 'TX', estLeads: 45, price: 3200, available: true },
    { city: 'Las Vegas', state: 'NV', estLeads: 48, price: 3200, available: false },
  ],
};

export default async function NicheMarketsPage({ params }: Props) {
  const { niche: nicheSlug } = await params;
  const niche = getNiche(nicheSlug);
  if (!niche) notFound();

  const markets = MARKETS_BY_NICHE[nicheSlug] ?? [
    { city: 'Austin', state: 'TX', estLeads: Math.round(niche.avgLeasePrice / 70), price: niche.avgLeasePrice, available: true },
    { city: 'Denver', state: 'CO', estLeads: Math.round(niche.avgLeasePrice / 80), price: niche.avgLeasePrice, available: true },
    { city: 'Phoenix', state: 'AZ', estLeads: Math.round(niche.avgLeasePrice / 65), price: niche.avgLeasePrice, available: false },
    { city: 'Nashville', state: 'TN', estLeads: Math.round(niche.avgLeasePrice / 85), price: niche.avgLeasePrice, available: true },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-12">
        <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-widest mb-3">Market Leases</p>
        <h1 className="text-4xl font-bold text-white mb-4">{niche.name} Markets</h1>
        <p className="text-xl text-slate-400 max-w-2xl">
          Exclusive {niche.name.toLowerCase()} leads by city. One {niche.roleLabel} per market. ${niche.avgLeasePrice.toLocaleString()}/mo standard pricing.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {markets.map((m, i) => {
          const cityState = `${m.city.toLowerCase().replace(/ /g, '-')}-${m.state.toLowerCase()}`;
          return (
            <div key={i} className="bg-[#0F1729] border border-white/[0.08] hover:border-white/[0.16] rounded-2xl p-6 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">{niche.name}</p>
                  <h3 className="text-lg font-semibold text-white">{m.city}, {m.state}</h3>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  m.available
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {m.available ? 'Available' : 'Leased'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Est. monthly leads</p>
                  <p className="text-xl font-bold text-white">{m.estLeads}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Monthly lease</p>
                  <p className="text-xl font-bold text-white">${m.price.toLocaleString()}/mo</p>
                </div>
              </div>
              {m.available ? (
                <Link
                  href={`/lease/${niche.slug}/${cityState}`}
                  className="block w-full text-center bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
                >
                  Lease This Market
                </Link>
              ) : (
                <Link
                  href={`/leads/${niche.slug}/${cityState}`}
                  className="block w-full text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
                >
                  Buy Individual Leads
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <p className="text-slate-400 mb-4 text-sm">Don&apos;t see your city? We&apos;re expanding constantly.</p>
        <Link href="/markets" className="text-[#2563EB] hover:text-white transition-colors text-sm font-medium">
          View all available markets
        </Link>
      </div>
    </div>
  );
}
