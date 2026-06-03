import {
  Search,
  Globe,
  ArrowLeft,
  UserPlus,
  LogIn
} from "lucide-react";
import { Link } from "react-router";

interface COBNewsHeaderProps {
  currentTime: string;
}

export default function COBNewsHeader({ currentTime }: COBNewsHeaderProps) {

  return (
    <>
      {/* ── Warm NGO Header ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-orange-500 to-red-600" />
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back to Home + Logo */}
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors text-xs font-bold uppercase tracking-wider"
                title="Return to Main Site"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Main Site</span>
              </Link>
              <div className="w-px h-6 bg-slate-200 hidden sm:block" />
              <Link to="/global-news" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <Globe className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <div className="text-slate-900 font-black text-lg tracking-tight leading-none group-hover:text-blue-600 transition-colors">COB News</div>
                  <div className="text-[10px] text-orange-500 font-bold tracking-widest uppercase leading-none mt-1">Cross-Borders Outreach</div>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Search */}
            <div className="hidden md:flex items-center">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search global impact..."
                  className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-full pl-10 pr-4 py-2 text-sm text-slate-800 outline-none w-64 focus:w-80 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <Link
                to="/global-news/login"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-blue-600 text-sm font-bold transition-colors rounded-full hover:bg-blue-50"
              >
                <LogIn className="w-4 h-4" />
                Log In
              </Link>

              <Link
                to="/global-news/sign-up"
                className="hidden sm:flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-full transition-colors shadow-sm hover:shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                Join Us
              </Link>

            </div>
          </div>
        </div>
      </header>
    </>
  );
}
