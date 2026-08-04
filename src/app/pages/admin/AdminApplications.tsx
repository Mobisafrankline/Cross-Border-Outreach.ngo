import { useState, useEffect } from "react";
import { Link } from "react-router";
import { 
  FileSignature, CheckCircle2, XCircle, Loader2, ArrowLeft, Mail, Calendar, Eye
} from "lucide-react";
import { getAllApplications, updateApplicationStatus } from "../../../lib/supabase";

export default function AdminApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'volunteer' | 'job'>('all');
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  const fetchApps = async () => {
    setLoading(true);
    const { data, error } = await getAllApplications();
    if (data) setApplications(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await updateApplicationStatus(id, status);
    fetchApps();
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp({ ...selectedApp, status });
    }
  };

  const filteredApps = applications.filter(app => filterType === 'all' || app.type === filterType);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'reviewed': return 'bg-blue-100 text-blue-700';
      case 'accepted': return 'bg-emerald-100 text-emerald-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="flex-1 min-h-full bg-slate-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 font-playfair">
              <FileSignature className="w-8 h-8 text-blue-600" />
              Applications
            </h1>
          </div>
          
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex">
            {['all', 'volunteer', 'job'].map(t => (
              <button 
                key={t}
                onClick={() => setFilterType(t as any)}
                className={`px-4 py-2 text-sm font-bold rounded-lg capitalize transition-colors ${filterType === t ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 font-bold text-slate-700">Applicant</th>
                    <th className="p-4 font-bold text-slate-700">Type / Interest</th>
                    <th className="p-4 font-bold text-slate-700">Date</th>
                    <th className="p-4 font-bold text-slate-700 text-center">Status</th>
                    <th className="p-4 font-bold text-slate-700 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">No applications found.</td>
                    </tr>
                  ) : (
                    filteredApps.map((app) => (
                      <tr key={app.id} onClick={() => setSelectedApp(app)} className={`cursor-pointer transition-colors ${selectedApp?.id === app.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{app.first_name} {app.last_name}</div>
                          <div className="text-sm text-slate-500">{app.email}</div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mb-1 uppercase tracking-wider ${app.type === 'job' ? 'bg-pink-100 text-pink-700' : 'bg-purple-100 text-purple-700'}`}>
                            {app.type}
                          </span>
                          <div className="text-sm text-slate-700 font-medium line-clamp-1">
                            {app.type === 'job' && app.jobs ? app.jobs.title : app.interest_or_position}
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 text-sm">
                          {new Date(app.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors inline-block">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="lg:col-span-1">
              {selectedApp ? (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 font-playfair">{selectedApp.first_name} {selectedApp.last_name}</h3>
                      <a href={`mailto:${selectedApp.email}`} className="text-blue-600 hover:underline flex items-center gap-1 mt-1 text-sm font-medium">
                        <Mail className="w-4 h-4" /> {selectedApp.email}
                      </a>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${selectedApp.type === 'job' ? 'bg-pink-100 text-pink-700' : 'bg-purple-100 text-purple-700'}`}>
                      {selectedApp.type}
                    </span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Applying For</div>
                      <div className="font-medium text-slate-900">
                        {selectedApp.type === 'job' && selectedApp.jobs ? selectedApp.jobs.title : selectedApp.interest_or_position}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Availability</div>
                      <div className="font-medium text-slate-900">{selectedApp.availability || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">About</div>
                      <div className="text-slate-700 text-sm whitespace-pre-wrap p-4 bg-slate-50 rounded-xl border border-slate-100 mt-2">
                        {selectedApp.about || 'No additional information provided.'}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Update Status</div>
                    <select 
                      value={selectedApp.status}
                      onChange={(e) => handleStatusChange(selectedApp.id, e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-semibold text-slate-700"
                    >
                      <option value="pending">Pending Review</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="accepted">Accepted / Hired</option>
                      <option value="rejected">Declined</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-100 rounded-3xl border border-slate-200 border-dashed p-10 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                  <FileSignature className="w-12 h-12 text-slate-300 mb-4" />
                  <p className="text-slate-500 font-medium">Select an application from the list to view its details.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
