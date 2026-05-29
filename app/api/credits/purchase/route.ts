import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
});

const BONUS_TIERS = [
  { min: 5000, bonus: 0.20 },
  { min: 3000, bonus: 0.16 },
  { min: 2000, bonus: 0.12 },
  { min: 1000, bonus: 0.08 },
  { min: 500,  bonus: 0.05 },
  { min: 50,   bonus: 0    },
];

function getBonusPct(amount: number): number {
  for (const tier of BONUS_TIERS) {
    if (amount >= tier.min) return tier.bonus;
  }
  return 0;
}

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
    const amount = parseInt(body.amount, 10); // dollar amount

    if (!amount || amount < 50) {
      return NextResponse.json({ error: 'Minimum purchase is $50' }, { status: 400 });
    }

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

    const bonusPct = getBonusPct(amount);
    const bonusAmount = Math.floor(amount * bonusPct);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: amount * 100, // cents
            product_data: {
              name: bonusAmount > 0
                ? `ProvenQuote Credits — ${amount.toLocaleString()} + ${bonusAmount.toLocaleString()} bonus (${Math.round(bonusPct * 100)}%)`
                : `ProvenQuote Credits — ${amount.toLocaleString()} credits`,
              description: `1 credit = $1. ${bonusAmount > 0 ? `Includes ${bonusAmount} bonus credits!` : ''}`,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${siteUrl}/dashboard/credits?success=1`,
      cancel_url: `${siteUrl}/dashboard/credits?canceled=1`,
      metadata: {
        type: 'credits',
        business_id: business.id,
        amount: String(amount),
        bonus_amount: String(bonusAmount),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Credits purchase error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
