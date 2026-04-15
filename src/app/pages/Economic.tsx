import { TrendingUp, DollarSign, Briefcase, Users, CheckCircle2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function Economic() {
  // const impacts = [
  //   { number: "800+", label: "Businesses Started" },
  //   { number: "2,500+", label: "People Trained" },
  //   { number: "$1.2M", label: "Microloans Disbursed" },
  //   { number: "92%", label: "Loan Repayment Rate" }
  // ];

  const programs = [
    {
      icon: Briefcase,
      title: "Skills Training",
      description: "Vocational training in trades like tailoring, carpentry, agriculture, and technology."
    },
    {
      icon: DollarSign,
      title: "Microfinance Support",
      description: "Small loans and financial literacy training to help entrepreneurs start businesses."
    },
    {
      icon: Users,
      title: "Business Development",
      description: "Mentorship and guidance for small business owners to scale their operations."
    },
    {
      icon: TrendingUp,
      title: "Market Linkages",
      description: "Connecting producers with markets and buyers for sustainable income growth."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1606077089119-92075161bb60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwd29ya3Nob3AlMjBza2lsbHMlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NzE5OTY3NDl8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Skills training workshop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Economic Empowerment</h1>
          <p className="text-xl md:text-2xl opacity-95">
            Creating sustainable livelihoods and breaking the cycle of poverty
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {impacts.map((impact, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{impact.number}</div>
                <div className="text-gray-600">{impact.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* About Program */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1752650736246-abae155278be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGVudHJlcHJlbmV1ciUyMHNtYWxsJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzcxOTk2Njk0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Woman entrepreneur"
                className="rounded-xl shadow-2xl"
              />
            </div>
            
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Building Economic Independence</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our Economic Empowerment Program equips individuals with the skills, resources, and support 
                needed to create sustainable income and achieve financial independence.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We believe in empowering people to lift themselves out of poverty through entrepreneurship, 
                skills development, and access to capital.
              </p>
              
              <div className="space-y-3">
                {[
                  "Free vocational and skills training",
                  "Microloans with fair interest rates",
                  "Business mentorship programs",
                  "Financial literacy workshops",
                  "Market access and networking support"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Programs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive economic empowerment initiatives designed to create lasting change
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {programs.map((program, index) => {
              const Icon = program.icon;
              return (
                <div key={index} className="bg-blue-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{program.title}</h3>
                  <p className="text-gray-600">{program.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-xl p-8 md:p-12 shadow-lg">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">From Trainee to Business Owner</h3>
            <p className="text-lg text-gray-700 mb-4">
              "I attended the tailoring training program and received a microloan to buy my first sewing 
              machine. Today, I employ three people and my business supports my entire family. I've even 
              started saving for my children's education. Crossborders gave me more than skills—they gave 
              me hope and a future."
            </p>
            <div className="flex items-center gap-4 mt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Amina Hassan</div>
                <div className="text-sm text-gray-600">Fashion Entrepreneur</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Invest in Entrepreneurship</h2>
          <p className="text-xl mb-8 opacity-95">
            Your support can help someone start a business and transform their community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/donate"
              className="px-8 py-4 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
            >
              Fund a Microloan
            </a>
            <a
              href="/volunteer"
              className="px-8 py-4 bg-orange-700 text-white rounded-lg font-semibold hover:bg-orange-800 transition-colors border-2 border-white"
            >
              Become a Mentor
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
