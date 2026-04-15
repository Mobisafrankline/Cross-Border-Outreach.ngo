import { Heart, Users, Package, TrendingUp, CheckCircle2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function FoodSupport() {
  const impacts = [
    { number: "25,000+", label: "Meals Served Monthly" },
    { number: "500+", label: "Families Supported" },
    { number: "12", label: "Distribution Centers" },
    { number: "95%", label: "Nutritional Standards Met" }
  ];

  const programs = [
    {
      icon: Package,
      title: "Emergency Food Relief",
      description: "Immediate assistance for families facing crisis situations with nutritious food packages."
    },
    {
      icon: Users,
      title: "Community Feeding Programs",
      description: "Hot meals served daily at community centers to ensure no one goes hungry."
    },
    {
      icon: TrendingUp,
      title: "Sustainable Agriculture",
      description: "Training and resources to help communities grow their own food sustainably."
    },
    {
      icon: Heart,
      title: "Child Nutrition Initiative",
      description: "Special programs ensuring children receive balanced, nutritious meals for healthy development."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1762418967948-a243e94dd789?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3VwJTIwa2l0Y2hlbiUyMG1lYWwlMjBwcmVwYXJhdGlvbiUyMHZvbHVudGVlcnN8ZW58MXx8fHwxNzcxOTk2NzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Food distribution"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Food Support Program</h1>
          <p className="text-xl md:text-2xl opacity-95">
            Fighting hunger and malnutrition through sustainable food security initiatives
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">

          {/* Title & Subtitle */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Our Impact Projection</h2>
            <p className="text-gray-600 mt-2">
              Key achievements and metrics from our Food Support Program
            </p>
          </div>

          {/* Impact Cards */}
          <div className="grid md:grid-cols-4 gap-8">
            {impacts.map((impact, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{impact.number}</div>
                <div className="text-gray-600">{impact.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Program */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Nourishing Communities</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our Food Support Program addresses both immediate hunger needs and long-term food security. 
                We believe everyone deserves access to nutritious, culturally appropriate food.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Through partnerships with local farmers, food banks, and community organizations, we ensure 
                sustainable solutions that empower communities to achieve food independence.
              </p>
              <div className="space-y-3">
                {[
                  "Nutritionally balanced meal packages",
                  "Culturally appropriate food options",
                  "Fresh produce from local sources",
                  "Dietary accommodations for special needs"
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
                src="https://images.unsplash.com/photo-1710092784814-4a6f158913b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGlzdHJpYnV0aW9uJTIwY2hhcml0eSUyMHZvbHVudGVlcnN8ZW58MXx8fHwxNzcxOTk2NjkzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Food distribution volunteers"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Initiatives</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive food security programs designed to meet diverse community needs
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Help Us Feed More Families</h2>
          <p className="text-xl mb-8 opacity-95">
            Your donation can provide nutritious meals to families in need. Every contribution makes a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/donate"
              className="px-8 py-4 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
            >
              Donate Now
            </a>
            <a
              href="/volunteer"
              className="px-8 py-4 bg-orange-700 text-white rounded-lg font-semibold hover:bg-orange-800 transition-colors border-2 border-white"
            >
              Volunteer With Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}