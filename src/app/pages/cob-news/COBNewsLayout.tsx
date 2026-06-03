import { useState, useEffect } from "react";
import { Globe, Activity, Home, Compass, Bookmark, LayoutList, Menu, X, LogIn, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Outlet, Link } from "react-router";
import COBNewsHeader from "./COBNewsHeader";

const tickerItems = [
  "Global hunger crisis requires immediate action", 
  "UN appeals for $2B in humanitarian aid", 
  "Red Cross deploys specialized teams to flood zones", 
  "New school infrastructure built in rural Kenya", 
  "Clean water initiative successfully reaches 1M people", 
  "Cross-Border volunteers mobilize for upcoming mission"
];

export default function COBNewsLayout() {
  const [currentTime, setCurrentTime] = useState("");
  const [activeBottomTab, setActiveBottomTab] = useState("for-you");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-200 relative overflow-hidden">
      {/* Warm Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100/40 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        <COBNewsHeader currentTime={currentTime} />

        {/* ── NGO Charity Action Ticker ── */}
        <div className="bg-white/90 backdrop-blur-md border-b border-slate-200 h-10 flex items-center overflow-hidden relative shadow-sm z-20">
          <div className="flex-shrink-0 px-4 bg-red-600 h-full flex items-center justify-center text-white text-[11px] font-bold uppercase tracking-wider relative z-10 shadow-md">
            <Activity className="w-3.5 h-3.5 mr-2" />
            LIVE IMPACT
          </div>
          <div className="flex-1 overflow-hidden relative h-full flex items-center">
            <motion.div 
              className="flex whitespace-nowrap items-center h-full"
              animate={{ x: [0, -1000] }}
              transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
            >
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <div key={i} className="flex items-center text-[12px] font-medium text-slate-600">
                  <span className="mx-6 text-slate-300">|</span>
                  <span className="hover:text-blue-600 cursor-pointer transition-colors">{item}</span>
                </div>
              ))}
            </motion.div>
          </div>
          <div className="flex-shrink-0 px-4 h-full flex items-center border-l border-slate-200 text-[11px] font-bold text-slate-500 bg-slate-50">
            <span className="mr-2">LOCAL TIME</span> {currentTime} <Globe className="w-3.5 h-3.5 ml-2 text-blue-500" />
          </div>
        </div>

        {/* ── Page Content ── */}
        <main className="relative pb-20 md:pb-0">
          <Outlet context={{ activeBottomTab }} />
        </main>

        {/* ── Mobile Bottom Navigation ── */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 z-50 px-6 py-3 flex items-center justify-between">
          <button 
            onClick={() => {
              setActiveBottomTab("for-you");
              setIsMenuOpen(false);
            }}
            className={`flex flex-col items-center gap-1 transition-colors ${activeBottomTab === "for-you" && !isMenuOpen ? "text-blue-600" : "text-slate-400"}`}
          >
            <Compass className={`w-6 h-6 ${activeBottomTab === "for-you" && !isMenuOpen ? "fill-blue-50 text-blue-600" : ""}`} />
            <span className="text-[10px] font-bold">For You</span>
          </button>
          
          <button 
            onClick={() => {
              setActiveBottomTab("news");
              setIsMenuOpen(false);
            }}
            className={`flex flex-col items-center gap-1 transition-colors ${activeBottomTab === "news" && !isMenuOpen ? "text-blue-600" : "text-slate-400"}`}
          >
            <LayoutList className={`w-6 h-6 ${activeBottomTab === "news" && !isMenuOpen ? "fill-blue-50 text-blue-600" : ""}`} />
            <span className="text-[10px] font-bold">News</span>
          </button>
          
          <button 
            onClick={() => {
              setActiveBottomTab("following");
              setIsMenuOpen(false);
            }}
            className={`flex flex-col items-center gap-1 transition-colors ${activeBottomTab === "following" && !isMenuOpen ? "text-blue-600" : "text-slate-400"}`}
          >
            <Bookmark className={`w-6 h-6 ${activeBottomTab === "following" && !isMenuOpen ? "fill-blue-50 text-blue-600" : ""}`} />
            <span className="text-[10px] font-bold">Following</span>
          </button>

          <button 
            onClick={() => setIsMenuOpen(true)}
            className={`flex flex-col items-center gap-1 transition-colors ${isMenuOpen ? "text-blue-600" : "text-slate-400"}`}
          >
            <Menu className={`w-6 h-6 ${isMenuOpen ? "text-blue-600" : ""}`} />
            <span className="text-[10px] font-bold">Menu</span>
          </button>
        </div>

        {/* ── Slide-up Mobile Menu Drawer ── */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed bottom-[72px] left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-40 md:hidden overflow-hidden border-t border-slate-200 pb-4"
              >
                <div className="p-4 flex items-center justify-between border-b border-slate-100">
                  <span className="text-slate-900 font-black text-lg tracking-tight flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" /> COB News
                  </span>
                  <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-500 hover:text-red-500 bg-slate-50 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/global-news"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-3 bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 flex items-center gap-2"
                    >
                      <Home className="w-4 h-4 text-slate-400" /> Home
                    </Link>
                    <Link
                      to="/"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-3 bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 flex items-center gap-2"
                    >
                      <Globe className="w-4 h-4 text-slate-400" /> Main Site
                    </Link>
                  </div>
                  
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <Link
                      to="/global-news/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl w-full transition-colors"
                    >
                      <LogIn className="w-5 h-5" />
                      Log In to Account
                    </Link>
                    <Link
                      to="/global-news/sign-up"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl w-full transition-colors shadow-md"
                    >
                      <UserPlus className="w-5 h-5" />
                      Join the Community
                    </Link>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
