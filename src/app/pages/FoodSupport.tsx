import { Heart, Users, Package, TrendingUp, CheckCircle2, Quote, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";
import "../../styles/programs.css";

export default function FoodSupport() {


  const programs = [
    {
      icon: Package,
      title: "Emergency Food Relief",
      description: "Immediate assistance for families facing crisis situations with nutritious food packages.",
      color: "#f97316"
    },
    {
      icon: Users,
      title: "Community Feeding Programs",
      description: "Hot meals served daily at community centers to ensure no one goes hungry.",
      color: "#3b82f6"
    },
    {
      icon: TrendingUp,
      title: "Sustainable Agriculture",
      description: "Training and resources to help communities grow their own food sustainably.",
      color: "#10b981"
    },
    {
      icon: Heart,
      title: "Child Nutrition Initiative",
      description: "Special programs ensuring children receive balanced, nutritious meals for healthy development.",
      color: "#8b5cf6"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="prog-hero">
        <div className="prog-hero-bg">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1762418967948-a243e94dd789?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
            alt="Food distribution"
            className="w-full h-full object-cover"
          />
          <div className="prog-hero-overlay" />
        </div>
        <div className="prog-orb prog-orb-1" style={{ background: "rgba(249,115,22,0.15)" }} />
        <div className="prog-orb prog-orb-2" style={{ background: "rgba(239,68,68,0.12)" }} />
        <div className="prog-hero-content">
          <div className="prog-badge">
            <div className="prog-badge-dot" style={{ background: "#f97316" }} />
            Nutrition Program
          </div>
          <h1 className="prog-hero-title">Food Support Program</h1>
          <p className="prog-hero-subtitle">
            Fighting hunger and malnutrition through sustainable food security initiatives across borders
          </p>
        </div>
      </section>

      {/* About */}
      <section className="prog-about-section" style={{ background: "white" }}>
        <div className="prog-about-grid">
          <div className="prog-about-img">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1710092784814-4a6f158913b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Food distribution volunteers"
            />
          </div>
          <div>
            <h2 className="prog-about-title">Nourishing Communities</h2>
            <p className="prog-about-text">
              Our Food Support Program addresses both immediate hunger needs and long-term food security.
              We believe everyone deserves access to nutritious, culturally appropriate food.
            </p>
            <p className="prog-about-text">
              Through partnerships with local farmers, food banks, and community organizations, we ensure
              sustainable solutions that empower communities to achieve food independence.
            </p>
            <div className="prog-checklist">
              {[
                { text: "Nutritionally balanced meal packages", color: "#f97316" },
                { text: "Culturally appropriate food options", color: "#3b82f6" },
                { text: "Fresh produce from local sources", color: "#10b981" },
                { text: "Dietary accommodations for special needs", color: "#8b5cf6" }
              ].map((item, i) => (
                <div key={i} className="prog-check-item">
                  <div className="prog-check-icon" style={{ background: `${item.color}20`, color: item.color }}>
                    <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="prog-check-text">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Initiatives */}
      <section className="prog-initiatives-section">
        <div className="prog-initiatives-header">
          <div className="prog-initiatives-label" style={{ color: "#f97316" }}>Our Initiatives</div>
          <h2 className="prog-initiatives-title">Comprehensive Food Security</h2>
          <p className="prog-initiatives-subtitle">
            Programs designed to meet diverse community nutritional needs
          </p>
        </div>
        <div className="prog-initiatives-grid">
          {programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <div key={index} className="prog-initiative-card" style={{ "--accent": program.color } as React.CSSProperties}>
                <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: program.color, borderRadius: "4px 0 0 4px" }} />
                <div className="prog-initiative-icon" style={{ background: program.color }}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="prog-initiative-title">{program.title}</h3>
                <p className="prog-initiative-desc">{program.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Success Story */}
      <section className="prog-story-section">
        <div className="prog-story-inner">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#93c5fd", marginBottom: 10 }}>
              Impact Story
            </div>
            <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, color: "white" }}>
              Lives Transformed
            </h2>
          </div>
          <div className="prog-story-card">
            <Quote className="prog-story-quote-icon w-10 h-10" />
            <p className="prog-story-quote">
              "Before the food support program, my family often went to bed hungry. Now, my children
              receive nutritious meals every day and their health has improved tremendously. We are
              forever grateful for the consistent support."
            </p>
            <div className="prog-story-author">
              <div className="prog-story-avatar" style={{ background: "#f97316" }}>JN</div>
              <div>
                <div className="prog-story-name">Jane Njeri</div>
                <div className="prog-story-role">Community Beneficiary</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="prog-cta-section" style={{ background: "linear-gradient(135deg, #f97316, #ef4444)" }}>
        <div className="prog-cta-inner">
          <h2 className="prog-cta-title">Help Us Feed More Families</h2>
          <p className="prog-cta-subtitle">
            Your donation can provide nutritious meals to families in need. Every contribution makes a difference.
          </p>
          <div className="prog-cta-actions">
            <Link to="/donate" className="prog-cta-btn-primary" style={{ color: "#f97316" }}>
              <Heart className="w-5 h-5" /> Donate Now
            </Link>
            <Link to="/volunteer" className="prog-cta-btn-secondary">
              Volunteer With Us <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}