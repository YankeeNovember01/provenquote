import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/notify/new-lead
// Receives { leadId: string } from provenquote.com
// Looks up the lead from pq_leads, resolves the active tenant for the hub market,
// updates the lead with tenant_id + status, then sends an email notification.
// Non-breaking: always returns 200 even if the lead isn't found.
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { leadId } = body as { leadId?: string };

    if (!leadId) {
      // Return 200 to avoid noisy errors on the caller side
      return NextResponse.json({ received: true, skipped: 'no leadId' });
    }

    // 1. Fetch lead details
    const { data: lead } = await supabase
      .from('pq_leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (!lead) {
      // Non-breaking — lead may not exist yet due to replication lag or test calls
      return NextResponse.json({ received: true, skipped: 'lead not found' });
    }

    // 2. Find active lease for this hub market (source_hub is the city-state slug)
    // pq_market_leases uses niche / city / state columns matching the lead's values
    const { data: leases } = await supabase
      .from('pq_market_leases')
      .select(`
        id,
        business_id,
        pq_businesses (
          id,
          business_name,
          email
        )
      `)
      .eq('niche', lead.niche ?? '')
      .eq('city', lead.city ?? '')
      .eq('state', lead.state ?? '')
      .eq('status', 'active');

    // 3. If there is an active lease, update the lead with tenant_id + notified status
    if (leases && leases.length > 0) {
      const lease = leases[0];
      const biz = (lease.pq_businesses as unknown) as {
        id: string;
        business_name: string;
        email: string;
      } | null;

      if (biz?.id) {
        // Upsert tenant_id onto the lead and mark as notified
        await supabase
          .from('pq_leads')
          .update({
            tenant_id: biz.id,
            status: 'notified',
          })
          .eq('id', leadId);
      }

      // 4. Send email notification if Resend key is available
      const RESEND_API_KEY = process.env.RESEND_API_KEY;

      if (RESEND_API_KEY) {
        let notified = 0;
        for (const l of leases) {
          const contractor = (l.pq_businesses as unknown) as {
            business_name: string;
            email: string;
          } | null;
          if (!contractor?.email) continue;

          try {
            const res = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: 'ProvenQuote.ai <noreply@provenquote.ai>',
                to: [contractor.email],
                subject: `New ${lead.urgency ?? ''} lead in ${lead.city}, ${lead.state} — ${lead.service_type}`,
                html: `
                  <h2>New Lead Alert 🔔</h2>
                  <p>Hi ${contractor.business_name},</p>
                  <p>A new <strong>${lead.urgency ?? 'lead'}</strong> just came in for your <strong>${lead.niche}</strong> market in <strong>${lead.city}, ${lead.state}</strong>.</p>
                  <ul>
                    <li><strong>Name:</strong> ${lead.homeowner_name ?? '—'}</li>
                    <li><strong>Phone:</strong> ${lead.phone ?? '—'}</li>
                    <li><strong>Service:</strong> ${lead.service_type ?? '—'}</li>
                    <li><strong>Urgency:</strong> ${lead.urgency ?? '—'}</li>
                  </ul>
                  <p><a href="https://provenquote.ai/dashboard/leads">View Lead →</a></p>
                `,
              }),
            });

            if (res.ok) notified++;
          } catch (e) {
            console.error('[notify/new-lead] Email send error:', e);
          }
        }

        return NextResponse.json({ received: true, notified });
      } else {
        // Log notification when no Resend key configured
        console.log(`[notify/new-lead] No RESEND_API_KEY — logging lead ${leadId} for ${lead.niche} in ${lead.city}, ${lead.state}`);
        console.log(`[notify/new-lead] Would notify ${leases.length} contractor(s)`);
        return NextResponse.json({ received: true, notified: 0, method: 'logged' });
      }
    }

    // No active lease for this market — lead received but no contractor to notify
    return NextResponse.json({ received: true, notified: 0 });
  } catch (err) {
    // Always return 200 — this is a fire-and-forget notification endpoint
    console.error('[notify/new-lead] Unexpected error:', err);
    return NextResponse.json({ received: true, error: 'internal' });
  }
}
