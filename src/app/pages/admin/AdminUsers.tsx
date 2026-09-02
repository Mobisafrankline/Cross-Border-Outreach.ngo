import { useState } from "react";
import { Users, UserCog, Download, UsersRound } from "lucide-react";
import AdminDonorsTab from "./AdminDonorsTab";
import AdminAdminsTab from "./AdminAdminsTab";

type TabType = "donors" | "admins";

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState<TabType>("donors");

  return (
    <div className="flex-1 bg-sky-50 text-navy-900 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <UsersRound className="w-8 h-8 text-[#F5B800]" />
            <div>
              <h1 className="text-3xl font-bold text-navy-900 font-playfair">User Management</h1>
              <p className="text-slate-500 font-medium">Manage donors and system administrators</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-sky-50 text-slate-700 border border-slate-200 rounded-xl font-bold transition-all shadow-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-6 mt-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("donors")}
            className={`flex items-center gap-2 pb-4 px-2 font-bold text-sm transition-colors border-b-2 -mb-[1px] ${
              activeTab === "donors"
                ? "border-[#F5B800] text-[#F5B800]"
                : "border-transparent text-slate-500 hover:text-navy-900 hover:border-slate-300"
            }`}
          >
            <Users className="w-4 h-4" />
            Donors
          </button>
          <button
            onClick={() => setActiveTab("admins")}
            className={`flex items-center gap-2 pb-4 px-2 font-bold text-sm transition-colors border-b-2 -mb-[1px] ${
              activeTab === "admins"
                ? "border-[#F5B800] text-[#F5B800]"
                : "border-transparent text-slate-500 hover:text-navy-900 hover:border-slate-300"
            }`}
          >
            <UserCog className="w-4 h-4" />
            Users
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === "donors" ? <AdminDonorsTab /> : <AdminAdminsTab />}
      </div>
    </div>
  );
}
