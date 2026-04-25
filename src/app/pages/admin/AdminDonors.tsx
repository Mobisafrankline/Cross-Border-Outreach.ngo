import { useState, useEffect } from "react";
import { Users, Search, Filter, Edit, Trash2, Eye, Plus, Download, Mail, Phone, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import type { Donor as BaseDonor } from "../../../lib/supabase";

interface Donor extends BaseDonor {
  // Extending the base Donor type if needed, though they match well
}

export default function AdminDonors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setDonors(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load donors.");
    } finally {
      setLoading(false);
    }
  };

  const filteredDonors = donors.filter(donor => {
    const fullName = `${donor.first_name} ${donor.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                         donor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || donor.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: donors.length,
    active: donors.filter(d => d.status === "active").length,
    totalDonated: donors.reduce((sum, d) => sum + (d.total_donated || 0), 0),
    avgDonation: donors.length > 0 ? Math.round(donors.reduce((sum, d) => sum + (d.total_donated || 0), 0) / donors.length) : 0
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Donor Management</h1>
                <p className="text-gray-600">Manage and track donor information</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                <Plus className="w-4 h-4" />
                Add Donor
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-1">Total Donors</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-1">Active Donors</div>
            <div className="text-3xl font-bold text-green-600">{stats.active}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-1">Total Donated</div>
            <div className="text-3xl font-bold text-blue-600">${stats.totalDonated.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-1">Avg per Donor</div>
            <div className="text-3xl font-bold text-purple-600">${stats.avgDonation.toLocaleString()}</div>
          </div>
        </div>

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
                  placeholder="Search donors by name or email..."
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {(["all", "active", "inactive"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-semibold capitalize transition-all ${
                    filterStatus === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Donors Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Total Donated
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Donations
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Last Donation
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDonors.map((donor) => (
                  <tr key={donor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-bold text-sm uppercase">
                            {donor.first_name?.[0]}{donor.last_name?.[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{donor.first_name} {donor.last_name}</div>
                          <div className="text-xs text-gray-600">Since {new Date(donor.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-gray-900">
                          <Mail className="w-3 h-3" />
                          {donor.email}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 mt-1">
                          <Phone className="w-3 h-3" />
                          {donor.phone || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-gray-900">
                        ${(donor.total_donated || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {donor.donation_count || 0} times
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {/* We don't track lastDonation separately in the donor model yet, defaulting to created_at or NA */}
                        {donor.donation_count > 0 ? "Recently" : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        donor.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {donor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedDonor(donor)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredDonors.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No donors found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Donor Detail Modal */}
      {selectedDonor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setSelectedDonor(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Donor Details</h2>
              <button
                onClick={() => setSelectedDonor(null)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-2xl uppercase">
                    {selectedDonor.first_name?.[0]}{selectedDonor.last_name?.[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedDonor.first_name} {selectedDonor.last_name}</h3>
                  <p className="text-gray-600">Member since {new Date(selectedDonor.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Donated</div>
                  <div className="text-2xl font-bold text-blue-600">${(selectedDonor.total_donated || 0).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Donations</div>
                  <div className="text-2xl font-bold text-green-600">{selectedDonor.donation_count || 0}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Email</div>
                  <div className="text-gray-900">{selectedDonor.email}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Phone</div>
                  <div className="text-gray-900">{selectedDonor.phone || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Last Donation</div>
                  <div className="text-gray-900">{selectedDonor.donation_count > 0 ? "Recently" : "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Status</div>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedDonor.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {selectedDonor.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
