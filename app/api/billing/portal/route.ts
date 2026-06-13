import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST() {
  const stripe = getStripe();
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: business } = await supabase
      .from('pq_businesses')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (!business?.stripe_customer_id) {
      return NextResponse.json({ error: 'No Stripe customer found' }, { status: 404 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://provenquote.ai';

    const session = await stripe.billingPortal.sessions.create({
      customer: business.stripe_customer_id,
      return_url: `${siteUrl}/dashboard/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Billing portal error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
