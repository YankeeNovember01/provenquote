import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Win More Bids: A Guide for Home Service Businesses — ProvenQuote.ai Blog',
  description:
    'Speed-to-call, pricing psychology, follow-up sequences — the tactics top contractors use to close more jobs from the same number of leads.',
};

export default function BlogPost3() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-sm text-slate-500 hover:text-white transition-colors mb-8 inline-flex items-center gap-1">
        ← Back to Blog
      </Link>

      <div className="flex items-center gap-3 mb-6 mt-6">
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F59E0B]/20 text-[#F59E0B]">Strategy</span>
        <span className="text-xs text-slate-500">April 29, 2026</span>
        <span className="text-xs text-slate-600">·</span>
        <span className="text-xs text-slate-500">10 min read</span>
      </div>

      <h1 className="text-4xl font-bold text-white mb-8 leading-tight">
        How to Win More Bids: A Guide for Home Service Businesses
      </h1>

      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 leading-relaxed">

        <p>
          Most contractors focus on getting more leads. The faster win is closing more of the leads you already have. The average home service close rate is 18–22%. The top performers close 35–45% of the same leads. The difference isn't luck — it's process.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10">1. Speed-to-call is everything</h2>

        <p>
          The data is unambiguous: calling a lead within 5 minutes of submission makes you 21x more likely to qualify them than calling after 30 minutes. After an hour, you're just leaving a voicemail.
        </p>

        <p>
          Set up SMS alerts that fire the moment a lead comes in. Have a dedicated phone with a loud ringtone. If you're on a job, have someone else make the call. The first call is the most important one you'll ever make to that person.
        </p>

        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6 my-8">
          <p className="text-sm font-semibold text-white mb-4">Response time vs contact rate</p>
          <div className="space-y-3">
            {[
              { time: '< 5 minutes', rate: '78%', width: '78%', color: '#10B981' },
              { time: '5–30 minutes', rate: '52%', width: '52%', color: '#F59E0B' },
              { time: '30–60 minutes', rate: '31%', width: '31%', color: '#EF4444' },
              { time: '> 1 hour', rate: '14%', width: '14%', color: '#6B7280' },
            ].map(({ time, rate, width, color }) => (
              <div key={time}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{time}</span>
                  <span className="font-semibold" style={{ color }}>{rate}</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width, backgroundColor: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mt-10">2. The first 30 seconds matter most</h2>

        <p>
          When you call, don't launch into your sales pitch. Lead with a question that makes the homeowner feel heard:
        </p>

        <blockquote className="border-l-2 border-[#2563EB] pl-6 italic text-slate-400">
          "Hi, this is [Name] from [Company]. I just got your quote request — before I start throwing numbers at you, can you tell me a little about what's going on?"
        </blockquote>

        <p>
          That question does three things: it slows down the conversation, it makes the homeowner feel like a person (not a prospect), and it gives you information you can use to tailor your quote.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10">3. Don't quote over the phone without a visit</h2>

        <p>
          This is where many contractors lose jobs without knowing it. They give a range over the phone — "probably $800 to $1,200" — and then show up and quote $1,400. The homeowner feels misled.
        </p>

        <p>
          Instead: "I can give you a solid number, not an estimate, but I need to see the job. Can I come by Thursday morning or would afternoon work better?" Getting in the door is 80% of the sale.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10">4. Build a follow-up sequence</h2>

        <p>
          Most contractors call once, don't hear back, and move on. Top closers have a 5-touch follow-up sequence:
        </p>

        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6 my-8">
          <div className="space-y-4">
            {[
              { day: 'Day 0', action: 'Call within 5 minutes of lead submission' },
              { day: 'Day 0', action: 'Send follow-up text if no answer: "Hey [Name], this is [Company] — left you a voicemail. Happy to text if easier."' },
              { day: 'Day 1', action: 'Second call attempt, mid-morning' },
              { day: 'Day 3', action: 'Final call: "Just checking in one more time — still happy to help if the timing works."' },
              { day: 'Day 7', action: 'Check-in text: "Hey, not sure if you found someone yet, but our schedule opened up for next week if you\'re still looking."' },
            ].map(({ day, action }) => (
              <div key={action} className="flex gap-4">
                <span className="text-xs font-mono text-[#2563EB] shrink-0 mt-0.5 w-12">{day}</span>
                <span className="text-sm text-slate-400">{action}</span>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mt-10">5. Price anchoring on the quote</h2>

        <p>
          When you present your quote, anchor high first. Show the "full solution" price, then your actual quote. The psychological effect of seeing $3,200 crossed out before seeing $2,400 makes the second number feel like a deal — even if $2,400 was your original number.
        </p>

        <p>
          Also: always present options. A "good / better / best" structure closes more jobs than a single number and gives homeowners agency instead of a yes/no decision.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10">6. Ask for the job</h2>

        <p>
          This sounds obvious. Most contractors don't do it. After presenting your quote, ask directly: "Does this look good to you? Should we get this scheduled?" Silence is a sales technique. Let them answer.
        </p>

      </div>

      <div className="mt-16 bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-3">Calculate your potential ROI</h3>
        <p className="text-slate-400 text-sm mb-6">See how exclusive leads perform against your current close rate and job values.</p>
        <Link
          href="/tools/market-roi-estimator"
          className="inline-flex items-center justify-center min-h-[48px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-8 rounded-lg transition-colors"
        >
          Try the ROI Estimator
        </Link>
      </div>
    </div>
  );
}
