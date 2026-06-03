import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Clock, Share2, Bookmark, Loader2 } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { supabase } from "../../../lib/supabase";
import type { Article } from "../../../lib/supabase";

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
const bodySerif = { fontFamily: "'Source Serif 4', Georgia, serif" };
const sans = { fontFamily: "'Inter', sans-serif" };

export default function COBNewsArticle() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id) throw new Error("Article ID is missing");
        const { data, error: fetchError } = await supabase
          .from("articles")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;
        setArticle(data);
      } catch (err: any) {
        console.error("Failed to fetch article:", err);
        setError("Article not found or could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-700 animate-spin" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex-1 min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl text-slate-900 mb-3" style={{ ...serif, fontWeight: 800 }}>Article Not Found</h2>
        <p className="text-slate-500 mb-6" style={bodySerif}>{error || "This article may have been removed or unpublished."}</p>
        <Link to="/global-news" className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded transition-colors" style={sans}>
          Back to News
        </Link>
      </div>
    );
  }

  const publishDate = new Date(article.published_at || article.created_at).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-[800px] mx-auto px-4 md:px-6 py-8 md:py-12">

        {/* Back Button */}
        <Link to="/global-news" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-700 font-semibold mb-10 transition-colors text-sm" style={sans}>
          <ArrowLeft className="w-4 h-4" />
          Back to Global News
        </Link>

        {/* Category & Date */}
        <div className="flex items-center gap-4 mb-6" style={sans}>
          <span className="px-3 py-1 bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest">
            {article.category || article.type}
          </span>
          <span className="text-sm text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {publishDate}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl text-slate-900 leading-[1.1] tracking-tight mb-6"
          style={{ ...serif, fontWeight: 900 }}
        >
          {article.title}
        </h1>

        {/* Excerpt as deck */}
        {article.excerpt && (
          <p className="text-xl md:text-2xl text-slate-500 leading-relaxed mb-8" style={{ ...bodySerif, fontStyle: 'italic' }}>
            {article.excerpt}
          </p>
        )}

        {/* Author byline */}
        <div className="flex items-center justify-between py-5 border-y border-slate-200 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-blue-700 flex items-center justify-center text-white text-base font-bold" style={serif}>
              {article.author ? article.author.charAt(0) : 'A'}
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm" style={sans}>{article.author || 'Staff Reporter'}</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-widest font-medium" style={sans}>CBNN News · Cross-Borders Outreach</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-full border border-slate-200 hover:border-blue-400 flex items-center justify-center transition-colors text-slate-400 hover:text-blue-600">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full border border-slate-200 hover:border-blue-400 flex items-center justify-center transition-colors text-slate-400 hover:text-blue-600">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Featured Image */}
        {article.featured_image && !article.video_embed && (
          <div className="rounded-sm overflow-hidden shadow-md mb-10 border border-slate-200">
            <ImageWithFallback
              src={article.featured_image}
              alt={article.title}
              className="w-full h-[300px] md:h-[480px] object-cover"
            />
          </div>
        )}

        {/* Video Embed */}
        {article.video_embed && (
          <div className="rounded-sm overflow-hidden shadow-md mb-10 border border-slate-200 aspect-video bg-black flex items-center justify-center">
            <div 
              className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full"
              dangerouslySetInnerHTML={{ __html: article.video_embed }}
            />
          </div>
        )}

        {/* Main Content */}
        <div
          className="prose prose-lg md:prose-xl max-w-none prose-headings:tracking-tight prose-a:text-blue-700 prose-img:rounded-sm prose-img:shadow-md prose-blockquote:border-blue-700 prose-blockquote:not-italic"
          style={bodySerif}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-slate-200">
            <div className="flex flex-wrap gap-2" style={sans}>
              {article.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
