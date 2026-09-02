import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Shield, ArrowLeft, Globe, Activity, Database, Users, Fingerprint } from "lucide-react";
import { signIn } from "../../../lib/supabase";

const ADMIN_FEATURES = [
  { icon: Users,    text: "Manage donor accounts & records" },
  { icon: Activity, text: "Monitor donations in real time" },
  { icon: Database, text: "Access full content management" },
  { icon: Globe,    text: "Oversee cross-border programs" },
];

export default function AdminLogin() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [focused, setFocused]   = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error } = await signIn(email, password);
    if (error)       { setError(error.message); setLoading(false); return; }
    if (!data.user)  { setError("Authentication failed. Please try again."); setLoading(false); return; }
    navigate("/admin/dashboard");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
        .al-root { font-family:'Inter',sans-serif; }

        /* ─── Left Panel ─── */
        .al-left {
          background: linear-gradient(160deg, #021a2e 0%, #032B45 35%, #053D61 65%, #032B45 100%);
          position: relative; overflow: hidden;
        }
        .al-mesh {
          position: absolute; inset: 0; opacity: .12;
          background:
            radial-gradient(ellipse 80% 50% at 20% 80%, #F5B800, transparent),
            radial-gradient(ellipse 60% 40% at 80% 20%, #F5B800, transparent),
            radial-gradient(ellipse 50% 60% at 50% 50%, #053D61, transparent);
          filter: blur(60px);
          animation: al-mesh-shift 12s ease-in-out infinite alternate;
        }
        @keyframes al-mesh-shift {
          0%   { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.15) translate(-3%, 5%); }
        }
        .al-grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse at 40% 50%, black 30%, transparent 70%);
        }
        .al-orb {
          position: absolute; border-radius: 50%; filter: blur(90px);
          animation: al-float 10s ease-in-out infinite;
        }
        @keyframes al-float {
          0%,100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.08); }
        }

        /* Floating gold particles */
        .al-particle {
          position: absolute; border-radius: 50%; background: #F5B800;
          animation: al-particle-rise linear infinite;
          opacity: 0;
        }
        @keyframes al-particle-rise {
          0%   { opacity: 0; transform: translateY(0) scale(0.5); }
          15%  { opacity: 0.7; }
          85%  { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(-400px) scale(0); }
        }

        .al-feat {
          display: flex; align-items: center; gap: 14px;
          padding: 16px 20px; border-radius: 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(12px);
          transition: all .3s cubic-bezier(.4,0,.2,1);
        }
        .al-feat:hover {
          background: rgba(245,184,0,0.08);
          border-color: rgba(245,184,0,0.2);
          transform: translateX(6px);
        }
        .al-feat-icon {
          width: 42px; height: 42px; border-radius: 12px;
          background: linear-gradient(135deg, rgba(245,184,0,0.18), rgba(245,184,0,0.06));
          border: 1px solid rgba(245,184,0,0.15);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          transition: all .3s;
        }
        .al-feat:hover .al-feat-icon {
          background: linear-gradient(135deg, rgba(245,184,0,0.3), rgba(245,184,0,0.12));
          border-color: rgba(245,184,0,0.3);
          box-shadow: 0 0 20px rgba(245,184,0,0.15);
        }
        .al-badge {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 7px 16px; border-radius: 999px;
          background: rgba(245,184,0,0.1); border: 1px solid rgba(245,184,0,0.2);
          color: #F5B800; font-size: 11px; font-weight: 700; letter-spacing: 0.8px;
          text-transform: uppercase;
        }
        .al-status-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #F5B800;
          animation: al-pulse 2s ease-in-out infinite;
          box-shadow: 0 0 8px rgba(245,184,0,0.5);
        }
        @keyframes al-pulse { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.4)} }

        /* ─── Right Panel ─── */
        .al-right {
          background: linear-gradient(180deg, #f8fafc 0%, #f0f4f8 100%);
          position: relative; overflow: hidden;
        }
        .al-right::before {
          content: ''; position: absolute; top: -200px; right: -200px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(3,43,69,0.04), transparent 70%);
          pointer-events: none;
        }

        .al-form-card {
          background: #fff;
          border-radius: 24px;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow:
            0 1px 3px rgba(0,0,0,0.04),
            0 8px 32px rgba(3,43,69,0.06),
            0 24px 60px rgba(3,43,69,0.04);
          padding: 40px 36px;
          position: relative;
          overflow: hidden;
        }
        .al-form-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, #032B45, #F5B800, #053D61);
        }

        .al-input-group { position: relative; }
        .al-input-group.focused .al-input-icon { color: #F5B800; }
        .al-input-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; transition: color .25s;
          pointer-events: none;
        }
        .al-input {
          width: 100%; padding: 16px 16px 16px 50px;
          border: 2px solid #e8ecf1; border-radius: 14px;
          font-size: 15px; font-family: 'Inter', sans-serif;
          outline: none; background: #fafbfc; color: #111827;
          transition: all .25s cubic-bezier(.4,0,.2,1);
        }
        .al-input:focus {
          border-color: #F5B800; background: #fff;
          box-shadow: 0 0 0 4px rgba(245,184,0,0.1), 0 2px 8px rgba(245,184,0,0.06);
        }
        .al-input::placeholder { color: #b0b8c4; }

        .al-btn {
          width: 100%; padding: 16px; border: none; cursor: pointer;
          border-radius: 14px; font-size: 16px; font-weight: 700;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #032B45 0%, #053D61 100%);
          color: #fff; box-shadow: 0 4px 16px rgba(3,43,69,0.35);
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all .3s cubic-bezier(.4,0,.2,1);
          position: relative; overflow: hidden;
        }
        .al-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, #F5B800, #FFD13B);
          opacity: 0; transition: opacity .3s;
        }
        .al-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(3,43,69,0.45);
        }
        .al-btn:hover:not(:disabled)::before { opacity: 1; }
        .al-btn:hover:not(:disabled) { color: #032B45; }
        .al-btn > * { position: relative; z-index: 1; }
        .al-btn:active:not(:disabled) { transform: translateY(0); }
        .al-btn:disabled { opacity: .6; cursor: not-allowed; }
        @keyframes al-spin { to { transform: rotate(360deg); } }

        @media(max-width:900px) { .al-left { display: none!important; } }
      `}</style>

      <div className="al-root" style={{ minHeight: "100vh", display: "flex" }}>

        {/* ═══ LEFT PANEL ═══ */}
        <div className="al-left" style={{ flex: "0 0 46%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px 48px", color: "#fff" }}>
          <div className="al-mesh" />
          <div className="al-grid-bg" />
          <div className="al-orb" style={{ width: 350, height: 350, background: "rgba(245,184,0,0.15)", top: -120, right: -100 }} />
          <div className="al-orb" style={{ width: 250, height: 250, background: "rgba(9,89,214,0.12)", bottom: 40, left: -80, animationDelay: "4s" }} />

          {/* Gold particles */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="al-particle"
              style={{
                width: 3 + Math.random() * 3, height: 3 + Math.random() * 3,
                left: `${10 + Math.random() * 80}%`, bottom: `${Math.random() * 20}%`,
                animationDuration: `${5 + Math.random() * 7}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}

          {/* Logo + badge */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 52 }}>
              <img src="/logo.png" alt="Cross-borders Outreach International" style={{ height: 72, objectFit: "contain", filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.5))" }} />
              <div className="al-badge">
                <div className="al-status-dot" />
                Admin Access
              </div>
            </div>

            <h2 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.15, marginBottom: 18, fontFamily: "'Playfair Display', Georgia, serif" }}>
              Administration<br/>
              <span style={{ background: "linear-gradient(90deg, #F5B800, #FFD13B, #F5B800)", backgroundSize: "200% 200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Command Center
              </span>
            </h2>
            <p style={{ opacity: .6, fontSize: 14, lineHeight: 1.75, marginBottom: 44, maxWidth: 380, letterSpacing: "0.01em" }}>
              Restricted access portal for authorized administrators. All login attempts are monitored and logged for security.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ADMIN_FEATURES.map(({ icon: Icon, text }) => (
                <div className="al-feat" key={text}>
                  <div className="al-feat-icon">
                    <Icon size={18} color="#F5B800"/>
                  </div>
                  <span style={{ fontSize: 14, opacity: .85, fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 10, opacity: .4, fontSize: 12 }}>
            <Shield size={13}/>
            <span>256-bit encrypted · Supabase Auth · Admin-only access</span>
          </div>
        </div>

        {/* ═══ RIGHT PANEL ═══ */}
        <div className="al-right" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", overflowY: "auto" }}>
          <div style={{ width: "100%", maxWidth: 460 }}>

            {/* Top nav */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
              <Link to="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: 14, textDecoration: "none", fontWeight: 500, transition: "color .2s" }}>
                <ArrowLeft size={15}/> Back to site
              </Link>
              <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F5B800", boxShadow: "0 0 8px rgba(245,184,0,0.4)" }} />
                <span style={{ fontWeight: 700, color: "#032B45", letterSpacing: "0.02em" }}>Admin Portal</span>
              </div>
            </div>

            {/* Form Card */}
            <div className="al-form-card">
              {/* Shield icon + heading */}
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 20, margin: "0 auto 20px",
                  background: "linear-gradient(135deg, #032B45, #053D61)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 8px 32px rgba(3,43,69,0.3), 0 0 0 4px rgba(3,43,69,0.06)",
                }}>
                  <Fingerprint size={30} color="#F5B800"/>
                </div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "#032B45", margin: 0, fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Admin Sign In
                </h1>
                <p style={{ color: "#64748b", marginTop: 8, fontSize: 14, lineHeight: 1.6 }}>
                  Authorized personnel only. Your activity is monitored.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div style={{ display: "flex", gap: 12, padding: "14px 16px", borderRadius: 14, background: "#fef2f2", border: "1px solid #fecaca", marginBottom: 24 }}>
                  <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }}/>
                  <p style={{ fontSize: 14, color: "#b91c1c", margin: 0, fontWeight: 500 }}>{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Email */}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 8, letterSpacing: "0.3px" }}>
                    Admin Email
                  </label>
                  <div className={`al-input-group ${focused === "email" ? "focused" : ""}`}>
                    <Mail size={17} className="al-input-icon"/>
                    <input className="al-input" type="email" id="admin-email" value={email}
                      onChange={e => setEmail(e.target.value)} placeholder="admin@cross-borders.org"
                      required disabled={loading} autoComplete="email"
                      onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}/>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 8, letterSpacing: "0.3px" }}>
                    Password
                  </label>
                  <div className={`al-input-group ${focused === "password" ? "focused" : ""}`}>
                    <Lock size={17} className="al-input-icon"/>
                    <input className="al-input" type={showPw ? "text" : "password"} id="admin-password"
                      value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                      required disabled={loading} autoComplete="current-password" style={{ paddingRight: 50 }}
                      onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}/>
                    <button type="button" onClick={() => setShowPw(p => !p)}
                      style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", transition: "color .2s", zIndex: 2 }}
                      onMouseEnter={e => (e.currentTarget.style.color="#032B45")}
                      onMouseLeave={e => (e.currentTarget.style.color="#94a3b8")}>
                      {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                  </div>
                </div>

                {/* Security notice */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 14, background: "rgba(3,43,69,0.04)", border: "1px solid rgba(3,43,69,0.08)" }}>
                  <Shield size={16} color="#032B45" style={{ flexShrink: 0 }}/>
                  <p style={{ fontSize: 12.5, color: "#032B45", margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                    This is a restricted area. Unauthorized access attempts are logged.
                  </p>
                </div>

                {/* Submit */}
                <button type="submit" className="al-btn" disabled={loading} style={{ marginTop: 4 }}>
                  {loading ? (
                    <>
                      <div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,.35)", borderTopColor: "#fff", borderRadius: "50%", animation: "al-spin .7s linear infinite" }}/>
                      <span>Authenticating…</span>
                    </>
                  ) : (
                    <><Shield size={17}/> <span>Sign In Securely</span></>
                  )}
                </button>
              </form>
            </div>

            {/* Divider + back */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "28px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }}/>
              <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>or</span>
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }}/>
            </div>

            <Link to="/" style={{ display: "block", textAlign: "center", padding: "14px", borderRadius: 14, border: "1.5px solid #e2e8f0", color: "#64748b", fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all .2s", background: "#fff" }}
              onMouseEnter={e => { e.currentTarget.style.background="#f8fafc"; e.currentTarget.style.borderColor="#032B45"; e.currentTarget.style.color="#032B45"; }}
              onMouseLeave={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.borderColor="#e2e8f0"; e.currentTarget.style.color="#64748b"; }}>
              ← Return to Website
            </Link>

            <p style={{ marginTop: 32, textAlign: "center", fontSize: 12, color: "#94a3b8" }}>
              © {new Date().getFullYear()} Cross-borders Outreach International. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
