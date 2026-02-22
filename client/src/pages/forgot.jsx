import React, { useState } from "react";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Frontend-only placeholder; integrate with backend when available.
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="relative w-full max-w-md px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-xl border border-white/15 p-8 rounded-3xl shadow-2xl shadow-indigo-900/30"
        >
          <div className="mb-8 text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-indigo-200">Reset access</p>
            <h2 className="text-3xl font-bold text-white mt-2">Forgot password</h2>
            <p className="text-sm text-slate-300 mt-1">Enter your email and we’ll send reset instructions.</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-200 mb-2">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-700/70 bg-slate-900/70 text-white px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 text-white font-semibold px-4 py-3 shadow-lg shadow-indigo-900/40 transition hover:brightness-105"
          >
            Send reset link
          </button>

          {submitted && (
            <p className="mt-4 text-center text-emerald-300 text-sm">
              If this email exists, a reset link will be sent shortly.
            </p>
          )}

          <div className="mt-6 flex flex-col gap-2 text-center text-slate-300">
            <p>
              Remembered it?{" "}
              <a href="/login" className="text-indigo-300 hover:text-indigo-200 font-medium">
                Back to login
              </a>
            </p>
            <p className="text-slate-400">
              New here?{" "}
              <a href="/register" className="text-indigo-300 hover:text-indigo-200 font-medium">
                Create account
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Forgot;
