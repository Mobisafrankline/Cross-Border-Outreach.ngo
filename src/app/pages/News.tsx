import { useState } from "react";
import { Calendar, ArrowRight, MapPin, Sparkles, Search, Filter } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { newsUpdates } from "../../data/content";

export default function News() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(newsUpdates.map((n) => n.category)))];

  const filtered = newsUpdates.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="relative h-[450px] md:h-[520px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1638344956088-49e767865ace?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzcGFwZXIlMjBwcmVzcyUyMGNvbmZlcmVuY2UlMjBhbm5vdW5jZW1lbnR8ZW58MXx8fHwxNzcxOTk3MDE2fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="News"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-900" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Stay Informed
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight">
              Latest <span className="text-blue-400">News</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
              Updates, announcements, and stories from our mission to serve communities across borders.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Search & Filter ── */}
      <section className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
              <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Article ── */}
      {featured && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link to={`/news/${featured.id}`} className="group block">
                <div className="relative rounded-3xl overflow-hidden h-[400px] md:h-[500px]">
                  <ImageWithFallback
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      {featured.category}
                    </span>
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                      Featured
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest mb-4">
                      <Calendar className="w-3.5 h-3.5" /> {featured.date}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4 max-w-3xl">
                      {featured.title}
                    </h2>
                    <p className="text-white/70 text-base leading-relaxed mb-6 max-w-2xl line-clamp-2">
                      {featured.excerpt}
                    </p>
                    <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl text-xs font-black uppercase tracking-widest group-hover:bg-white/20 transition-all">
                      Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Articles Grid ── */}
      {rest.length > 0 && (
        <section className="pb-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-2xl transition-all duration-300 flex flex-col"
                >
                  <Link to={`/news/${item.id}`} className="flex flex-col flex-1">
                    <div className="h-56 overflow-hidden relative">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-7 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">
                        <Calendar className="w-3.5 h-3.5" /> {item.date}
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight tracking-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                        {item.excerpt}
                      </p>
                      <div className="inline-flex items-center gap-2 text-blue-600 text-xs font-black uppercase tracking-widest mt-auto px-5 py-3 bg-blue-50 rounded-full w-fit group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Empty State ── */}
      {filtered.length === 0 && (
        <section className="py-32 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">No articles found</h3>
            <p className="text-slate-500 mb-8">Try adjusting your search or filter to find what you're looking for.</p>
            <button onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all">
              Clear Filters
            </button>
          </div>
        </section>
      )}
    </div>
  );
}