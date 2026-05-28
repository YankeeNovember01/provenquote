'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface Lease {
  id: string;
  niche: string;
  city: string;
  state: string;
  monthly_cost: number;
  status: string;
  stripe_subscription_id: string | null;
  started_at: string | null;
  next_billing_at: string | null;
  cancel_at_period_end: boolean | null;
}

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function SuccessBanner() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const successNiche = searchParams.get('niche');
  const successCity = searchParams.get('city');

  if (!success) return null;

  return (
    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400">
      🎉 Lease activated! You now own <strong>{successNiche} leads in {successCity}</strong> exclusively.
      All new leads from this market will come directly to you.
    </div>
  );
}

export default function LeasesPage() {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeases() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: business } = await supabase
        .from('pq_businesses')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!business) { setLoading(false); return; }

      const { data } = await supabase
        .from('pq_market_leases')
        .select('id, niche, city, state, monthly_cost, status, stripe_subscription_id, started_at, next_billing_at, cancel_at_period_end')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      setLeases(data ?? []);
      setLoading(false);
    }

    fetchLeases();
  }, []);

  const handleCancelLease = async (leaseId: string, stripeSubscriptionId: string | null) => {
    setCancelling(leaseId);
    try {
      const res = await fetch('/api/stripe/cancel-lease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leaseId, subscriptionId: stripeSubscriptionId }),
      });
      const data = await res.json();
      if (data.success) {
        setLeases(prev => prev.map(l =>
          l.id === leaseId ? { ...l, status: 'cancelling', cancel_at_period_end: true } : l
        ));
        setShowCancelModal(null);
        alert('Lease cancellation scheduled. You will retain access until the end of the billing period.');
      } else {
        alert(data.error || 'Failed to cancel. Please contact support.');
      }
    } catch {
      alert('Failed to cancel. Please contact support.');
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-white mb-4">My Leases</h1>
        <p className="text-slate-500">Loading leases...</p>
      </div>
    );
  }

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

      <Suspense fallback={null}>
        <SuccessBanner />
      </Suspense>

      {leases.length === 0 ? (
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
          {leases.map(lease => {
            const isCancelling = lease.cancel_at_period_end || lease.status === 'cancelling';
            const isActive = lease.status === 'active' || lease.status === 'Active';

            return (
              <div key={lease.id} className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-bold text-white">{lease.niche} — {lease.city}, {lease.state}</h2>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        isCancelling
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>
                        {isCancelling ? 'Cancelling' : isActive ? 'Active' : lease.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">Leased since {formatDate(lease.started_at)}</p>
                    {isCancelling && (
                      <p className="text-xs text-amber-400/70 mt-1">Access continues until {formatDate(lease.next_billing_at)}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href="/dashboard/analytics"
                      className="text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Analytics
                    </Link>
                    {!isCancelling && (
                      showCancelModal === lease.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-400">Cancel this lease?</span>
                          <button
                            onClick={() => handleCancelLease(lease.id, lease.stripe_subscription_id)}
                            disabled={cancelling === lease.id}
                            className="text-sm font-semibold text-[#EF4444] hover:text-white disabled:opacity-50 transition-colors px-3 py-2"
                          >
                            {cancelling === lease.id ? 'Cancelling...' : 'Yes, cancel'}
                          </button>
                          <button
                            onClick={() => setShowCancelModal(null)}
                            className="text-sm font-medium text-slate-500 hover:text-white transition-colors"
                          >
                            Never mind
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowCancelModal(lease.id)}
                          className="text-sm font-medium text-slate-600 hover:text-[#EF4444] transition-colors"
                        >
                          Cancel
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Monthly cost</p>
                    <p className="text-3xl font-bold text-white">${(lease.monthly_cost ?? 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Next renewal</p>
                    <p className="text-lg font-semibold text-white">{formatDate(lease.next_billing_at)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Stripe subscription</p>
                    <p className="text-sm text-slate-400 font-mono truncate">{lease.stripe_subscription_id ?? '—'}</p>
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
