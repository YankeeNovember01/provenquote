'use client';

import { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
type BidStatus = 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Rejected';

interface BidLineItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
}

interface Bid {
  id: string;
  leadName: string;
  serviceType: string;
  city: string;
  state: string;
  createdAt: string;
  sentAt: string | null;
  status: BidStatus;
  total: number;
  lineItems: BidLineItem[];
  scopeOfWork: string;
  notes: string;
  validDays: number;
}

interface BidTemplate {
  id: string;
  name: string;
  serviceType: string;
  lineItems: BidLineItem[];
  scopeOfWork: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────
const INITIAL_BIDS: Bid[] = [
  {
    id: 'BID-0041',
    leadName: 'James Carter',
    serviceType: 'Full Roof Replacement',
    city: 'Austin',
    state: 'TX',
    createdAt: 'May 12, 2026',
    sentAt: 'May 12, 2026',
    status: 'Viewed',
    total: 18400,
    lineItems: [
      { id: 'l1', description: 'Remove existing shingles (2,400 sqft)', qty: 1, unitPrice: 2400 },
      { id: 'l2', description: 'Install GAF Timberline HDZ shingles', qty: 24, unitPrice: 580 },
      { id: 'l3', description: 'Ice & water shield (2-course)', qty: 1, unitPrice: 800 },
      { id: 'l4', description: 'Ridge cap & ventilation', qty: 1, unitPrice: 480 },
      { id: 'l5', description: 'Disposal & cleanup', qty: 1, unitPrice: 240 },
    ],
    scopeOfWork: 'Complete tear-off and replacement of existing 3-tab shingles with GAF Timberline HDZ architectural shingles. Includes inspection of decking with replacement of any damaged boards (up to 4 sheets). New ice & water shield on first 2 courses and all valleys.',
    notes: 'Insurance claim #TX-2026-44892. Adjuster approved $17,200. We are covering the supplement. GAF Golden Pledge warranty included.',
    validDays: 30,
  },
  {
    id: 'BID-0040',
    leadName: 'Tom Bradley',
    serviceType: 'Full Roof Replacement',
    city: 'Austin',
    state: 'TX',
    createdAt: 'May 11, 2026',
    sentAt: 'May 11, 2026',
    status: 'Accepted',
    total: 19800,
    lineItems: [
      { id: 'l1', description: 'Tear-off & disposal (2,800 sqft)', qty: 1, unitPrice: 2800 },
      { id: 'l2', description: 'Owens Corning Duration shingles', qty: 28, unitPrice: 600 },
      { id: 'l3', description: 'Synthetic underlayment', qty: 1, unitPrice: 1200 },
      { id: 'l4', description: 'Ridge & ventilation', qty: 1, unitPrice: 600 },
    ],
    scopeOfWork: 'Full replacement on wind-damaged 2,800 sqft roof. Owens Corning Duration shingles with SureNail technology. Lifetime limited warranty.',
    notes: 'Customer approved. Schedule start for May 20.',
    validDays: 30,
  },
  {
    id: 'BID-0039',
    leadName: 'Sarah Kim',
    serviceType: 'Hail Damage Repair',
    city: 'Austin',
    state: 'TX',
    createdAt: 'May 9, 2026',
    sentAt: null,
    status: 'Draft',
    total: 5200,
    lineItems: [
      { id: 'l1', description: 'Hail damage repair — partial re-shingle', qty: 1, unitPrice: 3800 },
      { id: 'l2', description: 'Gutter repair (2 sections)', qty: 2, unitPrice: 350 },
      { id: 'l3', description: 'Skylight reseal', qty: 1, unitPrice: 700 },
    ],
    scopeOfWork: 'Repair hail-impacted sections on north and west slopes. Estimated 800 sqft of replacement shingles. Match to existing CertainTeed Landmark.',
    notes: 'Need to confirm adjuster visit first. Hold until insurance approved.',
    validDays: 14,
  },
  {
    id: 'BID-0038',
    leadName: 'Mike Johnson',
    serviceType: 'Roof Repair',
    city: 'Austin',
    state: 'TX',
    createdAt: 'May 7, 2026',
    sentAt: 'May 8, 2026',
    status: 'Rejected',
    total: 3400,
    lineItems: [
      { id: 'l1', description: 'Leak source investigation & repair', qty: 1, unitPrice: 1200 },
      { id: 'l2', description: 'Flashing replacement (chimney)', qty: 1, unitPrice: 1600 },
      { id: 'l3', description: 'Sealant & waterproofing', qty: 1, unitPrice: 600 },
    ],
    scopeOfWork: 'Diagnose and repair active leak. Replace chimney flashing and seal all penetrations.',
    notes: 'Customer went with lower bid. Price point was the issue.',
    validDays: 14,
  },
];

const TEMPLATES: BidTemplate[] = [
  {
    id: 'tpl-full-replace',
    name: 'Full Roof Replacement (Standard)',
    serviceType: 'Full Roof Replacement',
    lineItems: [
      { id: 'l1', description: 'Tear-off & disposal', qty: 1, unitPrice: 2400 },
      { id: 'l2', description: 'Architectural shingles (per square)', qty: 20, unitPrice: 580 },
      { id: 'l3', description: 'Ice & water shield', qty: 1, unitPrice: 800 },
      { id: 'l4', description: 'Ridge cap & ventilation', qty: 1, unitPrice: 480 },
    ],
    scopeOfWork: 'Complete tear-off and replacement of existing roof system. New architectural shingles with manufacturer warranty.',
  },
  {
    id: 'tpl-hail-repair',
    name: 'Hail Damage Repair',
    serviceType: 'Hail Damage Repair',
    lineItems: [
      { id: 'l1', description: 'Hail damage assessment', qty: 1, unitPrice: 0 },
      { id: 'l2', description: 'Partial re-shingle (impacted sections)', qty: 1, unitPrice: 3200 },
      { id: 'l3', description: 'Gutter repair', qty: 1, unitPrice: 400 },
    ],
    scopeOfWork: 'Repair hail-impacted shingle sections. Match to existing material where possible.',
  },
  {
    id: 'tpl-inspection',
    name: 'Inspection & Report',
    serviceType: 'Free Inspection',
    lineItems: [
      { id: 'l1', description: 'Full roof inspection & photo report', qty: 1, unitPrice: 0 },
    ],
    scopeOfWork: 'Complete inspection with drone photography, written report, and damage assessment.',
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<BidStatus, string> = {
  Draft: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
  Sent: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  Viewed: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  Accepted: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Rejected: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

function newLineItem(): BidLineItem {
  return { id: `li-${Date.now()}`, description: '', qty: 1, unitPrice: 0 };
}

// ─── Bid Builder Modal ────────────────────────────────────────────────────────
function BidBuilderModal({ onClose, onSave }: { onClose: () => void; onSave: (bid: Bid) => void }) {
  const [step, setStep] = useState<'info' | 'items' | 'review'>('info');
  const [leadName, setLeadName] = useState('');
  const [serviceType, setServiceType] = useState('Full Roof Replacement');
  const [city, setCity] = useState('');
  const [state, setState] = useState('TX');
  const [lineItems, setLineItems] = useState<BidLineItem[]>([newLineItem()]);
  const [scopeOfWork, setScopeOfWork] = useState('');
  const [notes, setNotes] = useState('');
  const [validDays, setValidDays] = useState(30);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const total = lineItems.reduce((sum, li) => sum + li.qty * li.unitPrice, 0);

  const applyTemplate = (tplId: string) => {
    const tpl = TEMPLATES.find(t => t.id === tplId);
    if (!tpl) return;
    setLineItems(tpl.lineItems.map(li => ({ ...li, id: `li-${Date.now()}-${Math.random()}` })));
    setScopeOfWork(tpl.scopeOfWork);
    setServiceType(tpl.serviceType);
    setSelectedTemplate(tplId);
  };

  const addLineItem = () => setLineItems(prev => [...prev, newLineItem()]);
  const removeLineItem = (id: string) => setLineItems(prev => prev.filter(li => li.id !== id));
  const updateLineItem = (id: string, field: keyof BidLineItem, value: string | number) => {
    setLineItems(prev => prev.map(li => (li.id === id ? { ...li, [field]: value } : li)));
  };

  const handleSave = (status: 'Draft' | 'Sent') => {
    const bid: Bid = {
      id: `BID-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      leadName,
      serviceType,
      city,
      state,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      sentAt: status === 'Sent' ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null,
      status,
      total,
      lineItems,
      scopeOfWork,
      notes,
      validDays,
    };
    onSave(bid);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0F1729] border border-white/[0.12] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Modal header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/[0.08]">
          <div>
            <h2 className="text-xl font-bold text-white">New Bid</h2>
            <div className="flex items-center gap-2 mt-2">
              {(['info', 'items', 'review'] as const).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <button
                    onClick={() => setStep(s)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                      step === s ? 'bg-[#2563EB] text-white' : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    {i + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                  {i < 2 && <span className="text-slate-700 text-xs">→</span>}
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl transition-colors">✕</button>
        </div>

        {/* Modal body */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {step === 'info' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Template</label>
                <select
                  value={selectedTemplate}
                  onChange={e => applyTemplate(e.target.value)}
                  className="w-full bg-[#1A2342] border border-white/10 text-white rounded-xl px-4 py-3 text-sm"
                >
                  <option value="">Start from scratch</option>
                  {TEMPLATES.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Client Name</label>
                  <input
                    type="text"
                    value={leadName}
                    onChange={e => setLeadName(e.target.value)}
                    placeholder="James Carter"
                    className="w-full bg-[#1A2342] border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-600 focus:outline-none focus:border-[#2563EB]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Service Type</label>
                  <input
                    type="text"
                    value={serviceType}
                    onChange={e => setServiceType(e.target.value)}
                    className="w-full bg-[#1A2342] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB]/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Austin"
                    className="w-full bg-[#1A2342] border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-600 focus:outline-none focus:border-[#2563EB]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    placeholder="TX"
                    className="w-full bg-[#1A2342] border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-600 focus:outline-none focus:border-[#2563EB]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Valid For (days)</label>
                <select
                  value={validDays}
                  onChange={e => setValidDays(Number(e.target.value))}
                  className="bg-[#1A2342] border border-white/10 text-white rounded-xl px-4 py-3 text-sm"
                >
                  {[7, 14, 30, 60].map(d => <option key={d} value={d}>{d} days</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 'items' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Line Items</label>
                  <button
                    onClick={addLineItem}
                    className="text-xs font-semibold text-[#2563EB] hover:text-white transition-colors"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-1">
                    <span className="col-span-6">Description</span>
                    <span className="col-span-2 text-center">Qty</span>
                    <span className="col-span-2 text-right">Unit Price</span>
                    <span className="col-span-1 text-right">Total</span>
                    <span className="col-span-1"></span>
                  </div>

                  {lineItems.map(li => (
                    <div key={li.id} className="grid grid-cols-12 gap-2 items-center">
                      <input
                        type="text"
                        value={li.description}
                        onChange={e => updateLineItem(li.id, 'description', e.target.value)}
                        placeholder="Service description"
                        className="col-span-6 bg-[#1A2342] border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm placeholder-slate-600 focus:outline-none focus:border-[#2563EB]/50"
                      />
                      <input
                        type="number"
                        value={li.qty}
                        onChange={e => updateLineItem(li.id, 'qty', Number(e.target.value))}
                        className="col-span-2 bg-[#1A2342] border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm text-center focus:outline-none focus:border-[#2563EB]/50"
                        min={1}
                      />
                      <input
                        type="number"
                        value={li.unitPrice}
                        onChange={e => updateLineItem(li.id, 'unitPrice', Number(e.target.value))}
                        className="col-span-2 bg-[#1A2342] border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm text-right focus:outline-none focus:border-[#2563EB]/50"
                      />
                      <span className="col-span-1 text-sm font-semibold text-slate-300 text-right">
                        ${(li.qty * li.unitPrice).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeLineItem(li.id)}
                        className="col-span-1 text-slate-600 hover:text-red-400 transition-colors text-center"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <div className="border-t border-white/[0.08] pt-3 flex justify-end">
                    <div className="text-right">
                      <p className="text-xs text-slate-500 mb-1">Total</p>
                      <p className="text-2xl font-bold text-white">${total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Scope of Work</label>
                <textarea
                  value={scopeOfWork}
                  onChange={e => setScopeOfWork(e.target.value)}
                  placeholder="Describe the full scope of work, materials, warranties included..."
                  className="w-full bg-[#1A2342] border border-white/10 text-white rounded-xl px-4 py-3 text-sm resize-none h-32 placeholder-slate-600 focus:outline-none focus:border-[#2563EB]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Internal Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Notes for your team (not shown to client)..."
                  className="w-full bg-[#1A2342] border border-white/10 text-white rounded-xl px-4 py-3 text-sm resize-none h-20 placeholder-slate-600 focus:outline-none focus:border-[#2563EB]/50"
                />
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-6">
              <div className="bg-[#1A2342] rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{serviceType}</h3>
                    <p className="text-sm text-slate-400 mt-0.5">For: {leadName} — {city}, {state}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">${total.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">Valid {validDays} days</p>
                  </div>
                </div>

                <div className="border-t border-white/[0.08] pt-4 space-y-2">
                  {lineItems.map(li => (
                    <div key={li.id} className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{li.description}</span>
                      <span className="text-white font-medium">${(li.qty * li.unitPrice).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {scopeOfWork && (
                  <div className="border-t border-white/[0.08] pt-4 mt-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Scope of Work</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{scopeOfWork}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-white/[0.08]">
          <div className="flex gap-2">
            {step !== 'info' && (
              <button
                onClick={() => setStep(step === 'review' ? 'items' : 'info')}
                className="text-sm font-medium text-slate-500 hover:text-white px-4 py-2.5 rounded-lg transition-colors"
              >
                ← Back
              </button>
            )}
          </div>
          <div className="flex gap-3">
            {step !== 'review' ? (
              <button
                onClick={() => setStep(step === 'info' ? 'items' : 'review')}
                className="text-sm font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded-lg transition-colors"
              >
                Next →
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleSave('Draft')}
                  className="text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-lg transition-colors"
                >
                  Save Draft
                </button>
                <button
                  onClick={() => handleSave('Sent')}
                  className="text-sm font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded-lg transition-colors"
                >
                  Send Bid →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BidsPage() {
  const [bids, setBids] = useState<Bid[]>(INITIAL_BIDS);
  const [showBuilder, setShowBuilder] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = bids.filter(b => filterStatus === 'All' || b.status === filterStatus);

  const statusCounts = (['Draft', 'Sent', 'Viewed', 'Accepted', 'Rejected'] as BidStatus[]).reduce<Record<string, number>>(
    (acc, s) => { acc[s] = bids.filter(b => b.status === s).length; return acc; }, {}
  );

  const totalPipeline = bids.filter(b => ['Sent', 'Viewed'].includes(b.status)).reduce((sum, b) => sum + b.total, 0);
  const totalWon = bids.filter(b => b.status === 'Accepted').reduce((sum, b) => sum + b.total, 0);

  const handleSave = (bid: Bid) => {
    setBids(prev => [bid, ...prev]);
  };

  return (
    <div className="p-8">
      {showBuilder && <BidBuilderModal onClose={() => setShowBuilder(false)} onSave={handleSave} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Bids & Proposals</h1>
          <p className="text-sm text-slate-500 mt-1">
            ${totalPipeline.toLocaleString()} in pipeline · ${totalWon.toLocaleString()} won
          </p>
        </div>
        <button
          onClick={() => setShowBuilder(true)}
          className="text-sm font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-lg transition-colors"
        >
          + New Bid
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Bids', value: bids.length.toString(), sub: 'all time' },
          { label: 'In Pipeline', value: `$${totalPipeline.toLocaleString()}`, sub: `${statusCounts.Sent + statusCounts.Viewed} active` },
          { label: 'Won Revenue', value: `$${totalWon.toLocaleString()}`, sub: `${statusCounts.Accepted} accepted` },
          { label: 'Win Rate', value: bids.length ? `${Math.round((statusCounts.Accepted / bids.filter(b => b.status !== 'Draft').length) * 100)}%` : '—', sub: 'sent bids only' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
            <p className="text-xs text-slate-500 mb-2">{label}</p>
            <p className="text-2xl font-bold text-white mb-1">{value}</p>
            <p className="text-xs text-slate-600">{sub}</p>
          </div>
        ))}
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {(['All', 'Draft', 'Sent', 'Viewed', 'Accepted', 'Rejected'] as const).map(s => {
          const count = s === 'All' ? bids.length : (statusCounts[s] ?? 0);
          const active = filterStatus === s;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border ${
                active ? 'bg-[#2563EB] border-[#2563EB] text-white' : 'bg-[#0F1729] border-white/[0.08] text-slate-400 hover:text-white'
              }`}
            >
              {s}
              <span className={`text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${active ? 'bg-white/20' : 'bg-white/5 text-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bids list */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-12 text-center">
            <p className="text-slate-500 mb-4">No bids in this status.</p>
            <button
              onClick={() => setShowBuilder(true)}
              className="text-sm font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-lg transition-colors"
            >
              Create Your First Bid
            </button>
          </div>
        )}

        {filtered.map(bid => {
          const expanded = expandedId === bid.id;
          return (
            <div
              key={bid.id}
              className={`bg-[#0F1729] border rounded-2xl transition-all ${expanded ? 'border-[#2563EB]/30' : 'border-white/[0.08] hover:border-white/[0.16]'}`}
            >
              <div
                className="p-6 cursor-pointer"
                onClick={() => setExpandedId(expanded ? null : bid.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <span className="text-xs font-mono font-bold text-slate-600">{bid.id}</span>
                      <h3 className="text-base font-semibold text-white">{bid.leadName}</h3>
                      <span className="text-slate-600">·</span>
                      <span className="text-sm text-slate-400">{bid.serviceType}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs text-slate-600">{bid.city}, {bid.state}</span>
                      <span className="text-slate-700">·</span>
                      <span className="text-xs text-slate-600">Created {bid.createdAt}</span>
                      {bid.sentAt && <><span className="text-slate-700">·</span><span className="text-xs text-slate-600">Sent {bid.sentAt}</span></>}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">${bid.total.toLocaleString()}</p>
                      <p className="text-xs text-slate-600">Valid {bid.validDays} days</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[bid.status]}`}>
                      {bid.status}
                    </span>
                    <span className="text-slate-600 text-sm">{expanded ? '▲' : '▼'}</span>
                  </div>
                </div>
              </div>

              {expanded && (
                <div className="border-t border-white/[0.08] p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Line items */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Line Items</h4>
                      <div className="space-y-2">
                        {bid.lineItems.map(li => (
                          <div key={li.id} className="flex items-center justify-between text-sm">
                            <span className="text-slate-300">{li.description}</span>
                            <span className="text-white font-medium">${(li.qty * li.unitPrice).toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="border-t border-white/[0.08] pt-2 flex items-center justify-between">
                          <span className="text-sm font-bold text-white">Total</span>
                          <span className="text-lg font-bold text-white">${bid.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Scope + notes + actions */}
                    <div className="space-y-4">
                      {bid.scopeOfWork && (
                        <div>
                          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Scope of Work</h4>
                          <p className="text-sm text-slate-300 leading-relaxed">{bid.scopeOfWork}</p>
                        </div>
                      )}
                      {bid.notes && (
                        <div>
                          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Notes</h4>
                          <p className="text-sm text-slate-400 leading-relaxed">{bid.notes}</p>
                        </div>
                      )}
                      <div className="flex gap-2 pt-2">
                        {bid.status === 'Draft' && (
                          <button
                            onClick={() => setBids(prev => prev.map(b => b.id === bid.id ? { ...b, status: 'Sent', sentAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } : b))}
                            className="text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            Send Bid →
                          </button>
                        )}
                        <button className="text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg transition-colors">
                          Download PDF
                        </button>
                        <button className="text-xs font-medium text-slate-600 hover:text-red-400 px-3 py-2 transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
