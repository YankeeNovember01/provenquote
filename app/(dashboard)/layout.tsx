import Link from 'next/link';

const NAV = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/markets', label: 'Markets' },
  { href: '/dashboard/leads', label: 'Leads' },
  { href: '/dashboard/leases', label: 'My Leases' },
  { href: '/dashboard/analytics', label: 'Analytics' },
  { href: '/dashboard/billing', label: 'Billing' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#080C14]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-60 bg-[#0F1729] border-r border-white/[0.08] flex flex-col z-40">
        <div className="px-6 py-5 border-b border-white/[0.08]">
          <Link href="/" className="font-bold text-lg tracking-tight text-white">
            ProvenQuote<span className="text-[#2563EB]">.ai</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all mb-1"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2563EB]/20 flex items-center justify-center text-xs font-bold text-[#2563EB]">
              B
            </div>
            <div>
              <p className="text-sm font-medium text-white leading-none mb-0.5">Business Owner</p>
              <p className="text-xs text-slate-500">owner@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-60 flex-1 min-h-screen">
        {children}
      </div>
    </div>
  );
}
