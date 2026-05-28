import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' });

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { leaseId, subscriptionId } = await request.json();

    // Verify this lease belongs to the user
    const { data: lease } = await supabase
      .from('pq_market_leases')
      .select('*, pq_businesses!inner(user_id)')
      .eq('id', leaseId)
      .single();

    if (!lease || (lease.pq_businesses as { user_id: string }).user_id !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Cancel at period end (not immediately)
    if (subscriptionId) {
      await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
    }

    // Update local DB
    await supabase
      .from('pq_market_leases')
      .update({ status: 'cancelling', cancel_at_period_end: true })
      .eq('id', leaseId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Cancel lease error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
