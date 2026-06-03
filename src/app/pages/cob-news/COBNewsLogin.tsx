import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Globe,
  LogIn,
  ArrowRight,
  ShieldCheck,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";

export default function COBNewsLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  return (
    <div className="min-h-[calc(100vh-96px)] flex flex-col lg:flex-row relative overflow-hidden bg-slate-50">
      {/* ── Success Toast ── */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 bg-white text-green-700 rounded-2xl border border-green-200 shadow-xl"
          >
            <ShieldCheck className="w-6 h-6 flex-shrink-0 text-green-500" />
            <div>
              <div className="font-bold text-sm tracking-wide">Login Successful</div>
              <div className="text-green-600/80 text-xs font-medium">Welcome back to the community!</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LEFT HERO SIDE ── */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full lg:w-1/2 min-h-[320px] lg:min-h-full flex items-center justify-center p-8 md:p-12 lg:p-16 overflow-hidden bg-blue-600 rounded-b-[3rem] lg:rounded-none lg:rounded-r-[4rem] shadow-2xl z-10"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-500 rounded-full blur-[80px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-700 rounded-full blur-[80px]" />
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIi8+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiLz48L3N2Zz4=')] opacity-50" />
        </div>

        <div className="relative z-10 max-w-md text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center gap-4 mb-8 justify-center lg:justify-start group"
          >
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-white transition-all shadow-lg">
              <Globe className="w-7 h-7 text-white group-hover:text-blue-600 transition-colors" />
            </div>
            <div>
              <div className="text-white font-black text-2xl tracking-tight leading-none">CBNN News</div>
              <div className="text-[10px] text-blue-200 font-bold tracking-widest uppercase leading-none mt-1.5">Cross-Borders Outreach</div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.2] tracking-tight mb-6"
          >
            Welcome Back to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-300">
              Our Community
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-blue-100 font-medium text-base leading-relaxed mb-8"
          >
            Log in to access personalized global impact stories, connect with field operatives, and track how your contributions are making a difference.
          </motion.p>
        </div>
      </motion.div>

      {/* ── RIGHT FORM SIDE ── */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-16 relative"
      >
        <div className="w-full max-w-md relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-10 text-center lg:text-left"
          >
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3 flex items-center justify-center lg:justify-start gap-3">
              <Heart className="w-8 h-8 text-orange-500" />
              Sign In
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              Don't have an account?{" "}
              <Link to="/global-news/sign-up" className="text-blue-600 hover:text-blue-700 font-bold underline decoration-blue-200 underline-offset-4 transition-colors">
                Create one today
              </Link>
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email */}
            <div className="relative group">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400 shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="relative group">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex justify-between">
                <span>Password</span>
                <Link to="/global-news" className="text-orange-600 hover:text-orange-700 font-bold transition-colors">Forgot?</Link>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm tracking-wide rounded-2xl shadow-lg shadow-orange-500/30 transition-all disabled:opacity-70 mt-4"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In to Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}
