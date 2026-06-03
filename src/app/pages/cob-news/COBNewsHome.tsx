import { useState, useEffect } from "react";
import {
  Clock,
  ChevronRight,
  TrendingUp,
  Share2,
  Bookmark,
  MapPin,
  CloudSun,
  Loader2,
  Heart,
  HelpCircle,
  ArrowRight,
  Play,
  Flame,
  Globe,
  Zap
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Link, useOutletContext } from "react-router";
import { getArticles } from "../../../lib/supabase";
import type { Article } from "../../../lib/supabase";

export const navCategories = [
  "All",
  "Disaster Relief",
  "Education",
  "Healthcare",
  "Food Security",
  "Economic Empowerment",
  "Global Initiatives"
];

// Shared font styles
const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
const bodySerif = { fontFamily: "'Source Serif 4', Georgia, serif" };
const sans = { fontFamily: "'Inter', sans-serif" };

export default function COBNewsHome() {
  const [activeTab, setActiveTab] = useState("All");
  const [weather, setWeather] = useState({ temp: "--", desc: "Locating...", city: "Your Location" });
  
  const { activeBottomTab } = useOutletContext<{ activeBottomTab: string }>() || { activeBottomTab: "for-you" };
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
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
            } catch {
              setWeather({ temp: `${Math.round(wData.current_weather.temperature)}°C`, desc: "Current Weather", city: "Local Area" });
            }
          } catch {
            setWeather({ temp: "--", desc: "Unavailable", city: "Local Area" });
          }
        },
        () => setWeather({ temp: "--", desc: "Location Access Denied", city: "Unknown Location" })
      );
    } else {
      setWeather({ temp: "--", desc: "Not Supported", city: "Unknown Location" });
    }
  }, []);

  // Category Filtering logic
  const getFilteredArticles = (tab: string) => {
    if (tab === "All") return articles;
    return articles.filter(a => {
      const cat = (a.category || "").toLowerCase();
      const type = (a.type || "").toLowerCase();
      const target = tab.toLowerCase();
      
      if (cat === target || type === target) return true;
      if (target === "disaster relief" && (cat.includes("disaster") || cat.includes("relief"))) return true;
      if (target === "food security" && (cat.includes("food") || cat.includes("security") || cat.includes("hunger"))) return true;
      if (target === "economic empowerment" && (cat.includes("economic") || cat.includes("empower") || cat.includes("micro"))) return true;
      if (target === "global initiatives" && (cat.includes("global") || cat.includes("initiative") || cat.includes("outreach"))) return true;
      return false;
    });
  };

  const filteredArticles = getFilteredArticles(activeTab);

  // ─── DEDUPLICATED article slots ───
  const leadStory = articles.length > 0 ? articles[0] : null;
  const secondaryStories = articles.slice(1, 3);
  const editorialPicks = articles.slice(3, 6);
  const latestStories = articles.slice(3, 10);
  const trendingArticles = articles.slice(0, 5);
  const recommendedArticles = articles.slice(2, 7);

  // ─── Helper: time ago ───
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return days === 1 ? "Yesterday" : `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-[60vh] flex items-center justify-center bg-[#faf9f7]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-700 animate-spin" />
          <span className="text-sm text-slate-500 font-medium tracking-wide" style={sans}>Loading stories…</span>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-[#faf9f7]">
        <div className="text-6xl mb-4">📰</div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3" style={serif}>No Stories Yet</h2>
        <p className="text-slate-500 max-w-md" style={bodySerif}>
          The newsroom is quiet for now. Create your first article from the Admin Portal and it will appear here instantly.
        </p>
        <Link to="/admin/news/new" className="mt-6 px-6 py-2 bg-blue-700 text-white font-bold rounded transition-colors hover:bg-blue-800" style={sans}>
          Go to Admin →
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* ── Section Navigation ── */}
      <div className="sticky top-[80px] md:top-[116px] z-30 bg-white border-b border-slate-200" style={sans}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="flex items-center h-11 gap-1 overflow-x-auto hide-scrollbar">
            {navCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all relative ${
                  activeTab === cat
                    ? "text-blue-700 border-b-2 border-blue-700"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#faf9f7] min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-8 relative z-10">
          {activeTab === "All" ? (
            <>
              {/* ══════════════════════════════════════ */}
              {/*           DESKTOP LAYOUT              */}
              {/* ══════════════════════════════════════ */}
              <div className="hidden md:block">

                {/* ── ROW 1: HERO (Lead Story) + TRENDING SIDEBAR ── */}
                <div className="grid grid-cols-12 gap-6 mb-8">
                  {/* Lead Story — immersive hero card */}
                  <div className="col-span-8">
                    {leadStory && (
                      <Link to={`/global-news/article/${leadStory.id}`} className="group block relative rounded-lg overflow-hidden shadow-lg h-[480px]">
                        <ImageWithFallback
                          src={leadStory.featured_image || "https://images.unsplash.com/photo-1532938911079-1b06ac7ce122?q=80&w=1200"}
                          alt={leadStory.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        {/* Content overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm" style={sans}>
                              {leadStory.category || 'Breaking'}
                            </span>
                            <span className="text-white/70 text-xs flex items-center gap-1" style={sans}>
                              <Clock className="w-3 h-3" />
                              {timeAgo(leadStory.published_at || leadStory.created_at)}
                            </span>
                          </div>
                          <h1
                            className="text-3xl xl:text-4xl text-white leading-[1.15] mb-3 group-hover:text-blue-200 transition-colors"
                            style={{ ...serif, fontWeight: 900 }}
                          >
                            {leadStory.title}
                          </h1>
                          <p className="text-base text-white/80 leading-relaxed mb-4 max-w-2xl line-clamp-2" style={bodySerif}>
                            {leadStory.excerpt}
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold" style={serif}>
                              {leadStory.author ? leadStory.author.charAt(0) : 'S'}
                            </div>
                            <span className="text-white/90 text-sm font-semibold" style={sans}>{leadStory.author || 'Staff Reporter'}</span>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>

                  {/* Right Sidebar: Trending + Weather */}
                  <div className="col-span-4 flex flex-col gap-5">
                    {/* Trending Widget */}
                    <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-5 flex-1">
                      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                        <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-blue-700" />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-wider text-slate-900" style={sans}>Trending</h2>
                      </div>
                      <div className="flex flex-col gap-0">
                        {trendingArticles.map((item, index) => (
                          <Link to={`/global-news/article/${item.id}`} key={item.id} className="group flex items-start gap-3 py-3 border-b border-slate-50 last:border-0 last:pb-0 first:pt-0">
                            <span
                              className="text-2xl font-black text-slate-200 group-hover:text-blue-600 transition-colors leading-none mt-0.5 w-7 shrink-0"
                              style={{ ...serif, fontWeight: 900 }}
                            >
                              {index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h4
                                className="text-[13px] font-bold text-slate-800 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2 mb-1"
                                style={sans}
                              >
                                {item.title}
                              </h4>
                              <span className="text-[10px] text-slate-400" style={sans}>
                                {timeAgo(item.published_at || item.created_at)}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Weather widget */}
                    <div className="bg-white rounded-lg shadow-sm border border-slate-100 px-5 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1" style={sans}>
                            <MapPin className="w-3 h-3" /> {weather.city}
                          </div>
                          <div className="text-2xl font-black text-slate-800" style={serif}>{weather.temp}</div>
                        </div>
                        <CloudSun className="w-9 h-9 text-amber-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── ROW 2: SECONDARY STORIES + LATEST STORIES ── */}
                <div className="grid grid-cols-12 gap-6 mb-8">
                  {/* Secondary stories (5 cols) */}
                  <div className="col-span-5 flex flex-col gap-5">
                    {secondaryStories.map((story) => (
                      <Link to={`/global-news/article/${story.id}`} key={story.id} className="group flex gap-4 bg-white rounded-lg shadow-sm border border-slate-100 p-4 hover:shadow-md transition-shadow">
                        <div className="w-28 h-24 shrink-0 rounded-md overflow-hidden bg-slate-100">
                          <ImageWithFallback
                            src={story.featured_image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400"}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-red-600 mb-1 block" style={sans}>
                              {story.category || 'Featured'}
                            </span>
                            <h3
                              className="text-base text-slate-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2"
                              style={{ ...serif, fontWeight: 700 }}
                            >
                              {story.title}
                            </h3>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-2" style={sans}>
                            <span className="font-semibold text-slate-600">{story.author || 'Staff'}</span>
                            <span>·</span>
                            <span>{timeAgo(story.published_at || story.created_at)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Latest Stories (7 cols) */}
                  <div className="col-span-7 bg-white rounded-lg shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <h2 className="text-sm font-black uppercase tracking-wider text-slate-900" style={sans}>Latest Stories</h2>
                      <div className="h-px flex-1 bg-slate-100 ml-2" />
                    </div>
                    <div className="flex flex-col divide-y divide-slate-100">
                      {latestStories.length > 0 ? latestStories.map((story) => (
                        <Link to={`/global-news/article/${story.id}`} key={story.id} className="group py-4 first:pt-0 last:pb-0 flex gap-5 items-start">
                          <div className="flex-1">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-blue-700 mb-1 block" style={sans}>
                              {story.category || story.type}
                            </span>
                            <h3
                              className="text-[15px] text-slate-900 leading-snug mb-1 group-hover:text-blue-700 transition-colors line-clamp-2"
                              style={{ ...serif, fontWeight: 700 }}
                            >
                              {story.title}
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400" style={sans}>
                              <span className="font-semibold text-slate-600">{story.author || 'Staff'}</span>
                              <span>·</span>
                              <span>{timeAgo(story.published_at || story.created_at)}</span>
                            </div>
                          </div>
                          {story.featured_image && (
                            <div className="w-24 h-20 shrink-0 rounded-md overflow-hidden bg-slate-100">
                              <ImageWithFallback
                                src={story.featured_image}
                                alt={story.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                        </Link>
                      )) : (
                        <p className="text-sm text-slate-400 italic py-6" style={bodySerif}>
                          No further articles available.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── ROW 3: EDITORIAL PICKS (full width) ── */}
                {editorialPicks.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-1 h-6 bg-blue-700 rounded-full" />
                      <h2 className="text-lg text-slate-900" style={{ ...serif, fontWeight: 800 }}>
                        Editor&apos;s Picks
                      </h2>
                      <div className="h-px flex-1 bg-slate-200 ml-2" />
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      {editorialPicks.map((story) => (
                        <Link to={`/global-news/article/${story.id}`} key={story.id} className="group bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                          <div className="h-48 overflow-hidden">
                            <ImageWithFallback
                              src={story.featured_image || "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800"}
                              alt={story.title}
                              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                            />
                          </div>
                          <div className="p-5">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-blue-700 mb-2 block" style={sans}>
                              {story.category || 'Updates'}
                            </span>
                            <h3
                              className="text-lg text-slate-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2"
                              style={{ ...serif, fontWeight: 700 }}
                            >
                              {story.title}
                            </h3>
                            <p className="text-sm text-slate-500 line-clamp-2 mb-3" style={bodySerif}>
                              {story.excerpt}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400" style={sans}>
                              <span className="font-semibold text-slate-600">{story.author || 'Staff'}</span>
                              <span>·</span>
                              <span>{timeAgo(story.published_at || story.created_at)}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── ROW 4: RECOMMENDED + WAYS TO HELP ── */}
                <div className="grid grid-cols-12 gap-6">
                  {/* Recommended For You */}
                  <div className="col-span-8 bg-white rounded-lg shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                      <Heart className="w-4 h-4 text-red-500" />
                      <h2 className="text-sm font-black uppercase tracking-wider text-slate-900" style={sans}>Recommended For You</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      {recommendedArticles.map((story) => (
                        <Link to={`/global-news/article/${story.id}`} key={story.id} className="group flex gap-3 items-start p-3 rounded-md hover:bg-slate-50 transition-colors">
                          {story.featured_image && (
                            <div className="w-20 h-16 shrink-0 rounded-md overflow-hidden bg-slate-100">
                              <ImageWithFallback src={story.featured_image} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <span className="text-[8px] font-bold text-blue-700 uppercase tracking-widest block mb-0.5" style={sans}>
                              {story.category || story.type}
                            </span>
                            <h4 className="text-[13px] font-bold text-slate-800 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2" style={sans}>
                              {story.title}
                            </h4>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Ways to Help */}
                  <div className="col-span-4 flex flex-col gap-5">
                    <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-lg shadow-md p-6 text-white relative overflow-hidden flex-1">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-10 translate-x-10" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
                      <div className="relative z-10">
                        <h3 className="text-xs font-black uppercase tracking-widest text-white/80 mb-3" style={sans}>
                          Ways to Help
                        </h3>
                        <p className="text-sm text-blue-100 leading-relaxed mb-6" style={bodySerif}>
                          Your support enables CBNN and Cross-Borders Outreach to deliver medical aid, education, and clean water to families in need.
                        </p>
                        <div className="flex flex-col gap-3">
                          <Link 
                            to="/donate" 
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-white text-blue-800 font-bold text-xs tracking-wider uppercase rounded-md transition-all hover:bg-blue-50 shadow-sm text-center"
                            style={sans}
                          >
                            <Heart className="w-3.5 h-3.5" />
                            Support A Cause
                          </Link>
                          <Link 
                            to="/opportunities" 
                            className="flex items-center justify-center gap-2 w-full py-2 border border-white/30 hover:border-white/60 text-white font-bold text-xs tracking-wider uppercase rounded-md transition-all text-center"
                            style={sans}
                          >
                            Apply to Volunteer
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ══════════════════════════════════════ */}
              {/*           MOBILE LAYOUT               */}
              {/* ══════════════════════════════════════ */}
              <div className="md:hidden flex flex-col gap-5">

                {/* Lead Hero Story (immersive) */}
                {leadStory && (
                  <Link to={`/global-news/article/${leadStory.id}`} className="group block relative rounded-lg overflow-hidden shadow-md h-[320px]">
                    <ImageWithFallback
                      src={leadStory.featured_image || "https://images.unsplash.com/photo-1532938911079-1b06ac7ce122?q=80&w=800"}
                      alt={leadStory.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="px-2.5 py-1 bg-red-600 text-white text-[9px] font-bold uppercase tracking-widest rounded-sm mb-3 inline-block" style={sans}>
                        {leadStory.category || 'Breaking'}
                      </span>
                      <h3
                        className="text-xl text-white leading-snug mb-2 line-clamp-3"
                        style={{ ...serif, fontWeight: 700 }}
                      >
                        {leadStory.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] text-white/70" style={sans}>
                        <span className="font-semibold text-white/90">{leadStory.author || 'Staff'}</span>
                        <span>·</span>
                        <span>{timeAgo(leadStory.published_at || leadStory.created_at)}</span>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Trending Section */}
                {trendingArticles.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-4">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                      <TrendingUp className="w-4 h-4 text-blue-700" />
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-800" style={sans}>Trending</h3>
                    </div>
                    <div className="flex flex-col gap-0">
                      {trendingArticles.slice(0, 4).map((story, idx) => (
                        <Link to={`/global-news/article/${story.id}`} key={story.id} className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0 last:pb-0 first:pt-0">
                          <span className="text-xl font-black text-slate-200 font-serif leading-none w-5 shrink-0">{idx + 1}</span>
                          <h4 className="text-xs font-bold text-slate-700 leading-snug line-clamp-2" style={sans}>{story.title}</h4>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Latest Stories */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-4">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-800" style={sans}>Latest News</h3>
                  </div>
                  <div className="flex flex-col divide-y divide-slate-50">
                    {latestStories.map((story) => (
                      <Link to={`/global-news/article/${story.id}`} key={story.id} className="flex gap-3 py-3 items-start group first:pt-0 last:pb-0">
                        <div className="flex-1">
                          <span className="text-[8px] font-bold text-red-600 uppercase tracking-widest mb-0.5 block">
                            {story.category || story.type}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors" style={sans}>
                            {story.title}
                          </h3>
                        </div>
                        {story.featured_image && (
                          <div className="w-20 h-16 rounded-md overflow-hidden shrink-0 bg-slate-100">
                            <ImageWithFallback src={story.featured_image} alt={story.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Recommended For You (horizontal scroll) */}
                {recommendedArticles.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="w-4 h-4 text-red-500" />
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-800" style={sans}>Recommended</h3>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory">
                      {recommendedArticles.map((story) => (
                        <Link to={`/global-news/article/${story.id}`} key={story.id} className="min-w-[240px] w-[240px] bg-white border border-slate-100 rounded-lg snap-start overflow-hidden shadow-sm">
                          {story.featured_image && (
                            <div className="h-28 overflow-hidden">
                              <ImageWithFallback src={story.featured_image} alt={story.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="p-3">
                            <h4 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2 mb-1" style={sans}>
                              {story.title}
                            </h4>
                            <span className="text-[8px] font-bold text-blue-700 uppercase tracking-widest">
                              {story.category || story.type}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ways to Help */}
                <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-lg shadow-md p-5 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/80 mb-2" style={sans}>
                    Ways to Help
                  </h3>
                  <p className="text-[11px] text-blue-100 leading-relaxed mb-4" style={bodySerif}>
                    Support CBNN and Cross-Borders Outreach to deliver aid to families in border regions.
                  </p>
                  <div className="flex flex-col gap-2 relative z-10">
                    <Link 
                      to="/donate" 
                      className="flex items-center justify-center gap-2 w-full py-2 bg-white text-blue-800 font-bold text-[10px] tracking-wider uppercase rounded-md text-center shadow-sm"
                      style={sans}
                    >
                      <Heart className="w-3 h-3" /> Support A Cause
                    </Link>
                    <Link 
                      to="/opportunities" 
                      className="flex items-center justify-center gap-2 w-full py-2 border border-white/30 text-white font-bold text-[10px] tracking-wider uppercase rounded-md text-center"
                      style={sans}
                    >
                      Apply to Volunteer
                    </Link>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-2">
              {/* ══════════════════════════════════════ */}
              {/*           CATEGORY PAGE LAYOUT        */}
              {/* ══════════════════════════════════════ */}
              <div className="flex items-center gap-4 mb-8">
                <h1 className="text-3xl md:text-4xl text-slate-900" style={{ ...serif, fontWeight: 950 }}>
                  {activeTab}
                </h1>
                <div className="h-px flex-1 bg-slate-200" />
                <button 
                  onClick={() => setActiveTab("All")}
                  className="text-xs font-bold uppercase tracking-wider text-blue-700 hover:underline"
                  style={sans}
                >
                  Back to All News
                </button>
              </div>
              
              {filteredArticles.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <p className="font-bold mb-4" style={sans}>No articles found in this category.</p>
                  <button 
                    onClick={() => setActiveTab("All")}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded"
                    style={sans}
                  >
                    View All News
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((story) => (
                    <Link to={`/global-news/article/${story.id}`} key={story.id} className="group bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-48 overflow-hidden bg-slate-50">
                        <ImageWithFallback
                          src={story.featured_image || "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800"}
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-blue-700 mb-2 block" style={sans}>
                          {story.category || 'Updates'}
                        </span>
                        <h3
                          className="text-lg text-slate-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2"
                          style={{ ...serif, fontWeight: 700 }}
                        >
                          {story.title}
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-3" style={bodySerif}>
                          {story.excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 border-t border-slate-50 pt-3" style={sans}>
                          <span className="font-semibold text-slate-600">{story.author || 'Staff'}</span>
                          <span>·</span>
                          <span>{timeAgo(story.published_at || story.created_at)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
