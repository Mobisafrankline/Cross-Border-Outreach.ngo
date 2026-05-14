import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart, Users, Quote, ArrowRight, X, Sparkles, Globe, Target,
  Award, MapPin, Calendar, Share2, BookOpen, Loader2
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";
import { supabase } from "../../lib/supabase";
import Rescue from "../../assets/3.jpeg";
import "../../styles/impact.css";

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

The visit brought joy, encouragement, and hope to the children. For many, receiving simple items like exercise books and pens meant a chance to learn with confidence.

Through shared activities, conversations, and laughter, the team reminded the children that they are valued, supported, and not alone. By investing in these young minds, we are planting the seeds for a stronger, more educated community. Every child deserves the tools to write their own future, and this outreach is just the beginning of our commitment to accessible education for all.`
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
    story: `On behalf of Cross-Borders Outreach Ministry, we shared the impact from our community outreach event held at Sienna Ridge Apartment Homes in Atlanta. Thanks to incredible logistical support from Operation Compassion and generous donations from Amazon, we provided essential resources and joy to over 80 families.

The event was a vibrant bilingual celebration featuring a full Easter egg hunt, games, and live entertainment. We distributed hundreds of Easter baskets, toys, candy, hygiene products, and household essentials.

The Amazon-donated products reaching these families represented more than just physical goods; they provided dignity and solidarity. One single mother noted that every bit of support makes a massive difference for her family. These events not only meet immediate physical needs but also empower our youth volunteers and foster deep connections within the multicultural Atlanta community.`
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
    story: `Following our Easter event, we hosted the Spring Festival at Sienna Ridge Apartment Homes in Atlanta. This was a large-scale community festival supported by over 12 partner organizations coming together to serve the community.

During this event, we distributed high-value household items including humidifiers, air purifiers, kitchen appliances, heaters, and baby supplies to 100 families. The impact of these donations goes far beyond the items themselves.

A senior resident shared that the event reminded them that "people still care about one another". Your role in facilitating the connection between Amazon and our ministry is invaluable. We are already looking ahead to future outreach opportunities and look forward to our continued work together to build a stronger, more compassionate community.`
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
    story: `When our mobile health clinic reached Grace's village, she had been battling a chronic infection that had left her bedridden for months. The nearest hospital was a two-day journey away, an impossible distance for her family.

Our medical team provided immediate diagnosis and a comprehensive treatment plan, completely free of charge. Within weeks, Grace's health was fully restored.

Today, Grace is not just a survivor; she is a cornerstone of our outreach efforts in her region. She volunteers as a community health advocate, helping direct our mobile clinics to the most vulnerable families and proving that healed individuals go on to heal communities.`
  }
];

const stats = [
  { icon: Users, label: "Lives Touched", value: "3,000+" },
  { icon: Globe, label: "Communities", value: "42" },
  { icon: Target, label: "Active Programs", value: "8" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromSupabase(row: any): Story {
  return {
    id: `sb-${row.id}`,
    source: "supabase",
    title: row.title ?? "",
    category: row.category ?? "Impact Story",
    image: row.featured_image ?? "",
    quote: row.excerpt ?? "",
    impact: row.content
      ? row.content.split("\n").filter((l: string) => l.trim()).slice(0, 1).join("").substring(0, 200) + "..."
      : row.excerpt ?? "",
    story: row.content ?? "",
    location: undefined,
    date: row.published_at
      ? new Date(row.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : row.created_at
      ? new Date(row.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : undefined,
    beneficiaries: row.tags?.length ? row.tags.join(", ") : undefined,
  };
}

export default function ImpactStories() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [liveStories, setLiveStories] = useState<Story[]>([]);
  const [loadingStories, setLoadingStories] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("type", "story")
          .eq("status", "published")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setLiveStories(data.map(fromSupabase));
        }
      } catch (e) {
        console.error("Failed to fetch stories:", e);
      } finally {
        setLoadingStories(false);
      }
    };
    fetchStories();
  }, []);

  const allStories: Story[] = [...liveStories, ...staticStories];

  useEffect(() => {
    document.body.style.overflow = selectedStory ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedStory]);

  return (
    <div className="min-h-screen bg-white">

      {/* â”€â”€ Hero Section â”€â”€ */}
      <section className="impact-hero">
        <div className="impact-hero-bg">
          <ImageWithFallback src={Rescue as string} alt="Impact Stories" className="w-full h-full object-cover" />
          <div className="impact-hero-overlay" />
        </div>

        <div className="impact-hero-content">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="impact-badge">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Real Impact
            </div>
            <h1 className="impact-title">
              Stories of <span>Transformation</span>
            </h1>
            <p className="impact-subtitle">
              Every statistic represents a heartbeat. Explore the remarkable journeys of resilience, hope, and change happening across communities.
            </p>
          </motion.div>

          {/* Stats Strip */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="impact-stats-grid">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="impact-stat-card">
                  <div className="impact-stat-icon">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="impact-stat-value">{stat.value}</div>
                  <div className="impact-stat-label">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Stories Grid ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="impact-badge mx-auto" style={{ marginBottom: '16px' }}>Voices from the Field</div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
              Real Stories. <span className="text-blue-600">Real Change.</span>
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed font-medium max-w-2xl mx-auto">
              These narratives capture moments of breakthrough, resilience, and lasting change in the communities we serve.
            </p>
          </div>

          {loadingStories ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {allStories.map((story, index) => (
                <motion.div key={String(story.id)}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`group relative rounded-3xl overflow-hidden cursor-pointer ${index === 0 ? "md:col-span-2 h-[500px]" : "h-[420px]"}`}
                  onClick={() => setSelectedStory(story)}>
                  
                  {/* Background Image */}
                  <ImageWithFallback src={story.image} alt={story.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                  {/* Tags */}
                  <div className="absolute top-6 left-6 flex gap-2 z-10">
                    <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      {story.category}
                    </span>
                    {story.source === "supabase" && (
                      <span className="px-3 py-1.5 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">New</span>
                    )}
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                    {story.date && (
                      <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest mb-3">
                        <Calendar className="w-3.5 h-3.5" /> {story.date}
                      </div>
                    )}
                    <h3 className={`font-black text-white leading-tight tracking-tight mb-4 ${index === 0 ? "text-3xl md:text-4xl" : "text-2xl"}`}>
                      {story.title}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed mb-5 line-clamp-2 max-w-xl">
                      {story.impact}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-white/60 text-xs font-bold">
                        {story.location && (
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-blue-400" /> {story.location}</span>
                        )}
                        {story.beneficiaries && (
                          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full border border-white/10">
                            <Users className="w-3.5 h-3.5 text-blue-400" /> {story.beneficiaries}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-white text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Read Story <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Hover glow */}
                  <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-3xl transition-all duration-500 pointer-events-none" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -mr-80 -mt-80" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[100px] -ml-80 -mb-80" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 rotate-6 shadow-2xl">
            <Heart className="w-12 h-12 text-white fill-white -rotate-6" />
          </div>
          <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
            Create the Next <br /> <span className="text-blue-500">Chapter</span>
          </h2>
          <p className="text-2xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto font-medium opacity-90">
            These stories are made possible by people like you. Your donation, time, and voice help turn survival into success.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/donate" className="w-full sm:w-auto px-12 py-6 bg-blue-600 text-white rounded-3xl font-black text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/40 inline-flex items-center justify-center gap-3">
              Donate Now <ArrowRight className="w-6 h-6" />
            </Link>
            <Link to="/volunteer" className="w-full sm:w-auto px-12 py-6 bg-slate-800 text-white border border-slate-700 rounded-3xl font-black text-xl hover:bg-slate-700 transition-all inline-flex items-center justify-center gap-3">
              Volunteer
            </Link>
          </div>
        </div>
      </section>

      {/* â”€â”€ Full Story Modal â”€â”€ */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl" onClick={() => setSelectedStory(null)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 35, stiffness: 300 }}
              className="absolute inset-0 bg-white overflow-y-auto"
              onClick={(e) => e.stopPropagation()}>

              {/* ── Sticky Close Button ── */}
              <button onClick={() => setSelectedStory(null)}
                className="fixed top-6 right-6 z-50 w-12 h-12 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all hover:scale-110 shadow-lg">
                <X className="w-6 h-6" />
              </button>

              {/* ── Full-Width Hero Image ── */}
              <div className="relative h-[50vh] md:h-[65vh] overflow-hidden">
                <ImageWithFallback src={selectedStory.image} alt={selectedStory.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap gap-3 mb-6">
                      <span className="px-5 py-2 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                        {selectedStory.category}
                      </span>
                      {selectedStory.source === "supabase" && (
                        <span className="px-4 py-2 bg-emerald-500 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                          New
                        </span>
                      )}
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6 drop-shadow-2xl">
                      {selectedStory.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm font-bold">
                      {selectedStory.date && (
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-400" /> {selectedStory.date}</span>
                      )}
                      {selectedStory.location && (
                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-400" /> {selectedStory.location}</span>
                      )}
                      {selectedStory.beneficiaries && (
                        <span className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                          <Users className="w-4 h-4 text-blue-400" /> {selectedStory.beneficiaries}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Content Body ── */}
              <div className="max-w-4xl mx-auto px-6 md:px-8 py-16 md:py-20">

                {/* Quote Block */}
                <div className="relative bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-100 rounded-3xl p-8 md:p-12 mb-16 overflow-hidden">
                  <Quote className="absolute -top-2 -right-2 w-32 h-32 text-blue-200/20 rotate-12" />
                  <div className="relative z-10">
                    <p className="text-2xl md:text-3xl font-bold text-slate-800 italic leading-relaxed mb-6">
                      "{selectedStory.quote}"
                    </p>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
                  </div>
                </div>

                {/* Impact Highlight */}
                {selectedStory.impact !== selectedStory.quote && (
                  <div className="flex gap-6 bg-emerald-50 border border-emerald-100 p-8 rounded-3xl mb-16">
                    <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-emerald-500/30">
                      <Award className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2">Core Impact</div>
                      <p className="text-lg text-emerald-800 font-semibold leading-relaxed">{selectedStory.impact}</p>
                    </div>
                  </div>
                )}

                {/* The Full Story */}
                <div className="mb-16">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">The Full Story</h2>
                  </div>
                  <div className="text-lg text-slate-600 leading-[1.9] space-y-8">
                    {selectedStory.story.split("\n\n").map((paragraph, i) => (
                      paragraph.trim() ? (
                        <p key={i} className={i === 0 ? "text-xl text-slate-700 font-medium first-letter:text-5xl first-letter:font-black first-letter:text-blue-600 first-letter:float-left first-letter:mr-3 first-letter:leading-none" : ""}
                          dangerouslySetInnerHTML={{ __html: paragraph }} />
                      ) : null
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-10 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <button onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }}
                    className="flex items-center gap-3 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                    <Share2 className="w-5 h-5" /> Share This Story
                  </button>
                  <Link to="/donate" onClick={() => setSelectedStory(null)}
                    className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-blue-600/30">
                    <Heart className="w-5 h-5 fill-white" /> Support This Cause
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
