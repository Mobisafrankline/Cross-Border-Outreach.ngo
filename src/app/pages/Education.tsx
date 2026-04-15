import { BookOpen, Award, Users, Globe, CheckCircle2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function Education() {
  const impacts = [
    { number: "1,200+", label: "Students Enrolled" },
    { number: "85%", label: "Graduation Rate" },
    { number: "24", label: "Schools Supported" },
    { number: "150+", label: "Scholarships Awarded" }
  ];

  const programs = [
    {
      icon: BookOpen,
      title: "Primary Education Access",
      description: "Ensuring every child has access to quality primary education with proper resources and infrastructure."
    },
    {
      icon: Award,
      title: "Scholarship Programs",
      description: "Financial support for deserving students to pursue secondary and higher education."
    },
    {
      icon: Users,
      title: "Teacher Training",
      description: "Empowering educators with modern teaching methods and continuous professional development."
    },
    {
      icon: Globe,
      title: "Digital Literacy",
      description: "Equipping students with essential technology skills for the digital age."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1574132190990-cfd62178bb1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc3Jvb20lMjB0ZWFjaGVyJTIwY2hpbGRyZW4lMjBsZWFybmluZ3xlbnwxfHx8fDE3NzE5OTY3NDl8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Children learning in classroom"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Education Support</h1>
          <p className="text-xl md:text-2xl opacity-95">
            Empowering the next generation through quality education and learning opportunities
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
              Key achievements and metrics from our Education Support Program
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
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1770843093640-c44ae557928b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHN0dWR5aW5nJTIwZWR1Y2F0aW9uJTIwQWZyaWNhfGVufDF8fHx8MTc3MTk5NjY5Mnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Students studying"
                className="rounded-xl shadow-2xl"
              />
            </div>
            
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Building Brighter Futures</h2>
              <p className="text-lg text-gray-600 mb-6">
                Education is the cornerstone of sustainable development. Our Education Support Program 
                breaks down barriers to learning, ensuring every child has the opportunity to reach their full potential.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We provide comprehensive support including school supplies, infrastructure improvements, 
                teacher training, and scholarship opportunities to create lasting educational impact.
              </p>
              
              <div className="space-y-3">
                {[
                  "Free school supplies and textbooks",
                  "Infrastructure development and repairs",
                  "Qualified teacher recruitment and training",
                  "Technology and computer labs",
                  "After-school tutoring programs"
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Education Initiatives</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive programs designed to support students at every stage of their educational journey
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
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Success Story</h3>
            <p className="text-lg text-gray-700 mb-4">
              "Before Crossborders came to our village, many children couldn't attend school due to lack of 
              resources. Today, my daughter is in her final year of secondary school with a full scholarship 
              to university. Education has opened doors we never imagined possible."
            </p>
            <div className="flex items-center gap-4 mt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Sarah Kamau</div>
                <div className="text-sm text-gray-600">Parent & Community Leader</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Invest in Education, Transform Lives</h2>
          <p className="text-xl mb-8 opacity-95">
            Your support can give a child the gift of education and a brighter future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/donate"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
            >
              Sponsor a Student
            </a>
            <a
              href="/volunteer"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Become a Tutor
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}