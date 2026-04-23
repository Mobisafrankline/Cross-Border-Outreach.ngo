import { useState, useMemo, Fragment } from "react";
import { useNavigate, Link } from "react-router";
import {
  Heart, Mail, Lock, User, Phone, MapPin,
  AlertCircle, CheckCircle, Eye, EyeOff,
  Globe, Shield, ArrowRight, ArrowLeft, Sparkles,
} from "lucide-react";
import { signUp, createDonor } from "../../../lib/supabase";

/* ─── password strength ─────────────────────────────────── */
function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
}
const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];

/* ─── impact stats shown on the left panel ──────────────── */
const STATS = [
  { value: "12,400+", label: "Lives Impacted" },
  { value: "38", label: "Countries Reached" },
  { value: "$2.1M", label: "Donations Processed" },
];

/* ─── main component ─────────────────────────────────────── */
export default function DonorRegister() {
  const [step, setStep] = useState(1); // 1 = personal info, 2 = security
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", address: "",
    password: "", confirmPassword: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const pwStrength = useMemo(() => getStrength(formData.password), [formData.password]);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* step 1 validation */
  const step1Valid =
    formData.firstName.trim() && formData.lastName.trim() && formData.email.includes("@");

  /* step 2 validation */
  const step2Valid =
    formData.password.length >= 6 &&
    formData.confirmPassword === formData.password &&
    agreed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match."); return; }
    if (formData.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);

    const { data, error: signUpError } = await signUp(formData.email, formData.password, {
      first_name: formData.firstName,
      last_name: formData.lastName,
    });

    if (signUpError) { setError(signUpError.message); setLoading(false); return; }

    if (data.user) {
      const { error: profileError } = await createDonor({
        id: data.user.id,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
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
    setTimeout(() => navigate("/donor/dashboard"), 2500);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        .reg-root { font-family: 'Inter', sans-serif; }

        /* Left panel */
        .reg-left {
          background: linear-gradient(145deg, #1e0a3c 0%, #3b0764 40%, #6d28d9 80%, #8b5cf6 100%);
          position: relative; overflow: hidden;
        }
        .reg-left::before {
          content: '';
          position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .reg-orb {
          position: absolute; border-radius: 50%;
          filter: blur(60px); opacity: 0.25;
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)}
        }
        .reg-stat {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(12px);
          border-radius: 14px; padding: 18px 22px;
          transition: background .2s;
        }
        .reg-stat:hover { background: rgba(255,255,255,0.14); }

        /* Right panel / form */
        .reg-form-card {
          background: #ffffff;
          border-radius: 0;
        }
        .reg-input {
          width: 100%;
          padding: 12px 12px 12px 44px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
          background: #fafafa;
          color: #111827;
          box-sizing: border-box;
        }
        .reg-input:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124,58,237,.12);
          background: #fff;
        }
        .reg-input.error { border-color: #ef4444; }

        /* step indicator */
        .step-dot {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 14px; transition: all .3s;
        }
        .step-dot.active   { background: #7c3aed; color: #fff; box-shadow: 0 0 0 4px rgba(124,58,237,.2); }
        .step-dot.done     { background: #22c55e; color: #fff; }
        .step-dot.inactive { background: #e5e7eb; color: #9ca3af; }

        /* strength bar */
        .pw-bar { height: 4px; border-radius: 2px; transition: width .4s, background .4s; }

        /* CTA button */
        .reg-btn {
          width: 100%;
          padding: 14px;
          border: none; cursor: pointer;
          border-radius: 12px;
          font-size: 16px; font-weight: 700;
          font-family: 'Inter', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: opacity .2s, transform .15s, box-shadow .2s;
          background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
          color: #fff;
          box-shadow: 0 4px 20px rgba(124,58,237,.4);
        }
        .reg-btn:hover:not(:disabled) { opacity: .92; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(124,58,237,.45); }
        .reg-btn:disabled { opacity: .6; cursor: not-allowed; }

        .reg-btn-outline {
          width: 100%; padding: 13px;
          border: 1.5px solid #7c3aed; background: transparent;
          color: #7c3aed; border-radius: 12px; cursor: pointer;
          font-size: 15px; font-weight: 600; font-family:'Inter',sans-serif;
          display:flex;align-items:center;justify-content:center;gap:8px;
          transition: background .2s, color .2s;
        }
        .reg-btn-outline:hover { background:#f5f3ff; }

        .trust-badge {
          display:flex;align-items:center;gap:8px;
          padding:10px 14px;border-radius:10px;
          background:#f5f3ff;color:#6d28d9;font-size:13px;font-weight:500;
        }

        @media(max-width:900px){
          .reg-left{display:none!important;}
          .reg-right{border-radius:0!important;}
        }

        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      <div className="reg-root" style={{ minHeight: "100vh", display: "flex", background: "#f8f7ff" }}>

        {/* ── LEFT PANEL ── */}
        <div className="reg-left" style={{ flex: "0 0 42%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px 48px", color: "#fff" }}>
          {/* orbs */}
          <div className="reg-orb" style={{ width: 260, height: 260, background: "#a78bfa", top: -60, right: -60, animationDelay: "0s" }} />
          <div className="reg-orb" style={{ width: 200, height: 200, background: "#ec4899", bottom: 80, left: -40, animationDelay: "2s" }} />

          {/* logo */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ marginBottom: 44 }}>
              <img src="/logo.png" alt="Cross-Borders Outreach Ministry" style={{ height: 72, objectFit: "contain", filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.3))" }} />
            </div>

            <h2 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
              Make a difference<br />
              <span style={{ background: "linear-gradient(90deg,#c084fc,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                starting today.
              </span>
            </h2>
            <p style={{ opacity: .75, fontSize: 15, lineHeight: 1.6, marginBottom: 40 }}>
              Join thousands of compassionate donors who are transforming lives across borders. Your account gives you full transparency into your impact.
            </p>

            {/* stats — key is on the outer element, no extra fragment needed */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {STATS.map((s) => (
                <div className="reg-stat" key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ opacity: .8, fontSize: 14 }}>{s.label}</span>
                  <span style={{ fontWeight: 800, fontSize: 20 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* bottom */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: .7, fontSize: 13 }}>
              <Globe size={15} />
              <span>Serving communities in 38+ countries worldwide</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="reg-form-card" style={{ flex: 1, overflowY: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
          <div style={{ width: "100%", maxWidth: 520 }}>

            {/* top nav */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
              <Link to="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "#6b7280", fontSize: 14, textDecoration: "none" }}>
                <ArrowLeft size={16} /> Back to site
              </Link>
              <span style={{ fontSize: 13, color: "#9ca3af" }}>
                Already a member?{" "}
                <Link to="/donor/login" style={{ color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
              </span>
            </div>

            {/* ── step indicator — FIX: Fragment with key instead of bare <> ── */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 36 }}>
              {[1, 2].map((s, i) => (
                <Fragment key={s}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div className={`step-dot ${step > s ? "done" : step === s ? "active" : "inactive"}`}>
                      {step > s ? <CheckCircle size={18} /> : s}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 500, color: step === s ? "#7c3aed" : "#9ca3af" }}>
                      {s === 1 ? "Personal Info" : "Security"}
                    </span>
                  </div>
                  {i < 1 && (
                    <div style={{
                      flex: 1, height: 2,
                      background: step > 1 ? "#22c55e" : "#e5e7eb",
                      margin: "0 10px", marginBottom: 20,
                      transition: "background .4s",
                    }} />
                  )}
                </Fragment>
              ))}
            </div>

            {/* heading */}
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: 0 }}>
                {step === 1 ? "Create your account" : "Secure your account"}
              </h1>
              <p style={{ color: "#6b7280", marginTop: 6, fontSize: 15 }}>
                {step === 1 ? "Tell us a bit about yourself" : "Set a strong password to protect your account"}
              </p>
            </div>

            {/* success banner */}
            {success && (
              <div style={{ display: "flex", gap: 14, padding: "16px 18px", borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", marginBottom: 24 }}>
                <CheckCircle size={22} color="#16a34a" style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 700, color: "#15803d", margin: 0 }}>Account created! 🎉</p>
                  <p style={{ color: "#166534", fontSize: 13, marginTop: 4 }}>
                    Check your email to confirm your address. Redirecting to your dashboard…
                  </p>
                </div>
              </div>
            )}

            {/* error banner */}
            {error && (
              <div style={{ display: "flex", gap: 12, padding: "14px 16px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", marginBottom: 20 }}>
                <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 14, color: "#b91c1c", margin: 0 }}>{error}</p>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); if (step1Valid) setStep(2); }}>

              {/* ── STEP 1 ── */}
              {step === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                  {/* name row — FIX: Fragment with key on the map wrapper div */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {(["firstName", "lastName"] as const).map((field, i) => (
                      <div key={field}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                          {i === 0 ? "First Name" : "Last Name"} *
                        </label>
                        <div style={{ position: "relative" }}>
                          <User size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                          <input
                            className="reg-input"
                            name={field}
                            value={formData[field]}
                            onChange={handle}
                            placeholder={i === 0 ? "John" : "Doe"}
                            required
                            autoComplete={i === 0 ? "given-name" : "family-name"}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* email */}
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                      Email Address *
                    </label>
                    <div style={{ position: "relative" }}>
                      <Mail size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                      <input
                        className="reg-input"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handle}
                        placeholder="john.doe@example.com"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* phone */}
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                      Phone Number <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <Phone size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                      <input
                        className="reg-input"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handle}
                        placeholder="+1 (234) 567-8900"
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  {/* address */}
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                      Address <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <MapPin size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                      <input
                        className="reg-input"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handle}
                        placeholder="123 Main St, City, Country"
                        autoComplete="street-address"
                      />
                    </div>
                  </div>

                  <button type="submit" className="reg-btn" disabled={!step1Valid} style={{ marginTop: 6 }}>
                    Continue <ArrowRight size={18} />
                  </button>
                </div>
              )}

              {/* ── STEP 2 ── */}
              {step === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                  {/* password */}
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                      Password *
                    </label>
                    <div style={{ position: "relative" }}>
                      <Lock size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                      <input
                        className="reg-input"
                        type={showPw ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handle}
                        placeholder="Min. 6 characters"
                        required
                        autoComplete="new-password"
                        style={{ paddingRight: 44 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(p => !p)}
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}
                      >
                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {/* strength bar */}
                    {formData.password && (
                      <div style={{ marginTop: 10 }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          {[1, 2, 3, 4].map(i => (
                            <div
                              key={i}
                              className="pw-bar"
                              style={{ flex: 1, background: i <= pwStrength ? strengthColor[pwStrength] : "#e5e7eb" }}
                            />
                          ))}
                        </div>
                        <p style={{ fontSize: 12, marginTop: 5, color: strengthColor[pwStrength], fontWeight: 600 }}>
                          {strengthLabel[pwStrength]} password
                        </p>
                      </div>
                    )}
                  </div>

                  {/* confirm password */}
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                      Confirm Password *
                    </label>
                    <div style={{ position: "relative" }}>
                      <Lock size={17} color="#9ca3af" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                      <input
                        className={`reg-input${formData.confirmPassword && formData.confirmPassword !== formData.password ? " error" : ""}`}
                        type={showCpw ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handle}
                        placeholder="Re-enter password"
                        required
                        autoComplete="new-password"
                        style={{ paddingRight: 44 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCpw(p => !p)}
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}
                      >
                        {showCpw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                      <p style={{ fontSize: 12, color: "#ef4444", marginTop: 5 }}>Passwords do not match</p>
                    )}
                    {formData.confirmPassword && formData.confirmPassword === formData.password && (
                      <p style={{ fontSize: 12, color: "#16a34a", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
                        <CheckCircle size={13} /> Passwords match
                      </p>
                    )}
                  </div>

                  {/* password rules — FIX: key on the outer div, not inside a fragment */}
                  <div style={{ padding: "14px 16px", borderRadius: 10, background: "#f5f3ff", border: "1px solid #ede9fe" }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#6d28d9", marginBottom: 8 }}>Password requirements:</p>
                    {([
                      ["At least 6 characters", formData.password.length >= 6],
                      ["One uppercase letter", /[A-Z]/.test(formData.password)],
                      ["One number", /[0-9]/.test(formData.password)],
                      ["One special character (!@#$…)", /[^A-Za-z0-9]/.test(formData.password)],
                    ] as [string, boolean][]).map(([label, met]) => (
                      <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <div style={{
                          width: 14, height: 14, borderRadius: "50%",
                          background: met ? "#22c55e" : "#e5e7eb",
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                          {met && <CheckCircle size={10} color="#fff" />}
                        </div>
                        <span style={{ fontSize: 12, color: met ? "#15803d" : "#6b7280" }}>{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* terms */}
                  <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={e => setAgreed(e.target.checked)}
                      style={{ width: 16, height: 16, accentColor: "#7c3aed", marginTop: 2, flexShrink: 0 }}
                    />
                    <span style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5 }}>
                      I agree to the{" "}
                      <a href="/terms" style={{ color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>Terms of Service</a>
                      {" "}and{" "}
                      <a href="/privacy" style={{ color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>Privacy Policy</a>
                    </span>
                  </label>

                  {/* trust badge */}
                  <div className="trust-badge">
                    <Shield size={16} />
                    <span>Your data is encrypted and never shared with third parties.</span>
                  </div>

                  {/* actions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                    <button type="submit" className="reg-btn" disabled={!step2Valid || loading || success}>
                      {loading ? (
                        <>
                          <div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                          Creating account…
                        </>
                      ) : success ? (
                        <><CheckCircle size={18} /> Account Created!</>
                      ) : (
                        <><Sparkles size={18} /> Create My Account</>
                      )}
                    </button>
                    <button
                      type="button"
                      className="reg-btn-outline"
                      onClick={() => { setStep(1); setError(null); }}
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* footer */}
            <p style={{ marginTop: 28, textAlign: "center", fontSize: 13, color: "#9ca3af" }}>
              © {new Date().getFullYear()} Cross-Borders Outreach Ministry Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}