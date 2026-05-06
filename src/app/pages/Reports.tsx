import { useState, useEffect } from "react";
import { FileText, Download, DollarSign, Users, BarChart3, Lock, Loader2, X, AlertCircle, Calendar, ClipboardList, Clock, Shield, Heart, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { getReports, verifyReportAccessCode } from "../../lib/supabase";
import type { Report } from "../../lib/supabase";
import { motion } from "motion/react";
import { Link } from "react-router";

type ReportCategory = "all" | "event" | "quarterly" | "monthly" | "yearly" | "financial";

const CATEGORY_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  all: { label: "All Reports", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  event: { label: "Event Reports", icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-50" },
  quarterly: { label: "Quarterly", icon: ClipboardList, color: "text-violet-600", bg: "bg-violet-50" },
  monthly: { label: "Monthly", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  yearly: { label: "Yearly", icon: BarChart3, color: "text-cyan-600", bg: "bg-cyan-50" },
  financial: { label: "Financial", icon: DollarSign, color: "text-rose-600", bg: "bg-rose-50" },
};

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
    if (!config) return <FileText className="w-6 h-6 text-white" />;
    const Icon = config.icon;
    return <Icon className="w-6 h-6 text-white" />;
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
    <div className="min-h-screen bg-white">

      {/* ── Hero Section ── */}
      <section className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1572645098182-5e28a03f1b60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
            alt="Reports"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-blue-900/80 to-blue-900" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-widest mb-6">
              <Shield className="w-3.5 h-3.5" /> Accountability
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-2xl">
              Reports & <span className="text-blue-400">Transparency</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed font-medium">
              Our commitment to accountability. Download comprehensive reports detailing our impact, finances, and operations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Reports Section ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          {/* Section Header */}
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              Organization <span className="text-blue-600">Reports</span>
            </h2>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full mb-6"></div>
            <p className="text-lg text-gray-500 leading-relaxed">
              Download our comprehensive reports detailing our impact, finances, and operations across all programs.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-12">
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key as ReportCategory)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${activeCategory === key
                      ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100"
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
            <div className="flex justify-center items-center py-32">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading reports...</p>
              </div>
            </div>
          ) : filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group bg-white rounded-[2rem] border border-gray-100 hover:border-blue-100 hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex items-start gap-5">
                      <div className={`w-14 h-14 ${getCategoryIconBg(report.category)} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        {getCategoryIcon(report.category)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <h3 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {report.title}
                          </h3>
                          {report.category === "financial" && report.access_code && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-rose-100">
                              <Lock className="w-3 h-3" /> Protected
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400 mb-3">
                          {report.year && <span className="font-bold">{report.year}</span>}
                          {report.year && <span>•</span>}
                          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${getCategoryBadgeColor(report.category)}`}>
                            {report.category}
                          </span>
                          {report.file_size && (
                            <>
                              <span>•</span>
                              <span className="font-medium">{report.file_size}</span>
                            </>
                          )}
                          {report.page_count > 0 && (
                            <>
                              <span>•</span>
                              <span className="font-medium">{report.page_count} pages</span>
                            </>
                          )}
                        </div>

                        {report.description && (
                          <p className="text-sm text-gray-500 line-clamp-2 italic leading-relaxed">
                            {report.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-50">
                      <button
                        onClick={() => handleReportClick(report)}
                        className={`w-full px-6 py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all ${report.category === "financial" && report.access_code
                            ? "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100"
                            : "bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-100"
                          }`}
                      >
                        {report.category === "financial" && report.access_code ? (
                          <>
                            <Lock className="w-4 h-4" />
                            Enter Access Code
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            Download Report
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-100 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No reports available</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {activeCategory === "all"
                  ? "Reports will appear here once they are published."
                  : `No ${CATEGORY_CONFIG[activeCategory]?.label?.toLowerCase() || ""} have been published yet.`}
              </p>
            </div>
          )}

        </div>
      </section>

      {/* ── Financial Transparency ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              Financial <span className="text-blue-600">Transparency</span>
            </h2>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full mx-auto mb-6"></div>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Every dollar contributed is maximized for impact. We maintain one of the highest program efficiency ratings in the sector.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2.5rem] p-10 text-center border border-gray-100 shadow-xl hover:shadow-2xl transition-all"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8" />
              </div>
              <div className="text-5xl font-black text-blue-600 mb-3">85%</div>
              <div className="text-lg font-bold text-gray-900 mb-2">Program Services</div>
              <p className="text-sm text-gray-400">Directly funding community programs and outreach initiatives</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[2.5rem] p-10 text-center border border-gray-100 shadow-xl hover:shadow-2xl transition-all"
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8" />
              </div>
              <div className="text-5xl font-black text-emerald-600 mb-3">10%</div>
              <div className="text-lg font-bold text-gray-900 mb-2">Fundraising</div>
              <p className="text-sm text-gray-400">Donor engagement, campaigns, and partnership development</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2.5rem] p-10 text-center border border-gray-100 shadow-xl hover:shadow-2xl transition-all"
            >
              <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8" />
              </div>
              <div className="text-5xl font-black text-violet-600 mb-3">5%</div>
              <div className="text-lg font-bold text-gray-900 mb-2">Administrative</div>
              <p className="text-sm text-gray-400">Essential operations, compliance, and governance overhead</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 bg-blue-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] -ml-64 -mb-64" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
            Questions About <br/>
            <span className="text-blue-400">Our Reports?</span>
          </h2>
          <p className="text-xl text-blue-100/80 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
            We believe in full transparency. Reach out to us for any questions regarding our financials or program impact.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="w-full sm:w-auto px-10 py-5 bg-white text-blue-900 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all shadow-xl inline-flex items-center justify-center gap-3">
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/donate" className="w-full sm:w-auto px-10 py-5 bg-blue-800 text-white border border-blue-700 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all inline-flex items-center justify-center gap-3">
              Support Our Mission
            </Link>
          </div>
        </div>
      </section>

      {/* Access Code Modal */}
      {codeModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[2rem] max-w-md w-full shadow-2xl"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900">Access Code Required</h2>
                  <p className="text-sm text-gray-400">This financial report is protected</p>
                </div>
              </div>
              <button
                onClick={() => { setCodeModalOpen(false); setSelectedReport(null); }}
                className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Enter the access code to view <strong>{selectedReport.title}</strong>.
              </p>

              {codeError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p className="text-sm font-medium">{codeError}</p>
                </div>
              )}

              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()}
                className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-center text-lg font-mono tracking-widest bg-gray-50"
                placeholder="Enter code..."
                autoFocus
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setCodeModalOpen(false); setSelectedReport(null); }}
                  className="flex-1 px-4 py-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors border border-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyCode}
                  disabled={verifying}
                  className="flex-1 px-4 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-rose-600/20"
                >
                  {verifying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Open"}
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center mt-4">
                Contact admin@crossbordersoutreach.org if you need an access code.
              </p>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}