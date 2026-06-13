'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PartnershipBriefingPage() {
  const router = useRouter();
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [partnerRole, setPartnerRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if partner is authenticated via localStorage
    const stored = {
      name: typeof window !== 'undefined' ? localStorage.getItem('partnerName') : null,
      role: typeof window !== 'undefined' ? localStorage.getItem('partnerRole') : null,
    };

    if (!stored.name) {
      router.push('/partnership');
      return;
    }

    setPartnerName(stored.name);
    setPartnerRole(stored.role);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('partnerName');
    localStorage.removeItem('partnerRole');
    router.push('/partnership');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1128] via-[#0F1729] to-[#0A1128] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D4FF]"></div>
          <p className="mt-4 text-slate-400">Loading briefing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1128] via-[#0F1729] to-[#0A1128]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#080C14]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#00D4FF] uppercase tracking-widest">Partner Portal</p>
            <p className="font-bold text-white">{partnerName}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{partnerRole}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 text-slate-300 rounded-lg transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Welcome Section */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-[#00D4FF] via-[#C9A84C] to-[#00D4FF] bg-clip-text text-transparent">
              Strategic Briefing
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl">
            Exclusive insights into market performance, portfolio strategy, and growth opportunities.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-gradient-to-br from-[#00D4FF]/10 to-transparent border border-[#00D4FF]/30 rounded-xl p-6 backdrop-blur-sm">
            <p className="text-sm text-slate-400 mb-2">Active Markets</p>
            <p className="text-3xl font-bold text-white">12</p>
            <p className="text-xs text-[#00D4FF] mt-2">↑ 3 new this month</p>
          </div>

          <div className="bg-gradient-to-br from-[#C9A84C]/10 to-transparent border border-[#C9A84C]/30 rounded-xl p-6 backdrop-blur-sm">
            <p className="text-sm text-slate-400 mb-2">Total Leads</p>
            <p className="text-3xl font-bold text-white">847</p>
            <p className="text-xs text-[#C9A84C] mt-2">↑ 124 this month</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
            <p className="text-sm text-slate-400 mb-2">Conversion Rate</p>
            <p className="text-3xl font-bold text-white">18.2%</p>
            <p className="text-xs text-green-400 mt-2">↑ 2.1% vs last quarter</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
            <p className="text-sm text-slate-400 mb-2">Est. Monthly Revenue</p>
            <p className="text-3xl font-bold text-white">$847K</p>
            <p className="text-xs text-blue-400 mt-2">↑ $123K vs last month</p>
          </div>
        </div>

        {/* Market Performance */}
        <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] rounded-2xl p-8 mb-16 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-8">Market Performance</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Market</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-semibold">Leads</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-semibold">Booked</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-semibold">Closed</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-semibold">Conv. Rate</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-semibold">Monthly Cost</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-semibold">ROI</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { market: 'Roofing, Austin TX', leads: 68, booked: 14, closed: 12, conv: 17.6, cost: 3000, roi: 1683 },
                  { market: 'HVAC, Denver CO', leads: 54, booked: 11, closed: 9, conv: 16.7, cost: 2500, roi: 1440 },
                  { market: 'Plumbing, Phoenix AZ', leads: 72, booked: 15, closed: 13, conv: 18.1, cost: 2800, roi: 1858 },
                  { market: 'Electrical, Portland OR', leads: 45, booked: 8, closed: 7, conv: 15.6, cost: 2200, roi: 1136 },
                  { market: 'Landscaping, Seattle WA', leads: 52, booked: 10, closed: 8, conv: 15.4, cost: 2400, roi: 1333 },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="py-4 px-4 text-white font-medium">{row.market}</td>
                    <td className="py-4 px-4 text-right text-slate-300">{row.leads}</td>
                    <td className="py-4 px-4 text-right text-slate-300">{row.booked}</td>
                    <td className="py-4 px-4 text-right text-white font-semibold">{row.closed}</td>
                    <td className="py-4 px-4 text-right">
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                        {row.conv}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-slate-300">${row.cost.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right">
                      <span className="bg-[#00D4FF]/20 text-[#00D4FF] px-3 py-1 rounded-full text-xs font-semibold">
                        {row.roi}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Strategic Insights */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-4">📊 Growth Opportunities</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex gap-3">
                <span className="text-[#00D4FF]">→</span>
                Expand HVAC market to Colorado Springs (+$8K MRR potential)
              </li>
              <li className="flex gap-3">
                <span className="text-[#00D4FF]">→</span>
                Launch Solar services in high-penetration markets
              </li>
              <li className="flex gap-3">
                <span className="text-[#00D4FF]">→</span>
                Optimize Plumbing conv. rate to match Roofing benchmarks
              </li>
              <li className="flex gap-3">
                <span className="text-[#00D4FF]">→</span>
                Strategic partnerships with complementary niches
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-4">⚡ Recent Highlights</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex gap-3">
                <span className="text-[#C9A84C]">•</span>
                Q2 revenue exceeded projections by 23%
              </li>
              <li className="flex gap-3">
                <span className="text-[#C9A84C]">•</span>
                Lead quality scores improved across all markets
              </li>
              <li className="flex gap-3">
                <span className="text-[#C9A84C]">•</span>
                Customer satisfaction scores at all-time high (4.8/5.0)
              </li>
              <li className="flex gap-3">
                <span className="text-[#C9A84C]">•</span>
                Launched new predictive analytics dashboard
              </li>
            </ul>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-[#00D4FF]/20 to-[#C9A84C]/20 border border-[#00D4FF]/30 rounded-2xl p-8 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-white mb-4">📞 Next Steps</h3>
          <p className="text-slate-300 mb-6">
            For detailed market analysis, partnership proposals, or strategic alignment discussions, please contact our partnership team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:partners@provenquote.ai"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#00D4FF] hover:bg-[#00B8D4] text-[#0A1128] font-semibold rounded-lg transition-colors"
            >
              Schedule a Call
            </a>
            <a
              href="mailto:partners@provenquote.ai?subject=Partnership Inquiry"
              className="inline-flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors"
            >
              Send a Message
            </a>
          </div>
        </div>
      </main>

      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 right-40 w-96 h-96 bg-[#00D4FF]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-40 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
