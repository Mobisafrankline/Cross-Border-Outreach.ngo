import { useState, useEffect } from "react";
import { Users, Search, Shield, Phone, Loader2, AlertCircle, Calendar } from "lucide-react";
import { supabase } from "../../../lib/supabase";

interface SystemUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  user_type: string;
  created_at: string;
}

export default function AdminAdminsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.rpc('get_all_system_users');
        
      if (error) throw error;
      setUsers(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load admin users.");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    const emailStr = (user.email || "").toLowerCase();
    const typeStr = (user.user_type || "").toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                          emailStr.includes(searchQuery.toLowerCase()) ||
                          typeStr.includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-0.5">Total Users</div>
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">
           <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-0.5">Active Accounts</div>
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
            placeholder="Search users by name or location..."
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        user.user_type === 'Admin' ? 'bg-blue-100 text-blue-600' : 
                        user.user_type === 'Donor' ? 'bg-green-100 text-green-600' : 
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <span className="font-bold text-sm uppercase">
                          {user.first_name?.[0] || user.email[0]}{user.last_name?.[0] || ''}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {user.first_name || user.last_name ? `${user.first_name || ''} ${user.last_name || ''}` : 'Unregistered Profile'}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Phone className="w-3.5 h-3.5" />
                        {user.phone || 'No phone provided'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-sm text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${
                      user.user_type === 'Admin' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      user.user_type === 'Donor' ? 'bg-green-50 text-green-700 border-green-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {user.user_type === 'Admin' ? 'System Admin' : user.user_type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && !loading && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 mt-6">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}
