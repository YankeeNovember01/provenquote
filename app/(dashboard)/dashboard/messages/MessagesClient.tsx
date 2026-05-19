'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Message {
  id: string;
  content: string;
  sender_type: string;
  created_at: string;
  read: boolean;
}

interface Lead {
  id: string;
  homeowner_name: string;
  service_type: string;
  city: string;
  state: string;
}

interface Conversation {
  lead: Lead;
  messages: Message[];
  unread: number;
}

interface Props {
  conversations: Conversation[];
  businessId: string;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function MessagesClient({ conversations: initialConvos, businessId }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConvos);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(
    initialConvos[0]?.lead?.id ?? null
  );
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const selectedConvo = conversations.find(c => c.lead.id === selectedLeadId);

  // Realtime subscription for messages
  useEffect(() => {
    if (!selectedLeadId) return;

    const channel = supabase
      .channel(`messages-${selectedLeadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'pq_messages',
          filter: `lead_id=eq.${selectedLeadId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setConversations(prev =>
            prev.map(c =>
              c.lead.id === selectedLeadId
                ? { ...c, messages: [newMsg, ...c.messages] }
                : c
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedLeadId, supabase]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConvo?.messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedLeadId || sending) return;

    setSending(true);
    const { error } = await supabase.from('pq_messages').insert({
      lead_id: selectedLeadId,
      sender_type: 'business',
      sender_id: businessId,
      content: newMessage.trim(),
    });

    if (!error) {
      setNewMessage('');
    } else {
      alert('Failed to send message: ' + error.message);
    }
    setSending(false);
  };

  if (conversations.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-white mb-4">Messages</h1>
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-12 text-center">
          <p className="text-2xl mb-3">💬</p>
          <p className="text-slate-400 mb-2">No conversations yet.</p>
          <p className="text-slate-500 text-sm">Messages from homeowners will appear here once you lease a market or purchase leads.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Messages</h1>
      </div>

      <div className="flex gap-4 h-[calc(100vh-180px)]">
        {/* Conversation list */}
        <div className="w-72 shrink-0 bg-[#0F1729] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-white/[0.08]">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map(convo => {
              const latest = convo.messages[0];
              const isSelected = selectedLeadId === convo.lead.id;
              return (
                <button
                  key={convo.lead.id}
                  onClick={() => setSelectedLeadId(convo.lead.id)}
                  className={`w-full text-left px-4 py-3 border-b border-white/[0.04] transition-colors ${
                    isSelected ? 'bg-[#2563EB]/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white truncate">{convo.lead.homeowner_name}</p>
                      <p className="text-xs text-slate-500 truncate">{convo.lead.service_type}</p>
                      <p className="text-xs text-slate-600 truncate">{convo.lead.city}, {convo.lead.state}</p>
                      {latest && (
                        <p className="text-xs text-slate-500 truncate mt-1 italic">
                          {latest.sender_type === 'business' ? 'You: ' : ''}{latest.content}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      {latest && (
                        <span className="text-[10px] text-slate-600">{timeAgo(latest.created_at)}</span>
                      )}
                      {convo.unread > 0 && (
                        <span className="bg-[#2563EB] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                          {convo.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Message thread */}
        <div className="flex-1 bg-[#0F1729] border border-white/[0.08] rounded-2xl flex flex-col overflow-hidden">
          {selectedConvo ? (
            <>
              {/* Thread header */}
              <div className="px-6 py-4 border-b border-white/[0.08]">
                <p className="font-semibold text-white">{selectedConvo.lead.homeowner_name}</p>
                <p className="text-xs text-slate-500">{selectedConvo.lead.service_type} · {selectedConvo.lead.city}, {selectedConvo.lead.state}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col-reverse gap-3">
                <div ref={messagesEndRef} />
                {selectedConvo.messages.length === 0 ? (
                  <div className="text-center text-slate-500 text-sm py-8">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  [...selectedConvo.messages].reverse().map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_type === 'business' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                          msg.sender_type === 'business'
                            ? 'bg-[#2563EB] text-white rounded-br-sm'
                            : 'bg-[#1A2342] text-slate-200 rounded-bl-sm'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className={`text-[10px] mt-1 ${msg.sender_type === 'business' ? 'text-blue-200' : 'text-slate-500'}`}>
                          {timeAgo(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message input */}
              <form onSubmit={handleSend} className="px-4 py-4 border-t border-white/[0.08] flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2563EB]/50"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              Select a conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
