import { motion } from "motion/react";
import { Target, Eye, Heart, CheckCircle2, Shield, Globe, Users, Zap, Scale, HandHeart, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";

export default function Mission() {
  const values = [
    { 
      title: "Compassion", 
      icon: HandHeart,
      color: "text-rose-500",
      bg: "bg-rose-50",
      border: "border-rose-100",
      description: "We lead with empathy and understanding in all our interactions, prioritizing the human element above all." 
    },
    { 
      title: "Integrity", 
      icon: Shield,
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-100",
      description: "We maintain unwavering transparency and accountability in every action, ensuring trust at all levels." 
    },
    { 
      title: "Dignity", 
      icon: Users,
      color: "text-violet-500",
      bg: "bg-violet-50",
      border: "border-violet-100",
      description: "We respect and honor the inherent worth of every individual, fostering environments of mutual respect." 
    },
    { 
      title: "Sustainability", 
      icon: Globe,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      description: "We create long-term solutions that empower communities to thrive independently long after we leave." 
    },
    { 
      title: "Partnership", 
      icon: Scale,
      color: "text-amber-500",
      bg: "bg-amber-50",
      border: "border-amber-100",
      description: "We collaborate closely with local leaders to ensure our impact is relevant and lasting." 
    },
    { 
      title: "Excellence", 
      icon: Zap,
      color: "text-cyan-500",
      bg: "bg-cyan-50",
      border: "border-cyan-100",
      description: "We strive for the highest quality in all our programs, continually innovating our approach." 
    }
  ];

  const commitments = [
    "Serve with dignity and respect for all beneficiaries",
    "Maintain 100% transparency in our operations and finances",
    "Partner with local communities for sustainable solutions",
    "Measure and report our impact regularly and honestly",
    "Continuously improve our programs based on community feedback",
    "Advocate for systemic change that addresses root causes"
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      
      {/* ── Hero Section ── */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1593113514214-e4a06700c01a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3BlJTIwY29tbXVuaXR5fGVufDB8fHx8MTcyNTE2MDkzNHww&ixlib=rb-4.1.0&q=80&w=1920"
            alt="Mission and Vision"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-bold uppercase tracking-widest mb-6">
              <Target className="w-4 h-4 text-blue-400" /> Our Purpose
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-xl">
              Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">&</span> Vision
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 max-w-2xl mx-auto font-medium leading-relaxed">
              The driving force behind every program, every partnership, and every life we touch.
            </p>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10" />
      </section>

      {/* ── Mission & Vision Cards ── */}
      <section className="py-24 relative z-20 -mt-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Mission Card */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-2xl shadow-blue-900/5 border border-blue-50 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-150" />
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-600/20 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Our Mission</h2>
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  To transform lives and build sustainable communities through compassionate outreach. We provide essential support in food security, education, healthcare, and economic empowerment to underserved populations across borders.
                </p>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-slate-900 rounded-[2.5rem] p-10 md:p-14 shadow-2xl shadow-cyan-900/10 border border-slate-800 relative overflow-hidden group"
            >
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-900/40 rounded-full blur-[80px] -ml-32 -mb-32 transition-transform duration-700 group-hover:scale-150" />
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-cyan-400 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-cyan-400/20 transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <Eye className="w-10 h-10 text-slate-900" />
                </div>
                <h2 className="text-4xl font-black text-white mb-6 tracking-tight">Our Vision</h2>
                <p className="text-xl text-slate-300 leading-relaxed font-medium">
                  A world where every person, regardless of their circumstances or location, has access to the fundamental resources needed to thrive—nutritious food, quality education, healthcare, and equal economic opportunities.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Our Core <span className="text-blue-600">Values</span>
            </h2>
            <div className="w-24 h-1.5 bg-blue-600 rounded-full mx-auto mb-8" />
            <p className="text-xl text-slate-600 leading-relaxed">
              These six pillars guide every decision we make, every partnership we forge, and every program we execute.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-white rounded-3xl p-8 border ${value.border} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
                >
                  <div className={`w-14 h-14 ${value.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${value.color}`} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Our Commitment ── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-blue-900 rounded-[3rem] p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-800 rounded-full blur-[100px] -mr-48 -mt-48" />
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/3 text-center lg:text-left">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0 border border-blue-400/30">
                  <Heart className="w-8 h-8 text-blue-300" />
                </div>
                <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Our Promise</h2>
                <p className="text-blue-200 text-lg">
                  To the communities we serve and the donors who support us.
                </p>
              </div>
              
              <div className="lg:w-2/3">
                <div className="grid sm:grid-cols-2 gap-4">
                  {commitments.map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start gap-4 bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-sm"
                    >
                      <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                      <span className="text-white font-medium">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pb-24 pt-10 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
            Share in Our Vision
          </h2>
          <p className="text-lg text-slate-600 mb-10">
            It takes a global community to enact lasting change. Join us in making this vision a reality.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/donate" className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-colors shadow-xl shadow-blue-600/20">
              Support Our Mission
            </Link>
            <Link to="/opportunities" className="inline-flex items-center justify-center px-8 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black text-lg hover:bg-slate-200 transition-colors border border-slate-200">
              Become a Volunteer <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
