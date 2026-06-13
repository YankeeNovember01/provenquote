import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Mapping of partner IDs to access codes and names
const PARTNER_CODES: Record<string, { name: string; code: string; role: string }> = {
  alex: { name: 'Alex', code: 'ALEX-2026', role: 'Founder' },
  adam: { name: 'Adam', code: 'ADAM-2026', role: 'Co-Founder' },
  charlie: { name: 'Charlie', code: 'CHARLIE-2026', role: 'Partner' },
  ve: { name: 'Vinson & Elkins', code: 'VE-2026', role: 'Legal Counsel' },
  hl: { name: 'Houlihan Lokey', code: 'HL-2026', role: 'M&A Advisory' },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partnerName, accessCode } = body;

    if (!partnerName || !accessCode) {
      return NextResponse.json(
        { error: 'Partner name and access code are required' },
        { status: 400 }
      );
    }

    // Verify the access code matches the partner
    const partnerData = PARTNER_CODES[partnerName];

    if (!partnerData) {
      return NextResponse.json(
        { error: 'Invalid partner' },
        { status: 400 }
      );
    }

    if (accessCode !== partnerData.code) {
      return NextResponse.json(
        { error: 'Invalid access code' },
        { status: 401 }
      );
    }

    // Optional: Verify against database if table exists
    // For now, we'll just use the hardcoded codes above
    try {
      const cookieStore = await cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            },
          },
        }
      );

      // Try to verify against database (will fail gracefully if table doesn't exist)
      const { data, error } = await supabase
        .from('pq_partnership_access')
        .select('*')
        .eq('access_code', accessCode)
        .single();

      if (!error && data) {
        // Code verified in database
        return NextResponse.json(
          {
            success: true,
            partnerName: data.name,
            partnerRole: data.role,
            message: 'Access granted',
          },
          { status: 200 }
        );
      }
    } catch (dbError) {
      // Database table might not exist yet, fall back to hardcoded codes
      console.log('Database verification not available, using fallback codes');
    }

    // Return success with hardcoded codes
    return NextResponse.json(
      {
        success: true,
        partnerName: partnerData.name,
        partnerRole: partnerData.role,
        redirectUrl: '/partnership-briefing',
        message: 'Access granted',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Partnership verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
