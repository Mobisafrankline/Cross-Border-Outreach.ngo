import { useParams, Link, useNavigate } from "react-router";
import { 
  Calendar, MapPin, Clock, Users, Mail, Phone, 
  ArrowLeft, CheckCircle, ExternalLink, Share2,
  CalendarDays, Map as MapIcon, Info, Sparkles, FileText
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { events } from "../../data/content";
import { useEffect } from "react";
import { motion } from "motion/react";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const event = events.find(e => e.id === Number(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mb-6">
          <Info className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Event Not Found</h1>
        <p className="text-slate-600 mb-8 text-center max-w-md">
          The event you are looking for might have been moved or is no longer available.
        </p>
        <Link to="/events" className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all">
          Back to Events
        </Link>
      </div>
    );
  }

  const isUpcoming = event.status === "upcoming";
  const availabilityPercent = Math.round((event.registered / event.capacity) * 100);

  const formatDate = (dateString: string) => {
    if (dateString === "TBD") return "To Be Determined";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ── Top Navigation Bar ── */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/events')}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-bold text-sm transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Events
          </button>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            {isUpcoming && (
              <button className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
                Register Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Hero Section ── */}
      <section className="relative h-[400px] md:h-[600px] overflow-hidden">
        <ImageWithFallback
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                  {event.category}
                </span>
                {isUpcoming ? (
                  <span className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Upcoming Event
                  </span>
                ) : (
                  <span className="px-4 py-1.5 bg-slate-700 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-2 border border-white/20">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Past Event
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight drop-shadow-2xl max-w-4xl">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm md:text-lg font-medium">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  {event.location}
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-blue-400" />
                  {formatDate(event.date)}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Content Grid ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Content Area */}
            <div className="lg:col-span-8">
              <div className="prose prose-slate prose-lg max-w-none">
                <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <span className="w-2 h-10 bg-blue-600 rounded-full" />
                  About the Event
                </h2>
                <div className="text-slate-600 leading-relaxed space-y-6 text-xl">
                  {event.longDescription.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              {/* Gallery / Impact Highlights (Simulated) */}
              <div className="mt-16 pt-16 border-t border-slate-100">
                <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                  Impact Highlights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                    <div className="text-4xl font-black text-blue-600 mb-2">
                      {event.registered}+
                    </div>
                    <div className="text-lg font-bold text-slate-900 mb-2">Lives Impacted</div>
                    <p className="text-slate-500 text-sm italic">Direct community reach through this specific program.</p>
                  </div>
                  <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                    <div className="text-4xl font-black text-emerald-600 mb-2">
                      100%
                    </div>
                    <div className="text-lg font-bold text-slate-900 mb-2">Goal Reached</div>
                    <p className="text-slate-500 text-sm italic">Successfully delivered all planned resources and services.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Registration/Ticket Card */}
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl p-8 sticky top-24">
                <div className="text-center mb-8">
                  <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Ticket Price</div>
                  <div className="text-5xl font-black text-blue-600">{event.ticketPrice}</div>
                </div>

                <div className="space-y-6 mb-10">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Schedule</div>
                      <div className="font-bold text-slate-900">{event.time}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                      <MapIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Address</div>
                      <div className="font-bold text-slate-900 leading-tight">{event.address}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Attendance</div>
                        <span className="text-xs font-bold text-blue-600">{availabilityPercent}% Filled</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                          style={{ width: `${availabilityPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {isUpcoming ? (
                  <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3">
                    Register Now
                    <ExternalLink className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="w-full py-5 bg-slate-100 text-slate-400 rounded-2xl font-black text-lg flex items-center justify-center gap-3 cursor-not-allowed grayscale">
                    <CheckCircle className="w-5 h-5" />
                    Event Completed
                  </div>
                )}

                {/* Organizer Info */}
                <div className="mt-10 pt-10 border-t border-slate-50">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Organizer</div>
                      <div className="font-bold text-slate-900">{event.organizer}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <a href={`tel:${event.contactPhone}`} className="flex flex-col items-center gap-2 p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl transition-colors group">
                      <Phone className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest group-hover:text-blue-600">Call</span>
                    </a>
                    <a href={`mailto:${event.contactEmail}`} className="flex flex-col items-center gap-2 p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl transition-colors group">
                      <Mail className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest group-hover:text-blue-600">Email</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-24 bg-blue-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] -ml-64 -mb-64" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
            Can't Attend? <br/>
            <span className="text-blue-400">You Can Still Support Us.</span>
          </h2>
          <p className="text-xl text-blue-100/80 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
            Your donations help us fund these essential programs and extend our reach to even more communities in need.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/donate" className="w-full sm:w-auto px-10 py-5 bg-white text-blue-900 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all shadow-xl">
              Make a Donation
            </Link>
            <Link to="/contact" className="w-full sm:w-auto px-10 py-5 bg-blue-800 text-white border border-blue-700 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
