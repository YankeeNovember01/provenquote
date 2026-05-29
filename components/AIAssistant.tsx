'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  context?: {
    business?: { business_name?: string; niche?: string };
    lead?: Record<string, unknown>;
  };
}

const QUICK_PROMPTS = [
  'How do I win more roofing jobs?',
  'Write a bid for my current lead',
  'What should I charge for a full replacement?',
  'How can I improve my close rate?',
];

export default function AIAssistant({ context }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || streaming) return;

    const userMessage: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setStreaming(true);

    // Add empty assistant message to stream into
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, context }),
      });

      if (!res.ok || !res.body) throw new Error('Request failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const finalText = accumulated;
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: finalText },
        ]);
      }
    } catch {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: 'Sorry, something went wrong. Try again.' },
      ]);
    } finally {
      setStreaming(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#2563EB] hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center text-white text-xl transition-all hover:scale-105"
          title="AI Business Advisor"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 8v4M12 16h.01"/></svg>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] bg-[#0F1729] border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-[#0F1729]">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              <div>
                <p className="text-sm font-semibold text-white">AI Business Advisor</p>
                <p className="text-[10px] text-slate-500">Powered by Claude · Haiku</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-500 hover:text-white transition text-lg leading-none"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-slate-400 text-center pt-4">
                  Ask me anything about growing your business, winning jobs, or managing leads.
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {QUICK_PROMPTS.map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="text-left text-xs px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/[0.06] rounded-lg text-slate-300 transition"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] text-sm px-3 py-2 rounded-xl whitespace-pre-wrap leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#2563EB] text-white rounded-br-sm'
                      : 'bg-white/[0.06] text-slate-200 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                  {streaming && i === messages.length - 1 && msg.role === 'assistant' && (
                    <span className="inline-block w-1 h-3 bg-blue-400 ml-0.5 animate-pulse" />
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 pb-3">
            <div className="flex gap-2 bg-white/5 border border-white/[0.08] rounded-xl px-3 py-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                placeholder="Ask anything..."
                disabled={streaming}
                className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || streaming}
                className="text-[#2563EB] hover:text-blue-400 disabled:opacity-30 transition text-lg"
              >
                ↑
              </button>
            </div>
            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="text-[10px] text-slate-600 hover:text-slate-400 mt-1 w-full text-center transition"
              >
                Clear conversation
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
