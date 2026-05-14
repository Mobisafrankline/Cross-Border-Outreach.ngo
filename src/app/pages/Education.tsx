import { BookOpen, Award, Users, Globe, CheckCircle2, Quote, ChevronRight, Heart } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";
import "../../styles/programs.css";

export default function Education() {


  const programs = [
    {
      icon: BookOpen,
      title: "Primary Education Access",
      description: "Ensuring every child has access to quality primary education with proper resources and infrastructure.",
      color: "#3b82f6"
    },
    {
      icon: Award,
      title: "Scholarship Programs",
      description: "Financial support for deserving students to pursue secondary and higher education.",
      color: "#10b981"
    },
    {
      icon: Users,
      title: "Teacher Training",
      description: "Empowering educators with modern teaching methods and continuous professional development.",
      color: "#8b5cf6"
    },
    {
      icon: Globe,
      title: "Digital Literacy",
      description: "Equipping students with essential technology skills for the digital age.",
      color: "#f97316"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="prog-hero">
        <div className="prog-hero-bg">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1574132190990-cfd62178bb1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
            alt="Children learning"
            className="w-full h-full object-cover"
          />
          <div className="prog-hero-overlay" />
        </div>
        <div className="prog-orb prog-orb-1" style={{ background: "rgba(59,130,246,0.15)" }} />
        <div className="prog-orb prog-orb-2" style={{ background: "rgba(99,102,241,0.12)" }} />
        <div className="prog-hero-content">
          <div className="prog-badge">
            <div className="prog-badge-dot" style={{ background: "#3b82f6" }} />
            Education Program
          </div>
          <h1 className="prog-hero-title">Education Support</h1>
          <p className="prog-hero-subtitle">
            Empowering the next generation through quality education and learning opportunities
          </p>
        </div>
      </section>

      {/* About */}
      <section className="prog-about-section" style={{ background: "white" }}>
        <div className="prog-about-grid">
          <div className="prog-about-img">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1770843093640-c44ae557928b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Students studying"
            />
          </div>
          <div>
            <h2 className="prog-about-title">Building Brighter Futures</h2>
            <p className="prog-about-text">
              Education is the cornerstone of sustainable development. Our Education Support Program
              breaks down barriers to learning, ensuring every child has the opportunity to reach their full potential.
            </p>
            <p className="prog-about-text">
              We provide comprehensive support including school supplies, infrastructure improvements,
              teacher training, and scholarship opportunities to create lasting educational impact.
            </p>
            <div className="prog-checklist">
              {[
                { text: "Free school supplies and textbooks", color: "#3b82f6" },
                { text: "Infrastructure development and repairs", color: "#10b981" },
                { text: "Qualified teacher recruitment and training", color: "#8b5cf6" },
                { text: "Technology and computer labs", color: "#f97316" },
                { text: "After-school tutoring programs", color: "#06b6d4" }
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
          <div className="prog-initiatives-label" style={{ color: "#3b82f6" }}>Our Initiatives</div>
          <h2 className="prog-initiatives-title">Education Programs</h2>
          <p className="prog-initiatives-subtitle">
            Supporting students at every stage of their educational journey
          </p>
        </div>
        <div className="prog-initiatives-grid">
          {programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <div key={index} className="prog-initiative-card">
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
              Success Story
            </div>
            <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, color: "white" }}>
              Education Changes Lives
            </h2>
          </div>
          <div className="prog-story-card">
            <Quote className="prog-story-quote-icon w-10 h-10" />
            <p className="prog-story-quote">
              "Before Crossborders came to our village, many children couldn't attend school due to lack of
              resources. Today, my daughter is in her final year of secondary school with a full scholarship
              to university. Education has opened doors we never imagined possible."
            </p>
            <div className="prog-story-author">
              <div className="prog-story-avatar" style={{ background: "#3b82f6" }}>SK</div>
              <div>
                <div className="prog-story-name">Sarah Kamau</div>
                <div className="prog-story-role">Parent & Community Leader</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="prog-cta-section" style={{ background: "linear-gradient(135deg, #1e3a8a, #3b82f6)" }}>
        <div className="prog-cta-inner">
          <h2 className="prog-cta-title">Invest in Education, Transform Lives</h2>
          <p className="prog-cta-subtitle">
            Your support can give a child the gift of education and a brighter future.
          </p>
          <div className="prog-cta-actions">
            <Link to="/donate" className="prog-cta-btn-primary" style={{ color: "#1e3a8a" }}>
              <Heart className="w-5 h-5" /> Sponsor a Student
            </Link>
            <Link to="/volunteer" className="prog-cta-btn-secondary">
              Become a Tutor <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}