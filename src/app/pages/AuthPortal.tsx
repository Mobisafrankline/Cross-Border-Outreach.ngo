import { useState, useMemo, useEffect, useRef, Fragment } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import {
  Heart, Mail, Lock, User, Phone, MapPin,
  AlertCircle, CheckCircle, Eye, EyeOff,
  Globe, Shield, ArrowRight, ArrowLeft, Sparkles, KeyRound,
  TrendingUp, Users, Database, Activity, Fingerprint
} from "lucide-react";
import { signIn, signUp, createDonor, registerAdmin, supabase } from "../../lib/supabase";
import "../../styles/portal.css";

/* ─── Helpers ────────────────────────────────────────────────── */
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

/* ─── Count-up hook ──────────────────────────────────────────── */
function useCountUp(target: number, duration = 1400, decimals = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = (target / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString();
}

/* ─── Static content ─────────────────────────────────────────── */
const ADMIN_FEATURES = [
  { icon: Users,    text: "Manage donor accounts & records" },
  { icon: Activity, text: "Monitor donations in real time"  },
  { icon: Database, text: "Access full content management"  },
  { icon: Globe,    text: "Oversee cross-border programs"   },
];

type PortalType = "donor" | "admin";
type AuthMode   = "login" | "register" | "forgot";

/* ─── Spinner ────────────────────────────────────────────────── */
const Spinner = () => (
  <div style={{ width:18, height:18, border:"2.5px solid rgba(255,255,255,.35)", borderTopColor:"#fff", borderRadius:"50%", animation:"portal-spin .7s linear infinite" }} />
);

export default function AuthPortal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialType = (searchParams.get("type") === "admin" ? "admin" : "donor") as PortalType;
  const initialMode = (searchParams.get("mode") === "register" ? "register" : "login") as AuthMode;

  const [portalType, setPortalType] = useState<PortalType>(initialType);
  const [authMode,   setAuthMode]   = useState<AuthMode>(initialMode);
  const [regStep,    setRegStep]    = useState(1);

  /* Form fields */
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [firstName,       setFirstName]       = useState("");
  const [lastName,        setLastName]        = useState("");
  const [phone,           setPhone]           = useState("");
  const [address,         setAddress]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminCode,       setAdminCode]       = useState("");
  const [donorCode,       setDonorCode]       = useState("");
  const [rememberMe,      setRememberMe]      = useState(false);
  const [focused,         setFocused]         = useState<string | null>(null);

  /* UI state */
  const [showPw,  setShowPw]  = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [agreed,  setAgreed]  = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const pwStrength = useMemo(() => getStrength(password), [password]);

  /* Animated donor stats */
  const donors    = useCountUp(12400);
  const countries = useCountUp(38);
  const donated   = useCountUp(2.1, 1400, 1);

  /* Sync URL */
  useEffect(() => {
    const params = new URLSearchParams();
    if (portalType === "admin") params.set("type", "admin");
    if (authMode   === "register") params.set("mode", "register");
    setSearchParams(params, { replace: true });
    setError(null);
    setSuccess(false);
    setForgotSent(false);
  }, [portalType, authMode, setSearchParams]);

  /* Validation */
  const step1Valid = firstName.trim() && lastName.trim() && email.includes("@");
  const step2Valid = password.length >= 6 && confirmPassword === password && agreed;

  /* ── Handlers ────────────────────────────────────────────── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error } = await signIn(email, password);
    if (error) { setError(error.message); setLoading(false); return; }
    if (!data.user) { setError("Authentication failed. Please try again."); setLoading(false); return; }
    navigate(portalType === "admin" ? "/admin/dashboard" : "/donor/dashboard");
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) { setError("Please enter a valid email address."); return; }
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login?mode=reset`,
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setForgotSent(true);
  };

  const handleAdminRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (!firstName.trim() || !lastName.trim()) { setError("Name is required."); return; }
    setLoading(true);
    const { data, error: signUpError } = await signUp(email, password, {
      first_name: firstName, last_name: lastName, phone: phone || null, address: address || null,
    });
    if (signUpError) { setError(signUpError.message); setLoading(false); return; }
    if (data.user) {
      if (!data.session) { setLoading(false); setSuccess(true); return; }
      const { error: adminError } = await registerAdmin(adminCode, firstName, lastName, phone, address);
      if (adminError) {
        setError("Account created but admin verification failed: " + adminError.message);
        setLoading(false); return;
      }
    }
    setLoading(false);
    setSuccess(true);
    if (data.session) setTimeout(() => navigate("/admin/dashboard"), 2500);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);

    const { data: codeValid, error: codeError } = await supabase.rpc('verify_donor_code', { p_code: donorCode });
    if (codeError || !codeValid) {
      setError("Invalid Donor Registration Code. Please contact us if you need one.");
      setLoading(false); return;
    }

    const { data, error: signUpError } = await signUp(email, password, {
      first_name: firstName, last_name: lastName, phone: phone || null, address: address || null,
    });
    if (signUpError) { setError(signUpError.message); setLoading(false); return; }
    if (data.user) {
      if (!data.session) { setLoading(false); setSuccess(true); return; }
      const { error: profileError } = await createDonor({
        id: data.user.id, email, first_name: firstName, last_name: lastName,
        phone: phone || undefined, address: address || undefined,
        total_donated: 0, donation_count: 0, status: "active",
      } as any);
      if (profileError) {
        setError("Account created but profile setup failed: " + profileError.message);
        setLoading(false); return;
      }
    }
    setLoading(false);
    setSuccess(true);
    if (data.session) setTimeout(() => navigate("/donor/dashboard"), 2500);
  };

  /* ── Error Banner ────────────────────────────────────────── */
  const ErrorBanner = () => {
    if (!error) return null;
    if (error.toLowerCase().includes("email not confirmed")) return (
      <div style={{display:"flex",gap:14,padding:"18px",borderRadius:16,background:"linear-gradient(to right,#fffbeb,#fef3c7)",border:"1px solid #fde68a",marginBottom:26,boxShadow:"0 8px 20px rgba(251,191,36,.12)"}}>
        <div style={{width:42,height:42,borderRadius:12,background:"#fde68a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <Mail size={22} color="#b45309" />
        </div>
        <div style={{flex:1}}>
          <p style={{fontWeight:800,color:"#92400e",margin:0,fontSize:15}}>Action Required <Sparkles size={14} color="#d97706" /></p>
          <p style={{color:"#92400e",fontSize:13.5,marginTop:6,lineHeight:1.5,opacity:.9}}>
            Please check <strong>{email}</strong>'s inbox and click the confirmation link.
          </p>
        </div>
      </div>
    );
    if (error.toLowerCase().includes("rate limit") || error.toLowerCase().includes("too many")) return (
      <div style={{display:"flex",gap:14,padding:"18px",borderRadius:16,background:"linear-gradient(to right,#fef2f2,#fee2e2)",border:"1px solid #fecaca",marginBottom:26}}>
        <div style={{width:42,height:42,borderRadius:12,background:"#fecaca",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <AlertCircle size={22} color="#b91c1c" />
        </div>
        <div style={{flex:1}}>
          <p style={{fontWeight:800,color:"#991b1b",margin:0,fontSize:15}}>Too Many Attempts</p>
          <p style={{color:"#991b1b",fontSize:13.5,marginTop:6,lineHeight:1.5,opacity:.9}}>Please wait 10-15 minutes before trying again.</p>
        </div>
      </div>
    );
    return (
      <div style={{display:"flex",gap:12,padding:"14px 16px",borderRadius:12,background:"#fef2f2",border:"1px solid #fecaca",marginBottom:24}}>
        <AlertCircle size={18} color="#ef4444" style={{flexShrink:0,marginTop:2}} />
        <p style={{fontSize:14,color:"#b91c1c",margin:0,lineHeight:1.4}}>{error}</p>
      </div>
    );
  };

  return (
    <>
      <style>{`
        /* Embedded premium particles and mesh from Donor/Admin login concepts */
        .auth-mesh {
          position: absolute; inset: 0; opacity: .12;
          background:
            radial-gradient(ellipse 80% 50% at 20% 80%, #F5B800, transparent),
            radial-gradient(ellipse 60% 40% at 80% 20%, #032B45, transparent),
            radial-gradient(ellipse 50% 60% at 50% 50%, #053D61, transparent);
          filter: blur(60px);
          animation: auth-mesh-shift 12s ease-in-out infinite alternate;
        }
        @keyframes auth-mesh-shift {
          0%   { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.15) translate(-3%, 5%); }
        }
        .auth-grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse at 40% 50%, black 30%, transparent 70%);
        }
        .auth-particle {
          position: absolute; border-radius: 50%; background: #F5B800;
          animation: auth-particle-rise linear infinite;
          opacity: 0;
        }
        @keyframes auth-particle-rise {
          0%   { opacity: 0; transform: translateY(0) scale(0.5); }
          15%  { opacity: 0.7; }
          85%  { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(-400px) scale(0); }
        }
        .auth-input-group { position: relative; }
        .auth-input-group.focused .auth-input-icon { color: #032B45; }
        .auth-input-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; transition: color .25s;
          pointer-events: none; z-index: 2;
        }
      `}</style>

      {/* Mobile top banner */}
      <div className="auth-mobile-banner">
        <img src="/logo.png" alt="Logo" style={{height:40,objectFit:"contain",filter:"brightness(10)"}} />
        <div>
          <div style={{color:"#fff",fontWeight:700,fontSize:15}}>Cross-Borders Outreach</div>
          <div style={{color:"rgba(255,255,255,.6)",fontSize:12}}>
            {portalType === "admin" ? "Admin Portal" : "Donor Portal"}
          </div>
        </div>
      </div>

      <div className="auth-root" style={{minHeight:"100vh",display:"flex",background:"linear-gradient(180deg, #f8fafc 0%, #f0f4f8 100%)"}}>

        {/* ── LEFT PANEL ── */}
        <div className={`auth-left ${portalType}`} style={{flex:"0 0 46%",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"52px 48px",color:"#fff"}}>
          <div className="auth-mesh" />
          <div className="auth-grid-bg" />
          <div className="auth-orb" style={{width:350,height:350,background:"rgba(245,184,0,0.15)",top:-120,right:-100}} />
          <div className="auth-orb" style={{width:250,height:250,background:"rgba(3,43,69,0.3)",bottom:40,left:-80,animationDelay:"4s"}} />

          {/* Gold particles */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="auth-particle"
              style={{
                width: 3 + Math.random() * 3, height: 3 + Math.random() * 3,
                left: `${10 + Math.random() * 80}%`, bottom: `${Math.random() * 20}%`,
                animationDuration: `${5 + Math.random() * 7}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}

          {/* Logo & Header */}
          <div style={{position:"relative",zIndex:2}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:44}}>
              <img src="/logo.png" alt="Cross-Borders Outreach" style={{height:72,objectFit:"contain",filter:"drop-shadow(0 4px 16px rgba(0,0,0,.3))"}} />
              {portalType==="admin" && (
                <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:999,background:"rgba(245,184,0,.15)",border:"1px solid rgba(245,184,0,.3)",color:"#F5B800",fontSize:11,fontWeight:700,letterSpacing:"0.5px",textTransform:"uppercase"}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:"#F5B800",boxShadow:"0 0 8px rgba(245,184,0,0.5)",animation:"portal-pulse 2s infinite"}}/>
                  Admin Access
                </div>
              )}
            </div>

            {portalType === "donor" ? (
              <>
                <h2 style={{fontSize:36,fontWeight:800,lineHeight:1.15,marginBottom:18,fontFamily:"'Playfair Display', Georgia, serif"}}>
                  {authMode==="login" ? "Welcome back," : "Make a difference"}<br />
                  <span style={{background:"linear-gradient(90deg, #F5B800, #FFD13B)",backgroundClip:"text",WebkitBackgroundClip:"text",color:"transparent",WebkitTextFillColor:"transparent"}}>
                    {authMode==="login" ? "generous donor." : "starting today."}
                  </span>
                </h2>
                <p style={{opacity:.75,fontSize:15,lineHeight:1.65,marginBottom:40,maxWidth:380}}>
                  {authMode==="login"
                    ? "Sign in to your Donor Portal to track donations, view your impact, and manage your giving profile."
                    : "Join thousands of compassionate donors transforming lives across borders."}
                </p>

                {authMode==="login" ? (
                  <div style={{display:"flex",flexDirection:"column",gap:12}}>
                    {[
                      {icon:Heart,text:"Track every donation you make"},
                      {icon:TrendingUp,text:"See your real-world impact"},
                      {icon:Users,text:`Join ${donors}+ compassionate donors`},
                    ].map(({icon:Icon,text}) => (
                      <div className="auth-highlight" key={text}>
                        <div className="auth-icon-wrap"><Icon size={18} color="#F5B800"/></div>
                        <span style={{fontSize:14.5,opacity:.9}}>{text}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{display:"flex",flexDirection:"column",gap:14}}>
                    {[
                      {label:"Lives Impacted", value:`${donors}+`},
                      {label:"Countries Reached", value:countries},
                      {label:"Donations Processed", value:`$${donated}M`},
                    ].map(s => (
                      <div className="auth-highlight" key={s.label} style={{justifyContent:"space-between",padding:"20px"}}>
                        <span style={{opacity:.8,fontSize:14.5}}>{s.label}</span>
                        <span style={{fontWeight:800,fontSize:22,background:"linear-gradient(135deg, #F5B800, #FFD13B)",backgroundClip:"text",WebkitBackgroundClip:"text",color:"transparent",WebkitTextFillColor:"transparent"}}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 style={{fontSize:36,fontWeight:800,lineHeight:1.15,marginBottom:18,fontFamily:"'Playfair Display', Georgia, serif"}}>
                  Administration<br/>
                  <span style={{background:"linear-gradient(90deg, #F5B800, #FFD13B, #F5B800)",backgroundSize:"200% 200%",backgroundClip:"text",WebkitBackgroundClip:"text",color:"transparent",WebkitTextFillColor:"transparent"}}>
                    Command Center
                  </span>
                </h2>
                <p style={{opacity:.72,fontSize:14.5,lineHeight:1.65,marginBottom:40,maxWidth:380}}>
                  Restricted access portal for authorized administrators. All login attempts are logged and monitored.
                </p>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {ADMIN_FEATURES.map(({icon:Icon,text}) => (
                    <div className="auth-highlight" key={text}>
                      <div className="auth-icon-wrap"><Icon size={18} color="#F5B800"/></div>
                      <span style={{fontSize:14.5,opacity:.88}}>{text}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={{position:"relative",zIndex:2,display:"flex",alignItems:"center",gap:8,opacity:.6,fontSize:13}}>
            {portalType==="admin"
              ? <><Shield size={13}/><span>256-bit encrypted · Supabase Auth · Admin-only access</span></>
              : <><Globe size={14}/><span>Transforming lives across 38+ nations</span></>}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 24px",overflowY:"auto"}}>
          <div style={{width:"100%",maxWidth:480}}>

            {/* Back link & Navigation */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:36}}>
              <Link to="/" style={{display:"flex",alignItems:"center",gap:6,color:"#64748b",fontSize:14,fontWeight:600,textDecoration:"none",transition:"color .2s"}}>
                <ArrowLeft size={15}/> Back to site
              </Link>
              {portalType === "donor" && authMode === "login" && (
                <span style={{ fontSize:13, color:"#94a3b8" }}>
                  New here? <Link to="/donor/register" onClick={(e) => { e.preventDefault(); setAuthMode('register'); setRegStep(1); }} style={{ color:"#032B45", fontWeight:700, textDecoration:"none" }}>Create account</Link>
                </span>
              )}
            </div>

            {/* Portal toggle hidden as requested 
            <div className="type-tabs">
              <div className={`type-tab ${portalType==='donor'?'active':''}`} onClick={()=>setPortalType('donor')}>
                <Heart size={16}/> Donor Portal
              </div>
              <div className={`type-tab ${portalType==='admin'?'active':''}`} onClick={()=>setPortalType('admin')}>
                <Shield size={16}/> Admin Portal
              </div>
            </div>
            */}

            {/* Form Card */}
            <div style={{background:"#fff",borderRadius:24,border:"1px solid rgba(0,0,0,0.06)",boxShadow:"0 8px 32px rgba(3,43,69,0.06), 0 24px 60px rgba(3,43,69,0.04)",padding:"40px 36px",position:"relative",overflow:"hidden"}}>
              {/* Card top gradient line */}
              <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:`linear-gradient(90deg, #032B45, ${portalType==='admin'?'#F5B800':'#FFD13B'}, #053D61)`}} />

              {/* Banners */}
              {success && (
                <div style={{display:"flex",gap:14,padding:"16px 18px",borderRadius:12,background:"#f0fdf4",border:"1px solid #bbf7d0",marginBottom:24}}>
                  <CheckCircle size={22} color="#16a34a" style={{flexShrink:0}}/>
                  <div>
                    <p style={{fontWeight:700,color:"#15803d",margin:0}}>Account created successfully!</p>
                    <p style={{color:"#166534",fontSize:13,marginTop:4}}>Please confirm your email to continue.</p>
                  </div>
                </div>
              )}
              <ErrorBanner />

              {/* ── DONOR ── */}
              {portalType==="donor" && (
                <>
                  <div className="mode-tabs">
                    <div className={`mode-tab ${authMode==='login'?'active':''}`} onClick={()=>{setAuthMode('login');setRegStep(1);}}>Sign In</div>
                    <div className={`mode-tab ${authMode==='register'?'active':''}`} onClick={()=>{setAuthMode('register');setRegStep(1);}}>Create Account</div>
                  </div>

                  {/* ── DONOR LOGIN ── */}
                  {authMode==="login" && (
                    <>
                      <div style={{textAlign:"center",marginBottom:32}}>
                        <div style={{width:64,height:64,borderRadius:20,margin:"0 auto 20px",background:"linear-gradient(135deg, #032B45, #053D61)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 32px rgba(3,43,69,0.3)"}}>
                          <Heart size={28} color="#F5B800" style={{fill:"#F5B800"}}/>
                        </div>
                        <h1 style={{fontSize:26,fontWeight:800,color:"#032B45",margin:0,fontFamily:"'Playfair Display', Georgia, serif"}}>Donor Sign In</h1>
                        <p style={{color:"#64748b",marginTop:8,fontSize:14,lineHeight:1.6}}>Access your donation history and impact reports.</p>
                      </div>

                      <form onSubmit={handleLogin} style={{display:"flex",flexDirection:"column",gap:20}}>
                        <div>
                          <label style={{display:"block",fontSize:13,fontWeight:600,color:"#334155",marginBottom:8}}>Email Address</label>
                          <div className={`auth-input-group ${focused === "email" ? "focused" : ""}`}>
                            <Mail size={17} className="auth-input-icon"/>
                            <input className="auth-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your.email@example.com" required disabled={loading} autoComplete="email" onFocus={()=>setFocused("email")} onBlur={()=>setFocused(null)}/>
                          </div>
                        </div>
                        <div>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                            <label style={{fontSize:13,fontWeight:600,color:"#334155"}}>Password</label>
                            <button type="button" onClick={()=>setAuthMode('forgot')} style={{fontSize:13,color:"#032B45",fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:0}}>
                              Forgot password?
                            </button>
                          </div>
                          <div className={`auth-input-group ${focused === "password" ? "focused" : ""}`}>
                            <Lock size={17} className="auth-input-icon"/>
                            <input className="auth-input" type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required disabled={loading} autoComplete="current-password" style={{paddingRight:48}} onFocus={()=>setFocused("password")} onBlur={()=>setFocused(null)}/>
                            <button type="button" onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",zIndex:2}}>
                              {showPw?<EyeOff size={18}/>:<Eye size={18}/>}
                            </button>
                          </div>
                        </div>
                        <label style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer",marginTop:-4}}>
                          <input type="checkbox" checked={rememberMe} onChange={e=>setRememberMe(e.target.checked)} style={{width:16,height:16,accentColor:"#032B45"}}/>
                          <span style={{fontSize:13,color:"#64748b"}}>Remember me</span>
                        </label>
                        <button type="submit" className="auth-btn donor" disabled={loading} style={{marginTop:8}}>
                          {loading?<><Spinner/> <span>Signing in…</span></>:<span>Sign In</span>}
                        </button>
                      </form>
                    </>
                  )}

                  {/* ── FORGOT PASSWORD ── */}
                  {authMode==="forgot" && (
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:28}}>
                        <button type="button" onClick={()=>setAuthMode('login')} style={{background:"none",border:"none",cursor:"pointer",color:"#64748b",display:"flex",alignItems:"center",gap:6,fontSize:14,padding:0,fontWeight:600}}>
                          <ArrowLeft size={15}/> Back to sign in
                        </button>
                      </div>
                      <div style={{marginBottom:32}}>
                        <h1 style={{fontSize:24,fontWeight:800,color:"#032B45",margin:0,fontFamily:"'Playfair Display', Georgia, serif"}}>Reset Password</h1>
                        <p style={{color:"#64748b",marginTop:10,fontSize:14,lineHeight:1.6}}>
                          Enter your email and we'll send you a secure reset link.
                        </p>
                      </div>
                      {forgotSent ? (
                        <div style={{display:"flex",gap:14,padding:"20px",borderRadius:14,background:"#f0fdf4",border:"1px solid #bbf7d0"}}>
                          <CheckCircle size={24} color="#16a34a" style={{flexShrink:0}}/>
                          <div>
                            <p style={{fontWeight:700,color:"#15803d",margin:0}}>Reset email sent!</p>
                            <p style={{color:"#166534",fontSize:13.5,marginTop:6,lineHeight:1.5}}>
                              Check <strong>{email}</strong> for a password reset link. It may take a minute to arrive.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleForgotPassword} style={{display:"flex",flexDirection:"column",gap:20}}>
                          <div>
                            <label style={{display:"block",fontSize:13,fontWeight:600,color:"#334155",marginBottom:8}}>Email Address</label>
                            <div className={`auth-input-group ${focused === "email" ? "focused" : ""}`}>
                              <Mail size={17} className="auth-input-icon"/>
                              <input className="auth-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your.email@example.com" required disabled={loading} onFocus={()=>setFocused("email")} onBlur={()=>setFocused(null)}/>
                            </div>
                          </div>
                          <button type="submit" className="auth-btn donor" disabled={loading} style={{marginTop:8}}>
                            {loading?<><Spinner/> <span>Sending…</span></>:<><Mail size={17}/> <span>Send Reset Link</span></>}
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* ── DONOR REGISTER ── */}
                  {authMode==="register" && (
                    <>
                      {/* Step indicator */}
                      <div style={{display:"flex",alignItems:"center",marginBottom:36}}>
                        {[1,2].map((s,i) => (
                          <Fragment key={s}>
                            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                              <div className={`step-dot ${regStep>s?"done":regStep===s?"active":"inactive"}`}>
                                {regStep>s?<CheckCircle size={18}/>:s}
                              </div>
                              <span style={{fontSize:12,fontWeight:600,color:regStep===s?"#032B45":"#94a3b8"}}>
                                {s===1?"Personal Info":"Security"}
                              </span>
                            </div>
                            {i<1 && <div style={{flex:1,height:3,background:regStep>1?"#F5B800":"#e8ecf1",margin:"0 12px",marginBottom:24,borderRadius:2}}/>}
                          </Fragment>
                        ))}
                      </div>

                      <form onSubmit={regStep===2 ? handleRegister : (e)=>{e.preventDefault();if(step1Valid)setRegStep(2);}}>
                        {regStep===1 && (
                          <div style={{display:"flex",flexDirection:"column",gap:20}}>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                              {(["First Name","Last Name"] as const).map((label,i) => (
                                <div key={label}>
                                  <label style={{display:"block",fontSize:13,fontWeight:600,color:"#334155",marginBottom:8}}>{label} *</label>
                                  <div className="auth-input-group">
                                    <User size={17} className="auth-input-icon"/>
                                    <input className="auth-input" value={i===0?firstName:lastName} onChange={e=>i===0?setFirstName(e.target.value):setLastName(e.target.value)} placeholder={i===0?"Jane":"Doe"} required/>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div>
                              <label style={{display:"block",fontSize:13,fontWeight:600,color:"#334155",marginBottom:8}}>Email Address *</label>
                              <div className="auth-input-group">
                                <Mail size={17} className="auth-input-icon"/>
                                <input className="auth-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="jane.doe@example.com" required/>
                              </div>
                            </div>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                              <div>
                                <label style={{display:"block",fontSize:13,fontWeight:600,color:"#334155",marginBottom:8}}>Phone</label>
                                <div className="auth-input-group">
                                  <Phone size={17} className="auth-input-icon"/>
                                  <input className="auth-input" type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+1 (234) 567"/>
                                </div>
                              </div>
                              <div>
                                <label style={{display:"block",fontSize:13,fontWeight:600,color:"#334155",marginBottom:8}}>Address</label>
                                <div className="auth-input-group">
                                  <MapPin size={17} className="auth-input-icon"/>
                                  <input className="auth-input" type="text" value={address} onChange={e=>setAddress(e.target.value)} placeholder="City, Country"/>
                                </div>
                              </div>
                            </div>
                            <div>
                              <label style={{display:"block",fontSize:13,fontWeight:600,color:"#334155",marginBottom:8}}>Donor Registration Code *</label>
                              <div className="auth-input-group">
                                <KeyRound size={17} className="auth-input-icon"/>
                                <input className="auth-input" type="text" value={donorCode} onChange={e=>setDonorCode(e.target.value)} placeholder="Enter unique code" required/>
                              </div>
                              <p style={{fontSize:12,color:"#94a3b8",marginTop:6}}>Contact us if you don't have a registration code.</p>
                            </div>
                            <button type="submit" className="auth-btn donor-reg" disabled={!step1Valid} style={{marginTop:12}}>
                              <span>Continue</span> <ArrowRight size={18}/>
                            </button>
                          </div>
                        )}

                        {regStep===2 && (
                          <div style={{display:"flex",flexDirection:"column",gap:20}}>
                            <div>
                              <label style={{display:"block",fontSize:13,fontWeight:600,color:"#334155",marginBottom:8}}>Password *</label>
                              <div className="auth-input-group">
                                <Lock size={17} className="auth-input-icon"/>
                                <input className="auth-input" type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min. 6 characters" required style={{paddingRight:48}}/>
                                <button type="button" onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",zIndex:2}}>
                                  {showPw?<EyeOff size={18}/>:<Eye size={18}/>}
                                </button>
                              </div>
                              {password && (
                                <div style={{marginTop:12}}>
                                  <div style={{display:"flex",gap:6,marginBottom:6}}>
                                    {[1,2,3,4].map(i=><div key={i} className="pw-bar" style={{flex:1,background:i<=pwStrength?strengthColor[pwStrength]:"#e8ecf1"}}/>)}
                                  </div>
                                  {pwStrength>0 && <span style={{fontSize:12.5,fontWeight:700,color:strengthColor[pwStrength]}}>{strengthLabel[pwStrength]}</span>}
                                </div>
                              )}
                            </div>
                            <div>
                              <label style={{display:"block",fontSize:13,fontWeight:600,color:"#334155",marginBottom:8}}>Confirm Password *</label>
                              <div className="auth-input-group">
                                <Lock size={17} className="auth-input-icon"/>
                                <input className={`auth-input${confirmPassword&&confirmPassword!==password?" error":""}`} type={showCpw?"text":"password"} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Re-enter password" required style={{paddingRight:48}}/>
                                <button type="button" onClick={()=>setShowCpw(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",zIndex:2}}>
                                  {showCpw?<EyeOff size={18}/>:<Eye size={18}/>}
                                </button>
                              </div>
                              {confirmPassword&&confirmPassword!==password && <p style={{fontSize:12.5,color:"#dc2626",marginTop:6,fontWeight:500}}>Passwords do not match</p>}
                            </div>
                            <label style={{display:"flex",alignItems:"flex-start",gap:12,cursor:"pointer",marginTop:4}}>
                              <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{width:18,height:18,accentColor:"#032B45",marginTop:1}}/>
                              <span style={{fontSize:13.5,color:"#64748b",lineHeight:1.5}}>
                                I agree to the <a href="/terms" style={{color:"#032B45",fontWeight:700,textDecoration:"none"}}>Terms of Service</a> and <a href="/privacy" style={{color:"#032B45",fontWeight:700,textDecoration:"none"}}>Privacy Policy</a>
                              </span>
                            </label>
                            <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
                              <button type="submit" className="auth-btn donor-reg" disabled={!step2Valid||loading||success}>
                                {loading?<><Spinner/> <span>Creating account…</span></>:<><Sparkles size={18}/> <span>Create Account</span></>}
                              </button>
                              <button type="button" className="auth-btn-outline" onClick={()=>setRegStep(1)}>
                                <ArrowLeft size={16}/> <span>Back</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </form>
                    </>
                  )}
                </>
              )}

              {/* ── ADMIN ── */}
              {portalType==="admin" && (
                <>
                  <div className="mode-tabs">
                    <div className={`mode-tab ${authMode==='login'?'active':''}`} onClick={()=>setAuthMode('login')}>Sign In</div>
                    <div className={`mode-tab ${authMode==='register'?'active':''}`} onClick={()=>setAuthMode('register')}>Register</div>
                  </div>

                  {authMode==="login" && (
                    <>
                      <div style={{textAlign:"center",marginBottom:32}}>
                        <div style={{width:64,height:64,borderRadius:20,margin:"0 auto 20px",background:"linear-gradient(135deg, #032B45, #053D61)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 32px rgba(3,43,69,0.3)"}}>
                          <Fingerprint size={30} color="#F5B800"/>
                        </div>
                        <h1 style={{fontSize:26,fontWeight:800,color:"#032B45",margin:0,fontFamily:"'Playfair Display', Georgia, serif"}}>Admin Sign In</h1>
                        <p style={{color:"#64748b",marginTop:8,fontSize:14,lineHeight:1.6}}>Authorized personnel only. Your activity is monitored.</p>
                      </div>
                      <form onSubmit={handleLogin} style={{display:"flex",flexDirection:"column",gap:20}}>
                        <div>
                          <label style={{display:"block",fontSize:13,fontWeight:600,color:"#334155",marginBottom:8}}>Admin Email</label>
                          <div className={`auth-input-group ${focused === "email" ? "focused" : ""}`}>
                            <Mail size={17} className="auth-input-icon"/>
                            <input className="auth-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@cross-borders.org" required disabled={loading} autoComplete="email" onFocus={()=>setFocused("email")} onBlur={()=>setFocused(null)}/>
                          </div>
                        </div>
                        <div>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                            <label style={{fontSize:13,fontWeight:600,color:"#334155"}}>Password</label>
                            <button type="button" onClick={()=>setAuthMode('forgot')} style={{fontSize:13,color:"#032B45",fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:0}}>
                              Forgot password?
                            </button>
                          </div>
                          <div className={`auth-input-group ${focused === "password" ? "focused" : ""}`}>
                            <Lock size={17} className="auth-input-icon"/>
                            <input className="auth-input" type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required disabled={loading} style={{paddingRight:48}} onFocus={()=>setFocused("password")} onBlur={()=>setFocused(null)}/>
                            <button type="button" onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",zIndex:2}}>
                              {showPw?<EyeOff size={18}/>:<Eye size={18}/>}
                            </button>
                          </div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",borderRadius:14,background:"rgba(3,43,69,0.04)",border:"1px solid rgba(3,43,69,0.08)"}}>
                          <Shield size={16} color="#032B45" style={{flexShrink:0}}/>
                          <p style={{fontSize:12.5,color:"#032B45",margin:0,lineHeight:1.5,fontWeight:600}}>This is a restricted area. Unauthorized access attempts are logged.</p>
                        </div>
                        <button type="submit" className="auth-btn admin" disabled={loading} style={{marginTop:8}}>
                          {loading?<><Spinner/> <span>Authenticating…</span></>:<><Shield size={17}/> <span>Sign In Securely</span></>}
                        </button>
                      </form>
                    </>
                  )}

                  {authMode==="forgot" && (
                    <div>
                      <div style={{marginBottom:32}}>
                        <button type="button" onClick={()=>setAuthMode('login')} style={{background:"none",border:"none",cursor:"pointer",color:"#64748b",display:"flex",alignItems:"center",gap:6,fontSize:14,padding:0,marginBottom:24,fontWeight:600}}>
                          <ArrowLeft size={15}/> Back to sign in
                        </button>
                        <h1 style={{fontSize:24,fontWeight:800,color:"#032B45",margin:0,fontFamily:"'Playfair Display', Georgia, serif"}}>Reset Admin Password</h1>
                        <p style={{color:"#64748b",marginTop:10,fontSize:14,lineHeight:1.6}}>Enter your admin email to receive a secure reset link.</p>
                      </div>
                      {forgotSent ? (
                        <div style={{display:"flex",gap:14,padding:"20px",borderRadius:14,background:"#f0fdf4",border:"1px solid #bbf7d0"}}>
                          <CheckCircle size={24} color="#16a34a" style={{flexShrink:0}}/>
                          <div>
                            <p style={{fontWeight:700,color:"#15803d",margin:0}}>Reset email sent!</p>
                            <p style={{color:"#166534",fontSize:13.5,marginTop:6,lineHeight:1.5}}>Check <strong>{email}</strong> for your reset link.</p>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleForgotPassword} style={{display:"flex",flexDirection:"column",gap:20}}>
                          <div>
                            <label style={{display:"block",fontSize:13,fontWeight:600,color:"#334155",marginBottom:8}}>Admin Email</label>
                            <div className={`auth-input-group ${focused === "email" ? "focused" : ""}`}>
                              <Mail size={17} className="auth-input-icon"/>
                              <input className="auth-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@cross-borders.org" required disabled={loading} onFocus={()=>setFocused("email")} onBlur={()=>setFocused(null)}/>
                            </div>
                          </div>
                          <button type="submit" className="auth-btn admin" disabled={loading} style={{marginTop:8}}>
                            {loading?<><Spinner/> <span>Sending…</span></>:<><Mail size={17}/> <span>Send Reset Link</span></>}
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {authMode==="register" && (
                    <>
                      <div style={{textAlign:"center",marginBottom:32}}>
                        <div style={{width:64,height:64,borderRadius:20,margin:"0 auto 20px",background:"linear-gradient(135deg, #032B45, #053D61)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 32px rgba(3,43,69,0.3)"}}>
                          <Shield size={28} color="#F5B800"/>
                        </div>
                        <h1 style={{fontSize:26,fontWeight:800,color:"#032B45",margin:0,fontFamily:"'Playfair Display', Georgia, serif"}}>Admin Registration</h1>
                        <p style={{color:"#64748b",marginTop:8,fontSize:14,lineHeight:1.6}}>Enter your unique code to register as an administrator.</p>
                      </div>
                      <form onSubmit={handleAdminRegister} style={{display:"flex",flexDirection:"column",gap:20}}>
                        <div>
                          <label style={{display:"block",fontSize:13,fontWeight:600,color:"#334155",marginBottom:8}}>Registration Code *</label>
                          <div className="auth-input-group">
                            <KeyRound size={17} className="auth-input-icon"/>
                            <input className="auth-input" type="text" value={adminCode} onChange={e=>setAdminCode(e.target.value)} placeholder="Enter unique code" required disabled={loading}/>
                          </div>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                          <div>
                            <label style={{display:"block",fontSize:13,fontWeight:600,color:"#334155",marginBottom:8}}>First Name *</label>
                            <div className="auth-input-group">
                              <User size={17} className="auth-input-icon"/>
                              <input className="auth-input" value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="Jane" required disabled={loading}/>
                            </div>
                          </div>
                          <div>
                            <label style={{display:"block",fontSize:13,fontWeight:600,color:"#334155",marginBottom:8}}>Last Name *</label>
                            <div className="auth-input-group">
                              <User size={17} className="auth-input-icon"/>
                              <input className="auth-input" value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Doe" required disabled={loading}/>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label style={{display:"block",fontSize:13,fontWeight:600,color:"#334155",marginBottom:8}}>Email Address *</label>
                          <div className="auth-input-group">
                            <Mail size={17} className="auth-input-icon"/>
                            <input className="auth-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@example.com" required disabled={loading}/>
                          </div>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                          <div>
                            <label style={{display:"block",fontSize:13,fontWeight:600,color:"#334155",marginBottom:8}}>Password *</label>
                            <div className="auth-input-group">
                              <Lock size={17} className="auth-input-icon"/>
                              <input className="auth-input" type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min. 6 chars" required disabled={loading} style={{paddingRight:48}}/>
                              <button type="button" onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",zIndex:2}}>
                                {showPw?<EyeOff size={18}/>:<Eye size={18}/>}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label style={{display:"block",fontSize:13,fontWeight:600,color:"#334155",marginBottom:8}}>Confirm Password *</label>
                            <div className="auth-input-group">
                              <Lock size={17} className="auth-input-icon"/>
                              <input className={`auth-input${confirmPassword&&confirmPassword!==password?" error":""}`} type={showCpw?"text":"password"} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Re-enter password" required disabled={loading} style={{paddingRight:48}}/>
                              <button type="button" onClick={()=>setShowCpw(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",zIndex:2}}>
                                {showCpw?<EyeOff size={18}/>:<Eye size={18}/>}
                              </button>
                            </div>
                          </div>
                        </div>
                        <button type="submit" className="auth-btn admin" disabled={loading} style={{marginTop:12}}>
                          {loading?<><Spinner/> <span>Registering…</span></>:<><Shield size={17}/> <span>Complete Registration</span></>}
                        </button>
                      </form>
                    </>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
