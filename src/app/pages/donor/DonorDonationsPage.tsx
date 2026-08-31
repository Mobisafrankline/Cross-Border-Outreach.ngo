import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../../lib/AuthContext";
import { getDonorDonations, getDonorProfile } from "../../../lib/supabase";
import type { Donation, Donor } from "../../../lib/supabase";
import {
  Download, History, AlertCircle, Loader2,
  ChevronUp, ChevronDown, Filter, RefreshCw,
} from "lucide-react";
import "../../../styles/portal.css";

const PROGRAM_COLORS: Record<string, string> = {
  "Food Support Program":  "#3b82f6",
  "Education Initiative":  "#8b5cf6",
  "Healthcare Outreach":   "#10b981",
  "Economic Empowerment":  "#f59e0b",
};

function statusBadge(status: string) {
  const map: Record<string, { bg: string; color: string }> = {
    completed: { bg: "#f0fdf4", color: "#16a34a" },
    pending:   { bg: "#fffbeb", color: "#d97706" },
    failed:    { bg: "#fef2f2", color: "#dc2626" },
  };
  const s = map[status] ?? { bg: "#f8fafc", color: "#64748b" };
  return (
    <span style={{ padding:"3px 10px", borderRadius:999, fontSize:12, fontWeight:600, background:s.bg, color:s.color, textTransform:"capitalize" }}>
      {status}
    </span>
  );
}

export default function DonorDonationsPage() {
  const { user } = useAuth();
  const [donor, setDonor]         = useState<Donor | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  const [filterStatus,  setFilterStatus]  = useState("all");
  const [filterProgram, setFilterProgram] = useState("all");
  const [sortField,     setSortField]     = useState<"date" | "amount">("date");
  const [sortAsc,       setSortAsc]       = useState(false);
  const [search,        setSearch]        = useState("");

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const [profileRes, donationsRes] = await Promise.all([
        getDonorProfile(user.id),
        getDonorDonations(user.id),
      ]);
      if (profileRes.error) setError(profileRes.error.message);
      else setDonor(profileRes.data);
      if (!donationsRes.error) setDonations(donationsRes.data ?? []);
      setLoading(false);
    };
    load();
  }, [user]);

  const allPrograms = [...new Set(donations.map(d => d.program))];

  const filtered = useMemo(() => {
    let list = [...donations];
    if (filterStatus  !== "all") list = list.filter(d => d.status  === filterStatus);
    if (filterProgram !== "all") list = list.filter(d => d.program === filterProgram);
    if (search.trim()) list = list.filter(d =>
      d.program.toLowerCase().includes(search.toLowerCase()) ||
      d.receipt_number?.toLowerCase().includes(search.toLowerCase())
    );
    list.sort((a, b) => {
      const diff = sortField === "date"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : a.amount - b.amount;
      return sortAsc ? diff : -diff;
    });
    return list;
  }, [donations, filterStatus, filterProgram, sortAsc, sortField, search]);

  const completed   = filtered.filter(d => d.status === "completed");
  const totalAmount = completed.reduce((s, d) => s + d.amount, 0);

  const donorName = donor ? `${donor.first_name} ${donor.last_name}` : user?.email ?? "Donor";

  const generateSingleReceipt = (don: Donation) => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<html><head><title>Receipt</title><style>body{font-family:system-ui;max-width:680px;margin:0 auto;padding:40px;color:#111}.header{text-align:center;border-bottom:2px solid #e5e7eb;padding-bottom:20px;margin-bottom:30px}.row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px dashed #e5e7eb}.footer{margin-top:50px;font-size:13px;color:#6b7280;text-align:center;border-top:1px solid #e5e7eb;padding-top:20px}</style></head><body>
      <div class="header"><h2>Official Donation Receipt</h2><p>Cross-Borders Outreach · Tax ID: 12-3456789</p></div>
      <div style="margin-bottom:24px"><strong>Donor:</strong> ${donorName}<br><strong>Email:</strong> ${user?.email}</div>
      <div class="row"><span>Receipt #</span><strong>${don.receipt_number||don.id||"N/A"}</strong></div>
      <div class="row"><span>Date</span><strong>${new Date(don.date).toLocaleDateString()}</strong></div>
      <div class="row"><span>Program</span><strong>${don.program}</strong></div>
      <div class="row"><span>Amount</span><strong>$${don.amount.toFixed(2)}</strong></div>
      <div class="row"><span>Payment</span><strong style="text-transform:capitalize">${don.payment_method}</strong></div>
      <p style="margin-top:24px;font-size:14px;line-height:1.6">Thank you for your generous contribution. No goods or services were provided in exchange.</p>
      <div class="footer">Cross-Borders Outreach is a registered 501(c)(3) non-profit organization.</div>
    </body></html>`);
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 250);
  };

  const generateAnnualReceipt = () => {
    const year = new Date().getFullYear();
    const yearly = completed.filter(d => new Date(d.date).getFullYear() === year);
    const yearlyTotal = yearly.reduce((s, d) => s + d.amount, 0);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<html><head><title>Annual Receipt ${year}</title><style>body{font-family:system-ui;max-width:800px;margin:0 auto;padding:40px;color:#111}.header{text-align:center;border-bottom:2px solid #e5e7eb;padding-bottom:20px;margin-bottom:30px}table{border-collapse:collapse;width:100%;margin-bottom:30px}th,td{padding:12px;text-align:left;border-bottom:1px solid #e5e7eb}th{background:#f9fafb;font-weight:600;color:#4b5563}.footer{margin-top:50px;font-size:13px;color:#6b7280;text-align:center;border-top:1px solid #e5e7eb;padding-top:20px}</style></head><body>
      <div class="header"><h2>Annual Tax Receipt ${year}</h2><p>Cross-Borders Outreach · Tax ID: 12-3456789</p></div>
      <div style="margin-bottom:24px"><strong>Donor:</strong> ${donorName}<br><strong>Email:</strong> ${user?.email}<br><strong>Issued:</strong> ${new Date().toLocaleDateString()}</div>
      <table><thead><tr><th>Date</th><th>Program</th><th>Amount</th></tr></thead><tbody>
      ${yearly.map(d=>`<tr><td>${new Date(d.date).toLocaleDateString()}</td><td>${d.program}</td><td>$${d.amount.toFixed(2)}</td></tr>`).join("")}
      </tbody></table>
      <p style="text-align:right;font-size:18px;font-weight:700">Total: $${yearlyTotal.toFixed(2)}</p>
      <p style="font-size:14px;line-height:1.6">Thank you for your generous support. No goods or services were provided in exchange.</p>
      <div class="footer">Cross-Borders Outreach is a registered 501(c)(3) non-profit organization.</div>
    </body></html>`);
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 250);
  };

  const SortButton = ({ field, label }: { field: "date"|"amount"; label: string }) => (
    <button
      onClick={() => { if (sortField === field) setSortAsc(v => !v); else { setSortField(field); setSortAsc(false); } }}
      className="flex items-center gap-1 font-semibold text-slate-500 hover:text-slate-800 transition-colors text-xs uppercase tracking-wide"
    >
      {label}
      {sortField === field
        ? sortAsc ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>
        : <ChevronDown className="w-3 h-3 opacity-30"/>}
    </button>
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin"/>
    </div>
  );

  return (
    <div className="flex-1 bg-slate-50 pb-12 portal-fade-in" style={{ fontFamily:"'Inter',sans-serif" }}>

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0" style={{background:"linear-gradient(135deg,#0648b3,#0959d6)"}}/>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <History className="w-6 h-6 opacity-75"/> Donation History
              </h1>
              <p className="text-blue-200 text-sm mt-1">Your complete giving record</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-white">
                <p className="text-xs opacity-70">Total Contributed</p>
                <p className="font-black text-xl">${totalAmount.toLocaleString()}</p>
              </div>
              {completed.length > 0 && (
                <button onClick={generateAnnualReceipt}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white text-blue-700 font-bold text-sm rounded-xl shadow-sm hover:shadow-md transition-all">
                  <Download className="w-4 h-4"/> Annual Receipt
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0"/> {error}
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label:"Total Donations", value:donations.length,                              color:"#0959d6" },
            { label:"Completed",       value:completed.length,                              color:"#16a34a" },
            { label:"Pending",         value:donations.filter(d=>d.status==="pending").length, color:"#d97706" },
          ].map(s => (
            <div key={s.label} className="portal-stat-card text-center py-4">
              <div className="text-3xl font-black" style={{color:s.color}}>{s.value}</div>
              <div className="text-sm text-slate-500 font-medium mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0"/>
            <input
              type="text"
              placeholder="Search program or receipt…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 flex-1 min-w-[180px]"
              style={{background:"#f8fafc",fontFamily:"'Inter',sans-serif"}}
            />
            <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-400"
              style={{background:"#f8fafc"}}>
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <select value={filterProgram} onChange={e=>setFilterProgram(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-400"
              style={{background:"#f8fafc"}}>
              <option value="all">All Programs</option>
              {allPrograms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <span className="ml-auto text-sm text-slate-400 font-medium">{filtered.length} of {donations.length}</span>
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <History className="w-12 h-12 text-slate-200 mx-auto mb-3"/>
            <p className="text-slate-500 font-semibold">No donations found</p>
            <p className="text-slate-400 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{background:"#f8fafc",borderBottom:"2px solid #f1f5f9"}}>
                    <th className="px-5 py-3.5 text-left"><SortButton field="date"   label="Date"/></th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Program</th>
                    <th className="px-5 py-3.5 text-left"><SortButton field="amount" label="Amount"/></th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Receipt #</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(d => (
                    <tr key={d.id} style={{borderBottom:"1px solid #f8fafc"}} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 text-slate-600">{new Date(d.date).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:PROGRAM_COLORS[d.program]??"#94a3b8"}}/>
                          <span className="text-slate-700 font-medium">{d.program}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-900">${d.amount.toLocaleString()}</td>
                      <td className="px-5 py-4">{statusBadge(d.status)}</td>
                      <td className="px-5 py-4 text-xs text-slate-400 font-mono">{d.receipt_number || "—"}</td>
                      <td className="px-5 py-4">
                        {d.status === "completed" ? (
                          <button onClick={() => generateSingleReceipt(d)}
                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors">
                            <Download className="w-3.5 h-3.5"/> PDF
                          </button>
                        ) : <span className="text-slate-300">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
