import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { leadId } = await request.json();

    if (!leadId) {
      return NextResponse.json({ error: 'leadId required' }, { status: 400 });
    }

    // Fetch lead details
    const { data: lead } = await supabase
      .from('pq_leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Find businesses with active leases for this market
    const { data: leases } = await supabase
      .from('pq_market_leases')
      .select('business_id, pq_businesses(email, business_name)')
      .eq('niche', lead.niche)
      .eq('city', lead.city)
      .eq('state', lead.state)
      .eq('status', 'active');

    if (!leases || leases.length === 0) {
      console.log(`No active leases for ${lead.niche} in ${lead.city}, ${lead.state}`);
      return NextResponse.json({ notified: 0 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      // Log notification instead of sending
      console.log(`[NOTIFY] New lead ${leadId} for ${lead.niche} in ${lead.city}, ${lead.state}`);
      console.log(`[NOTIFY] Would notify ${leases.length} businesses`);
      return NextResponse.json({ notified: leases.length, method: 'logged' });
    }

    // Send emails via Resend
    let notified = 0;
    for (const lease of leases) {
      const biz = (lease.pq_businesses as unknown) as { email: string; business_name: string } | null;
      if (!biz?.email) continue;

      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'ProvenQuote.ai <noreply@provenquote.ai>',
            to: [biz.email],
            subject: `New ${lead.urgency} lead in ${lead.city}, ${lead.state} — ${lead.service_type}`,
            html: `
              <h2>New Lead Alert 🔔</h2>
              <p>Hi ${biz.business_name},</p>
              <p>A new <strong>${lead.urgency}</strong> lead just came in for your <strong>${lead.niche}</strong> market in <strong>${lead.city}, ${lead.state}</strong>.</p>
              <ul>
                <li><strong>Service:</strong> ${lead.service_type}</li>
                <li><strong>Budget:</strong> ${lead.estimated_budget}</li>
                <li><strong>Score:</strong> ${lead.lead_score}/100</li>
              </ul>
              <p><a href="https://provenquote.ai/dashboard/leads">View Lead →</a></p>
            `,
          }),
        });

        if (res.ok) notified++;
      } catch (e) {
        console.error('Email send error:', e);
      }
    }

    return NextResponse.json({ notified });
  } catch (err) {
    console.error('Notify error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
