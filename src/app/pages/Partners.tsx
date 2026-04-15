import { Building2, Handshake, Heart } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function Partners() {
  const partnerCategories = [
    { name: "Corporate Partners", count: 2 },
    { name: "Foundation Partners", count: 1 },
    { name: "Community Organizations", count: 2 },
    { name: "Government Agencies", count: 2 }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1745847768380-2caeadbb3b71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBhcnRuZXJzaGlwJTIwaGFuZHNoYWtlJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NzE5MzA3ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Partners"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Partners</h1>
          <p className="text-xl md:text-2xl opacity-95">Together, we create greater impact</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center mb-16">
          <p className="text-xl text-gray-600">
            We collaborate with leading organizations, foundations, and companies who share our commitment 
            to creating sustainable change in communities around the world.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {partnerCategories.map((category, index) => (
              <div key={index} className="bg-blue-50 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{category.count}</div>
                <div className="text-gray-700">{category.name}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(16)].map((_, index) => (
              <div key={index} className="bg-white border-2 border-gray-100 rounded-lg p-8 flex items-center justify-center aspect-square hover:border-blue-200 hover:shadow-md transition-all">
                <div className="text-gray-300 text-center">
                  <Building2 className="w-12 h-12 mx-auto mb-2" />
                  <span className="text-xs">Partner Logo</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Handshake className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Become a Partner</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join us in making a lasting impact. Let's discuss how we can work together.
          </p>
          <a href="/partner" className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg">
            Partner With Us
          </a>
        </div>
      </section>
    </div>
  );
}
