import { useState, useEffect } from "react";
import MagazineLayout, { MagazineArticle } from "../components/MagazineLayout";
import { supabase } from "../../lib/supabase";

export default function Blog() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<MagazineArticle[]>([]);

  // Static fallback data
  const staticPosts = [
    {
      id: 1,
      title: "5 Ways Your Donation Makes a Real Difference",
      excerpt: "Discover the tangible impact of your contributions and how they transform lives in communities we serve.",
      category: "Impact",
      date: "February 20, 2026",
      author: "Rachel Chen",
      image: "https://images.unsplash.com/photo-1697665387559-253e7a645e96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb25hdGlvbiUyMGdpdmluZyUyMGNoYXJpdHklMjBoYW5kc3xlbnwxfHx8fDE3NzE5OTY4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      url: "#"
    },
    {
      id: 2,
      title: "Building Sustainable Food Systems in Rural Communities",
      excerpt: "Learn about our innovative approach to creating long-term food security through agricultural training.",
      category: "Programs",
      date: "February 15, 2026",
      author: "David Kimani",
      image: "https://images.unsplash.com/photo-1710092784814-4a6f158913b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGlzdHJpYnV0aW9uJTIwY2hhcml0eSUyMHZvbHVudGVlcnN8ZW58MXx8fHwxNzcxOTk2NjkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      url: "#"
    },
    {
      id: 3,
      title: "The Power of Education: Stories from Our Classrooms",
      excerpt: "Meet the students whose lives have been transformed through access to quality education and resources.",
      category: "Stories",
      date: "February 10, 2026",
      author: "Sarah Osei",
      image: "https://images.unsplash.com/photo-1770843093640-c44ae557928b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHN0dWR5aW5nJTIwZWR1Y2F0aW9uJTIwQWZyaWNhfGVufDF8fHx8MTc3MTk5NjY5Mnww&ixlib=rb-4.1.0&q=80&w=1080",
      url: "#"
    },
    {
      id: 4,
      title: "Healthcare Heroes: Mobile Clinics Reaching Remote Areas",
      excerpt: "Follow our medical teams as they bring essential healthcare services to underserved communities.",
      category: "Healthcare",
      date: "February 5, 2026",
      author: "Dr. Michael Torres",
      image: "https://images.unsplash.com/photo-1770221797840-8f5a095ad7ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMG91dHJlYWNofGVufDF8fHx8MTc3MTk5NjY5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      url: "#"
    },
    {
      id: 5,
      title: "Empowering Women Entrepreneurs Through Microfinance",
      excerpt: "See how small loans are creating big changes in women's economic independence and community development.",
      category: "Economic",
      date: "January 28, 2026",
      author: "Fatima Ndiaye",
      image: "https://images.unsplash.com/photo-1752650736246-abae155278be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGVudHJlcHJlbmV1ciUyMHNtYWxsJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzcxOTk2Njk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      url: "#"
    },
    {
      id: 6,
      title: "Volunteer Spotlight: Why I Give My Time",
      excerpt: "Inspiring stories from volunteers who dedicate their time and skills to our mission.",
      category: "Volunteers",
      date: "January 22, 2026",
      author: "Jennifer Martinez",
      image: "https://images.unsplash.com/photo-1769837230054-7f3a7356dde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXJzJTIwY29tbXVuaXR5JTIwc2VydmljZSUyMHRlYW13b3JrfGVufDF8fHx8MTc3MTk5Njg5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      url: "#"
    }
  ];

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("type", "blog")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      let combined: MagazineArticle[] = [...staticPosts];

      if (!error && data && data.length > 0) {
        const supaPosts: MagazineArticle[] = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          excerpt: d.excerpt || d.content?.substring(0, 100) + '...' || '',
          category: d.category || 'Updates',
          date: d.published_at ? new Date(d.published_at).toLocaleDateString() : 'Recent',
          author: d.author || 'Staff',
          image: d.featured_image || d.image || "https://images.unsplash.com/photo-1565672282630-ff265756849c?w=800&q=80",
          url: `/blog/${d.id}`
        }));
        
        // Put supabase posts first
        combined = [...supaPosts, ...staticPosts];
      }

      setArticles(combined);
      setLoading(false);
    };

    fetchBlog();
  }, []);

  const categories = ["All", "Impact", "Programs", "Stories", "Healthcare", "Economic", "Volunteers"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <MagazineLayout categories={categories} articles={articles} />;
}
