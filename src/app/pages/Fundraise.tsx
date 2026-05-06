import { Gift, Users, TrendingUp, Share2, CheckCircle2, Calendar } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function Fundraise() {
  const fundraisingIdeas = [
    {
      icon: Calendar,
      title: "Birthday Fundraiser",
      description: "Celebrate your special day by asking friends and family to donate instead of gifts"
    },
    {
      icon: Users,
      title: "Community Event",
      description: "Organize a local event like a bake sale, car wash, or fun run"
    },
    {
      icon: TrendingUp,
      title: "Challenge Campaign",
      description: "Set a personal challenge and ask supporters to sponsor you"
    },
    {
      icon: Gift,
      title: "Memorial Fundraiser",
      description: "Honor a loved one's memory by raising funds in their name"
    }
  ];

  const activeCampaigns = [
    { name: "Sarah's Birthday for Education", raised: "$2,450", goal: "$3,000", supporters: 42 },
    { name: "Marathon for Healthcare", raised: "$5,200", goal: "$5,000", supporters: 68 },
    { name: "Community Bake Sale", raised: "$850", goal: "$1,000", supporters: 23 }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1769837230424-bf083c309ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdW5kcmFpc2luZyUyMGV2ZW50JTIwY2hhcml0eSUyMGdhdGhlcmluZ3xlbnwxfHx8fDE3NzE5OTY4OTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Fundraising event"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/90 to-orange-800/70" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Start a Fundraiser</h1>
          <p className="text-xl md:text-2xl opacity-95">
            Rally your community to support life-changing programs
          </p>
        </div>
      </section>

      {/* Why Fundraise Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Be a Champion for Change</h2>
              <p className="text-lg text-gray-600 mb-6">
                Starting a fundraiser is a powerful way to multiply your impact. By mobilizing your 
                network, you can help us reach more families and create lasting change in communities.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Whether it's for your birthday, a special occasion, or just because you care—every 
                fundraiser makes a difference.
              </p>
              
              <div className="space-y-3">
                {[
                  "Easy-to-use fundraising platform",
                  "Personalized campaign page",
                  "Social media sharing tools",
                  "Real-time donation tracking",
                  "Tax receipts for all donors",
                  "Dedicated support from our team"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1585984968562-1443b72fb0dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwdGVhbSUyMGNvbGxhYm9yYXRpb24lMjBub25wcm9maXR8ZW58MXx8fHwxNzcxOTI1NzQwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Team collaboration"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Fundraising Ideas */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fundraising Ideas</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get inspired by these popular fundraising approaches
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fundraisingIdeas.map((idea, index) => {
              const Icon = idea.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{idea.title}</h3>
                  <p className="text-gray-600 text-sm">{idea.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* Start Campaign Form */}
      <section className="py-20 bg-orange-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <Gift className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Your Campaign</h2>
              <p className="text-lg text-gray-600">
                Create your personalized fundraising page in minutes
              </p>
            </div>
            
            <form className="space-y-6">
              <input
                type="text"
                placeholder="Campaign Title"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
              />

              <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none">
                <option value="">Select a Program to Support</option>
                <option value="food">Food Support</option>
                <option value="education">Education Support</option>
                <option value="healthcare">Healthcare Outreach</option>
                <option value="economic">Economic Empowerment</option>
                <option value="general">General Fund</option>
              </select>

              <input
                type="number"
                placeholder="Fundraising Goal ($)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
              />

              <textarea
                rows={5}
                placeholder="Tell your story - why are you fundraising for Crossborders?"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none resize-none"
              />

              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Create Fundraiser
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Tips for Success</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Set a Realistic Goal",
                description: "Start with an achievable target you can reach with your network"
              },
              {
                title: "Share Your Story",
                description: "Personal stories inspire donations—tell why this cause matters to you"
              },
              {
                title: "Use Social Media",
                description: "Share your campaign across all your social platforms regularly"
              },
              {
                title: "Thank Your Donors",
                description: "Show appreciation with personal thank you messages"
              },
              {
                title: "Provide Updates",
                description: "Keep donors engaged with progress updates and impact stories"
              },
              {
                title: "Make the First Donation",
                description: "Kick off your campaign with your own contribution"
              }
            ].map((tip, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-600">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
