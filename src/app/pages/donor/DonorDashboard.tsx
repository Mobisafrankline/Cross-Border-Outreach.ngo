import { useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router";
import {
  Heart, DollarSign, Calendar, TrendingUp, Download,
  Eye, Gift, Award, LogOut, Loader2, AlertCircle,
  Star, ChevronRight, Activity, X,
  BarChart3, Folder, FileText, RefreshCw,
  LayoutDashboard, History, Target, BookOpen,
  CheckCircle2, CreditCard, Sparkles,
} from "lucide-react";
import { useAuth } from "../../../lib/AuthContext";
import {
  getDonorProfile, getDonorDonations, signOut,
  getEventArchives, getReports, getGalleryImages, getArticles
} from "../../../lib/supabase";
import type { Donor, Donation, EventArchive, Report, GalleryImage, Article } from "../../../lib/supabase";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe, isStripeConfigured } from "../../../lib/stripe";
import PaymentForm from "../../components/PaymentForm";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell, RadialBarChart, RadialBar
} from "recharts";
import "../../../styles/portal.css";

/* ── Count-up ──────────────────────────────────────────── */
function CountUp({ to, prefix="", suffix="", decimals=0, duration=1200 }: { to:number; prefix?:string; suffix?:string; decimals?:number; duration?:number }) {
  const [val, setVal] = useState(0);
  const rafRef = useRef<number>();
  useEffect(() => {
    let start: number | null = null;
    const tick = (ts:number) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setVal(to * ease);
      if (prog < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [to, duration]);
  const display = decimals > 0 ? val.toFixed(decimals) : Math.floor(val).toLocaleString();
  return <span>{prefix}{display}{suffix}</span>;
}

/* ── Constants ─────────────────────────────────────────── */
const TIERS = [
  { name:"Bronze", threshold:0,    color:"from-slate-600 to-slate-800", ring:"#64748b", emoji:"🥉" },
  { name:"Silver", threshold:1000, color:"from-blue-500 to-blue-700",   ring:"#0959d6", emoji:"🥈" },
  { name:"Gold",   threshold:5000, color:"from-slate-900 to-blue-900",  ring:"#111827", emoji:"🥇" },
];

const PROGRAM_COLORS: Record<string, string> = {
  "Food Support Program":  "#0959d6",
  "Education Initiative":  "#0648b3",
  "Healthcare Outreach":   "#2f7aee",
  "Economic Empowerment":  "#111827",
};

const IMPACT_MAP: Record<string, { label:string; icon:string; multiplier:number }> = {
  "Food Support Program":  { label:"Meals Provided",     icon:"🍽️", multiplier:0.5  },
  "Education Initiative":  { label:"Students Supported", icon:"📚", multiplier:0.04 },
  "Healthcare Outreach":   { label:"Medical Checkups",   icon:"🏥", multiplier:0.05 },
  "Economic Empowerment":  { label:"Businesses Started", icon:"💼", multiplier:0.01 },
};

type Tab = "overview" | "donations" | "impact" | "resources";

const PROGRAM_AMOUNTS = [50, 100, 250, 500];

/* ── Helpers ───────────────────────────────────────────── */
function statusBadge(status: string) {
  const map: Record<string, { bg:string; color:string }> = {
    completed: { bg:"#f0fdf4", color:"#16a34a" },
    pending:   { bg:"#fffbeb", color:"#d97706" },
    failed:    { bg:"#fef2f2", color:"#dc2626" },
  };
  const s = map[status] ?? { bg:"#f8fafc", color:"#64748b" };
  return (
    <span style={{padding:"3px 10px",borderRadius:999,fontSize:12,fontWeight:600,background:s.bg,color:s.color,textTransform:"capitalize"}}>
      {status}
    </span>
  );
}

export default function DonorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");

  const [donor,          setDonor]          = useState<Donor | null>(null);
  const [donations,      setDonations]      = useState<Donation[]>([]);
  const [eventArchives,  setEventArchives]  = useState<EventArchive[]>([]);
  const [orgReports,     setOrgReports]     = useState<Report[]>([]);
  const [galleryImages,  setGalleryImages]  = useState<GalleryImage[]>([]);
  const [projectUpdates, setProjectUpdates] = useState<Article[]>([]);
  const [dataLoading,    setDataLoading]    = useState(true);
  const [error,          setError]          = useState<string | null>(null);

  // Donation modal
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [donateFrequency,   setDonateFrequency]   = useState<"one-time"|"monthly">("one-time");
  const [donateAmount,      setDonateAmount]       = useState<number>(50);
  const [customAmount,      setCustomAmount]       = useState<string>("");

  // Donations tab filter
  const [filterStatus,  setFilterStatus]  = useState<string>("all");
  const [filterProgram, setFilterProgram] = useState<string>("all");
  const [sortAsc,       setSortAsc]       = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setDataLoading(true);
      const [profileRes, donationsRes, archivesRes, reportsRes, galleryRes, articlesRes] =
        await Promise.all([
          getDonorProfile(user.id),
          getDonorDonations(user.id),
          getEventArchives(),
          getReports(),
          getGalleryImages(),
          getArticles(undefined, "published"),
        ]);
      if (profileRes.error) setError(profileRes.error.message);
      else setDonor(profileRes.data);
      if (!donationsRes.error) setDonations(donationsRes.data ?? []);
      if (!archivesRes.error)  setEventArchives(archivesRes.data ?? []);
      if (!reportsRes.error)   setOrgReports(reportsRes.data ?? []);
      if (!galleryRes.error)   setGalleryImages(galleryRes.data ?? []);
      if (!articlesRes.error)  setProjectUpdates(articlesRes.data?.slice(0,3) ?? []);
      setDataLoading(false);
    };
    load();
  }, [user]);

  /* ── Computed ──────────────────────────────────────────── */
  const completedDonations = useMemo(() => donations.filter(d => d.status === "completed"), [donations]);
  const totalDonated = donor?.total_donated ?? 0;

  // Tier
  const tierIndex = [...TIERS].findLastIndex(t => totalDonated >= t.threshold);
  const currentTier = TIERS[Math.max(tierIndex, 0)];
  const nextTier = TIERS[Math.min(tierIndex + 1, TIERS.length - 1)];
  const tierProgress = nextTier && nextTier !== currentTier
    ? Math.min(100, ((totalDonated - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)) * 100)
    : 100;

  // Distribution chart
  const distributionData = useMemo(() => {
    const map: Record<string, number> = {};
    completedDonations.forEach(d => { map[d.program] = (map[d.program] || 0) + d.amount; });
    return Object.entries(map).map(([name, amount]) => ({ name: name.split(" ")[0], fullName: name, amount }));
  }, [completedDonations]);

  // Monthly area chart
  const monthlyData = useMemo(() => {
    const map: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString("default", { month:"short" });
      map[key] = 0;
    }
    completedDonations.forEach(d => {
      const key = new Date(d.date).toLocaleString("default", { month:"short" });
      if (key in map) map[key] += d.amount;
    });
    return Object.entries(map).map(([month, amount]) => ({ month, amount }));
  }, [completedDonations]);

  // Impact stats
  const impactStats = useMemo(() =>
    Object.entries(IMPACT_MAP).map(([program, info]) => {
      const total = completedDonations.filter(d => d.program === program).reduce((s,d) => s+d.amount, 0);
      return { ...info, program, total, value: Math.round(total * info.multiplier) };
    })
  , [completedDonations]);

  // Filtered donations (for Donations tab)
  const filteredDonations = useMemo(() => {
    let list = [...donations];
    if (filterStatus  !== "all") list = list.filter(d => d.status  === filterStatus);
    if (filterProgram !== "all") list = list.filter(d => d.program === filterProgram);
    list.sort((a,b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortAsc ? diff : -diff;
    });
    return list;
  }, [donations, filterStatus, filterProgram, sortAsc]);

  const allPrograms = [...new Set(donations.map(d => d.program))];

  const donorName   = donor ? `${donor.first_name} ${donor.last_name}` : user?.user_metadata?.first_name ? `${user.user_metadata.first_name} ${user.user_metadata.last_name||""}` : "Valued Donor";
  const firstName   = donor?.first_name || user?.user_metadata?.first_name || "Donor";

  /* ── Receipt helpers ───────────────────────────────────── */
  const generateSingleReceipt = (don: Donation) => {
    const win = window.open("","_blank");
    if (!win) return;
    win.document.write(`<html><head><title>Receipt</title><style>body{font-family:system-ui;max-width:680px;margin:0 auto;padding:40px;color:#111}.header{text-align:center;border-bottom:2px solid #e5e7eb;padding-bottom:20px;margin-bottom:30px}.row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px dashed #e5e7eb}.footer{margin-top:50px;font-size:13px;color:#6b7280;text-align:center;border-top:1px solid #e5e7eb;padding-top:20px}</style></head><body>
      <div class="header"><h2>Official Donation Receipt</h2><p>Cross-Borders Outreach · Tax ID: 12-3456789</p></div>
      <div style="margin-bottom:24px"><strong>Donor:</strong> ${donorName}<br><strong>Email:</strong> ${user?.email}</div>
      <div class="row"><span>Receipt ID</span><strong>${don.id||"N/A"}</strong></div>
      <div class="row"><span>Date</span><strong>${new Date(don.date).toLocaleDateString()}</strong></div>
      <div class="row"><span>Program</span><strong>${don.program}</strong></div>
      <div class="row"><span>Amount</span><strong>$${don.amount.toFixed(2)}</strong></div>
      <div class="row"><span>Payment</span><strong style="text-transform:capitalize">${don.payment_method}</strong></div>
      <p style="margin-top:24px;font-size:14px;line-height:1.6">Thank you for your generous contribution. No goods or services were provided in exchange.</p>
      <div class="footer">Cross-Borders Outreach is a registered 501(c)(3) non-profit organization.</div>
    </body></html>`);
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 250);
  };

  /* ── Loading ───────────────────────────────────────────── */
  if (authLoading || dataLoading) return (
    <div className="flex-1 h-full bg-slate-50 flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-3xl flex items-center justify-center shadow-lg"
          style={{background:"linear-gradient(135deg,#0648b3,#0959d6)",boxShadow:"0 8px 24px rgba(9,89,214,.35)"}}>
          <Loader2 className="w-8 h-8 text-white animate-spin"/>
        </div>
        <p className="text-slate-500 font-medium">Loading your dashboard…</p>
      </div>
    </div>
  );

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex-1 bg-slate-50 pb-12 portal-fade-in" style={{fontFamily:"'Inter',sans-serif"}}>

      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0" style={{background:"linear-gradient(135deg,#0648b3,#0959d6,#0648b3)"}}/>
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"/>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-300 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"/>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1">{greeting} 👋</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Welcome, <span style={{color:"#fcc526"}}>{firstName}</span>
              </h1>
              <p className="text-blue-200/70 text-sm mt-2">Your generosity is changing lives across 38+ nations.</p>
            </div>
            <button
              onClick={() => setIsDonateModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl transition-all flex-shrink-0"
              style={{background:"#111827",boxShadow:"0 6px 20px rgba(17,24,39,.30)"}}
            >
              <Sparkles className="w-4 h-4"/> Donate Now
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0"/> {error}
          </div>
        )}

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label:"Total Given",    value:totalDonated,         prefix:"$", suffix:"",    icon:Heart,    grad:"from-blue-500 to-blue-700"   },
            { label:"Donations Made", value:donor?.donation_count??0, prefix:"", suffix:"", icon:CreditCard, grad:"from-blue-600 to-blue-800"   },
            { label:"Tier",           value:0,                    prefix:"",  suffix:"",    icon:Award,    grad:"from-slate-700 to-slate-900", tierOverride:true },
            { label:"Impact Score",   value:Math.round(totalDonated * 0.12), prefix:"", suffix:" pts", icon:Target, grad:"from-blue-700 to-blue-900" },
          ].map((s, i) => (
            <div key={s.label} className="portal-stat-card" style={{animationDelay:`${i*80}ms`}}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.grad} flex items-center justify-center shadow-md flex-shrink-0`}>
                  <s.icon className="w-4 h-4 text-white"/>
                </div>
              </div>
              {s.tierOverride ? (
                <div>
                  <div className="text-2xl font-black text-slate-900 mb-0.5">{currentTier.emoji} {currentTier.name}</div>
                  {nextTier !== currentTier && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>{currentTier.name}</span>
                        <span>{nextTier.name}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{width:`${tierProgress}%`,background:`linear-gradient(90deg,${currentTier.ring},${nextTier.ring})`}}/>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
                  <CountUp to={s.value} prefix={s.prefix} suffix={s.suffix} duration={1200+i*150}/>
                </div>
              )}
              <p className="text-sm text-slate-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Tab Bar ── */}
        <div className="portal-tabs">
          {([
            { id:"overview",   label:"Overview",   icon:LayoutDashboard },
            { id:"donations",  label:"Donations",  icon:History         },
            { id:"impact",     label:"My Impact",  icon:Activity        },
            { id:"resources",  label:"Resources",  icon:Folder          },
          ] as { id:Tab; label:string; icon:any }[]).map(t => (
            <button key={t.id} className={`portal-tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>
              <t.icon style={{width:15,height:15}}/> {t.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab==="overview" && (
          <div className="grid lg:grid-cols-2 gap-6 portal-fade-in">
            {/* Giving trend */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 mb-4">Giving Trend</h2>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={monthlyData} margin={{top:4,right:4,left:-22,bottom:0}}>
                  <defs>
                    <linearGradient id="donorGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#0959d6" stopOpacity={0.18}/>
                      <stop offset="95%" stopColor="#0959d6" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                  <XAxis dataKey="month" tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`}/>
                  <Tooltip formatter={(v:any) => [`$${v}`, "Donated"]} contentStyle={{borderRadius:10,border:"1px solid #e2e8f0",fontSize:13}}/>
                  <Area type="monotone" dataKey="amount" stroke="#0959d6" strokeWidth={2.5} fill="url(#donorGrad)" dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Recent donations */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                <h2 className="font-bold text-slate-900">Recent Donations</h2>
                <button onClick={() => setTab("donations")} className="text-sm text-blue-600 font-semibold flex items-center gap-1 hover:text-blue-700">
                  See all <ChevronRight className="w-4 h-4"/>
                </button>
              </div>
              {donations.length === 0 ? (
                <div className="p-8 text-center">
                  <Heart className="w-10 h-10 text-slate-200 mx-auto mb-3"/>
                  <p className="text-slate-500 font-medium">No donations yet</p>
                  <p className="text-slate-400 text-sm mt-1">Make your first donation to get started</p>
                  <button onClick={() => setIsDonateModalOpen(true)} className="mt-4 px-4 py-2 rounded-xl text-white text-sm font-semibold" style={{background:"#0959d6"}}>
                    Donate Now
                  </button>
                </div>
              ) : donations.slice(0,5).map(d => (
                <div key={d.id} className="portal-activity-row">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{background:"#eff6ff"}}>
                    <Heart className="w-4 h-4 text-blue-500"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{d.program}</p>
                    <p className="text-xs text-slate-400">{new Date(d.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-bold text-slate-900">${d.amount.toLocaleString()}</span>
                    {statusBadge(d.status)}
                  </div>
                </div>
              ))}
            </div>

            {/* Tier card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 mb-4">Donor Tier Status</h2>
              <div className={`rounded-xl bg-gradient-to-br ${currentTier.color} p-5 text-white mb-4`}>
                <div className="text-3xl mb-1">{currentTier.emoji}</div>
                <div className="font-black text-2xl">{currentTier.name} Donor</div>
                <div className="opacity-75 text-sm mt-1">${totalDonated.toLocaleString()} total contributed</div>
              </div>
              {nextTier !== currentTier && (
                <div>
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>Progress to <strong>{nextTier.name}</strong></span>
                    <span className="font-bold">{Math.round(tierProgress)}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{width:`${tierProgress}%`,background:`linear-gradient(90deg,${currentTier.ring},${nextTier.ring})`}}/>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    ${Math.max(0, nextTier.threshold - totalDonated).toLocaleString()} more to reach {nextTier.name} tier
                  </p>
                </div>
              )}
              {nextTier === currentTier && (
                <div className="flex items-center gap-2 text-amber-600 text-sm font-semibold">
                  <Star className="w-4 h-4 fill-current"/> You've reached the highest tier! Thank you.
                </div>
              )}
            </div>

            {/* Latest updates */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-50">
                <h2 className="font-bold text-slate-900">Latest Updates</h2>
              </div>
              {projectUpdates.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">No updates yet</div>
              ) : projectUpdates.map(article => (
                <div key={article.id} className="portal-activity-row">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-blue-500"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{article.title}</p>
                    <p className="text-xs text-slate-400">{article.category}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300"/>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── DONATIONS TAB ── */}
        {tab==="donations" && (
          <div className="portal-fade-in space-y-4">
            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className="flex flex-wrap gap-3 items-center">
                <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-400" style={{background:"#f8fafc"}}>
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                <select value={filterProgram} onChange={e=>setFilterProgram(e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-400" style={{background:"#f8fafc"}}>
                  <option value="all">All Programs</option>
                  {allPrograms.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <button onClick={()=>setSortAsc(s=>!s)} className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors" style={{background:"#f8fafc"}}>
                  {sortAsc ? "Oldest first" : "Newest first"}
                </button>
                <div className="ml-auto text-sm text-slate-500 font-medium">{filteredDonations.length} results</div>
              </div>
            </div>

            {/* Table */}
            {filteredDonations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
                <History className="w-12 h-12 text-slate-200 mx-auto mb-3"/>
                <p className="text-slate-500 font-semibold">No donations found</p>
                <p className="text-slate-400 text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{background:"#f8fafc",borderBottom:"1px solid #f1f5f9"}}>
                        <th className="text-left px-5 py-3 font-semibold text-slate-500">Date</th>
                        <th className="text-left px-5 py-3 font-semibold text-slate-500">Program</th>
                        <th className="text-left px-5 py-3 font-semibold text-slate-500">Amount</th>
                        <th className="text-left px-5 py-3 font-semibold text-slate-500">Status</th>
                        <th className="text-left px-5 py-3 font-semibold text-slate-500">Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDonations.map(d => (
                        <tr key={d.id} style={{borderBottom:"1px solid #f8fafc"}} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-3.5 text-slate-600">{new Date(d.date).toLocaleDateString()}</td>
                          <td className="px-5 py-3.5">
                            <span className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:PROGRAM_COLORS[d.program]??"#94a3b8"}}/>
                              <span className="text-slate-700 font-medium">{d.program}</span>
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-bold text-slate-900">${d.amount.toLocaleString()}</td>
                          <td className="px-5 py-3.5">{statusBadge(d.status)}</td>
                          <td className="px-5 py-3.5">
                            {d.status==="completed" ? (
                              <button onClick={()=>generateSingleReceipt(d)} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                                <Download className="w-3.5 h-3.5"/> PDF
                              </button>
                            ) : <span className="text-slate-300">—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── IMPACT TAB ── */}
        {tab==="impact" && (
          <div className="portal-fade-in space-y-6">
            {/* Impact cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {impactStats.map((s,i) => (
                <div key={s.program} className="portal-stat-card text-center" style={{animationDelay:`${i*80}ms`}}>
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="text-2xl font-black text-slate-900">
                    <CountUp to={s.value} duration={1400+i*100}/>
                  </div>
                  <p className="text-sm text-slate-500 font-medium mt-1">{s.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.program.split(" ")[0]}</p>
                </div>
              ))}
            </div>

            {/* Program distribution bar chart */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 mb-5">Giving by Program</h2>
              {distributionData.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No data yet — make a donation to see your impact</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={distributionData} margin={{top:4,right:4,left:-14,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                    <XAxis dataKey="name" tick={{fontSize:12,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fontSize:12,fill:"#94a3b8"}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`}/>
                    <Tooltip formatter={(v:any,_:any,props:any) => [`$${v.toLocaleString()}`, props.payload.fullName]} contentStyle={{borderRadius:10,border:"1px solid #e2e8f0",fontSize:13}}/>
                    <Bar dataKey="amount" radius={[6,6,0,0]}>
                      {distributionData.map((entry) => (
                        <Cell key={entry.name} fill={PROGRAM_COLORS[entry.fullName] ?? "#3b82f6"}/>
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Impact narrative */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6"/>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Your Combined Impact</h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    Through your <strong className="text-white">${totalDonated.toLocaleString()}</strong> in contributions, you've helped provide meals, support education, enable healthcare access, and empower communities across 38+ countries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── RESOURCES TAB ── */}
        {tab==="resources" && (
          <div className="portal-fade-in grid lg:grid-cols-2 gap-6">
            {/* Reports */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                <h2 className="font-bold text-slate-900 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-blue-500"/> Organization Reports</h2>
              </div>
              {orgReports.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">No reports available</div>
              ) : orgReports.slice(0,5).map(r => (
                <a key={r.id} href={r.file_url} target="_blank" rel="noopener noreferrer" className="portal-activity-row flex-row no-underline" style={{display:"flex",textDecoration:"none"}}>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-blue-500"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{r.title}</p>
                    <p className="text-xs text-slate-400">{r.category} · {r.year}</p>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 flex-shrink-0"/>
                </a>
              ))}
            </div>

            {/* Event Archives */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-50">
                <h2 className="font-bold text-slate-900 flex items-center gap-2"><Calendar className="w-5 h-5 text-purple-500"/> Event Archives</h2>
              </div>
              {eventArchives.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">No event archives</div>
              ) : eventArchives.slice(0,5).map(e => (
                <a key={e.id} href={e.drive_url} target="_blank" rel="noopener noreferrer" className="portal-activity-row" style={{display:"flex",textDecoration:"none"}}>
                  <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-purple-500"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{e.title}</p>
                    <p className="text-xs text-slate-400">{new Date(e.date).toLocaleDateString()}</p>
                  </div>
                  <Eye className="w-4 h-4 text-slate-400 flex-shrink-0"/>
                </a>
              ))}
            </div>

            {/* Gallery */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden lg:col-span-2">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                <h2 className="font-bold text-slate-900">Gallery Highlights</h2>
                <Link to="/gallery" className="text-sm text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4"/>
                </Link>
              </div>
              {galleryImages.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">No images yet</div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 p-4">
                  {galleryImages.slice(0,12).map(img => (
                    <div key={img.id} className="aspect-square rounded-xl overflow-hidden bg-slate-100">
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Donate Modal ── */}
      {isDonateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(6,72,179,.6)",backdropFilter:"blur(4px)"}}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md portal-fade-in overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900 text-lg">Make a Donation</h2>
                <p className="text-sm text-slate-500 mt-0.5">Choose your program and amount</p>
              </div>
              <button onClick={()=>setIsDonateModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5"/>
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Frequency */}
              <div className="portal-tabs" style={{marginBottom:0}}>
                <button className={`portal-tab ${donateFrequency==="one-time"?"active":""}`} onClick={()=>setDonateFrequency("one-time")}>One-time</button>
                <button className={`portal-tab ${donateFrequency==="monthly"?"active":""}`} onClick={()=>setDonateFrequency("monthly")}>Monthly</button>
              </div>
              {/* Amounts */}
              <div className="grid grid-cols-4 gap-2">
                {PROGRAM_AMOUNTS.map(amt => (
                  <button key={amt} onClick={()=>{setDonateAmount(amt);setCustomAmount("");}}
                    className="py-3 rounded-xl font-bold text-sm transition-all border-2"
                    style={{borderColor:donateAmount===amt&&!customAmount?"#0959d6":"#e5e7eb",background:donateAmount===amt&&!customAmount?"#eff6ff":"#f8fafc",color:donateAmount===amt&&!customAmount?"#0959d6":"#64748b"}}>
                    ${amt}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Custom amount ($)"
                value={customAmount}
                onChange={e=>{setCustomAmount(e.target.value);setDonateAmount(Number(e.target.value));}}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-blue-500"
                style={{fontFamily:"'Inter',sans-serif"}}
              />
              {isStripeConfigured ? (
                <Elements stripe={getStripe()}>
                  <PaymentForm
                    amount={donateAmount}
                    frequency={donateFrequency}
                    onSuccess={()=>setIsDonateModalOpen(false)}
                    onClose={()=>setIsDonateModalOpen(false)}
                  />
                </Elements>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-sm font-medium">
                  Payment processing not configured.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
