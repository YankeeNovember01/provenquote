import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — ProvenQuote.ai',
  description: 'ProvenQuote.ai terms of service for contractors and market lessees.',
};

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
      <p className="text-sm text-slate-500 mb-12">Last updated: May 2026</p>

      <div className="space-y-10 text-slate-400 leading-relaxed text-sm">
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">1. Agreement</h2>
          <p>
            By accessing or using ProvenQuote.ai, you agree to these Terms of Service. If you&apos;re using ProvenQuote on behalf of a business, you represent that you have authority to bind that business to these terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">2. Market leases</h2>
          <p className="mb-3">
            A market lease grants you a non-exclusive license to receive leads generated from a specific ProvenQuote page during the active subscription period. Leases are:
          </p>
          <ul className="space-y-1 list-disc pl-5">
            <li>Month-to-month. No long-term commitment required.</li>
            <li>Exclusive per city per niche — one active lessee per page at any time</li>
            <li>Non-transferable. You may not resell or sublicense your market slot.</li>
            <li>Revocable if you violate these terms or misuse lead data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">3. Lead guarantees</h2>
          <p>
            We do not guarantee a specific number of leads per month. Lead volume depends on search traffic, seasonality, and market conditions. We provide estimated lead projections based on current data, but actual results may vary. We credit accounts for clearly invalid leads (spam, wrong numbers) when reported within 7 days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">4. Billing</h2>
          <p className="mb-3">
            Leases are billed monthly in advance. Your subscription auto-renews unless canceled before the renewal date. Refunds are not issued for partial months. If you cancel, your access continues through the end of the billing period.
          </p>
          <p>
            We reserve the right to adjust lease pricing with 30 days&apos; notice to active subscribers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">5. Acceptable use</h2>
          <p className="mb-3">You agree not to:</p>
          <ul className="space-y-1 list-disc pl-5">
            <li>Use lead data for purposes other than following up on the specific quote request</li>
            <li>Add homeowners to marketing lists without explicit consent</li>
            <li>Misrepresent yourself or your services on our platform</li>
            <li>Interfere with the platform&apos;s operation or security</li>
            <li>Use the platform for any unlawful purpose</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">6. Limitation of liability</h2>
          <p>
            ProvenQuote.ai is not liable for lost revenue, lost leads, or business outcomes resulting from use of our platform. Our total liability to you shall not exceed the amount you paid us in the 3 months prior to the claim. We provide the platform &quot;as is&quot; without warranties of any kind.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">7. Termination</h2>
          <p>
            Either party may terminate a lease subscription at any time. We may terminate your account immediately if you violate these terms, engage in fraud, or misuse lead data. You may cancel through your account dashboard or by contacting support.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">8. Changes to terms</h2>
          <p>
            We may update these terms. We&apos;ll provide 30 days&apos; notice of material changes via email to active subscribers. Continued use after the effective date constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">9. Contact</h2>
          <p>
            Questions? Email <a href="mailto:legal@provenquote.ai" className="text-[#2563EB] hover:underline">legal@provenquote.ai</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
