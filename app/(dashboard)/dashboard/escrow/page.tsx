import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Escrow — Coming Soon' };

const FEATURES = [
  {
    title: 'Secure Job Deposits',
    desc: 'Homeowners deposit funds upfront into escrow. You get paid when the job is marked complete — no more chasing payments or bounced checks.',
  },
  {
    title: 'Milestone-Based Releases',
    desc: 'Break large jobs into milestones. Funds release automatically when each phase is confirmed complete by the homeowner.',
  },
  {
    title: 'Dispute Resolution',
    desc: 'If something goes wrong, ProvenQuote mediates. Both parties are protected with a clear paper trail from day one.',
  },
  {
    title: 'Instant Transfers',
    desc: 'Once a job is complete and confirmed, funds transfer to your bank within 1–2 business days. No delays, no holds.',
  },
  {
    title: 'Built-in Contracts',
    desc: 'Generate a simple digital contract for each job right in the platform. No lawyers, no paperwork, just click and sign.',
  },
  {
    title: 'No Surprise Fees',
    desc: 'Flat 1.5% escrow fee, deducted only on successful job completion. No monthly fees, no setup fees.',
  },
];

export default function EscrowPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">Escrow</h1>
            <span className="text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full px-3 py-1 uppercase tracking-wide">
              Coming Soon
            </span>
          </div>
          <p className="text-sm text-slate-500 max-w-lg">
            Get paid faster and protect every job with built-in escrow. We&apos;re building the safest way to handle payments between homeowners and service businesses.
          </p>
        </div>
      </div>

      {/* Hero card */}
      <div className="bg-gradient-to-br from-[#1A2342] to-[#0F1729] border border-[#2563EB]/20 rounded-3xl p-10 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563EB]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="w-16 h-16 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-2xl flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#2563EB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-3">
            Jobs paid on completion. Both sides protected.
          </h2>
          <p className="text-sm text-slate-400 max-w-xl leading-relaxed mb-6">
            ProvenQuote Escrow holds payment from the homeowner the moment a job is booked. You do the work. The homeowner confirms. Funds release instantly. No disputes, no unpaid invoices.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-emerald-400">&#10003;</span>
              No more chasing payments
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-emerald-400">&#10003;</span>
              Dispute protection built in
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-emerald-400">&#10003;</span>
              Only 1.5% fee on completion
            </div>
          </div>
        </div>
      </div>

      {/* Feature grid */}
      <h2 className="text-base font-bold text-white mb-6">What&apos;s included</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {FEATURES.map(({ title, desc }) => (
          <div key={title} className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
            <div className="w-2 h-2 rounded-full bg-[#2563EB] mb-4" />
            <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8 mb-10">
        <h2 className="text-base font-bold text-white mb-6">How it works</h2>
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { step: '1', label: 'Job booked', desc: 'Homeowner accepts your bid and deposits funds into escrow.' },
            { step: '2', label: 'Work begins', desc: 'You start the job knowing payment is secured and waiting.' },
            { step: '3', label: 'Job complete', desc: 'You mark the job done. Homeowner confirms via the app.' },
            { step: '4', label: 'Get paid', desc: 'Funds transfer to your account within 1–2 business days.' },
          ].map(({ step, label, desc }) => (
            <div key={step} className="relative">
              <div className="w-8 h-8 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-xs font-bold text-[#2563EB] mb-3">
                {step}
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">{label}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notify CTA */}
      <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white mb-1">Be the first to know when Escrow launches</h3>
          <p className="text-xs text-slate-500">Early access businesses get 90 days free — no fees on your first 10 jobs.</p>
        </div>
        <button className="shrink-0 ml-6 text-sm font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-xl transition-colors">
          Notify Me
        </button>
      </div>
    </div>
  );
}
