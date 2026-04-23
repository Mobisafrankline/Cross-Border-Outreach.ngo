import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  LayoutDashboard, Image, FileText, Users, Newspaper,
  BookOpen, Award, TrendingUp, DollarSign, Calendar,
  BarChart3, LogOut, Loader2, AlertCircle, RefreshCw
} from "lucide-react";
import { useAuth } from "../../../lib/AuthContext";
import { getAllDonors, signOut, supabase } from "../../../lib/supabase";
import type { Donor } from "../../../lib/supabase";

interface DashboardStats {
  totalDonors: number;
  totalDonations: number;
  galleryImages: number;
  publishedArticles: number;
}

interface RecentActivity {
  action: string;
  user: string;
  time: string;
  type: string;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats>({
    totalDonors: 0,
    totalDonations: 0,
    galleryImages: 0,
    publishedArticles: 0,
  });
  const [recentDonors, setRecentDonors] = useState<Donor[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setDataLoading(true);
    setError(null);

    try {
      // Run all queries in parallel
      const [donorsRes, donationsRes, imagesRes, articlesRes] = await Promise.all([
        supabase.from("donors").select("*", { count: "exact" }).order("created_at", { ascending: false }),
        supabase.from("donations").select("amount").eq("status", "completed"),
        supabase.from("gallery_images").select("id", { count: "exact", head: true }),
        supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "published"),
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

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const quickActions = [
    { label: "Upload Images", href: "/admin/gallery", icon: Image, color: "from-purple-500 to-purple-600" },
    { label: "Write Article", href: "/admin/articles/new", icon: FileText, color: "from-blue-500 to-blue-600" },
    { label: "Create News", href: "/admin/news/new", icon: Newspaper, color: "from-green-500 to-green-600" },
    { label: "Write Blog", href: "/admin/blog/new", icon: BookOpen, color: "from-orange-500 to-orange-600" },
    { label: "Add Story", href: "/admin/stories/new", icon: Award, color: "from-pink-500 to-pink-600" },
    { label: "Manage Donors", href: "/admin/donors", icon: Users, color: "from-indigo-500 to-indigo-600" },
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
      color: "bg-green-500",
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Loading admin dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 text-sm">
                  Signed in as <span className="font-semibold text-blue-600">{user?.email}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Error Banner */}
        {error && (
          <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={loadData}
              className="text-red-600 hover:text-red-700 text-sm font-semibold underline"
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
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action) => (
              <Link key={action.href} to={action.href} className="group">
                <div
                  className={`bg-gradient-to-br ${action.color} rounded-xl p-6 text-white hover:shadow-lg transition-all transform hover:-translate-y-1`}
                >
                  <action.icon className="w-8 h-8 mb-3 mx-auto" />
                  <div className="text-sm font-semibold text-center">{action.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Donors */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Donors</h2>
                <Link
                  to="/admin/donors"
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  View All →
                </Link>
              </div>

              {recentDonors.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No donors yet</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Donor records will appear here once people register.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {recentDonors.map((donor) => (
                    <div key={donor.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">
                              {donor.first_name[0]}{donor.last_name[0]}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {donor.first_name} {donor.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{donor.email}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            ${(donor.total_donated ?? 0).toLocaleString()}
                          </div>
                          <span
                            className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                              donor.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Overview
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Avg. Donation</span>
                    <span className="font-semibold text-gray-900">
                      $
                      {stats.totalDonors > 0
                        ? Math.round(stats.totalDonations / stats.totalDonors).toLocaleString()
                        : "0"}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Content Published</span>
                    <span className="font-semibold text-gray-900">{stats.publishedArticles}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Gallery Images</span>
                    <span className="font-semibold text-gray-900">{stats.galleryImages}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Admin Tools
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Manage Gallery", href: "/admin/gallery", icon: Image },
                  { label: "Manage Donors", href: "/admin/donors", icon: Users },
                  { label: "New Article", href: "/admin/articles/new", icon: FileText },
                  { label: "New News Post", href: "/admin/news/new", icon: Newspaper },
                ].map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
