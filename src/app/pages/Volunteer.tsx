import { 
  Heart, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Users, 
  Target, 
  MessageSquare, 
  Rocket,
  ArrowRight,
  ShieldCheck,
  Star,
  ChevronRight
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion } from "motion/react";

export default function Volunteer() {
  const opportunities = [
    {
      title: "Food Distribution Lead",
      location: "Local Community Hubs",
      time: "4-8 hours/week",
      description: "Manage logistics and distribution of nutritious meals to families in crisis.",
      category: "Field Work",
      color: "bg-emerald-50 text-emerald-700 border-emerald-100"
    },
    {
      title: "Education Mentor",
      location: "Learning Centers",
      time: "2-6 hours/week",
      description: "Provide academic support and mentorship to students from underserved backgrounds.",
      category: "Education",
      color: "bg-blue-50 text-blue-700 border-blue-100"
    },
    {
      title: "Health Outreach Assist",
      location: "Mobile Clinics",
      time: "8+ hours/week",
      description: "Support medical professionals during community health screenings and consultations.",
      category: "Healthcare",
      color: "bg-rose-50 text-rose-700 border-rose-100"
    },
    {
      title: "Digital Advocate",
      location: "Remote",
      time: "Flexible",
      description: "Help amplify our mission through creative storytelling and social media engagement.",
      category: "Remote",
      color: "bg-indigo-50 text-indigo-700 border-indigo-100"
    }
  ];

  const journeySteps = [
    {
      icon: MessageSquare,
      title: "Get in Touch",
      desc: "Fill out the application below. We want to know your skills and what drives you."
    },
    {
      icon: Target,
      title: "Discovery Call",
      desc: "We'll have a quick chat to align your interests with our current community needs."
    },
    {
      icon: ShieldCheck,
      title: "Onboarding",
      desc: "Receive necessary training and clear standard safety checks for your specific role."
    },
    {
      icon: Rocket,
      title: "Launch Impact",
      desc: "Join your team on the field and start creating tangible change in people's lives."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1769837230054-7f3a7356dde1?q=80&w=2000&auto=format&fit=crop"
            alt="Volunteers working together"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900/90" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/30 backdrop-blur-md rounded-full border border-blue-400/30 mb-8">
              <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span className="text-sm font-bold tracking-widest uppercase">Join the Movement</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
              Change Starts <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 italic">With You.</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
              Give your time, share your skills, and become a catalyst for sustainable change in communities worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#apply" className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-xl flex items-center justify-center gap-2">
                Apply to Volunteer <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#opportunities" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                View Roles
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Journey Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Your Volunteer Journey</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              We've designed a simple, supportive process to get you from application to making a real impact.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 z-0" />
            
            {journeySteps.map((step, i) => (
              <div key={i} className="relative z-10 group">
                <div className="w-24 h-24 bg-white rounded-[2rem] shadow-lg shadow-slate-200 border border-slate-100 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <step.icon className="w-10 h-10" />
                </div>
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-black shadow-lg">
                  {i + 1}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunities Grid */}
      <section id="opportunities" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Current Openings</h2>
              <p className="text-slate-500 text-lg">Immediate needs where you can start helping today.</p>
            </div>
            <div className="flex items-center gap-2 text-blue-600 font-bold">
              <Users className="w-5 h-5" />
              <span>12 positions available</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {opportunities.map((opp, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-900/5 hover:shadow-blue-900/10 transition-all flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${opp.color}`}>
                    {opp.category}
                  </span>
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    {opp.time}
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{opp.title}</h3>
                <div className="flex items-center gap-2 text-slate-500 mb-6 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  {opp.location}
                </div>
                <p className="text-slate-600 leading-relaxed mb-8 flex-1">{opp.description}</p>
                <a href="#apply" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all text-center flex items-center justify-center gap-2">
                  Apply for this role <ChevronRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-24 bg-blue-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-800/20 -skew-x-12 transform translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 text-white">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Ready to join <br/>the family?</h2>
              <p className="text-xl text-blue-100 mb-10 leading-relaxed opacity-90">
                Complete the application and our volunteer coordinator will reach out to schedule an introductory call.
              </p>
              
              <div className="space-y-6">
                {[
                  "No prior experience required for most roles",
                  "Receive certificates for your service hours",
                  "Regular training and growth workshops",
                  "Global community of passionate change-makers"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-blue-50 text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">First Name</label>
                      <input type="text" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl focus:outline-none transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Last Name</label>
                      <input type="text" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl focus:outline-none transition-all font-medium" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                    <input type="email" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl focus:outline-none transition-all font-medium" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Primary Interest</label>
                      <select className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl focus:outline-none transition-all font-medium appearance-none">
                        <option>Food Distribution</option>
                        <option>Education & Tutoring</option>
                        <option>Healthcare Support</option>
                        <option>Digital Advocacy</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Availability</label>
                      <select className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl focus:outline-none transition-all font-medium appearance-none">
                        <option>Weekends</option>
                        <option>Weekdays (Evenings)</option>
                        <option>Full-time / Flexible</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">About You</label>
                    <textarea rows={4} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl focus:outline-none transition-all font-medium resize-none" placeholder="Tell us about your background and why you want to join..." />
                  </div>

                  <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 transform active:scale-95">
                    Submit Application
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Quote */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative">
            <div className="absolute -top-12 -left-12 text-blue-100 opacity-50">
              <MessageSquare className="w-48 h-48" />
            </div>
            <div className="relative z-10 text-center">
              <p className="text-2xl md:text-4xl font-bold text-slate-800 leading-tight mb-10">
                "Volunteering here hasn't just allowed me to help others; it's completely reshaped my perspective on community and global responsibility."
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full border-4 border-slate-50 flex items-center justify-center text-white text-xl font-black shadow-xl">
                  JM
                </div>
                <div className="text-left">
                  <div className="font-black text-slate-900 text-xl tracking-tight leading-none">Jennifer Martinez</div>
                  <div className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Education Lead, 3 Years</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

