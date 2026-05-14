import { useState } from "react";
import { FileText, Download, Calendar, BookOpen, Search, Filter, ArrowRight, Sparkles, Users, Tag } from "lucide-react";
import { motion } from "motion/react";
import { publications } from "../../data/content";

// Category color mapping
const categoryColors: Record<string, { bg: string; text: string; accent: string }> = {
  "Research Paper": { bg: "bg-violet-50", text: "text-violet-700", accent: "bg-violet-600" },
  "White Paper": { bg: "bg-blue-50", text: "text-blue-700", accent: "bg-blue-600" },
  "Case Study": { bg: "bg-emerald-50", text: "text-emerald-700", accent: "bg-emerald-600" },
  "Report": { bg: "bg-amber-50", text: "text-amber-700", accent: "bg-amber-600" },
  "Guide": { bg: "bg-rose-50", text: "text-rose-700", accent: "bg-rose-600" },
  "Toolkit": { bg: "bg-cyan-50", text: "text-cyan-700", accent: "bg-cyan-600" },
};

const getCategoryStyle = (cat: string) => categoryColors[cat] || { bg: "bg-slate-50", text: "text-slate-700", accent: "bg-slate-600" };

export default function Publications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(publications.map((p) => p.category)))];

  const filtered = publications.filter((pub) => {
    const matchesSearch =
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || pub.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="relative py-28 md:py-36 overflow-hidden bg-slate-900">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] -mr-60 -mt-60" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] -ml-60 -mb-60" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-widest mb-8">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Research & Insights
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight leading-[1.05]">
              Our <span className="text-blue-400">Publications</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium mb-10">
              Research papers, case studies, and frameworks documenting our methodologies and community impact.
            </p>
            <div className="flex items-center justify-center gap-8 text-slate-400 text-sm font-bold">
              <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-blue-400" /> {publications.length} Publications</span>
              <span className="flex items-center gap-2"><Users className="w-4 h-4 text-blue-400" /> {Array.from(new Set(publications.flatMap(p => p.authors))).length} Authors</span>
            </div>
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
                placeholder="Search publications, topics, or tags..."
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

      {/* ── Featured Publication ── */}
      {featured && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl overflow-hidden p-8 md:p-14"
            >
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-15" />
              <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-violet-500 rounded-full blur-3xl opacity-10" />
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
                {/* Document preview */}
                <div className="w-48 h-64 bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center p-6 flex-shrink-0 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className={`w-12 h-12 ${getCategoryStyle(featured.category).accent} rounded-xl flex items-center justify-center text-white mb-4`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{featured.category}</div>
                  <div className="text-sm font-bold text-slate-900 leading-tight">{featured.title.substring(0, 40)}...</div>
                  <div className="mt-auto pt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{featured.pages} pages • {featured.size}</div>
                </div>

                <div className="flex-1 text-white text-center lg:text-left">
                  <div className="flex flex-wrap items-center gap-3 mb-5 justify-center lg:justify-start">
                    <span className="px-4 py-1.5 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-full text-xs font-bold uppercase tracking-widest">
                      Featured
                    </span>
                    <span className="px-4 py-1.5 bg-white/10 border border-white/10 text-white/70 rounded-full text-xs font-bold uppercase tracking-widest">
                      {featured.category}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight mb-4">
                    {featured.title}
                  </h2>
                  <p className="text-blue-100/80 text-lg leading-relaxed mb-6 max-w-xl">
                    {featured.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mb-8 justify-center lg:justify-start text-sm text-white/60 font-bold">
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {featured.date}</span>
                    <span>•</span>
                    <span>{featured.pages} pages</span>
                    <span>•</span>
                    <span>By {featured.authors.join(", ")}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-8 justify-center lg:justify-start">
                    {featured.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs font-bold text-white/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a href={featured.pdfUrl} download
                    className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl">
                    <Download className="w-5 h-5" /> Download PDF
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Publications Grid ── */}
      {rest.length > 0 && (
        <section className="pb-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((pub, index) => {
                const style = getCategoryStyle(pub.category);
                return (
                  <motion.div
                    key={pub.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-2xl transition-all duration-300 flex flex-col"
                  >
                    {/* Top accent bar */}
                    <div className={`h-1.5 ${style.accent}`} />
                    
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex items-start gap-4 mb-6">
                        <div className={`w-14 h-14 ${style.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                          <FileText className={`w-7 h-7 ${style.text}`} />
                        </div>
                        <div>
                          <span className={`inline-block px-3 py-1 ${style.bg} ${style.text} rounded-full text-[10px] font-black uppercase tracking-widest mb-1`}>
                            {pub.category}
                          </span>
                          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                            <Calendar className="w-3 h-3" /> {pub.date}
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight tracking-tight group-hover:text-blue-600 transition-colors">
                        {pub.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-5 flex-1">
                        {pub.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {pub.tags.map((tag, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                            <Tag className="w-2.5 h-2.5" /> {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-6">
                        <span>{pub.pages} pages • {pub.size}</span>
                        <span className="truncate ml-2">{pub.authors.join(", ")}</span>
                      </div>

                      <a href={pub.pdfUrl} download
                        className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 mt-auto group/btn">
                        <Download className="w-4 h-4" /> Download PDF
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
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
            <h3 className="text-2xl font-black text-slate-900 mb-3">No publications found</h3>
            <p className="text-slate-500 mb-8">Try adjusting your search or filter.</p>
            <button onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all">
              Clear Filters
            </button>
          </div>
        </section>
      )}

      {/* ── Newsletter Subscribe ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Stay Updated</h2>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-xl mx-auto">
              Get notified when we publish new research, case studies, and community impact reports.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
              />
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}