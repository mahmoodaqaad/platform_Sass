"use client";

import { Link, useRouter } from '@/i18n/routing';
import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineLockClosed, HiCheckCircle, HiOutlineUser } from "react-icons/hi2";
import { HiOutlineMail } from "react-icons/hi";
import { useTranslations } from "next-intl";
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

const Register = () => {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean | null>(null);
  const [redirectAfter, setRedirectAfter] = useState<string | null>(null);

  React.useEffect(() => {
    // Capture plan and redirect from URL
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");
    const redirect = params.get("redirect");
    if (plan) {
      sessionStorage.setItem("selected_plan", plan);
    }
    if (redirect) {
      setRedirectAfter(redirect);
    }
  }, []);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("/api/settings/public");
        setIsRegistrationOpen(res.data.registrationOpen);
      } catch (error) {
        console.error("Fetch settings error:", error);
        setIsRegistrationOpen(true); // Default to open if API fails
      }
    };
    fetchSettings();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length < 3) return setError(t("nameShort"));
    if (password.length < 6) return setError(t("passwordShort"));
    if (password !== confirmPassword) return setError(t("passwordMismatch"));

    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/register", { name, email, password });
      const { user } = res.data;

      setSuccess(true);
      setUserRole(user.role);

      // setTimeout(() => {
        if (!user.emailVerified) {
          return router.push("/verify-email");
        } else if (redirectAfter) {
          return router.push(redirectAfter as never);
        } else if (user.role === "ADMIN") {
          return router.push("/admin");
        } else if (user.role === "OWNER") {
          return router.push("/onboarding");
        } else if (user.role === "STAFF") {
          return router.push("/staff");
        } else {
          return router.push("/");
        }
      // }, 1500);
    } catch (e: unknown) {
      console.error(e);
      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.message || t("registrationFailed"));
      } else {
        setError(t("unexpectedError"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-slate-950">

      {/* Success Overlay */}
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
              <h2 className="text-3xl font-black text-white mb-2">{t("accountCreated")}</h2>
              <p className="text-slate-400 font-medium">{t("welcomeAboard", { role: userRole.toLowerCase() })}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Glow */}
      <div className="absolute w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full top-[-200px] left-[-200px]" />
      <div className="absolute w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full bottom-[-150px] right-[-150px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-5xl grid md:grid-cols-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
      >

        {/* LEFT SIDE */}
        <div className="p-12 flex flex-col justify-center text-white space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
            {t("buildBusiness")}
          </h1>

          <p className="text-slate-300 text-lg">
            {t("registerDescription")}
          </p>

          <div className="space-y-3 text-slate-400">
            <div className="flex items-center gap-2">
              <HiCheckCircle className="text-indigo-400 text-xl" />
              <span>{t("smartBooking")}</span>
            </div>
            <div className="flex items-center gap-2">
              <HiCheckCircle className="text-indigo-400 text-xl" />
              <span>{t("advancedDashboard")}</span>
            </div>
            <div className="flex items-center gap-2">
              <HiCheckCircle className="text-indigo-400 text-xl" />
              <span>{t("staffManagement")}</span>
            </div>
            <div className="flex items-center gap-2">
              <HiCheckCircle className="text-indigo-400 text-xl" />
              <span>{t("analyticsReports")}</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="p-10 bg-slate-900/40 relative">

          {/* Registration Closed Overlay */}
          <AnimatePresence>
            {isRegistrationOpen === false && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 bg-slate-900/90 backdrop-blur-sm text-center"
              >
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
                  <HiOutlineLockClosed size={32} />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">{t("registrationClosed")}</h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                  {t("registrationClosedMsg")}
                </p>
                <Link
                  href="/contact"
                  className="mt-8 px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold transition-all"
                >
                  {t("contactUs")}
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <h2 className="text-3xl font-semibold text-white mb-8">
            {t("createAccount")}
          </h2>

          <form onSubmit={handleRegister} className="space-y-6">

            {/* Full Name */}
            <div className="relative group">
              <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-indigo-400 transition" />
              <input
                required
                name='name'
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="peer w-full bg-transparent border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white outline-none focus:border-indigo-500 transition"
                placeholder={t("fullName")}
              />
            </div>

            {/* Email */}
            <div className="relative group">
              <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-indigo-400 transition" />
              <input
                required
                name='email'
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full bg-transparent border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white outline-none focus:border-indigo-500 transition"
                placeholder={t("email")}
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-indigo-400 transition" />
              <input
                type="password"
                name='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full bg-transparent border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white outline-none focus:border-indigo-500 transition"
                placeholder={t("password")}
              />
            </div>

            {/* Confirm Password */}
            <div className="relative group">
              <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-indigo-400 transition" />
              <input
                type="password"
                required
                name='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="peer w-full bg-transparent border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white outline-none focus:border-indigo-500 transition"
                placeholder={t("confirmPassword")}
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
              shadow-lg shadow-indigo-600/30"
            >
              {loading ? t("signingIn") : t("createAccount")}
            </button>

            {/* SEPARATOR */}
            <div className="relative flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t("or")}</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* GOOGLE BUTTON */}
            <button
              type="button"
              onClick={() => signIn("google")}
              className="w-full py-4 rounded-xl font-bold text-white border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-indigo-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <FcGoogle className="text-2xl group-hover:scale-110 transition-transform" />
              <span className="relative z-10">{t("continueWithGoogle")}</span>
            </button>

          </form>

          <p className="text-slate-400 text-center mt-6">
            {t("alreadyHaveAccount")}{" "}
            <Link href="/login" className="text-indigo-400 hover:underline">
              {t("signIn")}
            </Link>
          </p>
        </div>

      </motion.div>
    </div>
  );
};

export default Register; 