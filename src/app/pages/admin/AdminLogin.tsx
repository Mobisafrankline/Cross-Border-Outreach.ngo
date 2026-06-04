import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Shield, ArrowLeft, Globe, Activity, Database, Users } from "lucide-react";
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        .al-root{ font-family:'Inter',sans-serif; }
        .al-left{
          background:linear-gradient(160deg,#0a0a1a 0%,#0d1b38 30%,#132b5e 70%,#1a3a6b 100%);
          position:relative; overflow:hidden;
        }
        .al-orb{
          position:absolute; border-radius:50%; filter:blur(80px); opacity:.15;
          animation:al-float 10s ease-in-out infinite;
        }
        .al-orb-3{
          position:absolute; border-radius:50%; filter:blur(60px); opacity:.08;
          animation:al-float 12s ease-in-out infinite reverse;
        }
        @keyframes al-float{ 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-25px) scale(1.05)} }
        @keyframes al-grid-fade {
          0%,100% { opacity:0.03; }
          50% { opacity:0.06; }
        }
        .al-grid-bg {
          position:absolute; inset:0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: al-grid-fade 8s ease-in-out infinite;
        }
        .al-feat{
          display:flex; align-items:center; gap:14px;
          padding:14px 18px; border-radius:14px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.06);
          backdrop-filter:blur(12px);
          transition:all .25s ease;
        }
        .al-feat:hover{ background:rgba(255,255,255,0.09); transform:translateX(4px); }
        .al-feat-icon{
          width:40px; height:40px; border-radius:12px;
          background:linear-gradient(135deg,rgba(59,130,246,0.15),rgba(139,92,246,0.15));
          border:1px solid rgba(255,255,255,0.08);
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .al-badge{
          display:inline-flex; align-items:center; gap:6px;
          padding:6px 14px; border-radius:999px;
          background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.2);
          color:#fca5a5; font-size:11px; font-weight:700; letter-spacing:0.5px;
          text-transform:uppercase;
        }
        .al-status-dot {
          width:6px; height:6px; border-radius:50%; background:#22c55e;
          animation: al-pulse 2s ease-in-out infinite;
        }
        @keyframes al-pulse { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
        .al-input{
          width:100%; padding:14px 14px 14px 46px;
          border:1.5px solid #e2e8f0; border-radius:12px;
          font-size:15px; font-family:'Inter',sans-serif;
          outline:none; background:#f8fafc; color:#111827;
          transition:border-color .2s, box-shadow .2s, background .2s;
        }
        .al-input:focus{
          border-color:#3b82f6; background:#fff;
          box-shadow:0 0 0 4px rgba(59,130,246,.1);
        }
        .al-input::placeholder { color: #94a3b8; }
        .al-btn{
          width:100%; padding:15px; border:none; cursor:pointer;
          border-radius:14px; font-size:16px; font-weight:700;
          font-family:'Inter',sans-serif;
          background:linear-gradient(135deg,#1e3a8a 0%,#2563eb 50%,#1e40af 100%);
          background-size:200% 200%;
          color:#fff; box-shadow:0 4px 20px rgba(37,99,235,.4);
          display:flex; align-items:center; justify-content:center; gap:8px;
          transition:all .3s ease;
        }
        .al-btn:hover:not(:disabled){ 
          transform:translateY(-2px); 
          box-shadow:0 8px 32px rgba(37,99,235,.5);
          background-position:right center;
        }
        .al-btn:active:not(:disabled){ transform:translateY(0); }
        .al-btn:disabled{ opacity:.6; cursor:not-allowed; }
        @media(max-width:900px){ .al-left{ display:none!important; } }
        @keyframes al-spin{ to{transform:rotate(360deg)} }
      `}</style>

      <div className="al-root" style={{ minHeight:"100vh", display:"flex", background:"#f8fafc" }}>

        {/* LEFT PANEL */}
        <div className="al-left" style={{ flex:"0 0 44%", display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"52px 48px", color:"#fff" }}>
          <div className="al-grid-bg" />
          <div className="al-orb" style={{ width:320, height:320, background:"#3b82f6", top:-100, right:-80 }}/>
          <div className="al-orb" style={{ width:240, height:240, background:"#8b5cf6", bottom:60, left:-60, animationDelay:"4s" }}/>
          <div className="al-orb-3" style={{ width:200, height:200, background:"#06b6d4", top:"40%", left:"30%", animationDelay:"2s" }}/>

          {/* Logo + label */}
          <div style={{ position:"relative", zIndex:2 }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:48 }}>
              <img src="/logo.png" alt="Cross-borders Outreach International" style={{ height:72, objectFit:"contain", filter:"drop-shadow(0 4px 20px rgba(0,0,0,0.4))" }}/>
              <div className="al-badge">
                <div className="al-status-dot" />
                Admin Access
              </div>
            </div>

            <h2 style={{ fontSize:32, fontWeight:800, lineHeight:1.2, marginBottom:16, fontFamily:"'Playfair Display', Georgia, serif" }}>
              Administration<br/>
              <span style={{ background:"linear-gradient(90deg,#60a5fa,#a78bfa,#60a5fa)", backgroundSize:"200% 200%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                Command Center
              </span>
            </h2>
            <p style={{ opacity:.65, fontSize:14, lineHeight:1.7, marginBottom:40, maxWidth:360 }}>
              Restricted access portal. Authorized administrators only. All login attempts are logged and monitored.
            </p>

            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {ADMIN_FEATURES.map(({ icon: Icon, text }) => (
                <div className="al-feat" key={text}>
                  <div className="al-feat-icon">
                    <Icon size={18} color="#93c5fd"/>
                  </div>
                  <span style={{ fontSize:14, opacity:.85, fontWeight:500 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* footer */}
          <div style={{ position:"relative", zIndex:2, display:"flex", alignItems:"center", gap:10, opacity:.45, fontSize:12 }}>
            <Shield size={13}/>
            <span>256-bit encrypted · Supabase Auth · Admin-only access</span>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px", overflowY:"auto", background:"#fff" }}>
          <div style={{ width:"100%", maxWidth:440 }}>

            {/* top nav */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:44 }}>
              <Link to="/" style={{ display:"flex", alignItems:"center", gap:6, color:"#64748b", fontSize:14, textDecoration:"none", fontWeight:500 }}>
                <ArrowLeft size={15}/> Back to site
              </Link>
              <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#64748b" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:"#22c55e" }} />
                <span style={{ fontWeight:600, color:"#1e40af" }}>Admin Portal</span>
              </div>
            </div>

            {/* heading */}
            <div style={{ marginBottom:36 }}>
              <div style={{ width:56, height:56, borderRadius:16, background:"linear-gradient(135deg,#1e3a8a,#2563eb)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20, boxShadow:"0 8px 24px rgba(37,99,235,.3)" }}>
                <Shield size={28} color="#fff"/>
              </div>
              <h1 style={{ fontSize:28, fontWeight:800, color:"#0f172a", margin:0, fontFamily:"'Playfair Display', Georgia, serif" }}>Admin Sign In</h1>
              <p style={{ color:"#64748b", marginTop:10, fontSize:15, lineHeight:1.6 }}>
                Authorized personnel only. Your activity is monitored.
              </p>
            </div>

            {/* error */}
            {error && (
              <div style={{ display:"flex", gap:12, padding:"14px 16px", borderRadius:12, background:"#fef2f2", border:"1px solid #fecaca", marginBottom:24 }}>
                <AlertCircle size={18} color="#ef4444" style={{ flexShrink:0, marginTop:2 }}/>
                <p style={{ fontSize:14, color:"#b91c1c", margin:0, fontWeight:500 }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:22 }}>
              {/* email */}
              <div>
                <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#334155", marginBottom:8, letterSpacing:"0.3px" }}>
                  Admin Email
                </label>
                <div style={{ position:"relative" }}>
                  <Mail size={17} color="#94a3b8" style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)" }}/>
                  <input className="al-input" type="email" id="admin-email" value={email}
                    onChange={e => setEmail(e.target.value)} placeholder="admin@cross-borders.org"
                    required disabled={loading} autoComplete="email"/>
                </div>
              </div>

              {/* password */}
              <div>
                <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#334155", marginBottom:8, letterSpacing:"0.3px" }}>
                  Password
                </label>
                <div style={{ position:"relative" }}>
                  <Lock size={17} color="#94a3b8" style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)" }}/>
                  <input className="al-input" type={showPw ? "text" : "password"} id="admin-password"
                    value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                    required disabled={loading} autoComplete="current-password" style={{ paddingRight:46 }}/>
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#94a3b8", transition:"color .2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color="#475569")}
                    onMouseLeave={e => (e.currentTarget.style.color="#94a3b8")}>
                    {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
              </div>

              {/* security notice */}
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", borderRadius:12, background:"#eff6ff", border:"1px solid #bfdbfe" }}>
                <Shield size={15} color="#2563eb" style={{ flexShrink:0 }}/>
                <p style={{ fontSize:12.5, color:"#1e40af", margin:0, lineHeight:1.5, fontWeight:500 }}>
                  This is a restricted area. Unauthorized access attempts are logged.
                </p>
              </div>

              {/* submit */}
              <button type="submit" className="al-btn" disabled={loading} style={{ marginTop:4 }}>
                {loading ? (
                  <>
                    <div style={{ width:18, height:18, border:"2.5px solid rgba(255,255,255,.35)", borderTopColor:"#fff", borderRadius:"50%", animation:"al-spin .7s linear infinite" }}/>
                    Authenticating…
                  </>
                ) : (
                  <><Shield size={17}/> Sign In Securely</>
                )}
              </button>
            </form>

            {/* divider */}
            <div style={{ display:"flex", alignItems:"center", gap:14, margin:"28px 0" }}>
              <div style={{ flex:1, height:1, background:"#e2e8f0" }}/>
              <span style={{ fontSize:13, color:"#94a3b8", fontWeight:500 }}>or</span>
              <div style={{ flex:1, height:1, background:"#e2e8f0" }}/>
            </div>

            <Link to="/" style={{ display:"block", textAlign:"center", padding:"13px", borderRadius:14, border:"1.5px solid #e2e8f0", color:"#64748b", fontSize:14, fontWeight:600, textDecoration:"none", transition:"all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.background="#f8fafc"; e.currentTarget.style.borderColor="#cbd5e1"; }}
              onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="#e2e8f0"; }}>
              ← Return to Website
            </Link>

            <p style={{ marginTop:32, textAlign:"center", fontSize:12, color:"#94a3b8" }}>
              © {new Date().getFullYear()} Cross-borders Outreach International. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
