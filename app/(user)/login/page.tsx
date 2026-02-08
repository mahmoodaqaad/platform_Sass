"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { HiOutlineLockClosed, HiCheckCircle } from "react-icons/hi2"
import { HiOutlineMail } from 'react-icons/hi'

import axios from 'axios'

const Login = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [userRole, setUserRole] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await axios.post("/api/login", { email, password })
      const { user } = response.data

      setSuccess(true)
      setUserRole(user.role)

      // Dramatic pause for success effect
      setTimeout(() => {
        if (user.role === "ADMIN") window.location.href = "/admin"
        else if (user.role === "OWNER") window.location.href = "/owner"
        else if (user.role === "STAFF") window.location.href = "/staff"
        else window.location.href = "/"
      }, 1500)

    } catch (e: unknown) {
      console.error(e)
      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.message || "Login failed")
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-slate-950">

      {/* Background Glow */}
      <div className="absolute w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full top-[-200px] left-[-200px]" />
      <div className="absolute w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full bottom-[-150px] right-[-150px]" />

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center p-10 rounded-[3rem] bg-slate-900 border border-indigo-500/30 shadow-2xl shadow-indigo-500/20"
            >
              <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-600/40">
                <HiCheckCircle className="text-6xl text-white" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2">Welcome Back!</h2>
              <p className="text-slate-400 font-medium">Redirecting you to your {userRole.toLowerCase()} hub...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-5xl grid md:grid-cols-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
      >

        {/* LEFT SIDE */}
        <div className="p-12 flex flex-col justify-center text-white space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
            Welcome Back
          </h1>

          <p className="text-slate-300 text-lg">
            Login to your dashboard to manage your bookings,
            view analytics, and grow your business.
          </p>

          <div className="space-y-3 text-slate-400">
            <div className="flex items-center gap-2">
              <HiCheckCircle className="text-indigo-400 text-xl" />
              <span>Access Your Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <HiCheckCircle className="text-indigo-400 text-xl" />
              <span>Manage Bookings</span>
            </div>
            <div className="flex items-center gap-2">
              <HiCheckCircle className="text-indigo-400 text-xl" />
              <span>View Real-time Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <HiCheckCircle className="text-indigo-400 text-xl" />
              <span>24/7 Priority Support</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="p-10 bg-slate-900/40">

          <h2 className="text-3xl font-semibold text-white mb-8">
            Sign In
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email */}
            <div className="relative group">
              <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-indigo-400 transition" />
              <input
                required
                type="email"
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full bg-transparent border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white outline-none focus:border-indigo-500 transition"
                placeholder="Email Address"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-indigo-400 transition" />
              <input
                type="password"
                required
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full bg-transparent border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white outline-none focus:border-indigo-500 transition"
                placeholder="Password"
              />
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            {/* BUTTON */}
            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 rounded-xl font-semibold text-white
              bg-linear-to-r from-indigo-600 to-violet-600
              hover:scale-[1.02]
              active:scale-[0.98]
              transition-all
              shadow-lg shadow-indigo-600/30
              disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>

          <p className="text-slate-400 text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-indigo-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

      </motion.div>
    </div>
  )
}

export default Login 