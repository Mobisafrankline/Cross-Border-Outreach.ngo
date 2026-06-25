import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ChevronRight, TrendingUp, Sun, Heart } from "lucide-react";
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

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
const sans = { fontFamily: "'Inter', sans-serif" };
const bodySerif = { fontFamily: "'Source Serif 4', Georgia, serif" };

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
      <div className="bg-white border-b border-gray-200 sticky top-16 md:top-[72px] z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex overflow-x-auto no-scrollbar py-4 items-center gap-6" style={sans}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap text-xs font-bold uppercase tracking-widest transition-colors ${
                  activeCategory === cat ? "text-blue-700 border-b-2 border-blue-700 pb-1 -mb-[18px]" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Top Section */}
        {featured && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            
            {/* Featured Article */}
            <div className="lg:col-span-8">
              <ArticleWrapper article={featured} className="group block relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-sm">
                <ImageWithFallback src={featured.image} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <span className="inline-block px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest mb-4" style={sans}>
                    {featured.category}
                  </span>
                  <h1 className="text-3xl md:text-5xl text-white font-bold leading-tight mb-4 group-hover:text-blue-100 transition-colors" style={serif}>
                    {featured.title}
                  </h1>
                  <p className="text-gray-200 text-sm md:text-base line-clamp-2 mb-4" style={bodySerif}>
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-white/80 text-xs font-semibold" style={sans}>
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      {featured.author ? featured.author[0] : 'C'}
                    </div>
                    <span>{featured.author || 'Staff Reporter'}</span>
                    <span>•</span>
                    <span>{featured.date}</span>
                  </div>
                </div>
              </ArticleWrapper>
            </div>

            {/* Trending Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex-1">
                <div className="flex items-center gap-2 mb-6" style={sans}>
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Trending</h3>
                </div>
                <div className="flex flex-col gap-6">
                  {trending.length > 0 ? trending.map((article, idx) => (
                    <ArticleWrapper key={article.id} article={article} className="group flex gap-4">
                      <span className="text-3xl font-light text-gray-200 leading-none" style={serif}>
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-base font-bold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors mb-1" style={serif}>
                          {article.title}
                        </h4>
                        <div className="text-[11px] text-gray-500 font-semibold" style={sans}>
                          {article.author || 'Staff'} <span className="mx-1">•</span> {article.date}
                        </div>
                      </div>
                    </ArticleWrapper>
                  )) : (
                    <p className="text-sm text-gray-500 italic" style={bodySerif}>No trending stories yet.</p>
                  )}
                </div>
              </div>
              
              {/* Weather / Local Widget */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1" style={sans}>Global Impact</div>
                  <div className="text-2xl font-black text-gray-900" style={serif}>Active Now</div>
                </div>
                <Globe className="w-8 h-8 text-blue-400 opacity-50" />
              </div>
            </div>
          </div>
        )}

        {/* Middle Section: Latest Stories */}
        {(latestStories.length > 0 || middleLeft.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            
            {/* Left side smaller cards */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {middleLeft.map(article => (
                <ArticleWrapper key={article.id} article={article} className="group bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4 items-center">
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                    <ImageWithFallback src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1 block" style={sans}>
                      {article.category}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors mb-2 line-clamp-3" style={serif}>
                      {article.title}
                    </h4>
                    <div className="text-[10px] text-gray-500 font-semibold" style={sans}>
                      {article.author || 'Staff'} <span className="mx-1">•</span> {article.date}
                    </div>
                  </div>
                </ArticleWrapper>
              ))}
            </div>

            {/* Right side Latest Stories */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-8" style={sans}>
                <div className="w-2 h-2 bg-yellow-400 rotate-45" />
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Latest Stories</h3>
              </div>
              <div className="flex flex-col gap-8 divide-y divide-gray-100">
                {latestStories.map((article, idx) => (
                  <ArticleWrapper key={article.id} article={article} className={`group flex flex-col-reverse sm:flex-row gap-6 ${idx > 0 ? 'pt-8' : ''}`}>
                    <div className="flex-1">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block" style={sans}>
                        {article.category}
                      </span>
                      <h4 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors mb-2" style={serif}>
                        {article.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4" style={bodySerif}>
                        {article.excerpt}
                      </p>
                      <div className="text-[11px] text-gray-500 font-semibold" style={sans}>
                        {article.author || 'Staff'} <span className="mx-1">•</span> {article.date}
                      </div>
                    </div>
                    <div className="w-full sm:w-48 h-48 sm:h-32 rounded-lg overflow-hidden shrink-0">
                      <ImageWithFallback src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  </ArticleWrapper>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Editor's Picks */}
        {editorsPicks.length > 0 && (
          <div className="mb-12">
            <div className="border-l-4 border-blue-700 pl-3 mb-6">
              <h3 className="text-lg font-black text-gray-900" style={serif}>Editor's Picks</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {editorsPicks.map(article => (
                <ArticleWrapper key={article.id} article={article} className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
                  <div className="w-full h-48 overflow-hidden">
                    <ImageWithFallback src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block" style={sans}>
                      {article.category}
                    </span>
                    <h4 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors mb-3" style={serif}>
                      {article.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1" style={bodySerif}>
                      {article.excerpt}
                    </p>
                    <div className="text-[11px] text-gray-500 font-semibold mt-auto" style={sans}>
                      {article.author || 'Staff'} <span className="mx-1">•</span> {article.date}
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
          <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-8" style={sans}>
              <Heart className="w-4 h-4 text-red-500" />
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Recommended For You</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {recommended.length > 0 ? recommended.map(article => (
                <ArticleWrapper key={article.id} article={article} className="group flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <ImageWithFallback src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1 block" style={sans}>
                      {article.category}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors mb-1 line-clamp-2" style={serif}>
                      {article.title}
                    </h4>
                    <div className="text-[10px] text-gray-500 font-semibold" style={sans}>
                      {article.author || 'Staff'}
                    </div>
                  </div>
                </ArticleWrapper>
              )) : (
                <p className="text-sm text-gray-500 italic col-span-full" style={bodySerif}>More recommendations coming soon.</p>
              )}
            </div>
          </div>

          {/* Ways to Help CTA */}
          <div className="lg:col-span-4 bg-blue-700 rounded-xl p-8 text-white flex flex-col justify-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-4 leading-tight" style={serif}>WAYS TO HELP</h3>
              <p className="text-blue-100 text-sm mb-8 leading-relaxed" style={bodySerif}>
                Your support enables CBNN and Cross-Borders Outreach to deliver medical aid, education, and clean water to families in need.
              </p>
              <div className="flex flex-col gap-3" style={sans}>
                <Link to="/donate" className="w-full bg-white text-blue-700 hover:bg-gray-50 font-black text-xs uppercase tracking-widest py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <Heart className="w-3 h-3" /> Support A Cause
                </Link>
                <Link to="/opportunities" className="w-full bg-blue-800 text-white hover:bg-blue-900 border border-blue-600 font-black text-xs uppercase tracking-widest py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
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

// Dummy Globe component for missing import
function Globe({ className }: { className: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  );
}
