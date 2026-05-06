import Link from 'next/link';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#080C14]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-tight text-white">
            ProvenQuote<span className="text-[#2563EB]">.ai</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <Link href="/markets" className="hover:text-white transition-colors">Markets</Link>
            <Link href="/leads" className="hover:text-white transition-colors">Buy Leads</Link>
            <Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-white/[0.08] bg-[#080C14] py-16 px-6 mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div>
              <p className="font-bold text-white mb-4">ProvenQuote<span className="text-[#2563EB]">.ai</span></p>
              <p className="text-sm text-slate-500 leading-relaxed">
                Exclusive local lead generation for home service professionals. One business per market.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Product</p>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/markets" className="hover:text-white transition-colors">Browse Markets</Link></li>
                <li><Link href="/leads" className="hover:text-white transition-colors">Buy Leads</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">For Businesses</p>
              <ul className="space-y-3 text-sm text-slate-400">
                {['Roofing', 'Landscaping', 'HVAC', 'Plumbing', 'Electrical', 'Solar'].map(n => (
                  <li key={n}><Link href={`/for/${n.toLowerCase()}`} className="hover:text-white transition-colors">For {n} Businesses</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Company</p>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/affiliates" className="hover:text-white transition-colors">Affiliates</Link></li>
                <li><a href="https://provenquote.com" className="hover:text-white transition-colors">For Homeowners</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/[0.08] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>© 2026 ProvenQuote. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
