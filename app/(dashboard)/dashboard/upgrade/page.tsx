'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Lock, Zap, CreditCard } from 'lucide-react';

const FREE_FEATURES = [
  { text: 'Browse all available leads', detail: 'See lead cards & expand for details' },
  { text: 'Buy individual leads', detail: 'Pay per lead via Stripe' },
  { text: 'Basic business profile', detail: 'Your business info on ProvenQuote' },
  { text: 'Analytics dashboard', detail: 'View your own data & stats' },
  { text: 'Messages with homeowners', detail: 'Communicate with leads you purchase' },
  { text: 'Proposal management', detail: 'Send & track your proposals' },
];

const PRO_FEATURES = [
  { text: 'Everything in Free', detail: 'All Free tier features included' },
  { text: 'Lease exclusive markets', detail: 'Own a niche × city — every lead goes to you' },
  { text: 'Consumer Intel', detail: 'Private notes from verified businesses about homeowners' },
  { text: 'Public profile page', detail: 'Your business page live on ProvenQuote.ai' },
  { text: 'AI Pipeline Insights', detail: 'Close rate, win rate, and pipeline analytics' },
  { text: 'Priority lead notifications', detail: 'First to see new leads in your area' },
  { text: 'Dedicated support', detail: 'Priority response from our team' },
];

export default function UpgradePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'pro_subscription' }),
      });
      const { url, error: err } = await res.json();
      if (err) {
        setError(err);
      } else if (url) {
        window.location.href = url;
      }
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-blue-400 mb-4">
          Upgrade Your Plan
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Unlock the full ProvenQuote platform</h1>
        <p className="text-slate-400 text-base max-w-xl mx-auto">
          Free gets you started. Pro gets you exclusive. Lease entire cities, own your niche, and scale without competing.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-sm text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Plan cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Free */}
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold text-white">Free</h2>
            <span className="text-xs font-semibold bg-slate-700/50 text-slate-400 px-2.5 py-1 rounded-full">Current Plan</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">$0<span className="text-base font-normal text-slate-500">/mo</span></p>
          <p className="text-sm text-slate-500 mb-6">All the basics to get started buying leads.</p>
          <div className="space-y-3">
            {FREE_FEATURES.map((f) => (
              <div key={f.text} className="flex items-start gap-3">
                <span className="text-emerald-400 text-sm mt-0.5">&#10003;</span>
                <div>
                  <p className="text-sm text-white font-medium">{f.text}</p>
                  <p className="text-xs text-slate-500">{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pro */}
        <div className="bg-gradient-to-br from-[#0F1729] to-[#1a2442] border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold text-white">Pro</h2>
            <span className="text-xs font-semibold bg-blue-600 text-white px-2.5 py-1 rounded-full">Recommended</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">$29<span className="text-base font-normal text-slate-400">/mo</span></p>
          <p className="text-sm text-slate-400 mb-6">Everything you need to dominate your local market.</p>
          <div className="space-y-3 mb-6">
            {PRO_FEATURES.map((f, i) => (
              <div key={f.text} className="flex items-start gap-3">
                <span className={`text-sm mt-0.5 ${i === 0 ? 'text-slate-400' : 'text-blue-400'}`}>
                  {i === 0 ? String.fromCharCode(10003) : '→'}
                </span>
                <div>
                  <p className="text-sm text-white font-medium">{f.text}</p>
                  <p className="text-xs text-slate-500">{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
          >
            {loading ? 'Redirecting to Stripe...' : 'Upgrade to Pro — $29/mo →'}
          </button>
          <p className="text-xs text-slate-500 text-center mt-3">Cancel anytime. No contracts.</p>
        </div>
      </div>

      {/* Feature comparison table */}
      <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-white/[0.08]">
          <h3 className="text-sm font-semibold text-white">Full Feature Comparison</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-[#1A2342] border-b border-white/[0.06]">
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Feature</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Free</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-blue-400 uppercase tracking-wide">Pro</th>
            </tr>
          </thead>
          <tbody>
            {[
              { feature: 'Browse all leads', free: true, pro: true },
              { feature: 'Buy individual leads', free: true, pro: true },
              { feature: 'Proposals & messages', free: true, pro: true },
              { feature: 'Analytics dashboard', free: true, pro: true },
              { feature: 'Basic profile', free: true, pro: true },
              { feature: 'Lease exclusive markets', free: false, pro: true },
              { feature: 'Consumer Intel (homeowner data)', free: false, pro: true },
              { feature: 'Public business profile page', free: false, pro: true },
              { feature: 'AI Pipeline Insights', free: false, pro: true },
              { feature: 'Priority lead notifications', free: false, pro: true },
              { feature: 'Dedicated support', free: false, pro: true },
            ].map(({ feature, free, pro }, i) => (
              <tr key={feature} className={`border-b border-white/[0.04] last:border-0 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                <td className="px-6 py-3.5 text-sm text-slate-300">{feature}</td>
                <td className="px-6 py-3.5 text-center text-sm">
                  {free ? <span className="text-emerald-400">&#10003;</span> : <span className="text-slate-600">—</span>}
                </td>
                <td className="px-6 py-3.5 text-center text-sm">
                  {pro ? <span className="text-blue-400">&#10003;</span> : <span className="text-slate-600">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FAQ / trust signals */}
      <div className="grid md:grid-cols-3 gap-4 text-center">
        {[
          { icon: Lock, title: 'No lock-in', body: 'Cancel your Pro subscription anytime, no questions asked.' },
          { icon: Zap, title: 'Instant access', body: 'Markets, Consumer Intel, and all Pro features unlock immediately.' },
          { icon: CreditCard, title: 'Secure payments', body: 'Powered by Stripe. We never store your card details.' },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-5">
            <Icon className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white mb-1">{title}</p>
            <p className="text-xs text-slate-500">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
