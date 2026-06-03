import { Calendar, User, ArrowRight, Search, Tag, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState } from "react";

const serif = { fontFamily: "'Inter', -apple-system, sans-serif" };
const bodySerif = { fontFamily: "'Inter', -apple-system, sans-serif" };
const sans = { fontFamily: "'Inter', -apple-system, sans-serif" };

export default function Blog() {
  const [currentPage, setCurrentPage] = useState(1);
  const blogPosts = [
    {
      title: "5 Ways Your Donation Makes a Real Difference",
      excerpt: "Discover the tangible impact of your contributions and how they transform lives in communities we serve.",
      category: "Impact",
      date: "February 20, 2026",
      author: "Rachel Chen",
      image: "https://images.unsplash.com/photo-1697665387559-253e7a645e96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb25hdGlvbiUyMGdpdmluZyUyMGNoYXJpdHklMjBoYW5kc3xlbnwxfHx8fDE3NzE5OTY4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Building Sustainable Food Systems in Rural Communities",
      excerpt: "Learn about our innovative approach to creating long-term food security through agricultural training.",
      category: "Programs",
      date: "February 15, 2026",
      author: "David Kimani",
      image: "https://images.unsplash.com/photo-1710092784814-4a6f158913b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGlzdHJpYnV0aW9uJTIwY2hhcml0eSUyMHZvbHVudGVlcnN8ZW58MXx8fHwxNzcxOTk2NjkzfDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "The Power of Education: Stories from Our Classrooms",
      excerpt: "Meet the students whose lives have been transformed through access to quality education and resources.",
      category: "Stories",
      date: "February 10, 2026",
      author: "Sarah Osei",
      image: "https://images.unsplash.com/photo-1770843093640-c44ae557928b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHN0dWR5aW5nJTIwZWR1Y2F0aW9uJTIwQWZyaWNhfGVufDF8fHx8MTc3MTk5NjY5Mnww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Healthcare Heroes: Mobile Clinics Reaching Remote Areas",
      excerpt: "Follow our medical teams as they bring essential healthcare services to underserved communities.",
      category: "Healthcare",
      date: "February 5, 2026",
      author: "Dr. Michael Torres",
      image: "https://images.unsplash.com/photo-1770221797840-8f5a095ad7ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMG91dHJlYWNofGVufDF8fHx8MTc3MTk5NjY5M3ww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Empowering Women Entrepreneurs Through Microfinance",
      excerpt: "See how small loans are creating big changes in women's economic independence and community development.",
      category: "Economic",
      date: "January 28, 2026",
      author: "Fatima Ndiaye",
      image: "https://images.unsplash.com/photo-1752650736246-abae155278be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGVudHJlcHJlbmV1ciUyMHNtYWxsJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzcxOTk2Njk0fDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Volunteer Spotlight: Why I Give My Time",
      excerpt: "Inspiring stories from volunteers who dedicate their time and skills to our mission.",
      category: "Volunteers",
      date: "January 22, 2026",
      author: "Jennifer Martinez",
      image: "https://images.unsplash.com/photo-1769837230054-7f3a7356dde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXJzJTIwY29tbXVuaXR5JTIwc2VydmljZSUyMHRlYW13b3JrfGVufDF8fHx8MTc3MTk5Njg5M3ww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  const categories = ["All", "Impact", "Programs", "Stories", "Healthcare", "Economic", "Volunteers"];
  const POSTS_PER_PAGE = 4;
  const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);

  const paginatedPosts = blogPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1565672282630-ff265756849c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9nJTIwd3JpdGluZyUyMGxhcHRvcCUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzE5MjgwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Blog"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/80" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight" style={serif}>Our Blog</h1>
          <p className="text-xl md:text-2xl opacity-90 font-medium" style={bodySerif}>
            Stories, insights, and updates from the field
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between" style={sans}>
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all font-medium"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors text-sm font-bold uppercase tracking-widest"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">
            {paginatedPosts.map((post, index) => (
              <article key={index} className="bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-300 group flex flex-col sm:flex-row">
                <div className="sm:w-2/5 h-64 sm:h-auto overflow-hidden relative shrink-0">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent sm:hidden" />
                </div>
                <div className="p-8 flex flex-col justify-center flex-1">
                  <div className="flex items-center gap-2 mb-4" style={sans}>
                    <Tag className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-black uppercase tracking-widest text-blue-600">{post.category}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 line-clamp-3 leading-tight group-hover:text-blue-600 transition-colors" style={serif}>{post.title}</h3>
                  <p className="text-slate-600 mb-6 line-clamp-2 leading-relaxed" style={bodySerif}>{post.excerpt}</p>
                  
                  <div className="flex flex-wrap items-center justify-between text-xs font-bold text-slate-500 mb-6 gap-y-2" style={sans}>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-sm hover:text-blue-800 transition-colors mt-auto"
                    style={sans}
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between border-t border-slate-200 py-10 mt-16" style={sans}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold uppercase tracking-widest text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Previous
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-full font-black text-sm flex items-center justify-center transition-colors ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold uppercase tracking-widest text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors group"
            >
              Next <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight" style={serif}>Stay Updated</h2>
          <p className="text-xl mb-10 text-slate-300 font-medium max-w-2xl mx-auto" style={bodySerif}>
            Subscribe to our blog and receive the latest stories and updates directly in your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" style={sans}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-slate-900 font-medium"
            />
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest transition-colors shadow-lg shadow-blue-600/30">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
