import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SYSTEM_PROMPT = `You are a business advisor AI built into ProvenQuote, an exclusive lead marketplace for service businesses.

You help service business owners (roofers, HVAC companies, plumbers, electricians, etc.) with:
- Writing competitive bid proposals for homeowner leads
- Analyzing lead quality and what to charge
- Understanding their local market 
- Tips to win more jobs and retain clients

Keep responses concise and actionable. You are talking to the business owner directly.
Always be honest about pricing — if a job sounds expensive, say so.
Format responses with bullet points when listing multiple tips.
Do NOT make up specific numbers unless the user provided context.`;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { messages, context } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages array required' }, { status: 400 });
    }

    // Build context-aware system prompt
    let systemPrompt = SYSTEM_PROMPT;
    if (context?.business) {
      systemPrompt += `\n\nBusiness context: ${context.business.business_name || 'this business'} operates in ${context.business.niche || 'home services'}.`;
    }
    if (context?.lead) {
      systemPrompt += `\n\nCurrent lead context: ${JSON.stringify(context.lead)}`;
    }

    const stream = await anthropic.messages.stream({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    // Return as SSE stream
    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
