import { useState, useEffect } from "react";
import { FileText, Download, TrendingUp, DollarSign, Users, BarChart3, Lock, Loader2, X, AlertCircle, Calendar, ClipboardList, Clock } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { getReports, verifyReportAccessCode } from "../../lib/supabase";
import type { Report } from "../../lib/supabase";

type ReportCategory = "all" | "event" | "quarterly" | "monthly" | "yearly" | "financial";

const CATEGORY_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  all:       { label: "All Reports",        icon: FileText,      color: "text-blue-600",   bg: "bg-blue-50" },
  event:     { label: "Event Reports",      icon: Calendar,      color: "text-emerald-600", bg: "bg-emerald-50" },
  quarterly: { label: "Quarterly Reports",  icon: ClipboardList, color: "text-violet-600",  bg: "bg-violet-50" },
  monthly:   { label: "Monthly Reports",    icon: Clock,         color: "text-amber-600",   bg: "bg-amber-50" },
  yearly:    { label: "Yearly Reports",     icon: BarChart3,     color: "text-cyan-600",    bg: "bg-cyan-50" },
  financial: { label: "Financial Reports",  icon: DollarSign,    color: "text-rose-600",    bg: "bg-rose-50" },
};

const projection2026 = [
  { icon: DollarSign, title: "Projected Revenue", value: "$150K" },
  { icon: Users, title: "Projected Beneficiaries", value: "15,000+" },
  { icon: TrendingUp, title: "Expected Growth", value: "+50%" },
  { icon: BarChart3, title: "Programs Expansion", value: "18 Centers" },
];

export default function Reports() {
  const [activeCategory, setActiveCategory] = useState<ReportCategory>("all");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // Access code modal state
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [accessCode, setAccessCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    const { data, error } = await getReports();
    if (!error && data) {
      setReports(data);
    }
    setLoading(false);
  };

  const filteredReports = activeCategory === "all"
    ? reports
    : reports.filter((r) => r.category === activeCategory);

  const handleReportClick = (report: Report) => {
    if (report.category === "financial" && report.access_code) {
      setSelectedReport(report);
      setAccessCode("");
      setCodeError(null);
      setCodeModalOpen(true);
    } else {
      window.open(report.file_url, "_blank");
    }
  };

  const handleVerifyCode = async () => {
    if (!selectedReport || !accessCode.trim()) {
      setCodeError("Please enter an access code.");
      return;
    }
    setVerifying(true);
    setCodeError(null);

    const { data, error } = await verifyReportAccessCode(selectedReport.id, accessCode.trim());

    if (error || !data) {
      setCodeError("Invalid access code. Please try again.");
      setVerifying(false);
      return;
    }

    window.open(data.file_url, "_blank");
    setCodeModalOpen(false);
    setSelectedReport(null);
    setAccessCode("");
    setVerifying(false);
  };

  const getCategoryIcon = (cat: string) => {
    const config = CATEGORY_CONFIG[cat];
    if (!config) return <FileText className="w-7 h-7 text-white" />;
    const Icon = config.icon;
    return <Icon className="w-7 h-7 text-white" />;
  };

  const getCategoryBadgeColor = (cat: string) => {
    const colors: Record<string, string> = {
      event: "bg-emerald-100 text-emerald-700",
      quarterly: "bg-violet-100 text-violet-700",
      monthly: "bg-amber-100 text-amber-700",
      yearly: "bg-cyan-100 text-cyan-700",
      financial: "bg-rose-100 text-rose-700",
    };
    return colors[cat] || "bg-gray-100 text-gray-700";
  };

  const getCategoryIconBg = (cat: string) => {
    const colors: Record<string, string> = {
      event: "bg-emerald-600",
      quarterly: "bg-violet-600",
      monthly: "bg-amber-600",
      yearly: "bg-cyan-600",
      financial: "bg-rose-600",
    };
    return colors[cat] || "bg-blue-600";
  };

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1572645098182-5e28a03f1b60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
            alt="Reports"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
            Reports & Transparency
          </h1>
          <p className="text-lg md:text-2xl opacity-95">
            Our commitment to accountability and transparency
          </p>
        </div>
      </section>

      {/* 2026 Projection Statistics */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              2026 Impact Projection
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Expected growth and projected impact for the coming year
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {projection2026.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={index}
                  className="bg-green-50 rounded-xl p-6 text-center hover:shadow-md transition"
                >
                  <Icon className="w-8 h-8 text-green-600 mx-auto mb-3" />

                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>

                  <div className="text-sm text-gray-600">
                    {stat.title}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Category Tabs */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Organization Reports
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Download our comprehensive reports detailing our impact, finances, and operations
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key as ReportCategory)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    activeCategory === key
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {config.label}
                </button>
              );
            })}
          </div>

          {/* Reports List */}
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
          ) : filteredReports.length > 0 ? (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-gray-50 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 ${getCategoryIconBg(report.category)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      {getCategoryIcon(report.category)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {report.title}
                        </h3>
                        {report.category === "financial" && report.access_code && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-700 text-xs font-semibold rounded-full">
                            <Lock className="w-3 h-3" /> Code Required
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                        {report.year && <span>{report.year}</span>}
                        {report.year && <span>•</span>}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${getCategoryBadgeColor(report.category)}`}>
                          {report.category}
                        </span>
                        {report.file_size && (
                          <>
                            <span>•</span>
                            <span>{report.file_size}</span>
                          </>
                        )}
                        {report.page_count > 0 && (
                          <>
                            <span>•</span>
                            <span>{report.page_count} pages</span>
                          </>
                        )}
                      </div>

                      {report.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {report.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleReportClick(report)}
                    className={`w-full md:w-auto px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors flex-shrink-0 ${
                      report.category === "financial" && report.access_code
                        ? "bg-rose-600 text-white hover:bg-rose-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {report.category === "financial" && report.access_code ? (
                      <>
                        <Lock className="w-5 h-5" />
                        Enter Code
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Download
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No reports available</h3>
              <p className="text-gray-600">
                {activeCategory === "all"
                  ? "Reports will appear here once they are published."
                  : `No ${CATEGORY_CONFIG[activeCategory]?.label?.toLowerCase() || ""} have been published yet.`}
              </p>
            </div>
          )}

        </div>
      </section>

      {/* Financial Transparency */}
      <section className="py-16 md:py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-6">

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Financial Transparency
          </h2>

          <div className="bg-white rounded-xl p-8 shadow-lg">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">

              <div>
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">85%</div>
                <div className="text-gray-700">Program Services</div>
              </div>

              <div>
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">10%</div>
                <div className="text-gray-700">Fundraising</div>
              </div>

              <div>
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">5%</div>
                <div className="text-gray-700">Administrative</div>
              </div>

            </div>

            <p className="text-center text-gray-600 mt-8">
              Every dollar contributed is maximized for impact. We maintain
              one of the highest program efficiency ratings in the sector.
            </p>

          </div>

        </div>
      </section>

      {/* Access Code Modal */}
      {codeModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Access Code Required</h2>
                  <p className="text-sm text-gray-500">This financial report is protected</p>
                </div>
              </div>
              <button
                onClick={() => { setCodeModalOpen(false); setSelectedReport(null); }}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Enter the access code to view <strong>{selectedReport.title}</strong>.
              </p>

              {codeError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p className="text-sm font-medium">{codeError}</p>
                </div>
              )}

              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-center text-lg font-mono tracking-widest"
                placeholder="Enter code..."
                autoFocus
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setCodeModalOpen(false); setSelectedReport(null); }}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyCode}
                  disabled={verifying}
                  className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {verifying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Open"}
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center mt-4">
                Contact admin@crossbordersoutreach.org if you need an access code.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}