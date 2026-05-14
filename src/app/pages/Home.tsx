import {
  Heart, ArrowRight, CheckCircle2, Quote, Calendar,
  MapPin, Users, Globe2, HandHeart, ChevronRight,
} from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import Slider from "react-slick";
import { newsUpdates, galleryImages, events } from "../../data/content";
import { useTranslation } from "react-i18next";
import "../../styles/carousel.css";
import "../../styles/home.css";
import { useEffect, useRef, useState } from "react";

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

function StatCard({ value, suffix = '', label, icon, trigger }: { value: number; suffix?: string; label: string; icon: React.ReactNode; trigger: boolean }) {
  const count = useCountUp(value, 2000, trigger);
  return (
    <div className="home-stat-card">
      <div className="home-stat-icon">{icon}</div>
      <div className="home-stat-number">{count.toLocaleString()}{suffix}</div>
      <div className="home-stat-label">{label}</div>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

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
    { title: t('programs.education'), description: t('programs.educationDesc'), image: 'https://images.unsplash.com/photo-1770843093640-c44ae557928b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', link: '/education', color: '#3b82f6', tag: 'Education' },
    { title: t('programs.healthcare'), description: t('programs.healthcareDesc'), image: 'https://images.unsplash.com/photo-1770221797840-8f5a095ad7ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', link: '/healthcare', color: '#10b981', tag: 'Healthcare' },
    { title: t('programs.economic'), description: t('programs.economicDesc'), image: 'https://images.unsplash.com/photo-1752650736246-abae155278be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', link: '/economic', color: '#8b5cf6', tag: 'Empowerment' },
    { title: 'Helping Needy Families', description: 'Restoring hope and dignity to vulnerable families through comprehensive welfare support and community care.', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', link: '/helping-families', color: '#e11d48', tag: 'Family Welfare' },
  ];

  const testimonials = [
    { quote: 'Crossborders Outreach Ministry transformed our community. My children now have access to quality education and proper nutrition.', author: 'Maria Santos', role: 'Community Member', avatar: 'MS', color: '#3b82f6' },
    { quote: "The healthcare outreach program saved my mother's life. We are forever grateful for their dedication and compassion.", author: 'James Okonkwo', role: 'Beneficiary Family', avatar: 'JO', color: '#10b981' },
    { quote: 'Through their economic empowerment program, I started my own business and now support my entire family.', author: 'Fatima Ahmed', role: 'Small Business Owner', avatar: 'FA', color: '#f97316' },
  ];

  const recentEvents = events.slice(0, 3);

  const carouselSettings = {
    dots: true, infinite: true, speed: 600, slidesToShow: 3,
    slidesToScroll: 1, autoplay: true, autoplaySpeed: 3500, arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  const latestNews = newsUpdates.slice(0, 3);

  return (
    <div className="min-h-screen">

      {/* â”€â”€ HERO â”€â”€ */}
      <section className="home-hero">
        <div className="home-hero-bg">
          <ImageWithFallback src="https://images.unsplash.com/photo-1764738130382-cc7a8eaf26c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920" alt="Volunteers helping community" className="w-full h-full object-cover" />
          <div className="home-hero-overlay" />
        </div>
        <div className="home-orb home-orb-1" />
        <div className="home-orb home-orb-2" />
        <div className="home-hero-content">

          <h1 className="home-hero-title">{t('home.heroTitle')}</h1>
          <p className="home-hero-subtitle">{t('home.heroSubtitle')}</p>
          <div className="home-hero-actions">
            <Link to="/donate" className="home-btn-primary"><Heart className="w-5 h-5 fill-white" />{t('nav.donateNow')}</Link>
            <Link to="/volunteer" className="home-btn-secondary">{t('home.getInvolved')}<ArrowRight className="w-5 h-5" /></Link>

          </div>
          <div className="home-scroll-hint"><div className="home-scroll-dot" /></div>
        </div>
      </section>

      {/* â”€â”€ STATS â”€â”€ */}
      <section className="home-stats-section" ref={statsRef}>
        <div className="home-stats-grid">
          <StatCard value={3000} suffix="+" label="Lives Impacted" icon={<Users className="w-7 h-7" />} trigger={statsVisible} />
          <StatCard value={12} suffix="+" label="Partner Organizations" icon={<HandHeart className="w-7 h-7" />} trigger={statsVisible} />
          <StatCard value={5} label="Core Programs" icon={<CheckCircle2 className="w-7 h-7" />} trigger={statsVisible} />
          <StatCard value={2} label="Countries Reached" icon={<Globe2 className="w-7 h-7" />} trigger={statsVisible} />
        </div>
      </section>

      {/* ── GALLERY CAROUSEL ── */}
      <section className="home-carousel-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
          <Slider {...carouselSettings}>
            {galleryImages.map((image) => (
              <div key={image.id} className="px-2 sm:px-3">
                <div className="home-carousel-item group">
                  <ImageWithFallback src={image.url} alt={image.alt} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                  <div className="home-carousel-overlay-premium" />
                </div>
              </div>
            ))}
          </Slider>
          <div className="flex justify-center mt-12">
            <Link to="/gallery" className="home-view-all-link text-lg font-bold flex items-center">
              Explore Our Full Gallery <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* â”€â”€ PROGRAMS â”€â”€ */}
      <section className="home-programs-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="home-section-header">
            <div className="home-section-label">What We Do</div>
            <h2 className="home-section-title">Our Core Programs</h2>
            <p className="home-section-subtitle">We create sustainable change through four core programs designed to address the most critical needs in underserved communities.</p>
          </div>
          <div className="home-programs-grid">
            {programs.map((program, index) => (
              <Link to={program.link} key={index} className="home-program-card group">
                <div className="home-program-img-wrap">
                  <ImageWithFallback src={program.image} alt={program.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="home-program-img-overlay" />
                  <div className="home-program-tag" style={{ backgroundColor: program.color }}>{program.tag}</div>
                </div>
                <div className="home-program-body">
                  <h3 className="home-program-title">{program.title}</h3>
                  <p className="home-program-desc">{program.description}</p>
                  <div className="home-program-cta" style={{ color: program.color }}>{t('programs.learnMore')}<ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></div>
                </div>
                <div className="home-program-accent" style={{ backgroundColor: program.color }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ CTA BANNER â”€â”€ */}
      <section className="home-cta-banner">
        <div className="home-cta-inner">
          <div className="home-cta-text">
            <h2 className="home-cta-title">Ready to Make a Difference?</h2>
            <p className="home-cta-sub">Every contribution transforms a life. Join thousands of supporters making real change across borders.</p>
          </div>
          <div className="home-cta-actions">
            <Link to="/donate" className="home-cta-btn-primary"><Heart className="w-5 h-5 fill-white" />Donate Now</Link>
            <Link to="/partner" className="home-cta-btn-secondary">Become a Partner<ArrowRight className="w-5 h-5" /></Link>
          </div>
        </div>
      </section>

      {/* â”€â”€ EVENTS â”€â”€ */}
      <section className="home-events-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="home-section-header-row">
            <div>
              <div className="home-section-label">Recent Activities</div>
              <h2 className="home-section-title-left">Events &amp; Outreach</h2>
            </div>
            <Link to="/events" className="home-view-all-link">View All Events <ChevronRight className="w-4 h-4" /></Link>
          </div>
          <div className="home-events-grid">
            {recentEvents.map((event) => (
              <Link to={`/events/${event.id}`} key={event.id} className="home-event-card group">
                <div className="home-event-img-wrap">
                  <ImageWithFallback src={typeof event.image === 'string' ? event.image : ''} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="home-event-status">{event.status === 'past' ? 'Past Event' : 'Upcoming'}</div>
                </div>
                <div className="home-event-body">
                  <div className="home-event-meta">
                    <span className="home-event-category">{event.category}</span>
                    <span className="home-event-price">{event.ticketPrice}</span>
                  </div>
                  <h3 className="home-event-title">{event.title}</h3>
                  <div className="home-event-info">
                    <span><Calendar className="w-4 h-4" />{event.date}</span>
                    <span><MapPin className="w-4 h-4" />{event.location}</span>
                  </div>
                  <p className="home-event-desc">{event.description}</p>
                  <div className="home-event-cta">View Details<ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ NEWS â”€â”€ */}
      <section className="home-news-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="home-section-header-row">
            <div>
              <div className="home-section-label">Stay Informed</div>
              <h2 className="home-section-title-left">{t('home.latestNews')}</h2>
            </div>
            <Link to="/news" className="home-view-all-link">{t('home.viewAllNews')}<ChevronRight className="w-4 h-4" /></Link>
          </div>
          <div className="home-news-grid">
            {latestNews.map((item) => (
              <article key={item.id} className="home-news-card group">
                <div className="home-news-img-wrap">
                  <ImageWithFallback src={typeof item.image === 'string' ? item.image : ''} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="home-news-category-badge">{item.category}</div>
                </div>
                <div className="home-news-body">
                  <div className="home-news-date"><Calendar className="w-3.5 h-3.5" />{item.date}</div>
                  <h3 className="home-news-title">{item.title}</h3>
                  <p className="home-news-excerpt">{item.excerpt}</p>
                  <Link to={`/news/${item.id}`} className="home-news-read-more">Read Article<ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ WHY PARTNER â”€â”€ */}
      <section className="home-why-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="home-why-grid">
            <div className="home-why-image-wrap">
              <ImageWithFallback src="https://images.unsplash.com/photo-1585984968562-1443b72fb0dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="Our team" className="home-why-image" />
              <div className="home-why-float-card">
                <div className="home-why-float-icon">âœ“</div>
                <div><div className="home-why-float-num">100%</div><div className="home-why-float-text">Transparent</div></div>
              </div>
            </div>
            <div className="home-why-content">
              <div className="home-section-label">Our Commitment</div>
              <h2 className="home-why-title">Why Partner With Us</h2>
              <p className="home-why-desc">At Crossborders Outreach Ministry, we believe in transparency, sustainability, and community-driven solutions. Every dollar you contribute goes directly to creating meaningful, lasting change.</p>
              <div className="home-why-list">
                {[
                  { text: '100% transparency in fund allocation', color: '#3b82f6' },
                  { text: 'Community-driven sustainable solutions', color: '#10b981' },
                  { text: 'Experienced team with local partnerships', color: '#8b5cf6' },
                  { text: 'Regular impact reports and updates', color: '#f97316' },
                  { text: 'Tax-deductible contributions', color: '#06b6d4' },
                ].map((item, i) => (
                  <div key={i} className="home-why-item">
                    <div className="home-why-check" style={{ backgroundColor: item.color + '20', color: item.color }}><CheckCircle2 className="w-5 h-5" /></div>
                    <span className="home-why-item-text">{item.text}</span>
                  </div>
                ))}
              </div>
              <Link to="/mission" className="home-btn-primary" style={{ width: 'fit-content' }}>Our Mission &amp; Vision<ArrowRight className="w-5 h-5" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ TESTIMONIALS â”€â”€ */}
      <section className="home-testimonials-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="home-section-header">
            <div className="home-section-label" style={{ color: '#93c5fd' }}>Voices of Impact</div>
            <h2 className="home-section-title" style={{ color: 'white' }}>Stories of Transformation</h2>
            <p className="home-section-subtitle" style={{ color: '#bfdbfe' }}>Hear from communities whose lives have been transformed through our programs.</p>
          </div>
          <div className="home-testimonials-grid">
            {testimonials.map((item, index) => (
              <div key={index} className="home-testimonial-card">
                <Quote className="w-10 h-10 mb-4" style={{ color: item.color, opacity: 0.8 }} />
                <p className="home-testimonial-quote">"{item.quote}"</p>
                <div className="home-testimonial-author">
                  <div className="home-testimonial-avatar" style={{ backgroundColor: item.color }}>{item.avatar}</div>
                  <div><div className="home-testimonial-name">{item.author}</div><div className="home-testimonial-role">{item.role}</div></div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <Link to="/impact-stories" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-all duration-300 hover:translate-x-1" style={{ color: item.color, background: item.color + '15' }}>
                    Read Full Story <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ FINAL CTA â”€â”€ */}
      <section className="home-final-cta">
        <div className="home-final-cta-inner">
          <Globe2 className="w-14 h-14 text-orange-400 mx-auto mb-6" />
          <h2 className="home-final-cta-title">Together, We Can Go Further</h2>
          <p className="home-final-cta-sub">Join our global community of donors, volunteers, and partners working to create lasting change across borders.</p>
          <div className="home-final-cta-actions">
            <Link to="/donate" className="home-final-btn-donate"><Heart className="w-5 h-5 fill-white" />Donate Today</Link>
            <Link to="/volunteer" className="home-final-btn-volunteer">Volunteer With Us</Link>
            <Link to="/contact" className="home-final-btn-contact">Contact Us</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
