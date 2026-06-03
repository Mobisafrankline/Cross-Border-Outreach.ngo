import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { 
  Newspaper, 
  TrendingUp, 
  FileText, 
  Eye, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Loader2,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock
} from "lucide-react";
import { supabase, getArticles, deleteArticle } from "../../../lib/supabase";
import type { Article } from "../../../lib/supabase";

export default function AdminNewsChannel() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "news" | "blog" | "story" | "events">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all articles
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (err: any) {
      console.error("Error fetching articles:", err);
      setError(err.message || "Failed to load articles.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await deleteArticle(id);
      if (error) throw error;
      setArticles(articles.filter(a => a.id !== id));
    } catch (err: any) {
      alert("Failed to delete article: " + err.message);
    }
  };

  const handleToggleStatus = async (article: Article) => {
    const newStatus = article.status === "published" ? "draft" : "published";
    try {
      const { error } = await supabase
        .from('articles')
        .update({ 
          status: newStatus,
          published_at: newStatus === "published" ? new Date().toISOString() : article.published_at 
        })
        .eq('id', article.id);

      if (error) throw error;
      setArticles(articles.map(a => a.id === article.id ? { ...a, status: newStatus } : a));
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || article.type === filterType;
    const matchesStatus = filterStatus === "all" || article.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Analytics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const stats = {
    total: articles.length,
    published: articles.filter(a => a.status === "published").length,
    drafts: articles.filter(a => a.status === "draft").length,
    thisMonth: articles.filter(a => {
      const date = new Date(a.created_at);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length
  };

  if (loading) {
    return (
      <div className="flex-1 bg-slate-50 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 text-slate-900 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Newspaper className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">News Channel Manager</h1>
                <p className="text-slate-500 font-medium">Manage articles, news, and impact stories</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link 
                to="/global-news" 
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold transition-all shadow-sm"
              >
                <Eye className="w-4 h-4" />
                View Channel
              </Link>
              <Link 
                to="/admin/news/new"
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Create Post
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}
        
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Posts</p>
              <p className="text-3xl font-black text-slate-900">{stats.total}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Published</p>
              <p className="text-3xl font-black text-green-600">{stats.published}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Drafts</p>
              <p className="text-3xl font-black text-orange-600">{stats.drafts}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">This Month</p>
              <p className="text-3xl font-black text-purple-600">{stats.thisMonth}</p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">All Types</option>
                <option value="news">News</option>
                <option value="blog">Blog</option>
                <option value="story">Story</option>
                <option value="events">Events</option>
              </select>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="px-6 py-4">Title & Excerpt</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                      <div className="flex flex-col items-center justify-center">
                        <Newspaper className="w-12 h-12 text-slate-300 mb-3" />
                        <p>No articles found matching your filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 mb-1">{article.title}</div>
                        <div className="text-sm text-slate-500 line-clamp-1 max-w-md">{article.excerpt}</div>
                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                          <span className="font-semibold text-slate-600">{article.author}</span> • 
                          <span className="capitalize">{article.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700">
                          {article.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleToggleStatus(article)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                            article.status === 'published' 
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                              : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
                          }`}
                        >
                          {article.status}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {new Date(article.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/${article.type}/new?edit=${article.id}`} // Assuming the editor handles edit mode via query param or you can change it later
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
