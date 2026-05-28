'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface PaymentMethod {
  brand: string | null | undefined;
  last4: string | null | undefined;
  expMonth: number | null | undefined;
  expYear: number | null | undefined;
}

interface Invoice {
  id: string;
  number: string | null;
  amount: number;
  status: string | null;
  date: string;
  pdf: string | null;
  description: string;
}

interface Subscription {
  id: string;
  status: string;
  amount: number;
  interval: string | null | undefined;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string;
  description: string;
}

interface BillingData {
  hasStripe: boolean;
  invoices: Invoice[];
  paymentMethod: PaymentMethod | null;
  subscriptions: Subscription[];
}

function capitalise(s: string | null | undefined) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function BillingClient() {
  const [data, setData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/billing/data')
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  async function openPortal() {
    setPortalLoading(true);
    try {
      const r = await fetch('/api/billing/portal', { method: 'POST' });
      const d = await r.json();
      if (d.url) window.location.href = d.url;
      else setError(d.error || 'Could not open billing portal');
    } catch (e) {
      setError(String(e));
    } finally {
      setPortalLoading(false);
    }
  }

  const totalMonthly = data?.subscriptions.reduce((sum, s) => sum + s.amount, 0) ?? 0;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Billing</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Active subscriptions */}
            <div className="lg:col-span-2 bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-white mb-5">Active Subscriptions</h2>
              {data?.subscriptions.length === 0 ? (
                <p className="text-sm text-slate-500 py-4">No active subscriptions.</p>
              ) : (
                <div className="space-y-4">
                  {data?.subscriptions.map(sub => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{sub.description}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {sub.cancelAtPeriodEnd
                            ? `Cancels ${sub.currentPeriodEnd}`
                            : `Renews ${sub.currentPeriodEnd}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white">
                          ${sub.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}/{sub.interval ?? 'mo'}
                        </p>
                        <span
                          className={`text-xs ${
                            sub.cancelAtPeriodEnd ? 'text-yellow-400' : 'text-emerald-400'
                          }`}
                        >
                          {sub.cancelAtPeriodEnd ? 'Canceling' : capitalise(sub.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {(data?.subscriptions.length ?? 0) > 0 && (
                <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <p className="text-sm text-slate-500">Total monthly</p>
                  <p className="text-xl font-bold text-white">
                    ${totalMonthly.toLocaleString('en-US', { minimumFractionDigits: 2 })}/mo
                  </p>
                </div>
              )}
            </div>

            {/* Payment method */}
            <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-white mb-5">Payment Method</h2>
              {data?.paymentMethod ? (
                <div className="bg-[#1A2342] rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-slate-500 uppercase">{data.paymentMethod.brand}</p>
                    <span className="text-xs text-emerald-400 font-medium">Default</span>
                  </div>
                  <p className="text-white font-mono text-sm tracking-widest">
                    •••• •••• •••• {data.paymentMethod.last4}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Expires{' '}
                    {String(data.paymentMethod.expMonth).padStart(2, '0')}/
                    {String(data.paymentMethod.expYear).slice(-2)}
                  </p>
                </div>
              ) : (
                <div className="bg-[#1A2342] rounded-xl p-4 mb-4">
                  <p className="text-sm text-slate-500">No payment method on file.</p>
                </div>
              )}
              <button
                onClick={openPortal}
                disabled={portalLoading || !data?.hasStripe}
                className="w-full text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {portalLoading ? 'Opening…' : 'Manage Billing'}
              </button>

              {/* Affiliate section */}
              <div className="mt-6 pt-5 border-t border-white/[0.08]">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                  Affiliate Program
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Earn 20% recurring commission for referrals.
                </p>
                <Link
                  href="/affiliates"
                  className="text-xs font-medium text-[#2563EB] hover:text-white transition-colors"
                >
                  View affiliate portal →
                </Link>
              </div>
            </div>
          </div>

          {/* Invoices */}
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="bg-[#1A2342] px-6 py-4 border-b border-white/[0.08]">
              <h2 className="text-sm font-semibold text-white">Invoices</h2>
            </div>
            {data?.invoices.length === 0 ? (
              <p className="px-6 py-8 text-sm text-slate-500">No invoices yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.08]">
                      {['Date', 'Description', 'Amount', 'Status', 'PDF'].map(h => (
                        <th
                          key={h}
                          className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data?.invoices.map(inv => (
                      <tr
                        key={inv.id}
                        className="hover:bg-white/5 transition-colors border-b border-white/[0.04] last:border-0"
                      >
                        <td className="px-6 py-3.5 text-sm text-slate-500 whitespace-nowrap">{inv.date}</td>
                        <td className="px-6 py-3.5 text-sm text-slate-300">{inv.description}</td>
                        <td className="px-6 py-3.5 text-sm font-semibold text-white whitespace-nowrap">
                          ${inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-3.5">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                              inv.status === 'paid'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : inv.status === 'open'
                                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                : 'bg-white/5 text-slate-400 border-white/10'
                            }`}
                          >
                            {capitalise(inv.status)}
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          {inv.pdf ? (
                            <a
                              href={inv.pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-medium text-[#2563EB] hover:text-white transition-colors"
                            >
                              Download
                            </a>
                          ) : (
                            <span className="text-xs text-slate-600">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
