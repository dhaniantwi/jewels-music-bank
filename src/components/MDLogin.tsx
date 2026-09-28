import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import {
  LockKeyhole,
  Mail,
  ShieldCheck,
  Loader2,
  ArrowRight,
  Music2
} from 'lucide-react';

interface MDLoginProps {
  onLoginSuccess: () => void;
}

export function MDLogin({
  onLoginSuccess
}: MDLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password
        });

      if (error) {
        setError(error.message);
        return;
      }

      onLoginSuccess();
    } catch (err) {
      setError(
        'Unable to sign in. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[75vh] items-center justify-center overflow-hidden px-4 py-10 text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#007aff]/[0.055] blur-[100px]" />

      <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-[#007aff]/[0.045] blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-amber-500/[0.035] blur-3xl" />

      <div className="relative w-full max-w-[440px]">
        {/* Main glass panel */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#111113]/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8">
          {/* Top accent */}
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#007aff]/70 to-transparent" />

          {/* Subtle inner glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[#007aff]/[0.06] blur-3xl" />

          {/* Header */}
          <div className="relative mb-8 text-center">
            <div className="mx-auto mb-5 flex h-[70px] w-[70px] items-center justify-center rounded-[23px] border border-[#007aff]/20 bg-[#007aff]/10 shadow-xl shadow-blue-500/10">
              <LockKeyhole className="h-7 w-7 text-[#4da3ff]" />
            </div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#007aff]/20 bg-[#007aff]/10 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#4da3ff]">
              <ShieldCheck className="h-3 w-3" />
              Secure Access
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-[28px]">
              MD Admin Portal
            </h1>

            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-white/35">
              Authorized Music Director access only
            </p>
          </div>

          {/* Login form */}
          <form
            onSubmit={handleLogin}
            className="relative space-y-5"
          >
            {/* Email */}
            <div>
              <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.12em] text-white/55">
                MD Email
              </label>

              <div className="group relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25 transition-colors group-focus-within:text-[#4da3ff]" />

                <input
                  type="email"
                  value={email}
                  onChange={e =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter MD email"
                  required
                  autoComplete="email"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.035] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/20 hover:border-white/15 hover:bg-white/[0.045] focus:border-[#007aff]/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#007aff]/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.12em] text-white/55">
                Password
              </label>

              <div className="group relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25 transition-colors group-focus-within:text-[#4da3ff]" />

                <input
                  type="password"
                  value={password}
                  onChange={e =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.035] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/20 hover:border-white/15 hover:bg-white/[0.045] focus:border-[#007aff]/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#007aff]/10"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3">
                <p className="text-xs font-medium leading-5 text-red-300">
                  {error}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#007aff] py-3.5 text-sm font-extrabold text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-[#006fe6] hover:shadow-blue-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to MD Portal
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Security footer */}
          <div className="relative mt-7 border-t border-white/[0.07] pt-5">
            <div className="flex items-center justify-center gap-2 text-center text-[10px] font-medium text-white/25">
              <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0 text-emerald-400/60" />

              <span>
                Credentials securely handled by Supabase.
              </span>
            </div>
          </div>
        </div>

        {/* Portal identity */}
        <div className="mt-5 flex items-center justify-center gap-2 text-white/20">
          <Music2 className="h-3.5 w-3.5" />

          <span className="text-[9px] font-extrabold uppercase tracking-[0.18em]">
            Jewels Music Ministry
          </span>
        </div>
      </div>
    </div>
  );
}
