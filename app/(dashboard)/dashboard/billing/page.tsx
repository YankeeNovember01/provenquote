import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Billing' };

const INVOICES = [
  { date: 'May 1, 2026', desc: 'Roofing — Austin, TX (Monthly Lease)', amount: '$2,400.00', status: 'Paid' },
  { date: 'May 3, 2026', desc: 'HVAC — Phoenix, AZ (Monthly Lease)', amount: '$1,800.00', status: 'Paid' },
  { date: 'May 8, 2026', desc: 'Solar — Denver, CO (Monthly Lease)', amount: '$2,600.00', status: 'Paid' },
  { date: 'May 4, 2026', desc: 'Individual Lead — Roofing, Frisco TX', amount: '$85.00', status: 'Paid' },
  { date: 'Apr 1, 2026', desc: 'Roofing — Austin, TX (Monthly Lease)', amount: '$2,400.00', status: 'Paid' },
  { date: 'Apr 3, 2026', desc: 'HVAC — Phoenix, AZ (Monthly Lease)', amount: '$1,800.00', status: 'Paid' },
  { date: 'Apr 8, 2026', desc: 'Solar — Denver, CO (Monthly Lease)', amount: '$2,600.00', status: 'Paid' },
];

const ACTIVE_LEASES = [
  { niche: 'Roofing', city: 'Austin, TX', amount: '$2,400/mo', renewal: 'June 1, 2026' },
  { niche: 'HVAC', city: 'Phoenix, AZ', amount: '$1,800/mo', renewal: 'June 3, 2026' },
  { niche: 'Solar', city: 'Denver, CO', amount: '$2,600/mo', renewal: 'June 8, 2026' },
];

export default function BillingPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Billing</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Active subscriptions */}
        <div className="lg:col-span-2 bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-5">Active Subscriptions</h2>
          <div className="space-y-4">
            {ACTIVE_LEASES.map(lease => (
              <div key={`${lease.niche}-${lease.city}`} className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
                <div>
                  <p className="text-sm font-medium text-white">{lease.niche} — {lease.city}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Renews {lease.renewal}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{lease.amount}</p>
                  <span className="text-xs text-emerald-400">Active</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <p className="text-sm text-slate-500">Total monthly</p>
            <p className="text-xl font-bold text-white">$6,800/mo</p>
          </div>
        </div>

        {/* Payment method */}
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-5">Payment Method</h2>
          <div className="bg-[#1A2342] rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-500">VISA</p>
              <span className="text-xs text-emerald-400 font-medium">Default</span>
            </div>
            <p className="text-white font-mono text-sm tracking-widest">•••• •••• •••• 4242</p>
            <p className="text-xs text-slate-500 mt-2">Expires 09/28</p>
          </div>
          <button className="w-full text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-lg transition-colors">
            Update Payment Method
          </button>

          {/* Affiliate section */}
          <div className="mt-6 pt-5 border-t border-white/[0.08]">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Affiliate Earnings</h3>
            <p className="text-2xl font-bold text-white mb-1">$340</p>
            <p className="text-xs text-slate-500 mb-3">Earned through referrals this month</p>
            <Link
              href="/affiliates"
              className="text-xs font-medium text-[#2563EB] hover:text-white transition-colors"
            >
              View affiliate portal
            </Link>
          </div>
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="bg-[#1A2342] px-6 py-4 border-b border-white/[0.08]">
          <h2 className="text-sm font-semibold text-white">Invoices</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.08]">
                {['Date', 'Description', 'Amount', 'Status', 'PDF'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors border-b border-white/[0.04] last:border-0">
                  <td className="px-6 py-3.5 text-sm text-slate-500 whitespace-nowrap">{inv.date}</td>
                  <td className="px-6 py-3.5 text-sm text-slate-300">{inv.desc}</td>
                  <td className="px-6 py-3.5 text-sm font-semibold text-white whitespace-nowrap">{inv.amount}</td>
                  <td className="px-6 py-3.5">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <button className="text-xs font-medium text-[#2563EB] hover:text-white transition-colors">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
