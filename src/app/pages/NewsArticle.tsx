import { useParams, Link } from "react-router";
import { Calendar, ArrowLeft, ExternalLink, Share2, Clock, ArrowRight, Heart } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { newsUpdates } from "../../data/content";
import { motion } from "motion/react";

export default function NewsArticle() {
  const { id } = useParams();
  const article = newsUpdates.find((item) => item.id.toString() === id);

  if (!article) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-white">
        <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mb-8">
          <Calendar className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Article Not Found</h2>
        <p className="text-lg text-slate-500 mb-10 max-w-md leading-relaxed">
          We couldn't locate the news article you are looking for. It may have been moved or deleted.
        </p>
        <Link to="/news" className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
          <ArrowLeft className="w-5 h-5" /> Back to News
        </Link>
      </div>
    );
  }

  const wordCount = article.content?.split(/\s+/).length || 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Get related articles (same category, excluding current)
  const related = newsUpdates
    .filter((n) => n.category === article.category && n.id !== article.id)
    .slice(0, 3);

  return (
    <div className="bg-white min-h-screen">

      {/* ── Full-Width Hero ── */}
      <section className="relative h-[50vh] md:h-[65vh] w-full overflow-hidden">
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <ImageWithFallback src={article.image} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Link to="/news" className="inline-flex items-center gap-2 text-white/70 hover:text-white font-bold text-sm mb-6 transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to News
            </Link>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-5 py-2 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                {article.category}
              </span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-md text-white/80 rounded-full text-xs font-bold border border-white/20 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {readingTime} min read
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm font-bold">
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-400" /> {article.date}</span>
              <span className="flex items-center gap-2"><Share2 className="w-4 h-4 text-blue-400" /> CrossBorders Outreach</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Article Content ── */}
      <section className="max-w-4xl mx-auto px-6 md:px-8 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Excerpt highlight */}
          {article.excerpt && (
            <div className="relative bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-100 rounded-3xl p-8 md:p-12 mb-16 overflow-hidden">
              <p className="text-xl md:text-2xl font-semibold text-slate-700 italic leading-relaxed">
                {article.excerpt}
              </p>
              <div className="mt-6 w-24 h-1.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
            </div>
          )}

          {/* Article body */}
          <div className="prose prose-lg md:prose-xl max-w-none text-slate-700 leading-[1.9] prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-p:mb-8 whitespace-pre-wrap">
            {article.content}
          </div>

          {/* External Source */}
          {article.externalUrl && (
            <div className="mt-16 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-blue-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-black mb-3">Read on {article.sourceName || "Original Publisher"}</h3>
                  <p className="text-blue-200/80 max-w-md leading-relaxed">
                    This article was originally published externally. Explore the full context on their platform.
                  </p>
                </div>
                <a
                  href={article.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-base hover:bg-blue-50 transition-all shadow-xl shrink-0"
                >
                  View Original <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          )}

          {/* Share & CTA */}
          <div className="mt-16 pt-10 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied!");
              }}
              className="flex items-center gap-3 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
            >
              <Share2 className="w-5 h-5" /> Share Article
            </button>
            <Link to="/donate"
              className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-blue-600/30">
              <Heart className="w-5 h-5 fill-white" /> Support Our Mission
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Related Articles ── */}
      {related.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-black text-slate-900 mb-12 tracking-tight">More in {article.category}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {related.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link to={`/news/${item.id}`} className="group block bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300">
                    <div className="h-48 overflow-hidden relative">
                      <ImageWithFallback src={item.image} alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-6">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" /> {item.date}
                      </div>
                      <h3 className="text-lg font-black text-slate-900 leading-tight mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <div className="inline-flex items-center gap-2 text-blue-600 text-xs font-black uppercase tracking-widest">
                        Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
