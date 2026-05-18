import { motion } from "motion/react";
import { Handshake, ArrowRight, Globe, Sparkles, Star, ExternalLink, Users, Target, ShieldCheck } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";

// ── Real Partners Data ─────────────────────────────────────────
const partners = [
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    type: "Corporate Partner",
    description: "Amazon has partnered with us through product donations and logistical support, helping us distribute essential household items and supplies to hundreds of families across Atlanta.",
    impact: "500+ families served",
    website: "https://amazon.com",
  },
  {
    name: "Operation Compassion",
    logo: "https://images.squarespace-cdn.com/content/v1/56b3ef2a4d088e6e97fa3dc7/e7f8e0d0-86e0-4f2f-a6a5-e1d70fe9df93/OC+LOGO.png",
    type: "Logistics Partner",
    description: "Operation Compassion has been instrumental in facilitating the connection between corporate donors and our community events, providing warehousing and distribution expertise.",
    impact: "12+ events supported",
    website: "https://operationcompassion.org",
  },
];



const partnershipTiers = [
  {
    tier: "Community",
    icon: Users,
    color: "from-emerald-500 to-teal-600",
    shadowColor: "shadow-emerald-600/20",
    benefits: [
      "Joint community events",
      "Shared volunteer network",
      "Co-branded local outreach",
      "Resource sharing",
    ],
  },
  {
    tier: "Strategic",
    icon: Target,
    color: "from-blue-600 to-indigo-600",
    shadowColor: "shadow-blue-600/20",
    popular: true,
    benefits: [
      "Everything in Community",
      "Program co-development",
      "Impact reporting & analytics",
      "Priority event sponsorships",
      "Staff capacity building",
    ],
  },
  {
    tier: "Global",
    icon: Globe,
    color: "from-violet-600 to-purple-600",
    shadowColor: "shadow-violet-600/20",
    benefits: [
      "Everything in Strategic",
      "Cross-border program funding",
      "Executive advisory board seat",
      "Custom CSR integration",
      "International visibility",
      "Annual impact summit access",
    ],
  },
];

const testimonials = [
  {
    quote: "Cross-Borders Outreach Ministry turns donated resources into tangible community transformation. Our partnership is making a real difference.",
    name: "Operations Team",
    org: "Operation Compassion",
  },
];

export default function Partners() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero Section ── */}
      <section className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1745847768380-2caeadbb3b71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBhcnRuZXJzaGlwJTIwaGFuZHNoYWtlJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NzE5MzA3ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Partnership Collaboration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 via-blue-900/80 to-blue-900" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-widest mb-6">
              <Handshake className="w-3.5 h-3.5" /> Our Alliance
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-2xl">
              Partners in <span className="text-blue-400">Impact</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed font-medium mb-12">
              Together with organizations across the globe, we are building bridges of hope, resources, and lasting change for communities in need.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Partners ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              Our <span className="text-blue-600">Partners</span>
            </h2>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full mb-6" />
            <p className="text-lg text-gray-500 leading-relaxed">
              We are proud to collaborate with organizations that share our vision for a more compassionate and connected world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partners.map((partner, index) => (
              <motion.div key={index}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-[2rem] border border-gray-100 hover:border-blue-100 p-8 hover:shadow-2xl transition-all duration-500 flex flex-col">

                <div className="flex items-start gap-5 mb-6">
                  {/* Partner Logo */}
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shrink-0 overflow-hidden p-2 group-hover:border-blue-200 transition-colors">
                    {partner.name === "Operation Compassion" ? (
                      <div className="flex flex-col items-center justify-center leading-[1.1] text-center w-full">
                        <span className="text-[10px] font-black text-red-600 tracking-tight uppercase">Operation</span>
                        <span className="text-[9px] font-black text-blue-600 tracking-tight uppercase">Compassion</span>
                      </div>
                    ) : partner.logo ? (
                      <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-2xl font-black text-blue-600">
                        {partner.name.split(' ').map(w => w[0]).join('')}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-black text-gray-900 truncate">{partner.name}</h3>
                      {partner.website !== "#" && (
                        <a href={partner.website} target="_blank" rel="noopener noreferrer"
                          className="text-gray-300 hover:text-blue-600 transition-colors shrink-0">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                      {partner.type}
                    </span>
                  </div>
                </div>

                <p className="text-gray-500 leading-relaxed text-sm mb-6 flex-1">
                  {partner.description}
                </p>

                <div className="pt-5 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                    <ShieldCheck className="w-4 h-4" />
                    {partner.impact}
                  </div>
                  <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                    <Star className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              What Our Partners <span className="text-blue-600">Say</span>
            </h2>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full mb-6 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t, idx) => (
              <motion.div key={idx}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-6 right-6 text-blue-100">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
                </div>
                <p className="text-gray-700 text-lg font-medium italic leading-relaxed mb-8 relative z-10">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black text-sm">
                    {t.org.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs font-bold">{t.org}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partnership Tiers ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              Partnership <span className="text-blue-600">Tiers</span>
            </h2>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full mb-6 mx-auto" />
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Choose the partnership level that aligns with your organization's goals and capacity for impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {partnershipTiers.map((tier, idx) => {
              const Icon = tier.icon;
              return (
                <motion.div key={idx}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`relative bg-white rounded-[2.5rem] border ${tier.popular ? 'border-blue-200 shadow-2xl scale-[1.02]' : 'border-gray-100 hover:border-blue-100'} p-8 flex flex-col transition-all duration-300 hover:shadow-xl`}>

                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      Most Popular
                    </div>
                  )}

                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-6 shadow-xl ${tier.shadowColor}`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-black text-gray-900 mb-6">{tier.tier}</h3>

                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600 text-sm font-medium">{b}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/partner"
                    className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-center transition-all ${
                      tier.popular
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-1'
                        : 'bg-gray-50 text-gray-700 border border-gray-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100'
                    }`}>
                    Get Started
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-24 bg-blue-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] -ml-64 -mb-64" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] flex items-center justify-center mx-auto mb-10 rotate-3">
            <Sparkles className="w-10 h-10 text-white -rotate-3" />
          </div>

          <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
            Ready to Build <br />
            <span className="text-blue-400">Something Greater?</span>
          </h2>
          <p className="text-xl text-blue-100/80 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
            Whether you're a corporation, foundation, or community organization, let's create a partnership that transforms lives.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/partner"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-blue-900 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all shadow-xl">
              Become a Partner <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-blue-800 text-white border border-blue-700 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all">
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
