'use client';

import { useState } from 'react';

// These are proposals submitted by homeowners on provenquote.com who want multiple quotes.
// The business can choose to respond or pass.
const PROPOSALS = [
  {
    id: 'P-1042',
    submittedAt: 'May 19, 2026 — 8:42 AM',
    name: 'Sarah Kim',
    city: 'Austin, TX',
    service: 'Full Roof Replacement',
    description: 'I have a 2,100 sq ft home and my roof is about 15 years old. Had some minor hail damage and my insurance company suggested getting 3 quotes before they process a claim. Looking for someone who can inspect and give me a written estimate this week.',
    budget: '$12,000 – $20,000',
    timeline: 'Within 2 weeks',
    responded: false,
  },
  {
    id: 'P-1039',
    submittedAt: 'May 18, 2026 — 3:15 PM',
    name: 'Paul Rivera',
    city: 'Austin, TX',
    service: 'Roof Inspection',
    description: 'Buying a home and the inspector flagged the roof. Seller agreed to a credit if we can get 2–3 contractor opinions. Just need a written inspection report.',
    budget: 'Inspection only',
    timeline: 'This week',
    responded: false,
  },
  {
    id: 'P-1031',
    submittedAt: 'May 17, 2026 — 11:02 AM',
    name: 'Ana Torres',
    city: 'Austin, TX',
    service: 'Hail Damage Repair',
    description: 'Storm last month caused visible damage to several shingles on the south side. Need someone to assess and provide a quote — insurance will cover approved repairs.',
    budget: '$3,000 – $8,000',
    timeline: 'No rush, within the month',
    responded: true,
    yourResponse: 'Hi Ana, I can come out Tuesday or Wednesday this week for a free inspection. We are GAF certified and work directly with insurance adjusters. I will call you this afternoon to confirm.',
    respondedAt: 'May 17, 2026 — 2:44 PM',
  },
];

export default function ProposalsPage() {
  const [proposals, setProposals] = useState(PROPOSALS);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'responded'>('all');

  const filtered = proposals.filter(p => {
    if (filter === 'new') return !p.responded;
    if (filter === 'responded') return p.responded;
    return true;
  });

  const sendResponse = (id: string) => {
    if (!responses[id]?.trim()) return;
    setSending(id);
    setTimeout(() => {
      setProposals(prev =>
        prev.map(p =>
          p.id === id
            ? { ...p, responded: true, yourResponse: responses[id], respondedAt: 'Just now' }
            : p
        )
      );
      setSending(null);
    }, 800);
  };

  const newCount = proposals.filter(p => !p.responded).length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Proposals</h1>
          <p className="text-sm text-slate-500 mt-1">
            Homeowners on ProvenQuote requesting quotes from local businesses
          </p>
        </div>
        {newCount > 0 && (
          <div className="text-xs font-semibold bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] rounded-full px-4 py-2">
            {newCount} awaiting your response
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(['all', 'new', 'responded'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border capitalize ${
              filter === f
                ? 'bg-[#2563EB] border-[#2563EB] text-white'
                : 'bg-[#0F1729] border-white/[0.08] text-slate-400 hover:text-white'
            }`}
          >
            {f === 'all' ? 'All' : f === 'new' ? 'Needs Response' : 'Responded'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(p => (
          <div key={p.id} className={`bg-[#0F1729] border rounded-2xl p-6 ${!p.responded ? 'border-[#2563EB]/20' : 'border-white/[0.08]'}`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-base font-semibold text-white">{p.name}</h3>
                  <span className="text-xs text-slate-500">{p.city}</span>
                  <span className="text-xs text-slate-600">{p.id}</span>
                  {!p.responded && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20">
                      New
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-slate-300">{p.service}</p>
                <p className="text-xs text-slate-600 mt-0.5">{p.submittedAt}</p>
              </div>
              <div className="text-right text-xs text-slate-500 space-y-1">
                <p>Budget: <span className="text-slate-300">{p.budget}</span></p>
                <p>Timeline: <span className="text-slate-300">{p.timeline}</span></p>
              </div>
            </div>

            {/* What they're asking */}
            <div className="bg-[#1A2342] rounded-xl p-4 mb-4">
              <p className="text-xs text-slate-500 mb-2">Their request</p>
              <p className="text-sm text-slate-300 leading-relaxed">{p.description}</p>
            </div>

            {/* Response area */}
            {p.responded ? (
              <div className="border-t border-white/[0.06] pt-4">
                <p className="text-xs text-slate-500 mb-2">Your response — {p.respondedAt}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{p.yourResponse}</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-500 mb-2">Write your response</p>
                <textarea
                  value={responses[p.id] ?? ''}
                  onChange={e => setResponses(prev => ({ ...prev, [p.id]: e.target.value }))}
                  placeholder={`Hi ${p.name.split(' ')[0]}, I'd love to help with your ${p.service.toLowerCase()}...`}
                  className="w-full bg-[#1A2342] border border-white/10 text-white rounded-xl px-4 py-3 text-sm resize-none h-24 placeholder-slate-600 focus:outline-none focus:border-[#2563EB]/40 mb-3"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => sendResponse(p.id)}
                    disabled={!responses[p.id]?.trim() || sending === p.id}
                    className="text-sm font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 text-white px-5 py-2.5 rounded-xl transition-colors"
                  >
                    {sending === p.id ? 'Sending...' : 'Send Response'}
                  </button>
                  <button className="text-sm font-medium text-slate-500 hover:text-white transition-colors px-4 py-2.5">
                    Pass
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-16 text-center">
            <p className="text-slate-500">No proposals here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
