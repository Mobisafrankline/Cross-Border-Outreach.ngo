import { useState } from "react";
import { Users, UserCog, Download, UsersRound } from "lucide-react";
import AdminDonorsTab from "./AdminDonorsTab";
import AdminAdminsTab from "./AdminAdminsTab";

type TabType = "donors" | "admins";

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState<TabType>("donors");

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <UsersRound className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600">Manage donors and system administrators</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-6 mt-8 -mb-6">
            <button
              onClick={() => setActiveTab("donors")}
              className={`flex items-center gap-2 pb-4 px-2 font-semibold text-sm transition-colors border-b-2 ${
                activeTab === "donors"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Users className="w-4 h-4" />
              Donors
            </button>
            <button
              onClick={() => setActiveTab("admins")}
              className={`flex items-center gap-2 pb-4 px-2 font-semibold text-sm transition-colors border-b-2 ${
                activeTab === "admins"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <UserCog className="w-4 h-4" />
              Users
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "donors" ? <AdminDonorsTab /> : <AdminAdminsTab />}
      </div>
    </div>
  );
}
