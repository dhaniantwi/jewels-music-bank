```tsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { LockKeyhole, Mail, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';

interface MDLoginProps {
  onLoginSuccess: () => void;
}

export function MDLogin({ onLoginSuccess }: MDLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      onLoginSuccess();
    } catch (err) {
      setError('Unable to sign in. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-md">
        {/* Ambient glow */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.055] p-8 shadow-[0_25px_70px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-10">
          {/* Top highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

          {/* Header */}
          <div className="mb-9 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 shadow-[0_12px_35px_rgba(0,122,255,0.16)]">
              <LockKeyhole className="h-7 w-7 text-blue-400" />
            </div>

            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure Access
            </div>

            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
              MD Admin Portal
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/45">
              Authorized Music Director access only
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold text-white/75">
                MD Email
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter MD email"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/20 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-blue-400/40 focus:bg-white/[0.07] focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-white/75">
                Password
              </label>

              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/20 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-blue-400/40 focus:bg-white/[0.07] focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-300">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#007aff] py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(0,122,255,0.25)] transition hover:bg-[#1685ff] hover:shadow-[0_15px_35px_rgba(0,122,255,0.32)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to MD Portal
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Security footer */}
          <div className="mt-7 border-t border-white/[0.07] pt-5 text-center">
            <div className="flex items-center justify-center gap-2 text-[11px] text-white/35">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400/70" />
              <span>Your credentials are securely handled by Supabase.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```
