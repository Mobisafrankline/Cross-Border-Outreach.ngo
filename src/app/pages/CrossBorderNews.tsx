import { useState, useEffect } from "react";
import { 
  Search, 
  TrendingUp, 
  Globe, 
  Clock, 
  ChevronRight, 
  PlayCircle,
  Activity,
  Heart,
  Share2,
  Bookmark,
  MapPin,
  CloudSun,
  ArrowLeft,
  Home,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

// Charity & Humanitarian Mock Data
const topStory = {
  id: 1,
  title: "Cross-Border Outreach Delivers 50 Tons of Medical Supplies",
  excerpt: "In a monumental effort to support vulnerable communities, our logistics team successfully crossed borders to deliver life-saving medical supplies and establish mobile clinics in underserved regions.",
  category: "Medical Relief",
  time: "2 hours ago",
  author: "CBO Communications",
  image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ce122?q=80&w=1200&auto=format&fit=crop"
};

const sideFeatured = {
  id: 2,
  title: "Education Without Borders: Equipping 10,000 Students",
  category: "Education Support",
  time: "4 hours ago",
  image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop"
};

const mainGridStories = [
  {
    id: 3,
    title: "Emergency Flood Relief Commences in Nairobi",
    category: "Disaster Response",
    time: "5 hours ago",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Providing Clean Water in Drought-Stricken Areas",
    category: "WASH Initiative",
    time: "6 hours ago",
    image: "https://images.unsplash.com/photo-1541810565267-31620cbb716a?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Mobile Clinics Reach Remote Villages in Need",
    category: "Healthcare",
    time: "8 hours ago",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Refugee Camp Receives New Solar Power Grids",
    category: "Infrastructure",
    time: "10 hours ago",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=800&auto=format&fit=crop"
  }
];

const trendingNow = [
  { id: 1, title: "Global push to eradicate preventable diseases gains new momentum" },
  { id: 2, title: "Volunteers cross borders to build sustainable community centers" },
  { id: 3, title: "Record donations fuel our latest disaster relief deployment" },
  { id: 4, title: "New agricultural training program launched for rural farmers" },
  { id: 5, title: "Local NGOs partner for greater impact in cross-border regions" }
];

const picksForYou = [
  {
    id: 101,
    title: "The impact of micro-grants on women entrepreneurs in border towns",
    source: "Economic Empowerment",
    time: "13 hours ago",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 102,
    title: "How solar panels are changing the landscape of rural education",
    source: "Sustainability",
    time: "19 hours ago",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 103,
    title: "Inside the logistics of our emergency food delivery operations",
    source: "Operations",
    time: "1 day ago",
    image: "https://images.unsplash.com/photo-1593113589914-009ce9c22ebf?q=80&w=400&auto=format&fit=crop"
  }
];

const tickerItems = [
  "Global hunger crisis requires immediate action", 
  "UN appeals for $2B in humanitarian aid", 
  "Red Cross deploys specialized teams to flood zones", 
  "New school infrastructure built in rural Kenya", 
  "Clean water initiative successfully reaches 1M people", 
  "Cross-Border volunteers mobilize for upcoming mission"
];

const navCategories = ["Home", "For you", "Disaster Relief", "Education", "Healthcare", "Food Security", "Economic Empowerment", "Global Initiatives"];

export default function CrossBorderNews() {
  const [activeTab, setActiveTab] = useState("Home");
  const [currentTime, setCurrentTime] = useState("");
  const [weather, setWeather] = useState({ temp: "--", desc: "Locating...", city: "Your Location" });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Weather & Geolocation Effect
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            // Fetch weather from open-meteo (no API key required)
            const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const wData = await wRes.json();
            
            // Reverse geocoding using Nominatim
            try {
              const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
              const geoData = await geoRes.json();
              const city = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.county || geoData.address.state || "Local Area";
              setWeather({
                temp: `${Math.round(wData.current_weather.temperature)}°C`,
                desc: "Current Weather",
                city: city
              });
            } catch (e) {
              setWeather({
                temp: `${Math.round(wData.current_weather.temperature)}°C`,
                desc: "Current Weather",
                city: "Local Area"
              });
            }
          } catch (error) {
            setWeather({ temp: "--", desc: "Unavailable", city: "Local Area" });
          }
        },
        () => {
          setWeather({ temp: "--", desc: "Location Access Denied", city: "Unknown Location" });
        }
      );
    } else {
      setWeather({ temp: "--", desc: "Not Supported", city: "Unknown Location" });
    }
  }, []);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileNavOpen]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30">

      {/* ── CBNN News Branded Header ── */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 shadow-lg">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Left: Back to Home + Logo */}
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-xs font-medium"
                title="Back to CrossBorders Outreach"
              >
                <ArrowLeft className="w-4 h-4" />
                <Home className="w-4 h-4 hidden sm:block" />
              </Link>
              <div className="w-px h-5 bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-blue-300" />
                </div>
                <div>
                  <div className="text-white font-extrabold text-sm tracking-tight leading-none">CBNN News</div>
                  <div className="text-[9px] text-blue-300 font-semibold tracking-widest uppercase leading-none mt-0.5">CrossBorders Outreach</div>
                </div>
              </div>
            </div>

            {/* Center: Desktop Search */}
            <div className="hidden md:flex items-center">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 group-focus-within:text-white transition-colors" />
                <input
                  type="text"
                  placeholder="Search CBNN News..."
                  className="bg-white/10 border border-white/10 focus:bg-white/20 focus:border-blue-400 rounded-full pl-9 pr-4 py-1.5 text-sm text-white outline-none w-48 focus:w-64 transition-all placeholder:text-blue-300/60"
                />
              </div>
            </div>

            {/* Right: Time + Mobile Menu */}
            <div className="flex items-center gap-3">
              <div className="text-xs font-bold text-white/80 hidden sm:flex items-center gap-1.5">
                {currentTime}
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
              <Link
                to="/"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-all border border-white/10"
              >
                <Home className="w-3.5 h-3.5" />
                Main Site
              </Link>
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              >
                {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Navigation Drawer ── */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-white z-50 shadow-2xl md:hidden overflow-y-auto"
            >
              <div className="p-4 bg-blue-900 flex items-center justify-between">
                <span className="text-white font-bold text-lg">CBNN News</span>
                <button onClick={() => setMobileNavOpen(false)} className="p-2 text-white hover:bg-white/10 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-1">
                {navCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setActiveTab(cat); setMobileNavOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                      activeTab === cat
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                <div className="border-t border-slate-200 mt-3 pt-3">
                  <Link
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                  >
                    <Home className="w-4 h-4 text-blue-600" />
                    Back to Main Site
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Charity Action Ticker ── */}
      <div className="bg-blue-900 border-b border-blue-950 h-10 flex items-center overflow-hidden relative shadow-md z-20">
        <div className="flex-shrink-0 px-4 bg-red-600 h-full flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest relative z-10 shadow-[4px_0_10px_rgba(0,0,0,0.2)]">
          <Activity className="w-3 h-3 mr-1.5 animate-pulse" />
          Urgent Updates
        </div>
        <div className="flex-1 overflow-hidden relative h-full flex items-center">
          <motion.div 
            className="flex whitespace-nowrap items-center h-full"
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          >
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <div key={i} className="flex items-center text-xs font-semibold text-blue-100">
                <span className="mx-4 text-blue-400">|</span>
                <span className="hover:text-white cursor-pointer transition-colors">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>
        <div className="flex-shrink-0 px-4 h-full flex items-center border-l border-blue-800 text-xs font-bold text-white bg-blue-900">
          {currentTime} <Globe className="w-3.5 h-3.5 ml-2 text-blue-300" />
        </div>
      </div>

      {/* ── Sub Navigation ── */}
      <div className="sticky top-14 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar w-full md:w-auto">
              {navCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 relative ${
                    activeTab === cat 
                      ? "text-blue-700" 
                      : "text-slate-600 hover:text-blue-900 hover:bg-blue-50"
                  }`}
                >
                  {cat}
                  {activeTab === cat && (
                    <motion.div layoutId="navIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  className="bg-slate-100 border border-transparent focus:bg-white focus:border-blue-300 rounded-full pl-9 pr-4 py-1.5 text-sm text-slate-800 outline-none w-48 focus:w-64 transition-all shadow-inner placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        {/* ── Main Layout Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8">
          
          {/* ── LEFT COLUMN (20%) ── */}
          <div className="hidden lg:flex flex-col gap-6 lg:col-span-3 xl:col-span-2">
            
            {/* Widget: Local Briefing & Weather */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-all"></div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" /> Your Area
              </h3>
              <div className="text-2xl font-black text-slate-900 mb-1 line-clamp-1">{weather.city}</div>
              <div className="text-sm text-blue-600 font-bold mb-4">Local Impact</div>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex flex-col justify-center">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{weather.desc}</div>
                  <CloudSun className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-slate-800">{weather.temp}</div>
                </div>
              </div>
            </div>

            {/* Left Featured Story */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden group hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer">
              <div className="h-36 overflow-hidden relative">
                <ImageWithFallback src={sideFeatured.image} alt="Featured" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-2 left-2 px-2 py-1 bg-red-600/90 backdrop-blur text-[9px] font-black uppercase tracking-widest text-white rounded">
                  {sideFeatured.category}
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors mb-2">
                  {sideFeatured.title}
                </h4>
                <div className="flex items-center text-[10px] font-bold text-slate-500">
                  <Clock className="w-3 h-3 mr-1" /> {sideFeatured.time}
                </div>
              </div>
            </div>
            
            {/* Charity Channels Nav Menu */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
               <h3 className="px-3 py-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-1 border-b border-slate-100">Our Channels</h3>
               {[
                 { name: "Disaster Relief", icon: <Heart className="w-4 h-4" /> }, 
                 { name: "Education Support", icon: <PlayCircle className="w-4 h-4" /> }, 
                 { name: "Medical Outreach", icon: <Activity className="w-4 h-4" /> },
                 { name: "Community Action", icon: <Globe className="w-4 h-4" /> }
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:border-blue-400 group-hover:bg-white shadow-sm">
                      <span className="text-slate-400 group-hover:text-blue-600">{item.icon}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-blue-900">{item.name}</span>
                 </div>
               ))}
               <div className="p-3 mt-1 text-xs font-black text-blue-600 hover:text-blue-800 cursor-pointer text-center bg-blue-50/50 rounded-lg">
                 Support A Cause &gt;&gt;
               </div>
            </div>
          </div>

          {/* ── CENTER COLUMN (50%) ── */}
          <div className="col-span-1 lg:col-span-5 xl:col-span-7 flex flex-col gap-6">
            
            {/* Header / Top Stories */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.6)]"></div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Humanitarian Headlines</h2>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>

            {/* Main Featured Story */}
            <div className="relative rounded-3xl overflow-hidden group cursor-pointer border border-slate-200 hover:border-blue-300 transition-all shadow-md hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10" />
              <ImageWithFallback 
                src={topStory.image} 
                alt="Main Story" 
                className="w-full h-[400px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                    {topStory.category}
                  </span>
                  <span className="text-xs font-bold text-blue-200 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1.5" /> {topStory.time}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4 group-hover:text-blue-100 transition-colors">
                  {topStory.title}
                </h1>
                
                <p className="text-slate-200 text-sm md:text-base leading-relaxed max-w-2xl mb-6 hidden md:block font-medium">
                  {topStory.excerpt}
                </p>
                
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{topStory.author}</span>
                  <div className="flex items-center gap-2 ml-auto">
                    <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center backdrop-blur transition-colors border border-white/20">
                      <Bookmark className="w-4 h-4 text-white" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center backdrop-blur transition-colors border border-white/20">
                      <Share2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid Stories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mainGridStories.map((story) => (
                <div key={story.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden group cursor-pointer hover:shadow-lg hover:border-blue-200 transition-all flex flex-col shadow-sm">
                  <div className="h-44 overflow-hidden relative">
                    <ImageWithFallback src={story.image} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded">{story.category}</span>
                        <span className="text-[10px] font-bold text-slate-400">{story.time}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                        {story.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN (30%) ── */}
          <div className="col-span-1 lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
            
            {/* Featured Impact Video */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden relative group cursor-pointer shadow-sm bg-slate-900">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop" 
                alt="Video thumbnail" 
                className="w-full h-48 object-cover opacity-70 group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-8 h-8 text-blue-700 ml-1" />
                </div>
              </div>
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="px-2 py-1 bg-red-600/90 backdrop-blur rounded text-[10px] font-black text-white uppercase tracking-wider flex items-center shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-2"></span> ON THE GROUND
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent">
                <h4 className="text-white font-bold text-sm leading-tight">Video: Inside our latest cross-border relief mission</h4>
              </div>
            </div>

            {/* Trending Impact Initiatives */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl"></div>
              
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                  Trending Impact
                </h3>
              </div>

              <div className="flex flex-col gap-5 relative z-10">
                {trendingNow.map((item, index) => (
                  <div key={item.id} className="flex gap-4 group cursor-pointer">
                    <span className="text-3xl font-black text-slate-200 group-hover:text-blue-500 transition-colors leading-none font-sans">
                      {index + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-700 leading-tight group-hover:text-blue-700 transition-colors pt-1">
                      {item.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Picks For You */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-red-500" />
                  Picks for you
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                {picksForYou.map((pick) => (
                  <div key={pick.id} className="flex gap-4 group cursor-pointer border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <div className="text-[10px] font-black uppercase tracking-wider text-blue-600 mb-1 flex items-center gap-1.5">
                        <span className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center text-blue-800 text-[8px]">{pick.source.charAt(0)}</span>
                        {pick.source}
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors mb-2">
                        {pick.title}
                      </h4>
                      <div className="text-[10px] font-bold text-slate-400">
                        {pick.time}
                      </div>
                    </div>
                    <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                      <ImageWithFallback src={pick.image} alt={pick.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
