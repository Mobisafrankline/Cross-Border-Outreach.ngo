import { Target, Eye, Heart, CheckCircle2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function Mission() {
  return (
    <div className="min-h-screen pt-24">
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1610540604745-3e96fba9ccef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaXNzaW9uJTIwdmlzaW9uJTIwdGFyZ2V0JTIwZ29hbCUyMGJ1c2luZXNzfGVufDF8fHx8MTc3MTk5NzAxNnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Mission"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Mission & Vision</h1>
          <p className="text-xl md:text-2xl opacity-95">Our purpose, our promise, our path forward</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-blue-50 rounded-2xl p-8">
              <Target className="w-16 h-16 text-blue-600 mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700">
                To transform lives and build sustainable communities through compassionate outreach, 
                providing essential support in food security, education, healthcare, and economic empowerment 
                to underserved populations across borders.
              </p>
            </div>

            <div className="bg-orange-50 rounded-2xl p-8">
              <Eye className="w-16 h-16 text-orange-600 mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-lg text-gray-700">
                A world where every person, regardless of their circumstances or location, has access to 
                the fundamental resources needed to thrive—nutritious food, quality education, healthcare, 
                and economic opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Compassion", description: "We lead with empathy and understanding in all our interactions" },
              { title: "Integrity", description: "We maintain transparency and accountability in every action" },
              { title: "Dignity", description: "We respect and honor the inherent worth of every individual" },
              { title: "Sustainability", description: "We create long-term solutions that empower communities" },
              { title: "Partnership", description: "We collaborate with local communities to ensure lasting impact" },
              { title: "Excellence", description: "We strive for the highest quality in all our programs and services" }
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Commitment</h2>
          <div className="space-y-4">
            {[
              "Serve with dignity and respect for all beneficiaries",
              "Maintain 100% transparency in our operations and finances",
              "Partner with local communities for sustainable solutions",
              "Measure and report our impact regularly",
              "Continuously improve our programs based on feedback",
              "Advocate for systemic change that addresses root causes"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4 bg-blue-50 rounded-lg p-4">
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
