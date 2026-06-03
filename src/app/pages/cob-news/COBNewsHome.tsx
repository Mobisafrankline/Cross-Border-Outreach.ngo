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
  Loader2
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Link, useOutletContext } from "react-router";
import { getArticles } from "../../../lib/supabase";
import type { Article } from "../../../lib/supabase";

export const navCategories = ["Home", "For you", "Disaster Relief", "Education", "Healthcare", "Food Security", "Economic Empowerment", "Global Initiatives"];

export default function COBNewsHome() {
  const [activeTab, setActiveTab] = useState("Home");
  const [weather, setWeather] = useState({ temp: "--", desc: "Locating...", city: "Your Location" });
  
  const { activeBottomTab } = useOutletContext<{ activeBottomTab: string }>() || { activeBottomTab: "for-you" };
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Fetch all published articles
        const { data } = await getArticles(undefined, 'published');
        if (data) setArticles(data);
      } catch (error) {
        console.error("Failed to fetch news", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const wData = await wRes.json();
            try {
              const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
              const geoData = await geoRes.json();
              const city = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.county || geoData.address.state || "Local Area";
              setWeather({ temp: `${Math.round(wData.current_weather.temperature)}°C`, desc: "Current Weather", city });
            } catch (e) {
              setWeather({ temp: `${Math.round(wData.current_weather.temperature)}°C`, desc: "Current Weather", city: "Local Area" });
            }
          } catch (error) {
            setWeather({ temp: "--", desc: "Unavailable", city: "Local Area" });
          }
        },
        () => setWeather({ temp: "--", desc: "Location Access Denied", city: "Unknown Location" })
      );
    } else {
      setWeather({ temp: "--", desc: "Not Supported", city: "Unknown Location" });
    }
  }, []);

  // Data mapping from Supabase articles
  const topStory = articles.length > 0 ? articles[0] : null;
  const sideFeatured = articles.length > 1 ? articles[1] : null;
  const mainGridStories = articles.length > 2 ? articles.slice(2, 6) : [];
  const trendingNow = articles.slice(0, 5);
  const picksForYou = articles.slice(0, 3);

  // Mobile specific lists
  const mobileArticles = 
    activeBottomTab === "news" ? articles.filter(a => a.type === 'news') :
    activeBottomTab === "following" ? articles.slice(0, 2) : // Mock following for now
    articles; // for-you default

  if (loading) {
    return (
      <div className="flex-1 min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* ── Sub Navigation ── */}
      <div className="hidden md:block sticky top-16 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full md:w-auto">
              {navCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 relative ${
                    activeTab === cat
                      ? "text-white bg-blue-600 shadow-md"
                      : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="hidden lg:flex items-center gap-4">
              <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-full text-xs font-bold transition-colors border border-slate-200">
                <Activity className="w-4 h-4" />
                Admin Editor
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8">

          {/* ── LEFT COLUMN (20%) - DESKTOP ONLY ── */}
          <div className="hidden lg:flex flex-col gap-6 lg:col-span-3 xl:col-span-2">
            {/* Widget: Local Briefing & Weather */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-[40px] group-hover:bg-orange-100/50 transition-all"></div>

              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" /> Your Area
              </h3>
              <div className="text-2xl font-black text-slate-900 mb-1 line-clamp-1">{weather.city}</div>
              <div className="text-sm text-blue-600 font-bold mb-5">Local Impact Zone</div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex flex-col justify-center">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{weather.desc}</div>
                  <CloudSun className="w-6 h-6 text-orange-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-800">{weather.temp}</div>
                </div>
              </div>
            </div>

            {/* Left Featured Story */}
            {sideFeatured && (
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden group hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer relative">
                <div className="h-40 overflow-hidden relative">
                  <ImageWithFallback src={sideFeatured.featured_image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800"} alt="Featured" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-red-600/90 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-md">
                    {sideFeatured.category || 'News'}
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors mb-3 line-clamp-2">
                    {sideFeatured.title}
                  </h4>
                  <div className="flex items-center text-xs font-bold text-slate-500">
                    <Clock className="w-3.5 h-3.5 mr-1.5" /> {new Date(sideFeatured.published_at || sideFeatured.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}

            {/* Charity Channels Nav Menu */}
            <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm relative">
               <h3 className="px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100">Ways to Help</h3>
               {[
                 { name: "Disaster Relief", icon: <Heart className="w-4 h-4 text-red-500" />, color: "bg-red-50" },
                 { name: "Education Support", icon: <PlayCircle className="w-4 h-4 text-blue-500" />, color: "bg-blue-50" },
                 { name: "Medical Outreach", icon: <Activity className="w-4 h-4 text-green-500" />, color: "bg-green-50" },
                 { name: "Community Action", icon: <Globe className="w-4 h-4 text-orange-500" />, color: "bg-orange-50" }
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors group">
                    <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600">{item.name}</span>
                 </div>
               ))}
               <div className="mt-3 p-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer text-center rounded-xl transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                 Support A Cause <ChevronRight className="w-4 h-4" />
               </div>
            </div>
          </div>

          {/* ── CENTER COLUMN (50%) ── */}
          <div className="col-span-1 lg:col-span-5 xl:col-span-7 flex flex-col gap-6">
            
            {/* Mobile Header Title */}
            <div className="md:hidden mb-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight capitalize">
                {activeBottomTab.replace('-', ' ')}
              </h1>
              <p className="text-sm text-slate-500 font-medium">Latest updates tailored for you</p>
            </div>

            {/* Desktop Header / Top Stories */}
            <div className="hidden md:flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Global Impact Headlines</h2>
            </div>

            {/* Desktop View Content */}
            <div className="hidden md:flex flex-col gap-6">
              {/* Main Featured Story */}
              {topStory && (
                <div className="relative rounded-3xl overflow-hidden group cursor-pointer border border-slate-200 hover:border-blue-300 transition-all shadow-md hover:shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent z-10" />
                  
                  <ImageWithFallback
                    src={topStory.featured_image || "https://images.unsplash.com/photo-1532938911079-1b06ac7ce122?q=80&w=1200"}
                    alt="Main Story"
                    className="w-full h-[400px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20">
                    <div className="flex items-center gap-4 mb-5">
                      <span className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                        {topStory.category || topStory.type}
                      </span>
                      <span className="text-sm font-bold text-slate-200 flex items-center">
                        <Clock className="w-4 h-4 mr-1.5" /> {new Date(topStory.published_at || topStory.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4 group-hover:text-blue-100 transition-colors">
                      {topStory.title}
                    </h1>
                    <p className="text-slate-200 text-base md:text-lg leading-relaxed max-w-2xl mb-8 hidden md:block font-medium line-clamp-2">
                      {topStory.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                          {topStory.author ? topStory.author.charAt(0) : 'A'}
                        </div>
                        {topStory.author || 'Admin'}
                      </span>
                      <div className="flex items-center gap-3">
                        <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur flex items-center justify-center transition-all border border-white/30">
                          <Bookmark className="w-5 h-5 text-white" />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur flex items-center justify-center transition-all border border-white/30">
                          <Share2 className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid Stories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mainGridStories.map((story) => (
                  <div key={story.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden group cursor-pointer hover:shadow-xl hover:border-blue-200 transition-all flex flex-col">
                    <div className="h-48 overflow-hidden relative">
                      <ImageWithFallback src={story.featured_image || "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800"} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">{story.category || 'Updates'}</span>
                          <span className="text-xs font-bold text-slate-400">{new Date(story.published_at || story.created_at).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-3">
                          {story.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile View Content (Driven by Bottom Nav) */}
            <div className="md:hidden flex flex-col gap-4">
              {mobileArticles.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="font-bold">No articles found in this section.</p>
                </div>
              ) : (
                mobileArticles.map((story, i) => (
                  <div key={story.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden group shadow-sm flex flex-col">
                    {/* Make first item large, rest standard cards */}
                    {i === 0 ? (
                      <div className="relative">
                        <div className="h-56 overflow-hidden relative">
                          <ImageWithFallback src={story.featured_image || "https://images.unsplash.com/photo-1532938911079-1b06ac7ce122?q=80&w=800"} alt={story.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-5 z-20 text-white">
                          <span className="px-3 py-1 bg-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 inline-block">
                            {story.category || 'Top Story'}
                          </span>
                          <h3 className="text-xl font-black leading-tight line-clamp-3 mb-2">{story.title}</h3>
                          <div className="flex items-center text-xs text-slate-300 font-medium">
                            <Clock className="w-3 h-3 mr-1" /> {new Date(story.published_at || story.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 flex gap-4 items-center">
                        <div className="flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-1 block">
                            {story.category || story.type}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 mb-2">
                            {story.title}
                          </h3>
                          <div className="text-xs text-slate-400 font-medium">
                            {new Date(story.published_at || story.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                          <ImageWithFallback src={story.featured_image || "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=400"} alt={story.title} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>

          {/* ── RIGHT COLUMN (30%) - DESKTOP ONLY ── */}
          <div className="hidden lg:flex col-span-1 lg:col-span-4 xl:col-span-3 flex-col gap-6">
            {/* Featured Impact Video */}
            <div className="rounded-3xl border border-slate-200 overflow-hidden relative group cursor-pointer shadow-sm">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop"
                alt="Video thumbnail"
                className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-16 h-16 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-8 h-8 text-blue-600 ml-1" />
                </div>
              </div>
              <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                <div className="px-3 py-1.5 bg-red-600 backdrop-blur rounded-full text-xs font-bold text-white uppercase tracking-widest flex items-center shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-2"></span> ON THE GROUND
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10">
                <h4 className="text-white font-bold text-sm leading-snug">Video: Inside our latest cross-border relief mission and the communities we serve.</h4>
              </div>
            </div>

            {/* Trending Impact Initiatives */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-[40px]"></div>
              
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Trending Impact
                </h3>
              </div>
              <div className="flex flex-col gap-6 relative z-10">
                {trendingNow.map((item, index) => (
                  <div key={item.id} className="flex gap-4 group cursor-pointer items-center">
                    <span className="text-4xl font-black text-slate-200 group-hover:text-blue-500 transition-colors leading-none w-8">
                      {index + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-700 leading-snug group-hover:text-blue-600 transition-colors flex-1 line-clamp-2">
                      {item.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Picks For You */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  Recommended For You
                </h3>
              </div>
              <div className="flex flex-col gap-5">
                {picksForYou.map((pick) => (
                  <div key={pick.id} className="flex gap-4 group cursor-pointer pb-5 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-orange-600 mb-2 flex items-center gap-2">
                        <span className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-[10px]">{pick.category ? pick.category.charAt(0) : 'R'}</span>
                        {pick.category || 'Report'}
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                        {pick.title}
                      </h4>
                      <div className="text-xs font-bold text-slate-400">
                        {new Date(pick.published_at || pick.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                      <ImageWithFallback src={pick.featured_image || "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=400"} alt={pick.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
