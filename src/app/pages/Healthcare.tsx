import { Heart, Activity, Stethoscope, Shield, CheckCircle2, Quote, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";
import "../../styles/programs.css";

export default function Healthcare() {


  const services = [
    { icon: Stethoscope, title: "Primary Healthcare", description: "Comprehensive medical consultations, diagnosis, and treatment for common illnesses.", color: "#10b981" },
    { icon: Shield, title: "Preventive Care", description: "Vaccinations, health screenings, and education programs to prevent disease.", color: "#3b82f6" },
    { icon: Activity, title: "Maternal & Child Health", description: "Prenatal care, safe deliveries, and pediatric services for mothers and children.", color: "#8b5cf6" },
    { icon: Heart, title: "Mental Health Support", description: "Counseling and psychological support services for emotional wellbeing.", color: "#f97316" }
  ];

  return (
    <div className="min-h-screen">
      <section className="prog-hero">
        <div className="prog-hero-bg">
          <ImageWithFallback src="https://images.unsplash.com/photo-1758691462413-b07dee2933fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920" alt="Healthcare services" className="w-full h-full object-cover" />
          <div className="prog-hero-overlay" />
        </div>
        <div className="prog-orb prog-orb-1" style={{ background: "rgba(16,185,129,0.15)" }} />
        <div className="prog-orb prog-orb-2" style={{ background: "rgba(59,130,246,0.12)" }} />
        <div className="prog-hero-content">
          <div className="prog-badge"><div className="prog-badge-dot" style={{ background: "#10b981" }} />Healthcare Program</div>
          <h1 className="prog-hero-title">Healthcare Outreach</h1>
          <p className="prog-hero-subtitle">Delivering essential medical care and wellness programs to underserved communities</p>
        </div>
      </section>

      <section className="prog-about-section" style={{ background: "white" }}>
        <div className="prog-about-grid">
          <div>
            <h2 className="prog-about-title">Accessible Healthcare for All</h2>
            <p className="prog-about-text">Our Healthcare Outreach Program brings quality medical services to communities with limited access to healthcare facilities. We believe health is a fundamental human right.</p>
            <p className="prog-about-text">Through mobile clinics, community health workers, and partnerships with local medical professionals, we provide comprehensive healthcare services where they're needed most.</p>
            <div className="prog-checklist">
              {[
                { text: "Free medical consultations and treatment", color: "#10b981" },
                { text: "Essential medications at no cost", color: "#3b82f6" },
                { text: "Mobile clinics reaching remote areas", color: "#8b5cf6" },
                { text: "Health education and prevention programs", color: "#f97316" },
                { text: "Emergency medical response", color: "#ef4444" }
              ].map((item, i) => (
                <div key={i} className="prog-check-item">
                  <div className="prog-check-icon" style={{ background: `${item.color}20`, color: item.color }}><CheckCircle2 className="w-5 h-5" aria-hidden="true" /></div>
                  <span className="prog-check-text">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="prog-about-img">
            <ImageWithFallback src="https://images.unsplash.com/photo-1770221797840-8f5a095ad7ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="Medical outreach" />
          </div>
        </div>
      </section>

      <section className="prog-initiatives-section">
        <div className="prog-initiatives-header">
          <div className="prog-initiatives-label" style={{ color: "#10b981" }}>Our Services</div>
          <h2 className="prog-initiatives-title">Healthcare Services</h2>
          <p className="prog-initiatives-subtitle">Comprehensive medical care addressing diverse community health needs</p>
        </div>
        <div className="prog-initiatives-grid">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <Link 
                key={i} 
                to={`/initiatives/${s.title.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
                className="prog-initiative-card"
                style={{ "--accent": s.color, display: "block", textDecoration: "none", color: "inherit" } as React.CSSProperties}
              >
                <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: s.color, borderRadius: "4px 0 0 4px" }} />
                <div className="prog-initiative-icon" style={{ background: s.color }}><Icon className="w-6 h-6" /></div>
                <h3 className="prog-initiative-title">{s.title}</h3>
                <p className="prog-initiative-desc">{s.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="prog-story-section">
        <div className="prog-story-inner">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#93c5fd", marginBottom: 10 }}>Lives Saved</div>
            <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, color: "white" }}>Healthcare That Heals</h2>
          </div>
          <div className="prog-story-card">
            <Quote className="prog-story-quote-icon w-10 h-10" />
            <p className="prog-story-quote">"When my mother fell ill, we had no way to reach the hospital 50 kilometers away. The Crossborders mobile clinic came to our village, diagnosed her diabetes, and provided the medication she needed. They saved her life."</p>
            <div className="prog-story-author">
              <div className="prog-story-avatar" style={{ background: "#10b981" }}>EM</div>
              <div><div className="prog-story-name">Emmanuel Mensah</div><div className="prog-story-role">Community Beneficiary</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="prog-cta-section" style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
        <div className="prog-cta-inner">
          <h2 className="prog-cta-title">Support Life-Saving Healthcare</h2>
          <p className="prog-cta-subtitle">Your donation provides essential medical care to those who need it most.</p>
          <div className="prog-cta-actions">
            <Link to="/donate" className="prog-cta-btn-primary" style={{ color: "#059669" }}><Heart className="w-5 h-5" /> Make a Donation</Link>
            <Link to="/volunteer" className="prog-cta-btn-secondary">Join Our Medical Team <ChevronRight className="w-5 h-5" /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
