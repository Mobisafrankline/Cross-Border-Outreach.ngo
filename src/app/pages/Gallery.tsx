import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ZoomIn,
  Filter,
  Grid3x3,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Search,
  Camera,
  Users,
  Heart,
  Globe,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { assets } from "../../data/content";
import { supabase } from "../../lib/supabase";

type Category = "all" | "community" | "education" | "healthcare" | "food" | "economic";
type ViewMode = "grid" | "masonry";

// Category config with colours & icons
const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string; ring: string }> = {
  all: { label: "All Photos", color: "text-white", bg: "bg-blue-600", ring: "ring-blue-400" },
  community: { label: "Community", color: "text-emerald-700", bg: "bg-emerald-50", ring: "ring-emerald-400" },
  education: { label: "Education", color: "text-violet-700", bg: "bg-violet-50", ring: "ring-violet-400" },
  healthcare: { label: "Healthcare", color: "text-rose-700", bg: "bg-rose-50", ring: "ring-rose-400" },
  food: { label: "Food Support", color: "text-amber-700", bg: "bg-amber-50", ring: "ring-amber-400" },
  economic: { label: "Economic", color: "text-cyan-700", bg: "bg-cyan-50", ring: "ring-cyan-400" },
};

const CATEGORY_BADGE: Record<string, string> = {
  community: "bg-emerald-600",
  education: "bg-violet-600",
  healthcare: "bg-rose-600",
  food: "bg-amber-500",
  economic: "bg-cyan-600",
};

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("masonry");
  const [selectedImage, setSelectedImage] = useState<string | number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [dbImages, setDbImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setDbImages(data);
      }
      setLoading(false);
    };
    fetchImages();
  }, []);

  const combinedImages = [
    ...dbImages,
    ...assets.heroes.map((img) => ({ id: img.id, url: img.url, alt: img.title, category: "community" })),
    ...assets.programs.education.map((img) => ({ id: img.id, url: img.url, alt: img.title, category: "education" })),
    ...assets.programs.healthcare.map((img) => ({ id: img.id, url: img.url, alt: img.title, category: "healthcare" })),
    ...assets.programs.foodSupport.map((img) => ({ id: img.id, url: img.url, alt: img.title, category: "food" })),
    ...assets.programs.economic.map((img) => ({ id: img.id, url: img.url, alt: img.title, category: "economic" })),
    ...assets.team.map((img) => ({ id: img.id, url: img.url, alt: img.title, category: "community" })),
    ...assets.events.map((img) => ({ id: img.id, url: img.url, alt: img.title, category: "community" })),
  ];

  // Strictly deduplicate by image URL to remove any visual duplicates
  const allImages = combinedImages.filter(
    (img, index, self) => index === self.findIndex((i) => i.url === img.url)
  );

  const filteredImages = allImages
    .filter((img) => selectedCategory === "all" || img.category === selectedCategory)
    .filter((img) =>
      searchQuery.trim() === "" ||
      (img.alt || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (img.category || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

  const categories = (["all", "community", "education", "healthcare", "food", "economic"] as Category[]).map(
    (id) => ({
      id,
      ...CATEGORY_CONFIG[id],
      count: id === "all" ? allImages.length : allImages.filter((img) => img.category === id).length,
    })
  );

  // Lightbox helpers
  const selectedIndex = selectedImage !== null
    ? filteredImages.findIndex((img) => img.id === selectedImage)
    : -1;

  const goNext = useCallback(() => {
    if (selectedIndex < filteredImages.length - 1) setSelectedImage(filteredImages[selectedIndex + 1].id);
  }, [selectedIndex, filteredImages]);

  const goPrev = useCallback(() => {
    if (selectedIndex > 0) setSelectedImage(filteredImages[selectedIndex - 1].id);
  }, [selectedIndex, filteredImages]);

  const closeLightbox = () => setSelectedImage(null);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedImage, goNext, goPrev]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const currentImg = selectedImage !== null ? filteredImages.find((img) => img.id === selectedImage) : null;

  const stats = [
    { icon: Camera, label: "Photos", value: allImages.length + "+" },
    { icon: Users, label: "Communities", value: "12+" },
    { icon: Heart, label: "Lives Impacted", value: "3k+" },
    { icon: Globe, label: "Regions", value: "2+" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-blue-600 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute rounded-full opacity-30 blur-3xl"
            style={{ width: 600, height: 600, top: -200, right: -100, background: "radial-gradient(circle, #60a5fa, transparent)" }}
          />
          <div
            className="absolute rounded-full opacity-20 blur-3xl"
            style={{ width: 400, height: 400, bottom: -150, left: -50, background: "radial-gradient(circle, #93c5fd, transparent)" }}
          />
          {/* Floating dots grid */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{ width: 4, height: 4, opacity: 0.15, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
              animate={{ y: [0, -20, 0], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 4 }}
            />
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5 bg-white/20 text-white border border-white/20 backdrop-blur-sm shadow-sm">
              <Camera className="w-4 h-4" />
              Visual Stories of Impact
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-5 leading-tight text-white drop-shadow-sm">
              Our Gallery
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-blue-100">
              Explore powerful imagery capturing hope, transformation, and community impact across borders.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="rounded-2xl p-4 text-center bg-white/10 border border-white/20 backdrop-blur-md shadow-lg">
                  <Icon className="w-6 h-6 mx-auto mb-2 text-blue-200" />
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm mt-0.5 text-blue-100 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Controls ──────────────────────────────────────────────── */}
      <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search photos…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* Category pills – desktop */}
            <div className="hidden md:flex items-center gap-2 flex-wrap">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as Category)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 ring-2 ring-blue-600 ring-offset-2 ring-offset-white"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                  >
                    {cat.label}
                    <span className={`ml-1.5 text-xs ${isActive ? "text-blue-100" : "text-slate-400"}`}>({cat.count})</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>

            {/* View mode */}
            <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl p-1 ml-auto">
              {([["masonry", LayoutGrid], ["grid", Grid3x3]] as const).map(([mode, Icon]) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 rounded-lg transition-all ${viewMode === mode
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    }`}
                  title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} view`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Mobile filter dropdown */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden md:hidden"
              >
                <div className="flex flex-wrap gap-2 pt-4 pb-2 border-t border-slate-100 mt-4">
                  {categories.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.id as Category); setIsFilterOpen(false); }}
                        className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${isActive
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white text-slate-600 border border-slate-200"
                          }`}
                      >
                        {cat.label} ({cat.count})
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Gallery Grid ──────────────────────────────────────────── */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        {/* Result count */}
        <motion.div
          key={filteredImages.length}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mb-8"
        >
          <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
          <p className="text-slate-600 font-medium">
            Showing <span className="text-slate-900 font-bold">{filteredImages.length}</span> photos
            {selectedCategory !== "all" && (
              <> in <span className="text-blue-600 capitalize">{CATEGORY_CONFIG[selectedCategory].label}</span></>
            )}
            {searchQuery && (
              <> matching <span className="text-blue-600">"{searchQuery}"</span></>
            )}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        ) : (
        <motion.div
          layout
          className={
            viewMode === "masonry"
              ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          }
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer bg-slate-200 shadow-sm border border-slate-200 ${viewMode === "grid" ? "aspect-square" : "break-inside-avoid"}`}
                onClick={() => setSelectedImage(image.id)}
                whileHover={{ y: -6, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <ImageWithFallback
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 bg-slate-200 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-semibold text-base mb-3 leading-tight line-clamp-2 drop-shadow-md">{image.alt}</p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-bold capitalize shadow-sm ${CATEGORY_BADGE[image.category] ?? "bg-blue-600"}`}
                      >
                        {image.category}
                      </span>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white">
                        <ZoomIn className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        )}

        {/* Empty state */}
        {filteredImages.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm mt-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 bg-slate-100 text-slate-400">
              <ImageIcon className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No photos found</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">Try selecting a different category or adjusting your search term to find what you're looking for.</p>
            <button
              onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </section>

      {/* ── Lightbox ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedImage !== null && currentImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            style={{ background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(12px)" }}
            onClick={closeLightbox}
          >
            {/* Inner panel – stop propagation so clicks inside don't close */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-6xl w-full max-h-[95vh] flex flex-col bg-white rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Toolbar */}
              <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 z-10 shrink-0">
                <div className="flex-1 pr-4">
                  <p className="text-slate-900 font-bold text-base leading-tight truncate">{currentImg.alt}</p>
                  <span className={`mt-1.5 inline-block px-2.5 py-0.5 rounded-full text-white text-[10px] uppercase tracking-wider font-bold ${CATEGORY_BADGE[currentImg.category] ?? "bg-blue-600"}`}>
                    {currentImg.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <span className="text-sm font-medium text-slate-400 mr-2 hidden sm:inline-block">
                    {selectedIndex + 1} of {filteredImages.length}
                  </span>
                  <button
                    onClick={handleShare}
                    className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm font-semibold transition-all ${copied
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                      }`}
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">{copied ? "Copied Link!" : "Share"}</span>
                  </button>
                  <a
                    href={typeof currentImg.url === "string" ? currentImg.url : "#"}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Save Image</span>
                  </a>
                  <button
                    onClick={closeLightbox}
                    className="p-2 ml-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                    aria-label="Close"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Image area */}
              <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-slate-100/50 min-h-[300px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImg.id}
                    src={typeof currentImg.url === "string" ? currentImg.url : ""}
                    alt={currentImg.alt}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-full max-h-[65vh] md:max-h-[70vh] object-contain drop-shadow-lg"
                  />
                </AnimatePresence>

                {/* Navigation Arrows */}
                {selectedIndex > 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    className="absolute left-4 p-3 rounded-full bg-white/90 text-slate-800 shadow-lg hover:bg-white hover:scale-110 transition-all backdrop-blur-sm border border-slate-200"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}
                {selectedIndex < filteredImages.length - 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    className="absolute right-4 p-3 rounded-full bg-white/90 text-slate-800 shadow-lg hover:bg-white hover:scale-110 transition-all backdrop-blur-sm border border-slate-200"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}
              </div>

              {/* Filmstrip thumbnails */}
              <div className="flex gap-2.5 overflow-x-auto px-6 py-4 bg-white border-t border-slate-200 shrink-0 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                {filteredImages.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={(e) => { e.stopPropagation(); setSelectedImage(img.id); }}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden transition-all ${i === selectedIndex
                        ? "ring-2 ring-blue-600 ring-offset-2 opacity-100"
                        : "opacity-40 hover:opacity-100"
                      }`}
                  >
                    <img
                      src={typeof img.url === "string" ? img.url : ""}
                      alt={img.alt}
                      className="w-full h-full object-cover bg-slate-200"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CTA Banner ────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-white border-t border-slate-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center rounded-3xl p-10 sm:p-14 bg-blue-50 border border-blue-100 shadow-sm relative overflow-hidden"
        >
          {/* Decorative shapes for CTA */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-blue-100/50 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-blue-200/50 blur-2xl"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-6 text-blue-600">
              <Heart className="w-8 h-8 fill-blue-600/20" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Be Part of Our Story</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Every photo represents a life touched, a community strengthened, and a future brightened. Join our mission and help us create more stories worth telling.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/volunteer"
                className="px-8 py-3.5 rounded-xl font-bold text-blue-700 bg-white border border-blue-200 shadow-sm hover:bg-blue-50 hover:border-blue-300 transition-all text-center"
              >
                Volunteer With Us
              </a>
              <a
                href="/donate"
                className="px-8 py-3.5 rounded-xl font-bold text-white bg-blue-600 shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all text-center"
              >
                Donate Now
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}