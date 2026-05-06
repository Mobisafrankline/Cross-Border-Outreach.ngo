import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Users, Quote, ArrowRight, X, Sparkles, Globe, Target, Award, MapPin, Calendar, Share2, BookOpen } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";
import Rescue from "../../assets/3.jpeg";

interface Story {
  id: number;
  title: string;
  category: string;
  image: string;
  quote: string;
  impact: string;
  story: string;
  location?: string;
  date?: string;
  beneficiaries?: string;
}

const stories: Story[] = [
  {
    id: 1,
    title: "A Day of Hope at Murang'a Rescue Centre",
    category: "Education Support",
    image: Rescue,
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

export default function ImpactStories() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  useEffect(() => {
    if (selectedStory) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    }
  }, [selectedStory]);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero Section ── */}
      <section className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={Rescue}
            alt="Impact Stories"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 via-blue-900/80 to-blue-900" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Real Impact
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-2xl">
              Stories of <span className="text-blue-400">Transformation</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed font-medium mb-12">
              Every statistic represents a heartbeat. Explore the remarkable journeys of resilience, hope, and change happening across communities.
            </p>
          </motion.div>

          {/* Stats Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-4 max-w-3xl mx-auto"
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-black text-white">{stat.value}</div>
                  <div className="text-blue-200 font-bold text-[10px] uppercase tracking-widest">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Stories Grid ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              From the <span className="text-blue-600">Field</span>
            </h2>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full mb-6"></div>
            <p className="text-lg text-gray-500 leading-relaxed">
              Hear directly from the communities we serve. These stories capture moments of breakthrough, resilience, and lasting change.
            </p>
          </div>

          <div className="space-y-24">
            {stories.map((story, index) => {
              const isReversed = index % 2 === 1;
              return (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-16 items-center`}
                >
                  {/* Image Side */}
                  <div className="w-full lg:w-1/2 relative group">
                    <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-100">
                      <div className="aspect-[4/3] w-full">
                        <ImageWithFallback
                          src={story.image}
                          alt={story.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                        {/* Category + Location overlay */}
                        <div className="absolute top-6 left-6 flex gap-2">
                          <span className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                            {story.category}
                          </span>
                        </div>

                        <div className="absolute bottom-6 left-6 right-6">
                          {story.location && (
                            <div className="flex items-center gap-2 text-white/80 text-sm font-medium mb-2">
                              <MapPin className="w-4 h-4" />
                              {story.location}
                            </div>
                          )}
                          {story.beneficiaries && (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-xl text-white text-xs font-bold border border-white/20">
                              <Users className="w-3.5 h-3.5" />
                              {story.beneficiaries}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="w-full lg:w-1/2 space-y-6">
                    {story.date && (
                      <div className="flex items-center gap-2 text-gray-400 text-xs font-black uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5" />
                        {story.date}
                      </div>
                    )}

                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight tracking-tight">
                      {story.title}
                    </h2>

                    {/* Quote Block */}
                    <div className="bg-gray-50 border-l-4 border-blue-600 p-6 rounded-r-2xl relative">
                      <Quote className="absolute top-4 right-4 w-10 h-10 text-blue-100" />
                      <p className="text-lg text-gray-700 font-medium italic leading-relaxed relative z-10">
                        "{story.quote}"
                      </p>
                    </div>

                    <p className="text-gray-500 leading-relaxed text-lg">
                      {story.impact}
                    </p>

                    <button
                      onClick={() => setSelectedStory(story)}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl hover:-translate-y-1 transform duration-200 group"
                    >
                      Read Full Story
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 bg-blue-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] -ml-64 -mb-64" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] flex items-center justify-center mx-auto mb-10 rotate-3">
            <Heart className="w-10 h-10 text-white fill-white -rotate-3" />
          </div>

          <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
            Create the <br/>
            <span className="text-blue-400">Next Chapter</span>
          </h2>
          <p className="text-xl text-blue-100/80 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
            These stories are made possible by people like you. Your donation, time, and voice help turn survival into success.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/donate" className="w-full sm:w-auto px-10 py-5 bg-white text-blue-900 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all shadow-xl inline-flex items-center justify-center gap-3">
              Donate Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/volunteer" className="w-full sm:w-auto px-10 py-5 bg-blue-800 text-white border border-blue-700 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all inline-flex items-center justify-center gap-3">
              Volunteer With Us
            </Link>
          </div>
        </div>
      </section>

      {/* ── Full Story Modal ── */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedStory(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-5xl max-h-[95vh] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left: Image Column */}
              <div className="relative w-full lg:w-2/5 h-72 lg:h-auto shrink-0 overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={selectedStory.image}
                  alt={selectedStory.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/20" />

                {/* Close button */}
                <button
                  onClick={() => setSelectedStory(null)}
                  className="absolute top-6 right-6 p-2.5 bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 rounded-full text-white transition-all hover:rotate-90 duration-300 shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Image overlay content */}
                <div className="absolute bottom-6 left-6 right-6 lg:bottom-8 lg:left-8">
                  <span className="inline-block px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl mb-3">
                    {selectedStory.category}
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight drop-shadow-lg">
                    {selectedStory.title}
                  </h2>
                  {selectedStory.location && (
                    <div className="flex items-center gap-2 text-white/80 text-sm font-medium mt-2">
                      <MapPin className="w-4 h-4" />
                      {selectedStory.location}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Scrollable Content Column */}
              <div className="w-full lg:w-3/5 overflow-y-auto flex flex-col">
                {/* Stats strip */}
                <div className="bg-gray-50 border-b border-gray-100 px-8 py-5 flex flex-wrap gap-6 shrink-0">
                  {selectedStory.date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-bold text-gray-700">{selectedStory.date}</span>
                    </div>
                  )}
                  {selectedStory.beneficiaries && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-bold text-gray-700">{selectedStory.beneficiaries}</span>
                    </div>
                  )}
                  {selectedStory.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-bold text-gray-700">{selectedStory.location}</span>
                    </div>
                  )}
                </div>

                <div className="p-8 lg:p-10 flex-1">
                  {/* Quote highlight */}
                  <div className="bg-blue-50 rounded-2xl p-6 mb-8 relative overflow-hidden">
                    <Quote className="absolute top-4 right-4 w-16 h-16 text-blue-100" />
                    <div className="relative z-10">
                      <p className="text-xl text-blue-900 font-bold italic leading-relaxed mb-3">
                        "{selectedStory.quote}"
                      </p>
                      <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
                    </div>
                  </div>

                  {/* Impact highlight */}
                  <div className="flex items-start gap-4 mb-8 p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Key Impact</div>
                      <p className="text-sm text-emerald-800 font-medium leading-relaxed">{selectedStory.impact}</p>
                    </div>
                  </div>

                  {/* Full story text */}
                  <div className="mb-8">
                    <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      The Full Story
                    </h3>
                    <div className="text-gray-600 leading-relaxed space-y-5 text-[15px]">
                      {selectedStory.story.split('\n\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                      }}
                      className="flex items-center gap-2 px-5 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors border border-gray-100"
                    >
                      <Share2 className="w-4 h-4" />
                      Share Story
                    </button>
                    <Link
                      to="/donate"
                      onClick={() => setSelectedStory(null)}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
                    >
                      <Heart className="w-4 h-4" />
                      Support This Cause
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
