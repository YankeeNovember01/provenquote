'use client';

import { useState } from 'react';
import Link from 'next/link';

const LEASES = [
  {
    niche: 'Roofing',
    city: 'Austin',
    state: 'TX',
    cost: 2400,
    nextBilling: 'June 1, 2026',
    leadsThisMonth: 34,
    leadsLastMonth: 28,
    status: 'Active',
    startDate: 'March 1, 2026',
  },
  {
    niche: 'HVAC',
    city: 'Phoenix',
    state: 'AZ',
    cost: 1800,
    nextBilling: 'June 3, 2026',
    leadsThisMonth: 31,
    leadsLastMonth: 30,
    status: 'Active',
    startDate: 'March 3, 2026',
  },
  {
    niche: 'Solar',
    city: 'Denver',
    state: 'CO',
    cost: 2600,
    nextBilling: 'June 8, 2026',
    leadsThisMonth: 19,
    leadsLastMonth: 22,
    status: 'Active',
    startDate: 'April 8, 2026',
  },
];

export default function LeasesPage() {
  const [cancelling, setCancelling] = useState<string | null>(null);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">My Leases</h1>
        <Link
          href="/dashboard/markets"
          className="text-sm font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2.5 rounded-lg transition-colors"
        >
          Add Market
        </Link>
      </div>

      {LEASES.length === 0 ? (
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-16 text-center">
          <p className="text-slate-400 mb-6">You don&apos;t have any active leases.</p>
          <Link
            href="/dashboard/markets"
            className="inline-flex items-center justify-center bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Browse Available Markets
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {LEASES.map(lease => {
            const trend = lease.leadsThisMonth - lease.leadsLastMonth;
            const trendUp = trend >= 0;
            const key = `${lease.niche}-${lease.city}`;

            return (
              <div key={key} className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-bold text-white">{lease.niche} — {lease.city}, {lease.state}</h2>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Active
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">Leased since {lease.startDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href="/dashboard/analytics"
                      className="text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Analytics
                    </Link>
                    {cancelling === key ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">Cancel this lease?</span>
                        <button
                          onClick={() => setCancelling(null)}
                          className="text-sm font-semibold text-[#EF4444] hover:text-white transition-colors px-3 py-2"
                        >
                          Yes, cancel
                        </button>
                        <button
                          onClick={() => setCancelling(null)}
                          className="text-sm font-medium text-slate-500 hover:text-white transition-colors"
                        >
                          Never mind
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setCancelling(key)}
                        className="text-sm font-medium text-slate-600 hover:text-[#EF4444] transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Leads this month</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-white">{lease.leadsThisMonth}</p>
                      <span className={`text-sm font-semibold ${trendUp ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                        {trendUp ? '+' : ''}{trend} vs last mo
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Last month</p>
                    <p className="text-3xl font-bold text-white">{lease.leadsLastMonth}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Monthly cost</p>
                    <p className="text-3xl font-bold text-white">${lease.cost.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Next renewal</p>
                    <p className="text-lg font-semibold text-white">{lease.nextBilling}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
