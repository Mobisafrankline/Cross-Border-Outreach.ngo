import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Save, Eye, X, Image, Calendar, Tag, User } from "lucide-react";

type ContentType = "article" | "news" | "blog" | "story";

export default function AdminContentEditor() {
  const { type } = useParams<{ type: ContentType }>();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [tags, setTags] = useState("");
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);

  const contentTypes = {
    article: { label: "Article", icon: "📄", color: "blue" },
    news: { label: "News", icon: "📰", color: "green" },
    blog: { label: "Blog Post", icon: "✍️", color: "orange" },
    story: { label: "Impact Story", icon: "⭐", color: "pink" }
  };

  const currentTypeKey = (() => {
    if (!type) return "article";
    if (type.startsWith("article")) return "article";
    if (type.startsWith("stori") || type.startsWith("story")) return "story";
    if (type.startsWith("blog")) return "blog";
    if (type === "news") return "news";
    return "article";
  })();

  const currentType = contentTypes[currentTypeKey as keyof typeof contentTypes] || contentTypes.article;

  const handleSave = (status: "draft" | "publish") => {
    // TODO: Implement save functionality
    alert(`Content saved as ${status}!`);
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentType.icon}</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Create {currentType.label}
                </h1>
                <p className="text-sm text-gray-600">Cross-Borders Content Management</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={() => handleSave("draft")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
              >
                Save Draft
              </button>
              <button
                onClick={() => handleSave("publish")}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 text-2xl font-bold border-0 focus:ring-0 outline-none"
                placeholder={`Enter ${currentType.label.toLowerCase()} title...`}
              />
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Excerpt / Summary
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                rows={3}
                placeholder="Brief summary of the content..."
              />
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Content *
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                {/* Toolbar */}
                <div className="bg-gray-50 border-b border-gray-300 p-2 flex gap-2 flex-wrap">
                  {['Bold', 'Italic', 'Underline', 'H1', 'H2', 'Quote', 'Link', 'Image', 'List'].map((tool) => (
                    <button
                      key={tool}
                      className="px-3 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded text-sm font-semibold text-gray-700 transition-colors"
                    >
                      {tool}
                    </button>
                  ))}
                </div>
                {/* Editor */}
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 border-0 focus:ring-0 outline-none resize-none min-h-[400px]"
                  placeholder="Write your content here..."
                />
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {content.length} characters
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Publish Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Author
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="Author name..."
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                <Tag className="w-4 h-4 inline mr-1" />
                Category
              </h3>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              >
                <option value="">Select category...</option>
                <option value="program-updates">Program Updates</option>
                <option value="success-stories">Success Stories</option>
                <option value="community">Community</option>
                <option value="events">Events</option>
                <option value="partnerships">Partnerships</option>
                <option value="announcements">Announcements</option>
              </select>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                <Image className="w-4 h-4 inline mr-1" />
                Featured Image
              </h3>
              
              {featuredImage ? (
                <div className="relative">
                  <img src={featuredImage} alt="Featured" className="w-full rounded-lg" />
                  <button
                    onClick={() => setFeaturedImage("")}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-3">No image selected</p>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">
                    Select Image
                  </button>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Tags</h3>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                placeholder="Enter tags (comma separated)..."
              />
              <p className="mt-2 text-xs text-gray-600">
                Example: education, impact, community
              </p>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">SEO Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                    rows={3}
                    placeholder="SEO description..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
