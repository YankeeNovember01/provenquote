import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Tools for Home Service Businesses — ProvenQuote.ai',
  description:
    'Free calculators to estimate your lead costs, ROI, and market potential. Built for roofing, HVAC, plumbing, and all home service niches.',
};

const TOOLS = [
  {
    href: '/tools/lead-cost-calculator',
    title: 'Lead Cost Calculator',
    description:
      'Enter your monthly lead volume, average lead price, and close rate to see your real cost per acquired customer — and what switching to exclusive leads could save you.',
    icon: '🧮',
    badge: 'Popular',
    badgeColor: '#10B981',
  },
  {
    href: '/tools/market-roi-estimator',
    title: 'Market ROI Estimator',
    description:
      'Pick a niche and city, enter your average job value and close rate, and see how an exclusive market lease stacks up against your current lead spend.',
    icon: '📈',
    badge: null,
    badgeColor: null,
  },
];

export default function ToolsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white mb-4">Free Tools</h1>
        <p className="text-xl text-slate-400 max-w-xl mx-auto">
          Run the numbers before you commit. These calculators help you understand your lead economics and market opportunity.
        </p>
      </div>

      <div className="space-y-6">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="block bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8 hover:border-white/20 transition-all group"
          >
            <div className="flex items-start gap-6">
              <span className="text-4xl">{tool.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-white group-hover:text-[#2563EB] transition-colors">
                    {tool.title}
                  </h2>
                  {tool.badge && (
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${tool.badgeColor}22`, color: tool.badgeColor! }}
                    >
                      {tool.badge}
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{tool.description}</p>
                <p className="text-[#2563EB] text-sm font-medium mt-4">Open calculator →</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
