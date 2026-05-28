import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Affiliates | ProvenQuote.ai',
  description: 'Earn commissions by referring service businesses to ProvenQuote.',
};

export default function AffiliatesPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-white mb-4">Affiliate Program</h1>
      <p className="text-slate-400 text-lg mb-8">
        Earn 20% recurring commission for every business you refer to ProvenQuote.
        Our affiliate program is launching soon.
      </p>
      <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Get notified at launch</h2>
        <div className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition">
            Notify Me
          </button>
        </div>
      </div>
      <Link href="/" className="text-slate-500 hover:text-white text-sm transition">
        ← Back to home
      </Link>
    </main>
  );
}
