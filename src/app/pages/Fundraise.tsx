import { 
  Gift, 
  Users, 
  TrendingUp, 
  Share2, 
  CheckCircle2, 
  Calendar,
  Rocket,
  Heart,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Trophy
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion } from "motion/react";

export default function Fundraise() {
  const fundraisingIdeas = [
    {
      icon: Calendar,
      title: "Birthday Pledge",
      description: "Ask for donations instead of gifts and celebrate your day with impact.",
      color: "bg-orange-50 text-orange-600"
    },
    {
      icon: Trophy,
      title: "Athletic Challenge",
      description: "Run, swim, or cycle for a cause and let your network sponsor your grit.",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Heart,
      title: "In Honor Of",
      description: "Create a lasting legacy by raising funds in memory of a loved one.",
      color: "bg-rose-50 text-rose-600"
    },
    {
      icon: Users,
      title: "Workplace Goal",
      description: "Mobilize your colleagues and compete for the highest team contribution.",
      color: "bg-emerald-50 text-emerald-600"
    }
  ];

  const successTips = [
    {
      title: "Start with 'Why'",
      desc: "Donors connect with personal stories. Tell them why this mission matters to you."
    },
    {
      title: "The First Gift",
      desc: "Kick off the momentum by being your own first donor. It shows commitment."
    },
    {
      title: "Visual Updates",
      desc: "Post photos and videos of your progress to keep your supporters engaged."
    },
    {
      title: "Say Thank You",
      desc: "A personal note of gratitude goes a long way in building a community of supporters."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1769837230424-bf083c309ab1?q=80&w=2000&auto=format&fit=crop"
            alt="Fundraising celebration"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900 via-orange-900/80 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-bold tracking-widest uppercase">Champion of Change</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
              Lead Your Own <br/>
              <span className="text-orange-400 italic">Movement.</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed mb-10 font-medium">
              Turn your passion into action. Start a fundraiser and rally your community to provide food, education, and healthcare to those who need it most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#start" className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2">
                Start a Fundraiser <Rocket className="w-5 h-5" />
              </a>
              <a href="#ideas" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                Get Inspired
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Fundraise Section */}
      <section className="py-24 bg-orange-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-200 rounded-[3rem] -rotate-3 opacity-30" />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1585984968562-1443b72fb0dc?q=80&w=1000&auto=format&fit=crop"
                  alt="Community rallying"
                  className="relative z-10 rounded-[2.5rem] shadow-2xl"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">Multiply Your Impact Through Community.</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                When you fundraise, you're not just giving money—you're giving a platform to the cause. You become an ambassador, educating your network and inspiring others to join the mission.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  "Personalized Dashboard",
                  "One-Click Social Sharing",
                  "Real-time Impact Tracking",
                  "Dedicated Support Team",
                  "Instant Tax Receipts",
                  "Zero Platform Fees"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="font-bold text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fundraising Ideas Grid */}
      <section id="ideas" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-display">Endless Ways to Give</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Whether it's a big event or a simple birthday pledge, every effort counts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {fundraisingIdeas.map((idea, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-900/5 hover:shadow-orange-900/10 transition-all text-center flex flex-col"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 ${idea.color}`}>
                  <idea.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{idea.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-1">{idea.description}</p>
                <a href="#start" className="text-orange-600 font-bold text-sm flex items-center justify-center gap-2 group">
                  Start this campaign <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Tips */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-500/5 blur-[100px] rounded-full" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Tips for a Winning Campaign</h2>
            <p className="text-slate-400 text-lg">We've helped thousands of champions hit their goals. Here's how.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-12">
            {successTips.map((tip, i) => (
              <div key={i} className="space-y-4">
                <div className="text-4xl font-black text-orange-500 opacity-30">0{i + 1}</div>
                <h3 className="text-xl font-bold">{tip.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campaign Form */}
      <section id="start" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-10 md:p-16">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                <Gift className="w-10 h-10" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Start Your Campaign</h2>
              <p className="text-slate-500 text-lg">
                Your page will be live and ready for donations in less than 5 minutes.
              </p>
            </div>
            
            <form className="space-y-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Campaign Title</label>
                <input type="text" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-orange-500 rounded-2xl focus:outline-none transition-all font-medium" placeholder="E.g. Sarah's 30th Birthday for Clean Water" />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Cause to Support</label>
                  <select className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-orange-500 rounded-2xl focus:outline-none transition-all font-medium appearance-none">
                    <option>General Fund (Greatest Need)</option>
                    <option>Food Security Program</option>
                    <option>Education & Literacy</option>
                    <option>Emergency Healthcare</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Fundraising Goal ($)</label>
                  <input type="number" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-orange-500 rounded-2xl focus:outline-none transition-all font-medium" placeholder="1000" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Your Story</label>
                <textarea rows={5} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-orange-500 rounded-2xl focus:outline-none transition-all font-medium resize-none" placeholder="Share why you're passionate about this cause..." />
              </div>

              <button type="submit" className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2">
                Launch My Fundraiser <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Final Call */}
      <section className="py-24 bg-orange-50 border-t border-orange-100">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">Can't start a fundraiser? <br/>Every share counts.</h2>
          <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto">
            Following us on social media and sharing our stories is a powerful way to help us reach new supporters.
          </p>
          <div className="flex justify-center gap-6">
            <a href="/donate" className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-2">
              Make a Direct Gift <Heart className="w-5 h-5 fill-current" />
            </a>
            <a href="/stories" className="px-10 py-5 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-bold hover:border-orange-500 hover:text-orange-600 transition-all flex items-center justify-center gap-2">
              Read Impact Stories <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
