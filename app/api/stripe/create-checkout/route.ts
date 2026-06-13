import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const stripe = getStripe();
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
    const { type, niche, city, state, leasePrice, leadId, leadPrice, useCredits } = body;

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

    if (type === 'pro_subscription') {
      // Pro plan subscription — $29/mo base plan
      const proPrice = await stripe.prices.create({
        unit_amount: 2900, // $29.00
        currency: 'usd',
        recurring: { interval: 'month' },
        product_data: {
          name: 'ProvenQuote Pro — Monthly',
          metadata: { type: 'pro_plan' },
        },
      });

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{ price: proPrice.id, quantity: 1 }],
        mode: 'subscription',
        success_url: `${siteUrl}/dashboard?upgraded=1`,
        cancel_url: `${siteUrl}/dashboard/upgrade?canceled=1`,
        metadata: {
          type: 'pro_subscription',
          business_id: business.id,
        },
      });

      return NextResponse.json({ url: session.url });
    }

    if (type === 'lease') {
      // Market lease — check credits for first month first
      const totalCredits = (business.credit_balance ?? 0) + (business.bonus_credit_balance ?? 0);
      if (totalCredits >= leasePrice) {
        // Deduct first month from credits, then set up recurring Stripe subscription
        let remaining = leasePrice;
        const newBonus = Math.max(0, (business.bonus_credit_balance ?? 0) - remaining);
        remaining = Math.max(0, remaining - (business.bonus_credit_balance ?? 0));
        const newBase = Math.max(0, (business.credit_balance ?? 0) - remaining);

        await supabase
          .from('pq_businesses')
          .update({
            credit_balance: newBase,
            bonus_credit_balance: newBonus,
          })
          .eq('id', business.id);

        // Create the lease record (no Stripe subscription for first month — recurring billing TBD)
        const nextBilling = new Date();
        nextBilling.setMonth(nextBilling.getMonth() + 1);

        await supabase.from('pq_market_leases').insert({
          business_id: business.id,
          niche,
          city,
          state,
          monthly_cost: leasePrice,
          status: 'active',
          stripe_subscription_id: null,
          next_billing_at: nextBilling.toISOString(),
        });

        // Assign existing leads in this market to the lessee
        await supabase
          .from('pq_leads')
          .update({
            tenant_id: business.id,
            is_exclusive: true,
            assigned_at: new Date().toISOString(),
          })
          .eq('niche', niche)
          .eq('city', city)
          .eq('state', state)
          .is('tenant_id', null)
          .not('status', 'in', '("contacted","won","lost","spam")');

        // Update business subscription status
        await supabase
          .from('pq_businesses')
          .update({ subscription_status: 'active' })
          .eq('id', business.id);

        return NextResponse.json({
          success: true,
          method: 'credits',
          creditsUsed: leasePrice,
          redirectUrl: `${siteUrl}/dashboard/leases?success=1&niche=${encodeURIComponent(niche)}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&price=${leasePrice}`,
        });
      }

      // Insufficient credits — fall through to Stripe checkout
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
      // Enforce exclusivity: block purchase if market is actively leased
      const { data: lead } = await supabase
        .from('pq_leads')
        .select('niche, city, state, tenant_id, is_exclusive')
        .eq('id', leadId)
        .single();

      if (lead?.tenant_id || lead?.is_exclusive) {
        return NextResponse.json(
          { error: 'This lead is exclusively assigned to a market leaseholder.' },
          { status: 403 }
        );
      }

      if (lead) {
        const { data: activeLease } = await supabase
          .from('pq_market_leases')
          .select('id, business_id')
          .eq('niche', lead.niche)
          .eq('city', lead.city)
          .eq('state', lead.state)
          .eq('status', 'active')
          .maybeSingle();

        if (activeLease) {
          return NextResponse.json(
            { error: 'This market is exclusively leased. Leads are not available for individual purchase.' },
            { status: 403 }
          );
        }
      }

      // Check credit balance — prefer credits if available
      const totalCredits = (business.credit_balance ?? 0) + (business.bonus_credit_balance ?? 0);
      if (totalCredits >= leadPrice) {
        // Deduct credits: burn bonus first, then base
        let remaining = leadPrice;
        const newBonus = Math.max(0, (business.bonus_credit_balance ?? 0) - remaining);
        remaining = Math.max(0, remaining - (business.bonus_credit_balance ?? 0));
        const newBase = Math.max(0, (business.credit_balance ?? 0) - remaining);

        await supabase
          .from('pq_businesses')
          .update({
            credit_balance: newBase,
            bonus_credit_balance: newBonus,
          })
          .eq('id', business.id);

        // Record the purchase
        await supabase.from('pq_lead_purchases').insert({
          lead_id: leadId,
          business_id: business.id,
          stripe_payment_intent_id: null,
          amount: leadPrice,
        });

        // Append business to purchased_by array on lead
        const { data: leadData } = await supabase
          .from('pq_leads')
          .select('purchased_by')
          .eq('id', leadId)
          .single();

        if (leadData) {
          const purchasedBy = leadData.purchased_by ?? [];
          if (!purchasedBy.includes(business.id)) {
            purchasedBy.push(business.id);
          }
          await supabase
            .from('pq_leads')
            .update({ purchased_by: purchasedBy })
            .eq('id', leadId);
        }

        return NextResponse.json({ success: true, method: 'credits', creditsUsed: leadPrice });
      }

      // Insufficient credits — return error so frontend can redirect to top up
      const balance = totalCredits;
      if (useCredits) {
        return NextResponse.json(
          { error: 'insufficient_credits', balance, required: leadPrice },
          { status: 402 }
        );
      }

      // Fall through to Stripe checkout for direct card payment
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
