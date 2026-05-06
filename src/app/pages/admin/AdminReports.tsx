import { useState, useEffect } from "react";
import { FileText, Plus, Trash2, Search, Loader2, AlertCircle, X, ExternalLink, Lock, Calendar, ClipboardList, Clock, BarChart3, DollarSign } from "lucide-react";
import { getReports, createReport, deleteReport } from "../../../lib/supabase";
import type { Report } from "../../../lib/supabase";

type ReportCategory = "all" | "event" | "quarterly" | "monthly" | "yearly" | "financial";

const CATEGORIES: { value: ReportCategory; label: string; icon: any }[] = [
  { value: "all",       label: "All",        icon: FileText },
  { value: "event",     label: "Event",      icon: Calendar },
  { value: "quarterly", label: "Quarterly",  icon: ClipboardList },
  { value: "monthly",   label: "Monthly",    icon: Clock },
  { value: "yearly",    label: "Yearly",     icon: BarChart3 },
  { value: "financial", label: "Financial",  icon: DollarSign },
];

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<ReportCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCategory, setFormCategory] = useState<Report["category"]>("event");
  const [formYear, setFormYear] = useState(new Date().getFullYear().toString());
  const [formDate, setFormDate] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formSize, setFormSize] = useState("");
  const [formPages, setFormPages] = useState("");
  const [formAccessCode, setFormAccessCode] = useState("");

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

  const filtered = reports
    .filter((r) => activeFilter === "all" || r.category === activeFilter)
    .filter((r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this report?")) {
      const { error } = await deleteReport(id);
      if (!error) {
        setReports(reports.filter((r) => r.id !== id));
      } else {
        alert("Failed to delete report.");
      }
    }
  };

  const resetForm = () => {
    setFormTitle("");
    setFormDesc("");
    setFormCategory("event");
    setFormYear(new Date().getFullYear().toString());
    setFormDate("");
    setFormUrl("");
    setFormSize("");
    setFormPages("");
    setFormAccessCode("");
    setError(null);
  };

  const handleSave = async () => {
    if (!formTitle || !formUrl) {
      setError("Title and File URL are required.");
      return;
    }
    setSaving(true);
    setError(null);

    try {
      const { error: createError } = await createReport({
        title: formTitle,
        description: formDesc,
        category: formCategory,
        year: formYear,
        date: formDate,
        file_url: formUrl,
        file_size: formSize,
        page_count: parseInt(formPages) || 0,
        access_code: formCategory === "financial" && formAccessCode ? formAccessCode : null,
      });

      if (createError) throw createError;

      setModalOpen(false);
      resetForm();
      fetchReports();
    } catch (err: any) {
      setError(err.message || "Failed to save report.");
    } finally {
      setSaving(false);
    }
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      event: "bg-emerald-100 text-emerald-700",
      quarterly: "bg-violet-100 text-violet-700",
      monthly: "bg-amber-100 text-amber-700",
      yearly: "bg-cyan-100 text-cyan-700",
      financial: "bg-rose-100 text-rose-700",
    };
    return colors[cat] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Reports Management</h1>
                <p className="text-gray-600">Upload and manage organization reports</p>
              </div>
            </div>
            <button
              onClick={() => { resetForm(); setModalOpen(true); }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  placeholder="Search reports..."
                />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveFilter(cat.value)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    activeFilter === cat.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filtered.length} of {reports.length} reports
          </div>
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-gray-900 truncate">{report.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${getCategoryColor(report.category)}`}>
                        {report.category}
                      </span>
                      {report.category === "financial" && report.access_code && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-700 text-xs font-semibold rounded-full">
                          <Lock className="w-3 h-3" /> Protected
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      {report.year && <span>{report.year}</span>}
                      {report.date && <><span>•</span><span>{report.date}</span></>}
                      {report.file_size && <><span>•</span><span>{report.file_size}</span></>}
                      {report.page_count > 0 && <><span>•</span><span>{report.page_count} pages</span></>}
                    </div>
                    {report.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">{report.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <a
                    href={report.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold text-sm hover:bg-blue-100 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" /> View
                  </a>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold text-sm hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-600">Upload a report to get started</p>
          </div>
        )}
      </div>

      {/* Add Report Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Add Report</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Report Title *</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="e.g. Q1 2026 Impact Report"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Report["category"])}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  >
                    <option value="event">Event Report</option>
                    <option value="quarterly">Quarterly Report</option>
                    <option value="monthly">Monthly Report</option>
                    <option value="yearly">Yearly Report</option>
                    <option value="financial">Financial Report</option>
                  </select>
                </div>

                {/* Access Code (only for financial) */}
                {formCategory === "financial" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center gap-1.5">
                        <Lock className="w-4 h-4 text-rose-500" />
                        Access Code (optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formAccessCode}
                      onChange={(e) => setFormAccessCode(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none font-mono"
                      placeholder="e.g. FIN2026Q1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Public visitors must enter this code to download. Leave blank for open access.
                    </p>
                  </div>
                )}

                {/* Year & Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                    <input
                      type="text"
                      value={formYear}
                      onChange={(e) => setFormYear(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      placeholder="2026"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                    <input
                      type="text"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      placeholder="January 2026"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                    placeholder="Brief description of this report..."
                  />
                </div>

                {/* File URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">File URL (Google Drive Link) *</label>
                  <input
                    type="url"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="https://docs.google.com/..."
                  />
                </div>

                {/* Size & Pages */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">File Size</label>
                    <input
                      type="text"
                      value={formSize}
                      onChange={(e) => setFormSize(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      placeholder="e.g. 2.4 MB"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Page Count</label>
                    <input
                      type="number"
                      value={formPages}
                      onChange={(e) => setFormPages(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      placeholder="e.g. 39"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish Report"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
