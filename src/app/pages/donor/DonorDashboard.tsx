import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import {
  Heart, DollarSign, Calendar, TrendingUp, Download,
  Eye, Gift, Award, LogOut, Loader2, AlertCircle,
  PieChart, Star, ChevronRight, Activity, Map, X,
  BarChart3, Folder, FileText, RefreshCw, LayoutDashboard, UserCog, Image
} from "lucide-react";
import { useAuth } from "../../../lib/AuthContext";
import { getDonorProfile, getDonorDonations, signOut, getEventArchives, getReports, getGalleryImages, getArticles } from "../../../lib/supabase";
import type { Donor, Donation, EventArchive, Report, GalleryImage, Article } from "../../../lib/supabase";
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
  const [eventArchives, setEventArchives] = useState<EventArchive[]>([]);
  const [orgReports, setOrgReports] = useState<Report[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [projectUpdates, setProjectUpdates] = useState<Article[]>([]);
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
      const [profileRes, donationsRes, archivesRes, reportsRes, galleryRes, articlesRes] = await Promise.all([
        getDonorProfile(user.id),
        getDonorDonations(user.id),
        getEventArchives(),
        getReports(),
        getGalleryImages(),
        getArticles(undefined, 'published')
      ]);

      if (profileRes.error) setError(profileRes.error.message);
      else setDonor(profileRes.data);

      if (!donationsRes.error) setDonations(donationsRes.data ?? []);
      if (!archivesRes.error) setEventArchives(archivesRes.data ?? []);
      if (!reportsRes.error) setOrgReports(reportsRes.data ?? []);
      if (!galleryRes.error) setGalleryImages(galleryRes.data ?? []);
      if (!articlesRes.error) setProjectUpdates(articlesRes.data?.slice(0, 3) ?? []);
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

  const donorName = donor ? `${donor.first_name} ${donor.last_name}` : user?.user_metadata?.first_name ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}` : "Valued Donor";
  const firstName = donor?.first_name || user?.user_metadata?.first_name || "Donor";

  // ── Receipt Generation ───────────────────────────────────────────────────
  const generateAnnualReceipt = () => {
    const year = new Date().getFullYear();
    const yearlyDonations = completedDonations.filter(d => new Date(d.date).getFullYear() === year);
    const yearlyTotal = yearlyDonations.reduce((acc, curr) => acc + curr.amount, 0);

    const receiptHtml = `
      <html>
        <head>
          <title>Tax Receipt ${year} - Cross Border Outreach</title>
          <style>
            body { font-family: system-ui, sans-serif; color: #111827; max-width: 800px; margin: 0 auto; padding: 40px; }
            .header { text-align: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; margin: 0; }
            .org { color: #4b5563; margin-top: 5px; }
            .info { display: flex; justify-content: space-between; margin-bottom: 40px; }
            table { border-collapse: collapse; margin-bottom: 30px; width: 100%; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { background-color: #f9fafb; font-weight: 600; color: #4b5563; }
            .total { font-size: 20px; font-weight: bold; text-align: right; }
            .footer { margin-top: 50px; font-size: 14px; color: #6b7280; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">Official Annual Tax Receipt</h1>
            <p class="org">Cross Border Outreach - Tax ID: 12-3456789</p>
            <p class="org">${year} Tax Year</p>
          </div>
          
          <div class="info">
            <div>
              <strong>Donor Name:</strong> ${donorName}<br>
              <strong>Email:</strong> ${user?.email}
            </div>
            <div style="text-align: right;">
              <strong>Date Issued:</strong> ${new Date().toLocaleDateString()}<br>
            </div>
          </div>

          <p>Thank you for your generous support. This document serves as your official tax receipt for the year ${year}. No goods or services were provided in exchange for these contributions.</p>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Program</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${yearlyDonations.map(d => `
                <tr>
                  <td>${new Date(d.date).toLocaleDateString()}</td>
                  <td>${d.program}</td>
                  <td>$${d.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total">
            Total Eligible Contributions: $${yearlyTotal.toFixed(2)}
          </div>

          <div class="footer">
            Cross Border Outreach is a registered 501(c)(3) non-profit organization.
            <br>123 Charity Way, Goodville, XY 12345 | support@crossbordersoutreach.org
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const generateSingleReceipt = (donation: Donation) => {
    const receiptHtml = `
      <html>
        <head>
          <title>Donation Receipt - ${donation.id}</title>
          <style>
            body { font-family: system-ui, sans-serif; color: #111827; max-width: 800px; margin: 0 auto; padding: 40px; }
            .header { text-align: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; margin: 0; }
            .org { color: #4b5563; margin-top: 5px; }
            .details { background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed #e5e7eb; padding-bottom: 10px; }
            .row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
            .footer { margin-top: 50px; font-size: 14px; color: #6b7280; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">Official Donation Receipt</h1>
            <p class="org">Cross Border Outreach - Tax ID: 12-3456789</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <strong>Donor Name:</strong> ${donorName}<br>
            <strong>Email:</strong> ${user?.email}
          </div>

          <div class="details">
            <div class="row"><span>Receipt ID:</span> <strong>${donation.id || 'N/A'}</strong></div>
            <div class="row"><span>Date:</span> <strong>${new Date(donation.date).toLocaleDateString()}</strong></div>
            <div class="row"><span>Program:</span> <strong>${donation.program}</strong></div>
            <div class="row"><span>Amount:</span> <strong>$${donation.amount.toFixed(2)}</strong></div>
            <div class="row"><span>Payment Method:</span> <strong style="text-transform: capitalize;">${donation.payment_method}</strong></div>
          </div>

          <p>Thank you for your generous support. No goods or services were provided in exchange for this contribution. Please retain this receipt for your tax records.</p>

          <div class="footer">
            Cross Border Outreach is a registered 501(c)(3) non-profit organization.
            <br>123 Charity Way, Goodville, XY 12345 | support@crossbordersoutreach.org
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

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


  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      
      {/* ── HEADER ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
                <p className="text-blue-600 font-medium text-sm">
                  Signed in as <span className="underline">{user?.email}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.location.reload()}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Tier Alert */}
        {nextTier && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-blue-900">{currentTier.name} Member</p>
                <p className="text-xs text-blue-700">${(nextTier.threshold - totalDonated).toLocaleString()} to {nextTier.name} Tier</p>
              </div>
            </div>
            <div className="w-1/3 h-2 bg-blue-200 rounded-full overflow-hidden hidden sm:block">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${progressToNextTier}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* ── KEY METRICS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Contribution", value: `$${totalDonated.toLocaleString()}`, icon: DollarSign, color: "bg-blue-500" },
            { label: "Donations Made", value: donor?.donation_count ?? donations.length, icon: Gift, color: "bg-green-500" },
            { label: "Impact Score", value: (Math.round(totalDonated * 0.15) + 100).toLocaleString(), icon: Activity, color: "bg-purple-500" },
            { label: "Account Tier", value: currentTier.name, icon: Award, color: "bg-orange-500" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "New Donation", onClick: () => setIsDonateModalOpen(true), icon: Heart, color: "bg-blue-600" },
              { label: "View Reports", onClick: () => {
                const el = document.getElementById('org-reports');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, icon: FileText, color: "bg-emerald-600" },
              { label: "Impact Gallery", onClick: () => {
                const el = document.getElementById('impact-gallery');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, icon: Image, color: "bg-purple-600" },
              { label: "Tax Receipt", onClick: generateAnnualReceipt, icon: Download, color: "bg-orange-600" },
              { label: "Account Settings", href: "/donor/profile", icon: UserCog, color: "bg-teal-600" },
              { label: "Suggest Project", href: "/contact", icon: Star, color: "bg-pink-600" },
            ].map((action, i) => {
              const ActionContent = (
                <div className={`${action.color} rounded-2xl p-6 text-white text-center hover:shadow-lg transition-all transform hover:-translate-y-1 h-full flex flex-col items-center justify-center`}>
                  <action.icon className="w-8 h-8 mb-3" />
                  <div className="text-sm font-bold">{action.label}</div>
                </div>
              );

              if (action.onClick) {
                return <button key={i} onClick={action.onClick} className="w-full text-left">{ActionContent}</button>
              }

              return (
                <Link key={i} to={action.href!} className="block">
                  {ActionContent}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── MAIN CONTENT (Left 2 columns) ── */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Real-world Impact Visuals */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Map className="w-5 h-5 text-blue-600" /> Real-World Impact
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {impactStats.map((stat, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-blue-200 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-2xl shrink-0">
                          {stat.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xl font-bold text-gray-900 truncate">{stat.value}</div>
                          <div className="text-sm font-medium text-gray-500 truncate">{stat.label}</div>
                        </div>
                      </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Donation History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
                  <p className="text-sm text-gray-500 mt-1">Your recent contributions</p>
                </div>
                <button onClick={generateAnnualReceipt} className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-semibold transition-colors text-sm border border-gray-200">
                  <Download className="w-4 h-4" />
                  Tax Receipt ({new Date().getFullYear()})
                </button>
              </div>

              {donations.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-900 font-semibold text-lg mb-1">Your journey starts here</p>
                  <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">Make your first donation today and start tracking your global impact immediately.</p>
                  <button onClick={() => setIsDonateModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    <Heart className="w-4 h-4" /> Give Now
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Program</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                      {donations.slice(0, 5).map((donation) => (
                        <tr key={donation.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-4 font-medium text-gray-600">
                            {new Date(donation.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900">
                            {donation.program}
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900">
                            ${donation.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                              donation.status === "completed" ? "bg-green-100 text-green-700" : 
                              donation.status === "pending" ? "bg-amber-100 text-amber-700" : 
                              "bg-red-100 text-red-700"
                            }`}>
                              {donation.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => generateSingleReceipt(donation)} className="inline-flex items-center gap-1.5 text-blue-600 font-semibold hover:text-blue-800 transition-opacity">
                              <Eye className="w-4 h-4" /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {donations.length > 5 && (
                    <div className="p-4 border-t border-gray-200 text-center">
                      <button className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1">
                        View All Transactions <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Event Archives Section ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Folder className="w-5 h-5 text-blue-600" /> Event Photo Archives
                </h2>
                <p className="text-sm text-gray-500 mt-1">Exclusive access to high-resolution photos from our past events and programs.</p>
              </div>
              <div className="p-6 bg-gray-50/50">
                {eventArchives.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {eventArchives.map((archive) => (
                      <div key={archive.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 shrink-0 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Folder className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{archive.title}</h4>
                            <span className="text-xs text-gray-500 font-medium uppercase">{archive.date}</span>
                          </div>
                        </div>
                        <a
                          href={archive.drive_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full mt-auto py-2 text-center bg-gray-50 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                        >
                          Open Drive Folder
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">No event archives are currently available.</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Organization Reports Section ── */}
            <div id="org-reports" className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" /> Organization Reports
                </h2>
                <p className="text-sm text-gray-500 mt-1">Full access to all published reports including financials.</p>
              </div>
              <div className="p-6 bg-gray-50/50">
                {orgReports.length > 0 ? (
                  <div className="space-y-3">
                    {orgReports.slice(0, 6).map((report) => (
                      <a
                        key={report.id}
                        href={report.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm hover:border-blue-200 transition-all group"
                      >
                        <div className="w-10 h-10 shrink-0 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900 truncate">{report.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {report.year && <span>{report.year}</span>}
                            <span className="capitalize px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">{report.category}</span>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-600 shrink-0" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">No reports are currently available.</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Impact Gallery Section ── */}
            <div id="impact-gallery" className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" /> Impact Gallery
                </h2>
                <p className="text-sm text-gray-500 mt-1">See the direct results of your generosity in the field.</p>
              </div>
              <div className="p-6 bg-gray-50/50">
                {galleryImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {galleryImages.slice(0, 6).map((img) => (
                      <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all">
                        <img 
                          src={img.url} 
                          alt={img.alt} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                          <p className="text-white text-[10px] font-bold uppercase tracking-wider mb-0.5">{img.category}</p>
                          <p className="text-white text-xs font-medium truncate">{img.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">No impact photos are currently available.</p>
                  </div>
                )}
                {galleryImages.length > 6 && (
                  <div className="mt-6 text-center">
                    <Link to="/gallery" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                      View Full Gallery →
                    </Link>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ── SIDEBAR (Right column) ── */}
          <div className="space-y-8">
            
            {/* Portfolio of Impact (Analytics) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-600" /> Portfolio of Impact
              </h3>
              
              {distribution.length > 0 ? (
                <div className="space-y-5">
                  {distribution.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm font-semibold mb-2">
                        <span className="text-gray-700">{item.name}</span>
                        <span className="text-gray-900">{item.percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500'][i % 4]}`} 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Make a donation to see your portfolio distribution.</p>
              )}
            </div>

            {/* Project Updates */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" /> Latest Updates
              </h3>
              <div className="space-y-4">
                {projectUpdates.map((update) => (
                  <Link key={update.id} to={`/blog/${update.id}`} className="block group">
                    <div className="flex gap-3">
                      {update.featured_image && (
                        <img src={update.featured_image} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                      )}
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">{update.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{new Date(update.published_at || update.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </Link>
                ))}
                {projectUpdates.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No recent updates.</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Manage Account
              </h3>
              <div className="space-y-2">
                <Link to="/donor/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors">
                  <span className="text-sm font-medium">Account Settings</span>
                </Link>
                <Link to="/contact" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors">
                  <span className="text-sm font-medium">Suggest a Project</span>
                </Link>
                <Link to="/contact" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors">
                  <span className="text-sm font-medium">Support / FAQ</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── DONATION PORTAL MODAL ── */}
      {isDonateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsDonateModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-auto overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-blue-600" /> New Contribution
              </h2>
              <button onClick={() => setIsDonateModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-gray-50/50">
              
              <div className="grid md:grid-cols-12 gap-8">
                {/* Donation Setup Column */}
                <div className="md:col-span-5 space-y-6">
                  
                  {/* Frequency Toggle */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Donation Frequency</label>
                    <div className="bg-gray-100 p-1.5 rounded-xl flex relative">
                      <div 
                        className="absolute inset-y-1.5 w-[calc(50%-6px)] bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-300 ease-out"
                        style={{ left: donateFrequency === "one-time" ? "6px" : "calc(50% + 3px)" }}
                      />
                      <button onClick={() => setDonateFrequency("one-time")} className={`relative z-10 flex-1 py-2.5 text-sm font-bold transition-colors ${donateFrequency === "one-time" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>Give Once</button>
                      <button onClick={() => setDonateFrequency("monthly")} className={`relative z-10 flex-1 py-2.5 text-sm font-bold transition-colors flex items-center justify-center gap-1.5 ${donateFrequency === "monthly" ? "text-blue-700" : "text-gray-500 hover:text-gray-700"}`}><Calendar className="w-3.5 h-3.5" /> Monthly</button>
                    </div>
                  </div>

                  {/* Amount Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Select Amount</label>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {[25, 50, 100, 250].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => { setDonateAmount(amt); setCustomAmount(""); }}
                          className={`py-3 rounded-xl font-bold border-2 transition-all ${donateAmount === amt ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"}`}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <DollarSign className={`w-4 h-4 transition-colors ${!donateAmount && customAmount ? "text-blue-600" : "text-gray-400"}`} />
                      </div>
                      <input
                        type="number"
                        placeholder="Other Amount"
                        value={customAmount}
                        onChange={(e) => { setCustomAmount(e.target.value); if(e.target.value) setDonateAmount(0); }}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 font-bold text-gray-900 focus:outline-none transition-colors ${!donateAmount && customAmount ? "border-blue-600 bg-blue-50/30" : "border-gray-200 focus:border-blue-400 bg-white"}`}
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 flex items-start gap-3">
                    <Heart className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <p>Your {donateFrequency} contribution of <strong className="font-bold">${donateAmount || customAmount || 0}</strong> directly funds critical global programs.</p>
                  </div>

                </div>

                {/* Payment Form Column */}
                <div className="md:col-span-7">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm h-full">
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
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                          <h4 className="font-bold text-gray-900">Payment Setup Required</h4>
                          <p className="text-sm text-gray-500 mt-2">Stripe keys are not configured in your environment.</p>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-20 flex flex-col items-center justify-center h-[calc(100%-3rem)] bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                          <DollarSign className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="font-bold text-slate-500">Select an amount to continue</p>
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
