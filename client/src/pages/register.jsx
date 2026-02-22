import React, { useState } from "react";
import API from "../services/Api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration successful");
      window.location.href = "/login";
    } catch (error) {
      const message = error.response?.data?.message || "Error registering user";
      alert(message);
      console.error("Registration error:", error);
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
            <p className="text-xs tracking-[0.3em] uppercase text-indigo-200">Join us</p>
            <h2 className="text-3xl font-bold text-white mt-2">Create account</h2>
            <p className="text-sm text-slate-300 mt-1">Set up your workspace and start pinning ideas.</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-200 mb-2">Name</label>
            <input
              type="text"
              placeholder="Jane Doe"
              className="w-full rounded-xl border border-slate-700/70 bg-slate-900/70 text-white px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
              placeholder="Create a strong password"
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
            Create account
          </button>

          <p className="text-center text-slate-400 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-300 hover:text-indigo-200 font-medium">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;