import { 
  Handshake, 
  Building2, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Mail,
  ShieldCheck,
  Globe,
  ArrowRight,
  ChevronRight,
  Target
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion } from "motion/react";

export default function Partner() {
  const partnershipTypes = [
    {
      icon: Building2,
      title: "Corporate Partnerships",
      description: "Scale your CSR impact while aligning your brand with global sustainable development goals.",
      benefits: [
        "Brand visibility in all major events",
        "Employee engagement & volunteering",
        "Co-branded impact reporting",
        "Custom sponsorship packages"
      ],
      color: "bg-blue-50 text-blue-700"
    },
    {
      icon: Target,
      title: "Foundation & Grants",
      description: "Strategic funding partnerships focused on systemic change and long-term community resilience.",
      benefits: [
        "Detailed program accountability",
        "Quarterly transparency audits",
        "Co-design of new initiatives",
        "Data-driven impact metrics"
      ],
      color: "bg-indigo-50 text-indigo-700"
    },
    {
      icon: Users,
      title: "Community Networks",
      description: "Local and international NGOs working together to optimize resource distribution and advocacy.",
      benefits: [
        "Shared logistical infrastructure",
        "Joint community outreach",
        "Cross-border knowledge exchange",
        "Unified advocacy campaigns"
      ],
      color: "bg-emerald-50 text-emerald-700"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1745847768380-2caeadbb3b71?q=80&w=2000&auto=format&fit=crop"
            alt="Partnership collaboration"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
              <Handshake className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-bold tracking-widest uppercase">Strategic Alliances</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
              Scale Impact <br/>
              <span className="text-blue-400 italic">Together.</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed mb-10 font-medium">
              We partner with forward-thinking organizations to solve the world's most pressing challenges through sustainable, community-led initiatives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#inquiry" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2">
                Become a Partner <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#types" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                Explore Models
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust & Scale Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8">Why Partner with Crossborders?</h2>
              <div className="space-y-8">
                {[
                  {
                    title: "Proven Track Record",
                    desc: "Over 10 years of successful field operations with transparent, audited financial reporting.",
                    icon: ShieldCheck
                  },
                  {
                    title: "Global Reach, Local Depth",
                    desc: "Operations across 15+ countries with deeply rooted local community leadership teams.",
                    icon: Globe
                  },
                  {
                    title: "Strategic Alignment",
                    desc: "We tailor our partnership models to align with your organization's unique CSR and ESG goals.",
                    icon: TrendingUp
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-[3rem] rotate-3 opacity-10" />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop"
                alt="Partnership meeting"
                className="relative z-10 rounded-[2.5rem] shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section id="types" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Partnership Models</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Choose the engagement model that best suits your organization's capacity and mission.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {partnershipTypes.map((type, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-900/5 flex flex-col"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${type.color}`}>
                  <type.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{type.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-10 flex-1">{type.description}</p>
                
                <div className="space-y-4 mb-10">
                  {type.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span className="text-slate-700 font-medium text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
                
                <a href="#inquiry" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all text-center">
                  Select Model
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquiry" className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-blue-600/10 blur-[120px] rounded-full transform -translate-y-1/2" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="bg-white rounded-[3rem] shadow-2xl p-10 md:p-16">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                <Mail className="w-10 h-10" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Let's Collaborate</h2>
              <p className="text-slate-500 text-lg">
                Our partnerships team will review your inquiry and reach out within 48 hours.
              </p>
            </div>
            
            <form className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Organization Name</label>
                  <input type="text" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl focus:outline-none transition-all font-medium" placeholder="Company Inc." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Contact Person</label>
                  <input type="text" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl focus:outline-none transition-all font-medium" placeholder="Full Name" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Work Email</label>
                  <input type="email" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl focus:outline-none transition-all font-medium" placeholder="name@company.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Partnership Type</label>
                  <select className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl focus:outline-none transition-all font-medium appearance-none">
                    <option>Corporate Partnership</option>
                    <option>Foundation/Grant</option>
                    <option>Community NGO</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Tell us about your goals</label>
                <textarea rows={5} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl focus:outline-none transition-all font-medium resize-none" placeholder="Describe how you'd like to partner with us..." />
              </div>

              <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Global Impact CTA */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8">Ready to make a global difference?</h2>
          <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join our network of 50+ partners already driving change across 3 continents.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="/contact" className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              Speak to a Representative <ChevronRight className="w-5 h-5" />
            </a>
            <a href="/about" className="px-10 py-5 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-bold hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
              Our Vision
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

