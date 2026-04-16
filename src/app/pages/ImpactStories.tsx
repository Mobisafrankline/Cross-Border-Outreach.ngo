import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Users, Quote, ArrowRight, X, Sparkles, Globe, Target } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import Rescue from "../../assets/3.jpeg";

interface Story {
  id: number;
  title: string;
  category: string;
  image: string;
  quote: string;
  impact: string;
  story: string;
}

const stories: Story[] = [
  {
    id: 1,
    title: "A Day of Hope at Murang’a Rescue Centre",
    category: "Education Support",
    image: Rescue,
    quote: "I used to share one book with my friend. Now I can write my own notes.",
    impact: "Children at Murang’a Rescue Centre received learning materials and encouragement to support their education and future dreams.",
    story: `On 28th February 2026, the Crossborder Outreach team visited Murang’a Rescue Centre to support vulnerable children through the donation of learning materials and basic logistical support.

The visit brought joy, encouragement, and hope to the children. For many, receiving simple items like exercise books and pens meant a chance to learn with confidence.

Through shared activities, conversations, and laughter, the team reminded the children that they are valued, supported, and not alone. By investing in these young minds, we are planting the seeds for a stronger, more educated community. Every child deserves the tools to write their own future, and this outreach is just the beginning of our commitment to accessible education for all.`
  },
  {
    id: 2,
    title: "Standing Together During the Nairobi Floods",
    category: "Disaster Response",
    image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1080&q=80",
    quote: "When the floods came, we thought we were alone. Seeing people come to help gave us hope again.",
    impact: "Community support efforts helped raise awareness, encourage preparedness, and stand with families affected by the devastating Nairobi floods.",
    story: `Heavy rains in Nairobi caused severe flooding that displaced families, damaged homes, and disrupted daily life across many neighborhoods.

During the crisis, communities came together to support one another, forming rescue chains, sharing resources, and helping stranded residents reach safety.

Crossborder Outreach used the moment to promote compassion, unity, and disaster preparedness, reminding communities that collective action and care can help rebuild hope even after disaster. Our rapid response teams worked tirelessly to distribute emergency supplies, clean water, and temporary shelter materials to those who lost everything.`
  },
  {
    id: 3,
    title: "Beyond Grades: Supporting Students’ Mental Health",
    category: "Mental Health",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1080&q=80",
    quote: "Sometimes students don’t fail because they are incapable, but because they are silently struggling.",
    impact: "Mental health awareness initiatives help students feel heard, supported, and empowered to succeed beyond academic pressure.",
    story: `Academic success is important, but mental wellbeing is just as critical for students. Many young people silently struggle with stress, anxiety, and overwhelming expectations. 

Crossborder Outreach advocates for safe spaces where students can speak openly and receive guidance without judgment or stigma.

Through mentorship, awareness campaigns, and community dialogue, the mission encourages families and institutions to care about emotional wellbeing as much as academic achievement. We partner with local schools to implement ongoing counseling programs and peer support networks.`
  },
  {
    id: 4,
    title: "A New Life: Grace's Healthcare Miracle",
    category: "Healthcare",
    image: "https://images.unsplash.com/photo-1770221797840-8f5a095ad7ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMG91dHJlYWNofGVufDF8fHx8MTc3MTk5NjY5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    quote: "The mobile clinic saved my life. I had been sick for months but couldn't afford to travel to the hospital.",
    impact: "Grace received timely treatment for a treatable condition and now volunteers with the mobile clinic to help others.",
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

  // Lock body scroll when modal is open
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Gradients & Effects */}
        <div className="absolute inset-0 bg-blue-600 bg-gradient-to-b from-blue-700 to-blue-500 z-0" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-400 opacity-30 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500 opacity-20 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold tracking-wide mb-6 bg-white/20 text-white border border-white/30 shadow-sm backdrop-blur-md uppercase">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Our Impact
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-md">
              Real Stories of <br className="hidden md:block" />
              <span className="text-blue-100">Transformation</span>
            </h1>
            <p className="text-xl text-blue-50 max-w-2xl mx-auto leading-relaxed mb-12 opacity-90 font-medium">
              Every statistic represents a heartbeat. Explore the remarkable journeys of resilience, hope, and change happening across communities.
            </p>
          </motion.div>

          {/* Quick Stats Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center transform hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-blue-100 font-medium text-sm uppercase tracking-wider">{stat.label}</p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Stories Section ─────────────────────────────────────── */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-32">
            {stories.map((story, index) => {
              const isReversed = index % 2 === 1;
              return (
                <div key={story.id} className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}>

                  {/* Image Side */}
                  <motion.div
                    initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="w-full lg:w-1/2 relative group"
                  >
                    <div className="absolute inset-0 bg-blue-600 rounded-3xl transform rotate-3 scale-[1.02] opacity-10 group-hover:rotate-6 transition-transform duration-500" />
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 border-8 border-white">
                      <div className="aspect-[4/3] w-full relative">
                        <ImageWithFallback
                          src={story.image}
                          alt={story.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                          <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md mb-2">
                            {story.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Content Side */}
                  <motion.div
                    initial={{ opacity: 0, x: isReversed ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                    className="w-full lg:w-1/2 space-y-8"
                  >
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                        {story.title}
                      </h2>

                      {/* Quote Block */}
                      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-2xl relative mb-6">
                        <Quote className="absolute top-4 right-4 w-12 h-12 text-blue-200 opacity-50" />
                        <p className="text-lg md:text-xl text-blue-900 font-medium italic relative z-10">
                          "{story.quote}"
                        </p>
                      </div>

                      <p className="text-lg text-slate-600 leading-relaxed">
                        {story.impact}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedStory(story)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold border-2 border-blue-100 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm group"
                    >
                      Read Full Story
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 border-t border-slate-200 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-50" />
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-12 md:p-16 rounded-[2.5rem] shadow-xl border border-slate-100 relative"
          >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
              <div className="w-20 h-20 bg-blue-600 rounded-2xl rotate-12 flex items-center justify-center shadow-xl">
                <Heart className="w-10 h-10 text-white -rotate-12 fill-white" />
              </div>
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-6 mb-6">Create the Next Chapter</h2>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              These stories are made possible by people like you. Your donation, time, and voice help turn survival into success.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/donate" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-xl hover:-translate-y-1 transform duration-200">
                Donate Now
              </a>
              <a href="/volunteer" className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-100 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-sm">
                Volunteer With Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Story Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-900/80 backdrop-blur-sm"
            onClick={() => setSelectedStory(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header Image */}
              <div className="relative h-64 md:h-80 shrink-0">
                <ImageWithFallback
                  src={selectedStory.image}
                  alt={selectedStory.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                <button
                  onClick={() => setSelectedStory(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-3 shadow-md">
                    {selectedStory.category}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-md">
                    {selectedStory.title}
                  </h2>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 md:p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
                <div className="max-w-2xl mx-auto">
                  <div className="mb-8">
                    <Quote className="w-10 h-10 text-blue-200 mb-4" />
                    <p className="text-xl md:text-2xl text-blue-900 font-medium italic leading-relaxed">
                      "{selectedStory.quote}"
                    </p>
                  </div>

                  <div className="prose prose-lg prose-blue max-w-none text-slate-700">
                    {selectedStory.story.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="mb-6 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="mt-12 pt-8 border-t border-slate-200 text-center">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Share this story</p>
                    <div className="flex justify-center gap-4">
                      {/* Placeholder for social sharing buttons if needed */}
                      <button className="px-6 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                        Copy Link
                      </button>
                    </div>
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
