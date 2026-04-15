import { Heart, TrendingUp, Users, Quote, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import Rescue from "../../assets/3.jpeg";

export default function ImpactStories() {
  const stories = [
    {
  title: "A Day of Hope at Murang’a Rescue Centre",
  category: "Education Support",
  image: Rescue,
  quote: "I used to share one book with my friend. Now I can write my own notes.",
  impact: "Children at Murang’a Rescue Centre received learning materials and encouragement to support their education and future dreams.",
  story: `
On 28th February 2026, the Crossborder Outreach team visited Murang’a Rescue Centre to support vulnerable children through the donation of learning materials and basic logistical support.

The visit brought joy, encouragement, and hope to the children. For many, receiving simple items like exercise books and pens meant a chance to learn with confidence.

Through shared activities, conversations, and laughter, the team reminded the children that they are valued, supported, and not alone.
  `
},
   {
  id: 5,
  title: "Standing Together During the Nairobi Floods",
  category: "Disaster Response",
  image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1080&q=80",
  quote: "When the floods came, we thought we were alone. Seeing people come to help gave us hope again.",
  impact: "Community support efforts helped raise awareness, encourage preparedness, and stand with families affected by the devastating Nairobi floods.",
  story: `
Heavy rains in Nairobi caused severe flooding that displaced families, damaged homes, and disrupted daily life across many neighborhoods.

During the crisis, communities came together to support one another, forming rescue chains, sharing resources, and helping stranded residents reach safety.

Crossborder Outreach used the moment to promote compassion, unity, and disaster preparedness, reminding communities that collective action and care can help rebuild hope even after disaster.
  `
},
{
  id: 6,
  title: "Beyond Grades: Supporting Students’ Mental Health",
  category: "Mental Health",
  image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1080&q=80",
  quote: "Sometimes students don’t fail because they are incapable, but because they are silently struggling.",
  impact: "Mental health awareness initiatives help students feel heard, supported, and empowered to succeed beyond academic pressure.",
  story: `
Academic success is important, but mental wellbeing is just as critical for students.

Many young people silently struggle with stress, anxiety, and overwhelming expectations. Crossborder Outreach advocates for safe spaces where students can speak openly and receive guidance.

Through mentorship, awareness campaigns, and community dialogue, the mission encourages families and institutions to care about emotional wellbeing as much as academic achievement.
  `
},
    {
      title: "A New Life: Grace's Healthcare Miracle",
      category: "Healthcare",
      image: "https://images.unsplash.com/photo-1770221797840-8f5a095ad7ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMG91dHJlYWNofGVufDF8fHx8MTc3MTk5NjY5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      quote: "The mobile clinic saved my life. I had been sick for months but couldn't afford to travel to the hospital.",
      impact: "Grace received timely treatment for a treatable condition and now volunteers with the mobile clinic to help others."
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1770922807878-ec02fed1d0c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWNjZXNzJTIwc3RvcnklMjBjZWxlYnJhdGlvbiUyMGFjaGlldmVtZW50fGVufDF8fHx8MTc3MTk5NzAxNXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Success stories"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Impact Stories</h1>
          <p className="text-xl md:text-2xl opacity-95">Real lives, real change, real impact</p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-20">
            {stories.map((story, index) => (
              <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                    {story.category}
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">{story.title}</h2>
                  
                  <div className="bg-blue-50 rounded-xl p-6 mb-6">
                    <Quote className="w-10 h-10 text-blue-600 mb-4" />
                    <p className="text-lg text-gray-700 italic mb-4">"{story.quote}"</p>
                  </div>
                  
                  <p className="text-lg text-gray-600 mb-6">{story.impact}</p>
                  
                  <a href="#" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700">
                    Read Full Story <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
                
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <ImageWithFallback
                    src={story.image}
                    alt={story.title}
                    className="rounded-xl shadow-2xl"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Heart className="w-16 h-16 text-orange-500 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Your Support Creates These Stories</h2>
          <p className="text-xl text-gray-600 mb-8">Every donation, every hour volunteered, every partnership creates ripple effects of positive change.</p>
          <a href="/donate" className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg">
            Make an Impact Today
          </a>
        </div>
      </section>
    </div>
  );
}
