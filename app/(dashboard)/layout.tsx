'use client';

import Link from 'next/link';
import AIAssistant from '@/components/AIAssistant';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const NAV_SECTIONS = [
  {
    label: 'ACQUISITION',
    items: [
      { href: '/dashboard/leads',         label: 'Get Leads' },
      { href: '/dashboard/markets',       label: 'Markets' },
      { href: '/dashboard/consumer-intel', label: 'Consumer Intel' },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { href: '/dashboard',               label: 'Overview' },
      { href: '/dashboard/proposals',     label: 'My Bids' },
      { href: '/dashboard/messages',      label: 'Messages' },
      { href: '/dashboard/clients',       label: 'My Clients' },
      { href: '/dashboard/projects',      label: 'My Jobs' },
      { href: '/dashboard/documents',     label: 'Insurance Claims' },
      { href: '/dashboard/analytics',     label: 'Analytics' },
    ],
  },
  {
    label: 'ACCOUNT',
    items: [
      { href: '/dashboard/profile',       label: 'My Profile' },
      { href: '/dashboard/billing',       label: 'Billing' },
      { href: '/dashboard/credits',       label: 'Credits' },
      { href: '/dashboard/escrow',        label: 'Escrow', comingSoon: true },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [newLeadCount, setNewLeadCount] = useState(0);
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBusiness() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: biz } = await supabase
          .from('pq_businesses')
          .select('id, subscription_status, stripe_subscription_id, business_name, email')
          .eq('user_id', user.id)
          .single();
        if (biz) {
          const isPro = biz.subscription_status === 'active' || biz.subscription_status === 'trialing';
          setSubscriptionStatus(isPro ? 'pro' : 'free');
          setBusinessName(biz.business_name || '');
          setBusinessEmail(biz.email || user.email || '');
          // Fetch unread lead count
          const bizId = (biz as Record<string, unknown>).id as string | undefined;
          if (bizId) {
            setBusinessId(bizId);
            const supabase2 = createClient();
            const { count } = await supabase2
              .from('pq_leads')
              .select('id', { count: 'exact', head: true })
              .eq('tenant_id', bizId)
              .eq('status', 'new');
            setNewLeadCount(count ?? 0);
          }
        }
      }
    }
    fetchBusiness();
  }, []);

  // Supabase Realtime: badge counter for new leads
  useEffect(() => {
    if (!businessId) return;
    const supabase = createClient();
    const ch = supabase
      .channel('layout_new_leads')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'pq_leads' },
        (payload) => {
          const lead = payload.new as { tenant_id?: string; status?: string };
          // Count any new lead assigned to this business
          if (lead.tenant_id === businessId || !lead.tenant_id) {
            setNewLeadCount(c => c + 1);
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [businessId]);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  // Clear badge when user visits the leads page
  useEffect(() => {
    if (pathname.startsWith('/dashboard/leads')) {
      setNewLeadCount(0);
    }
  }, [pathname]);

  const initial = businessName ? businessName.charAt(0).toUpperCase() : 'A';

  return (
    <div className="flex min-h-screen bg-[#080C14]">
      <aside className="fixed left-0 top-0 h-screen w-56 bg-[#0F1729] border-r border-white/[0.08] flex flex-col z-40">
        <div className="px-5 py-5 border-b border-white/[0.08]">
          <Link href="/" className="font-bold text-lg tracking-tight text-white">
            ProvenQuote<span className="text-emerald-400">.ai</span>
          </Link>
          <p className="text-xs text-slate-600 mt-0.5">Business Portal</p>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-4">
              <p className="px-3 mb-1 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">{section.label}</p>
              {section.items.map(({ href, label, comingSoon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all mb-0.5 ${
                    isActive(href)
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{label}</span>
                  <span className="flex items-center gap-1">
                    {comingSoon && (
                      <span className="text-[9px] font-bold bg-amber-500/20 text-amber-400 rounded-full px-1.5 py-0.5 uppercase tracking-wide">
                        Soon
                      </span>
                    )}
                    {href === '/dashboard/leads' && newLeadCount > 0 && (
                      <span className="text-[9px] font-bold bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                        {newLeadCount > 9 ? '9+' : newLeadCount}
                      </span>
                    )}
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Upgrade prompt for Free users */}
        {subscriptionStatus === 'free' && (
          <div className="mx-3 mb-3 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <p className="text-xs font-semibold text-white mb-1">Upgrade to Pro</p>
            <p className="text-[10px] text-slate-400 mb-2">Lease exclusive markets. Own your city.</p>
            <Link
              href="/dashboard/upgrade"
              className="block text-center text-xs bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-lg transition font-medium"
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
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400">
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
