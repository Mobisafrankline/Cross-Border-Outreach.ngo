import { useState, useMemo, useEffect, Fragment } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import {
  Heart, Mail, Lock, User, Phone, MapPin,
  AlertCircle, CheckCircle, Eye, EyeOff,
  Globe, Shield, ArrowRight, ArrowLeft, Sparkles, KeyRound,
  TrendingUp, Users, Database, Activity
} from "lucide-react";
import { signIn, signUp, createDonor, registerAdmin } from "../../lib/supabase";

/* ─── helpers ────────────────────────────────────────────── */
function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}
const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];

/* ─── static content ─────────────────────────────────────── */
const DONOR_STATS = [
  { value: "12,400+", label: "Lives Impacted" },
  { value: "38", label: "Countries Reached" },
  { value: "$2.1M", label: "Donations Processed" },
];

const ADMIN_FEATURES = [
  { icon: Users, text: "Manage donor accounts & records" },
  { icon: Activity, text: "Monitor donations in real time" },
  { icon: Database, text: "Access full content management" },
  { icon: Globe, text: "Oversee cross-border programs" },
];

type PortalType = "donor" | "admin";
type AuthMode = "login" | "register";

export default function AuthPortal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL state
  const initialType = (searchParams.get("type") === "admin" ? "admin" : "donor") as PortalType;
  const initialMode = (searchParams.get("mode") === "register" ? "register" : "login") as AuthMode;

  const [portalType, setPortalType] = useState<PortalType>(initialType);
  const [authMode, setAuthMode] = useState<AuthMode>(initialMode);
  const [regStep, setRegStep] = useState(1);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");

  // UI states
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const pwStrength = useMemo(() => getStrength(password), [password]);

  // Keep URL in sync (optional, but good for shareability)
  useEffect(() => {
    const params = new URLSearchParams();
    if (portalType === "admin") params.set("type", "admin");
    if (authMode === "register") params.set("mode", "register");
    setSearchParams(params, { replace: true });
    // Reset errors when switching modes
    setError(null);
    setSuccess(false);
  }, [portalType, authMode, setSearchParams]);

  /* Validation */
  const step1Valid = firstName.trim() && lastName.trim() && email.includes("@");
  const step2Valid = password.length >= 6 && confirmPassword === password && agreed;

  /* Handlers */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError("Authentication failed. Please try again.");
      setLoading(false);
      return;
    }

    // Route based on portal type
    if (portalType === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/donor/dashboard");
    }
  };

  const handleAdminRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (adminCode !== 'Cr055-B0rder5@2s4') {
      setError("Invalid Registration Code.");
      return;
    }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (!firstName.trim() || !lastName.trim()) { setError("Name is required."); return; }

    setLoading(true);

    const { data, error: signUpError } = await signUp(email, password, {
      first_name: firstName,
      last_name: lastName,
    });

    if (signUpError) { setError(signUpError.message); setLoading(false); return; }

    if (data.user) {
      if (!data.session) {
        setLoading(false);
        setSuccess(true);
        return;
      }

      const { error: adminError } = await registerAdmin(adminCode, firstName, lastName, phone, address);
      if (adminError) {
        setError("Account created but admin verification failed: " + adminError.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    setSuccess(true);
    if (data.session) {
      setTimeout(() => navigate("/admin/dashboard"), 2500);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    
    setLoading(true);

    const { data, error: signUpError } = await signUp(email, password, {
      first_name: firstName,
      last_name: lastName,
    });

    if (signUpError) { setError(signUpError.message); setLoading(false); return; }

    if (data.user) {
      if (!data.session) {
        setLoading(false);
        setSuccess(true);
        return;
      }

      const { error: profileError } = await createDonor({
        id: data.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        phone: phone || undefined,
        address: address || undefined,
        total_donated: 0,
        donation_count: 0,
        status: "active",
      } as any);

      if (profileError) {
        setError("Account created but profile setup failed: " + profileError.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    setSuccess(true);
    if (data.session) {
      setTimeout(() => navigate("/donor/dashboard"), 2500);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        .auth-root { font-family: 'Inter', sans-serif; }

        /* Left panel transitions */
        .auth-left {
          position: relative; overflow: hidden;
          transition: background 0.6s ease-in-out;
        }
        .auth-left.donor {
          background: linear-gradient(145deg, #0f172a 0%, #1e3a5f 45%, #1d4ed8 100%);
        }
        .auth-left.admin {
          background: linear-gradient(145deg, #0a0a1a 0%, #0f1f3d 40%, #1a3a6b 80%, #1e4080 100%);
        }

        .auth-left::before {
          content: ''; position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='28'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .auth-orb {
          position: absolute; border-radius: 50%; filter: blur(70px); opacity: 0.2;
          animation: float 7s ease-in-out infinite; transition: all 0.6s ease;
        }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }

        .auth-highlight {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 18px; border-radius: 12px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
          transition: background .2s;
        }
        .auth-highlight:hover { background: rgba(255,255,255,0.12); }
        
        .auth-icon-wrap {
          width: 38px; height: 38px; border-radius: 10px;
          background: rgba(255,255,255,0.12);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }

        /* Inputs & Buttons */
        .auth-input {
          width: 100%; padding: 12px 12px 12px 44px;
          border: 1.5px solid #e5e7eb; border-radius: 10px;
          font-size: 15px; font-family: 'Inter', sans-serif;
          outline: none; transition: border-color .2s, box-shadow .2s;
          background: #fafafa; color: #111827; box-sizing: border-box;
        }
        .auth-input:focus {
          border-color: #1d4ed8; background: #fff;
          box-shadow: 0 0 0 3px rgba(29,78,216,.12);
        }
        .auth-input.error { border-color: #ef4444; }

        .auth-btn {
          width: 100%; padding: 14px; border: none; cursor: pointer;
          border-radius: 12px; font-size: 16px; font-weight: 700;
          font-family: 'Inter', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: opacity .2s, transform .15s, box-shadow .2s, background 0.4s;
          color: #fff;
        }
        .auth-btn.donor { background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%); box-shadow: 0 4px 20px rgba(29,78,216,.4); }
        .auth-btn.donor-reg { background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%); box-shadow: 0 4px 20px rgba(124,58,237,.4); }
        .auth-btn.admin { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); box-shadow: 0 4px 20px rgba(30,58,138,.5); }
        
        .auth-btn:hover:not(:disabled) { opacity: .92; transform: translateY(-1px); }
        .auth-btn:disabled { opacity: .6; cursor: not-allowed; }

        .auth-btn-outline {
          width: 100%; padding: 13px; border: 1.5px solid #e5e7eb;
          background: transparent; color: #4b5563; border-radius: 12px; cursor: pointer;
          font-size: 15px; font-weight: 600; font-family:'Inter',sans-serif;
          display:flex;align-items:center;justify-content:center;gap:8px;
          transition: background .2s, color .2s, border-color .2s;
        }
        .auth-btn-outline:hover { background: #f9fafb; color: #111827; border-color: #d1d5db; }

        /* Tabs */
        .type-tabs {
          display: flex; background: #f3f4f6; border-radius: 12px; padding: 4px; margin-bottom: 32px;
        }
        .type-tab {
          flex: 1; padding: 10px; border-radius: 8px; font-size: 14px; font-weight: 600;
          text-align: center; cursor: pointer; transition: all 0.2s; color: #6b7280;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .type-tab.active { background: #fff; color: #111827; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

        .mode-tabs {
          display: flex; gap: 24px; margin-bottom: 24px; border-bottom: 1.5px solid #e5e7eb;
        }
        .mode-tab {
          padding-bottom: 12px; font-size: 15px; font-weight: 600; color: #9ca3af;
          cursor: pointer; position: relative; transition: color 0.2s;
        }
        .mode-tab.active { color: #1d4ed8; }
        .mode-tab.active::after {
          content: ''; position: absolute; bottom: -1.5px; left: 0; right: 0;
          height: 2.5px; background: #1d4ed8; border-radius: 2px 2px 0 0;
        }

        /* Step indicator */
        .step-dot {
          width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 13px; transition: all .3s;
        }
        .step-dot.active   { background: #7c3aed; color: #fff; box-shadow: 0 0 0 4px rgba(124,58,237,.2); }
        .step-dot.done     { background: #22c55e; color: #fff; }
        .step-dot.inactive { background: #e5e7eb; color: #9ca3af; }
        .pw-bar { height: 4px; border-radius: 2px; transition: width .4s, background .4s; }

        @media(max-width:900px){ .auth-left { display: none !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="auth-root" style={{ minHeight: "100vh", display: "flex", background: "#f8f9fa" }}>

        {/* ── LEFT PANEL ── */}
        <div className={`auth-left ${portalType}`} style={{ flex: "0 0 44%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px 48px", color: "#fff" }}>
          <div className="auth-orb" style={{ 
            width: portalType === 'admin' ? 300 : 280, 
            height: portalType === 'admin' ? 300 : 280, 
            background: portalType === 'admin' ? "#3b82f6" : "#3b82f6", 
            top: -80, right: -60 
          }} />
          <div className="auth-orb" style={{ 
            width: portalType === 'admin' ? 220 : 200, 
            height: portalType === 'admin' ? 220 : 200, 
            background: portalType === 'admin' ? "#8b5cf6" : "#6366f1", 
            bottom: 60, left: -50, animationDelay: "3s" 
          }} />

          {/* Logo & Header */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 44 }}>
              <img src="/logo.png" alt="Cross-Borders Outreach Ministry" style={{ height: 72, objectFit: "contain", filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.3))" }} />
              
              {portalType === "admin" && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", fontSize: 12, fontWeight: 600 }}>
                  <Shield size={11}/> Admin
                </div>
              )}
            </div>

            {portalType === "donor" ? (
              <>
                <h2 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.25, marginBottom: 14 }}>
                  {authMode === "login" ? "Welcome back," : "Make a difference"}<br />
                  <span style={{ background: authMode === "login" ? "linear-gradient(90deg,#93c5fd,#a5b4fc)" : "linear-gradient(90deg,#c084fc,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {authMode === "login" ? "generous donor." : "starting today."}
                  </span>
                </h2>
                <p style={{ opacity: .75, fontSize: 15, lineHeight: 1.65, marginBottom: 40 }}>
                  {authMode === "login" 
                    ? "Sign in to your Donor Portal to track donations, view your impact reports, and manage your giving profile."
                    : "Join thousands of compassionate donors who are transforming lives across borders. Your account gives you full transparency."}
                </p>

                {authMode === "login" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { icon: Heart, text: "Track every donation you make" },
                      { icon: TrendingUp, text: "See your real-world impact" },
                      { icon: Users, text: "Join 12,400+ compassionate donors" },
                    ].map(({ icon: Icon, text }) => (
                      <div className="auth-highlight" key={text}>
                        <div className="auth-icon-wrap"><Icon size={18} color="#93c5fd" /></div>
                        <span style={{ fontSize: 14, opacity: .9 }}>{text}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {DONOR_STATS.map((s) => (
                      <div className="auth-highlight" key={s.label} style={{ justifyContent: "space-between" }}>
                        <span style={{ opacity: .8, fontSize: 14 }}>{s.label}</span>
                        <span style={{ fontWeight: 800, fontSize: 20 }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.25, marginBottom: 14 }}>
                  Administration<br/>
                  <span style={{ background: "linear-gradient(90deg,#60a5fa,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Command Center
                  </span>
                </h2>
                <p style={{ opacity: .72, fontSize: 14.5, lineHeight: 1.65, marginBottom: 38 }}>
                  Restricted access. Authorized administrators only. All login attempts are logged and monitored.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {ADMIN_FEATURES.map(({ icon: Icon, text }) => (
                    <div className="auth-highlight" key={text}>
                      <div className="auth-icon-wrap"><Icon size={17} color="#93c5fd"/></div>
                      <span style={{ fontSize: 14, opacity: .88 }}>{text}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 8, opacity: .6, fontSize: 13 }}>
            {portalType === "admin" ? (
              <><Shield size={13}/><span>256-bit encrypted · Supabase Auth · Admin-only</span></>
            ) : (
              <><Globe size={14} /><span>Transforming lives across 38+ nations</span></>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", overflowY: "auto", background: "#fff" }}>
          <div style={{ width: "100%", maxWidth: 480 }}>

            {/* Top Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <Link to="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "#6b7280", fontSize: 14, textDecoration: "none" }}>
                <ArrowLeft size={15} /> Back to site
              </Link>
            </div>

            {/* Main Portal Toggle */}
            <div className="type-tabs">
              <div 
                className={`type-tab ${portalType === 'donor' ? 'active' : ''}`}
                onClick={() => setPortalType('donor')}
              >
                <Heart size={16} /> Donor Portal
              </div>
              <div 
                className={`type-tab ${portalType === 'admin' ? 'active' : ''}`}
                onClick={() => setPortalType('admin')}
              >
                <Shield size={16} /> Admin Portal
              </div>
            </div>

            {/* Error / Success Banners */}
            {success && (
              <div style={{ display: "flex", gap: 14, padding: "16px 18px", borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", marginBottom: 24 }}>
                <CheckCircle size={22} color="#16a34a" style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 700, color: "#15803d", margin: 0 }}>You have successfully created your account.</p>
                  <p style={{ color: "#166534", fontSize: 13, marginTop: 4 }}>Please confirm your email in your inbox to continue.</p>
                </div>
              </div>
            )}

            {error && (
              error.toLowerCase().includes("email not confirmed") ? (
                <div style={{ display: "flex", gap: 14, padding: "18px", borderRadius: 16, background: "linear-gradient(to right, #fffbeb, #fef3c7)", border: "1px solid #fde68a", marginBottom: 26, boxShadow: "0 8px 20px rgba(251,191,36,0.12)" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: "#fde68a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "inset 0 2px 4px rgba(255,255,255,0.5)" }}>
                    <Mail size={22} color="#b45309" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 800, color: "#92400e", margin: 0, fontSize: 15, display: "flex", alignItems: "center", gap: 6 }}>
                      Action Required <Sparkles size={14} color="#d97706" />
                    </p>
                    <p style={{ color: "#92400e", fontSize: 13.5, marginTop: 6, lineHeight: 1.5, opacity: 0.9 }}>
                      Your email address hasn't been verified yet. Please check the inbox for <strong>{email}</strong> and click the secure link we sent you to activate your account.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 12, padding: "14px 16px", borderRadius: 12, background: "#fef2f2", border: "1px solid #fecaca", marginBottom: 24 }}>
                  <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: 14, color: "#b91c1c", margin: 0, lineHeight: 1.4 }}>{error}</p>
                </div>
              )
            )}

            {/* ── DONOR CONTEXT ── */}
            {portalType === "donor" && (
              <>
                <div className="mode-tabs">
                  <div className={`mode-tab ${authMode === 'login' ? 'active' : ''}`} onClick={() => setAuthMode('login')}>
                    Sign In
                  </div>
                  <div className={`mode-tab ${authMode === 'register' ? 'active' : ''}`} onClick={() => { setAuthMode('register'); setRegStep(1); }}>
                    Create Account
                  </div>
                </div>

                {authMode === "login" && (
                  <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Email Address</label>
                      <div style={{ position: "relative" }}>
                        <Mail size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                        <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your.email@example.com" required disabled={loading} autoComplete="email" />
                      </div>
                    </div>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Password</label>
                        <a href="#" style={{ fontSize: 13, color: "#1d4ed8", fontWeight: 500, textDecoration: "none" }}>Forgot password?</a>
                      </div>
                      <div style={{ position: "relative" }}>
                        <Lock size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                        <input className="auth-input" type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required disabled={loading} autoComplete="current-password" style={{ paddingRight: 44 }} />
                        <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>
                          {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <button type="submit" className="auth-btn donor" disabled={loading} style={{ marginTop: 4 }}>
                      {loading ? <><div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,.35)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite" }} /> Signing in…</> : "Sign In"}
                    </button>
                  </form>
                )}

                {authMode === "register" && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
                      {[1, 2].map((s, i) => (
                        <Fragment key={s}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                            <div className={`step-dot ${regStep > s ? "done" : regStep === s ? "active" : "inactive"}`}>
                              {regStep > s ? <CheckCircle size={16} /> : s}
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 600, color: regStep === s ? "#7c3aed" : "#9ca3af" }}>
                              {s === 1 ? "Personal Info" : "Security"}
                            </span>
                          </div>
                          {i < 1 && <div style={{ flex: 1, height: 2, background: regStep > 1 ? "#22c55e" : "#e5e7eb", margin: "0 10px", marginBottom: 20 }} />}
                        </Fragment>
                      ))}
                    </div>

                    <form onSubmit={regStep === 2 ? handleRegister : (e) => { e.preventDefault(); if (step1Valid) setRegStep(2); }}>
                      {regStep === 1 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            {(["First Name", "Last Name"] as const).map((label, i) => (
                              <div key={label}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label} *</label>
                                <div style={{ position: "relative" }}>
                                  <User size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                                  <input className="auth-input" value={i === 0 ? firstName : lastName} onChange={e => i === 0 ? setFirstName(e.target.value) : setLastName(e.target.value)} placeholder={i === 0 ? "John" : "Doe"} required />
                                </div>
                              </div>
                            ))}
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email Address *</label>
                            <div style={{ position: "relative" }}>
                              <Mail size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                              <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john.doe@example.com" required />
                            </div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <div>
                              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Phone</label>
                              <div style={{ position: "relative" }}>
                                <Phone size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                                <input className="auth-input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (234)" />
                              </div>
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Address</label>
                              <div style={{ position: "relative" }}>
                                <MapPin size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                                <input className="auth-input" type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="City, Country" />
                              </div>
                            </div>
                          </div>
                          <button type="submit" className="auth-btn donor-reg" disabled={!step1Valid} style={{ marginTop: 8 }}>
                            Continue <ArrowRight size={18} />
                          </button>
                        </div>
                      )}

                      {regStep === 2 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                          <div>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Password *</label>
                            <div style={{ position: "relative" }}>
                              <Lock size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                              <input className="auth-input" type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" required style={{ paddingRight: 44 }} />
                              <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>
                                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                            {password && (
                              <div style={{ marginTop: 10 }}>
                                <div style={{ display: "flex", gap: 4 }}>
                                  {[1, 2, 3, 4].map(i => <div key={i} className="pw-bar" style={{ flex: 1, background: i <= pwStrength ? strengthColor[pwStrength] : "#e5e7eb" }} />)}
                                </div>
                              </div>
                            )}
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Confirm Password *</label>
                            <div style={{ position: "relative" }}>
                              <Lock size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                              <input className={`auth-input${confirmPassword && confirmPassword !== password ? " error" : ""}`} type={showCpw ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter password" required style={{ paddingRight: 44 }} />
                              <button type="button" onClick={() => setShowCpw(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>
                                {showCpw ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                            {confirmPassword && confirmPassword !== password && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 5 }}>Passwords do not match</p>}
                          </div>
                          
                          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginTop: 8 }}>
                            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#7c3aed", marginTop: 2 }} />
                            <span style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5 }}>
                              I agree to the <a href="/terms" style={{ color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>Terms of Service</a> and <a href="/privacy" style={{ color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>Privacy Policy</a>
                            </span>
                          </label>

                          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                            <button type="submit" className="auth-btn donor-reg" disabled={!step2Valid || loading || success}>
                              {loading ? <><div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Creating account…</> : <><Sparkles size={18} /> Create Account</>}
                            </button>
                            <button type="button" className="auth-btn-outline" onClick={() => setRegStep(1)}>
                              <ArrowLeft size={16} /> Back
                            </button>
                          </div>
                        </div>
                      )}
                    </form>
                  </>
                )}
              </>
            )}

            {/* ── ADMIN CONTEXT ── */}
            {portalType === "admin" && (
              <>
                <div className="mode-tabs">
                  <div className={`mode-tab ${authMode === 'login' ? 'active' : ''}`} onClick={() => setAuthMode('login')}>
                    Sign In
                  </div>
                  <div className={`mode-tab ${authMode === 'register' ? 'active' : ''}`} onClick={() => setAuthMode('register')}>
                    Register Admin
                  </div>
                </div>

                {authMode === "login" && (
                  <>
                    <div style={{ marginBottom: 32 }}>
                      <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, boxShadow: "0 6px 20px rgba(30,58,138,.35)" }}>
                        <Shield size={26} color="#fff" />
                      </div>
                      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: 0 }}>Admin Sign In</h1>
                      <p style={{ color: "#6b7280", marginTop: 8, fontSize: 14.5 }}>Authorized personnel only. Activity is monitored.</p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Admin Email</label>
                        <div style={{ position: "relative" }}>
                          <Mail size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                          <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@cross-borders.org" required disabled={loading} autoComplete="email" />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Password</label>
                        <div style={{ position: "relative" }}>
                          <Lock size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                          <input className="auth-input" type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required disabled={loading} autoComplete="current-password" style={{ paddingRight: 44 }} />
                          <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>
                            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                        <Shield size={15} color="#1d4ed8" style={{ flexShrink: 0 }} />
                        <p style={{ fontSize: 12.5, color: "#1e40af", margin: 0, lineHeight: 1.5 }}>
                          This is a restricted area. Unauthorized access attempts are logged.
                        </p>
                      </div>

                      <button type="submit" className="auth-btn admin" disabled={loading} style={{ marginTop: 4 }}>
                        {loading ? <><div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,.35)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite" }} /> Authenticating…</> : <><Shield size={17} /> Sign In Securely</>}
                      </button>
                    </form>
                  </>
                )}

                {authMode === "register" && (
                  <>
                    <div style={{ marginBottom: 32 }}>
                      <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, boxShadow: "0 6px 20px rgba(30,58,138,.35)" }}>
                        <Shield size={26} color="#fff" />
                      </div>
                      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: 0 }}>Admin Registration</h1>
                      <p style={{ color: "#6b7280", marginTop: 8, fontSize: 14.5 }}>Enter your unique code to register as an administrator.</p>
                    </div>

                    <form onSubmit={handleAdminRegister} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Registration Code *</label>
                        <div style={{ position: "relative" }}>
                          <KeyRound size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                          <input className="auth-input" type="text" value={adminCode} onChange={e => setAdminCode(e.target.value)} placeholder="Enter unique code" required disabled={loading} />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div>
                          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>First Name *</label>
                          <div style={{ position: "relative" }}>
                            <User size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                            <input className="auth-input" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jane" required disabled={loading} />
                          </div>
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Last Name *</label>
                          <div style={{ position: "relative" }}>
                            <User size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                            <input className="auth-input" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" required disabled={loading} />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Email Address *</label>
                        <div style={{ position: "relative" }}>
                          <Mail size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                          <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@cross-borders.org" required disabled={loading} autoComplete="email" />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div>
                          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Phone</label>
                          <div style={{ position: "relative" }}>
                            <Phone size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                            <input className="auth-input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (234)" disabled={loading} />
                          </div>
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Location</label>
                          <div style={{ position: "relative" }}>
                            <MapPin size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                            <input className="auth-input" type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="City, Country" disabled={loading} />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Password *</label>
                        <div style={{ position: "relative" }}>
                          <Lock size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                          <input className="auth-input" type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" required disabled={loading} style={{ paddingRight: 44 }} />
                          <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>
                            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Confirm Password *</label>
                        <div style={{ position: "relative" }}>
                          <Lock size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                          <input className={`auth-input${confirmPassword && confirmPassword !== password ? " error" : ""}`} type={showCpw ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter password" required disabled={loading} style={{ paddingRight: 44 }} />
                          <button type="button" onClick={() => setShowCpw(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>
                            {showCpw ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {confirmPassword && confirmPassword !== password && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 5 }}>Passwords do not match</p>}
                      </div>

                      <button type="submit" className="auth-btn admin" disabled={loading} style={{ marginTop: 4 }}>
                        {loading ? <><div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,.35)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite" }} /> Registering…</> : <><Shield size={17} /> Register Admin</>}
                      </button>
                    </form>
                  </>
                )}
              </>
            )}

            <p style={{ marginTop: 40, textAlign: "center", fontSize: 13, color: "#9ca3af" }}>
              © {new Date().getFullYear()} Cross-Borders Outreach Ministry Inc.<br/>All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
