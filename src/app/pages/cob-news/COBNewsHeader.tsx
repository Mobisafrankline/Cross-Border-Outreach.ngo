import {
  Search,
  ArrowLeft,
  UserPlus,
  LogIn
} from "lucide-react";
import { Link } from "react-router";

interface COBNewsHeaderProps {
  currentTime: string;
}

export default function COBNewsHeader({ currentTime }: COBNewsHeaderProps) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      {/* ── Newspaper Masthead ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-300 shadow-sm">
        {/* Thin accent stripe */}
        <div className="h-[3px] bg-gradient-to-r from-blue-700 via-red-600 to-orange-500" />

        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          {/* Top Bar: Date + Back + Actions */}
          <div className="flex items-center justify-between h-8 border-b border-slate-200 text-[10px] font-medium text-slate-500" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-1 text-slate-500 hover:text-blue-700 transition-colors font-semibold uppercase tracking-wider"
                title="Return to Main Site"
              >
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Main Site</span>
              </Link>
              <span className="hidden sm:block text-slate-300">|</span>
              <span className="hidden sm:block">{today}</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/global-news/login"
                className="flex items-center gap-1 px-2.5 py-0.5 text-slate-600 hover:text-blue-700 font-semibold transition-colors uppercase tracking-wider"
              >
                <LogIn className="w-3 h-3" />
                Sign In
              </Link>
              <Link
                to="/global-news/sign-up"
                className="flex items-center gap-1 px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded transition-colors uppercase tracking-wider"
              >
                <UserPlus className="w-3 h-3" />
                Subscribe
              </Link>
            </div>
          </div>

          {/* Masthead */}
          <div className="flex items-center justify-between py-1.5 md:py-2">
            <Link to="/global-news" className="flex-1 text-center group">
              <h1
                className="text-2xl md:text-3.5xl text-slate-900 tracking-tight leading-none group-hover:text-blue-800 transition-colors"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
              >
                CBNN <span className="italic font-normal text-blue-700">News</span>
              </h1>
              <div
                className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-0.5 font-medium"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Cross-Borders Outreach International
              </div>
            </Link>
          </div>

          {/* Desktop Search & Nav row */}
          <div className="hidden md:flex items-center justify-center pb-2 gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Search articles..."
                className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50 rounded-sm pl-9 pr-4 py-1 text-xs text-slate-800 outline-none w-60 focus:w-80 transition-all placeholder:text-slate-400"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
