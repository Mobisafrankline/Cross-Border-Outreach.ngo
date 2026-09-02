import { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  UserCircle,
  Heart,
  MessageSquare,
  History,
  Bell,
  Globe,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../../lib/AuthContext";
import { supabase, signOut } from "../../../lib/supabase";
import "../../../styles/portal.css";

const navGroups = [
  {
    title: "My Account",
    items: [
      { label: "Dashboard",         href: "/donor/dashboard",  icon: LayoutDashboard },
      { label: "Donation History",  href: "/donor/donations",  icon: History         },
      { label: "Account Settings",  href: "/donor/profile",    icon: Settings        },
    ],
  },
  {
    title: "Explore",
    items: [
      { label: "Donate Now",  href: "/donate",   icon: Sparkles,      highlight: true },
      { label: "Our Programs", href: "/",         icon: Globe          },
      { label: "Contact Us",  href: "/contact",  icon: MessageSquare  },
    ],
  },
];

const CRUMB_MAP: Record<string, string> = {
  "/donor/dashboard": "Dashboard",
  "/donor/donations": "Donation History",
  "/donor/profile":   "Account Settings",
};

export default function DonorLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [donorName, setDonorName] = useState("");
  const [totalDonated, setTotalDonated] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("donors")
      .select("first_name, last_name, total_donated")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setDonorName(`${data.first_name} ${data.last_name}`);
          setTotalDonated(data.total_donated ?? 0);
        } else {
          const meta = user.user_metadata;
          if (meta?.first_name) setDonorName(`${meta.first_name} ${meta.last_name || ""}`);
        }
      });
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/donor/login");
  };

  const initials = donorName
    ? donorName.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "";

  const crumb =
    Object.entries(CRUMB_MAP).find(([path]) => location.pathname.startsWith(path))?.[1] ?? "Donor";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden backdrop-blur-sm"
          style={{ background: "rgba(6,72,179,.6)" }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col overflow-hidden
          transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          width: 264,
          background: "linear-gradient(180deg, #032B45 0%, #053D61 50%, #032B45 100%)",
          flexShrink: 0,
        }}
      >
        {/* Radial highlight */}
        <div style={{
          position:"absolute",inset:0,pointerEvents:"none",
          background:"radial-gradient(ellipse at top right,rgba(255,255,255,.08) 0%,transparent 60%)"
        }}/>

        {/* Logo */}
        <div className="relative z-10 flex items-center px-5 border-b border-white/10" style={{height:64,flexShrink:0}}>
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center rounded-xl transition-all"
              style={{width:36,height:36,background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.2)"}}>
              <Heart className="w-5 h-5 fill-current text-white"/>
            </div>
            <div>
              <div style={{color:"#fff",fontWeight:700,fontSize:14,lineHeight:1.2}}>Donor Portal</div>
              <div style={{color:"rgba(255,255,255,.55)",fontSize:10,fontWeight:500,letterSpacing:".5px"}}>Cross-Borders Outreach</div>
            </div>
          </Link>
          <button className="ml-auto text-white/60 hover:text-white lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Nav */}
        <nav className="relative z-10 flex-1 px-3 py-5 space-y-6 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.title}>
              <h3 style={{padding:"0 14px",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"1.5px",color:"rgba(255,255,255,.4)",marginBottom:8}}>
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname.startsWith(item.href) && item.href !== "/";
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`donor-nav-item ${isActive ? "active" : ""} ${(item as any).highlight && !isActive ? "donor-nav-highlight" : ""}`}
                      style={(item as any).highlight && !isActive ? {
                        background:"rgba(252,197,38,.12)",
                        color:"#fcc526",
                        border:"1px solid rgba(252,197,38,.2)"
                      } : {}}
                    >
                      <item.icon style={{width:19,height:19,flexShrink:0}}/>
                      <span style={{flex:1}}>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Total donated badge */}
        {totalDonated !== null && totalDonated > 0 && (
          <div className="relative z-10 mx-3 mb-3 px-4 py-3 rounded-xl" style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.1)"}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,.55)",fontWeight:600,textTransform:"uppercase",letterSpacing:".5px",marginBottom:4}}>Total Given</div>
            <div style={{fontSize:22,fontWeight:800,color:"#fcc526"}}>${totalDonated.toLocaleString()}</div>
          </div>
        )}

        {/* User card */}
        <div className="relative z-10 p-4" style={{flexShrink:0}}>
          <div className="portal-user-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="portal-avatar portal-avatar-donor" style={{width:42,height:42,fontSize:14,borderRadius:"50%"}}>
                {initials || <UserCircle className="w-5 h-5"/>}
              </div>
              <div className="overflow-hidden flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white truncate">{donorName || "Valued Donor"}</span>
                  <div className="portal-status-dot"/>
                </div>
                <div className="text-xs text-slate-400 truncate">{user?.email}</div>
              </div>
            </div>
            <button onClick={handleSignOut} className="portal-signout-btn">
              <LogOut className="w-4 h-4"/> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* Top bar */}
        <header className="portal-topbar">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5"/>
            </button>

            {/* Desktop breadcrumb */}
            <div className="hidden lg:flex items-center gap-2 text-sm">
              <Heart className="w-4 h-4 text-[#F5B800]"/>
              <span className="text-slate-400 font-medium">Donor</span>
              <ChevronRight className="w-4 h-4 text-slate-300"/>
              <span className="font-semibold text-navy-800">{crumb}</span>
            </div>

            {/* Mobile page title */}
            <span className="font-bold text-navy-900 lg:hidden">{crumb}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5"/>
            </button>

            {/* Avatar */}
            <Link
              to="/donor/profile"
              className="portal-avatar portal-avatar-donor flex items-center justify-center"
              style={{width:36,height:36,fontSize:13,borderRadius:"50%",boxShadow:"0 2px 8px rgba(9,89,214,.25)",textDecoration:"none"}}
            >
              {initials || <UserCircle className="w-5 h-5"/>}
            </Link>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto bg-sky-50">
          <Outlet/>
        </div>
      </main>
    </div>
  );
}
