import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — ProvenQuote.ai',
  description: 'ProvenQuote.ai privacy policy. How we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mb-12">Last updated: May 2026</p>

      <div className="space-y-10 text-slate-400 leading-relaxed text-sm">
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">1. Information we collect</h2>
          <p className="mb-3">
            We collect information you provide directly, such as when you create an account, lease a market, or contact us:
          </p>
          <ul className="space-y-1 list-disc pl-5">
            <li>Name, email address, and phone number</li>
            <li>Business name, address, and niche</li>
            <li>Billing information (processed securely via Stripe — we don&apos;t store card data)</li>
            <li>Messages you send us</li>
          </ul>
          <p className="mt-3">
            We also collect usage data automatically: pages visited, time on site, referring URLs, browser type, and IP address. This is standard web analytics.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">2. How we use your information</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li>To process your lease and deliver leads to you</li>
            <li>To send you lead notifications via SMS and email</li>
            <li>To manage your account and billing</li>
            <li>To improve our platform and market coverage</li>
            <li>To communicate about your account, new features, or important changes</li>
          </ul>
          <p className="mt-3">We do not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">3. Lead data</h2>
          <p>
            When a homeowner submits a quote request on a page you lease, their information (name, phone, email, project details) is transmitted to you. You are responsible for handling that data in accordance with applicable law. We retain lead records for 90 days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">4. Cookies and tracking</h2>
          <p>
            We use cookies for authentication and analytics. We use privacy-friendly analytics tools that don&apos;t build advertising profiles. You can disable cookies in your browser settings; some features may not work correctly without them.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">5. Data security</h2>
          <p>
            We use industry-standard encryption and security practices to protect your data. Your payment information is processed by Stripe and never stored on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">6. Your rights</h2>
          <p>
            You may request access to, correction of, or deletion of your personal data by contacting us at privacy@provenquote.ai. We&apos;ll respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">7. Changes to this policy</h2>
          <p>
            We may update this policy from time to time. We&apos;ll notify active subscribers of material changes via email. Continued use of the platform after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">8. Contact</h2>
          <p>
            Questions about this policy? Email us at <a href="mailto:privacy@provenquote.ai" className="text-[#2563EB] hover:underline">privacy@provenquote.ai</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
