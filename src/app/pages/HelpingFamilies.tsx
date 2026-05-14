import { Heart, Home, Users, ShieldCheck, CheckCircle2, Quote, ChevronRight, Baby } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";
import "../../styles/programs.css";

export default function HelpingFamilies() {
  const impacts = [
    { number: "350+", label: "Families Assisted", icon: <Home className="w-6 h-6 text-rose-500" /> },
    { number: "1,200+", label: "Children Supported", icon: <Baby className="w-6 h-6 text-blue-500" /> },
    { number: "100%", label: "Needs Assessed", icon: <ShieldCheck className="w-6 h-6 text-emerald-500" /> },
    { number: "24/7", label: "Emergency Support", icon: <Heart className="w-6 h-6 text-purple-500" /> }
  ];

  const programs = [
    { icon: Home, title: "Emergency Shelter Support", description: "Providing temporary housing, rent assistance, and connecting displaced families with safe shelter solutions.", color: "#e11d48" },
    { icon: Heart, title: "Basic Needs Provision", description: "Distributing essential supplies—clothing, hygiene products, bedding, and household items—to families in crisis.", color: "#3b82f6" },
    { icon: Users, title: "Family Counseling & Support", description: "Professional counseling, parenting workshops, and emotional support groups to strengthen family bonds.", color: "#10b981" },
    { icon: ShieldCheck, title: "Child Welfare Programs", description: "School enrollment assistance, after-school care, nutritional support, and protection services for vulnerable children.", color: "#f97316" }
  ];

  return (
    <div className="min-h-screen">
      <section className="prog-hero">
        <div className="prog-hero-bg">
          <ImageWithFallback src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920" alt="Family support" className="w-full h-full object-cover" />
          <div className="prog-hero-overlay" />
        </div>
        <div className="prog-orb prog-orb-1" style={{ background: "rgba(225,29,72,0.15)" }} />
        <div className="prog-orb prog-orb-2" style={{ background: "rgba(236,72,153,0.12)" }} />
        <div className="prog-hero-content">
          <div className="prog-badge"><div className="prog-badge-dot" style={{ background: "#e11d48" }} />Family Welfare</div>
          <h1 className="prog-hero-title">Helping Needy Families</h1>
          <p className="prog-hero-subtitle">Restoring hope and dignity to vulnerable families through comprehensive welfare support and community care</p>
        </div>
      </section>

      <section className="prog-stats-section">
        <div className="prog-stats-grid">
          {impacts.map((impact, i) => (
            <div key={i} className="prog-stat-card">
              <div className="prog-stat-icon">{impact.icon}</div>
              <div className="prog-stat-number">{impact.number}</div>
              <div className="prog-stat-label">{impact.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="prog-about-section" style={{ background: "white" }}>
        <div className="prog-about-grid">
          <div className="prog-about-img">
            <ImageWithFallback src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="Family receiving support" />
          </div>
          <div>
            <h2 className="prog-about-title">Supporting Families in Need</h2>
            <p className="prog-about-text">Our Helping Needy Families program provides holistic support to vulnerable households facing poverty, displacement, or crisis. We address immediate needs while building long-term resilience.</p>
            <p className="prog-about-text">From emergency assistance to sustainable empowerment, we walk alongside families through their most difficult moments and help them rebuild with dignity.</p>
            <div className="prog-checklist">
              {[
                { text: "Emergency food and supply packages", color: "#e11d48" },
                { text: "Housing and rent assistance", color: "#3b82f6" },
                { text: "Children's education sponsorship", color: "#10b981" },
                { text: "Medical care for family members", color: "#8b5cf6" },
                { text: "Job placement and skills training", color: "#f97316" }
              ].map((item, i) => (
                <div key={i} className="prog-check-item">
                  <div className="prog-check-icon" style={{ background: item.color + "20", color: item.color }}><CheckCircle2 className="w-5 h-5" /></div>
                  <span className="prog-check-text">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="prog-initiatives-section">
        <div className="prog-initiatives-header">
          <div className="prog-initiatives-label" style={{ color: "#e11d48" }}>Our Initiatives</div>
          <h2 className="prog-initiatives-title">Family Support Programs</h2>
          <p className="prog-initiatives-subtitle">Comprehensive care designed to lift families out of crisis and into stability</p>
        </div>
        <div className="prog-initiatives-grid">
          {programs.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="prog-initiative-card">
                <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: p.color, borderRadius: "4px 0 0 4px" }} />
                <div className="prog-initiative-icon" style={{ background: p.color }}><Icon className="w-6 h-6" /></div>
                <h3 className="prog-initiative-title">{p.title}</h3>
                <p className="prog-initiative-desc">{p.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="prog-story-section">
        <div className="prog-story-inner">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#93c5fd", marginBottom: 10 }}>Family Restored</div>
            <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, color: "white" }}>A New Beginning</h2>
          </div>
          <div className="prog-story-card">
            <Quote className="prog-story-quote-icon w-10 h-10" />
            <p className="prog-story-quote">"After losing our home, we had nowhere to turn. Crossborders helped us find temporary shelter, provided food for our children, and supported me with skills training. Today, I have a stable job and my children are back in school. They restored our hope."</p>
            <div className="prog-story-author">
              <div className="prog-story-avatar" style={{ background: "#e11d48" }}>GW</div>
              <div><div className="prog-story-name">Grace Wanjiku</div><div className="prog-story-role">Mother of Three</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="prog-cta-section" style={{ background: "linear-gradient(135deg, #be123c, #e11d48)" }}>
        <div className="prog-cta-inner">
          <h2 className="prog-cta-title">Help a Family Today</h2>
          <p className="prog-cta-subtitle">Your generosity can provide shelter, food, and hope to a family in desperate need.</p>
          <div className="prog-cta-actions">
            <Link to="/donate" className="prog-cta-btn-primary" style={{ color: "#be123c" }}><Heart className="w-5 h-5" /> Support a Family</Link>
            <Link to="/volunteer" className="prog-cta-btn-secondary">Volunteer With Us <ChevronRight className="w-5 h-5" /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
