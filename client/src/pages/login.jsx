import React, { useState } from "react";
import API from "../services/Api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-700/70 bg-slate-900/70 text-white px-4 py-3 pr-11 focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-indigo-200 focus:outline-none"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3l18 18M10.477 10.5a3 3 0 013.02 3.02M9.88 9.88a3 3 0 014.24 4.24m-.528 2.372A9.745 9.745 0 0112 17.25c-4.28 0-7.5-3.75-9-6 1.106-1.771 2.76-3.652 4.818-4.982m2.334-1.05A9.755 9.755 0 0112 6.75c4.28 0 7.5 3.75 9 6-.661 1.058-1.47 2.11-2.398 3"
                    />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 4.75 12 4.75c4.478 0 8.268 3.193 9.542 7.25-1.274 4.057-5.064 7.25-9.542 7.25-4.477 0-8.268-3.193-9.542-7.25z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
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
