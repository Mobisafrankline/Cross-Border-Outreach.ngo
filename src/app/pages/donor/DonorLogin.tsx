import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Mail, Lock, Eye, EyeOff, AlertCircle, UserPlus, ArrowLeft, Heart, Globe, TrendingUp, Users } from "lucide-react";
import { signIn } from "../../../lib/supabase";

const HIGHLIGHTS = [
  { icon: Heart,      text: "Track every donation you make" },
  { icon: TrendingUp, text: "See your real-world impact" },
  { icon: Users,      text: "Join 12,400+ compassionate donors" },
  { icon: Globe,      text: "Support programs in 38+ countries" },
];

export default function DonorLogin() {
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [loading, setLoading]       = useState(false);
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        .dl-root { font-family:'Inter',sans-serif; }
        .dl-left {
          background: linear-gradient(145deg,#0f172a 0%,#1e3a5f 45%,#1d4ed8 100%);
          position:relative; overflow:hidden;
        }
        .dl-left::before {
          content:''; position:absolute; inset:0;
          background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='28'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .dl-orb {
          position:absolute; border-radius:50%; filter:blur(70px); opacity:.2;
          animation:dl-float 7s ease-in-out infinite;
        }
        @keyframes dl-float{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        .dl-highlight {
          display:flex; align-items:center; gap:14px;
          padding:14px 18px; border-radius:12px;
          background:rgba(255,255,255,0.07);
          border:1px solid rgba(255,255,255,0.1);
          backdrop-filter:blur(8px);
          transition:background .2s;
        }
        .dl-highlight:hover { background:rgba(255,255,255,0.12); }
        .dl-icon-wrap {
          width:38px; height:38px; border-radius:10px;
          background:rgba(255,255,255,0.12);
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .dl-input {
          width:100%; padding:13px 13px 13px 44px;
          border:1.5px solid #e5e7eb; border-radius:10px;
          font-size:15px; font-family:'Inter',sans-serif;
          outline:none; background:#fafafa; color:#111827;
          transition:border-color .2s, box-shadow .2s;
        }
        .dl-input:focus {
          border-color:#1d4ed8; background:#fff;
          box-shadow:0 0 0 3px rgba(29,78,216,.12);
        }
        .dl-btn {
          width:100%; padding:14px; border:none; cursor:pointer;
          border-radius:12px; font-size:16px; font-weight:700;
          font-family:'Inter',sans-serif;
          background:linear-gradient(135deg,#1d4ed8 0%,#1e40af 100%);
          color:#fff; box-shadow:0 4px 20px rgba(29,78,216,.4);
          display:flex; align-items:center; justify-content:center; gap:8px;
          transition:opacity .2s, transform .15s, box-shadow .2s;
        }
        .dl-btn:hover:not(:disabled){ opacity:.92; transform:translateY(-1px); box-shadow:0 8px 28px rgba(29,78,216,.45); }
        .dl-btn:disabled{ opacity:.6; cursor:not-allowed; }
        .dl-btn-alt {
          width:100%; padding:13px; border:1.5px solid #7c3aed;
          background:transparent; color:#7c3aed; border-radius:12px;
          font-size:15px; font-weight:600; font-family:'Inter',sans-serif;
          cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;
          transition:background .2s;
        }
        .dl-btn-alt:hover{ background:#f5f3ff; }
        @media(max-width:900px){ .dl-left{ display:none!important; } }
        @keyframes dl-spin{ to{transform:rotate(360deg)} }
      `}</style>

      <div className="dl-root" style={{ minHeight:"100vh", display:"flex", background:"#f0f4ff" }}>

        {/* LEFT PANEL */}
        <div className="dl-left" style={{ flex:"0 0 44%", display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"52px 48px", color:"#fff" }}>
          <div className="dl-orb" style={{ width:280, height:280, background:"#3b82f6", top:-80, right:-60 }} />
          <div className="dl-orb" style={{ width:200, height:200, background:"#6366f1", bottom:60, left:-50, animationDelay:"3s" }} />

          {/* Logo */}
          <div style={{ position:"relative", zIndex:2 }}>
            <div style={{ marginBottom:44 }}>
              <img src="/logo.png" alt="Cross-Borders Outreach Ministry" style={{ height:72, objectFit:"contain", filter:"drop-shadow(0 4px 16px rgba(0,0,0,0.3))" }} />
            </div>

            <h2 style={{ fontSize:32, fontWeight:800, lineHeight:1.25, marginBottom:14 }}>
              Welcome back,<br />
              <span style={{ background:"linear-gradient(90deg,#93c5fd,#a5b4fc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                generous donor.
              </span>
            </h2>
            <p style={{ opacity:.75, fontSize:15, lineHeight:1.65, marginBottom:40 }}>
              Sign in to your Donor Portal to track donations, view your impact reports, and manage your giving profile.
            </p>

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                <div className="dl-highlight" key={text}>
                  <div className="dl-icon-wrap">
                    <Icon size={18} color="#93c5fd" />
                  </div>
                  <span style={{ fontSize:14, opacity:.9 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position:"relative", zIndex:2, display:"flex", alignItems:"center", gap:8, opacity:.6, fontSize:13 }}>
            <Globe size={14} />
            <span>Transforming lives across 38+ nations</span>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px", overflowY:"auto", background:"#fff" }}>
          <div style={{ width:"100%", maxWidth:460 }}>

            {/* top nav */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:40 }}>
              <Link to="/" style={{ display:"flex", alignItems:"center", gap:6, color:"#6b7280", fontSize:14, textDecoration:"none" }}>
                <ArrowLeft size={15}/> Back to site
              </Link>
              <span style={{ fontSize:13, color:"#9ca3af" }}>
                New here?{" "}
                <Link to="/donor/register" style={{ color:"#7c3aed", fontWeight:600, textDecoration:"none" }}>Create account</Link>
              </span>
            </div>

            {/* heading */}
            <div style={{ marginBottom:32 }}>
              <h1 style={{ fontSize:28, fontWeight:800, color:"#111827", margin:0 }}>Sign in to your account</h1>
              <p style={{ color:"#6b7280", marginTop:8, fontSize:15 }}>Enter your credentials to access your donor dashboard.</p>
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
                  Email Address
                </label>
                <div style={{ position:"relative" }}>
                  <Mail size={17} color="#9ca3af" style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)" }}/>
                  <input className="dl-input" type="email" id="donor-email" value={email}
                    onChange={e => setEmail(e.target.value)} placeholder="your.email@example.com"
                    required disabled={loading} autoComplete="email" />
                </div>
              </div>

              {/* password */}
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
                  <label style={{ fontSize:13, fontWeight:600, color:"#374151" }}>Password</label>
                  <a href="#" style={{ fontSize:13, color:"#1d4ed8", fontWeight:500, textDecoration:"none" }}>Forgot password?</a>
                </div>
                <div style={{ position:"relative" }}>
                  <Lock size={17} color="#9ca3af" style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)" }}/>
                  <input className="dl-input" type={showPw ? "text" : "password"} id="donor-password"
                    value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                    required disabled={loading} autoComplete="current-password" style={{ paddingRight:44 }} />
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#6b7280" }}>
                    {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
              </div>

              {/* submit */}
              <button type="submit" className="dl-btn" disabled={loading} style={{ marginTop:4 }}>
                {loading ? (
                  <>
                    <div style={{ width:18, height:18, border:"2.5px solid rgba(255,255,255,.35)", borderTopColor:"#fff", borderRadius:"50%", animation:"dl-spin .7s linear infinite" }}/>
                    Signing in…
                  </>
                ) : "Sign In"}
              </button>
            </form>

            {/* divider */}
            <div style={{ display:"flex", alignItems:"center", gap:14, margin:"24px 0" }}>
              <div style={{ flex:1, height:1, background:"#e5e7eb" }}/>
              <span style={{ fontSize:13, color:"#9ca3af" }}>Don't have an account?</span>
              <div style={{ flex:1, height:1, background:"#e5e7eb" }}/>
            </div>

            <Link to="/donor/register" style={{ textDecoration:"none" }}>
              <button className="dl-btn-alt">
                <UserPlus size={17}/> Create a Free Account
              </button>
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
