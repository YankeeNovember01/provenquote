'use client';

import { createClient } from './client';
import { RealtimeChannel } from '@supabase/supabase-js';

let messageChannel: RealtimeChannel | null = null;

export function subscribeToMessages(
  leadId: string,
  onMessage: (payload: Record<string, unknown>) => void
): () => void {
  const supabase = createClient();

  messageChannel = supabase
    .channel(`messages:${leadId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'pq_messages',
        filter: `lead_id=eq.${leadId}`,
      },
      (payload) => onMessage(payload.new as Record<string, unknown>)
    )
    .subscribe();

  return () => {
    if (messageChannel) {
      supabase.removeChannel(messageChannel);
      messageChannel = null;
    }
  };
}

export function subscribeToNewLeads(
  businessId: string,
  onLead: (payload: Record<string, unknown>) => void
): () => void {
  const supabase = createClient();

  const channel = supabase
    .channel(`leads:${businessId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'pq_leads',
      },
      (payload) => onLead(payload.new as Record<string, unknown>)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
