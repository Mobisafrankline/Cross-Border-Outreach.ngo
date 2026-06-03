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
  PenTool
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
        { label: "News Channel", href: "/admin/news-channel", icon: Newspaper },
        { label: "Content Editor", href: "/admin/news/new", icon: PenTool },
        { label: "Gallery", href: "/admin/gallery", icon: Image },
      ]
    }
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        flex flex-col
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:bg-blue-700 transition-colors">
              CB
            </div>
            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Admin Portal</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <h3 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {group.title}
              </h3>
              {group.items.map((item) => {
                const isActive = location.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200
                      ${isActive 
                        ? "bg-blue-50 text-blue-700" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }
                    `}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                {adminName ? adminName.charAt(0) : <ShieldCheck className="w-5 h-5" />}
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-slate-900 truncate">
                  {adminName || "Admin User"}
                </div>
                <div className="text-xs text-slate-500 truncate">{user?.email}</div>
              </div>
            </div>
            
            <Link 
              to="/admin/profile" 
              className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 mb-2 transition-colors"
            >
              <Settings className="w-4 h-4" /> Profile Settings
            </Link>

            <button 
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white text-red-600 border border-red-100 rounded-lg text-sm font-semibold hover:bg-red-50 hover:border-red-200 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Mobile */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white border-b border-slate-200 lg:hidden shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-slate-900">Admin</span>
          </div>
          <Link to="/admin/profile" className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
             <UserCircle className="w-5 h-5" />
          </Link>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
