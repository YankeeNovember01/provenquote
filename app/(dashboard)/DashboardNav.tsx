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

export default function DashboardNav({ newLeadCount }: { newLeadCount: number }) {
  const pathname = usePathname();

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
        { href: '/dashboard/leads', label: 'Lead Inbox', icon: '⬇', badge: newLeadCount > 0 ? newLeadCount : undefined },
        { href: '/dashboard/messages', label: 'Messages', icon: '💬' },
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

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
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
              {badge && badge > 0 && (
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
  );
}
