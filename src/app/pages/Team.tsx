import { Mail, Linkedin, Users } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function Team() {
  const leadership = [
    { name: "Stanley Kamau", role: "Executive Director", image: "" },
    { name: "Gerold Njoroge", role: "Chief Financial Officer (CFO)", image: "" },
    { name: "Mary Njoroge", role: "Secretary", image: "" },
    { name: "Mobisa Frankie", role: "Digital Marketer & Head of IT", image: "" }
  ];

  return (
    <div className="min-h-screen pt-24">
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1585984968562-1443b72fb0dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Our team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Team</h1>
          <p className="text-xl md:text-2xl opacity-95">
            Dedicated professionals committed to creating change
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our experienced leaders bring expertise in humanitarian work,
              development, and community empowerment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
              >
                <div className="h-64 overflow-hidden bg-gray-200">
                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                    <Users className="w-24 h-24" />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 mb-4">{member.role}</p>

                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                    >
                      <Mail className="w-5 h-5 text-blue-600" />
                    </a>

                    <a
                      href="#"
                      className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                    >
                      <Linkedin className="w-5 h-5 text-blue-600" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Users className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Join Our Team
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            We're always looking for passionate individuals who want to make a
            difference. Explore career opportunities and join our mission.
          </p>

          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            View Open Positions
          </a>
        </div>
      </section>
    </div>
  );
}