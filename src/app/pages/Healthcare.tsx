import { Heart, Activity, Stethoscope, Shield, CheckCircle2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function Healthcare() {
  // const impacts = [
  //   { number: "15,000+", label: "Patients Treated" },
  //   { number: "300+", label: "Monthly Consultations" },
  //   { number: "8", label: "Mobile Clinics" },
  //   { number: "98%", label: "Patient Satisfaction" }
  // ];

  const services = [
    {
      icon: Stethoscope,
      title: "Primary Healthcare",
      description: "Comprehensive medical consultations, diagnosis, and treatment for common illnesses."
    },
    {
      icon: Shield,
      title: "Preventive Care",
      description: "Vaccinations, health screenings, and education programs to prevent disease."
    },
    {
      icon: Activity,
      title: "Maternal & Child Health",
      description: "Prenatal care, safe deliveries, and pediatric services for mothers and children."
    },
    {
      icon: Heart,
      title: "Mental Health Support",
      description: "Counseling and psychological support services for emotional wellbeing."
    }
  ];

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1758691462413-b07dee2933fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBleGFtaW5pbmclMjBwYXRpZW50JTIwY2xpbmljfGVufDF8fHx8MTc3MTk5Njc0OXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Healthcare services"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Healthcare Outreach</h1>
          <p className="text-xl md:text-2xl opacity-95">
            Delivering essential medical care and wellness programs to underserved communities
          </p>
        </div>
      </section>

      {/* Impact Stats
      <section className="py-16 bg-white">
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
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Accessible Healthcare for All</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our Healthcare Outreach Program brings quality medical services to communities with 
                limited access to healthcare facilities. We believe health is a fundamental human right.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Through mobile clinics, community health workers, and partnerships with local medical 
                professionals, we provide comprehensive healthcare services where they're needed most.
              </p>
              
              <div className="space-y-3">
                {[
                  "Free medical consultations and treatment",
                  "Essential medications at no cost",
                  "Mobile clinics reaching remote areas",
                  "Health education and prevention programs",
                  "Emergency medical response"
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
                src="https://images.unsplash.com/photo-1770221797840-8f5a095ad7ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMG91dHJlYWNofGVufDF8fHx8MTc3MTk5NjY5M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Medical outreach"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Healthcare Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive medical care addressing the diverse health needs of communities
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-blue-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Story */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-xl p-8 md:p-12 shadow-lg">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Lives Saved</h3>
            <p className="text-lg text-gray-700 mb-4">
              "When my mother fell ill, we had no way to reach the hospital 50 kilometers away. 
              The Crossborders mobile clinic came to our village, diagnosed her diabetes, and provided 
              the medication she needed. They saved her life and continue to monitor her health monthly."
            </p>
            <div className="flex items-center gap-4 mt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Emmanuel Mensah</div>
                <div className="text-sm text-gray-600">Community Beneficiary</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Support Life-Saving Healthcare</h2>
          <p className="text-xl mb-8 opacity-95">
            Your donation provides essential medical care to those who need it most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/donate"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
            >
              Make a Donation
            </a>
            <a
              href="/volunteer"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Join Our Medical Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
