'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();

    // 1. Create auth user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          first_name: firstName,
          last_name: lastName,
          business_name: businessName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // 2. Create pq_businesses row
      const slug = generateSlug(businessName) + '-' + Math.random().toString(36).substring(2, 6);
      const { error: bizError } = await supabase.from('pq_businesses').insert({
        user_id: authData.user.id,
        business_name: businessName,
        email: email,
        slug: slug,
        onboarding_completed: false,
      });

      if (bizError) {
        console.error('Failed to create business record:', bizError);
      }

      // 3. Redirect to onboarding
      router.push('/dashboard/onboarding');
      router.refresh();
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-bold text-2xl tracking-tight text-white">
            ProvenQuote<span className="text-[#2563EB]">.ai</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-8 mb-2">Create your account</h1>
          <p className="text-slate-400 text-sm">Start receiving exclusive local leads for your business.</p>
        </div>

        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">First name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                  className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Last name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Smith"
                  required
                  className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Business name</label>
              <input
                type="text"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="Smith Roofing LLC"
                required
                className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="john@smithroofing.com"
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
                placeholder="Create a strong password"
                minLength={6}
                required
                className="w-full bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors min-h-[44px]"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-xs text-slate-600 mt-4 text-center leading-relaxed">
            By creating an account you agree to our{' '}
            <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>.
          </p>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-[#2563EB] hover:text-white transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
