import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'ProvenQuote.ai — Exclusive Local Service Leads', template: '%s | ProvenQuote.ai' },
  description: 'Buy exclusive local service leads or lease an entire niche market in your city. No shared leads. No bidding wars. One business per market.',
  metadataBase: new URL('https://provenquote.ai'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
