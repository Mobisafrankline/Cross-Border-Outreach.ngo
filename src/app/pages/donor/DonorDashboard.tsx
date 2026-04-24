import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import {
  Heart, DollarSign, Calendar, TrendingUp, Download,
  Eye, Gift, Award, LogOut, Loader2, AlertCircle,
  PieChart, Star, ChevronRight, Activity, Map, X
} from "lucide-react";
import { useAuth } from "../../../lib/AuthContext";
import { getDonorProfile, getDonorDonations, signOut } from "../../../lib/supabase";
import type { Donor, Donation } from "../../../lib/supabase";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe, isStripeConfigured } from "../../../lib/stripe";
import PaymentForm from "../../components/PaymentForm";

const IMPACT_MAP: Record<string, { label: string; icon: string; multiplier: number }> = {
  "Food Support Program":    { label: "Meals Provided",      icon: "🍽️", multiplier: 0.5 },
  "Education Initiative":    { label: "Students Supported",  icon: "📚", multiplier: 0.04 },
  "Healthcare Outreach":     { label: "Medical Checkups",    icon: "🏥", multiplier: 0.05 },
  "Economic Empowerment":    { label: "Businesses Started",  icon: "💼", multiplier: 0.01 },
};

const TIERS = [
  { name: "Bronze", threshold: 0, color: "from-orange-400 to-amber-600", bg: "bg-amber-50" },
  { name: "Silver", threshold: 1000, color: "from-slate-300 to-slate-500", bg: "bg-slate-50" },
  { name: "Gold", threshold: 5000, color: "from-yellow-300 to-yellow-500", bg: "bg-yellow-50" }
];

export default function DonorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [donor, setDonor] = useState<Donor | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Donation Modal State
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [donateFrequency, setDonateFrequency] = useState<"one-time" | "monthly">("one-time");
  const [donateAmount, setDonateAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>("");

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

  const handleSignOut = async () => {
    await signOut();
    navigate("/donor/login");
  };

  // ── Computations ────────────────────────────────────────────────────────
  const totalDonated = donor?.total_donated ?? 0;
  
  // Tier logic
  const currentTierIndex = [...TIERS].reverse().findIndex(t => totalDonated >= t.threshold);
  const currentTier = TIERS[TIERS.length - 1 - (currentTierIndex === -1 ? 2 : currentTierIndex)];
  const nextTier = TIERS[TIERS.length - 1 - (currentTierIndex === -1 ? 2 : currentTierIndex) + 1];
  
  const progressToNextTier = nextTier 
    ? Math.min(100, Math.max(0, ((totalDonated - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)) * 100))
    : 100;

  // Impact logic
  const impactStats = useMemo(() => {
    return Object.entries(IMPACT_MAP).map(([program, info]) => {
      const total = donations
        .filter((d) => d.program === program && d.status === "completed")
        .reduce((s, d) => s + d.amount, 0);
      return { ...info, program, total, value: Math.round(total * info.multiplier).toString() };
    }).filter(stat => stat.total > 0 || stat.program === "Food Support Program"); // Always show at least one
  }, [donations]);

  // Analytics logic (Distribution)
  const completedDonations = donations.filter(d => d.status === "completed");
  const actualTotal = completedDonations.reduce((acc, curr) => acc + curr.amount, 0) || 1; // avoid /0

  const distribution = useMemo(() => {
    const map: Record<string, number> = {};
    completedDonations.forEach(d => {
      map[d.program] = (map[d.program] || 0) + d.amount;
    });
    return Object.entries(map).map(([name, amount]) => ({
      name,
      amount,
      percentage: Math.round((amount / actualTotal) * 100)
    })).sort((a, b) => b.amount - a.amount);
  }, [completedDonations, actualTotal]);

  // ── Render States ──────────────────────────────────────────────────────
  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <Heart className="absolute inset-0 m-auto w-6 h-6 text-blue-600 animate-pulse" />
          </div>
          <p className="text-slate-500 font-semibold tracking-wide">Preparing your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Connection Error</h2>
          <p className="text-slate-600 mb-8 text-sm leading-relaxed">{error}</p>
          <button onClick={() => window.location.reload()} className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const displayName = donor ? `${donor.first_name} ${donor.last_name}` : user?.email ?? "Donor";
  const firstName = donor?.first_name ?? displayName.split(" ")[0];
  const initials = displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const memberSince = donor?.created_at ? new Date(donor.created_at).getFullYear() : new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 pb-20">
      
      {/* ── PREMIUM HEADER ── */}
      <div className="relative bg-slate-900 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
          <div className="absolute top-20 -left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-3xl font-bold bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">{initials}</span>
                </div>
                {donor?.status === 'active' && (
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 border-2 border-slate-900 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-white fill-white" />
                  </div>
                )}
              </div>
              
              <div className="text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-xs font-medium text-white/80 mb-3">
                  <Award className="w-3.5 h-3.5" />
                  {currentTier.name} Member since {memberSince}
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{firstName}</span>
                </h1>
                <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
                  Your generosity continues to transform lives across borders. Here is your impact summary.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handleSignOut} className="px-5 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-xl font-semibold transition-all flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
              <button onClick={() => setIsDonateModalOpen(true)} className="px-6 py-3 bg-white text-slate-900 hover:bg-blue-50 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] flex items-center gap-2 hover:scale-[1.02]">
                <Heart className="w-5 h-5 fill-blue-600 text-blue-600" />
                New Donation
              </button>
            </div>
          </div>

          {/* Gamification Tier Bar */}
          {nextTier && (
            <div className="mt-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 max-w-3xl">
              <div className="flex justify-between text-sm text-slate-300 font-medium mb-3">
                <span className="flex items-center gap-1.5 text-white"><Award className="w-4 h-4 text-amber-400"/> {currentTier.name} Tier</span>
                <span>${(nextTier.threshold - totalDonated).toLocaleString()} to {nextTier.name} Tier</span>
              </div>
              <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${progressToNextTier}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        
        {/* ── KEY METRICS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Total Contribution", value: `$${totalDonated.toLocaleString()}`, icon: DollarSign, color: "blue", trend: "+12% this year" },
            { label: "Donations Made", value: donor?.donation_count ?? donations.length, icon: Gift, color: "purple", trend: "Active supporter" },
            { label: "Impact Score", value: Math.round(totalDonated * 0.15) + 100, icon: Activity, color: "emerald", trend: "Top 15% of donors" }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow group relative overflow-hidden">
              <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${stat.color}-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out`}></div>
              <div className="relative flex justify-between items-start mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 text-${stat.color}-600 rounded-2xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <div className="relative">
                <h3 className="text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── MAIN CONTENT (Left 2 columns) ── */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Real-world Impact Visuals */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Map className="w-5 h-5 text-blue-600" /> Real-World Impact
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {impactStats.map((stat, i) => (
                  <div key={i} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-3xl">
                        {stat.icon}
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                        <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Donation History */}
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100">
              <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Transaction History</h2>
                  <p className="text-sm text-slate-500 mt-1">Your recent contributions</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold transition-colors text-sm border border-slate-200">
                  <Download className="w-4 h-4" />
                  Tax Receipt (2025)
                </button>
              </div>

              {donations.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-900 font-semibold text-lg mb-1">Your journey starts here</p>
                  <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">Make your first donation today and start tracking your global impact immediately.</p>
                  <button onClick={() => setIsDonateModalOpen(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                    <Heart className="w-4 h-4" /> Give Now
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Program</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {donations.slice(0, 5).map((donation) => (
                        <tr key={donation.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4 font-medium text-slate-600">
                            {new Date(donation.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-900">
                            {donation.program}
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-900">
                            ${donation.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-lg ${
                              donation.status === "completed" ? "bg-emerald-100 text-emerald-700" : 
                              donation.status === "pending" ? "bg-amber-100 text-amber-700" : 
                              "bg-red-100 text-red-700"
                            }`}>
                              {donation.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="inline-flex items-center gap-1.5 text-blue-600 font-semibold hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Eye className="w-4 h-4" /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {donations.length > 5 && (
                    <div className="p-4 border-t border-slate-100 text-center">
                      <button className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1">
                        View All Transactions <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── SIDEBAR (Right column) ── */}
          <div className="space-y-8">
            
            {/* Portfolio of Impact (Analytics) */}
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-600" /> Portfolio of Impact
              </h3>
              
              {distribution.length > 0 ? (
                <div className="space-y-5">
                  {distribution.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm font-semibold mb-2">
                        <span className="text-slate-700">{item.name}</span>
                        <span className="text-slate-900">{item.percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500'][i % 4]}`} 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">Make a donation to see your portfolio distribution.</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full filter blur-2xl translate-x-10 -translate-y-10"></div>
              <h3 className="text-lg font-bold mb-4 relative z-10">Manage Account</h3>
              <div className="space-y-3 relative z-10">
                <Link to="/donor/profile" className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-colors group">
                  <span className="font-semibold">Account Settings</span>
                  <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
                <Link to="/contact" className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-colors group">
                  <span className="font-semibold">Support / FAQ</span>
                  <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Global CSS Additions for Animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      {/* ── DONATION PORTAL MODAL ── */}
      {isDonateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsDonateModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl my-auto overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex-shrink-0 bg-slate-900 px-6 py-5 flex items-center justify-between text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full mix-blend-screen filter blur-2xl opacity-40 translate-x-10 -translate-y-10"></div>
              <h2 className="text-xl font-bold flex items-center gap-2 relative z-10">
                <Heart className="w-5 h-5 text-blue-400" /> Donor Portal Contribution
              </h2>
              <button onClick={() => setIsDonateModalOpen(false)} className="relative z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1">
              
              <div className="grid md:grid-cols-5 gap-8">
                {/* Donation Setup Column */}
                <div className="md:col-span-2 space-y-6">
                  
                  {/* Frequency Toggle */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Donation Frequency</label>
                    <div className="bg-slate-100 p-1.5 rounded-xl flex relative">
                      <div 
                        className="absolute inset-y-1.5 w-[calc(50%-6px)] bg-white rounded-lg shadow-sm border border-slate-200 transition-all duration-300 ease-out"
                        style={{ left: donateFrequency === "one-time" ? "6px" : "calc(50% + 3px)" }}
                      />
                      <button onClick={() => setDonateFrequency("one-time")} className={`relative z-10 flex-1 py-2.5 text-sm font-bold transition-colors ${donateFrequency === "one-time" ? "text-slate-900" : "text-slate-500"}`}>Give Once</button>
                      <button onClick={() => setDonateFrequency("monthly")} className={`relative z-10 flex-1 py-2.5 text-sm font-bold transition-colors flex items-center justify-center gap-1.5 ${donateFrequency === "monthly" ? "text-blue-700" : "text-slate-500"}`}><Calendar className="w-3.5 h-3.5" /> Monthly</button>
                    </div>
                  </div>

                  {/* Amount Selection */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Select Amount</label>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {[25, 50, 100, 250].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => { setDonateAmount(amt); setCustomAmount(""); }}
                          className={`py-3 rounded-xl font-bold border-2 transition-all ${donateAmount === amt ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"}`}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <DollarSign className={`w-4 h-4 transition-colors ${!donateAmount && customAmount ? "text-blue-600" : "text-slate-400"}`} />
                      </div>
                      <input
                        type="number"
                        placeholder="Other Amount"
                        value={customAmount}
                        onChange={(e) => { setCustomAmount(e.target.value); if(e.target.value) setDonateAmount(0); }}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 font-bold text-slate-900 focus:outline-none transition-colors ${!donateAmount && customAmount ? "border-blue-600 bg-blue-50/30" : "border-slate-200 focus:border-blue-400"}`}
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <p>Your {donateFrequency} contribution of <strong className="font-bold">${donateAmount || customAmount || 0}</strong> goes directly to funding critical global programs.</p>
                  </div>

                </div>

                {/* Payment Form Column */}
                <div className="md:col-span-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                    {(donateAmount > 0 || Number(customAmount) > 0) ? (
                      isStripeConfigured() ? (
                        <Elements stripe={getStripe()}>
                          <PaymentForm 
                            amount={donateAmount || Number(customAmount)}
                            donationType={donateFrequency === "one-time" ? "one-time" : "recurring"}
                            prefillData={{
                              firstName: donor?.first_name || firstName,
                              lastName: donor?.last_name || "",
                              email: user?.email || ""
                            }}
                            onSuccess={() => {
                              setTimeout(() => {
                                setIsDonateModalOpen(false);
                                window.location.reload();
                              }, 3000);
                            }}
                          />
                        </Elements>
                      ) : (
                        <div className="text-center py-8">
                          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                          <h4 className="font-bold text-slate-900">Payment Setup Required</h4>
                          <p className="text-sm text-slate-500 mt-2">Stripe keys are not configured in your environment.</p>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-12 text-slate-400">
                        <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="font-medium">Please select an amount to continue.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
