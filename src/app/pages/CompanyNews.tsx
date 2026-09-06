import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import MagazineLayout, { MagazineArticle } from "../components/MagazineLayout";

export default function CompanyNews() {
  const [news, setNews] = useState<MagazineArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("type", "news")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      let combined: MagazineArticle[] = [];

      if (!error && data && data.length > 0) {
        combined = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          excerpt: d.excerpt || d.content?.substring(0, 100) + '...' || '',
          category: d.category || 'Announcement',
          date: d.published_at ? new Date(d.published_at).toLocaleDateString() : 'Recent',
          author: d.author || 'Staff Reporter',
          image: d.featured_image || d.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
          url: `/company-news/${d.id}`
        }));
      }

      setNews(combined);
      setLoading(false);
    };

    fetchNews();
  }, []);

  const categories = ["All", "Announcements", "Press Release", "Company Updates", "Outreach", "Disaster Response", "Mental Health"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <Loader2 className="w-12 h-12 text-[#F5B800] animate-spin" />
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy-900 mb-2 font-playfair">No News Yet</h2>
          <p className="text-gray-500">Check back soon for the latest company updates.</p>
        </div>
      </div>
    );
  }

  return (
    <MagazineLayout 
      pageTitle="Company News"
      pageDescription="Stay up-to-date with our latest announcements, press releases, and organizational updates."
      categories={categories} 
      articles={news} 
    />
  );
}
