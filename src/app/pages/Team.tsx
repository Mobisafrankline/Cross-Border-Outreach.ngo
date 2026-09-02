import { Mail, Linkedin, Users, ArrowRight, Shield, Award, MapPin } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function Team() {
  const leadership = [
    { name: "Stanley Kamau", role: "Executive Director", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", location: "Global HQ" },
    { name: "Gerold Njoroge", role: "Chief Financial Officer", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", location: "Finance Dept" },
    { name: "Mary Njoroge", role: "Secretary", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", location: "Administration" },
    { name: "Mobisa Frankie", role: "Head of IT & Digital", image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", location: "Technology" }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-source-serif">
      {/* ── Hero Section ── */}
      <section className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1585984968562-1443b72fb0dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Our team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/80 to-[#021A2E]/90" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#F5B800] text-xs font-black uppercase tracking-[0.2em] mb-6 shadow-xl">
              <Shield className="w-3.5 h-3.5" /> Leadership & Vision
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-2xl font-playfair">
              Meet Our <span className="text-[#F5B800]">Team</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed font-medium">
              Dedicated professionals committed to driving sustainable change and empowering communities globally.
            </p>
          </motion.div>
        </div>
        
        {/* Decorative element */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-[50px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C79.8,111.45,159.2,117.8,236.4,111.5c41.3-3.4,81.4-11.2,120.7-21.7C332.9,81.6,327.3,69.5,321.39,56.44Z" className="fill-[#f8f9fa]"></path>
          </svg>
        </div>
      </section>

      {/* ── Leadership Grid ── */}
      <section className="py-24 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-navy-900 mb-6 font-playfair">
              The People Behind The <span className="text-[#F5B800]">Mission</span>
            </h2>
            <div className="w-24 h-1.5 bg-[#F5B800] rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-source-serif">
              Our experienced leaders bring decades of combined expertise in humanitarian work,
              financial governance, and community empowerment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgba(3,43,69,0.06)] hover:shadow-[0_20px_40px_rgba(3,43,69,0.12)] hover:-translate-y-2 transition-all duration-500 group border border-slate-900/5 flex flex-col"
              >
                <div className="p-8 flex-1 flex flex-col relative bg-white min-h-[280px]">
                  <div className="absolute top-6 right-6 w-12 h-12 bg-gold-50 rounded-2xl flex items-center justify-center text-[#F5B800] transform rotate-3 group-hover:-rotate-6 transition-transform duration-300 group-hover:bg-[#F5B800] group-hover:text-navy-900 shadow-sm border border-[#F5B800]/20">
                    <Users className="w-5 h-5" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-navy-900 mb-2 font-playfair group-hover:text-[#032B45] transition-colors pr-14 mt-2">
                    {member.name}
                  </h3>
                  <p className="text-sm font-black text-[#F5B800] uppercase tracking-widest mb-8">
                    {member.role}
                  </p>
                  
                  {/* Social links */}
                  <div className="flex gap-3 mb-8">
                    <a href="#" className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center hover:bg-[#F5B800] hover:text-navy-900 text-slate-400 transition-colors border border-slate-100 shadow-sm">
                      <Mail className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center hover:bg-[#F5B800] hover:text-navy-900 text-slate-400 transition-colors border border-slate-100 shadow-sm">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-100 flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-navy-900 transition-colors">
                    <MapPin className="w-4 h-4 mr-2 text-[#F5B800]" /> {member.location}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Careers CTA ── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="bg-gradient-to-br from-navy-900 to-[#021A2E] rounded-[3rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden group">
            {/* Background glowing orbs */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#F5B800]/10 rounded-full blur-[100px] -ml-64 -mt-64 group-hover:bg-[#F5B800]/20 transition-colors duration-1000" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[100px] -mr-64 -mb-64" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-xl">
                <Users className="w-10 h-10 text-[#F5B800]" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-playfair drop-shadow-md">
                Join Our <span className="text-[#F5B800]">Mission</span>
              </h2>
              <p className="text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                We're always looking for passionate individuals who want to make a
                tangible difference. Explore career opportunities and join our growing team.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/opportunities"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#F5B800] text-navy-900 rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#FFD13B] hover:-translate-y-1 transition-all shadow-xl shadow-[#F5B800]/20"
                >
                  View Open Positions <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-transparent border border-[#F5B800]/30 text-[#F5B800] rounded-full font-black text-sm uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
