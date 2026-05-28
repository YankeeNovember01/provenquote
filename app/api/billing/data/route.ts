import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' });

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: business } = await supabase
      .from('pq_businesses')
      .select('stripe_customer_id, subscription_status')
      .eq('user_id', user.id)
      .single();

    if (!business?.stripe_customer_id) {
      return NextResponse.json({
        invoices: [],
        paymentMethod: null,
        subscriptions: [],
        hasStripe: false,
      });
    }

    // Fetch last 10 invoices, payment methods, and active subscriptions in parallel
    const [invoices, paymentMethods, subscriptions] = await Promise.all([
      stripe.invoices.list({
        customer: business.stripe_customer_id,
        limit: 10,
      }),
      stripe.paymentMethods.list({
        customer: business.stripe_customer_id,
        type: 'card',
      }),
      stripe.subscriptions.list({
        customer: business.stripe_customer_id,
        status: 'active',
      }),
    ]);

    return NextResponse.json({
      hasStripe: true,
      invoices: invoices.data.map(inv => ({
        id: inv.id,
        number: inv.number,
        amount: inv.amount_paid / 100,
        status: inv.status,
        date: new Date(inv.created * 1000).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
        }),
        pdf: inv.invoice_pdf,
        description: inv.lines.data[0]?.description || 'ProvenQuote subscription',
      })),
      paymentMethod: paymentMethods.data[0]
        ? {
            brand: paymentMethods.data[0].card?.brand,
            last4: paymentMethods.data[0].card?.last4,
            expMonth: paymentMethods.data[0].card?.exp_month,
            expYear: paymentMethods.data[0].card?.exp_year,
          }
        : null,
      subscriptions: subscriptions.data.map(sub => ({
        id: sub.id,
        status: sub.status,
        amount: sub.items.data[0]?.price.unit_amount
          ? sub.items.data[0].price.unit_amount / 100
          : 0,
        interval: sub.items.data[0]?.price.recurring?.interval,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        currentPeriodEnd: sub.items.data[0]?.current_period_end
          ? new Date(sub.items.data[0].current_period_end * 1000).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            })
          : 'N/A',
        description: sub.items.data[0]?.price.nickname || sub.items.data[0]?.price.product as string || 'ProvenQuote plan',
      })),
    });
  } catch (err) {
    console.error('Billing data error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
