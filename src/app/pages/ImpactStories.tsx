import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, MapPin, Share2, Calendar, Award, Heart, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { supabase } from "../../lib/supabase";
import Rescue from "../../assets/3.jpeg";
import MagazineLayout, { MagazineArticle } from "../components/MagazineLayout";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface Story {
  id: number | string;
  title: string;
  category: string;
  image: string;
  quote: string;
  impact: string;
  story: string;
  location?: string;
  date?: string;
  beneficiaries?: string;
  source: "static" | "supabase";
  author?: string;
}

const staticStories: Story[] = [
  {
    id: 1,
    source: "static",
    title: "A Day of Hope at Murang'a Rescue Centre",
    category: "Education Support",
    image: Rescue as string,
    quote: "I used to share one book with my friend. Now I can write my own notes.",
    impact: "Children at Murang'a Rescue Centre received learning materials and encouragement to support their education and future dreams.",
    location: "Murang'a County, Kenya",
    date: "February 28, 2026",
    beneficiaries: "200+ Children",
    story: `On 28th February 2026, the Crossborder Outreach team visited Murang'a Rescue Centre to support vulnerable children through the donation of learning materials and basic logistical support.
    
The visit brought joy, encouragement, and hope to the children. For many, receiving simple items like exercise books and pens meant a chance to learn with confidence.`,
    author: "Frankline Mobisa"
  },
  {
    id: 2,
    source: "static",
    title: "Easter Egg Hunt at Sienna Ridge",
    category: "Community Outreach",
    image: "/Easter Egg.jpeg",
    quote: "Every bit of support makes a massive difference for our family.",
    impact: "Provided essential resources and a bilingual Easter celebration to over 80 families in the Atlanta community.",
    location: "Atlanta, GA",
    date: "April 6, 2026",
    beneficiaries: "80+ Families",
    story: `On behalf of Cross-borders Outreach International, we shared the impact from our community outreach event held at Sienna Ridge Apartment Homes in Atlanta.`,
    author: "Ministry Team"
  },
  {
    id: 3,
    source: "static",
    title: "Spring Festival Community Support",
    category: "Community Outreach",
    image: "/Spring Festival.jpeg",
    quote: "People still care about one another.",
    impact: "A large-scale community festival supported by over 12 partner organizations, distributing high-value household items to 100 families.",
    location: "Atlanta, GA",
    date: "April 12, 2026",
    beneficiaries: "100 Families",
    story: `Following our Easter event, we hosted the Spring Festival at Sienna Ridge Apartment Homes in Atlanta. This was a large-scale community festival supported by over 12 partner organizations coming together to serve the community.`,
    author: "Ministry Team"
  },
  {
    id: 4,
    source: "static",
    title: "A New Life: Grace's Healthcare Miracle",
    category: "Healthcare",
    image: "https://images.unsplash.com/photo-1770221797840-8f5a095ad7ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMG91dHJlYWNofGVufDF8fHx8MTc3MTk5NjY5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    quote: "The mobile clinic saved my life. I had been sick for months but couldn't afford to travel to the hospital.",
    impact: "Grace received timely treatment for a treatable condition and now volunteers with the mobile clinic to help others.",
    location: "Rural Kenya",
    date: "2025",
    beneficiaries: "350+ Patients",
    story: `When our mobile health clinic reached Grace's village, she had been battling a chronic infection that had left her bedridden for months.`,
    author: "Dr. Michael"
  }
];

const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '');
};

function fromSupabase(row: any): Story {
  return {
    id: `sb-${row.id}`,
    source: "supabase",
    title: row.title ?? "",
    category: row.category ?? "Impact Story",
    image: row.featured_image ?? "",
    quote: row.excerpt ?? "",
    impact: row.content ? stripHtml(row.content).substring(0, 200) + "..." : row.excerpt ?? "",
    story: row.content ?? "",
    date: row.published_at ? new Date(row.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : undefined,
    author: row.author || "Staff"
  };
}

export default function ImpactStories() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [allStories, setAllStories] = useState<Story[]>(staticStories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("type", "story")
          .eq("status", "published")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setAllStories([...data.map(fromSupabase), ...staticStories]);
        }
      } catch (e) {
        console.error("Failed to fetch stories:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedStory ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedStory]);

  const currentIndex = selectedStory ? allStories.findIndex(s => s.id === selectedStory.id) : -1;
  const handlePrevious = () => {
    if (currentIndex > 0) setSelectedStory(allStories[currentIndex - 1]);
  };
  const handleNext = () => {
    if (currentIndex < allStories.length - 1) setSelectedStory(allStories[currentIndex + 1]);
  };

  const magazineArticles: MagazineArticle[] = allStories.map(story => ({
    id: story.id,
    title: story.title,
    excerpt: story.impact || story.quote || '',
    category: story.category,
    date: story.date || 'Recent',
    author: story.author || 'Staff',
    image: story.image,
    onClick: () => setSelectedStory(story)
  }));

  const categories = ["All", "Education Support", "Community Outreach", "Healthcare"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <MagazineLayout categories={categories} articles={magazineArticles} />

      {/* Story Modal View */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white overflow-y-auto"
          >
            {/* Back Button */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
              <div className="max-w-[800px] mx-auto px-4 md:px-6 py-4">
                <button
                  onClick={() => setSelectedStory(null)}
                  className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-700 font-semibold transition-colors text-sm"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Back to Impact Stories
                </button>
              </div>
            </div>

            <div className="max-w-[800px] mx-auto px-4 md:px-6 py-10 md:py-14">
              {/* Category & Date */}
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest">
                  {selectedStory.category}
                </span>
                {selectedStory.date && (
                  <span className="text-sm text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedStory.date}
                  </span>
                )}
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-slate-900 leading-[1.05] tracking-tight mb-6" style={{ fontWeight: 900, fontFamily: "'Playfair Display', Georgia, serif" }}>
                {selectedStory.title}
              </h1>

              {/* Lead / Excerpt */}
              {selectedStory.quote && (
                <p className="text-xl md:text-2xl text-slate-500 leading-relaxed mb-8" style={{ fontStyle: "italic", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  {selectedStory.quote}
                </p>
              )}

              {/* Author byline */}
              <div className="flex items-center justify-between py-5 border-y border-slate-200 mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-blue-700 flex items-center justify-center text-white text-base font-bold">
                    {selectedStory.author ? selectedStory.author.charAt(0).toUpperCase() : "C"}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{selectedStory.author || "Cross-Borders Outreach"}</div>
                    <div className="text-[11px] text-slate-400 uppercase tracking-widest font-medium">
                      Impact Stories · Cross-Borders Outreach
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedStory.location && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" /> {selectedStory.location}
                    </span>
                  )}
                  <button
                    onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }}
                    className="w-9 h-9 rounded-full border border-slate-200 hover:border-blue-400 flex items-center justify-center transition-colors text-slate-400 hover:text-blue-600"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Featured Image */}
              {selectedStory.image && (
                <div className="rounded-sm overflow-hidden shadow-md mb-10 border border-slate-100">
                  <ImageWithFallback
                    src={selectedStory.image}
                    alt={selectedStory.title}
                    className="w-full h-[280px] md:h-[460px] object-cover"
                  />
                </div>
              )}

              {/* Impact highlight */}
              {selectedStory.impact && selectedStory.impact !== selectedStory.quote && (
                <div className="flex gap-5 bg-emerald-50 border border-emerald-100 p-6 rounded-2xl mb-10">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Core Impact</div>
                    <p className="text-base text-emerald-800 font-semibold leading-relaxed">{selectedStory.impact}</p>
                  </div>
                </div>
              )}

              {/* Main Story Body */}
              <div
                className="prose prose-lg md:prose-xl max-w-none text-slate-700 leading-[1.85] prose-headings:font-black prose-headings:text-slate-900 prose-a:text-blue-600 hover:prose-a:underline prose-img:rounded-lg prose-p:mb-6 prose-blockquote:border-blue-700"
                style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
                dangerouslySetInnerHTML={{ __html: selectedStory.story }}
              />

              {/* Pagination Controls */}
              <div className="flex items-center justify-between border-t border-slate-200 py-10 mt-12">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex <= 0}
                  className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold uppercase tracking-widest text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors group"
                >
                  <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" /> Previous Story
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex >= allStories.length - 1}
                  className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold uppercase tracking-widest text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors group"
                >
                  Next Story <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Footer CTA */}
              <div className="pt-6 flex flex-col sm:flex-row items-center gap-4 border-t border-slate-100">
                <Link
                  to="/donate"
                  onClick={() => setSelectedStory(null)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/30"
                >
                  <Heart className="w-5 h-5 fill-white" /> Support This Cause
                </Link>
                <Link
                  to="/opportunities"
                  onClick={() => setSelectedStory(null)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-3 px-10 py-5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
                >
                  Volunteer With Us
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
