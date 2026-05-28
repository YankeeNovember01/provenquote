'use client';

import Link from 'next/link';
import AIAssistant from '@/components/AIAssistant';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/dashboard',              label: 'Home' },
  { href: '/dashboard/leads',        label: 'Leads' },
  { href: '/dashboard/proposals',    label: 'Proposals' },
  { href: '/dashboard/messages',     label: 'Messages' },
  { href: '/dashboard/markets',      label: 'Lease a Market' },
  { href: '/dashboard/profile',      label: 'Business Profile' },
  { href: '/dashboard/analytics',    label: 'Analytics' },
  { href: '/dashboard/escrow',       label: 'Escrow', comingSoon: true },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-[#080C14]">
      <aside className="fixed left-0 top-0 h-screen w-56 bg-[#0F1729] border-r border-white/[0.08] flex flex-col z-40">
        <div className="px-5 py-5 border-b border-white/[0.08]">
          <Link href="/" className="font-bold text-lg tracking-tight text-white">
            ProvenQuote<span className="text-[#2563EB]">.ai</span>
          </Link>
          <p className="text-xs text-slate-600 mt-0.5">Business Portal</p>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {NAV.map(({ href, label, comingSoon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-0.5 ${
                isActive(href)
                  ? 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
              {comingSoon && (
                <span className="text-[9px] font-bold bg-amber-500/20 text-amber-400 rounded-full px-1.5 py-0.5 uppercase tracking-wide">
                  Soon
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-2">
          <a
            href="https://provenquote.com/dashboard"
            className="block px-3 py-2 rounded-lg text-xs text-slate-600 hover:text-white hover:bg-white/5 transition-all"
          >
            Switch to Consumer Portal
          </a>
        </div>

        <div className="px-4 py-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2563EB]/20 flex items-center justify-center text-xs font-bold text-[#2563EB]">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white leading-none mb-0.5 truncate">Apex Roofing Co.</p>
              <p className="text-xs text-slate-500 truncate">owner@apexroofing.com</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="ml-56 flex-1 min-h-screen">
        {children}
      </div>
      <AIAssistant />
    </div>
  );
}
