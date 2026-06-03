import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Image, FileText, Users, Newspaper,
  BookOpen, Award, TrendingUp, DollarSign, Calendar,
  BarChart3, Loader2, AlertCircle, RefreshCw, UserCog, X, ChevronRight, Briefcase, FileSignature
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
      // Run all queries in parallel
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

      // Show 5 most recent donors as activity
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
    { label: "Upload Images", href: "/admin/gallery", icon: Image, color: "from-purple-500 to-purple-600" },
    { label: "Add Events", href: "/admin/events/new", icon: Calendar, color: "from-blue-500 to-blue-600" },
    { label: "New & Blog", onClick: () => setIsNewContentModalOpen(true), icon: Newspaper, color: "from-emerald-500 to-emerald-600" },
    { label: "Manage Jobs", href: "/admin/jobs", icon: Briefcase, color: "from-pink-500 to-pink-600" },
    { label: "Applications", href: "/admin/applications", icon: FileSignature, color: "from-teal-500 to-teal-600" },
    { label: "Manage Reports", href: "/admin/reports", icon: BarChart3, color: "from-indigo-500 to-indigo-600" },
  ];

  const statCards = [
    {
      label: "Total Donors",
      value: stats.totalDonors.toLocaleString(),
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Total Donations",
      value: `$${stats.totalDonations.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-emerald-500",
    },
    {
      label: "Gallery Images",
      value: stats.galleryImages.toLocaleString(),
      icon: Image,
      color: "bg-purple-500",
    },
    {
      label: "Published Articles",
      value: stats.publishedArticles.toLocaleString(),
      icon: FileText,
      color: "bg-orange-500",
    },
  ];

  if (authLoading || dataLoading) {
    return (
      <div className="flex-1 h-full bg-slate-50 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Loading admin dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 pb-12">
      
      {/* Title & Actions Row */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
           <div>
             <h1 className="text-3xl font-bold text-slate-900">Welcome back, {adminProfile?.first_name || 'Admin'}</h1>
             <p className="text-slate-500 font-medium mt-1">Here's what's happening with Cross Border Outreach today.</p>
           </div>
           <button
             onClick={loadData}
             className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 rounded-lg font-semibold text-sm transition-all shadow-sm"
           >
             <RefreshCw className="w-4 h-4" />
             Refresh Data
           </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-start gap-3 p-4 mb-6 bg-red-50/50 border border-red-200 rounded-xl">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 rounded-bl-full ${stat.color} transition-transform group-hover:scale-110`}></div>
              <div className="flex items-start justify-between mb-4 relative">
                <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center shadow-sm`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1 relative">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500 relative">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action) => {
              const ActionContent = (
                <div
                  className={`bg-gradient-to-br ${action.color} rounded-2xl p-6 text-white hover:shadow-lg transition-all transform hover:-translate-y-1 h-full flex flex-col items-center justify-center`}
                >
                  <action.icon className="w-8 h-8 mb-3 mx-auto opacity-90" />
                  <div className="text-sm font-bold text-center leading-tight">{action.label}</div>
                </div>
              );

              if (action.onClick) {
                return (
                  <button key={action.label} onClick={action.onClick} className="group w-full text-left">
                    {ActionContent}
                  </button>
                );
              }

              return (
                <Link key={action.href} to={action.href!} className="group">
                  {ActionContent}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Donors */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" /> Recent Donors
                </h2>
                <Link
                  to="/admin/users"
                  className="text-sm text-blue-600 hover:text-blue-700 font-bold bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  View All
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
                <div className="divide-y divide-slate-100">
                  {recentDonors.map((donor) => (
                    <div key={donor.id} className="p-4 sm:p-6 hover:bg-slate-50/50 transition-colors group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0 border border-blue-100">
                            <span className="text-base font-bold text-blue-600">
                              {donor.first_name[0]}{donor.last_name[0]}
                            </span>
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 break-words group-hover:text-blue-600 transition-colors">
                              {donor.first_name} {donor.last_name}
                            </div>
                            <div className="text-sm font-medium text-slate-500 break-all">{donor.email}</div>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="font-bold text-slate-900 text-lg">
                            ${(donor.total_donated ?? 0).toLocaleString()}
                          </div>
                          <span
                            className={`inline-flex px-2.5 py-1 text-[11px] uppercase tracking-wide font-bold rounded-full mt-1 ${
                              donor.status === "active"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {donor.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Side Widgets */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                Performance Overview
              </h3>
              <div className="space-y-5">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 font-medium">Avg. Donation</span>
                    <span className="font-bold text-slate-900">
                      $
                      {stats.totalDonors > 0
                        ? Math.round(stats.totalDonations / stats.totalDonors).toLocaleString()
                        : "0"}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 font-medium">Content Published</span>
                    <span className="font-bold text-slate-900">{stats.publishedArticles}</span>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 font-medium">Gallery Images</span>
                    <span className="font-bold text-slate-900">{stats.galleryImages}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Quick Links
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Manage Gallery", href: "/admin/gallery", icon: Image },
                  { label: "Manage People", href: "/admin/users", icon: UserCog },
                  { label: "Manage Jobs", href: "/admin/jobs", icon: Briefcase },
                  { label: "Applications", href: "/admin/applications", icon: FileSignature },
                  { label: "Add Event", href: "/admin/events/new", icon: Calendar },
                  { label: "New News Post", href: "/admin/news/new", icon: Newspaper },
                ].map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-blue-700 font-medium transition-colors border border-transparent hover:border-slate-200"
                  >
                    <item.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                    <span className="text-sm">{item.label}</span>
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
  );
}
