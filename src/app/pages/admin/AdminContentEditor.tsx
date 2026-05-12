import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { Save, X, Image, Calendar, Tag, User, Loader2, AlertCircle, Bold, Italic, Underline, Heading1, Heading2, Quote, Link as LinkIcon, List, ImagePlus, MapPin, Clock, Phone, Mail, Users, DollarSign } from "lucide-react";
import { supabase } from "../../../lib/supabase";

type ContentType = "article" | "news" | "blog" | "story" | "events";

export default function AdminContentEditor() {
  const { type } = useParams<{ type: ContentType }>();
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement>(null);

  // General fields
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [tags, setTags] = useState("");
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);

  // Event-specific fields
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventAddress, setEventAddress] = useState("");
  const [eventCapacity, setEventCapacity] = useState("");
  const [ticketPrice, setTicketPrice] = useState("Free");
  const [eventStatus, setEventStatus] = useState<"upcoming" | "past">("upcoming");
  const [organizer, setOrganizer] = useState("Cross-Borders Outreach Ministry Inc.");
  const [contactEmail, setContactEmail] = useState("info@cross-bordersoutreach.org");
  const [contactPhone, setContactPhone] = useState("+1 (404) 641-9248");

  const contentTypes = {
    article: { label: "Article", icon: "📄", color: "blue" },
    news: { label: "News", icon: "📰", color: "green" },
    blog: { label: "Blog Post", icon: "✍️", color: "orange" },
    story: { label: "Impact Story", icon: "⭐", color: "pink" },
    events: { label: "Event", icon: "📅", color: "purple" }
  };

  const initialTypeKey = (() => {
    if (!type) return "blog";
    if (type.startsWith("article")) return "article";
    if (type.startsWith("stori") || type.startsWith("story")) return "story";
    if (type.startsWith("blog")) return "blog";
    if (type.startsWith("event")) return "events";
    if (type === "news") return "news";
    return "blog";
  })();

  const [selectedType, setSelectedType] = useState(initialTypeKey);
  const currentTypeKey = selectedType;
  const currentType = contentTypes[currentTypeKey as keyof typeof contentTypes] || contentTypes.blog;
  const isEvent = currentTypeKey === "events";

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (status: "draft" | "publish") => {
    if (!title.trim()) {
      setError("Title is required.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!isEvent && !content.trim()) {
      setError("Content is required.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (isEvent && !eventDate.trim()) {
      setError("Event date is required.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSaving(true);
    setError(null);

    const tagsArray = tags.split(",").map(t => t.trim()).filter(t => t.length > 0);

    try {
      const payload: Record<string, unknown> = {
        type: currentTypeKey,
        title,
        excerpt,
        content: isEvent ? excerpt : content, // for events, use excerpt as description
        author,
        category,
        featured_image: featuredImage,
        tags: tagsArray,
        status: status === "publish" ? "published" : "draft",
        published_at: status === "publish" ? new Date(publishDate).toISOString() : null,
      };

      if (isEvent) {
        payload.event_date = eventDate;
        payload.event_time = eventTime;
        payload.event_location = eventLocation;
        payload.event_address = eventAddress;
        payload.event_capacity = eventCapacity ? parseInt(eventCapacity) : 0;
        payload.event_registered = 0;
        payload.ticket_price = ticketPrice || "Free";
        payload.event_status = eventStatus;
        payload.organizer = organizer;
        payload.contact_email = contactEmail;
        payload.contact_phone = contactPhone;
        // store rich description in content field
        payload.content = content || excerpt;
      }

      const { error: saveError } = await supabase.from("articles").insert(payload);
      if (saveError) throw saveError;

      alert(`${currentType.label} saved successfully as ${status}!`);
      if (isEvent) {
        navigate("/events");
      } else if (currentTypeKey === "story") {
        navigate("/impact");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      console.error("Error saving content:", err);
      setError(e.message || "Failed to save content.");
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
                <h1 className="text-2xl font-bold text-gray-900">Create {currentType.label}</h1>
                <p className="text-sm text-gray-600">Cross-Borders Content Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/admin/dashboard")} disabled={isSaving}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50">
                <X className="w-4 h-4" /> Cancel
              </button>
              <button onClick={() => handleSave("draft")} disabled={isSaving}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50">
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />} Save Draft
              </button>
              <button onClick={() => handleSave("publish")} disabled={isSaving}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50">
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 text-2xl font-bold border-0 focus:ring-0 outline-none"
                placeholder={`Enter ${currentType.label.toLowerCase()} title...`} />
            </div>

            {/* Event-specific fields */}
            {isEvent && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" /> Event Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      <Calendar className="w-3.5 h-3.5 inline mr-1" /> Event Date *
                    </label>
                    <input type="text" value={eventDate} onChange={e => setEventDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                      placeholder="e.g. June 15, 2026 or TBD" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      <Clock className="w-3.5 h-3.5 inline mr-1" /> Event Time
                    </label>
                    <input type="text" value={eventTime} onChange={e => setEventTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                      placeholder="e.g. 10:00 AM – 4:00 PM" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      <MapPin className="w-3.5 h-3.5 inline mr-1" /> Location / Venue
                    </label>
                    <input type="text" value={eventLocation} onChange={e => setEventLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                      placeholder="e.g. Sienna Ridge Apartment Homes" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      <MapPin className="w-3.5 h-3.5 inline mr-1" /> Full Address
                    </label>
                    <input type="text" value={eventAddress} onChange={e => setEventAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                      placeholder="e.g. 2283 Plaster Rd NE, Atlanta, GA" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      <Users className="w-3.5 h-3.5 inline mr-1" /> Capacity
                    </label>
                    <input type="number" value={eventCapacity} onChange={e => setEventCapacity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                      placeholder="e.g. 100" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      <DollarSign className="w-3.5 h-3.5 inline mr-1" /> Ticket Price
                    </label>
                    <input type="text" value={ticketPrice} onChange={e => setTicketPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                      placeholder="Free or $25, etc." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Event Status</label>
                    <select value={eventStatus} onChange={e => setEventStatus(e.target.value as "upcoming" | "past")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none">
                      <option value="upcoming">Upcoming</option>
                      <option value="past">Past</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      <User className="w-3.5 h-3.5 inline mr-1" /> Organizer
                    </label>
                    <input type="text" value={organizer} onChange={e => setOrganizer(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                      placeholder="Organizer name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      <Mail className="w-3.5 h-3.5 inline mr-1" /> Contact Email
                    </label>
                    <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                      placeholder="contact@example.org" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      <Phone className="w-3.5 h-3.5 inline mr-1" /> Contact Phone
                    </label>
                    <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                      placeholder="+1 (404) 641-9248" />
                  </div>
                </div>
              </div>
            )}

            {/* Excerpt / Short Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {isEvent ? "Short Description (shown on event card)" : "Excerpt / Summary"}
              </label>
              <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                rows={3} placeholder="Brief summary of the content..." />
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <label className="text-sm font-bold text-gray-800">
                  {isEvent ? "Full Event Description *" : "Article Content *"}
                </label>
                <div className="text-xs font-semibold text-gray-500 bg-gray-200/50 px-2.5 py-1 rounded-full">
                  {content.length} characters
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="bg-white border-b border-gray-200 p-2 flex gap-1 flex-wrap items-center">
                  <button onClick={() => document.execCommand('bold')} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-600 transition-colors" title="Bold"><Bold className="w-4 h-4" /></button>
                  <button onClick={() => document.execCommand('italic')} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-600 transition-colors" title="Italic"><Italic className="w-4 h-4" /></button>
                  <button onClick={() => document.execCommand('underline')} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-600 transition-colors" title="Underline"><Underline className="w-4 h-4" /></button>
                  <div className="w-px h-6 bg-gray-200 mx-1" />
                  <button onClick={() => document.execCommand('formatBlock', false, 'H1')} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-600 transition-colors" title="Heading 1"><Heading1 className="w-4 h-4" /></button>
                  <button onClick={() => document.execCommand('formatBlock', false, 'H2')} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-600 transition-colors" title="Heading 2"><Heading2 className="w-4 h-4" /></button>
                  <button onClick={() => document.execCommand('formatBlock', false, 'BLOCKQUOTE')} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-600 transition-colors" title="Quote"><Quote className="w-4 h-4" /></button>
                  <div className="w-px h-6 bg-gray-200 mx-1" />
                  <button onClick={() => document.execCommand('insertUnorderedList')} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-600 transition-colors" title="Bullet List"><List className="w-4 h-4" /></button>
                  <button onClick={() => { const url = prompt('Enter link URL:'); if (url) document.execCommand('createLink', false, url); }} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-600 transition-colors" title="Insert Link"><LinkIcon className="w-4 h-4" /></button>
                  <button onClick={() => { const url = prompt('Enter image URL:'); if (url) document.execCommand('insertImage', false, url); }} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-600 transition-colors" title="Insert Image"><ImagePlus className="w-4 h-4" /></button>
                </div>
                <div ref={editorRef}
                  className="w-full flex-1 px-6 py-6 min-h-[400px] outline-none text-gray-800 bg-white prose max-w-none focus:ring-inset focus:ring-2 focus:ring-blue-100 transition-all overflow-y-auto"
                  contentEditable
                  onInput={(e) => setContent(e.currentTarget.innerHTML)}
                  style={{ minHeight: '400px' }} />
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Content Type</label>
                  <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none font-semibold">
                    <option value="blog">✍️ Blog Post</option>
                    <option value="news">📰 News</option>
                    <option value="story">⭐ Impact Story</option>
                    <option value="events">📅 Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {isEvent ? "Publish / Created Date" : "Publish Date"}
                  </label>
                  <input type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" />
                </div>
                {!isEvent && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" /> Author
                    </label>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      placeholder="Author name..." />
                  </div>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                <Tag className="w-4 h-4 inline mr-1" /> Category
              </h3>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none">
                <option value="">Select category...</option>
                {isEvent ? (
                  <>
                    <option value="Outreach">Outreach</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Fundraiser">Fundraiser</option>
                    <option value="Community">Community</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Summit">Summit</option>
                  </>
                ) : (
                  <>
                    <option value="program-updates">Program Updates</option>
                    <option value="success-stories">Success Stories</option>
                    <option value="community">Community</option>
                    <option value="events">Events</option>
                    <option value="partnerships">Partnerships</option>
                    <option value="announcements">Announcements</option>
                  </>
                )}
              </select>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                <Image className="w-4 h-4 inline mr-1" /> Featured Image
              </h3>
              <input type="file" accept="image/*" className="hidden" id="featured-image-upload"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    setFeaturedImage("uploading...");
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Math.random()}.${fileExt}`;
                    const filePath = `featured/${fileName}`;
                    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
                    if (uploadError) throw uploadError;
                    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
                    setFeaturedImage(publicUrl);
                  } catch (err) {
                    console.error("Error uploading image:", err);
                    alert("Failed to upload featured image.");
                    setFeaturedImage("");
                  }
                }} />
              {featuredImage === "uploading..." ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                  <p className="text-sm text-gray-600">Uploading...</p>
                </div>
              ) : featuredImage ? (
                <div className="relative">
                  <img src={featuredImage} alt="Featured" className="w-full rounded-lg" />
                  <button onClick={() => setFeaturedImage("")}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center shadow-md">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => document.getElementById("featured-image-upload")?.click()}>
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
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                placeholder="Enter tags (comma separated)..." />
              <p className="mt-2 text-xs text-gray-600">Example: education, impact, community</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
