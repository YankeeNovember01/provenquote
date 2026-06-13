import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ─── Email template builder ────────────────────────────────────────────────
function buildLeadNotificationEmail({
  businessName,
  lead,
  leadPrice,
  priceRange,
}: {
  businessName: string;
  lead: Record<string, unknown>;
  leadPrice?: number | null;
  priceRange?: string | null;
}): string {
  const urgency = String(lead.urgency ?? 'Medium');
  const urgencyColor = urgency.toLowerCase() === 'emergency' || urgency.toLowerCase() === 'critical'
    ? '#dc2626' : urgency.toLowerCase() === 'high' ? '#d97706' : '#2563eb';
  const scoreLabel = leadPrice ? `$${leadPrice.toFixed(2)} lead value` : (priceRange ? `Est. ${priceRange}` : null);

  return `
    <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0f172a; padding: 24px 32px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">ProvenQuote<span style="color: #38bdf8;">.ai</span></h1>
        <span style="background: ${urgencyColor}; color: white; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em;">${urgency}</span>
      </div>
      <div style="background: #f8fafc; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
        <h2 style="color: #1e293b; margin-top: 0;">New Lead in ${lead.city}, ${lead.state}</h2>
        <p style="color: #475569;">Hi <strong>${businessName}</strong>, a new <strong>${urgency}</strong> lead just came in for your <strong>${lead.niche}</strong> market.</p>

        ${scoreLabel ? `<div style="background: #dbeafe; border: 1px solid #93c5fd; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
          <p style="margin: 0; color: #1e40af; font-weight: 600; font-size: 15px;">${scoreLabel}</p>
        </div>` : ''}

        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #64748b; font-size: 13px; width: 120px;">Homeowner</td><td style="padding: 6px 0; color: #1e293b; font-weight: 600;">${lead.homeowner_name ?? '—'}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b; font-size: 13px;">Phone</td><td style="padding: 6px 0; color: #1e293b; font-weight: 600;">${lead.phone ?? '—'}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b; font-size: 13px;">Service</td><td style="padding: 6px 0; color: #1e293b;">${lead.service_type ?? '—'}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b; font-size: 13px;">Location</td><td style="padding: 6px 0; color: #1e293b;">${lead.city}, ${lead.state} ${lead.zip ?? ''}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b; font-size: 13px;">Urgency</td><td style="padding: 6px 0;"><span style="color: ${urgencyColor}; font-weight: 600;">${urgency}</span></td></tr>
            ${lead.description ? `<tr><td style="padding: 6px 0; color: #64748b; font-size: 13px; vertical-align: top;">Details</td><td style="padding: 6px 0; color: #475569; font-size: 13px;">${lead.description}</td></tr>` : ''}
          </table>
        </div>

        <div style="text-align: center; margin: 24px 0;">
          <a href="https://provenquote.ai/dashboard/leads" style="background: #0f172a; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">View Lead in Dashboard →</a>
        </div>

        <div style="background: #fef9c3; border: 1px solid #fde047; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
          <p style="margin: 0; color: #713f12; font-size: 13px;">Act fast — homeowners contact multiple contractors. First to respond wins the job.</p>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">You're receiving this because you have an active lease in this market on <a href="https://provenquote.ai" style="color: #94a3b8;">ProvenQuote.ai</a>. <a href="https://provenquote.ai/settings/notifications" style="color: #94a3b8;">Manage notifications</a></p>
      </div>
    </div>
  `;
}

export const dynamic = 'force-dynamic';

// POST /api/notify/new-lead
// Receives { leadId: string } from provenquote.com
// Looks up the lead from pq_leads, resolves the active tenant for the hub market,
// updates the lead with tenant_id + status, then sends an email notification.
// Non-breaking: always returns 200 even if the lead isn't found.
export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const body = await request.json().catch(() => ({}));
    const { leadId, leadPrice, priceRange } = body as {
      leadId?: string;
      leadPrice?: number | null;
      priceRange?: string | null;
    };

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
                subject: `New ${lead.urgency ?? ''} Lead — ${lead.niche} in ${lead.city}, ${lead.state}`,
                html: buildLeadNotificationEmail({
                  businessName: contractor.business_name,
                  lead,
                  leadPrice: body.leadPrice,
                  priceRange: body.priceRange,
                }),
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
