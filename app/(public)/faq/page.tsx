import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ — ProvenQuote.ai',
  description: 'Frequently asked questions about ProvenQuote exclusive lead generation, market leases, and how it works for home service businesses.',
};

const FAQS = [
  {
    q: 'What exactly is a market lease?',
    a: 'A market lease gives you exclusive rights to every lead generated from a specific ProvenQuote.ai page — for example, our "Roofing in Austin, TX" page. While your lease is active, every form submission and phone inquiry from that page goes to you and only you. No other roofer in Austin gets those leads through our platform.',
  },
  {
    q: 'How many leads will I get per month?',
    a: 'Lead volume varies by niche and city size. Smaller cities typically generate 8–15 leads/month per page; major metros can generate 40–80+. When you browse a specific market, we show you traffic estimates and lead projections based on current page rankings. We never guarantee a specific lead count, but we do show you real data upfront.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. There are no long-term contracts. You pay month-to-month and can cancel before your next billing date. When your subscription ends, the market slot reopens for other businesses to lease.',
  },
  {
    q: 'What happens if my city isn\'t listed?',
    a: 'We cover 2,400+ cities across all 50 states. If you don\'t see your specific city, contact us — we may have it in a different format, or we may be able to build the page. We\'re actively expanding our market coverage.',
  },
  {
    q: 'How is this different from HomeAdvisor or Angi?',
    a: 'On HomeAdvisor and Angi, each lead is sold to multiple contractors. You\'re in a race to call first, competing on price, and often paying for leads who went with someone else. With ProvenQuote, the lead lands on your page (with your business details), fills out your form, and hears from only you. No competition, no racing, no shared fees.',
  },
  {
    q: 'How do leads come through — phone or form?',
    a: 'Both. When you lease a market, the page displays your business name, your phone number, and a quote request form. Homeowners can call directly or submit a form. Form submissions are emailed and texted to you instantly.',
  },
  {
    q: 'What if I go on vacation or get too busy?',
    a: 'You can pause your lead flow through your dashboard (this keeps your market slot but stops form submissions from reaching you temporarily). If you need to fully cancel, the slot goes back on the market.',
  },
  {
    q: 'What information does the lead include?',
    a: 'Every lead includes the homeowner\'s name, phone number, email, service address, and a description of the job they need done. For some niches, the form also captures urgency, project size, and budget range.',
  },
  {
    q: 'Do I need to set up anything technical?',
    a: 'No. Once you lease a market, our team updates the page within 24 hours with your business information. You just need to make sure your phone number works and you\'re ready to receive calls and emails.',
  },
  {
    q: 'Can I lease multiple cities or niches?',
    a: 'Yes. Many contractors lease their home city first, confirm the model works, and then expand to neighboring cities or related niches. Each market is a separate monthly lease.',
  },
  {
    q: 'What if I\'m unhappy with the lead quality?',
    a: 'We track lead quality and can credit your account for clearly invalid submissions (spam, wrong number, etc.). If you find the market isn\'t meeting your expectations after 60 days, reach out and we\'ll review your specific page\'s performance.',
  },
  {
    q: 'Is there a setup fee?',
    a: 'No setup fees, no onboarding fees, no hidden charges. You pay the monthly lease rate and nothing else.',
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white mb-4">Frequently asked questions</h1>
        <p className="text-xl text-slate-400 max-w-xl mx-auto">
          Everything you need to know before leasing a market.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <details
            key={i}
            className="group bg-[#0F1729] border border-white/[0.08] rounded-2xl overflow-hidden"
          >
            <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none">
              <span className="text-sm font-semibold text-white pr-4">{faq.q}</span>
              <span className="text-slate-500 group-open:rotate-180 transition-transform shrink-0 text-lg">+</span>
            </summary>
            <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-white/[0.06] pt-4">
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-16 text-center bg-[#0F1729] border border-white/[0.08] rounded-2xl p-10">
        <h2 className="text-xl font-bold text-white mb-3">Still have questions?</h2>
        <p className="text-slate-400 text-sm mb-6">
          Browse available markets or try our free ROI estimator to see if the numbers make sense for your business.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/markets"
            className="inline-flex items-center justify-center min-h-[48px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-8 rounded-lg transition-colors"
          >
            Browse Markets
          </Link>
          <Link
            href="/tools/market-roi-estimator"
            className="inline-flex items-center justify-center min-h-[48px] bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 rounded-lg transition-colors"
          >
            Estimate My ROI
          </Link>
        </div>
      </div>
    </div>
  );
}
