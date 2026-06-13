import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { getStripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const stripe = getStripe();
  // Use service role for webhook (no user session)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const data = event.data.object as Stripe.Checkout.Session;

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = data;
      const meta = session.metadata ?? {};

      if (meta.type === 'lease') {
        // Create market lease record
        const nextBilling = new Date();
        nextBilling.setMonth(nextBilling.getMonth() + 1);

        await supabase.from('pq_market_leases').insert({
          business_id: meta.business_id,
          niche: meta.niche,
          city: meta.city,
          state: meta.state,
          monthly_cost: parseInt(meta.monthly_cost || '0'),
          status: 'active',
          stripe_subscription_id: session.subscription as string,
          next_billing_at: nextBilling.toISOString(),
        });

        // Assign all existing uncontacted leads for this market to the leasing business
        await supabase
          .from('pq_leads')
          .update({
            tenant_id: meta.business_id,
            is_exclusive: true,
            assigned_at: new Date().toISOString(),
          })
          .eq('niche', meta.niche)
          .eq('city', meta.city)
          .eq('state', meta.state)
          .is('tenant_id', null)
          .not('status', 'in', '("contacted","won","lost","spam")');

        // Update business subscription status
        await supabase
          .from('pq_businesses')
          .update({
            stripe_subscription_id: session.subscription as string,
            subscription_status: 'active',
          })
          .eq('id', meta.business_id);
      }

      if (meta.type === 'credits') {
        const businessId = meta.business_id;
        const creditAmount = parseInt(meta.amount || '0');
        const bonusAmount = parseInt(meta.bonus_amount || '0');

        // Add credits to the business balance
        // Use a raw increment to avoid race conditions
        const { data: bizData } = await supabase
          .from('pq_businesses')
          .select('credit_balance, bonus_credit_balance')
          .eq('id', businessId)
          .single();

        if (bizData) {
          await supabase
            .from('pq_businesses')
            .update({
              credit_balance: (bizData.credit_balance ?? 0) + creditAmount,
              bonus_credit_balance: (bizData.bonus_credit_balance ?? 0) + bonusAmount,
            })
            .eq('id', businessId);
        }
      }

      if (meta.type === 'lead') {
        const businessId = meta.business_id;
        const leadId = meta.lead_id;
        const amount = parseInt(meta.amount || '0');

        // Create purchase record
        await supabase.from('pq_lead_purchases').insert({
          lead_id: leadId,
          business_id: businessId,
          stripe_payment_intent_id: session.payment_intent as string,
          amount,
        });

        // Append business to purchased_by array on lead
        const { data: lead } = await supabase
          .from('pq_leads')
          .select('purchased_by')
          .eq('id', leadId)
          .single();

        if (lead) {
          const purchasedBy = lead.purchased_by ?? [];
          if (!purchasedBy.includes(businessId)) {
            purchasedBy.push(businessId);
          }
          await supabase
            .from('pq_leads')
            .update({ purchased_by: purchasedBy })
            .eq('id', leadId);
        }
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const status = subscription.status === 'active' ? 'active' : 'inactive';

      await supabase
        .from('pq_market_leases')
        .update({ status })
        .eq('stripe_subscription_id', subscription.id);

      await supabase
        .from('pq_businesses')
        .update({ subscription_status: status })
        .eq('stripe_subscription_id', subscription.id);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;

      // Fetch the lease so we can release associated leads
      const { data: expiredLease } = await supabase
        .from('pq_market_leases')
        .select('niche, city, state')
        .eq('stripe_subscription_id', subscription.id)
        .single();

      await supabase
        .from('pq_market_leases')
        .update({ status: 'expired' })
        .eq('stripe_subscription_id', subscription.id);

      await supabase
        .from('pq_businesses')
        .update({ subscription_status: 'cancelled' })
        .eq('stripe_subscription_id', subscription.id);

      // Release exclusivity on leads for this market
      if (expiredLease) {
        await supabase
          .from('pq_leads')
          .update({ is_exclusive: false, tenant_id: null })
          .eq('niche', expiredLease.niche)
          .eq('city', expiredLease.city)
          .eq('state', expiredLease.state)
          .is('tenant_id', null); // only remove exclusivity, not purchased leads

        // Also clear tenant_id on exclusively-assigned leads with no purchase record
        await supabase
          .from('pq_leads')
          .update({ is_exclusive: false, tenant_id: null })
          .eq('niche', expiredLease.niche)
          .eq('city', expiredLease.city)
          .eq('state', expiredLease.state)
          .not('tenant_id', 'is', null);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

