import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { Save, Eye, X, Image, Calendar, Tag, User, Loader2, AlertCircle, Bold, Italic, Underline, Heading1, Heading2, Quote, Link as LinkIcon, List, ImagePlus } from "lucide-react";
import { supabase } from "../../../lib/supabase";
type ContentType = "article" | "news" | "blog" | "story" | "events";

export default function AdminContentEditor() {
  const { type } = useParams<{ type: ContentType }>();
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement>(null);
  
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
    story: { label: "Impact Story", icon: "⭐", color: "pink" },
    events: { label: "Event", icon: "📅", color: "purple" }
  };

  const currentTypeKey = (() => {
    if (!type) return "article";
    if (type.startsWith("article")) return "article";
    if (type.startsWith("stori") || type.startsWith("story")) return "story";
    if (type.startsWith("blog")) return "blog";
    if (type.startsWith("event")) return "events";
    if (type === "news") return "news";
    return "article";
  })();

  const currentType = contentTypes[currentTypeKey as keyof typeof contentTypes] || contentTypes.article;

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (status: "draft" | "publish") => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSaving(true);
    setError(null);

    const tagsArray = tags
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    try {
      const { error: saveError } = await supabase.from("articles").insert({
        type: currentTypeKey,
        title,
        excerpt,
        content,
        author,
        category,
        featured_image: featuredImage,
        tags: tagsArray,
        status: status === "publish" ? "published" : "draft",
        published_at: status === "publish" ? new Date(publishDate).toISOString() : null,
      });

      if (saveError) throw saveError;
      
      alert(`Content saved successfully as ${status}!`);
      if (currentTypeKey === "events") {
        navigate("/events");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err: any) {
      console.error("Error saving content:", err);
      setError(err.message || "Failed to save content.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSaving(false);
    }
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
                disabled={isSaving}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={() => handleSave("draft")}
                disabled={isSaving}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Draft
              </button>
              <button
                onClick={() => handleSave("publish")}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <label className="text-sm font-bold text-gray-800">
                  Article Content *
                </label>
                <div className="text-xs font-semibold text-gray-500 bg-gray-200/50 px-2.5 py-1 rounded-full">
                  {content.length} characters
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                {/* Modern Toolbar */}
                <div className="bg-white border-b border-gray-200 p-2 flex gap-1 flex-wrap items-center">
                  <button onClick={() => document.execCommand('bold')} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-600 transition-colors" title="Bold"><Bold className="w-4 h-4" /></button>
                  <button onClick={() => document.execCommand('italic')} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-600 transition-colors" title="Italic"><Italic className="w-4 h-4" /></button>
                  <button onClick={() => document.execCommand('underline')} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-600 transition-colors" title="Underline"><Underline className="w-4 h-4" /></button>
                  
                  <div className="w-px h-6 bg-gray-200 mx-1"></div>
                  
                  <button onClick={() => document.execCommand('formatBlock', false, 'H1')} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-600 transition-colors" title="Heading 1"><Heading1 className="w-4 h-4" /></button>
                  <button onClick={() => document.execCommand('formatBlock', false, 'H2')} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-600 transition-colors" title="Heading 2"><Heading2 className="w-4 h-4" /></button>
                  <button onClick={() => document.execCommand('formatBlock', false, 'BLOCKQUOTE')} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-600 transition-colors" title="Quote"><Quote className="w-4 h-4" /></button>
                  
                  <div className="w-px h-6 bg-gray-200 mx-1"></div>
                  
                  <button onClick={() => document.execCommand('insertUnorderedList')} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-600 transition-colors" title="Bullet List"><List className="w-4 h-4" /></button>
                  <button onClick={() => {
                    const url = prompt('Enter link URL (e.g. https://google.com):');
                    if (url) document.execCommand('createLink', false, url);
                  }} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-600 transition-colors" title="Insert Link"><LinkIcon className="w-4 h-4" /></button>
                  <button onClick={() => {
                    const url = prompt('Enter image URL:');
                    if (url) document.execCommand('insertImage', false, url);
                  }} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-600 transition-colors" title="Insert Image"><ImagePlus className="w-4 h-4" /></button>
                </div>
                
                {/* Rich Text Area */}
                <div
                  ref={editorRef}
                  className="w-full flex-1 px-6 py-6 min-h-[500px] outline-none text-gray-800 bg-white prose max-w-none focus:ring-inset focus:ring-2 focus:ring-blue-100 transition-all overflow-y-auto"
                  contentEditable
                  onInput={(e) => setContent(e.currentTarget.innerHTML)}
                  style={{ minHeight: '500px' }}
                />
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
              
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="featured-image-upload"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  
                  try {
                    // Quick temporary loader feedback
                    setFeaturedImage("uploading...");
                    
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Math.random()}.${fileExt}`;
                    const filePath = `featured/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                      .from('images')
                      .upload(filePath, file);

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                      .from('images')
                      .getPublicUrl(filePath);

                    setFeaturedImage(publicUrl);
                  } catch (err) {
                    console.error("Error uploading image:", err);
                    alert("Failed to upload featured image.");
                    setFeaturedImage("");
                  }
                }}
              />

              {featuredImage === "uploading..." ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                  <p className="text-sm text-gray-600">Uploading...</p>
                </div>
              ) : featuredImage ? (
                <div className="relative">
                  <img src={featuredImage} alt="Featured" className="w-full rounded-lg" />
                  <button
                    onClick={() => setFeaturedImage("")}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center shadow-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => document.getElementById("featured-image-upload")?.click()}
                >
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
