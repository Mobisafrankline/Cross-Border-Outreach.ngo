import { useParams, Link } from "react-router";
import { Calendar, ArrowLeft, ExternalLink, Share2, Clock } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { newsUpdates } from "../../data/content";
import { motion } from "motion/react";

export default function NewsArticle() {
  const { id } = useParams();
  
  // Find the exact news article by ID
  const article = newsUpdates.find((item) => item.id.toString() === id);

  if (!article) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Calendar className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Article Not Found</h2>
        <p className="text-lg text-gray-500 mb-8 max-w-md">We couldn't locate the news article you are looking for. It may have been moved or deleted.</p>
        <Link to="/news" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
          <ArrowLeft className="w-5 h-5" /> Back to News Hub
        </Link>
      </div>
    );
  }

  // Calculate estimated reading time (approx 200 words per minute)
  const wordCount = article.content?.split(/\s+/).length || 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Immersive Hero Section */}
      <section className="relative h-[55vh] min-h-[450px] w-full overflow-hidden">
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <ImageWithFallback
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-90" />
        </motion.div>
      </section>

      {/* Main Content - Overlapping Card Design */}
      <section className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 -mt-48 sm:-mt-56">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-6 sm:p-10 md:p-14 mb-12"
        >
          {/* Header Area */}
          <div className="mb-10 text-center sm:text-left">
            <Link to="/news" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-8 transition-colors group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> 
              View all news
            </Link>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-6">
              <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-bold tracking-wide uppercase">
                {article.category}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4" /> {readingTime} min read
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-[1.15] tracking-tight text-balance">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-gray-500 font-medium py-6 border-y border-gray-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>{article.date}</span>
              </div>
              <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-gray-400" />
                <span>Crossborders Outreach</span>
              </div>
            </div>
          </div>

          {/* Article Body */}
          <div className="prose prose-lg md:prose-xl max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
            {article.content}
          </div>

          {/* External Source Callout */}
          {article.externalUrl && (
            <div className="mt-14 p-8 rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">Read on {article.sourceName || "Original Publisher"}</h3>
                  <p className="text-blue-100 max-w-md">This article was originally published externally. Explore the full context on their platform.</p>
                </div>
                
                <a 
                  href={article.externalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-blue-900 rounded-xl font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all shadow-lg shrink-0 whitespace-nowrap"
                >
                  View Original <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}
