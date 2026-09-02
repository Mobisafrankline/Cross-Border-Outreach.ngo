import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Mail, Lock, Eye, EyeOff, AlertCircle, UserPlus, ArrowLeft, Heart, Globe, TrendingUp, Users, LogIn } from "lucide-react";
import { signIn } from "../../../lib/supabase";

const HIGHLIGHTS = [
  { icon: Heart,      text: "Track every donation you make",     stat: "100%" },
  { icon: TrendingUp, text: "See your real-world impact",        stat: "Live" },
  { icon: Users,      text: "Join 12,400+ compassionate donors", stat: "12.4K" },
  { icon: Globe,      text: "Support programs in 38+ countries", stat: "38+" },
];

export default function DonorLogin() {
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [loading, setLoading]       = useState(false);
  const [focused, setFocused]       = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) { setError(error.message); setLoading(false); return; }
    navigate("/donor/dashboard");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
        .dl-root { font-family:'Inter',sans-serif; }

        /* ─── Left Panel ─── */
        .dl-left {
          background: linear-gradient(155deg, #021a2e 0%, #032B45 35%, #053D61 70%, #032B45 100%);
          position: relative; overflow: hidden;
        }
        .dl-mesh {
          position: absolute; inset: 0; opacity: .14;
          background:
            radial-gradient(ellipse 70% 50% at 25% 75%, #F5B800, transparent),
            radial-gradient(ellipse 50% 40% at 75% 25%, #F5B800, transparent),
            radial-gradient(ellipse 60% 60% at 50% 50%, #053D61, transparent);
          filter: blur(50px);
          animation: dl-mesh-shift 14s ease-in-out infinite alternate;
        }
        @keyframes dl-mesh-shift {
          0%   { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.12) translate(3%, -4%); }
        }
        .dl-pattern {
          position: absolute; inset: 0;
          background-image:
            radial-gradient(circle at 20% 40%, rgba(255,255,255,0.02) 1px, transparent 1px),
            radial-gradient(circle at 80% 60%, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        .dl-orb {
          position: absolute; border-radius: 50%; filter: blur(80px);
          animation: dl-float 8s ease-in-out infinite;
        }
        @keyframes dl-float { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-22px) scale(1.06)} }

        /* Floating gold particles */
        .dl-particle {
          position: absolute; border-radius: 50%; background: #F5B800;
          animation: dl-particle-rise linear infinite;
          opacity: 0;
        }
        @keyframes dl-particle-rise {
          0%   { opacity: 0; transform: translateY(0) scale(0.5); }
          15%  { opacity: 0.6; }
          85%  { opacity: 0.2; }
          100% { opacity: 0; transform: translateY(-350px) scale(0); }
        }

        .dl-highlight {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 18px; border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(8px);
          transition: all .3s cubic-bezier(.4,0,.2,1);
        }
        .dl-highlight:hover {
          background: rgba(245,184,0,0.06);
          border-color: rgba(245,184,0,0.15);
          transform: translateX(5px);
        }
        .dl-icon-wrap {
          width: 42px; height: 42px; border-radius: 12px;
          background: linear-gradient(135deg, rgba(245,184,0,0.14), rgba(9,89,214,0.1));
          border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          transition: all .3s;
        }
        .dl-highlight:hover .dl-icon-wrap {
          background: linear-gradient(135deg, rgba(245,184,0,0.25), rgba(9,89,214,0.15));
          box-shadow: 0 0 16px rgba(245,184,0,0.12);
        }
        .dl-stat-chip {
          font-size: 11px; font-weight: 800; color: #F5B800;
          padding: 3px 10px; border-radius: 8px;
          background: rgba(245,184,0,0.08);
          border: 1px solid rgba(245,184,0,0.15);
          flex-shrink: 0; letter-spacing: 0.5px;
        }

        .dl-impact-bar {
          display: flex; align-items: center; gap: 16px;
          padding: 16px 20px; border-radius: 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(8px);
          margin-top: 32px;
        }
        .dl-impact-num {
          font-size: 28px; font-weight: 800;
          background: linear-gradient(135deg, #F5B800, #FFD13B);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          line-height: 1;
        }

        /* ─── Right Panel ─── */
        .dl-right {
          background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
          position: relative; overflow: hidden;
        }
        .dl-right::before {
          content: ''; position: absolute; bottom: -180px; left: -180px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(9,89,214,0.03), transparent 70%);
          pointer-events: none;
        }

        .dl-form-card {
          background: #fff;
          border-radius: 24px;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow:
            0 1px 3px rgba(0,0,0,0.03),
            0 8px 32px rgba(3,43,69,0.06),
            0 24px 60px rgba(3,43,69,0.03);
          padding: 40px 36px;
          position: relative;
          overflow: hidden;
        }
        .dl-form-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, #F5B800, #F5B800, #032B45);
        }

        .dl-input-group { position: relative; }
        .dl-input-group.focused .dl-input-icon { color: #F5B800; }
        .dl-input-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; transition: color .25s;
          pointer-events: none;
        }
        .dl-input {
          width: 100%; padding: 16px 16px 16px 50px;
          border: 2px solid #e8ecf1; border-radius: 14px;
          font-size: 15px; font-family: 'Inter', sans-serif;
          outline: none; background: #fafbfc; color: #111827;
          transition: all .25s cubic-bezier(.4,0,.2,1);
        }
        .dl-input:focus {
          border-color: #F5B800; background: #fff;
          box-shadow: 0 0 0 4px rgba(9,89,214,0.08), 0 2px 8px rgba(9,89,214,0.05);
        }
        .dl-input::placeholder { color: #b0b8c4; }

        .dl-btn {
          width: 100%; padding: 16px; border: none; cursor: pointer;
          border-radius: 14px; font-size: 16px; font-weight: 700;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #032B45 0%, #053D61 100%);
          color: #fff;
          box-shadow: 0 4px 16px rgba(3,43,69,0.35);
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all .3s cubic-bezier(.4,0,.2,1);
          position: relative; overflow: hidden;
        }
        .dl-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, #F5B800, #032B45);
          opacity: 0; transition: opacity .3s;
        }
        .dl-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(3,43,69,0.4);
        }
        .dl-btn:hover:not(:disabled)::before { opacity: 1; }
        .dl-btn > * { position: relative; z-index: 1; }
        .dl-btn:disabled { opacity: .6; cursor: not-allowed; }

        .dl-btn-alt {
          width: 100%; padding: 14px; border: 2px solid #e2e8f0;
          background: #fff; color: #032B45; border-radius: 14px;
          font-size: 15px; font-weight: 600; font-family: 'Inter', sans-serif;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all .25s;
        }
        .dl-btn-alt:hover { border-color: #F5B800; background: #fffdf5; color: #032B45; box-shadow: 0 4px 16px rgba(245,184,0,0.1); }
        @media(max-width:900px) { .dl-left { display: none!important; } }
        @keyframes dl-spin { to{transform:rotate(360deg)} }
      `}</style>

      <div className="dl-root" style={{ minHeight: "100vh", display: "flex" }}>

        {/* ═══ LEFT PANEL ═══ */}
        <div className="dl-left" style={{ flex: "0 0 46%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px 48px", color: "#fff" }}>
          <div className="dl-mesh" />
          <div className="dl-pattern" />
          <div className="dl-orb" style={{ width: 320, height: 320, background: "rgba(9,89,214,0.12)", top: -100, right: -80 }} />
          <div className="dl-orb" style={{ width: 220, height: 220, background: "rgba(245,184,0,0.1)", bottom: 60, left: -60, animationDelay: "3s" }} />

          {/* Gold particles */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="dl-particle"
              style={{
                width: 2.5 + Math.random() * 3, height: 2.5 + Math.random() * 3,
                left: `${15 + Math.random() * 70}%`, bottom: `${Math.random() * 15}%`,
                animationDuration: `${6 + Math.random() * 6}s`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            />
          ))}

          {/* Content */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ marginBottom: 48 }}>
              <img src="/logo.png" alt="Cross-borders Outreach International" style={{ height: 72, objectFit: "contain", filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.5))" }} />
            </div>

            <h2 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.15, marginBottom: 16, fontFamily: "'Playfair Display', Georgia, serif" }}>
              Welcome back,<br />
              <span style={{ background: "linear-gradient(90deg, #F5B800, #FFD13B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                generous donor.
              </span>
            </h2>
            <p style={{ opacity: .65, fontSize: 14, lineHeight: 1.75, marginBottom: 36, maxWidth: 380, letterSpacing: "0.01em" }}>
              Sign in to your Donor Portal to track donations, view your impact reports, and manage your giving profile.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {HIGHLIGHTS.map(({ icon: Icon, text, stat }) => (
                <div className="dl-highlight" key={text}>
                  <div className="dl-icon-wrap">
                    <Icon size={18} color="#F5B800" />
                  </div>
                  <span style={{ fontSize: 14, opacity: .85, flex: 1 }}>{text}</span>
                  <span className="dl-stat-chip">{stat}</span>
                </div>
              ))}
            </div>

            <div className="dl-impact-bar">
              <div className="dl-impact-num">$2.1M</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, opacity: .85 }}>Total Impact</div>
                <div style={{ fontSize: 11, opacity: .5, marginTop: 2 }}>Donations processed to date</div>
              </div>
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 8, opacity: .45, fontSize: 12 }}>
            <Globe size={14} />
            <span>Transforming lives across 38+ nations</span>
          </div>
        </div>

        {/* ═══ RIGHT PANEL ═══ */}
        <div className="dl-right" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", overflowY: "auto" }}>
          <div style={{ width: "100%", maxWidth: 460 }}>

            {/* Top nav */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
              <Link to="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>
                <ArrowLeft size={15}/> Back to site
              </Link>
              <span style={{ fontSize: 13, color: "#9ca3af" }}>
                New here?{" "}
                <Link to="/donor/register" style={{ color: "#F5B800", fontWeight: 700, textDecoration: "none" }}>Create account</Link>
              </span>
            </div>

            {/* Form Card */}
            <div className="dl-form-card">
              {/* Heading */}
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 20, margin: "0 auto 20px",
                  background: "linear-gradient(135deg, #032B45, #053D61)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 8px 32px rgba(3,43,69,0.3), 0 0 0 4px rgba(3,43,69,0.06)",
                }}>
                  <Heart size={28} color="#F5B800" style={{ fill: "#F5B800" }}/>
                </div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "#032B45", margin: 0, fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Donor Sign In
                </h1>
                <p style={{ color: "#64748b", marginTop: 8, fontSize: 14, lineHeight: 1.6 }}>
                  Access your donation history and impact reports.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div style={{ display: "flex", gap: 12, padding: "14px 16px", borderRadius: 14, background: "#fef2f2", border: "1px solid #fecaca", marginBottom: 22 }}>
                  <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }}/>
                  <p style={{ fontSize: 14, color: "#b91c1c", margin: 0, fontWeight: 500 }}>{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Email */}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                    Email Address
                  </label>
                  <div className={`dl-input-group ${focused === "email" ? "focused" : ""}`}>
                    <Mail size={17} className="dl-input-icon"/>
                    <input className="dl-input" type="email" id="donor-email" value={email}
                      onChange={e => setEmail(e.target.value)} placeholder="your.email@example.com"
                      required disabled={loading} autoComplete="email"
                      onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Password</label>
                    <a href="#" style={{ fontSize: 13, color: "#F5B800", fontWeight: 500, textDecoration: "none" }}>Forgot password?</a>
                  </div>
                  <div className={`dl-input-group ${focused === "password" ? "focused" : ""}`}>
                    <Lock size={17} className="dl-input-icon"/>
                    <input className="dl-input" type={showPw ? "text" : "password"} id="donor-password"
                      value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                      required disabled={loading} autoComplete="current-password" style={{ paddingRight: 50 }}
                      onFocus={() => setFocused("password")} onBlur={() => setFocused(null)} />
                    <button type="button" onClick={() => setShowPw(p => !p)}
                      style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b7280", zIndex: 2 }}>
                      {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" className="dl-btn" disabled={loading} style={{ marginTop: 4 }}>
                  {loading ? (
                    <>
                      <div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,.35)", borderTopColor: "#fff", borderRadius: "50%", animation: "dl-spin .7s linear infinite" }}/>
                      <span>Signing in…</span>
                    </>
                  ) : (
                    <><LogIn size={17}/> <span>Sign In</span></>
                  )}
                </button>
              </form>
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "24px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#e5e7eb" }}/>
              <span style={{ fontSize: 13, color: "#9ca3af", fontWeight: 500 }}>Don't have an account?</span>
              <div style={{ flex: 1, height: 1, background: "#e5e7eb" }}/>
            </div>

            <Link to="/donor/register" style={{ textDecoration: "none" }}>
              <button className="dl-btn-alt">
                <UserPlus size={17}/> Create a Free Account
              </button>
            </Link>

            <p style={{ marginTop: 28, textAlign: "center", fontSize: 12, color: "#94a3b8" }}>
              © {new Date().getFullYear()} Cross-borders Outreach International. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
