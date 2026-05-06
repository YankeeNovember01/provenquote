'use client';

import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';

const LEASES = ['Roofing — Austin, TX', 'HVAC — Phoenix, AZ', 'Solar — Denver, CO'];

// Generate 30-day data per lease
const generateLeadData = (avg: number) =>
  Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      leads: Math.max(0, Math.round(avg + (Math.random() - 0.5) * avg * 0.6)),
    };
  });

const SERVICE_DATA_BY_LEASE: Record<string, { service: string; leads: number }[]> = {
  'Roofing — Austin, TX': [
    { service: 'Full Replacement', leads: 14 },
    { service: 'Hail Damage', leads: 10 },
    { service: 'Repair', leads: 7 },
    { service: 'Inspection', leads: 3 },
  ],
  'HVAC — Phoenix, AZ': [
    { service: 'AC Repair', leads: 12 },
    { service: 'New Installation', leads: 9 },
    { service: 'Tune-Up', leads: 6 },
    { service: 'Emergency', leads: 4 },
  ],
  'Solar — Denver, CO': [
    { service: 'New Install', leads: 11 },
    { service: 'Battery Add-on', leads: 5 },
    { service: 'Assessment', leads: 3 },
  ],
};

const STATS_BY_LEASE: Record<string, { total: number; avgPerDay: number; bestDay: number; conversion: number }> = {
  'Roofing — Austin, TX': { total: 34, avgPerDay: 1.1, bestDay: 5, conversion: 28 },
  'HVAC — Phoenix, AZ': { total: 31, avgPerDay: 1.0, bestDay: 4, conversion: 32 },
  'Solar — Denver, CO': { total: 19, avgPerDay: 0.6, bestDay: 3, conversion: 35 },
};

const LEAD_AVGS: Record<string, number> = {
  'Roofing — Austin, TX': 1.1,
  'HVAC — Phoenix, AZ': 1.0,
  'Solar — Denver, CO': 0.6,
};

export default function AnalyticsPage() {
  const [selectedLease, setSelectedLease] = useState(LEASES[0]);

  const chartData = generateLeadData(LEAD_AVGS[selectedLease] ?? 1);
  const serviceData = SERVICE_DATA_BY_LEASE[selectedLease] ?? [];
  const stats = STATS_BY_LEASE[selectedLease];

  const tooltipStyle = {
    contentStyle: { background: '#1A2342', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#F8FAFC', fontSize: 12 },
    cursor: { stroke: 'rgba(255,255,255,0.1)' },
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <select
          value={selectedLease}
          onChange={e => setSelectedLease(e.target.value)}
          className="bg-[#1A2342] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm"
        >
          {LEASES.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Leads (30d)', value: stats.total.toString() },
          { label: 'Avg Leads / Day', value: stats.avgPerDay.toFixed(1) },
          { label: 'Best Single Day', value: stats.bestDay.toString() },
          { label: 'Conversion Rate', value: `${stats.conversion}%` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
            <p className="text-xs text-slate-500 mb-2">{label}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Line chart */}
        <div className="lg:col-span-2 bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-6">Leads Per Day — Last 30 Days</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="leads" stroke="#2563EB" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart by service type */}
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-6">Leads by Service Type</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={serviceData} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="service" tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} width={100} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="leads" fill="#2563EB" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Funnel */}
      <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8">
        <h2 className="text-sm font-semibold text-white mb-6">Lead Funnel (This Month)</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { stage: 'Leads Received', count: stats.total, color: '#2563EB' },
            { stage: 'Contacted', count: Math.round(stats.total * 0.82), color: '#8B5CF6' },
            { stage: 'Quoted', count: Math.round(stats.total * 0.55), color: '#F59E0B' },
            { stage: 'Closed', count: Math.round(stats.total * stats.conversion / 100), color: '#10B981' },
          ].map(({ stage, count, color }) => (
            <div key={stage} className="text-center">
              <div
                className="mx-auto rounded-xl mb-3 flex items-center justify-center"
                style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30`, height: 80 }}
              >
                <p className="text-3xl font-bold" style={{ color }}>{count}</p>
              </div>
              <p className="text-xs text-slate-500">{stage}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600 mt-4 text-center">
          Funnel data is based on your lead status updates in the Leads tab.
        </p>
      </div>
    </div>
  );
}
