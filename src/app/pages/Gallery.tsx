import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ZoomIn, Filter, Grid3x3, LayoutGrid, ChevronLeft, ChevronRight, Download, Share2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { galleryImages, assets } from "../../data/content";

type Category = "all" | "community" | "education" | "healthcare" | "food" | "economic";
type ViewMode = "grid" | "masonry";

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("masonry");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Combine all images from gallery and assets
  const combinedImages = [
    ...galleryImages,
    ...assets.heroes.map(img => ({ id: img.id, url: img.url, alt: img.title, category: "community" })),
    ...assets.programs.education.map(img => ({ id: img.id, url: img.url, alt: img.title, category: "education" })),
    ...assets.programs.healthcare.map(img => ({ id: img.id, url: img.url, alt: img.title, category: "healthcare" })),
    ...assets.programs.foodSupport.map(img => ({ id: img.id, url: img.url, alt: img.title, category: "food" })),
    ...assets.programs.economic.map(img => ({ id: img.id, url: img.url, alt: img.title, category: "economic" })),
    ...assets.team.map(img => ({ id: img.id, url: img.url, alt: img.title, category: "community" })),
    ...assets.events.map(img => ({ id: img.id, url: img.url, alt: img.title, category: "community" }))
  ];

  // Remove duplicates by 'id'
  const allImages = combinedImages.filter((img, index, self) =>
    index === self.findIndex(i => i.id === img.id)
  );

  // Filter images by selected category
  const filteredImages = selectedCategory === "all" 
    ? allImages 
    : allImages.filter(img => img.category === selectedCategory);

  const categories = [
    { id: "all", label: "All Photos", count: allImages.length },
    { id: "community", label: "Community", count: allImages.filter(img => img.category === "community").length },
    { id: "education", label: "Education", count: allImages.filter(img => img.category === "education").length },
    { id: "healthcare", label: "Healthcare", count: allImages.filter(img => img.category === "healthcare").length },
    { id: "food", label: "Food Support", count: allImages.filter(img => img.category === "food").length },
    { id: "economic", label: "Economic", count: allImages.filter(img => img.category === "economic").length }
  ];

  const selectedImageIndex = selectedImage !== null 
    ? filteredImages.findIndex(img => img.id === selectedImage) 
    : -1;

  const goToNextImage = () => {
    if (selectedImageIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[selectedImageIndex + 1].id);
    }
  };

  const goToPrevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImage(filteredImages[selectedImageIndex - 1].id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-blue-600 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-sm font-semibold mb-4">
              Visual Stories of Impact
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Gallery</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Explore our journey through powerful imagery capturing moments of hope, transformation, and community impact
            </p>
          </motion.div>
        </div>
      </section>

      {/* Controls Bar */}
      <section className="bg-white border-b border-gray-200 sticky top-32 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-3">
              <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors md:hidden">
                <Filter className="w-4 h-4" />
                Filter
              </button>

              <div className="hidden md:flex items-center gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as Category)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedCategory === cat.id ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                  >
                    {cat.label} <span className="text-xs opacity-70">({cat.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg border border-gray-200">
              <button onClick={() => setViewMode("masonry")} className={`p-2 rounded transition-colors ${viewMode === "masonry" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`} title="Masonry View">
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button onClick={() => setViewMode("grid")} className={`p-2 rounded transition-colors ${viewMode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`} title="Grid View">
                <Grid3x3 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Filter Dropdown */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden">
                <div className="flex flex-wrap gap-2 mt-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id as Category);
                        setIsFilterOpen(false);
                      }}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedCategory === cat.id ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300"}`}
                    >
                      {cat.label} ({cat.count})
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div layout className={viewMode === "masonry" ? "columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
            <AnimatePresence mode="popLayout">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className={`group relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow ${viewMode === "grid" ? "aspect-square" : "break-inside-avoid"}`}
                  onClick={() => setSelectedImage(image.id)}
                >
                  <ImageWithFallback src={image.url} alt={image.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-semibold text-sm mb-2">{image.alt}</p>
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-semibold capitalize">{image.category}</span>
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredImages.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No images found</h3>
              <p className="text-gray-500">Try selecting a different category</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox Modal & Stats Section remain unchanged... */}
    </div>
  );
}