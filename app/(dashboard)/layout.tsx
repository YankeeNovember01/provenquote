import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardNav from './DashboardNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Fetch business info
  const { data: business } = await supabase
    .from('pq_businesses')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Count new leads if business has leases
  let newLeadCount = 0;
  if (business) {
    const { data: leases } = await supabase
      .from('pq_market_leases')
      .select('niche, city, state')
      .eq('business_id', business.id)
      .eq('status', 'active');

    if (leases && leases.length > 0) {
      // Count new leads for any active lease market
      for (const lease of leases) {
        const { count } = await supabase
          .from('pq_leads')
          .select('*', { count: 'exact', head: true })
          .eq('niche', lease.niche)
          .eq('city', lease.city)
          .eq('state', lease.state)
          .eq('status', 'new');
        newLeadCount += count ?? 0;
      }
    }
  }

  const displayName = business?.business_name ?? user.email ?? 'Business';
  const displayEmail = business?.email ?? user.email ?? '';
  const initials = displayName.charAt(0).toUpperCase();

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

        {/* Navigation — client component for active state */}
        <DashboardNav newLeadCount={newLeadCount} />

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

        {/* User + Sign Out */}
        <div className="px-4 py-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#2563EB]/20 flex items-center justify-center text-xs font-bold text-[#2563EB]">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white leading-none mb-0.5 truncate">{displayName}</p>
              <p className="text-xs text-slate-500 truncate">{displayEmail}</p>
            </div>
          </div>
          <form action="/api/auth/sign-out" method="POST">
            <button
              type="submit"
              className="w-full text-xs text-slate-500 hover:text-red-400 transition-colors text-left px-2 py-1.5 rounded hover:bg-white/5"
            >
              Sign out →
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-64 flex-1 min-h-screen">
        {children}
      </div>
    </div>
  );
}
