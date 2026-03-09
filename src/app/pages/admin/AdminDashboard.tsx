import { Link } from "react-router";
import { 
  LayoutDashboard, 
  Image, 
  FileText, 
  Users, 
  Newspaper,
  BookOpen,
  Award,
  TrendingUp,
  DollarSign,
  Calendar,
  BarChart3
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Donors", value: "1,234", icon: Users, color: "bg-blue-500", change: "+12%" },
    { label: "Total Donations", value: "$45,678", icon: DollarSign, color: "bg-green-500", change: "+8%" },
    { label: "Gallery Images", value: "156", icon: Image, color: "bg-purple-500", change: "+5" },
    { label: "Published Articles", value: "89", icon: FileText, color: "bg-orange-500", change: "+3" }
  ];

  const quickActions = [
    { label: "Upload Images", href: "/admin/gallery", icon: Image, color: "from-purple-500 to-purple-600" },
    { label: "Write Article", href: "/admin/articles/new", icon: FileText, color: "from-blue-500 to-blue-600" },
    { label: "Create News", href: "/admin/news/new", icon: Newspaper, color: "from-green-500 to-green-600" },
    { label: "Write Blog", href: "/admin/blog/new", icon: BookOpen, color: "from-orange-500 to-orange-600" },
    { label: "Add Story", href: "/admin/stories/new", icon: Award, color: "from-pink-500 to-pink-600" },
    { label: "Manage Donors", href: "/admin/donors", icon: Users, color: "from-indigo-500 to-indigo-600" }
  ];

  const recentActivity = [
    { action: "New donor registered", user: "John Smith", time: "5 min ago", type: "donor" },
    { action: "Article published", user: "Admin", time: "1 hour ago", type: "content" },
    { action: "Donation received", user: "Sarah Johnson", time: "2 hours ago", type: "donation" },
    { action: "Image uploaded", user: "Admin", time: "3 hours ago", type: "media" },
    { action: "News posted", user: "Admin", time: "5 hours ago", type: "content" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your Cross-Borders website content and donors</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-600 text-sm font-semibold bg-green-50 px-2 py-1 rounded">
                  {stat.change}
                </span>
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
              <Link
                key={action.href}
                to={action.href}
                className="group"
              >
                <div className={`bg-gradient-to-br ${action.color} rounded-xl p-6 text-white hover:shadow-lg transition-all transform hover:-translate-y-1`}>
                  <action.icon className="w-8 h-8 mb-3 mx-auto" />
                  <div className="text-sm font-semibold text-center">{action.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{activity.action}</div>
                        <div className="text-sm text-gray-600">{activity.user}</div>
                      </div>
                      <div className="text-sm text-gray-500">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            {/* Monthly Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Monthly Overview
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Donation Goal</span>
                    <span className="font-semibold text-gray-900">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Content Published</span>
                    <span className="font-semibold text-gray-900">12/15</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "80%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Upcoming Events
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                    <div className="text-xs text-blue-600 font-semibold">MAR</div>
                    <div className="text-lg font-bold text-blue-600">15</div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">Annual Gala</div>
                    <div className="text-xs text-gray-600">6:00 PM</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                    <div className="text-xs text-green-600 font-semibold">MAR</div>
                    <div className="text-lg font-bold text-green-600">20</div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">Health Fair</div>
                    <div className="text-xs text-gray-600">9:00 AM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
