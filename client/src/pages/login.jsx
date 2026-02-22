import React, { useState } from "react";
import API from "../services/Api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      window.location.href = "/";
    } catch (error) {
      const message = error.response?.data?.message || "Invalid credentials";
      alert(message);
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="relative w-full max-w-md px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-xl border border-white/15 p-8 rounded-3xl shadow-2xl shadow-indigo-900/30"
        >
          <div className="mb-8 text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-indigo-200">Welcome back</p>
            <h2 className="text-3xl font-bold text-white mt-2">Sign in</h2>
            <p className="text-sm text-slate-300 mt-1">Access your sticky notes and stay organized.</p>
          </div>

          <div className="mb-4">
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

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-700/70 bg-slate-900/70 text-white px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 text-white font-semibold px-4 py-3 shadow-lg shadow-indigo-900/40 transition hover:brightness-105"
          >
            Login
          </button>

          <div className="mt-6 flex flex-col gap-3 text-center text-slate-300">
            <div>
              <a href="/forgot" className="text-indigo-300 hover:text-indigo-200 font-medium">
                Forgot password?
              </a>
              <span className="ml-1 text-sm text-slate-400">We’ll email you reset steps.</span>
            </div>
            <p className="text-slate-400">
              Don’t have an account?{" "}
              <a href="/register" className="text-indigo-300 hover:text-indigo-200 font-medium">
                Register
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
