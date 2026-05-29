'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// ── Hex token icon ─────────────────────────────────────────────────────────
function HexIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" />
    </svg>
  );
}

// ── Tier math ──────────────────────────────────────────────────────────────
const TIERS = [
  { min: 5000, bonus: 0.20, label: '20% bonus' },
  { min: 3000, bonus: 0.16, label: '16% bonus' },
  { min: 2000, bonus: 0.12, label: '12% bonus' },
  { min: 1000, bonus: 0.08, label: '8% bonus'  },
  { min: 500,  bonus: 0.05, label: '5% bonus'  },
  { min: 50,   bonus: 0,    label: 'No bonus'  },
];

const PACKAGES = [
  { pay: 500,  get: 525,  bonus: 25,   pct: 5  },
  { pay: 1000, get: 1080, bonus: 80,   pct: 8  },
  { pay: 2000, get: 2240, bonus: 240,  pct: 12 },
  { pay: 3000, get: 3480, bonus: 480,  pct: 16 },
  { pay: 5000, get: 6000, bonus: 1000, pct: 20 },
];

function getBonus(amount: number) {
  for (const tier of TIERS) {
    if (amount >= tier.min) return tier.bonus;
  }
  return 0;
}

interface Props {
  baseBalance:  number;
  bonusBalance: number;
}

export default function CreditsClient({ baseBalance, bonusBalance }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [raw, setRaw] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const successParam = searchParams.get('success');

  const customAmount = useMemo(() => {
    const n = parseFloat(raw.replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
  }, [raw]);

  const activeAmount = selected ?? customAmount;
  const bonusPct     = getBonus(activeAmount);
  const bonusAmt     = Math.floor(activeAmount * bonusPct);
  const total        = activeAmount + bonusAmt;
  const isValid      = activeAmount >= 50;
  const isTooLow     = customAmount > 0 && customAmount < 50 && selected === null;

  const totalBalance = baseBalance + bonusBalance;

  async function handleBuyCredits() {
    if (!isValid) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: activeAmount }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl">

      {/* ── Success banner ── */}
      {successParam && (
        <div className="mb-6 bg-[#059669]/10 border border-[#059669]/30 rounded-xl px-5 py-4 flex items-center gap-3">
          <HexIcon className="w-5 h-5 text-[#10B981] flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#10B981]">Credits purchased successfully!</p>
            <p className="text-xs text-slate-400 mt-0.5">Your credit balance has been updated.</p>
          </div>
        </div>
      )}

      {/* ── Page header ── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Credits</h1>
        <p className="text-sm text-slate-500">Buy credits to spend on hub leases, individual leads, and auction bids.</p>
      </div>

      {/* ── Balance card ── */}
      <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Your Credit Balance</p>
          <div className="flex items-center gap-2">
            <HexIcon className="w-6 h-6 text-[#10B981]" />
            <span className="text-4xl font-bold text-white">{totalBalance.toLocaleString()}</span>
          </div>
          {bonusBalance > 0 && (
            <p className="text-xs text-slate-500 mt-1">
              {baseBalance.toLocaleString()} base + <span className="text-[#10B981]">{bonusBalance.toLocaleString()} bonus</span>
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <HexIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>1 credit = $1</span>
          </div>
          <div className="flex items-center gap-2">
            <HexIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>Use on leases, leads, bids</span>
          </div>
          <div className="flex items-center gap-2">
            <HexIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>Base credits never expire</span>
          </div>
        </div>
      </div>

      {/* ── Package grid ── */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Credit Packages</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PACKAGES.map((pkg) => (
            <button
              key={pkg.pay}
              onClick={() => { setSelected(pkg.pay); setRaw(''); }}
              className={`relative text-left p-5 rounded-xl border transition-all ${
                selected === pkg.pay
                  ? 'bg-[#059669]/10 border-[#059669]/50'
                  : 'bg-[#0F1729] border-white/[0.08] hover:border-white/20'
              }`}
            >
              {pkg.pay === 5000 && (
                <span className="absolute -top-2.5 left-4 bg-[#059669] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Most value
                </span>
              )}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xl font-bold text-white">${pkg.pay.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">you pay</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-[#10B981] flex items-center gap-1 justify-end">
                    <HexIcon className="w-4 h-4" />
                    {pkg.get.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">credits</p>
                </div>
              </div>
              <div className="text-xs text-[#10B981]">+{pkg.bonus.toLocaleString()} bonus ({pkg.pct}%)</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Custom amount ── */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Custom Amount</p>
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-xl p-5">
          <div className={`flex items-center gap-3 bg-[#080C14] border rounded-lg px-4 py-3 transition-colors mb-3 ${
            isTooLow ? 'border-red-500/40' : raw && !isTooLow ? 'border-[#059669]/40' : 'border-white/[0.08]'
          }`}>
            <span className="text-slate-400 text-sm font-medium">$</span>
            <input
              type="number"
              min={50}
              value={raw}
              onChange={(e) => { setRaw(e.target.value); setSelected(null); }}
              placeholder="Enter any amount (min $50)"
              className="flex-1 bg-transparent text-white text-sm placeholder-slate-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            {raw && (
              <button onClick={() => setRaw('')} className="text-slate-600 hover:text-slate-400 transition-colors text-lg leading-none">×</button>
            )}
          </div>
          {isTooLow && <p className="text-xs text-red-400 mb-3">Minimum purchase is $50</p>}
          {!isTooLow && customAmount >= 50 && selected === null && (
            <p className="text-xs text-slate-500 mb-3">
              {bonusPct > 0
                ? `You'll receive ${customAmount.toLocaleString()} base + ${bonusAmt.toLocaleString()} bonus = ${total.toLocaleString()} credits`
                : `You'll receive ${customAmount.toLocaleString()} credits — spend $${(500 - customAmount).toLocaleString()} more for 5% bonus`}
            </p>
          )}
        </div>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* ── Order summary + CTA ── */}
      {isValid && (
        <div className="bg-[#0F1729] border border-[#059669]/30 rounded-xl p-6 mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Order Summary</p>
          <div className="space-y-3 mb-5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">You pay</span>
              <span className="text-white font-medium">${activeAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Base credits</span>
              <span className="text-white font-medium flex items-center gap-1">
                <HexIcon className="w-3 h-3 text-slate-500" />{activeAmount.toLocaleString()}
              </span>
            </div>
            {bonusAmt > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Bonus credits ({Math.round(bonusPct * 100)}%)</span>
                <span className="text-[#10B981] font-medium flex items-center gap-1">
                  <HexIcon className="w-3 h-3" />+{bonusAmt.toLocaleString()}
                </span>
              </div>
            )}
            <div className="border-t border-white/[0.06] pt-3 flex justify-between">
              <span className="text-sm font-semibold text-white">Total credits</span>
              <span className="text-lg font-bold text-[#10B981] flex items-center gap-1.5">
                <HexIcon className="w-4 h-4" />{total.toLocaleString()}
              </span>
            </div>
          </div>
          <button
            onClick={handleBuyCredits}
            disabled={loading}
            className="w-full bg-[#059669] hover:bg-[#047857] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg transition-colors text-sm"
          >
            {loading ? 'Redirecting to Stripe…' : `Buy ${total.toLocaleString()} credits for $${activeAmount.toLocaleString()}`}
          </button>
          <p className="text-[10px] text-slate-600 mt-2 text-center">Secure payment via Stripe. Credits added instantly after payment.</p>
        </div>
      )}

      {/* ── Credit rules ── */}
      <div className="bg-[#0F1729]/50 border border-white/[0.05] rounded-xl px-5 py-4">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Credit Rules</p>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
          {[
            'Base credits never expire',
            'Bonus credits expire 180 days after full vest',
            'Bonus vesting: 60-day linear release',
            'Max $1,500 bonus credits per 90-day window',
            'Usable on leases, leads, and auction bids',
            'Non-transferable between accounts',
            'Non-refundable',
            'Min purchase $50, no maximum',
          ].map((rule) => (
            <p key={rule} className="text-xs text-slate-500 flex items-start gap-1.5">
              <span className="text-slate-600 mt-0.5">—</span>{rule}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
