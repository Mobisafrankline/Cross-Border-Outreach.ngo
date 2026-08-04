import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ChevronRight, TrendingUp, Heart, Globe } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface MagazineArticle {
  id: string | number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author?: string;
  image: string;
  url?: string;
  onClick?: () => void;
}

export interface MagazineLayoutProps {
  categories: string[];
  articles: MagazineArticle[];
}

export default function MagazineLayout({ categories, articles }: MagazineLayoutProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredArticles = activeCategory === "All"
    ? articles
    : articles.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase());

  const featured = filteredArticles[0];
  const trending = filteredArticles.slice(1, 6);
  const middleLeft = filteredArticles.slice(6, 8);
  const latestStories = filteredArticles.slice(8, 11);
  const editorsPicks = filteredArticles.slice(11, 14);
  const recommended = filteredArticles.slice(14, 18);

  const ArticleWrapper = ({ article, children, className = "" }: { article: MagazineArticle, children: React.ReactNode, className?: string }) => {
    if (article.url) {
      return <Link to={article.url} className={className}>{children}</Link>;
    }
    return (
      <div onClick={article.onClick} className={`cursor-pointer ${className}`}>
        {children}
      </div>
    );
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      {/* Category Nav */}
      <div className="bg-white border-b border-slate-200/60 sticky top-16 md:top-[72px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex overflow-x-auto no-scrollbar py-4 items-center gap-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                  activeCategory === cat ? "text-blue-700 border-b-2 border-blue-700 pb-1 -mb-[18px]" : "text-slate-500 hover:text-blue-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Top Section */}
        {featured && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            
            {/* Featured Article */}
            <div className="lg:col-span-8">
              <ArticleWrapper article={featured} className="group block relative h-[450px] md:h-[600px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                <ImageWithFallback src={featured.image} alt={featured.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <span className="inline-block px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest mb-6 rounded-md shadow-md">
                    {featured.category}
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-black leading-[1.1] mb-6 group-hover:text-blue-200 transition-colors font-playfair drop-shadow-lg">
                    {featured.title}
                  </h1>
                  <p className="text-slate-200 text-base md:text-lg line-clamp-2 mb-8 font-source-serif max-w-3xl">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-white/90 text-xs font-bold uppercase tracking-widest">
                    <div className="w-10 h-10 rounded-full bg-blue-600/80 backdrop-blur-md flex items-center justify-center text-white ring-2 ring-white/20">
                      {featured.author ? featured.author[0] : 'C'}
                    </div>
                    <span>{featured.author || 'Staff Reporter'}</span>
                    <span className="text-white/50">•</span>
                    <span>{featured.date}</span>
                  </div>
                </div>
              </ArticleWrapper>
            </div>

            {/* Trending Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-900/5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] flex-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-16 -mt-16 z-0" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Trending</h3>
                  </div>
                  <div className="flex flex-col gap-8">
                    {trending.length > 0 ? trending.map((article, idx) => (
                      <ArticleWrapper key={article.id} article={article} className="group flex gap-5 items-start">
                        <span className="text-4xl font-black text-slate-200 leading-none group-hover:text-orange-200 transition-colors font-playfair">
                          0{idx + 1}
                        </span>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors mb-2 font-playfair">
                            {article.title}
                          </h4>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {article.author || 'Staff'} <span className="mx-2 text-slate-300">•</span> {article.date}
                          </div>
                        </div>
                      </ArticleWrapper>
                    )) : (
                      <p className="text-sm text-slate-500 italic font-source-serif">No trending stories yet.</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Weather / Local Widget */}
              <div className="bg-gradient-to-br from-blue-900 to-slate-900 p-8 rounded-3xl shadow-xl flex items-center justify-between text-white relative overflow-hidden group">
                <div className="absolute -right-8 -top-8 bg-blue-500/20 w-32 h-32 rounded-full blur-2xl group-hover:bg-blue-400/30 transition-colors" />
                <div className="relative z-10">
                  <div className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2">Global Impact</div>
                  <div className="text-3xl font-black font-playfair tracking-tight">Active Now</div>
                </div>
                <Globe className="w-12 h-12 text-blue-400/50 relative z-10 group-hover:text-blue-300 transition-colors group-hover:rotate-12" />
              </div>
            </div>
          </div>
        )}

        {/* Middle Section: Latest Stories */}
        {(latestStories.length > 0 || middleLeft.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            
            {/* Left side smaller cards */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {middleLeft.map(article => (
                <ArticleWrapper key={article.id} article={article} className="group bg-white p-5 rounded-3xl border border-slate-900/5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex gap-5 items-center">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                    <ImageWithFallback src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-2 block">
                      {article.category}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors mb-3 line-clamp-3 font-playfair">
                      {article.title}
                    </h4>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {article.date}
                    </div>
                  </div>
                </ArticleWrapper>
              ))}
            </div>

            {/* Right side Latest Stories */}
            <div className="lg:col-span-8 bg-white p-8 md:p-12 rounded-3xl border border-slate-900/5 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-3 h-3 bg-blue-600 rounded-sm rotate-45" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Latest Stories</h3>
              </div>
              <div className="flex flex-col gap-10 divide-y divide-slate-100">
                {latestStories.map((article, idx) => (
                  <ArticleWrapper key={article.id} article={article} className={`group flex flex-col-reverse sm:flex-row gap-8 ${idx > 0 ? 'pt-10' : ''}`}>
                    <div className="flex-1">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 block">
                        {article.category}
                      </span>
                      <h4 className="text-2xl md:text-3xl font-black text-slate-900 leading-snug group-hover:text-blue-700 transition-colors mb-4 font-playfair">
                        {article.title}
                      </h4>
                      <p className="text-base text-slate-600 line-clamp-2 mb-6 font-source-serif">
                        {article.excerpt}
                      </p>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {article.author || 'Staff'} <span className="mx-2 text-slate-300">•</span> {article.date}
                      </div>
                    </div>
                    <div className="w-full sm:w-64 h-56 sm:h-48 rounded-2xl overflow-hidden shrink-0 shadow-md">
                      <ImageWithFallback src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  </ArticleWrapper>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Editor's Picks */}
        {editorsPicks.length > 0 && (
          <div className="mb-16">
            <div className="border-l-4 border-orange-500 pl-4 mb-8">
              <h3 className="text-2xl font-black text-slate-900 font-playfair">Editor's Picks</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {editorsPicks.map(article => (
                <ArticleWrapper key={article.id} article={article} className="group bg-white rounded-3xl border border-slate-900/5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
                  <div className="w-full h-56 overflow-hidden">
                    <ImageWithFallback src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-black uppercase tracking-widest mb-4 w-max">
                      {article.category}
                    </span>
                    <h4 className="text-xl font-black text-slate-900 leading-snug group-hover:text-blue-700 transition-colors mb-4 font-playfair">
                      {article.title}
                    </h4>
                    <p className="text-sm text-slate-600 line-clamp-3 mb-6 flex-1 font-source-serif">
                      {article.excerpt}
                    </p>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-auto">
                      {article.author || 'Staff'} <span className="mx-2 text-slate-300">•</span> {article.date}
                    </div>
                  </div>
                </ArticleWrapper>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Recommended For You */}
          <div className="lg:col-span-8 bg-white p-8 md:p-12 rounded-3xl border border-slate-900/5 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
            <div className="flex items-center gap-3 mb-10">
              <Heart className="w-5 h-5 text-red-500 fill-red-500/20" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Recommended For You</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              {recommended.length > 0 ? recommended.map(article => (
                <ArticleWrapper key={article.id} article={article} className="group flex gap-5 items-center">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                    <ImageWithFallback src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-2 block">
                      {article.category}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors mb-2 line-clamp-2 font-playfair">
                      {article.title}
                    </h4>
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                      {article.author || 'Staff'}
                    </div>
                  </div>
                </ArticleWrapper>
              )) : (
                <p className="text-sm text-slate-500 italic col-span-full font-source-serif">More recommendations coming soon.</p>
              )}
            </div>
          </div>

          {/* Ways to Help CTA */}
          <div className="lg:col-span-4 bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-10 text-white flex flex-col justify-center shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-blue-400/40 transition-colors" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-900/20 rounded-full blur-2xl -ml-16 -mb-16" />
            
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-4 leading-tight font-playfair">WAYS TO HELP</h3>
              <p className="text-blue-100/90 text-sm mb-8 leading-relaxed font-source-serif">
                Your support enables CBNN and Cross-Borders Outreach to deliver medical aid, education, and clean water to families in need.
              </p>
              <div className="flex flex-col gap-4">
                <Link to="/donate" className="w-full bg-white text-blue-900 hover:bg-slate-50 font-black text-xs uppercase tracking-[0.15em] py-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5 shadow-lg shadow-white/10">
                  <Heart className="w-4 h-4 fill-blue-900/20" /> Support A Cause
                </Link>
                <Link to="/opportunities" className="w-full bg-transparent text-white hover:bg-blue-800/50 border border-blue-400/30 font-black text-xs uppercase tracking-[0.15em] py-4 rounded-xl flex items-center justify-center gap-3 transition-all">
                  Apply To Volunteer
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
