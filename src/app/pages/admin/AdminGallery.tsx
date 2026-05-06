import { useState, useEffect, useRef } from "react";
import { Upload, Image as ImageIcon, Trash2, Edit, Search, Filter, X, Loader2, AlertCircle, Folder, Plus } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { supabase, getEventArchives, createEventArchive, deleteEventArchive, EventArchive } from "../../../lib/supabase";

export default function AdminGallery() {
  const [activeTab, setActiveTab] = useState<"images" | "archives">("images");

  // --- Images State ---
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('community');
  const [uploadAlt, setUploadAlt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Archives State ---
  const [archives, setArchives] = useState<EventArchive[]>([]);
  const [archiveLoading, setArchiveLoading] = useState(true);
  const [uploadArchiveOpen, setUploadArchiveOpen] = useState(false);
  const [archiveSaving, setArchiveSaving] = useState(false);
  const [archiveTitle, setArchiveTitle] = useState('');
  const [archiveDate, setArchiveDate] = useState('');
  const [archiveDesc, setArchiveDesc] = useState('');
  const [archiveUrl, setArchiveUrl] = useState('');
  const [archiveError, setArchiveError] = useState<string | null>(null);

  const categories = ["all", "community", "education", "healthcare", "food", "economic"];

  useEffect(() => {
    fetchImages();
    fetchArchives();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setImages(data);
    }
    setLoading(false);
  };

  const fetchArchives = async () => {
    setArchiveLoading(true);
    const { data, error } = await getEventArchives();
    if (!error && data) {
      setArchives(data);
    }
    setArchiveLoading(false);
  };

  const filteredImages = images.filter(img => {
    const matchesCategory = selectedCategory === "all" || img.category === selectedCategory;
    const matchesSearch = (img.alt || '').toLowerCase().includes(searchQuery.toLowerCase()) || (img.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredArchives = archives.filter(arc => 
    arc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (arc.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteImage = async (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      const { error } = await supabase.from('gallery_images').delete().eq('id', id);
      if (!error) {
        setImages(images.filter(img => img.id !== id));
      } else {
        alert("Failed to delete image.");
      }
    }
  };

  const handleDeleteArchive = async (id: string) => {
    if (confirm("Are you sure you want to delete this event archive?")) {
      const { error } = await deleteEventArchive(id);
      if (!error) {
        setArchives(archives.filter(arc => arc.id !== id));
      } else {
        alert("Failed to delete archive.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadImage = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('gallery_images').insert({
        url: publicUrl,
        title: uploadTitle,
        category: uploadCategory,
        alt: uploadAlt,
        uploaded_by: (await supabase.auth.getUser()).data.user?.id
      });

      if (dbError) throw dbError;

      setUploadModalOpen(false);
      setFile(null);
      setUploadTitle('');
      setUploadCategory('community');
      setUploadAlt('');
      fetchImages();
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveArchive = async () => {
    if (!archiveTitle || !archiveDate || !archiveUrl) {
      setArchiveError("Please fill in all required fields (Title, Date, URL).");
      return;
    }
    setArchiveSaving(true);
    setArchiveError(null);
    try {
      const { error } = await createEventArchive({
        title: archiveTitle,
        date: archiveDate,
        description: archiveDesc,
        drive_url: archiveUrl
      });
      if (error) throw error;

      setUploadArchiveOpen(false);
      setArchiveTitle('');
      setArchiveDate('');
      setArchiveDesc('');
      setArchiveUrl('');
      fetchArchives();
    } catch (err: any) {
      setArchiveError(err.message || "Failed to save archive.");
    } finally {
      setArchiveSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
                <p className="text-gray-600">Upload images and manage event archives</p>
              </div>
            </div>
            <button
              onClick={() => activeTab === "images" ? setUploadModalOpen(true) : setUploadArchiveOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              {activeTab === "images" ? <Upload className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {activeTab === "images" ? "Upload Images" : "Add Archive Link"}
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-6 mt-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("images")}
              className={`pb-3 px-1 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "images" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Gallery Images
            </button>
            <button
              onClick={() => setActiveTab("archives")}
              className={`pb-3 px-1 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "archives" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Event Archives (Google Drive)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  placeholder={`Search ${activeTab}...`}
                />
              </div>
            </div>

            {/* Category Filter (Images Only) */}
            {activeTab === "images" && (
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-semibold capitalize transition-all ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {activeTab === "images" ? filteredImages.length : filteredArchives.length} of {activeTab === "images" ? images.length : archives.length} items
          </div>
        </div>

        {/* Content Area */}
        {activeTab === "images" ? (
          /* ── Images Grid ── */
          loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
          ) : filteredImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image) => (
                <div key={image.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
                        {image.alt || image.title}
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-semibold capitalize flex-shrink-0">
                        {image.category}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-semibold"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No images found</h3>
              <p className="text-gray-600">Try adjusting your filters or upload new images</p>
            </div>
          )
        ) : (
          /* ── Archives Grid ── */
          archiveLoading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
          ) : filteredArchives.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArchives.map((archive) => (
                <div key={archive.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 shrink-0 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <Folder className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 line-clamp-2">{archive.title}</h4>
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{archive.date}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 flex-grow mb-6">
                    {archive.description}
                  </p>
                  <div className="flex gap-2 mt-auto">
                    <a
                      href={archive.drive_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 text-center bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      Test Link
                    </a>
                    <button
                      onClick={() => handleDeleteArchive(archive.id)}
                      className="flex-1 py-2 text-center bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors text-sm flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No event archives found</h3>
              <p className="text-gray-600">Add a Google Drive link to get started</p>
            </div>
          )
        )}
      </div>

      {/* Upload Image Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Upload Images</h2>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {file ? file.name : "Drop images here or click to browse"}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Supports: JPG, PNG, WebP (Max 5MB per file)
                </p>
                <button 
                  type="button" 
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  {file ? "Change File" : "Select Files"}
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Image Title
                  </label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="Enter image title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select 
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  >
                    <option value="community">Community</option>
                    <option value="education">Education</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="food">Food Support</option>
                    <option value="economic">Economic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Alt Text (for accessibility)
                  </label>
                  <input
                    type="text"
                    value={uploadAlt}
                    onChange={(e) => setUploadAlt(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="Describe the image..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUploadImage}
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Upload Image"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Archive Modal */}
      {uploadArchiveOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Add Event Archive</h2>
              <button
                onClick={() => setUploadArchiveOpen(false)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              {archiveError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">{archiveError}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={archiveTitle}
                    onChange={(e) => setArchiveTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="e.g. Visit to Kioimbi Children's Home"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="text"
                    value={archiveDate}
                    onChange={(e) => setArchiveDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="e.g. March 14, 2026"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={archiveDesc}
                    onChange={(e) => setArchiveDesc(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                    placeholder="Brief description of the event..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Google Drive URL *
                  </label>
                  <input
                    type="url"
                    value={archiveUrl}
                    onChange={(e) => setArchiveUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="https://drive.google.com/drive/folders/..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setUploadArchiveOpen(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                  disabled={archiveSaving}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveArchive}
                  disabled={archiveSaving}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {archiveSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Link"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
