import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, NavLink } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setForm] = useState({
    email: '',
    password: ''
  });

  function handleChange(e) {
    setForm({ ...formData, [e.target.name]: e.target.value });
  }

  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await axios.post("http://localhost:3001/api/v1/auth/login", formData);
      localStorage.setItem("accessToken", result.data.accessToken);
      toast.success("Login Successfully!");
      navigate("/home");
    } catch (error) {
      console.log("error logging in...");
      toast.error(error.response.data.message);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0E1A] px-4 py-12">
      <div className="w-full max-w-[400px] overflow-hidden rounded-2xl border border-[#262B42] bg-[#141827] shadow-2xl">

        {/* Marquee header */}
        <div className="relative px-8 pb-8 pt-9 text-center">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#7C5CFC]/20 to-transparent" />
          <div className="relative flex flex-col items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#7C5CFC] font-mono-tix text-lg font-bold text-[#0B0E1A] shadow-[0_0_20px_rgba(124,92,252,0.55)]">
              C
            </span>
            <h1 className="font-mono-tix text-2xl font-bold tracking-wide text-[#E7E9F5]">
              CINE<span className="text-[#22D3EE]">FLIX</span>
            </h1>
            <span className="mm-glow-bar w-32" />
            <p className="font-mono-tix text-xs uppercase tracking-widest text-[#5C6280]">
              Admit One · Sign In
            </p>
          </div>
        </div>

        {/* Ticket tear */}
        <div className="mm-tear" />

        {/* Form Body */}
        <div className="px-7 py-8">
          <h2 className="mb-1 text-center text-xl font-semibold text-[#E7E9F5]">Welcome back</h2>
          <p className="mb-6 text-center text-sm text-[#8A90A8]">Log in to continue booking</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1.5 block font-mono-tix text-xs uppercase tracking-widest text-[#8A90A8]">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className="h-11 w-full rounded-md border border-[#2E3550] bg-[#0E1220] px-4 text-sm text-[#E7E9F5] placeholder:text-[#5C6280] focus:border-[#7C5CFC] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/40"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-mono-tix text-xs uppercase tracking-widest text-[#8A90A8]">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="h-11 w-full rounded-md border border-[#2E3550] bg-[#0E1220] px-4 text-sm text-[#E7E9F5] placeholder:text-[#5C6280] focus:border-[#7C5CFC] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/40"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-12 w-full rounded-md bg-[#7C5CFC] font-mono-tix text-sm font-bold uppercase tracking-widest text-white shadow-[0_0_18px_rgba(124,92,252,0.4)] transition-colors hover:bg-[#8F72FF] disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Log In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#8A90A8]">
            New here?{' '}
            <NavLink to="/sign-up" className="font-semibold text-[#22D3EE] hover:underline">
              Create an account
            </NavLink>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Login
