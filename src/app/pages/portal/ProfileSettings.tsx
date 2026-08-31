import { useState, useEffect, useRef } from "react";
import {
  User, Mail, Phone, MapPin, Lock, Save,
  Loader2, ShieldCheck, Heart, Camera,
  Bell, AlertTriangle, CheckCircle2, Eye, EyeOff,
} from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { toast } from "sonner";
import "../../../styles/portal.css";

type Role = "donor" | "admin";

export default function ProfileSettings() {
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [userId,   setUserId]   = useState<string | null>(null);
  const [userRole, setUserRole] = useState<Role>("donor");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", address: "",
    notifications: { email: true, sms: false, newsletter: true },
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: "", confirmPassword: "",
  });
  const [showNewPw, setShowNewPw] = useState(false);
  const [showCPw,   setShowCPw]  = useState(false);
  const [savingPw,  setSavingPw] = useState(false);

  /* ── Load profile ───────────────────────────────────────── */
  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const [donorRes, adminRes] = await Promise.all([
        supabase.from("donors").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("admins").select("*").eq("id", user.id).maybeSingle(),
      ]);

      const profileData = donorRes.data ?? adminRes.data;
      if (adminRes.data && !donorRes.data) setUserRole("admin");

      setAvatarUrl(profileData?.avatar_url ?? null);
      setFormData(prev => ({
        ...prev,
        firstName:    profileData?.first_name  || user.user_metadata?.first_name  || "",
        lastName:     profileData?.last_name   || user.user_metadata?.last_name   || "",
        email:        user.email               || "",
        phone:        profileData?.phone       || "",
        address:      profileData?.address     || profileData?.location || "",
        notifications: {
          email:       profileData?.notify_email     ?? true,
          sms:         profileData?.notify_sms       ?? false,
          newsletter:  profileData?.notify_newsletter ?? true,
        },
      }));
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ── Avatar upload ──────────────────────────────────────── */
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploading(true);
    const ext  = file.name.split(".").pop();
    const path = `avatars/${userId}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from("images").upload(path, file, { upsert: true });
    if (uploadErr) { toast.error("Failed to upload avatar: " + uploadErr.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(path);
    const table = userRole === "admin" ? "admins" : "donors";
    await supabase.from(table).update({ avatar_url: publicUrl }).eq("id", userId);
    setAvatarUrl(publicUrl + "?t=" + Date.now());
    toast.success("Profile photo updated!");
    setUploading(false);
  };

  /* ── Save profile ───────────────────────────────────────── */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    const updates = {
      first_name:         formData.firstName,
      last_name:          formData.lastName,
      phone:              formData.phone || null,
      address:            formData.address || null,
      notify_email:       formData.notifications.email,
      notify_sms:         formData.notifications.sms,
      notify_newsletter:  formData.notifications.newsletter,
    };
    const table = userRole === "admin" ? "admins" : "donors";
    const { error } = await supabase.from(table).update(updates).eq("id", userId);
    setSaving(false);
    if (error) { toast.error("Failed to save: " + error.message); return; }
    toast.success("Profile updated successfully!");
  };

  /* ── Change password ───────────────────────────────────── */
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) { toast.error("Passwords do not match."); return; }
    if (passwordData.newPassword.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    setSavingPw(true);
    const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });
    setSavingPw(false);
    if (error) { toast.error("Failed to update password: " + error.message); return; }
    toast.success("Password updated successfully!");
    setPasswordData({ newPassword:"", confirmPassword:"" });
  };

  const initials = [formData.firstName, formData.lastName].filter(Boolean).map(s => s[0]).join("").toUpperCase();

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin"/>
    </div>
  );

  const sectionClass = "bg-white rounded-2xl border border-slate-100 shadow-sm p-6";
  const labelClass   = "block text-sm font-semibold text-slate-700 mb-1.5";
  const inputClass   = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all";

  return (
    <div className="flex-1 bg-slate-50 pb-12 portal-fade-in" style={{ fontFamily:"'Inter',sans-serif" }}>

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0" style={{background:userRole==="admin"?"linear-gradient(135deg,#0f172a,#1e3a8a)":"linear-gradient(135deg,#0648b3,#0959d6)"}}/>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl font-bold text-white">Account Settings</h1>
          <p className="text-blue-200 text-sm mt-1">
            {userRole === "admin" ? "Administrator Profile" : "Donor Profile"} · {formData.email}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── Avatar + Name ── */}
        <div className={sectionClass}>
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="portal-avatar"
                style={{width:80,height:80,fontSize:26,borderRadius:20,background:avatarUrl?"transparent":userRole==="admin"?"linear-gradient(135deg,#3b82f6,#8b5cf6)":"linear-gradient(135deg,#0959d6,#2f7aee)",overflow:"hidden",boxShadow:"0 4px 16px rgba(59,130,246,.3)"}}
              >
                {avatarUrl
                  ? <img src={avatarUrl} alt="avatar" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  : (initials || (userRole==="admin" ? <ShieldCheck className="w-8 h-8 text-white"/> : <Heart className="w-8 h-8 text-white fill-current"/>))}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-md transition-all hover:scale-110"
                style={{background:"#0959d6"}}
                title="Upload photo"
              >
                {uploading ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin"/> : <Camera className="w-3.5 h-3.5 text-white"/>}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange}/>
            </div>

            <div className="flex-1">
              <h2 className="font-bold text-slate-900 text-xl">{formData.firstName} {formData.lastName}</h2>
              <p className="text-slate-500 text-sm mt-0.5">{formData.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{background:userRole==="admin"?"#eff6ff":"#eff6ff",color:userRole==="admin"?"#1d4ed8":"#0959d6"}}>
                  {userRole === "admin" ? "🛡 Administrator" : "💙 Donor"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Profile form ── */}
        <div className={sectionClass}>
          <h3 className="font-bold text-slate-900 text-base mb-5 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500"/> Personal Information
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>First Name</label>
                <div className="relative">
                  <User size={15} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                  <input className={inputClass} style={{paddingLeft:40}} name="firstName" value={formData.firstName} onChange={e=>setFormData(p=>({...p,firstName:e.target.value}))} placeholder="John" required/>
                </div>
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <div className="relative">
                  <User size={15} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                  <input className={inputClass} style={{paddingLeft:40}} name="lastName" value={formData.lastName} onChange={e=>setFormData(p=>({...p,lastName:e.target.value}))} placeholder="Doe" required/>
                </div>
              </div>
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <Mail size={15} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                <input className={inputClass + " bg-slate-50"} style={{paddingLeft:40}} type="email" value={formData.email} readOnly disabled/>
              </div>
              <p className="text-xs text-slate-400 mt-1">Email cannot be changed here. Contact support if needed.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Phone</label>
                <div className="relative">
                  <Phone size={15} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                  <input className={inputClass} style={{paddingLeft:40}} type="tel" value={formData.phone} onChange={e=>setFormData(p=>({...p,phone:e.target.value}))} placeholder="+1 (234) 567-8900"/>
                </div>
              </div>
              <div>
                <label className={labelClass}>Address</label>
                <div className="relative">
                  <MapPin size={15} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                  <input className={inputClass} style={{paddingLeft:40}} value={formData.address} onChange={e=>setFormData(p=>({...p,address:e.target.value}))} placeholder="City, Country"/>
                </div>
              </div>
            </div>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 text-white font-bold text-sm rounded-xl transition-all disabled:opacity-60"
              style={{background:saving?"#94a3b8":"#0959d6",boxShadow:"0 4px 14px rgba(9,89,214,.3)"}}>
              {saving ? <><Loader2 className="w-4 h-4 animate-spin"/> Saving…</> : <><Save className="w-4 h-4"/> Save Changes</>}
            </button>
          </form>
        </div>

        {/* ── Notifications ── */}
        <div className={sectionClass}>
          <h3 className="font-bold text-slate-900 text-base mb-5 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-500"/> Notification Preferences
          </h3>
          <div className="space-y-4">
            {[
              { key:"email",      label:"Email Notifications",      desc:"Receive donation confirmations and updates via email" },
              { key:"sms",        label:"SMS Notifications",         desc:"Receive text message alerts for important updates" },
              { key:"newsletter", label:"Newsletter",                desc:"Monthly newsletter with program updates and impact stories" },
            ].map(n => (
              <label key={n.key} className="flex items-start gap-4 cursor-pointer group">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={formData.notifications[n.key as keyof typeof formData.notifications]}
                    onChange={e => setFormData(p=>({...p,notifications:{...p.notifications,[n.key]:e.target.checked}}))}
                    className="sr-only"
                  />
                  <div
                    className="w-11 h-6 rounded-full transition-all duration-200 relative"
                    style={{background:formData.notifications[n.key as keyof typeof formData.notifications]?"#0959d6":"#d1d5db"}}
                    onClick={()=>setFormData(p=>({...p,notifications:{...p.notifications,[n.key]:!p.notifications[n.key as keyof typeof p.notifications]}}))}
                  >
                    <div
                      className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                      style={{transform:formData.notifications[n.key as keyof typeof formData.notifications]?"translateX(20px)":"translateX(0)"}}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{n.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{n.desc}</div>
                </div>
              </label>
            ))}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-5 flex items-center gap-2 px-5 py-2.5 text-white font-bold text-sm rounded-xl transition-all disabled:opacity-60"
            style={{background:"#0959d6"}}>
            {saving ? <><Loader2 className="w-4 h-4 animate-spin"/> Saving…</> : <><Save className="w-4 h-4"/> Save Preferences</>}
          </button>
        </div>

        {/* ── Change password ── */}
        <div className={sectionClass}>
          <h3 className="font-bold text-slate-900 text-base mb-5 flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-500"/> Change Password
          </h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className={labelClass}>New Password</label>
              <div className="relative">
                <Lock size={15} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                <input
                  className={inputClass}
                  style={{paddingLeft:40,paddingRight:44}}
                  type={showNewPw?"text":"password"}
                  value={passwordData.newPassword}
                  onChange={e=>setPasswordData(p=>({...p,newPassword:e.target.value}))}
                  placeholder="Min. 6 characters"
                  required
                />
                <button type="button" onClick={()=>setShowNewPw(v=>!v)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#6b7280"}}>
                  {showNewPw?<EyeOff size={17}/>:<Eye size={17}/>}
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>Confirm New Password</label>
              <div className="relative">
                <Lock size={15} color="#9ca3af" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}/>
                <input
                  className={inputClass + (passwordData.confirmPassword && passwordData.confirmPassword !== passwordData.newPassword ? " !border-red-400" : "")}
                  style={{paddingLeft:40,paddingRight:44}}
                  type={showCPw?"text":"password"}
                  value={passwordData.confirmPassword}
                  onChange={e=>setPasswordData(p=>({...p,confirmPassword:e.target.value}))}
                  placeholder="Re-enter new password"
                  required
                />
                <button type="button" onClick={()=>setShowCPw(v=>!v)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#6b7280"}}>
                  {showCPw?<EyeOff size={17}/>:<Eye size={17}/>}
                </button>
              </div>
              {passwordData.confirmPassword && passwordData.confirmPassword !== passwordData.newPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>
            <button type="submit" disabled={savingPw}
              className="flex items-center gap-2 px-6 py-2.5 text-white font-bold text-sm rounded-xl transition-all disabled:opacity-60"
              style={{background:savingPw?"#94a3b8":"#0f172a"}}>
              {savingPw ? <><Loader2 className="w-4 h-4 animate-spin"/> Updating…</> : <><Lock className="w-4 h-4"/> Update Password</>}
            </button>
          </form>
        </div>

        {/* ── Security info ── */}
        <div className={sectionClass} style={{borderColor:"#e0f2fe",background:"#f0f9ff"}}>
          <h3 className="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500"/> Security Info
          </h3>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500"/> Supabase email/password authentication</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500"/> All data encrypted at rest and in transit</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500"/> Session tokens automatically refreshed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
