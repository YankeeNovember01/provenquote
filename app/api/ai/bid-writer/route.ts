import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { leadId, businessContext } = await request.json();

    // Get the lead details
    const { data: lead } = await supabase
      .from('pq_leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    // Get business profile
    const { data: business } = await supabase
      .from('pq_businesses')
      .select('business_name, niche, years_in_business, description')
      .eq('user_id', user.id)
      .single();

    const prompt = `Write a professional, competitive bid proposal for this homeowner lead.

LEAD DETAILS:
- Service needed: ${lead.service_type || lead.niche}
- Location: ${lead.city}, ${lead.state}
- Description: ${lead.description || 'Not provided'}
- Urgency: ${lead.urgency || 'Standard'}
- Budget estimate: ${lead.estimated_budget || 'Not specified'}
- Has insurance: ${lead.has_insurance ? 'Yes' : 'No'}
${lead.damage_cause ? `- Cause of damage: ${lead.damage_cause}` : ''}

BUSINESS: ${business?.business_name || 'ProvenQuote Contractor'}
${business?.years_in_business ? `- ${business.years_in_business} years in business` : ''}
${businessContext || ''}

Write a winning proposal that:
1. Opens by acknowledging their specific situation (2-3 sentences)
2. Explains your approach/process briefly (2-3 bullet points)
3. States your commitment to quality and timeline
4. Includes a professional closing with a clear next step (scheduling a free estimate)
5. Keep total length to 150-200 words

Return ONLY the proposal text, ready to send.`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    const proposal = message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({ proposal });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
