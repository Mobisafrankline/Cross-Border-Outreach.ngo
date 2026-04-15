import { Calendar, User, ArrowRight, Search, Tag } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function Blog() {
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1565672282630-ff265756849c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9nJTIwd3JpdGluZyUyMGxhcHRvcCUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzE5MjgwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Blog"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Blog</h1>
          <p className="text-xl md:text-2xl opacity-95">
            Stories, insights, and updates from the field
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                <div className="h-48 overflow-hidden">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-600">{post.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
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
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-12">
            <button className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors">2</button>
            <button className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors">3</button>
            <button className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 opacity-95">
            Subscribe to our blog and receive the latest stories and updates directly in your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none text-gray-900"
            />
            <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
