'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-bold text-2xl tracking-tight text-white">
            ProvenQuote<span className="text-[#2563EB]">.ai</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-8 mb-2">Welcome back</h1>
          <p className="text-slate-400 text-sm">Sign in to your account to manage your markets and leads.</p>
        </div>

        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@yourbusiness.com"
                required
                className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>
            <div className="flex items-center justify-end">
              <Link href="/forgot-password" className="text-xs text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors min-h-[44px]"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-[#2563EB] hover:text-white transition-colors font-medium">
            Get started
          </Link>
        </p>
      </div>
    </div>
  );
}
