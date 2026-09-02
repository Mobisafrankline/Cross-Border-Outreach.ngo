import { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import {
  Image, FileText, Users, Newspaper,
  TrendingUp, DollarSign, Calendar,
  BarChart3, Loader2, AlertCircle, RefreshCw,
  ArrowUpRight, Clock, Briefcase, FileSignature,
  Activity, Heart, ChevronRight, UserPlus, CreditCard,
} from "lucide-react";
import { useAuth } from "../../../lib/AuthContext";
import { supabase } from "../../../lib/supabase";
import type { Donor } from "../../../lib/supabase";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";
import "../../../styles/portal.css";

/* ── Animated count-up ─────────────────────────────────── */
function CountUp({ to, prefix = "", suffix = "", duration = 1200 }: { to: number; prefix?: string; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const rafRef = useRef<number>();
  useEffect(() => {
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setVal(Math.round(to * ease));
      if (prog < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [to, duration]);
  return <span>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ── Types ──────────────────────────────────────────────── */
interface DashboardStats {
  totalDonors: number;
  totalDonations: number;
  galleryImages: number;
  publishedArticles: number;
}
interface AdminProfile { first_name: string; last_name: string; }
interface ActivityItem {
  id: string;
  type: "donor" | "donation" | "application";
  label: string;
  sub: string;
  time: string;
  amount?: number;
}
interface MonthlyDonation { month: string; amount: number; }

/* ── Custom Tooltip ──────────────────────────────────────── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:"#1e293b",border:"1px solid rgba(255,255,255,.1)",borderRadius:10,padding:"10px 14px",color:"#fff",fontSize:13}}>
      <p style={{marginBottom:4,opacity:.7,fontSize:12}}>{label}</p>
      <p style={{fontWeight:700}}>${payload[0].value.toLocaleString()}</p>
    </div>
  );
};

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();

  const [stats,        setStats]        = useState<DashboardStats>({ totalDonors:0, totalDonations:0, galleryImages:0, publishedArticles:0 });
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [recentDonors, setRecentDonors] = useState<Donor[]>([]);
  const [activity,     setActivity]     = useState<ActivityItem[]>([]);
  const [monthlyData,  setMonthlyData]  = useState<MonthlyDonation[]>([]);
  const [dataLoading,  setDataLoading]  = useState(true);
  const [error,        setError]        = useState<string | null>(null);

  const loadData = async () => {
    setDataLoading(true);
    setError(null);
    try {
      const [donorsRes, donationsRes, imagesRes, articlesRes, adminRes, appsRes, recentDonationsRes] =
        await Promise.all([
          supabase.from("donors").select("*", { count:"exact" }).order("created_at", { ascending:false }),
          supabase.from("donations").select("amount,date,program").eq("status","completed"),
          supabase.from("gallery_images").select("id", { count:"exact", head:true }),
          supabase.from("articles").select("id", { count:"exact", head:true }).eq("status","published"),
          user ? supabase.from("admins").select("first_name,last_name").eq("id", user.id).maybeSingle() : Promise.resolve({ data:null }),
          supabase.from("applications").select("id,first_name,last_name,created_at,status").order("created_at",{ascending:false}).limit(5),
          supabase.from("donations").select("amount,date,donor_id,program").eq("status","completed").order("date",{ascending:false}).limit(5),
        ]);

      const totalDonations = (donationsRes.data ?? []).reduce((s:number, d:any) => s + (d.amount ?? 0), 0);

      setStats({
        totalDonors: donorsRes.count ?? 0,
        totalDonations,
        galleryImages: imagesRes.count ?? 0,
        publishedArticles: articlesRes.count ?? 0,
      });
      if (adminRes.data) setAdminProfile(adminRes.data);
      setRecentDonors((donorsRes.data ?? []).slice(0, 5));

      // Build activity feed
      const feed: ActivityItem[] = [];
      (recentDonationsRes.data ?? []).forEach((d:any) => {
        feed.push({
          id: `don-${d.donor_id}-${d.date}`,
          type: "donation",
          label: `Donation — ${d.program ?? "General"}`,
          sub: `$${d.amount?.toLocaleString()}`,
          time: d.date,
          amount: d.amount,
        });
      });
      (appsRes.data ?? []).forEach((a:any) => {
        feed.push({
          id: `app-${a.id}`,
          type: "application",
          label: `Application — ${a.first_name} ${a.last_name}`,
          sub: a.status ?? "pending",
          time: a.created_at,
        });
      });
      feed.sort((a,b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setActivity(feed.slice(0,8));

      // Build monthly chart (last 6 months)
      const allDonations = donationsRes.data ?? [];
      const monthMap: Record<string, number> = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = d.toLocaleString("default", { month:"short", year:"2-digit" });
        monthMap[key] = 0;
      }
      allDonations.forEach((d:any) => {
        const date = new Date(d.date);
        const key = date.toLocaleString("default", { month:"short", year:"2-digit" });
        if (key in monthMap) monthMap[key] += d.amount ?? 0;
      });
      setMonthlyData(Object.entries(monthMap).map(([month, amount]) => ({ month, amount })));

    } catch {
      setError("Failed to load dashboard data. Check your Supabase credentials.");
    }
    setDataLoading(false);
  };

  useEffect(() => { if (!authLoading && user) loadData(); }, [user, authLoading]);

  const quickActions = [
    { label:"Upload Images",   href:"/admin/gallery",      icon:Image,          gradient:"from-navy-900 to-navy-800"  },
    { label:"Manage Events",   href:"/admin/events",       icon:Calendar,       gradient:"from-[#053D61] to-navy-900"  },
    { label:"Manage Content",  href:"/admin/content",      icon:Newspaper,      gradient:"from-navy-800 to-navy-900"},
    { label:"Manage Jobs",     href:"/admin/jobs",         icon:Briefcase,      gradient:"from-[#053D61] to-navy-900"},
    { label:"Applications",    href:"/admin/applications", icon:FileSignature,  gradient:"from-navy-900 to-[#0a2540]"},
    { label:"Reports",         href:"/admin/reports",      icon:BarChart3,      gradient:"from-[#053D61] to-navy-800" },
  ];

  const statCards = [
    { label:"Total Donors",       value:stats.totalDonors,      icon:Users,      gradient:"from-navy-900 to-[#053D61]",   prefix:"",  suffix:"" },
    { label:"Total Donations",    value:stats.totalDonations,   icon:DollarSign, gradient:"from-[#053D61] to-navy-900",   prefix:"$", suffix:"" },
    { label:"Gallery Images",     value:stats.galleryImages,    icon:Image,      gradient:"from-navy-800 to-navy-900", prefix:"",  suffix:"" },
    { label:"Published Articles", value:stats.publishedArticles,icon:FileText,   gradient:"from-navy-900 to-navy-800", prefix:"",  suffix:"" },
  ];

  const activityIcon = (type: ActivityItem["type"]) => {
    if (type==="donation")    return <CreditCard    className="w-4 h-4" style={{color:"#F5B800"}}/>;
    if (type==="donor")       return <UserPlus      className="w-4 h-4" style={{color:"#032B45"}}/>;
    if (type==="application") return <FileSignature className="w-4 h-4 text-slate-600"/>;
  };
  const activityBg = (type: ActivityItem["type"]) => {
    if (type==="donation")    return "rgba(245,184,0,0.15)";
    if (type==="donor")       return "rgba(3,43,69,0.06)";
    if (type==="application") return "#f1f5f9";
    return "#f8fafc";
  };

  if (authLoading || dataLoading) return (
    <div className="flex-1 h-full bg-slate-50 flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-3xl flex items-center justify-center shadow-lg"
          style={{background:"linear-gradient(135deg, #032B45, #053D61)",boxShadow:"0 8px 24px rgba(3,43,69,.35)"}}>
          <Loader2 className="w-8 h-8 text-white animate-spin"/>
        </div>
        <p className="text-slate-500 font-medium">Loading dashboard…</p>
      </div>
    </div>
  );

  const currentDate = new Date().toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex-1 bg-slate-50 pb-12 portal-fade-in" style={{fontFamily:"'Inter',sans-serif"}}>

      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0" style={{background:"linear-gradient(135deg,#032B45,#053D61,#032B45)"}}/>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5B800] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"/>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#0a2540] rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"/>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-blue-300 text-sm font-medium mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4"/> {currentDate}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {greeting}, <span style={{ color: "#F5B800" }}>{adminProfile?.first_name || "Admin"}</span> 👋
              </h1>
              <p className="text-blue-200/70 font-medium mt-2 text-sm">
                Here's what's happening with Cross-Borders Outreach today.
              </p>
            </div>
            <button onClick={loadData} className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-semibold text-sm transition-all"
              style={{background:"rgba(255,255,255,.1)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,.15)"}}>
              <RefreshCw className="w-4 h-4"/> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0"/> {error}
          </div>
        )}

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <div key={s.label} className="portal-stat-card" style={{animationDelay:`${i*80}ms`}}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
                  <s.icon className="w-5 h-5 text-white"/>
                </div>
                <TrendingUp className="w-4 h-4" style={{color:"#F5B800"}}/>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-navy-900 mb-1">
                <CountUp to={s.value} prefix={s.prefix} duration={1200 + i*150}/>
              </div>
              <p className="text-sm text-slate-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Chart + Activity ── */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Donation Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-navy-900 text-lg">Monthly Donations</h2>
                <p className="text-sm text-slate-400 mt-0.5">Last 6 months</p>
              </div>
              <Link to="/admin/reports" className="flex items-center gap-1 text-sm font-semibold transition-colors" style={{color:"#032B45"}}>
                Full Report <ArrowUpRight className="w-4 h-4"/>
              </Link>
            </div>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyData} margin={{top:4,right:4,left:-20,bottom:0}}>
                  <defs>
                    <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#032B45" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#032B45" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                  <XAxis dataKey="month" tick={{fontSize:12,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:12,fill:"#94a3b8"}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v>=1000?`${(v/1000).toFixed(0)}k`:v}`}/>
                  <Tooltip content={<ChartTooltip/>}/>
                  <Area type="monotone" dataKey="amount" stroke="#F5B800" strokeWidth={2.5} fill="url(#adminGrad)" dot={false} activeDot={{r:5,fill:"#F5B800",stroke:"#fff",strokeWidth:2}}/>
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm">
                No donation data yet
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <div>
                <h2 className="font-bold text-navy-900">Recent Activity</h2>
                <p className="text-xs text-slate-400 mt-0.5">Live updates</p>
              </div>
              <div className="portal-status-dot"/>
            </div>
            <div className="divide-y divide-slate-50 overflow-y-auto" style={{maxHeight:260}}>
              {activity.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">No recent activity</div>
              ) : activity.map((item) => (
                <div key={item.id} className="portal-activity-row">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{background:activityBg(item.type)}}>
                    {activityIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-800 truncate">{item.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(item.time).toLocaleDateString()}</p>
                  </div>
                  {item.amount && (
                    <span className="text-sm font-bold flex-shrink-0" style={{color:"#032B45"}}>${item.amount.toLocaleString()}</span>
                  )}
                  {!item.amount && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                      style={{background:"#fffbeb",color:"#d97706",textTransform:"capitalize"}}>
                      {item.sub}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <h2 className="font-bold text-navy-900 text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, i) => (
              <Link key={action.href} to={action.href} className="portal-action-card" style={{animationDelay:`${i*60}ms`}}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-md`}>
                  <action.icon className="w-5 h-5 text-white"/>
                </div>
                <span className="text-sm font-semibold text-slate-700 text-center leading-tight">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Recent Donors ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-50">
            <h2 className="font-bold text-navy-900">Recent Donors</h2>
            <Link to="/admin/users" className="flex items-center gap-1 text-sm font-semibold transition-colors" style={{color:"#032B45"}}>
              View All <ChevronRight className="w-4 h-4"/>
            </Link>
          </div>
          {recentDonors.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-10 h-10 text-slate-200 mx-auto mb-3"/>
              <p className="text-slate-400 text-sm font-medium">No donors yet</p>
            </div>
          ) : (
            <div>
              {recentDonors.map((donor) => (
                <div key={donor.id} className="portal-activity-row">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{background:"linear-gradient(135deg, #032B45, #053D61)"}}>
                    {donor.first_name?.[0]}{donor.last_name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy-800">{donor.first_name} {donor.last_name}</p>
                    <p className="text-xs text-slate-400 truncate">{donor.email}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-navy-900">${(donor.total_donated ?? 0).toLocaleString()}</p>
                    <p className="text-xs text-slate-400">{donor.donation_count ?? 0} donations</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
