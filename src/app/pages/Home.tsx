import {
  Heart, ArrowRight, CheckCircle2, Quote, Calendar,
  MapPin, Users, Globe2, HandHeart, ChevronRight, Sparkles,
} from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { supabase } from "../../lib/supabase";
import { galleryImages, events } from "../../data/content";
import { useTranslation } from "react-i18next";
import heroImage from "../../assets/hero.jpeg";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/ui/carousel";
import "../../styles/home.css";
import { useCallback, useEffect, useRef, useState } from "react";

/* ── Hooks ─────────────────────────────────────────────────────────────── */

function useCountUp(target: number, duration = 2000, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, trigger]);
  return count;
}

/** Intersection-observer hook for scroll-reveal */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

/* ── Rotating hero text ────────────────────────────────────────────────── */

const heroRotatingPhrases = [
  "Feeding Communities",
  "Empowering Youth",
  "Healing Families",
  "Building Futures",
  "Crossing Borders",
];

function RotatingText() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % heroRotatingPhrases.length);
        setFade(true);
      }, 350);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      style={{
        display: "inline-block",
        transition: "opacity 0.35s ease, transform 0.35s ease",
        opacity: fade ? 1 : 0,
        transform: fade ? "translateY(0)" : "translateY(12px)",
        color: "#0959d6",
      }}
    >
      {heroRotatingPhrases[index]}
    </span>
  );
}

/* ── Stat Card ─────────────────────────────────────────────────────────── */

function StatCard({ value, suffix = '', label, icon, trigger }: {
  value: number; suffix?: string; label: string; icon: React.ReactNode; trigger: boolean;
}) {
  const count = useCountUp(value, 2000, trigger);
  return (
    <div className="home-stat-card">
      <div className="home-stat-icon">{icon}</div>
      <div className="home-stat-number">{count.toLocaleString()}{suffix}</div>
      <div className="home-stat-label">{label}</div>
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────────────────── */

export default function Home() {
  const { t } = useTranslation();
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [recentNews, setRecentNews] = useState<any[]>([]);

  // Scroll-reveal refs
  const programsReveal = useReveal<HTMLDivElement>();
  const eventsReveal = useReveal<HTMLDivElement>();
  const whyReveal = useReveal<HTMLDivElement>();
  const testimonialsReveal = useReveal<HTMLDivElement>();

  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const { data: eventsData } = await supabase
          .from("articles")
          .select("*")
          .eq("type", "events")
          .eq("status", "published");

        const now = new Date();

        const mappedSupabaseEvents = (eventsData || []).map(d => {
          const eventDate = d.event_date ? new Date(d.event_date) : new Date();
          return {
            ...d,
            computedDate: eventDate.getTime(),
            computedStatus: eventDate < now ? "past" : "upcoming"
          };
        });

        const mappedStaticEvents = events.map(e => {
          const eventDate = e.date && e.date !== "TBD" ? new Date(e.date) : new Date();
          return {
            ...e,
            computedDate: eventDate.getTime(),
            computedStatus: eventDate < now ? "past" : "upcoming"
          };
        });

        const allEvents = [...mappedSupabaseEvents, ...mappedStaticEvents];

        const upcoming = allEvents.filter(e => e.computedStatus === "upcoming").sort((a, b) => a.computedDate - b.computedDate);
        const past = allEvents.filter(e => e.computedStatus === "past").sort((a, b) => b.computedDate - a.computedDate);

        const sortedEvents = [...upcoming, ...past].slice(0, 3);
        setRecentEvents(sortedEvents);

        // Fetch News
        const { data: newsData, error: newsError } = await supabase
          .from("articles")
          .select("*")
          .eq("type", "news")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(3);

        let combinedNews: any[] = [];
        if (!newsError && newsData && newsData.length > 0) {
          combinedNews = newsData.map(d => ({
            id: d.id,
            title: d.title,
            excerpt: d.excerpt || d.content?.substring(0, 100) + '...' || '',
            category: d.category || 'Announcement',
            date: d.published_at ? new Date(d.published_at).toLocaleDateString() : 'Recent',
            image: d.featured_image || d.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
          }));
        }
        setRecentNews(combinedNews);
      } catch (err) {
        console.error("Error fetching home content:", err);
      }
    };

    fetchHomeContent();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const programs = [
    { title: t('programs.foodSupport'), description: t('programs.foodDesc'), image: 'https://images.unsplash.com/photo-1710092784814-4a6f158913b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', link: '/food-support', color: '#ea580c', tag: 'Nutrition' },
    { title: t('programs.education'), description: t('programs.educationDesc'), image: 'https://images.unsplash.com/photo-1770843093640-c44ae557928b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', link: '/education', color: '#f59e0b', tag: 'Education' },
    { title: t('programs.healthcare'), description: t('programs.healthcareDesc'), image: 'https://images.unsplash.com/photo-1770221797840-8f5a095ad7ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', link: '/healthcare', color: '#e11d48', tag: 'Healthcare' },
    { title: t('programs.economic'), description: t('programs.economicDesc'), image: 'https://images.unsplash.com/photo-1752650736246-abae155278be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', link: '/economic', color: '#d97706', tag: 'Empowerment' },
    { title: t('programs.helpingFamilies'), description: t('programs.helpingFamiliesDesc'), image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', link: '/helping-families', color: '#f43f5e', tag: 'Family Welfare' },
  ];

  const testimonials = [
    { quote: 'Cross-borders Outreach International transformed our community. My children now have access to quality education and proper nutrition.', author: 'Maria Santos', role: 'Community Member', avatar: 'MS', color: '#1e3a8a' },
    { quote: "The healthcare outreach program saved my mother's life. We are forever grateful for their dedication and compassion.", author: 'James Okonkwo', role: 'Beneficiary Family', avatar: 'JO', color: '#2563eb' },
    { quote: 'Through their economic empowerment program, I started my own business and now support my entire family.', author: 'Fatima Ahmed', role: 'Small Business Owner', avatar: 'FA', color: '#f97316' },
  ];



  /** Format a date into month abbreviation + day */
  const formatDateParts = useCallback((dateInput: string | Date) => {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return { month: '---', day: '--' };
    return {
      month: d.toLocaleString('en', { month: 'short' }).toUpperCase(),
      day: String(d.getDate()),
    };
  }, []);

  return (
    <div className="min-h-screen">

      {/* ── MODERN BENTO HERO ── */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 z-0 bg-white">
          <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full bg-blue-50/60 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-slate-100/80 blur-[80px] pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left: Text Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white shadow-sm border border-slate-200 text-blue-900 font-medium text-sm mb-8 animate-[fade-in-up_0.8s_ease-out]">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
                </span>
                <span className="tracking-wide uppercase text-xs font-bold text-slate-500 mr-1">Currently:</span>
                <span className="font-semibold text-blue-900"><RotatingText /></span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1] animate-[fade-in-up_1s_ease-out]">
                {t('home.heroTitle')}
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-600 mb-10 leading-relaxed animate-[fade-in-up_1.2s_ease-out] max-w-xl">
                {t('home.heroSubtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-[fade-in-up_1.4s_ease-out]">
                <Link 
                  to="/donate" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  {t('nav.donateNow')}
                </Link>
                <Link 
                  to="/opportunities" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-bold border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                >
                  {t('home.getInvolved')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Right: Bento Image Grid Component */}
            <div className="relative animate-[fade-in-up_1.2s_ease-out] hidden lg:block">
              <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[600px]">
                {/* Main large image */}
                <div className="row-span-2 relative rounded-3xl overflow-hidden shadow-xl ring-1 ring-slate-200">
                  <ImageWithFallback src={heroImage} alt="Main" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
                {/* Top right smaller image */}
                <div className="relative rounded-3xl overflow-hidden shadow-lg ring-1 ring-slate-200">
                  <ImageWithFallback src={galleryImages[1]?.url} alt="Support" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
                </div>
                {/* Bottom right smaller image */}
                <div className="relative rounded-3xl overflow-hidden shadow-lg ring-1 ring-slate-200">
                  <ImageWithFallback src={galleryImages[2]?.url} alt="Community" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </div>
            </div>
            
            {/* Mobile Fallback Single Image */}
            <div className="relative animate-[fade-in-up_1.2s_ease-out] lg:hidden">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl ring-1 ring-slate-200">
                <ImageWithFallback src={heroImage} alt="Vulnerable communities" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="home-stats-section" ref={statsRef}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="home-stats-grid">
            <StatCard value={8455} suffix="+" label={t('stats.livesImpacted')} icon={<Users className="w-6 h-6" />} trigger={statsVisible} />
            <StatCard value={150} suffix="+" label="Active Volunteers" icon={<HandHeart className="w-6 h-6" />} trigger={statsVisible} />
            <StatCard value={5} label={t('stats.corePrograms')} icon={<CheckCircle2 className="w-6 h-6" />} trigger={statsVisible} />
            <StatCard value={2} label={t('stats.countriesReached')} icon={<Globe2 className="w-6 h-6" />} trigger={statsVisible} />
          </div>
        </div>
      </section>

      {/* ── GALLERY CAROUSEL ── */}
      <section className="home-carousel-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="home-section-header">
            <div className="home-section-label">See Our Impact</div>
            <h2 className="home-section-title font-playfair">In Action Across Communities</h2>
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 pb-12">
          <div className="home-accordion-gallery">
            {galleryImages.slice(0, 5).map((image, idx) => (
              <div key={image.id || idx} className="home-accordion-item group">
                <ImageWithFallback src={image.url} alt={image.alt} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="home-accordion-overlay" />
                <div className="home-accordion-number">0{idx + 1}</div>
                <div className="home-accordion-content">
                  <div className="home-accordion-title font-playfair">{image.alt || 'Community Impact'}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <Link to="/gallery" className="home-view-all-link text-lg font-bold flex items-center">
              Explore Our Full Gallery <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PROGRAMS ── */}
      <section className="home-programs-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div ref={programsReveal.ref} className={`home-section-header home-reveal ${programsReveal.visible ? 'visible' : ''}`}>
            <div className="home-section-label">What We Do</div>
            <h2 className="home-section-title font-playfair">Our Core Programs</h2>
            <p className="home-section-subtitle">We create sustainable change through five core programs designed to address the most critical needs in underserved communities.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-16">
            {programs.map((program, index) => (
              <div key={index} className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] group">
                <Link to={program.link} className="flex flex-col h-full rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(15,23,42,0.08)] hover:shadow-[0_20px_50px_rgba(15,23,42,0.2)] transition-all duration-500 hover:-translate-y-2 border border-transparent">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                    <ImageWithFallback src={program.image} alt={program.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* Tag overlaid on image */}
                    <div className="absolute top-4 right-4 px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm" style={{ color: program.color }}>
                      {program.tag}
                    </div>
                  </div>
                  {/* Solid colored content area */}
                  <div className="p-8 flex flex-col flex-1 relative transition-colors duration-500" style={{ backgroundColor: program.color }}>
                    <h3 className="text-2xl font-playfair font-bold text-white mb-4 leading-tight drop-shadow-sm">
                      {program.title}
                    </h3>
                    <p className="text-sm text-white/90 leading-relaxed mb-8 flex-1 drop-shadow-sm">
                      {program.description}
                    </p>
                    <div className="inline-flex items-center text-xs font-bold tracking-widest uppercase transition-transform group-hover:translate-x-1 mt-auto text-white drop-shadow-sm">
                      {t('programs.learnMore')} <ArrowRight className="w-4 h-4 ml-1.5" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="home-cta-banner">
        <div className="home-cta-inner">
          <div className="home-cta-text">
            <h2 className="home-cta-title font-playfair">Ready to Make a Difference?</h2>
            <p className="home-cta-sub">Every contribution transforms a life. Join thousands of supporters making real change across borders.</p>
          </div>
          <div className="home-cta-actions">
            <Link to="/donate" className="home-cta-btn-primary"><Heart className="w-5 h-5 fill-white" />Donate Now</Link>
            <Link to="/partner" className="home-cta-btn-secondary text-[#111827]">Become a Partner<ArrowRight className="w-5 h-5" /></Link>
          </div>
        </div>
      </section>

      {/* ── EVENTS ── */}
      <section className="home-events-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div ref={eventsReveal.ref} className={`home-section-header-row home-reveal ${eventsReveal.visible ? 'visible' : ''}`}>
            <div>
              <div className="home-section-label">Recent Activities</div>
              <h2 className="home-section-title-left font-playfair">Events &amp; Outreach</h2>
            </div>
            <Link to="/events" className="home-view-all-link">View All Events <ChevronRight className="w-4 h-4" /></Link>
          </div>
          <div className="home-events-grid">
            {recentEvents.map((event) => {
              const eventDate = event.event_date ? new Date(event.event_date) : new Date(event.date || Date.now());
              const isPast = eventDate < new Date();
              const { month, day } = formatDateParts(eventDate);
              return (
                <Link to={event.type === 'events' ? `/events/sb-${event.id}` : `/events/${event.id}`} key={event.id} className="home-event-card group">
                  <div className="home-event-img-wrap">
                    <ImageWithFallback src={event.featured_image || event.image || ''} alt={event.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="home-event-status">{isPast ? 'Past Event' : 'Upcoming'}</div>
                    {/* Calendar-style date badge */}
                    <div className="home-event-date-badge">
                      <span className="home-event-date-month">{month}</span>
                      <span className="home-event-date-day">{day}</span>
                    </div>
                  </div>
                  <div className="home-event-body">
                    <div className="home-event-meta">
                      <span className="home-event-category">{event.category || 'General'}</span>
                      {event.ticketPrice && <span className="home-event-price">{event.ticketPrice}</span>}
                    </div>
                    <h3 className="home-event-title font-playfair">{event.title}</h3>
                    <div className="home-event-info">
                      <span><Calendar className="w-4 h-4" />{event.event_date ? eventDate.toLocaleDateString() : event.date || 'TBD'}</span>
                      <span><MapPin className="w-4 h-4" />{event.event_location || event.location || 'TBD'}</span>
                    </div>
                    <p className="home-event-desc">{event.excerpt || event.description || (event.content ? event.content.substring(0, 100) + '...' : '')}</p>
                    <div className="home-event-cta">View Details<ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── LATEST NEWS ── */}
      {recentNews.length > 0 && (
        <section className="bg-slate-50 py-24 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
              <div>
                <div className="home-section-label">Stay Informed</div>
                <h2 className="home-section-title-left font-playfair">Latest News</h2>
              </div>
              <Link to="/company-news" className="home-view-all-link">
                View All News <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentNews.map((newsItem) => (
                <div key={newsItem.id} className="bg-white rounded-3xl overflow-hidden flex flex-col h-full group hover:-translate-y-2 transition-all duration-500 shadow-sm border border-transparent hover:border-blue-100 hover:shadow-2xl">
                  <div className="relative h-64 w-full overflow-hidden">
                    <ImageWithFallback src={newsItem.image} alt={newsItem.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1.5 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg backdrop-blur-md bg-[#0959d6]/90 border border-white/20">
                        {newsItem.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1 relative bg-white">
                    <div className="flex items-center gap-2 text-xs font-bold mb-4 text-slate-500 uppercase tracking-widest">
                      <Calendar className="w-4 h-4 text-[#0959d6]" />
                      {newsItem.date}
                    </div>
                    <h3 className="text-2xl font-bold leading-tight mb-4 transition-colors font-playfair text-gray-900 group-hover:text-[#0959d6]">
                      {newsItem.title}
                    </h3>
                    <p className="text-base leading-relaxed line-clamp-3 mb-8 flex-1 text-slate-600">
                      {newsItem.excerpt}
                    </p>
                    <div className="mt-auto">
                      <Link to={`/company-news/${newsItem.id}`} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#111827] group-hover:text-[#0959d6] transition-colors">
                        Read Article <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY PARTNER ── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={whyReveal.ref} className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center home-reveal ${whyReveal.visible ? 'visible' : ''}`}>
            
            {/* Image Side */}
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-slate-100">
                <ImageWithFallback src="https://images.unsplash.com/photo-1585984968562-1443b72fb0dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="Our team" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              {/* Glassmorphism Floating Badge */}
              <div className="absolute -bottom-8 -right-8 sm:-bottom-12 sm:-right-12 bg-white/80 backdrop-blur-xl border border-white p-6 sm:p-8 rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.1)] flex items-center gap-6 z-10 animate-[bounce_8s_infinite]">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0959d6] to-[#0648b3] flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-4xl font-black text-gray-900 tracking-tight">100%</div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Transparent</div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="flex flex-col justify-center pt-12 lg:pt-0">
              <div className="inline-flex px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 w-fit border border-blue-100 text-[#0959d6] bg-blue-50">
                Our Commitment
              </div>
              <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-gray-900 mb-6 leading-tight">
                Why Partner With Us
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-10">
                At Cross-borders Outreach International, we believe in transparency, sustainability, and community-driven solutions. Every dollar you contribute goes directly to creating meaningful, lasting change.
              </p>
              
              {/* 2-Column Floating Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  { text: '100% transparency in fund allocation', color: '#1e3a8a' },
                  { text: 'Community-driven sustainable solutions', color: '#2563eb' },
                  { text: 'Experienced team with local partnerships', color: '#f97316' },
                  { text: 'Regular impact reports and updates', color: '#ef4444' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800 leading-snug">{item.text}</span>
                  </div>
                ))}
              </div>
              
              <Link to="/mission" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#111827] text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 w-fit">
                Our Mission &amp; Vision<ArrowRight className="w-5 h-5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={testimonialsReveal.ref} className={`mb-16 home-reveal ${testimonialsReveal.visible ? 'visible' : ''}`}>
            <div className="inline-flex px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 w-fit border border-orange-200 text-orange-600 bg-orange-50">
              Voices of Impact
            </div>
            <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-gray-900 mb-6 leading-tight">
              Stories of Transformation
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              Hear from communities whose lives have been transformed through our programs.
            </p>
          </div>
          <div className="-mx-2 sm:-mx-3 pb-8">
          <Carousel
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full px-2 sm:px-3"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((item, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="bg-white rounded-[2rem] p-8 sm:p-10 h-full flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
                    <div className="text-7xl font-playfair text-orange-200 leading-none h-12 mb-4">"</div>
                    <p className="text-xl font-medium text-slate-800 leading-relaxed mb-10 flex-1">
                      {item.quote}
                    </p>
                    <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-inner" style={{ backgroundColor: item.color }}>
                        {item.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{item.author}</div>
                        <div className="text-sm text-slate-500">{item.role}</div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative py-32 bg-[#111827] overflow-hidden border-t border-slate-800">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <h2 className="text-5xl lg:text-7xl font-playfair font-bold text-white mb-8 leading-tight">
            Together, We Can<br/>Go Further
          </h2>
          <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto">
            Join our global community of donors, volunteers, and partners working to create lasting change across borders.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/donate" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#111827] rounded-xl font-bold hover:bg-slate-100 transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto">
              <Heart className="w-5 h-5 fill-[#111827]" />
              Donate Today
            </Link>
            <Link to="/opportunities" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-slate-700 text-white rounded-xl font-bold hover:border-slate-500 hover:bg-slate-800 transition-all w-full sm:w-auto">
              Volunteer With Us
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-slate-300 font-bold hover:text-white transition-all w-full sm:w-auto">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
