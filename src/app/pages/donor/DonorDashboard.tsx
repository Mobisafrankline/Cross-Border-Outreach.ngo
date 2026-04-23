import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Heart, DollarSign, Calendar, TrendingUp, Download,
  Eye, Gift, Award, LogOut, Loader2, AlertCircle
} from "lucide-react";
import { useAuth } from "../../../lib/AuthContext";
import { getDonorProfile, getDonorDonations, signOut } from "../../../lib/supabase";
import type { Donor, Donation } from "../../../lib/supabase";

const IMPACT_MAP: Record<string, { label: string; icon: string; multiplier: number }> = {
  "Food Support Program":    { label: "Meals Provided",      icon: "🍽️", multiplier: 0.5 },
  "Education Initiative":    { label: "Students Supported",  icon: "📚", multiplier: 0.04 },
  "Healthcare Outreach":     { label: "Medical Checkups",    icon: "🏥", multiplier: 0.05 },
  "Economic Empowerment":    { label: "Businesses Started",  icon: "💼", multiplier: 0.01 },
};

export default function DonorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [donor, setDonor] = useState<Donor | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch real data ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setDataLoading(true);
      const [profileRes, donationsRes] = await Promise.all([
        getDonorProfile(user.id),
        getDonorDonations(user.id),
      ]);

      if (profileRes.error) setError(profileRes.error.message);
      else setDonor(profileRes.data);

      if (!donationsRes.error) setDonations(donationsRes.data ?? []);
      setDataLoading(false);
    };

    load();
  }, [user]);

  // ── Computed impact stats from actual donations ──────────────────────────
  const impactStats = Object.entries(IMPACT_MAP).map(([program, info]) => {
    const total = donations
      .filter((d) => d.program === program && d.status === "completed")
      .reduce((s, d) => s + d.amount, 0);
    return { ...info, value: Math.round(total * info.multiplier).toString() };
  });

  const handleSignOut = async () => {
    await signOut();
    navigate("/donor/login");
  };

  // ── Loading skeleton ────────────────────────────────────────────────────
  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load dashboard</h2>
          <p className="text-gray-600 mb-6 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const displayName = donor
    ? `${donor.first_name} ${donor.last_name}`
    : user?.email ?? "Donor";

  const firstName = donor?.first_name ?? displayName.split(" ")[0];
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const memberSince = donor?.created_at
    ? new Date(donor.created_at).toLocaleDateString()
    : "—";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-blue-600">{initials}</span>
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">Welcome back, {firstName}!</h1>
                <p className="opacity-90">Member since {memberSince}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/donate"
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors"
              >
                <Heart className="w-5 h-5" />
                Make a Donation
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
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
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${(donor?.total_donated ?? 0).toLocaleString()}
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
              {donor?.donation_count ?? donations.length}
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
              {donor?.status === "active" ? "Active" : "Inactive"}
            </div>
            <div className="text-sm text-gray-600">Account Status</div>
          </div>
        </div>

        {/* Your Impact */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Your Impact
          </h2>
          <p className="mb-6 opacity-90">
            Thanks to your generosity, here's the difference you've made:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactStats.map((stat, i) => (
              <div key={i} className="text-center">
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

              {donations.length === 0 ? (
                <div className="p-12 text-center">
                  <Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No donations yet</p>
                  <p className="text-gray-400 text-sm mt-1">Your donation history will appear here.</p>
                  <Link
                    to="/donate"
                    className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                  >
                    Make Your First Donation
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {donations.map((donation) => (
                    <div key={donation.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">{donation.program}</div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(donation.date).toLocaleDateString()}
                            </span>
                            <span>Receipt: {donation.receipt_number}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600">${donation.amount}</div>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                              donation.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : donation.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
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
              )}
            </div>
          </div>

          {/* Quick Actions & Info */}
          <div className="space-y-6">
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
                <button
                  onClick={handleSignOut}
                  className="block w-full px-4 py-3 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 rounded-lg font-semibold text-center transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Recognition */}
            {(donor?.total_donated ?? 0) > 0 && (
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border-2 border-orange-200 p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {(donor?.total_donated ?? 0) >= 5000
                      ? "Gold Donor 🏆"
                      : (donor?.total_donated ?? 0) >= 1000
                      ? "Silver Donor 🥈"
                      : "Bronze Donor 🥉"}
                  </h3>
                  <p className="text-sm text-gray-700">
                    Thank you for your outstanding support to the community!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
