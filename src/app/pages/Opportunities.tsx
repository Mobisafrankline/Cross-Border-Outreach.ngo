import { 
  MessageSquare, 
  Rocket,
  ArrowRight,
  ShieldCheck,
  Star,
  Target,
  CheckCircle2
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { getActiveJobs, createApplication, Job } from "../../lib/supabase";

export default function Opportunities() {
  const [appType, setAppType] = useState("volunteer");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    interest: 'Food Distribution',
    jobId: '',
    availability: 'Weekends',
    about: ''
  });

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await getActiveJobs();
      if (data) {
        setJobs(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, jobId: data[0].id }));
        }
      }
    };
    fetchJobs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const jobTitle = jobs.find(j => j.id === formData.jobId)?.title || '';

    const { error } = await createApplication({
      type: appType as 'volunteer' | 'job',
      job_id: appType === 'job' && formData.jobId ? formData.jobId : null,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      interest_or_position: appType === 'volunteer' ? formData.interest : jobTitle,
      availability: formData.availability,
      about: formData.about
    });

    setIsSubmitting(false);
    if (error) {
      console.error(error);
      setSubmitStatus('error');
    } else {
      setSubmitStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        interest: 'Food Distribution',
        jobId: jobs.length > 0 ? jobs[0].id : '',
        availability: 'Weekends',
        about: ''
      });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const journeySteps = [
    {
      icon: MessageSquare,
      title: "Get in Touch",
      desc: "Fill out the application below. We want to know your skills and what drives you."
    },
    {
      icon: Target,
      title: "Discovery Call",
      desc: "We'll have a quick chat to align your interests with our current community needs."
    },
    {
      icon: ShieldCheck,
      title: "Onboarding",
      desc: "Receive necessary training and clear standard safety checks for your specific role."
    },
    {
      icon: Rocket,
      title: "Launch Impact",
      desc: "Join your team on the field and start creating tangible change in people's lives."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1769837230054-7f3a7356dde1?q=80&w=2000&auto=format&fit=crop"
            alt="Volunteers working together"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-slate-900/90" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/30 backdrop-blur-md rounded-full border border-blue-400/30 mb-8">
              <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span className="text-sm font-bold tracking-widest uppercase">Join the Movement</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight font-playfair">
              Change Starts <br/>
              <span className="text-transparent bg-clip-text bg-blue-900 italic">With You.</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed mb-10 font-medium font-source-serif">
              Give your time, share your skills, and become a catalyst for sustainable change in communities worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#apply" className="px-8 py-4 bg-white text-slate-900 rounded-3xl font-bold hover:bg-blue-50 transition-all shadow-xl flex items-center justify-center gap-2">
                Apply to Volunteer <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#opportunities" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-3xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                View Roles
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Journey Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-playfair">Your Volunteer Journey</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-source-serif">
              We've designed a simple, supportive process to get you from application to making a real impact.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 z-0" />
            
            {journeySteps.map((step, i) => (
              <div key={i} className="relative z-10 group">
                <div className="w-24 h-24 bg-white rounded-[2rem] shadow-lg shadow-slate-200 border border-slate-100 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <step.icon className="w-10 h-10" />
                </div>
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-black shadow-lg">
                  {i + 1}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3 font-playfair">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-source-serif">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-24 bg-blue-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-800/20 -skew-x-12 transform translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 text-white">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight font-playfair">Ready to join <br/>the family?</h2>
              <p className="text-xl text-blue-100 mb-10 leading-relaxed opacity-90 font-source-serif">
                Complete the application and our volunteer coordinator will reach out to schedule an introductory call.
              </p>
              
              <div className="space-y-6">
                {[
                  "No prior experience required for most roles",
                  "Receive certificates for your service hours",
                  "Regular training and growth workshops",
                  "Global community of passionate change-makers"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-blue-50 text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative">
                {submitStatus === 'success' && (
                  <div className="absolute top-0 left-0 w-full p-4 bg-sky-500 text-white text-center font-bold rounded-t-[2.5rem]">
                    Application submitted successfully! We'll be in touch soon.
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="absolute top-0 left-0 w-full p-4 bg-red-500 text-white text-center font-bold rounded-t-[2.5rem]">
                    Failed to submit application. Please try again.
                  </div>
                )}
                <form className={`space-y-6 ${submitStatus !== 'idle' ? 'mt-8' : ''}`} onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">First Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-3xl focus:outline-none transition-all font-medium" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Last Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-3xl focus:outline-none transition-all font-medium" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-3xl focus:outline-none transition-all font-medium" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Application Type</label>
                    <select 
                      value={appType}
                      onChange={(e) => setAppType(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-3xl focus:outline-none transition-all font-medium appearance-none"
                    >
                      <option value="volunteer">Volunteer (Always Open)</option>
                      <option value="job">Job Opening</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        {appType === 'volunteer' ? 'Primary Interest' : 'Position Applied For'}
                      </label>
                      {appType === 'volunteer' ? (
                        <select 
                          value={formData.interest}
                          onChange={(e) => setFormData({...formData, interest: e.target.value})}
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-3xl focus:outline-none transition-all font-medium appearance-none"
                        >
                          <option>Food Distribution</option>
                          <option>Education & Tutoring</option>
                          <option>Healthcare Support</option>
                          <option>Digital Advocacy</option>
                        </select>
                      ) : (
                        <select 
                          required
                          value={formData.jobId}
                          onChange={(e) => setFormData({...formData, jobId: e.target.value})}
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-3xl focus:outline-none transition-all font-medium appearance-none"
                        >
                          {jobs.length === 0 ? (
                            <option value="">No open jobs at the moment</option>
                          ) : (
                            jobs.map(job => (
                              <option key={job.id} value={job.id}>{job.title}</option>
                            ))
                          )}
                        </select>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Availability</label>
                      <select 
                        value={formData.availability}
                        onChange={(e) => setFormData({...formData, availability: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-3xl focus:outline-none transition-all font-medium appearance-none"
                      >
                        <option>Weekends</option>
                        <option>Weekdays (Evenings)</option>
                        <option>Full-time / Flexible</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      {appType === 'job' ? 'About You & Resume/LinkedIn Link' : 'About You'}
                    </label>
                    <textarea 
                      rows={4} 
                      value={formData.about}
                      onChange={(e) => setFormData({...formData, about: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-3xl focus:outline-none transition-all font-medium resize-none" 
                      placeholder="Tell us about your background and why you want to join..." 
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting || (appType === 'job' && jobs.length === 0)}
                    className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Quote */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative">
            <div className="absolute -top-12 -left-12 text-blue-100 opacity-50">
              <MessageSquare className="w-48 h-48" />
            </div>
            <div className="relative z-10 text-center">
              <p className="text-2xl md:text-4xl font-bold text-slate-800 leading-tight mb-10">
                "Volunteering here hasn't just allowed me to help others; it's completely reshaped my perspective on community and global responsibility."
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full border-4 border-slate-50 flex items-center justify-center text-white text-xl font-black shadow-xl">
                  JM
                </div>
                <div className="text-left">
                  <div className="font-black text-slate-900 text-xl tracking-tight leading-none">Jennifer Martinez</div>
                  <div className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Education Lead, 3 Years</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

