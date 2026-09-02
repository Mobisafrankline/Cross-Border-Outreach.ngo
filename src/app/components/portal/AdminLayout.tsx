import { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Image,
  Users,
  Briefcase,
  FileSignature,
  BarChart3,
  UserCircle,
  Menu,
  X,
  LogOut,
  Settings,
  ShieldCheck,
  PenTool,
  Calendar,
  Bell,
  Search,
  ChevronRight,
  Newspaper,
  UserCog,
} from "lucide-react";
import { useAuth } from "../../../lib/AuthContext";
import { supabase, signOut } from "../../../lib/supabase";
import "../../../styles/portal.css";

const navGroups = [
  {
    title: "Management",
    items: [
      { label: "Dashboard",      href: "/admin/dashboard",    icon: LayoutDashboard },
      { label: "Donors",         href: "/admin/users",        icon: Users           },
      { label: "Jobs",           href: "/admin/jobs",         icon: Briefcase       },
      { label: "Applications",   href: "/admin/applications", icon: FileSignature   },
      { label: "Reports",        href: "/admin/reports",      icon: BarChart3       },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Content Manager", href: "/admin/content",     icon: Newspaper       },
      { label: "New Article",     href: "/admin/blog/new",    icon: PenTool         },
      { label: "Events",          href: "/admin/events",      icon: Calendar        },
      { label: "Gallery",         href: "/admin/gallery",     icon: Image           },
    ],
  },
];

// Map path → human-readable breadcrumb
const CRUMB_MAP: Record<string, string> = {
  "/admin/dashboard":    "Dashboard",
  "/admin/users":        "Donors",
  "/admin/jobs":         "Jobs",
  "/admin/applications": "Applications",
  "/admin/reports":      "Reports",
  "/admin/content":      "Content Manager",
  "/admin/events":       "Events",
  "/admin/gallery":      "Gallery",
  "/admin/profile":      "Profile Settings",
};

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingCount,  setPendingCount]  = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("admins")
      .select("first_name, last_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setAdminName(`${data.first_name} ${data.last_name}`);
      });

    // Live pending applications badge
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .then(({ count }) => setPendingCount(count ?? 0));
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const initials = adminName
    ? adminName.split(" ").map(n => n[0]).join("").toUpperCase()
    : "";

  // Derive current page crumb
  const crumb =
    Object.entries(CRUMB_MAP).find(([path]) => location.pathname.startsWith(path))?.[1] ?? "Admin";

  // Greeting by time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
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
            position: "relative",
          }}
        >
          {/* Subtle radial highlights */}
          <div style={{
            position:"absolute",inset:0,pointerEvents:"none",
            background:"radial-gradient(ellipse at top left,rgba(245,184,0,.08) 0%,transparent 60%),radial-gradient(ellipse at bottom right,rgba(9,89,214,.06) 0%,transparent 60%)"
          }}/>

          {/* Logo */}
          <div className="relative z-10 flex items-center px-5 border-b border-white/5" style={{height:64,flexShrink:0}}>
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-extrabold shadow-lg transition-shadow"
                style={{background:"linear-gradient(135deg, #032B45, #053D61)",boxShadow:"0 6px 20px rgba(9,89,214,.35)"}}>
                <ShieldCheck size={26} color="#fff"/>
              </div>
              <div>
                <div className="text-white font-bold text-sm leading-tight tracking-wide">Admin Portal</div>
                <div className="text-gold-400/70 font-medium tracking-wider" style={{fontSize:10}}>Cross-Borders Outreach</div>
              </div>
            </Link>
            {/* Mobile close */}
            <button className="ml-auto text-slate-400 hover:text-white lg:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-5 h-5"/>
            </button>
          </div>

          {/* Nav */}
          <nav className="relative z-10 flex-1 px-3 py-5 space-y-6 overflow-y-auto">
            {navGroups.map((group) => (
              <div key={group.title}>
                <h3 style={{padding:"0 14px",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"1.5px",color:"#475569",marginBottom:8}}>
                  {group.title}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname.startsWith(item.href);
                    const hasBadge = item.href === "/admin/applications" && pendingCount > 0;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`portal-nav-item ${isActive ? "active" : ""}`}
                      >
                        <item.icon style={{width:19,height:19,flexShrink:0,color:isActive?"#F5B800":"currentColor"}}/>
                        <span style={{flex:1}}>{item.label}</span>
                        {hasBadge && (
                          <span className="portal-badge">{pendingCount > 99 ? "99+" : pendingCount}</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User card */}
          <div className="relative z-10 p-4" style={{flexShrink:0}}>
            <div className="portal-user-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="portal-avatar portal-avatar-admin" style={{width:42,height:42,fontSize:14}}>
                  {initials || <ShieldCheck className="w-5 h-5"/>}
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white truncate">{adminName || "Admin User"}</span>
                    <div className="portal-status-dot"/>
                  </div>
                  <div className="text-xs text-slate-400 truncate">{user?.email}</div>
                </div>
              </div>
              <Link to="/admin/profile" className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-gold-400 mb-3 transition-colors px-1">
                <Settings className="w-3.5 h-3.5"/> Profile Settings
              </Link>
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
              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors lg:hidden"
              >
                <Menu className="w-5 h-5"/>
              </button>

              {/* Breadcrumb — desktop */}
              <div className="hidden lg:flex items-center gap-2 text-sm">
                <span className="text-slate-400 font-medium">Admin</span>
                <ChevronRight className="w-4 h-4 text-slate-300"/>
                <span className="font-semibold text-navy-800">{crumb}</span>
              </div>

              {/* Page title — mobile */}
              <span className="font-bold text-navy-900 lg:hidden">{crumb}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Notification bell */}
              <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors relative">
                <Bell className="w-5 h-5"/>
                {pendingCount > 0 && (
                  <div className="portal-badge absolute top-1 right-1" style={{minWidth:16,height:16,fontSize:9}}>
                    {pendingCount > 9 ? "9+" : pendingCount}
                  </div>
                )}
              </button>

              {/* Avatar */}
              <Link
                to="/admin/profile"
                className="portal-avatar portal-avatar-admin"
                style={{width:36,height:36,fontSize:13,borderRadius:10,boxShadow:"0 2px 8px rgba(59,130,246,.25)"}}
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
    </>
  );
}
