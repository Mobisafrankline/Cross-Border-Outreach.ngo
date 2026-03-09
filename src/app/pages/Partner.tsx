import { Handshake, Building2, TrendingUp, Users, CheckCircle2, Mail } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function Partner() {
  const partnershipTypes = [
    {
      icon: Building2,
      title: "Corporate Partnerships",
      description: "Align your company with impactful causes through sponsorships, employee engagement, and CSR initiatives.",
      benefits: [
        "Brand visibility and recognition",
        "Employee volunteer opportunities",
        "Tax benefits and social impact reporting",
        "Custom partnership packages"
      ]
    },
    {
      icon: Users,
      title: "Community Organizations",
      description: "Collaborate with us to amplify impact through joint programs and resource sharing.",
      benefits: [
        "Shared resources and expertise",
        "Broader community reach",
        "Joint funding opportunities",
        "Capacity building support"
      ]
    },
    {
      icon: TrendingUp,
      title: "Foundation Partnerships",
      description: "Strategic grants and program funding to scale our impact and reach more communities.",
      benefits: [
        "Transparent impact reporting",
        "Co-branded initiatives",
        "Regular program updates",
        "Long-term sustainability focus"
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1745847768380-2caeadbb3b71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBhcnRuZXJzaGlwJTIwaGFuZHNoYWtlJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NzE5MzA3ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Partnership collaboration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Partner With Us</h1>
          <p className="text-xl md:text-2xl opacity-95">
            Together, we can create greater impact and reach more communities in need
          </p>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Partnership Opportunities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how your organization can collaborate with us for maximum social impact
            </p>
          </div>

          <div className="space-y-12">
            {partnershipTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-2xl p-8 md:p-12">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">{type.title}</h3>
                      <p className="text-lg text-gray-600 mb-6">{type.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-3">
                        {type.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Current Partners */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Partners</h2>
            <p className="text-xl text-gray-600">
              Proud to collaborate with these organizations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-8 flex items-center justify-center aspect-square shadow-md hover:shadow-lg transition-shadow">
                <div className="text-gray-400 text-center">
                  <Building2 className="w-12 h-12 mx-auto mb-2" />
                  <span className="text-sm">Partner Logo</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Inquiry Form */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-blue-50 rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <Mail className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Let's Collaborate</h2>
              <p className="text-lg text-gray-600">
                Fill out this form and our partnerships team will contact you within 48 hours
              </p>
            </div>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Organization Name"
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
                />
                <input
                  type="text"
                  placeholder="Contact Person"
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
                />
              </div>

              <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white">
                <option value="">Partnership Type</option>
                <option value="corporate">Corporate Partnership</option>
                <option value="community">Community Organization</option>
                <option value="foundation">Foundation/Grant</option>
                <option value="other">Other</option>
              </select>

              <textarea
                rows={5}
                placeholder="Tell us about your organization and how you'd like to partner with us"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none bg-white"
              />

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Submit Partnership Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <Handshake className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">Ready to Make an Impact Together?</h2>
          <p className="text-xl mb-8 opacity-95">
            Let's discuss how we can create meaningful change through strategic partnership
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
          >
            Contact Our Team
          </a>
        </div>
      </section>
    </div>
  );
}
