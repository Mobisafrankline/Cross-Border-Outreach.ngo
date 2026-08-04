import {
  Heart, ArrowRight, CheckCircle2, Quote, Calendar,
  MapPin, Users, Globe2, HandHeart, ChevronRight, Sparkles,
} from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { supabase } from "../../lib/supabase";
import { galleryImages, events } from "../../data/content";
import { useTranslation } from "react-i18next";
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
        color: "#fb923c",
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
    { title: t('programs.foodSupport'), description: t('programs.foodDesc'), image: 'https://images.unsplash.com/photo-1710092784814-4a6f158913b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', link: '/food-support', color: '#f97316', tag: 'Nutrition' },
    { title: t('programs.education'), description: t('programs.educationDesc'), image: 'https://images.unsplash.com/photo-1770843093640-c44ae557928b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', link: '/education', color: '#1e3a8a', tag: 'Education' },
    { title: t('programs.healthcare'), description: t('programs.healthcareDesc'), image: 'https://images.unsplash.com/photo-1770221797840-8f5a095ad7ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', link: '/healthcare', color: '#2563eb', tag: 'Healthcare' },
    { title: t('programs.economic'), description: t('programs.economicDesc'), image: 'https://images.unsplash.com/photo-1752650736246-abae155278be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', link: '/economic', color: '#f97316', tag: 'Empowerment' },
    { title: t('programs.helpingFamilies'), description: t('programs.helpingFamiliesDesc'), image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', link: '/helping-families', color: '#ef4444', tag: 'Family Welfare' },
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

      {/* ── HERO ── */}
      <section className="home-hero">
        <div className="home-hero-bg">
          <ImageWithFallback src="https://images.unsplash.com/photo-1764738130382-cc7a8eaf26c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920" alt="Volunteers helping community" className="w-full h-full object-cover" />
          <div className="home-hero-overlay" />
        </div>
        <div className="home-orb home-orb-1" />
        <div className="home-orb home-orb-2" />
        <div className="home-hero-content">

          <h1 className="home-hero-title font-playfair">{t('home.heroTitle')}</h1>
          <p className="home-hero-subtitle">{t('home.heroSubtitle')}</p>

          {/* Rotating impact text */}
          <div style={{ marginBottom: 36, fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
            We Are <RotatingText />
          </div>

          <div className="home-hero-actions">
            <Link to="/donate" className="home-btn-primary"><Heart className="w-5 h-5 fill-white" />{t('nav.donateNow')}</Link>
            <Link to="/opportunities" className="home-btn-secondary">{t('home.getInvolved')}<ArrowRight className="w-5 h-5" /></Link>
          </div>



          <div className="home-scroll-hint"><div className="home-scroll-dot" /></div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="home-stats-section" ref={statsRef}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="home-stats-grid">
            <StatCard value={8455} suffix="+" label={t('stats.livesImpacted')} icon={<Users className="w-6 h-6" />} trigger={statsVisible} />
            <StatCard value={12} suffix="+" label={t('stats.partnerOrgs')} icon={<HandHeart className="w-6 h-6" />} trigger={statsVisible} />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
          <Carousel
            plugins={[
              Autoplay({
                delay: 3500,
              }),
            ]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4 pb-4">
              {galleryImages.map((image) => (
                <CarouselItem key={image.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="home-carousel-item group">
                    <ImageWithFallback src={image.url} alt={image.alt} loading="lazy" decoding="async" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                    <div className="home-carousel-overlay-premium" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
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

          {/* MAIN FEATURED PROGRAM */}
          {programs.find(p => p.link === '/helping-families') && (() => {
            const mainProgram = programs.find(p => p.link === '/helping-families')!;
            return (
              <Link to={mainProgram.link} className="home-main-program-card group">
                <div className="home-main-program-img-wrap">
                  <ImageWithFallback src={mainProgram.image} alt={mainProgram.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="home-program-img-overlay" />
                  <div className="home-program-tag" style={{ backgroundColor: mainProgram.color }}>{mainProgram.tag}</div>
                </div>
                <div className="home-main-program-body">
                  <h3 className="home-main-program-title font-playfair">{mainProgram.title}</h3>
                  <p className="home-main-program-desc">{mainProgram.description}</p>
                  <div className="home-program-cta" style={{ color: mainProgram.color }}>
                    {t('programs.learnMore')}<ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
                <div className="home-program-accent" style={{ backgroundColor: mainProgram.color }} />
              </Link>
            );
          })()}

          {/* 4 COLUMN GRID FOR REMAINING PROGRAMS */}
          <div className="home-programs-4col-grid">
            {programs.filter(p => p.link !== '/helping-families').map((program, index) => (
              <Link to={program.link} key={index} className="home-program-card group">
                <div className="home-program-img-wrap">
                  <ImageWithFallback src={program.image} alt={program.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="home-program-img-overlay" />
                  <div className="home-program-tag" style={{ backgroundColor: program.color }}>{program.tag}</div>
                </div>
                <div className="home-program-body">
                  <h3 className="home-program-title font-playfair">{program.title}</h3>
                  <p className="home-program-desc">{program.description}</p>
                  <div className="home-program-cta" style={{ color: program.color }}>{t('programs.learnMore')}<ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></div>
                </div>
                <div className="home-program-accent" style={{ backgroundColor: program.color }} />
              </Link>
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
            <Link to="/partner" className="home-cta-btn-secondary">Become a Partner<ArrowRight className="w-5 h-5" /></Link>
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
        <section style={{ background: 'var(--brand-cream)', padding: '80px 0', borderTop: '1px solid rgba(30,58,138,0.06)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
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
                <div key={newsItem.id} className="bg-white rounded-3xl overflow-hidden border border-[rgba(30,58,138,0.06)] flex flex-col h-full group hover:-translate-y-1.5 transition-all duration-300" style={{ boxShadow: '0 4px 20px rgba(15,23,42,0.05)' }}>
                  <div className="relative h-56 w-full overflow-hidden">
                    <ImageWithFallback src={newsItem.image} alt={newsItem.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-white text-[10px] font-black uppercase tracking-widest rounded-md shadow-sm" style={{ background: 'var(--brand-teal)' }}>
                        {newsItem.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-xs font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>
                      <Calendar className="w-3.5 h-3.5" />
                      {newsItem.date}
                    </div>
                    <h3 className="text-xl font-bold leading-snug mb-3 transition-colors font-playfair" style={{ color: 'var(--brand-heading)', fontFamily: "'Playfair Display', Georgia, serif" }}>
                      {newsItem.title}
                    </h3>
                    <p className="text-sm leading-relaxed line-clamp-3 mb-6 flex-1 font-source-serif" style={{ color: 'var(--brand-text)' }}>
                      {newsItem.excerpt}
                    </p>
                    <div className="mt-auto pt-2">
                      <Link to={`/company-news/${newsItem.id}`} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-colors" style={{ background: 'rgba(30,58,138,0.06)', color: 'var(--brand-teal)' }}>
                        Read Article <ChevronRight className="w-3.5 h-3.5" />
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
      <section className="home-why-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div ref={whyReveal.ref} className={`home-why-grid home-reveal ${whyReveal.visible ? 'visible' : ''}`}>
            <div className="home-why-image-wrap">
              <ImageWithFallback src="https://images.unsplash.com/photo-1585984968562-1443b72fb0dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="Our team" loading="lazy" decoding="async" className="home-why-image" />
              <div className="home-why-float-card">
                <div className="home-why-float-icon">✓</div>
                <div><div className="home-why-float-num">100%</div><div className="home-why-float-text">Transparent</div></div>
              </div>
            </div>
            <div className="home-why-content">
              <div className="home-section-label">Our Commitment</div>
              <h2 className="home-why-title font-playfair">Why Partner With Us</h2>
              <p className="home-why-desc">At Cross-borders Outreach International, we believe in transparency, sustainability, and community-driven solutions. Every dollar you contribute goes directly to creating meaningful, lasting change.</p>
              <div className="home-why-list">
                {[
                  { text: '100% transparency in fund allocation', color: '#1e3a8a' },
                  { text: 'Community-driven sustainable solutions', color: '#2563eb' },
                  { text: 'Experienced team with local partnerships', color: '#f97316' },
                  { text: 'Regular impact reports and updates', color: '#ef4444' },
                  { text: 'Tax-deductible contributions', color: '#1e3a8a' },
                ].map((item, i) => (
                  <div key={i} className="home-why-item">
                    <div className="home-why-check" style={{ backgroundColor: `${item.color}18`, color: item.color }}><CheckCircle2 className="w-5 h-5" aria-hidden="true" /></div>
                    <span className="home-why-item-text">{item.text}</span>
                  </div>
                ))}
              </div>
              <Link to="/mission" className="home-btn-primary" style={{ width: 'fit-content' }}>Our Mission &amp; Vision<ArrowRight className="w-5 h-5" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="home-testimonials-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div ref={testimonialsReveal.ref} className={`home-section-header home-reveal ${testimonialsReveal.visible ? 'visible' : ''}`}>
            <div className="home-section-label" style={{ color: '#fb923c' }}>Voices of Impact</div>
            <h2 className="home-section-title font-playfair" style={{ color: 'white' }}>Stories of Transformation</h2>
            <p className="home-section-subtitle" style={{ color: 'rgba(255,255,255,0.6)' }}>Hear from communities whose lives have been transformed through our programs.</p>
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
                  <div className="home-testimonial-card h-full flex flex-col">
                    <Quote className="w-10 h-10 mb-4 flex-shrink-0" style={{ color: '#fb923c', opacity: 0.7 }} />
                    <p className="home-testimonial-quote flex-1">"{item.quote}"</p>
                    <div className="home-testimonial-author mt-auto pt-2">
                      <div className="home-testimonial-avatar" style={{ backgroundColor: item.color }}>{item.avatar}</div>
                      <div><div className="home-testimonial-name">{item.author}</div><div className="home-testimonial-role">{item.role}</div></div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <Link to="/impact" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-all duration-300 hover:translate-x-1" style={{ color: '#fb923c', background: 'rgba(249,115,22,0.1)' }}>
                        Read Full Story <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
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
      <section className="home-final-cta">
        <div className="home-final-cta-inner">
          <h2 className="home-final-cta-title font-playfair">Together, We Can Go Further</h2>
          <p className="home-final-cta-sub">Join our global community of donors, volunteers, and partners working to create lasting change across borders.</p>
          <div className="home-final-cta-actions">
            <Link to="/donate" className="home-final-btn-donate"><Heart className="w-5 h-5 fill-white" />Donate Today</Link>
            <Link to="/opportunities" className="home-final-btn-volunteer">Volunteer With Us</Link>
            <Link to="/contact" className="home-final-btn-contact">Contact Us</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
