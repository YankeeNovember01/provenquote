'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Partner {
  id: string;
  name: string;
  role: string;
  accessCode: string;
  icon?: string;
}

const PARTNERS: Partner[] = [
  {
    id: 'alex',
    name: 'Alex',
    role: 'Founder',
    accessCode: 'ALEX-2026',
    icon: '👨‍💼',
  },
  {
    id: 'adam',
    name: 'Adam',
    role: 'Co-Founder',
    accessCode: 'ADAM-2026',
    icon: '👨‍💼',
  },
  {
    id: 'charlie',
    name: 'Charlie',
    role: 'Partner',
    accessCode: 'CHARLIE-2026',
    icon: '👨‍💼',
  },
  {
    id: 've',
    name: 'Vinson & Elkins',
    role: 'Legal Counsel',
    accessCode: 'VE-2026',
    icon: '⚖️',
  },
  {
    id: 'hl',
    name: 'Houlihan Lokey',
    role: 'M&A Advisory',
    accessCode: 'HL-2026',
    icon: '📊',
  },
  {
    id: 'future',
    name: 'Future Partner',
    role: 'Coming Soon',
    accessCode: '',
    icon: '✨',
  },
];

export default function PartnershipPage() {
  const router = useRouter();
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePartnerSelect = (partnerId: string) => {
    if (partnerId === 'future') return;
    setSelectedPartner(partnerId);
    setAccessCode('');
    setError('');
  };

  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/partnership/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerName: selectedPartner,
          accessCode: accessCode.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid access code');
        return;
      }

      // Store partner name in localStorage for persistence
      localStorage.setItem('partnerName', data.partnerName);
      localStorage.setItem('partnerRole', data.partnerRole);

      // Redirect to partnership briefing dashboard
      router.push('/partnership-briefing');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedPartnerData = PARTNERS.find((p) => p.id === selectedPartner);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1128] via-[#0F1729] to-[#0A1128] flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <div className="text-6xl font-bold bg-gradient-to-r from-[#00D4FF] via-[#C9A84C] to-[#00D4FF] bg-clip-text text-transparent">
                Partner Portal
              </div>
            </div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Exclusive briefing room for valued partners. Enter your access code to view strategic market insights and portfolio performance.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Partner Selection */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-6">Select Your Organization</h2>
              <div className="space-y-3">
                {PARTNERS.map((partner) => (
                  <button
                    key={partner.id}
                    onClick={() => handlePartnerSelect(partner.id)}
                    disabled={partner.id === 'future'}
                    className={`w-full px-6 py-4 rounded-xl border-2 transition-all text-left ${
                      partner.id === 'future'
                        ? 'border-white/10 bg-white/5 text-slate-500 cursor-not-allowed'
                        : selectedPartner === partner.id
                          ? 'border-[#00D4FF] bg-[#00D4FF]/10 shadow-lg shadow-[#00D4FF]/20'
                          : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05] text-white cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{partner.icon}</span>
                      <div>
                        <p className="font-semibold">{partner.name}</p>
                        <p className="text-sm text-slate-400">{partner.role}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Access Code Form */}
            <div>
              {selectedPartner ? (
                <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-[#00D4FF]/30 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
                  <h3 className="text-lg font-semibold text-white mb-2">Enter Access Code</h3>
                  <p className="text-sm text-slate-400 mb-6">
                    You selected <span className="font-semibold text-[#00D4FF]">{selectedPartnerData?.name}</span>
                  </p>

                  <form onSubmit={handleSubmitCode} className="space-y-4">
                    <div>
                      <label htmlFor="code" className="block text-sm font-medium text-slate-300 mb-2">
                        Access Code
                      </label>
                      <input
                        id="code"
                        type="password"
                        placeholder="Enter your code..."
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                        disabled={loading}
                        className="w-full px-4 py-3 bg-white/[0.08] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/20 transition-all disabled:opacity-50"
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!accessCode || loading}
                      className="w-full px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#C9A84C] hover:from-[#00B8D4] hover:to-[#B89050] disabled:from-slate-600 disabled:to-slate-600 text-[#0A1128] font-semibold rounded-lg transition-all disabled:cursor-not-allowed shadow-lg shadow-[#00D4FF]/20 hover:shadow-[#00D4FF]/40"
                    >
                      {loading ? 'Verifying...' : 'Access Briefing'}
                    </button>

                    <div className="pt-4 border-t border-white/10">
                      <p className="text-xs text-slate-500 text-center">
                        Don't have an access code? {' '}
                        <a href="mailto:contact@provenquote.ai" className="text-[#00D4FF] hover:text-[#00B8D4] transition-colors">
                          Contact us
                        </a>
                      </p>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                  <p className="text-slate-400 text-center">Select your organization to continue</p>
                </div>
              )}
            </div>
          </div>

          {/* Premium Design Elements */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#00D4FF]/10 to-transparent border border-[#00D4FF]/20 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-[#00D4FF] mb-2">Real-time</div>
              <p className="text-sm text-slate-400">Live market data and performance metrics</p>
            </div>
            <div className="bg-gradient-to-br from-[#C9A84C]/10 to-transparent border border-[#C9A84C]/20 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-[#C9A84C] mb-2">Exclusive</div>
              <p className="text-sm text-slate-400">Strategic insights for valued partners</p>
            </div>
            <div className="bg-gradient-to-br from-white/10 to-transparent border border-white/20 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-white mb-2">Secure</div>
              <p className="text-sm text-slate-400">Enterprise-grade protection and privacy</p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-16 text-center">
            <p className="text-slate-500 text-sm">
              <Link href="/" className="text-[#00D4FF] hover:text-[#00B8D4] transition-colors">
                ← Back to ProvenQuote.ai
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-40 w-96 h-96 bg-[#00D4FF]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-40 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
