import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ProvenQuote vs HomeAdvisor, Angi, Thumbtack — Comparison',
  description:
    'How does ProvenQuote exclusive lead generation compare to HomeAdvisor, Angi, and Thumbtack? Side-by-side breakdown for home service contractors.',
};

const FEATURES = [
  { feature: 'Lead exclusivity', provenquote: 'exclusive', ha: 'shared (3–5)', angi: 'shared (3–5)', thumbtack: 'competitive' },
  { feature: 'Avg close rate', provenquote: '28–36%', ha: '10–15%', angi: '10–14%', thumbtack: '12–18%' },
  { feature: 'Cost per lead', provenquote: '$20–$80 effective', ha: '$30–$150', angi: '$25–$120', thumbtack: '$5–$80' },
  { feature: 'Race-to-call pressure', provenquote: 'none', ha: 'extreme', angi: 'extreme', thumbtack: 'high' },
  { feature: 'Branding on page', provenquote: 'your business front & center', ha: 'listed among competitors', angi: 'listed among competitors', thumbtack: 'profile among competitors' },
  { feature: 'Monthly commitment', provenquote: 'flexible (cancel anytime)', ha: 'pay per lead', angi: 'pay per lead', thumbtack: 'pay per quote' },
  { feature: 'Geographic exclusivity', provenquote: 'yes — one biz per city', ha: 'no', angi: 'no', thumbtack: 'no' },
  { feature: 'Setup fees', provenquote: 'none', ha: 'none', angi: 'none', thumbtack: 'none' },
  { feature: 'Pay for unqualified leads', provenquote: 'no (lease model)', ha: 'yes', angi: 'yes', thumbtack: 'yes' },
  { feature: 'Lead quality control', provenquote: 'SEO + intent-based pages', ha: 'mixed', angi: 'mixed', thumbtack: 'varied' },
];

type Verdict = 'win' | 'neutral' | 'loss';
const getCellStyle = (platform: string, value: string): Verdict => {
  const v = value.toLowerCase();
  if (platform === 'provenquote') {
    if (v.includes('none') || v.includes('exclusive') || v.includes('no') || v.includes('yes') || v.includes('28') || v.includes('flexible')) return 'win';
    return 'neutral';
  }
  if (v.includes('extreme') || v.includes('yes') || v.includes('shared') || v.includes('10–') || v.includes('competitive')) return 'loss';
  return 'neutral';
};

const cellClass: Record<Verdict, string> = {
  win: 'text-[#10B981]',
  neutral: 'text-slate-400',
  loss: 'text-[#EF4444]',
};

export default function ComparePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">How ProvenQuote stacks up</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Shared lead platforms aren&apos;t bad — they&apos;re just built differently. Here&apos;s the honest comparison.
        </p>
      </div>

      {/* Comparison table */}
      <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl overflow-hidden mb-16">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide w-48">Feature</th>
                <th className="px-6 py-4 text-center">
                  <span className="text-sm font-bold text-white">ProvenQuote</span>
                  <span className="block text-xs text-[#2563EB] font-medium mt-0.5">exclusive</span>
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="text-sm font-semibold text-slate-400">HomeAdvisor</span>
                  <span className="block text-xs text-slate-600 mt-0.5">shared</span>
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="text-sm font-semibold text-slate-400">Angi</span>
                  <span className="block text-xs text-slate-600 mt-0.5">shared</span>
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="text-sm font-semibold text-slate-400">Thumbtack</span>
                  <span className="block text-xs text-slate-600 mt-0.5">competitive</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`${i < FEATURES.length - 1 ? 'border-b border-white/[0.04]' : ''} hover:bg-white/[0.02]`}
                >
                  <td className="px-6 py-4 text-sm text-slate-400">{row.feature}</td>
                  <td className={`px-6 py-4 text-center text-sm font-medium ${cellClass[getCellStyle('provenquote', row.provenquote)]}`}>
                    {row.provenquote}
                  </td>
                  <td className={`px-6 py-4 text-center text-sm ${cellClass[getCellStyle('ha', row.ha)]}`}>
                    {row.ha}
                  </td>
                  <td className={`px-6 py-4 text-center text-sm ${cellClass[getCellStyle('angi', row.angi)]}`}>
                    {row.angi}
                  </td>
                  <td className={`px-6 py-4 text-center text-sm ${cellClass[getCellStyle('thumbtack', row.thumbtack)]}`}>
                    {row.thumbtack}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Narrative sections */}
      <div className="space-y-8 mb-16">
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">When to choose ProvenQuote</h2>
          <ul className="space-y-3 text-sm text-slate-400">
            {[
              'You have consistent capacity to handle 15–40 leads/month',
              'You have a sales process (answer the phone, follow up, close)',
              'You\'re tired of racing 4 other contractors to call the same lead',
              'You want predictable monthly spend instead of variable lead costs',
              'You\'re building a real local brand, not just chasing volume',
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#10B981] shrink-0">&#10003;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">When shared platforms make sense</h2>
          <ul className="space-y-3 text-sm text-slate-400">
            {[
              'You\'re brand new and just need any leads to get started',
              'Your capacity is unpredictable and you need to pause spending easily',
              'You want to test a market before committing to a lease',
              'You need very high lead volume and exclusivity isn\'t critical to your model',
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-slate-600 shrink-0">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-center">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/markets"
            className="inline-flex items-center justify-center min-h-[52px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-8 rounded-lg transition-colors"
          >
            Check Market Availability
          </Link>
          <Link
            href="/tools/lead-cost-calculator"
            className="inline-flex items-center justify-center min-h-[52px] bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 rounded-lg transition-colors"
          >
            Compare Your Lead Costs
          </Link>
        </div>
      </div>
    </div>
  );
}
