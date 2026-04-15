import { Heart, Clock, MapPin, Users, CheckCircle2, Calendar } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function Volunteer() {
  const opportunities = [
    {
      title: "Food Distribution Volunteer",
      location: "Various Locations",
      time: "4-8 hours/week",
      description: "Help prepare and distribute meals to families in need"
    },
    {
      title: "Education Tutor",
      location: "Community Centers",
      time: "2-6 hours/week",
      description: "Provide tutoring and academic support to students"
    },
    {
      title: "Healthcare Assistant",
      location: "Mobile Clinics",
      time: "8+ hours/week",
      description: "Support medical teams during community health outreach"
    },
    {
      title: "Skills Training Instructor",
      location: "Training Centers",
      time: "Flexible",
      description: "Teach vocational skills like carpentry, tailoring, or technology"
    },
    {
      title: "Event Coordinator",
      location: "Remote/On-site",
      time: "Project-based",
      description: "Help organize fundraising events and community programs"
    },
    {
      title: "Social Media Ambassador",
      location: "Remote",
      time: "2-4 hours/week",
      description: "Share our stories and engage supporters online"
    }
  ];

  const benefits = [
    "Make a meaningful difference in communities",
    "Gain valuable hands-on experience",
    "Connect with like-minded individuals",
    "Receive training and certifications",
    "Flexible scheduling options",
    "Recognition and appreciation events"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1769837230054-7f3a7356dde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXJzJTIwY29tbXVuaXR5JTIwc2VydmljZSUyMHRlYW13b3JrfGVufDF8fHx8MTc3MTk5Njg5M3ww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Volunteers working together"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Volunteer With Us</h1>
          <p className="text-xl md:text-2xl opacity-95">
            Join our community of passionate volunteers making a real difference
          </p>
        </div>
      </section>

      {/* Why Volunteer Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Volunteer?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Volunteering with Crossborders Outreach Ministry is more than giving your time—it's 
                about being part of a movement that transforms lives and builds stronger communities.
              </p>
              
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1764738130382-cc7a8eaf26c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodW1hbml0YXJpYW4lMjBhaWQlMjB2b2x1bnRlZXJzJTIwaGVscGluZyUyMGNvbW11bml0eXxlbnwxfHx8fDE3NzE5OTY2OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Volunteers helping"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Current Opportunities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find the perfect volunteer role that matches your skills and availability
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {opportunities.map((opportunity, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{opportunity.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{opportunity.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{opportunity.time}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{opportunity.description}</p>
                
                <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How to Get Started</h2>
            <p className="text-xl text-gray-600">Simple steps to begin your volunteer journey</p>
          </div>

          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Submit Application",
                description: "Fill out our online volunteer application form with your information and interests"
              },
              {
                step: "2",
                title: "Orientation & Training",
                description: "Attend our volunteer orientation and receive training specific to your role"
              },
              {
                step: "3",
                title: "Background Check",
                description: "Complete a simple background check to ensure community safety (required for certain roles)"
              },
              {
                step: "4",
                title: "Start Making a Difference",
                description: "Begin your volunteer work and become part of our mission-driven community"
              }
            ].map((item, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Form Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Volunteer Application</h2>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="First Name"
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />

              <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none">
                <option value="">Select Area of Interest</option>
                <option value="food">Food Distribution</option>
                <option value="education">Education Support</option>
                <option value="healthcare">Healthcare</option>
                <option value="economic">Economic Empowerment</option>
                <option value="events">Event Coordination</option>
                <option value="marketing">Marketing & Communications</option>
              </select>

              <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none">
                <option value="">Availability</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="flexible">Flexible</option>
              </select>

              <textarea
                rows={4}
                placeholder="Tell us about your skills, experience, and why you want to volunteer with us"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
              />

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-blue-50 rounded-xl p-8 md:p-12">
            <div className="flex items-start gap-4 mb-6">
              <Heart className="w-12 h-12 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-lg text-gray-700 mb-4 italic">
                  "Volunteering with Crossborders has been the most rewarding experience of my life. 
                  Seeing the direct impact of our work on families and children motivates me every day. 
                  I've found a community of people who truly care about making a difference."
                </p>
                <div>
                  <div className="font-semibold text-gray-900">Jennifer Martinez</div>
                  <div className="text-sm text-gray-600">Education Volunteer, 2 years</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
