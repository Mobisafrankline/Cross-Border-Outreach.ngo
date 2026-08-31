import { useState, useMemo, useEffect, useRef, Fragment } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import {
  Heart, Mail, Lock, User, Phone, MapPin,
  AlertCircle, CheckCircle, Eye, EyeOff,
  Globe, Shield, ArrowRight, ArrowLeft, Sparkles, KeyRound,
  TrendingUp, Users, Database, Activity, RefreshCw
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

    // Validate donor code via Supabase RPC (code never exposed in bundle)
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
      {/* Mobile top banner */}
      <div className="auth-mobile-banner" style={{display:"none"}}>
        <img src="/logo.png" alt="Logo" style={{height:40,objectFit:"contain",filter:"brightness(10)"}} />
        <div>
          <div style={{color:"#fff",fontWeight:700,fontSize:15}}>Cross-Borders Outreach</div>
          <div style={{color:"rgba(255,255,255,.6)",fontSize:12}}>
            {portalType === "admin" ? "Admin Portal" : "Donor Portal"}
          </div>
        </div>
      </div>

      <div className="auth-root" style={{minHeight:"100vh",display:"flex",background:"#f8f9fa"}}>

        {/* ── LEFT PANEL ── */}
        <div className={`auth-left ${portalType}`} style={{flex:"0 0 44%",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"52px 48px",color:"#fff"}}>
          <div className="auth-orb" style={{width:290,height:290,background:"#3b82f6",top:-80,right:-60}} />
          <div className="auth-orb" style={{width:200,height:200,background:portalType==="admin"?"#8b5cf6":"#6366f1",bottom:60,left:-50,animationDelay:"3.5s"}} />

          {/* Logo & Header */}
          <div style={{position:"relative",zIndex:2}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:44}}>
              <img src="/logo.png" alt="Cross-Borders Outreach" style={{height:72,objectFit:"contain",filter:"drop-shadow(0 4px 16px rgba(0,0,0,.3))"}} />
              {portalType==="admin" && (
                <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:999,background:"rgba(239,68,68,.15)",border:"1px solid rgba(239,68,68,.3)",color:"#fca5a5",fontSize:12,fontWeight:600}}>
                  <Shield size={11}/> Admin
                </div>
              )}
            </div>

            {portalType === "donor" ? (
              <>
                <h2 style={{fontSize:32,fontWeight:800,lineHeight:1.25,marginBottom:14}}>
                  {authMode==="login" ? "Welcome back," : "Make a difference"}<br />
                  <span style={{background:authMode==="login"?"linear-gradient(90deg,#93c5fd,#a5b4fc)":"linear-gradient(90deg,#c084fc,#f472b6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                    {authMode==="login" ? "generous donor." : "starting today."}
                  </span>
                </h2>
                <p style={{opacity:.75,fontSize:15,lineHeight:1.65,marginBottom:40}}>
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
                        <div className="auth-icon-wrap"><Icon size={18} color="#93c5fd"/></div>
                        <span style={{fontSize:14,opacity:.9}}>{text}</span>
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
                      <div className="auth-highlight" key={s.label} style={{justifyContent:"space-between"}}>
                        <span style={{opacity:.8,fontSize:14}}>{s.label}</span>
                        <span style={{fontWeight:800,fontSize:20}}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 style={{fontSize:30,fontWeight:800,lineHeight:1.25,marginBottom:14}}>
                  Administration<br/>
                  <span style={{background:"linear-gradient(90deg,#60a5fa,#818cf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                    Command Center
                  </span>
                </h2>
                <p style={{opacity:.72,fontSize:14.5,lineHeight:1.65,marginBottom:38}}>
                  Restricted access. Authorized administrators only. All login attempts are logged and monitored.
                </p>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {ADMIN_FEATURES.map(({icon:Icon,text}) => (
                    <div className="auth-highlight" key={text}>
                      <div className="auth-icon-wrap"><Icon size={17} color="#93c5fd"/></div>
                      <span style={{fontSize:14,opacity:.88}}>{text}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={{position:"relative",zIndex:2,display:"flex",alignItems:"center",gap:8,opacity:.6,fontSize:13}}>
            {portalType==="admin"
              ? <><Shield size={13}/><span>256-bit encrypted · Supabase Auth · Admin-only</span></>
              : <><Globe size={14}/><span>Transforming lives across 38+ nations</span></>}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 24px",overflowY:"auto",background:"#fff"}}>
          <div style={{width:"100%",maxWidth:480}}>

            {/* Back link */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32}}>
              <Link to="/" style={{display:"flex",alignItems:"center",gap:6,color:"#6b7280",fontSize:14,textDecoration:"none"}}>
                <ArrowLeft size={15}/> Back to site
              </Link>
            </div>

            {/* Portal toggle */}
            <div className="type-tabs">
              <div className={`type-tab ${portalType==='donor'?'active':''}`} onClick={()=>setPortalType('donor')}>
                <Heart size={16}/> Donor Portal
              </div>
              <div className={`type-tab ${portalType==='admin'?'active':''}`} onClick={()=>setPortalType('admin')}>
                <Shield size={16}/> Admin Portal
              </div>
            </div>

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
                  <form onSubmit={handleLogin} style={{display:"flex",flexDirection:"column",gap:20}}>
                    <div>
                      <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:7}}>Email Address</label>
                      <div style={{position:"relative"}}>
                        <Mail size={17} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                        <input className="auth-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your.email@example.com" required disabled={loading} autoComplete="email"/>
                      </div>
                    </div>
                    <div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                        <label style={{fontSize:13,fontWeight:600,color:"#374151"}}>Password</label>
                        <button type="button" onClick={()=>setAuthMode('forgot')} style={{fontSize:13,color:"#1d4ed8",fontWeight:500,background:"none",border:"none",cursor:"pointer",padding:0}}>
                          Forgot password?
                        </button>
                      </div>
                      <div style={{position:"relative"}}>
                        <Lock size={17} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                        <input className="auth-input" type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required disabled={loading} autoComplete="current-password" style={{paddingRight:44}}/>
                        <button type="button" onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#6b7280"}}>
                          {showPw?<EyeOff size={18}/>:<Eye size={18}/>}
                        </button>
                      </div>
                    </div>
                    <label style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer",marginTop:-4}}>
                      <input type="checkbox" checked={rememberMe} onChange={e=>setRememberMe(e.target.checked)} style={{width:15,height:15,accentColor:"#1d4ed8"}}/>
                      <span style={{fontSize:13,color:"#4b5563"}}>Remember me</span>
                    </label>
                    <button type="submit" className="auth-btn donor" disabled={loading} style={{marginTop:4}}>
                      {loading?<><Spinner/> Signing in…</>:"Sign In"}
                    </button>
                  </form>
                )}

                {/* ── FORGOT PASSWORD ── */}
                {authMode==="forgot" && (
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:28}}>
                      <button type="button" onClick={()=>setAuthMode('login')} style={{background:"none",border:"none",cursor:"pointer",color:"#6b7280",display:"flex",alignItems:"center",gap:6,fontSize:14,padding:0}}>
                        <ArrowLeft size={15}/> Back to sign in
                      </button>
                    </div>
                    <div style={{marginBottom:28}}>
                      <h1 style={{fontSize:24,fontWeight:800,color:"#111827",margin:0}}>Reset Password</h1>
                      <p style={{color:"#6b7280",marginTop:8,fontSize:14.5,lineHeight:1.6}}>
                        Enter your email and we'll send you a secure reset link.
                      </p>
                    </div>
                    {forgotSent ? (
                      <div style={{display:"flex",gap:14,padding:"20px",borderRadius:14,background:"#f0fdf4",border:"1px solid #bbf7d0"}}>
                        <CheckCircle size={24} color="#16a34a" style={{flexShrink:0}}/>
                        <div>
                          <p style={{fontWeight:700,color:"#15803d",margin:0}}>Reset email sent!</p>
                          <p style={{color:"#166534",fontSize:13.5,marginTop:5,lineHeight:1.5}}>
                            Check <strong>{email}</strong> for a password reset link. It may take a minute to arrive.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleForgotPassword} style={{display:"flex",flexDirection:"column",gap:20}}>
                        <div>
                          <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:7}}>Email Address</label>
                          <div style={{position:"relative"}}>
                            <Mail size={17} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                            <input className="auth-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your.email@example.com" required disabled={loading}/>
                          </div>
                        </div>
                        <button type="submit" className="auth-btn donor" disabled={loading}>
                          {loading?<><Spinner/> Sending…</>:<><Mail size={17}/> Send Reset Link</>}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* ── DONOR REGISTER ── */}
                {authMode==="register" && (
                  <>
                    {/* Step indicator */}
                    <div style={{display:"flex",alignItems:"center",marginBottom:32}}>
                      {[1,2].map((s,i) => (
                        <Fragment key={s}>
                          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                            <div className={`step-dot ${regStep>s?"done":regStep===s?"active":"inactive"}`}>
                              {regStep>s?<CheckCircle size={16}/>:s}
                            </div>
                            <span style={{fontSize:11,fontWeight:600,color:regStep===s?"#7c3aed":"#9ca3af"}}>
                              {s===1?"Personal Info":"Security"}
                            </span>
                          </div>
                          {i<1 && <div style={{flex:1,height:2,background:regStep>1?"#22c55e":"#e5e7eb",margin:"0 10px",marginBottom:20}}/>}
                        </Fragment>
                      ))}
                    </div>

                    <form onSubmit={regStep===2 ? handleRegister : (e)=>{e.preventDefault();if(step1Valid)setRegStep(2);}}>
                      {regStep===1 && (
                        <div style={{display:"flex",flexDirection:"column",gap:16}}>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                            {(["First Name","Last Name"] as const).map((label,i) => (
                              <div key={label}>
                                <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:6}}>{label} *</label>
                                <div style={{position:"relative"}}>
                                  <User size={17} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                                  <input className="auth-input" value={i===0?firstName:lastName} onChange={e=>i===0?setFirstName(e.target.value):setLastName(e.target.value)} placeholder={i===0?"John":"Doe"} required/>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div>
                            <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:6}}>Email Address *</label>
                            <div style={{position:"relative"}}>
                              <Mail size={17} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                              <input className="auth-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="john.doe@example.com" required/>
                            </div>
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                            <div>
                              <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:6}}>Phone</label>
                              <div style={{position:"relative"}}>
                                <Phone size={17} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                                <input className="auth-input" type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+1 (234)"/>
                              </div>
                            </div>
                            <div>
                              <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:6}}>Address</label>
                              <div style={{position:"relative"}}>
                                <MapPin size={17} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                                <input className="auth-input" type="text" value={address} onChange={e=>setAddress(e.target.value)} placeholder="City, Country"/>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:6}}>Donor Registration Code *</label>
                            <div style={{position:"relative"}}>
                              <KeyRound size={17} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                              <input className="auth-input" type="text" value={donorCode} onChange={e=>setDonorCode(e.target.value)} placeholder="Enter donor registration code" required/>
                            </div>
                            <p style={{fontSize:11.5,color:"#9ca3af",marginTop:5}}>Contact us if you don't have a registration code.</p>
                          </div>
                          <button type="submit" className="auth-btn donor-reg" disabled={!step1Valid} style={{marginTop:8}}>
                            Continue <ArrowRight size={18}/>
                          </button>
                        </div>
                      )}

                      {regStep===2 && (
                        <div style={{display:"flex",flexDirection:"column",gap:16}}>
                          <div>
                            <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:6}}>Password *</label>
                            <div style={{position:"relative"}}>
                              <Lock size={17} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                              <input className="auth-input" type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min. 6 characters" required style={{paddingRight:44}}/>
                              <button type="button" onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#6b7280"}}>
                                {showPw?<EyeOff size={18}/>:<Eye size={18}/>}
                              </button>
                            </div>
                            {password && (
                              <div style={{marginTop:10}}>
                                <div style={{display:"flex",gap:4,marginBottom:5}}>
                                  {[1,2,3,4].map(i=><div key={i} className="pw-bar" style={{flex:1,background:i<=pwStrength?strengthColor[pwStrength]:"#e5e7eb"}}/>)}
                                </div>
                                {pwStrength>0 && <span style={{fontSize:12,fontWeight:600,color:strengthColor[pwStrength]}}>{strengthLabel[pwStrength]}</span>}
                              </div>
                            )}
                          </div>
                          <div>
                            <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:6}}>Confirm Password *</label>
                            <div style={{position:"relative"}}>
                              <Lock size={17} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                              <input className={`auth-input${confirmPassword&&confirmPassword!==password?" error":""}`} type={showCpw?"text":"password"} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Re-enter password" required style={{paddingRight:44}}/>
                              <button type="button" onClick={()=>setShowCpw(p=>!p)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#6b7280"}}>
                                {showCpw?<EyeOff size={18}/>:<Eye size={18}/>}
                              </button>
                            </div>
                            {confirmPassword&&confirmPassword!==password && <p style={{fontSize:12,color:"#ef4444",marginTop:5}}>Passwords do not match</p>}
                          </div>
                          <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",marginTop:8}}>
                            <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{width:16,height:16,accentColor:"#7c3aed",marginTop:2}}/>
                            <span style={{fontSize:13,color:"#4b5563",lineHeight:1.5}}>
                              I agree to the <a href="/terms" style={{color:"#7c3aed",fontWeight:600,textDecoration:"none"}}>Terms of Service</a> and <a href="/privacy" style={{color:"#7c3aed",fontWeight:600,textDecoration:"none"}}>Privacy Policy</a>
                            </span>
                          </label>
                          <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:8}}>
                            <button type="submit" className="auth-btn donor-reg" disabled={!step2Valid||loading||success}>
                              {loading?<><Spinner/> Creating account…</>:<><Sparkles size={18}/> Create Account</>}
                            </button>
                            <button type="button" className="auth-btn-outline" onClick={()=>setRegStep(1)}>
                              <ArrowLeft size={16}/> Back
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
                  <div className={`mode-tab ${authMode==='register'?'active':''}`} onClick={()=>setAuthMode('register')}>Register Admin</div>
                </div>

                {authMode==="login" && (
                  <>
                    <div style={{marginBottom:32}}>
                      <div style={{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,#1e3a8a,#1d4ed8)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:18,boxShadow:"0 6px 20px rgba(30,58,138,.35)"}}>
                        <Shield size={26} color="#fff"/>
                      </div>
                      <h1 style={{fontSize:26,fontWeight:800,color:"#111827",margin:0}}>Admin Sign In</h1>
                      <p style={{color:"#6b7280",marginTop:8,fontSize:14.5}}>Authorized personnel only. Activity is monitored.</p>
                    </div>
                    <form onSubmit={handleLogin} style={{display:"flex",flexDirection:"column",gap:20}}>
                      <div>
                        <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:7}}>Admin Email</label>
                        <div style={{position:"relative"}}>
                          <Mail size={17} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                          <input className="auth-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@cross-borders.org" required disabled={loading} autoComplete="email"/>
                        </div>
                      </div>
                      <div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                          <label style={{fontSize:13,fontWeight:600,color:"#374151"}}>Password</label>
                          <button type="button" onClick={()=>setAuthMode('forgot')} style={{fontSize:13,color:"#1d4ed8",fontWeight:500,background:"none",border:"none",cursor:"pointer",padding:0}}>
                            Forgot password?
                          </button>
                        </div>
                        <div style={{position:"relative"}}>
                          <Lock size={17} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                          <input className="auth-input" type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required disabled={loading} style={{paddingRight:44}}/>
                          <button type="button" onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#6b7280"}}>
                            {showPw?<EyeOff size={18}/>:<Eye size={18}/>}
                          </button>
                        </div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:10,background:"#eff6ff",border:"1px solid #bfdbfe"}}>
                        <Shield size={15} color="#1d4ed8" style={{flexShrink:0}}/>
                        <p style={{fontSize:12.5,color:"#1e40af",margin:0,lineHeight:1.5}}>This is a restricted area. Unauthorized access attempts are logged.</p>
                      </div>
                      <button type="submit" className="auth-btn admin" disabled={loading} style={{marginTop:4}}>
                        {loading?<><Spinner/> Authenticating…</>:<><Shield size={17}/> Sign In Securely</>}
                      </button>
                    </form>
                  </>
                )}

                {authMode==="forgot" && (
                  <div>
                    <div style={{marginBottom:28}}>
                      <button type="button" onClick={()=>setAuthMode('login')} style={{background:"none",border:"none",cursor:"pointer",color:"#6b7280",display:"flex",alignItems:"center",gap:6,fontSize:14,padding:0,marginBottom:20}}>
                        <ArrowLeft size={15}/> Back to sign in
                      </button>
                      <h1 style={{fontSize:24,fontWeight:800,color:"#111827",margin:0}}>Reset Admin Password</h1>
                      <p style={{color:"#6b7280",marginTop:8,fontSize:14.5}}>Enter your admin email to receive a reset link.</p>
                    </div>
                    {forgotSent ? (
                      <div style={{display:"flex",gap:14,padding:"20px",borderRadius:14,background:"#f0fdf4",border:"1px solid #bbf7d0"}}>
                        <CheckCircle size={24} color="#16a34a" style={{flexShrink:0}}/>
                        <div>
                          <p style={{fontWeight:700,color:"#15803d",margin:0}}>Reset email sent!</p>
                          <p style={{color:"#166534",fontSize:13.5,marginTop:5}}>Check <strong>{email}</strong> for your reset link.</p>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleForgotPassword} style={{display:"flex",flexDirection:"column",gap:20}}>
                        <div>
                          <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:7}}>Admin Email</label>
                          <div style={{position:"relative"}}>
                            <Mail size={17} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                            <input className="auth-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@cross-borders.org" required disabled={loading}/>
                          </div>
                        </div>
                        <button type="submit" className="auth-btn admin" disabled={loading}>
                          {loading?<><Spinner/> Sending…</>:<><Mail size={17}/> Send Reset Link</>}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {authMode==="register" && (
                  <>
                    <div style={{marginBottom:32}}>
                      <div style={{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,#1e3a8a,#1d4ed8)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:18,boxShadow:"0 6px 20px rgba(30,58,138,.35)"}}>
                        <Shield size={26} color="#fff"/>
                      </div>
                      <h1 style={{fontSize:26,fontWeight:800,color:"#111827",margin:0}}>Admin Registration</h1>
                      <p style={{color:"#6b7280",marginTop:8,fontSize:14.5}}>Enter your unique code to register as an administrator.</p>
                    </div>
                    <form onSubmit={handleAdminRegister} style={{display:"flex",flexDirection:"column",gap:16}}>
                      <div>
                        <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:7}}>Registration Code *</label>
                        <div style={{position:"relative"}}>
                          <KeyRound size={17} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                          <input className="auth-input" type="text" value={adminCode} onChange={e=>setAdminCode(e.target.value)} placeholder="Enter unique code" required disabled={loading}/>
                        </div>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                        <div>
                          <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:6}}>First Name *</label>
                          <div style={{position:"relative"}}>
                            <User size={17} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                            <input className="auth-input" value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="Jane" required disabled={loading}/>
                          </div>
                        </div>
                        <div>
                          <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:6}}>Last Name *</label>
                          <div style={{position:"relative"}}>
                            <User size={17} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                            <input className="auth-input" value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Doe" required disabled={loading}/>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:7}}>Email Address *</label>
                        <div style={{position:"relative"}}>
                          <Mail size={17} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                          <input className="auth-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@example.com" required disabled={loading}/>
                        </div>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                        <div>
                          <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:6}}>Password *</label>
                          <div style={{position:"relative"}}>
                            <Lock size={17} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                            <input className="auth-input" type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min. 6 chars" required disabled={loading} style={{paddingRight:40}}/>
                            <button type="button" onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#6b7280"}}>
                              {showPw?<EyeOff size={17}/>:<Eye size={17}/>}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:6}}>Confirm *</label>
                          <div style={{position:"relative"}}>
                            <Lock size={17} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                            <input className={`auth-input${confirmPassword&&confirmPassword!==password?" error":""}`} type={showCpw?"text":"password"} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Re-enter" required disabled={loading} style={{paddingRight:40}}/>
                            <button type="button" onClick={()=>setShowCpw(p=>!p)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#6b7280"}}>
                              {showCpw?<EyeOff size={17}/>:<Eye size={17}/>}
                            </button>
                          </div>
                        </div>
                      </div>
                      <button type="submit" className="auth-btn admin" disabled={loading||success} style={{marginTop:8}}>
                        {loading?<><Spinner/> Registering…</>:<><Shield size={17}/> Register as Admin</>}
                      </button>
                    </form>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
