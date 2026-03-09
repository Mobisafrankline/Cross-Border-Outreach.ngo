import { Link } from "react-router";
import { Heart, DollarSign, Calendar, TrendingUp, Download, Eye, Gift, Award } from "lucide-react";

export default function DonorDashboard() {
  const donorData = {
    name: "John Smith",
    email: "john.smith@email.com",
    memberSince: "2024-01-15",
    totalDonated: 5000,
    donationCount: 12,
    impactScore: 95
  };

  const donations = [
    {
      id: 1,
      date: "2026-03-01",
      amount: 500,
      program: "Food Support Program",
      status: "completed",
      receipt: "#RCP-001"
    },
    {
      id: 2,
      date: "2026-02-15",
      amount: 350,
      program: "Education Initiative",
      status: "completed",
      receipt: "#RCP-002"
    },
    {
      id: 3,
      date: "2026-02-01",
      amount: 750,
      program: "Healthcare Outreach",
      status: "completed",
      receipt: "#RCP-003"
    },
    {
      id: 4,
      date: "2026-01-15",
      amount: 400,
      program: "Economic Empowerment",
      status: "completed",
      receipt: "#RCP-004"
    }
  ];

  const impactStats = [
    { label: "Meals Provided", value: "250", icon: "🍽️" },
    { label: "Students Supported", value: "15", icon: "📚" },
    { label: "Medical Checkups", value: "40", icon: "🏥" },
    { label: "Businesses Started", value: "5", icon: "💼" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {donorData.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">Welcome back, {donorData.name.split(' ')[0]}!</h1>
                <p className="opacity-90">Member since {new Date(donorData.memberSince).toLocaleDateString()}</p>
              </div>
            </div>
            <Link
              to="/donate"
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors"
            >
              <Heart className="w-5 h-5" />
              Make a Donation
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                +8% this month
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${donorData.totalDonated.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Donated</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Gift className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {donorData.donationCount}
            </div>
            <div className="text-sm text-gray-600">Total Donations</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {donorData.impactScore}%
            </div>
            <div className="text-sm text-gray-600">Impact Score</div>
          </div>
        </div>

        {/* Your Impact */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Your Impact
          </h2>
          <p className="mb-6 opacity-90">
            Thanks to your generosity, here's the difference you've made in the community:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Donation History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Donation History</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-semibold transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {donations.map((donation) => (
                  <div key={donation.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">
                          {donation.program}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(donation.date).toLocaleDateString()}
                          </span>
                          <span>Receipt: {donation.receipt}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600">
                          ${donation.amount}
                        </div>
                        <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mt-1">
                          {donation.status}
                        </span>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-semibold">
                      <Eye className="w-4 h-4" />
                      View Receipt
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/donate"
                  className="block w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-center transition-colors"
                >
                  Make a Donation
                </Link>
                <Link
                  to="/donor/profile"
                  className="block w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-center transition-colors"
                >
                  Edit Profile
                </Link>
                <button className="block w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-center transition-colors">
                  Set Up Recurring Donation
                </button>
              </div>
            </div>

            {/* Monthly Goal */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Giving</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-semibold text-gray-900">$500 / $1,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: "50%" }} />
                </div>
              </div>
              <p className="text-sm text-gray-600">
                You're halfway to your monthly giving goal! Keep up the amazing work.
              </p>
            </div>

            {/* Recognition */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border-2 border-orange-200 p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Gold Donor</h3>
                <p className="text-sm text-gray-700">
                  Thank you for your outstanding support! You're in our top 10% of donors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
