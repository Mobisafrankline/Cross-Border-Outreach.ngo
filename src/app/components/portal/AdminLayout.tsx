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
  Newspaper,
  PenTool,
  Calendar,
  Bell,
  Search
} from "lucide-react";
import { useAuth } from "../../../lib/AuthContext";
import { supabase, signOut } from "../../../lib/supabase";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    if (user) {
      supabase
        .from("admins")
        .select("first_name, last_name")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setAdminName(`${data.first_name} ${data.last_name}`);
          }
        });
    }
  }, [user]);

  const navGroups = [
    {
      title: "Management",
      items: [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Users & Donors", href: "/admin/users", icon: Users },
        { label: "Jobs", href: "/admin/jobs", icon: Briefcase },
        { label: "Applications", href: "/admin/applications", icon: FileSignature },
        { label: "Reports", href: "/admin/reports", icon: BarChart3 },
      ]
    },
    {
      title: "Content",
      items: [

        { label: "Content Editor", href: "/admin/blog/new", icon: PenTool },
        { label: "Events", href: "/admin/events", icon: Calendar },
        { label: "Gallery", href: "/admin/gallery", icon: Image },
      ]
    }
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const initials = adminName
    ? adminName.split(" ").map(n => n[0]).join("").toUpperCase()
    : "";

  return (
    <>
      <style>{`
        @keyframes admin-sidebar-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes admin-pulse-dot {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 1; }
        }
        .admin-sidebar {
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
        }
        .admin-sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(ellipse at top left, rgba(59,130,246,0.08) 0%, transparent 60%),
                      radial-gradient(ellipse at bottom right, rgba(139,92,246,0.06) 0%, transparent 60%);
          pointer-events: none;
        }
        .admin-nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 12px;
          font-weight: 500;
          font-size: 14px;
          color: #94a3b8;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .admin-nav-item:hover {
          color: #e2e8f0;
          background: rgba(255,255,255,0.05);
        }
        .admin-nav-item.active {
          color: #fff;
          background: rgba(59,130,246,0.12);
        }
        .admin-nav-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 24px;
          background: linear-gradient(180deg, #3b82f6, #818cf8);
          border-radius: 0 4px 4px 0;
          box-shadow: 0 0 12px rgba(59,130,246,0.5);
        }
        .admin-nav-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .admin-nav-item.active .admin-nav-icon {
          color: #60a5fa;
          filter: drop-shadow(0 0 6px rgba(96,165,250,0.4));
        }
        .admin-user-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 16px;
        }
        .admin-avatar {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 14px;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(59,130,246,0.3);
        }
        .admin-group-title {
          padding: 0 14px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #475569;
          margin-bottom: 8px;
        }
        .admin-signout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid rgba(239,68,68,0.15);
          background: rgba(239,68,68,0.06);
          color: #f87171;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .admin-signout-btn:hover {
          background: rgba(239,68,68,0.12);
          border-color: rgba(239,68,68,0.25);
          color: #fca5a5;
        }
        .admin-topbar {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e2e8f0;
        }
        .admin-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          animation: admin-pulse-dot 2s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          admin-sidebar
          fixed inset-y-0 left-0 z-50 w-[264px] transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col relative overflow-hidden
        `}>
          {/* Logo */}
          <div className="relative z-10 h-16 flex items-center px-5 border-b border-white/5">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-extrabold shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                CB
              </div>
              <div>
                <div className="text-white font-bold text-sm leading-tight tracking-wide">Admin Portal</div>
                <div className="text-[10px] text-blue-400/70 font-medium tracking-wider">Cross-borders Outreach</div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="relative z-10 flex-1 px-3 py-5 space-y-6 overflow-y-auto">
            {navGroups.map((group) => (
              <div key={group.title}>
                <h3 className="admin-group-title">
                  {group.title}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`admin-nav-item ${isActive ? 'active' : ''}`}
                      >
                        <item.icon className="admin-nav-icon" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User Card */}
          <div className="relative z-10 p-4">
            <div className="admin-user-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="admin-avatar">
                  {initials || <ShieldCheck className="w-5 h-5" />}
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white truncate">
                      {adminName || "Admin User"}
                    </span>
                    <div className="admin-status-dot" />
                  </div>
                  <div className="text-xs text-slate-400 truncate">{user?.email}</div>
                </div>
              </div>
              
              <Link 
                to="/admin/profile" 
                className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-blue-400 mb-3 transition-colors px-1"
              >
                <Settings className="w-3.5 h-3.5" /> Profile Settings
              </Link>

              <button 
                onClick={handleSignOut}
                className="admin-signout-btn"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          {/* Top Header (Mobile + Desktop) */}
          <header className="admin-topbar h-16 flex items-center justify-between px-4 sm:px-6 shrink-0">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 w-80">
                <Search className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">Search...</span>
              </div>
              <span className="font-bold text-slate-900 lg:hidden">Admin</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors relative">
                <Bell className="w-5 h-5" />
                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <Link to="/admin/profile" className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {initials || <UserCircle className="w-5 h-5" />}
              </Link>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto bg-slate-50">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
