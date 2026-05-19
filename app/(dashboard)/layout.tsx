'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: number;
  comingSoon?: boolean;
}

const NAV_GROUPS: { label: string | null; items: NavItem[] }[] = [
  {
    label: null,
    items: [
      { href: '/dashboard', label: 'Home', icon: '◈' },
    ],
  },
  {
    label: 'Leads & Sales',
    items: [
      { href: '/dashboard/leads', label: 'Lead Inbox', icon: '⬇', badge: 3 },
      { href: '/dashboard/bids', label: 'Bids & Proposals', icon: '📋' },
    ],
  },
  {
    label: 'Markets',
    items: [
      { href: '/dashboard/leases', label: 'My Leased Hubs', icon: '🏠' },
      { href: '/dashboard/markets', label: 'Browse Markets', icon: '🗺' },
      { href: '/dashboard/ads', label: 'Ads Manager', icon: '📣' },
    ],
  },
  {
    label: 'My Account',
    items: [
      { href: '/dashboard/profile', label: 'Business Profile', icon: '🏢' },
      { href: '/dashboard/billing', label: 'Billing', icon: '💳' },
      { href: '/dashboard/escrow', label: 'Escrow', icon: '🔒', comingSoon: true },
    ],
  },
  {
    label: 'Insights',
    items: [
      { href: '/dashboard/analytics', label: 'Analytics', icon: '📊' },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-[#080C14]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0F1729] border-r border-white/[0.08] flex flex-col z-40">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/[0.08]">
          <Link href="/" className="font-bold text-lg tracking-tight text-white">
            ProvenQuote<span className="text-[#2563EB]">.ai</span>
          </Link>
          <p className="text-xs text-slate-600 mt-0.5">Business Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi} className={gi > 0 ? 'mt-5' : ''}>
              {group.label && (
                <p className="px-3 mb-1.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
                  {group.label}
                </p>
              )}
              {group.items.map(({ href, label, icon, badge, comingSoon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-0.5 ${
                    isActive(href)
                      ? 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-base leading-none">{icon}</span>
                  {label}
                  {badge && (
                    <span className="ml-auto text-[10px] font-bold bg-[#2563EB] text-white rounded-full px-1.5 py-0.5">
                      {badge}
                    </span>
                  )}
                  {comingSoon && (
                    <span className="ml-auto text-[9px] font-bold bg-amber-500/20 text-amber-400 rounded-full px-1.5 py-0.5 uppercase tracking-wide">
                      Soon
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Switch to consumer portal */}
        <div className="px-4 pb-2">
          <a
            href="https://provenquote.com/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <span>↗</span>
            Switch to Consumer Portal
          </a>
        </div>

        {/* User */}
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

      {/* Main content */}
      <div className="ml-64 flex-1 min-h-screen">
        {children}
      </div>
    </div>
  );
}
