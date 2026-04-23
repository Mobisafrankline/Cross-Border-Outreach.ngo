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
          background:linear-gradient(145deg,#0a0a1a 0%,#0f1f3d 40%,#1a3a6b 80%,#1e4080 100%);
          position:relative; overflow:hidden;
        }
        .al-orb{
          position:absolute; border-radius:50%; filter:blur(70px); opacity:.18;
          animation:al-float 8s ease-in-out infinite;
        }
        @keyframes al-float{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-22px)} }
        .al-feat{
          display:flex; align-items:center; gap:14px;
          padding:14px 18px; border-radius:12px;
          background:rgba(255,255,255,0.06);
          border:1px solid rgba(255,255,255,0.09);
          backdrop-filter:blur(10px);
          transition:background .2s;
        }
        .al-feat:hover{ background:rgba(255,255,255,0.11); }
        .al-feat-icon{
          width:38px; height:38px; border-radius:10px;
          background:rgba(255,255,255,0.1);
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .al-badge{
          display:inline-flex; align-items:center; gap:6px;
          padding:5px 12px; border-radius:999px;
          background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.3);
          color:#fca5a5; font-size:12px; font-weight:600;
        }
        .al-input{
          width:100%; padding:13px 13px 13px 44px;
          border:1.5px solid #e5e7eb; border-radius:10px;
          font-size:15px; font-family:'Inter',sans-serif;
          outline:none; background:#fafafa; color:#111827;
          transition:border-color .2s, box-shadow .2s;
        }
        .al-input:focus{
          border-color:#1e40af; background:#fff;
          box-shadow:0 0 0 3px rgba(30,64,175,.12);
        }
        .al-btn{
          width:100%; padding:14px; border:none; cursor:pointer;
          border-radius:12px; font-size:16px; font-weight:700;
          font-family:'Inter',sans-serif;
          background:linear-gradient(135deg,#1e3a8a 0%,#1e40af 100%);
          color:#fff; box-shadow:0 4px 20px rgba(30,58,138,.5);
          display:flex; align-items:center; justify-content:center; gap:8px;
          transition:opacity .2s, transform .15s, box-shadow .2s;
        }
        .al-btn:hover:not(:disabled){ opacity:.91; transform:translateY(-1px); box-shadow:0 8px 28px rgba(30,58,138,.55); }
        .al-btn:disabled{ opacity:.6; cursor:not-allowed; }
        @media(max-width:900px){ .al-left{ display:none!important; } }
        @keyframes al-spin{ to{transform:rotate(360deg)} }
      `}</style>

      <div className="al-root" style={{ minHeight:"100vh", display:"flex", background:"#f0f2f8" }}>

        {/* LEFT PANEL */}
        <div className="al-left" style={{ flex:"0 0 44%", display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"52px 48px", color:"#fff" }}>
          <div className="al-orb" style={{ width:300, height:300, background:"#3b82f6", top:-80, right:-70 }}/>
          <div className="al-orb" style={{ width:220, height:220, background:"#8b5cf6", bottom:40, left:-50, animationDelay:"3.5s" }}/>

          {/* Logo + label */}
          <div style={{ position:"relative", zIndex:2 }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:44 }}>
              <img src="/logo.png" alt="Cross-Borders Outreach Ministry" style={{ height:68, objectFit:"contain", filter:"drop-shadow(0 4px 16px rgba(0,0,0,0.4))" }}/>
              <div className="al-badge">
                <Shield size={11}/> Admin
              </div>
            </div>

            <h2 style={{ fontSize:30, fontWeight:800, lineHeight:1.25, marginBottom:14 }}>
              Administration<br/>
              <span style={{ background:"linear-gradient(90deg,#60a5fa,#818cf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                Command Center
              </span>
            </h2>
            <p style={{ opacity:.72, fontSize:14.5, lineHeight:1.65, marginBottom:38 }}>
              Restricted access. Authorized administrators only. All login attempts are logged and monitored.
            </p>

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {ADMIN_FEATURES.map(({ icon: Icon, text }) => (
                <div className="al-feat" key={text}>
                  <div className="al-feat-icon">
                    <Icon size={17} color="#93c5fd"/>
                  </div>
                  <span style={{ fontSize:14, opacity:.88 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* footer */}
          <div style={{ position:"relative", zIndex:2, display:"flex", alignItems:"center", gap:8, opacity:.55, fontSize:12.5 }}>
            <Shield size={13}/>
            <span>256-bit encrypted · Supabase Auth · Admin-only access</span>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px", overflowY:"auto", background:"#fff" }}>
          <div style={{ width:"100%", maxWidth:440 }}>

            {/* top nav */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:40 }}>
              <Link to="/" style={{ display:"flex", alignItems:"center", gap:6, color:"#6b7280", fontSize:14, textDecoration:"none" }}>
                <ArrowLeft size={15}/> Back to site
              </Link>
              <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#6b7280" }}>
                <Shield size={14} color="#1e40af"/>
                <span style={{ fontWeight:500, color:"#1e40af" }}>Admin Portal</span>
              </div>
            </div>

            {/* heading */}
            <div style={{ marginBottom:32 }}>
              <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#1e3a8a,#1d4ed8)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18, boxShadow:"0 6px 20px rgba(30,58,138,.35)" }}>
                <Shield size={26} color="#fff"/>
              </div>
              <h1 style={{ fontSize:26, fontWeight:800, color:"#111827", margin:0 }}>Admin Sign In</h1>
              <p style={{ color:"#6b7280", marginTop:8, fontSize:14.5 }}>
                Authorized personnel only. Your activity is monitored.
              </p>
            </div>

            {/* error */}
            {error && (
              <div style={{ display:"flex", gap:12, padding:"14px 16px", borderRadius:10, background:"#fef2f2", border:"1px solid #fecaca", marginBottom:22 }}>
                <AlertCircle size={18} color="#ef4444" style={{ flexShrink:0, marginTop:2 }}/>
                <p style={{ fontSize:14, color:"#b91c1c", margin:0 }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:20 }}>
              {/* email */}
              <div>
                <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#374151", marginBottom:7 }}>
                  Admin Email
                </label>
                <div style={{ position:"relative" }}>
                  <Mail size={17} color="#9ca3af" style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)" }}/>
                  <input className="al-input" type="email" id="admin-email" value={email}
                    onChange={e => setEmail(e.target.value)} placeholder="admin@cross-borders.org"
                    required disabled={loading} autoComplete="email"/>
                </div>
              </div>

              {/* password */}
              <div>
                <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#374151", marginBottom:7 }}>
                  Password
                </label>
                <div style={{ position:"relative" }}>
                  <Lock size={17} color="#9ca3af" style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)" }}/>
                  <input className="al-input" type={showPw ? "text" : "password"} id="admin-password"
                    value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                    required disabled={loading} autoComplete="current-password" style={{ paddingRight:44 }}/>
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#6b7280" }}>
                    {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
              </div>

              {/* security notice */}
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", borderRadius:10, background:"#eff6ff", border:"1px solid #bfdbfe" }}>
                <Shield size={15} color="#1d4ed8" style={{ flexShrink:0 }}/>
                <p style={{ fontSize:12.5, color:"#1e40af", margin:0, lineHeight:1.5 }}>
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
            <div style={{ display:"flex", alignItems:"center", gap:14, margin:"24px 0" }}>
              <div style={{ flex:1, height:1, background:"#e5e7eb" }}/>
              <span style={{ fontSize:13, color:"#9ca3af" }}>or</span>
              <div style={{ flex:1, height:1, background:"#e5e7eb" }}/>
            </div>

            <Link to="/" style={{ display:"block", textAlign:"center", padding:"12px", borderRadius:12, border:"1.5px solid #e5e7eb", color:"#6b7280", fontSize:14, fontWeight:500, textDecoration:"none", transition:"background .2s" }}
              onMouseEnter={e => (e.currentTarget.style.background="#f9fafb")}
              onMouseLeave={e => (e.currentTarget.style.background="transparent")}>
              ← Return to Website
            </Link>

            <p style={{ marginTop:28, textAlign:"center", fontSize:12, color:"#9ca3af" }}>
              © {new Date().getFullYear()} Cross-Borders Outreach Ministry Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
