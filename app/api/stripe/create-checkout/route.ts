import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: business } = await supabase
      .from('pq_businesses')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const body = await request.json();
    const { type, niche, city, state, leasePrice, leadId, leadPrice } = body;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://provenquote.ai';

    // Ensure or create Stripe customer
    let customerId = business.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: business.email || user.email,
        name: business.business_name,
        metadata: { business_id: business.id, user_id: user.id },
      });
      customerId = customer.id;
      await supabase
        .from('pq_businesses')
        .update({ stripe_customer_id: customerId })
        .eq('id', business.id);
    }

    if (type === 'lease') {
      // Market lease — recurring subscription
      // Create a price on the fly or use the default price
      const price = await stripe.prices.create({
        unit_amount: leasePrice * 100, // convert to cents
        currency: 'usd',
        recurring: { interval: 'month' },
        product_data: {
          name: `${niche} Market Lease — ${city}, ${state}`,
          metadata: { niche, city, state },
        },
      });

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{ price: price.id, quantity: 1 }],
        mode: 'subscription',
        success_url: `${siteUrl}/dashboard/leases?success=1&niche=${encodeURIComponent(niche)}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&price=${leasePrice}`,
        cancel_url: `${siteUrl}/dashboard/markets?canceled=1`,
        metadata: {
          type: 'lease',
          business_id: business.id,
          niche,
          city,
          state,
          monthly_cost: String(leasePrice),
        },
      });

      return NextResponse.json({ url: session.url });
    }

    if (type === 'lead') {
      // Pay-per-lead — one-time payment
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: leadPrice * 100,
              product_data: {
                name: `Lead Unlock — ${niche} in ${city}, ${state}`,
              },
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${siteUrl}/dashboard/leads?success=1&leadId=${leadId}`,
        cancel_url: `${siteUrl}/dashboard/leads?canceled=1`,
        metadata: {
          type: 'lead',
          business_id: business.id,
          lead_id: leadId,
          amount: String(leadPrice),
        },
      });

      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
