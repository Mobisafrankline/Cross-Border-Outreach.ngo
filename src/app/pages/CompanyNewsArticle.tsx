import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Calendar, Share2, Tag, Loader2, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import DOMPurify from "dompurify";

export default function CompanyNewsArticle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchArticle = async () => {
      if (!id) { setNotFound(true); setLoading(false); return; }

      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .eq("type", "news")
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setArticle(data);
      }
      setLoading(false);
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-[#F5B800]" />
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-sky-50">
        <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mb-6">
          <Info className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-black text-navy-900 mb-4 font-playfair">Article Not Found</h1>
        <p className="text-slate-600 mb-8 text-center max-w-md font-source-serif">
          The news article you are looking for might have been removed or does not exist.
        </p>
        <button onClick={() => navigate("/company-news")} className="px-8 py-3 bg-[#F5B800] text-white rounded-3xl font-bold shadow-lg hover:bg-[#032B45] transition-all">
          Back to Company News
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Nav Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/company-news")}
            className="flex items-center gap-2 text-slate-500 hover:text-[#F5B800] font-black text-[10px] uppercase tracking-widest transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to News
          </button>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-[#F5B800] transition-colors"
              onClick={() => { navigator.clipboard.writeText(window.location.href); }}>
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Tag className="w-4 h-4 text-[#F5B800]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#F5B800]">{article.category || 'Announcement'}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-navy-900 mb-8 leading-tight tracking-tight font-playfair drop-shadow-sm">
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{article.published_at ? new Date(article.published_at).toLocaleDateString() : 'Recent'}</span>
            </div>
          </div>
        </div>

        {article.featured_image && (
          <div className="w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden mb-16 shadow-2xl">
            <ImageWithFallback
              src={article.featured_image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="prose prose-slate prose-lg md:prose-xl max-w-none prose-headings:font-black prose-headings:font-playfair prose-a:text-[#F5B800] hover:prose-a:text-navy-800 font-source-serif leading-loose">
          {(article.content || article.excerpt || '').split('\n').map((paragraph: string, idx: number) => {
            if (!paragraph.trim()) return null;
            return <p key={idx} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(paragraph) }} />;
          })}
        </div>
      </article>
      
      {/* Footer CTA */}
      <section className="bg-sky-50 border-t border-slate-200 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-black text-navy-900 mb-8 font-playfair">Stay updated with our latest news</h2>
          <Link to="/company-news" className="inline-flex items-center gap-2 px-8 py-4 bg-[#F5B800] hover:bg-[#032B45] text-white rounded-3xl font-black uppercase tracking-widest transition-colors shadow-lg shadow-[#F5B800]/30 text-[10px]">
            Read More Articles
          </Link>
        </div>
      </section>
    </div>
  );
}
