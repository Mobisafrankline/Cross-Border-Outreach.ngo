import { useParams, Link } from "react-router";
import { Calendar, ArrowLeft, ExternalLink, Share2, Clock, ArrowRight, Heart } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { newsUpdates } from "../../data/content";
import { motion } from "motion/react";

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
const bodySerif = { fontFamily: "'Source Serif 4', Georgia, serif" };
const sans = { fontFamily: "'Inter', -apple-system, sans-serif" };

export default function NewsArticle() {
  const { id } = useParams();
  const currentIndex = newsUpdates.findIndex((item) => item.id.toString() === id);
  const article = currentIndex !== -1 ? newsUpdates[currentIndex] : null;

  if (!article) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-white">
        <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mb-8">
          <Calendar className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight" style={serif}>Article Not Found</h2>
        <p className="text-lg text-slate-500 mb-10 max-w-md leading-relaxed" style={bodySerif}>
          We couldn't locate the news article you are looking for. It may have been moved or deleted.
        </p>
        <Link to="/news" className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20" style={sans}>
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

  const prevArticle = currentIndex > 0 ? newsUpdates[currentIndex - 1] : null;
  const nextArticle = currentIndex < newsUpdates.length - 1 ? newsUpdates[currentIndex + 1] : null;

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-[800px] mx-auto px-4 md:px-6 py-8 md:py-12">

        {/* Back Button */}
        <Link to="/news" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-700 font-semibold mb-10 transition-colors text-sm" style={sans}>
          <ArrowLeft className="w-4 h-4" />
          Back to News
        </Link>

        {/* Category & Date */}
        <div className="flex items-center gap-4 mb-6" style={sans}>
          <span className="px-3 py-1 bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest">
            {article.category}
          </span>
          <span className="text-sm text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {article.date}
          </span>
          <span className="text-sm text-slate-500 flex items-center gap-1.5 ml-auto">
             {readingTime} min read
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl text-slate-900 leading-[1.1] tracking-tight mb-6"
          style={{ ...serif, fontWeight: 900 }}
        >
          {article.title}
        </h1>

        {/* Lead / Excerpt */}
        {article.excerpt && (
          <p className="text-xl md:text-2xl text-slate-500 leading-relaxed mb-8" style={{ ...bodySerif, fontStyle: 'italic' }}>
            {article.excerpt}
          </p>
        )}

        {/* Author byline */}
        <div className="flex items-center justify-between py-5 border-y border-slate-200 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-blue-700 flex items-center justify-center text-white text-base font-bold" style={serif}>
              {article.author ? article.author.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm" style={sans}>{article.author || 'Cross-Borders Outreach'}</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-widest font-medium" style={sans}>Organization Updates · Cross-Borders Outreach</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }}
              className="w-9 h-9 rounded-full border border-slate-200 hover:border-blue-400 flex items-center justify-center transition-colors text-slate-400 hover:text-blue-600"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Featured Image */}
        {article.image && (
          <div className="rounded-sm overflow-hidden shadow-md mb-10 border border-slate-200">
            <ImageWithFallback
              src={article.image}
              alt={article.title}
              className="w-full h-[300px] md:h-[480px] object-cover"
            />
          </div>
        )}

        {/* Main Content */}
        <div
          className="prose prose-lg md:prose-xl max-w-none prose-headings:tracking-tight prose-a:text-blue-700 prose-img:rounded-sm prose-img:shadow-md prose-blockquote:border-blue-700 prose-blockquote:not-italic whitespace-pre-wrap"
          style={bodySerif}
        >
          {article.content}
        </div>

        {/* External Source */}
        {article.externalUrl && (
          <div className="mt-16 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-blue-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-black mb-3" style={serif}>Read on {article.sourceName || "Original Publisher"}</h3>
                <p className="text-blue-200/80 max-w-md leading-relaxed" style={bodySerif}>
                  This article was originally published externally. Explore the full context on their platform.
                </p>
              </div>
              <a
                href={article.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-base hover:bg-blue-50 transition-all shadow-xl shrink-0"
                style={sans}
              >
                View Original <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex items-center justify-between border-t border-slate-200 py-10 mt-16" style={sans}>
          {prevArticle ? (
            <Link to={`/news/${prevArticle.id}`} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold uppercase tracking-widest text-sm transition-colors group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Previous News
            </Link>
          ) : (
            <div />
          )}
          {nextArticle ? (
            <Link to={`/news/${nextArticle.id}`} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold uppercase tracking-widest text-sm transition-colors group">
              Next News <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* Share & CTA */}
        <div className="pt-10 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied!");
            }}
            className="flex items-center gap-3 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
            style={sans}
          >
            <Share2 className="w-5 h-5" /> Share Article
          </button>
          <Link to="/donate"
            className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-blue-600/30"
            style={sans}
          >
            <Heart className="w-5 h-5 fill-white" /> Support Our Mission
          </Link>
        </div>
      </div>

      {/* ── Related Articles ── */}
      {related.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-black text-slate-900 mb-12 tracking-tight" style={serif}>More in {article.category}</h2>
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
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2" style={sans}>
                        <Calendar className="w-3.5 h-3.5" /> {item.date}
                      </div>
                      <h3 className="text-lg font-black text-slate-900 leading-tight mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors" style={serif}>
                        {item.title}
                      </h3>
                      <div className="inline-flex items-center gap-2 text-blue-600 text-xs font-black uppercase tracking-widest" style={sans}>
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
