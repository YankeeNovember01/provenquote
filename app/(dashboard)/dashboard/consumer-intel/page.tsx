import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Consumer Intel' };

export default async function ConsumerIntelPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data: business } = await supabase
    .from('pq_businesses')
    .select('subscription_status, onboarding_completed')
    .eq('user_id', user.id)
    .single();

  if (!business || !business.onboarding_completed) {
    redirect('/dashboard/onboarding');
  }

  const isPro = business.subscription_status === 'active' || business.subscription_status === 'trialing';

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-white">Consumer Intel</h1>
          {!isPro && (
            <span className="text-xs font-bold bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-full px-2.5 py-1 uppercase tracking-wide">
              PRO
            </span>
          )}
        </div>
        <p className="text-slate-500 text-sm">
          Private notes from verified businesses about homeowners in your service area — before you commit to a job.
        </p>
      </div>

      {!isPro ? (
        /* Pro gate */
        <div className="bg-[#0F1729] border border-blue-500/20 rounded-2xl p-10 text-center max-w-lg mx-auto mt-12">
          <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5">
            🔒
          </div>
          <h2 className="text-lg font-bold text-white mb-3">Consumer Intel is a Pro feature</h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Consumer Intel lets you see private notes from other verified businesses about homeowners in your service area —
            before you commit to a job. Know what you&apos;re walking into.
          </p>
          <div className="space-y-2 text-left bg-[#1A2342] rounded-xl p-4 mb-6">
            {[
              'Homeowner payment history (slow pay, disputes)',
              'Notes from contractors who worked the job',
              'Red flags shared by verified businesses',
              'Positive feedback on reliable homeowners',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <Link
            href="/dashboard/upgrade"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
          >
            Upgrade to Pro — $29/mo →
          </Link>
          <p className="text-xs text-slate-600 mt-3">Cancel anytime. Instant access on upgrade.</p>
        </div>
      ) : (
        /* Pro user view */
        <div>
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <h2 className="text-sm font-semibold text-white">Active — Pro Access</h2>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              No consumer intel notes in your service areas yet. Notes are shared anonymously by verified ProvenQuote businesses
              and will appear here as the network grows.
            </p>
            <div className="text-center py-8 text-slate-500 text-sm">
              <p className="text-2xl mb-2">📋</p>
              <p>No notes yet for your service areas.</p>
              <p className="text-xs mt-1 text-slate-600">Check back as more businesses contribute to the network.</p>
            </div>
          </div>

          <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">How Consumer Intel Works</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-400">
              <div>
                <p className="font-medium text-white mb-1">Anonymous & Verified</p>
                <p className="text-xs">Notes are anonymous but only submitted by verified ProvenQuote businesses. No fake reviews.</p>
              </div>
              <div>
                <p className="font-medium text-white mb-1">Service Area Matched</p>
                <p className="text-xs">You only see notes for homeowners in your active service areas and niches.</p>
              </div>
              <div>
                <p className="font-medium text-white mb-1">Contribute Back</p>
                <p className="text-xs">Add your own notes after completing jobs to help other verified businesses in the network.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
