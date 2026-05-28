'use client';

import Link from 'next/link';
import AIAssistant from '@/components/AIAssistant';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const NAV = [
  { href: '/dashboard',              label: 'Home' },
  { href: '/dashboard/leads',        label: 'Leads' },
  { href: '/dashboard/proposals',    label: 'Proposals' },
  { href: '/dashboard/messages',     label: 'Messages' },
  { href: '/dashboard/markets',      label: 'Lease a Market' },
  { href: '/dashboard/profile',      label: 'Business Profile' },
  { href: '/dashboard/analytics',    label: 'Analytics' },
  { href: '/dashboard/clients',      label: 'My Clients' },
  { href: '/dashboard/projects',     label: 'My Projects' },
  { href: '/dashboard/documents',    label: 'Documents & Claims' },
  { href: '/dashboard/escrow',       label: 'Escrow', comingSoon: true },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');

  useEffect(() => {
    async function fetchBusiness() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: biz } = await supabase
          .from('pq_businesses')
          .select('subscription_status, stripe_subscription_id, business_name, email')
          .eq('user_id', user.id)
          .single();
        if (biz) {
          const isPro = biz.subscription_status === 'active' || biz.subscription_status === 'trialing';
          setSubscriptionStatus(isPro ? 'pro' : 'free');
          setBusinessName(biz.business_name || '');
          setBusinessEmail(biz.email || user.email || '');
        }
      }
    }
    fetchBusiness();
  }, []);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const initial = businessName ? businessName.charAt(0).toUpperCase() : 'A';

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

        {/* Upgrade prompt for Free users */}
        {subscriptionStatus === 'free' && (
          <div className="mx-3 mb-3 p-3 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl">
            <p className="text-xs font-semibold text-white mb-1">⚡ Upgrade to Pro</p>
            <p className="text-[10px] text-slate-400 mb-2">Lease exclusive markets. Own your city.</p>
            <Link
              href="/dashboard/upgrade"
              className="block text-center text-xs bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg transition font-medium"
            >
              See Plans →
            </Link>
          </div>
        )}

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
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white leading-none mb-0.5 truncate">
                {businessName || 'My Business'}
              </p>
              <p className="text-xs text-slate-500 truncate">{businessEmail}</p>
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
