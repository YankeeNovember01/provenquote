import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CreditsClient from './CreditsClient';

export const metadata: Metadata = { title: 'Credits — ProvenQuote.ai' };
export const dynamic = 'force-dynamic';

export default async function CreditsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data: business } = await supabase
    .from('pq_businesses')
    .select('credit_balance, bonus_credit_balance')
    .eq('user_id', user.id)
    .single();

  const baseBalance  = business?.credit_balance        ?? 0;
  const bonusBalance = business?.bonus_credit_balance   ?? 0;

  return <CreditsClient baseBalance={baseBalance} bonusBalance={bonusBalance} />;
}
