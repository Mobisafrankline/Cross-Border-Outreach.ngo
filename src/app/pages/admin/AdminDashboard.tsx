import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Image, FileText, Users, Newspaper,
  BookOpen, Award, TrendingUp, DollarSign, Calendar,
  BarChart3, Loader2, AlertCircle, RefreshCw, UserCog, X, ChevronRight, Briefcase, FileSignature,
  ArrowUpRight, Clock
} from "lucide-react";
import { useAuth } from "../../../lib/AuthContext";
import { supabase } from "../../../lib/supabase";
import type { Donor } from "../../../lib/supabase";

interface DashboardStats {
  totalDonors: number;
  totalDonations: number;
  galleryImages: number;
  publishedArticles: number;
}

interface AdminProfile {
  first_name: string;
  last_name: string;
}

function AnimatedValue({ value, prefix = "" }: { value: string; prefix?: string }) {
  return <span>{prefix}{value}</span>;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();

  const [stats, setStats] = useState<DashboardStats>({
    totalDonors: 0,
    totalDonations: 0,
    galleryImages: 0,
    publishedArticles: 0,
  });
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [recentDonors, setRecentDonors] = useState<Donor[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewContentModalOpen, setIsNewContentModalOpen] = useState(false);

  const loadData = async () => {
    setDataLoading(true);
    setError(null);

    try {
      const [donorsRes, donationsRes, imagesRes, articlesRes, adminRes] = await Promise.all([
        supabase.from("donors").select("*", { count: "exact" }).order("created_at", { ascending: false }),
        supabase.from("donations").select("amount").eq("status", "completed"),
        supabase.from("gallery_images").select("id", { count: "exact", head: true }),
        supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "published"),
        user ? supabase.from("admins").select("first_name, last_name").eq("id", user.id).maybeSingle() : Promise.resolve({ data: null })
      ]);

      const totalDonations = (donationsRes.data ?? []).reduce(
        (sum: number, d: { amount: number }) => sum + (d.amount ?? 0),
        0
      );

      setStats({
        totalDonors: donorsRes.count ?? 0,
        totalDonations,
        galleryImages: imagesRes.count ?? 0,
        publishedArticles: articlesRes.count ?? 0,
      });

      if (adminRes.data) {
        setAdminProfile(adminRes.data);
      }

      setRecentDonors((donorsRes.data ?? []).slice(0, 5));
    } catch (err) {
      setError("Failed to load dashboard data. Check your Supabase credentials.");
    }

    setDataLoading(false);
  };

  useEffect(() => {
    if (!authLoading && user) loadData();
  }, [user, authLoading]);

  const quickActions = [
    { label: "Upload Images", href: "/admin/gallery", icon: Image, color: "from-violet-500 to-purple-600", bg: "bg-violet-50", text: "text-violet-600" },
    { label: "Manage Events", href: "/admin/events", icon: Calendar, color: "from-blue-500 to-blue-600", bg: "bg-blue-50", text: "text-blue-600" },
    { label: "Manage Content", href: "/admin/content", icon: Newspaper, color: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", text: "text-emerald-600" },
    { label: "Manage Jobs", href: "/admin/jobs", icon: Briefcase, color: "from-rose-500 to-pink-600", bg: "bg-rose-50", text: "text-rose-600" },
    { label: "Applications", href: "/admin/applications", icon: FileSignature, color: "from-amber-500 to-orange-600", bg: "bg-amber-50", text: "text-amber-600" },
    { label: "Manage Reports", href: "/admin/reports", icon: BarChart3, color: "from-indigo-500 to-blue-600", bg: "bg-indigo-50", text: "text-indigo-600" },
  ];

  const statCards = [
    {
      label: "Total Donors",
      value: stats.totalDonors.toLocaleString(),
      icon: Users,
      gradient: "from-blue-500 to-blue-700",
      lightBg: "bg-blue-50",
      lightText: "text-blue-600",
    },
    {
      label: "Total Donations",
      value: `$${stats.totalDonations.toLocaleString()}`,
      icon: DollarSign,
      gradient: "from-emerald-500 to-emerald-700",
      lightBg: "bg-emerald-50",
      lightText: "text-emerald-600",
    },
    {
      label: "Gallery Images",
      value: stats.galleryImages.toLocaleString(),
      icon: Image,
      gradient: "from-violet-500 to-purple-700",
      lightBg: "bg-violet-50",
      lightText: "text-violet-600",
    },
    {
      label: "Published Articles",
      value: stats.publishedArticles.toLocaleString(),
      icon: FileText,
      gradient: "from-amber-500 to-orange-600",
      lightBg: "bg-amber-50",
      lightText: "text-amber-600",
    },
  ];

  if (authLoading || dataLoading) {
    return (
      <div className="flex-1 h-full bg-slate-50 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-slate-500 font-medium">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <style>{`
        .dash-stat-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.04);
          padding: 24px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .dash-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
        }
        .dash-stat-card::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          opacity: 0.04;
          transition: opacity 0.3s ease;
        }
        .dash-stat-card:hover::after {
          opacity: 0.08;
        }
        .dash-quick-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.04);
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-decoration: none;
          transition: all 0.25s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          cursor: pointer;
        }
        .dash-quick-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.1);
        }
        .dash-donor-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 16px;
          transition: background 0.2s ease;
        }
        @media(min-width: 640px) {
          .dash-donor-row { padding: 16px 24px; gap: 16px; }
        }
        .dash-donor-row:hover {
          background: #f8fafc;
        }
        @keyframes dash-shine {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        @media(max-width: 639px) {
          .dash-stat-card { padding: 18px; border-radius: 16px; }
          .dash-quick-card { padding: 14px; }
        }
      `}</style>

      <div className="flex-1 bg-slate-50 pb-12" style={{ fontFamily: "'Inter', sans-serif" }}>
        
        {/* Welcome Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-blue-300 text-sm font-medium mb-1 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {currentDate}
                </p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Welcome back, {adminProfile?.first_name || 'Admin'}
                </h1>
                <p className="text-blue-200/70 font-medium mt-2 text-sm">
                  Here's what's happening with Cross-Borders Outreach today.
                </p>
              </div>
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/15 text-white rounded-xl font-semibold text-sm transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">

          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
              <button
                onClick={loadData}
                className="text-red-600 hover:text-red-700 text-sm font-bold"
              >
                Retry
              </button>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className="dash-stat-card"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
                       style={{ boxShadow: `0 6px 20px rgba(0,0,0,0.15)` }}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`${stat.lightBg} ${stat.lightText} px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1`}>
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 tracking-tight">
                  <AnimatedValue value={stat.value} />
                </div>
                <div className="text-sm font-medium text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">Quick Actions</h2>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {quickActions.map((action) => (
                <Link key={action.href} to={action.href!} className="dash-quick-card group">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
                    <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 text-center leading-tight">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Donors */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    Recent Donors
                  </h2>
                  <Link
                    to="/admin/users"
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition-colors"
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {recentDonors.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-600 font-bold mb-1">No donors yet</p>
                    <p className="text-slate-400 text-sm">
                      Donor records will appear here once people register.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {recentDonors.map((donor) => (
                      <div key={donor.id} className="dash-donor-row">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 shadow-sm">
                            <span className="text-sm font-bold text-white">
                              {donor.first_name[0]}{donor.last_name[0]}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 truncate">
                              {donor.first_name} {donor.last_name}
                            </div>
                            <div className="text-sm text-slate-400 truncate">{donor.email}</div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-bold text-slate-900 text-lg">
                            ${(donor.total_donated ?? 0).toLocaleString()}
                          </div>
                          <span
                            className={`inline-flex px-2.5 py-0.5 text-[11px] uppercase tracking-wide font-bold rounded-lg ${
                              donor.status === "active"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {donor.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Side Widgets */}
            <div className="space-y-6">
              {/* Performance Overview */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                  </div>
                  Performance
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      label: "Avg. Donation",
                      value: `$${stats.totalDonors > 0 ? Math.round(stats.totalDonations / stats.totalDonors).toLocaleString() : "0"}`,
                      color: "bg-blue-500",
                      pct: Math.min(100, stats.totalDonors > 0 ? Math.round((stats.totalDonations / stats.totalDonors) / 10) : 0)
                    },
                    {
                      label: "Content Published",
                      value: stats.publishedArticles.toString(),
                      color: "bg-emerald-500",
                      pct: Math.min(100, stats.publishedArticles * 5)
                    },
                    {
                      label: "Gallery Images",
                      value: stats.galleryImages.toString(),
                      color: "bg-violet-500",
                      pct: Math.min(100, stats.galleryImages * 3)
                    },
                  ].map((item) => (
                    <div key={item.label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-500 font-medium">{item.label}</span>
                        <span className="font-bold text-slate-900">{item.value}</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                  </div>
                  Quick Links
                </h3>
                <div className="space-y-1.5">
                  {[
                    { label: "Manage Gallery", href: "/admin/gallery", icon: Image, color: "text-violet-600 bg-violet-50" },
                    { label: "Manage Content", href: "/admin/content", icon: Newspaper, color: "text-emerald-600 bg-emerald-50" },
                    { label: "Manage People", href: "/admin/users", icon: UserCog, color: "text-blue-600 bg-blue-50" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-medium transition-all group border border-transparent hover:border-slate-100"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color} transition-transform group-hover:scale-110`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm">{item.label}</span>
                      <ChevronRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New Content Selection Modal */}
        {isNewContentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsNewContentModalOpen(false)}></div>
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">New Content</h3>
                  <p className="text-slate-500 font-medium mt-1">What would you like to post today?</p>
                </div>
                <button onClick={() => setIsNewContentModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/admin/news/new"
                  onClick={() => setIsNewContentModalOpen(false)}
                  className="group p-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-center"
                >
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Newspaper className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-900">Post News</h4>
                  <p className="text-xs font-medium text-slate-500 mt-1">Updates & announcements</p>
                </Link>

                <Link
                  to="/admin/blog/new"
                  onClick={() => setIsNewContentModalOpen(false)}
                  className="group p-6 rounded-2xl border-2 border-slate-100 hover:border-orange-500 hover:bg-orange-50 transition-all text-center"
                >
                  <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-900">Write Blog</h4>
                  <p className="text-xs font-medium text-slate-500 mt-1">Articles & perspectives</p>
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <Link
                  to="/admin/stories/new"
                  onClick={() => setIsNewContentModalOpen(false)}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-pink-50 border border-slate-100 hover:border-pink-200 group transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900">Impact Story</h5>
                      <p className="text-sm font-medium text-slate-500">Share a success story</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-pink-600 transition-colors" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
