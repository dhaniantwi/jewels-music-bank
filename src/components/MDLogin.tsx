import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import {
  LockKeyhole,
  Mail,
  ShieldCheck,
  Loader2,
  ArrowRight,
  Music2,
  Sparkles,
  Eye,
  EyeOff,
  Fingerprint,
} from 'lucide-react';

interface MDLoginProps {
  onLoginSuccess: () => void;
}

export function MDLogin({
  onLoginSuccess,
}: MDLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
          password,
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
    <div className="relative min-h-screen overflow-hidden bg-[#030303] text-white">
      {/* =========================================================
          BACKGROUND ATMOSPHERE
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Main blue glow */}
        <div className="absolute left-1/2 top-[30%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#007aff]/[0.045] blur-[130px]" />

        {/* Top-left glow */}
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#007aff]/[0.035] blur-[110px]" />

        {/* Bottom-right warm glow */}
        <div className="absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-amber-500/[0.025] blur-[110px]" />

        {/* Small blue accent */}
        <div className="absolute right-[18%] top-[18%] h-32 w-32 rounded-full bg-[#007aff]/[0.025] blur-3xl" />

        {/* Very subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* =========================================================
          PAGE
      ========================================================= */}

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-[470px]">

          {/* =====================================================
              BRAND HEADER
          ===================================================== */}

          <div className="mb-7 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-2 backdrop-blur-xl">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#007aff]/15">
                <Music2 className="h-3 w-3 text-[#4da3ff]" />
              </div>

              <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-white/45">
                Jewels Music Hub
              </span>

              <span className="h-1 w-1 rounded-full bg-[#007aff]/60" />

              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#4da3ff]/70">
                Secure Portal
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-[34px]">
              Welcome back.
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/30">
              Sign in to manage the Jewels Music Ministry
              experience.
            </p>
          </div>

          {/* =====================================================
              LOGIN CARD
          ===================================================== */}

          <div className="relative overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#0d0d0f]/95 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl">

            {/* Top blue line */}
            <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#007aff]/80 to-transparent" />

            {/* Card glow */}
            <div className="pointer-events-none absolute -right-28 -top-28 h-64 w-64 rounded-full bg-[#007aff]/[0.045] blur-[70px]" />

            {/* Inner border */}
            <div className="pointer-events-none absolute inset-0 rounded-[30px] border border-white/[0.025]" />

            <div className="relative p-6 sm:p-8">

              {/* =================================================
                  ACCESS HEADER
              ================================================= */}

              <div className="mb-8 flex items-center gap-4">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-[19px] border border-[#007aff]/20 bg-[#007aff]/[0.09] shadow-[0_10px_35px_rgba(0,122,255,0.10)]">
                  <div className="absolute inset-0 rounded-[19px] bg-[#007aff]/[0.04] blur-xl" />

                  <LockKeyhole className="relative h-6 w-6 text-[#4da3ff]" />
                </div>

                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-2">
                    <h2 className="text-base font-extrabold tracking-tight text-white">
                      MD Admin Access
                    </h2>

                    <span className="inline-flex items-center rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-[0.12em] text-emerald-300/80">
                      Protected
                    </span>
                  </div>

                  <p className="text-xs leading-5 text-white/30">
                    Music Director control panel
                  </p>
                </div>
              </div>

              {/* =================================================
                  FORM
              ================================================= */}

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >

                {/* EMAIL */}
                <div>
                  <label className="mb-2.5 flex items-center justify-between">
                    <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/45">
                      Email address
                    </span>

                    <span className="text-[8px] font-medium text-white/20">
                      REQUIRED
                    </span>
                  </label>

                  <div className="group relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl bg-white/[0.025] transition-colors group-focus-within:bg-[#007aff]/[0.08]">
                      <Mail className="h-4 w-4 text-white/25 transition-colors group-focus-within:text-[#4da3ff]" />
                    </div>

                    <input
                      type="email"
                      value={email}
                      onChange={e =>
                        setEmail(e.target.value)
                      }
                      placeholder="your@email.com"
                      required
                      autoComplete="email"
                      className="w-full rounded-[18px] border border-white/[0.08] bg-white/[0.025] py-4 pl-14 pr-4 text-sm font-medium text-white outline-none transition-all placeholder:text-white/15 hover:border-white/[0.13] hover:bg-white/[0.035] focus:border-[#007aff]/40 focus:bg-white/[0.045] focus:ring-4 focus:ring-[#007aff]/[0.07]"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="mb-2.5 flex items-center justify-between">
                    <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/45">
                      Password
                    </span>

                    <span className="flex items-center gap-1 text-[8px] font-medium text-white/20">
                      <Fingerprint className="h-3 w-3" />
                      SECURE
                    </span>
                  </label>

                  <div className="group relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl bg-white/[0.025] transition-colors group-focus-within:bg-[#007aff]/[0.08]">
                      <LockKeyhole className="h-4 w-4 text-white/25 transition-colors group-focus-within:text-[#4da3ff]" />
                    </div>

                    <input
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      value={password}
                      onChange={e =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      className="w-full rounded-[18px] border border-white/[0.08] bg-white/[0.025] py-4 pl-14 pr-14 text-sm font-medium text-white outline-none transition-all placeholder:text-white/15 hover:border-white/[0.13] hover:bg-white/[0.035] focus:border-[#007aff]/40 focus:bg-white/[0.045] focus:ring-4 focus:ring-[#007aff]/[0.07]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-white/25 transition-all hover:bg-white/[0.05] hover:text-white/60"
                      aria-label={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* ERROR */}
                {error && (
                  <div className="relative overflow-hidden rounded-[18px] border border-red-500/15 bg-red-500/[0.06] px-4 py-3.5">
                    <div className="absolute left-0 top-0 h-full w-[2px] bg-red-400/60" />

                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-red-400/10">
                        <ShieldCheck className="h-3.5 w-3.5 text-red-300" />
                      </div>

                      <div>
                        <p className="mb-0.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-red-300/70">
                          Sign-in failed
                        </p>

                        <p className="text-xs font-medium leading-5 text-red-200/80">
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-[18px] bg-[#007aff] py-4 text-sm font-extrabold text-white shadow-[0_12px_35px_rgba(0,122,255,0.20)] transition-all duration-200 hover:bg-[#0a83ff] hover:shadow-[0_15px_45px_rgba(0,122,255,0.28)] active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {/* Button shine */}
                  <div className="pointer-events-none absolute inset-y-0 -left-20 w-20 skew-x-[-20deg] bg-white/[0.08] transition-transform duration-700 group-hover:translate-x-[520px]" />

                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Enter MD Portal</span>

                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10">
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </div>
                    </>
                  )}
                </button>
              </form>

              {/* =================================================
                  SECURITY INFORMATION
              ================================================= */}

              <div className="mt-7 border-t border-white/[0.06] pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.045]">
                    <ShieldCheck className="h-4 w-4 text-emerald-400/60" />
                  </div>

                  <div>
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-white/35">
                      Secure authentication
                    </p>

                    <p className="mt-0.5 text-[10px] leading-5 text-white/20">
                      Your credentials are securely handled
                      by Supabase.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              BOTTOM BRANDING
          ===================================================== */}

          <div className="mt-7 text-center">
            <div className="mb-2 flex items-center justify-center gap-2">
              <div className="h-px w-8 bg-white/[0.06]" />

              <Music2 className="h-3.5 w-3.5 text-[#4da3ff]/40" />

              <div className="h-px w-8 bg-white/[0.06]" />
            </div>

            <p className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-white/20">
              Jewels Music Ministry
            </p>

            <div className="mt-2 flex items-center justify-center gap-2 text-[8px] font-medium uppercase tracking-[0.16em] text-white/10">
              <Sparkles className="h-3 w-3" />
              <span>Music</span>
              <span>•</span>
              <span>Excellence</span>
              <span>•</span>
              <span>Service</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
