import { TrendingUp, DollarSign, Briefcase, Users, CheckCircle2, Quote, ChevronRight, Heart } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";
import "../../styles/programs.css";

export default function Economic() {
  const impacts = [
    { number: "800+", label: "Businesses Started", icon: <Briefcase className="w-6 h-6 text-purple-500" /> },
    { number: "2,500+", label: "People Trained", icon: <Users className="w-6 h-6 text-blue-500" /> },
    { number: "$1.2M", label: "Microloans Disbursed", icon: <DollarSign className="w-6 h-6 text-emerald-500" /> },
    { number: "92%", label: "Loan Repayment Rate", icon: <TrendingUp className="w-6 h-6 text-orange-500" /> }
  ];

  const programs = [
    { icon: Briefcase, title: "Skills Training", description: "Vocational training in trades like tailoring, carpentry, agriculture, and technology.", color: "#8b5cf6" },
    { icon: DollarSign, title: "Microfinance Support", description: "Small loans and financial literacy training to help entrepreneurs start businesses.", color: "#10b981" },
    { icon: Users, title: "Business Development", description: "Mentorship and guidance for small business owners to scale their operations.", color: "#3b82f6" },
    { icon: TrendingUp, title: "Market Linkages", description: "Connecting producers with markets and buyers for sustainable income growth.", color: "#f97316" }
  ];

  return (
    <div className="min-h-screen">
      <section className="prog-hero">
        <div className="prog-hero-bg">
          <ImageWithFallback src="https://images.unsplash.com/photo-1606077089119-92075161bb60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920" alt="Skills training" className="w-full h-full object-cover" />
          <div className="prog-hero-overlay" />
        </div>
        <div className="prog-orb prog-orb-1" style={{ background: "rgba(139,92,246,0.15)" }} />
        <div className="prog-orb prog-orb-2" style={{ background: "rgba(249,115,22,0.12)" }} />
        <div className="prog-hero-content">
          <div className="prog-badge"><div className="prog-badge-dot" style={{ background: "#8b5cf6" }} />Empowerment Program</div>
          <h1 className="prog-hero-title">Economic Empowerment</h1>
          <p className="prog-hero-subtitle">Creating sustainable livelihoods and breaking the cycle of poverty</p>
        </div>
      </section>

      <section className="prog-about-section" style={{ background: "white" }}>
        <div className="prog-about-grid">
          <div className="prog-about-img">
            <ImageWithFallback src="https://images.unsplash.com/photo-1752650736246-abae155278be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="Woman entrepreneur" />
          </div>
          <div>
            <h2 className="prog-about-title">Building Economic Independence</h2>
            <p className="prog-about-text">Our Economic Empowerment Program equips individuals with the skills, resources, and support needed to create sustainable income and achieve financial independence.</p>
            <p className="prog-about-text">We believe in empowering people to lift themselves out of poverty through entrepreneurship, skills development, and access to capital.</p>
            <div className="prog-checklist">
              {[
                { text: "Free vocational and skills training", color: "#8b5cf6" },
                { text: "Microloans with fair interest rates", color: "#10b981" },
                { text: "Business mentorship programs", color: "#3b82f6" },
                { text: "Financial literacy workshops", color: "#f97316" },
                { text: "Market access and networking support", color: "#06b6d4" }
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
          <div className="prog-initiatives-label" style={{ color: "#8b5cf6" }}>Our Programs</div>
          <h2 className="prog-initiatives-title">Economic Empowerment Initiatives</h2>
          <p className="prog-initiatives-subtitle">Comprehensive programs designed to create lasting economic change</p>
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
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#93c5fd", marginBottom: 10 }}>Success Story</div>
            <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, color: "white" }}>From Trainee to Business Owner</h2>
          </div>
          <div className="prog-story-card">
            <Quote className="prog-story-quote-icon w-10 h-10" />
            <p className="prog-story-quote">"I attended the tailoring training program and received a microloan to buy my first sewing machine. Today, I employ three people and my business supports my entire family. Crossborders gave me more than skills—they gave me hope and a future."</p>
            <div className="prog-story-author">
              <div className="prog-story-avatar" style={{ background: "#8b5cf6" }}>AH</div>
              <div><div className="prog-story-name">Amina Hassan</div><div className="prog-story-role">Fashion Entrepreneur</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="prog-cta-section" style={{ background: "linear-gradient(135deg, #7c3aed, #8b5cf6)" }}>
        <div className="prog-cta-inner">
          <h2 className="prog-cta-title">Invest in Entrepreneurship</h2>
          <p className="prog-cta-subtitle">Your support can help someone start a business and transform their community.</p>
          <div className="prog-cta-actions">
            <Link to="/donate" className="prog-cta-btn-primary" style={{ color: "#7c3aed" }}><Heart className="w-5 h-5" /> Fund a Microloan</Link>
            <Link to="/volunteer" className="prog-cta-btn-secondary">Become a Mentor <ChevronRight className="w-5 h-5" /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
