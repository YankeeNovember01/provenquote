import { Trophy, Zap, Megaphone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export default function AdsPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide mb-6">
        Coming Soon · Q3 2026
      </div>
      <h1 className="text-3xl font-bold text-white mb-4">Ads Manager</h1>
      <p className="text-slate-400 text-lg mb-8">
        Promote your business directly on ProvenQuote hub pages and appear at the top of local results for your niche and city.
      </p>

      <div className="grid grid-cols-1 gap-4 text-left mb-10">
        {([
          {
            icon: Trophy,
            title: 'Featured Listing',
            desc: 'Appear first in the contractor directory for your city and niche. Lock in priority placement before competitors.',
          },
          {
            icon: Zap,
            title: 'Sponsored Leads',
            desc: "Pay to be alerted the instant a high-value lead comes in — before it's available to the open market.",
          },
          {
            icon: Megaphone,
            title: 'Hub Banner',
            desc: 'Put your brand in front of homeowners actively searching for your service in specific cities.',
          },
        ] as { icon: LucideIcon; title: string; desc: string }[]).map(item => (
          <div
            key={item.title}
            className="flex gap-4 bg-white/[0.03] border border-white/[0.06] rounded-xl p-5"
          >
            <item.icon className="w-6 h-6 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white mb-1">{item.title}</p>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-600">You&apos;ll be notified when Ads Manager launches for your niche.</p>
    </div>
  );
}
