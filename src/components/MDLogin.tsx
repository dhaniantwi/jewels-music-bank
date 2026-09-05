import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError('Invalid email or password. Please try again.');
      return;
    }

    onLoginSuccess();
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-black/10 p-8">

          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔐</div>

            <h1 className="text-2xl font-extrabold text-[#1d1d1f]">
              MD Admin Portal
            </h1>

            <p className="text-sm text-[#86868b] mt-2">
              Authorized Music Director access only
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="block text-xs font-bold text-[#1d1d1f] mb-2">
                MD Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter MD email"
                required
                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1d1d1f] mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#1d1d1f] text-white font-bold text-sm hover:bg-black transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in to MD Portal'}
            </button>

          </form>

          <div className="mt-6 text-center">
            <p className="text-[11px] text-[#86868b]">
              🔒 Your credentials are securely handled by Supabase.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
