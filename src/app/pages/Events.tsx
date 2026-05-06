import { Calendar, MapPin, Clock, Users, Mail, Phone, ArrowRight, Sparkles, Globe, Bookmark, FileText, CheckCircle, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { events } from "../../data/content";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";

export default function Events() {
  // Combine events: Upcoming first, then Past
  const displayEvents = [
    ...events.filter(event => event.status === "upcoming"),
    ...events.filter(event => event.status === "past")
  ];

  const formatDate = (dateString: string) => {
    if (dateString === "TBD") return "To Be Determined";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getAvailabilityPercent = (registered: number, capacity: number) => {
    return Math.round((registered / capacity) * 100);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero Section ── */}
      <section className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
            alt="Events"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-blue-900/80 to-blue-900" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-widest mb-6">
              <Calendar className="w-3.5 h-3.5" /> Our Schedule
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-2xl">
              Our <span className="text-blue-400">Impact Events</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed font-medium">
              Join us in our journey of transformation. From local outreach to international summits, explore how you can be part of the change.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Events Container ── */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                Upcoming & Recent <span className="text-blue-600">Gatherings</span>
              </h2>
              <div className="w-20 h-1.5 bg-blue-600 rounded-full mb-6"></div>
              <p className="text-lg text-gray-500 leading-relaxed">
                Discover the latest opportunities to volunteer, partner, and witness the direct impact of our cross-border missions.
              </p>
            </div>
            
            <div className="flex gap-4">
               <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Across 3 Countries</span>
               </div>
            </div>
          </div>

          <motion.div layout>
            <AnimatePresence mode="popLayout">
              {displayEvents.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-[3rem] p-24 text-center border-2 border-dashed border-gray-200"
                >
                  <div className="w-20 h-20 bg-gray-100 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No events scheduled yet</h3>
                  <p className="text-gray-500">Our team is currently planning our next major outreach.</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {displayEvents.map((event, index) => {
                    const availabilityPercent = getAvailabilityPercent(event.registered, event.capacity);
                    const isUpcoming = event.status === "upcoming";
                    
                    return (
                      <motion.div 
                        key={event.id}
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:border-blue-100 hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative"
                      >
                        <div className="relative h-64 overflow-hidden bg-gray-50">
                          <ImageWithFallback
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                          
                          <div className="absolute top-6 left-6 flex gap-2">
                            <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                              {event.category}
                            </span>
                          </div>

                          <button className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
                            <Bookmark className="w-5 h-5" />
                          </button>

                          <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex items-center gap-2 text-white font-bold uppercase text-[10px] tracking-widest bg-blue-600 w-fit px-3 py-1 rounded-lg shadow-lg mb-3">
                              <Calendar className="w-3 h-3" />
                              {formatDate(event.date)}
                            </div>
                            <h3 className="text-xl font-black text-white leading-tight line-clamp-2">
                              {event.title}
                            </h3>
                          </div>
                        </div>

                        <div className="p-8 flex flex-col flex-1">
                          <p className="text-sm text-gray-500 line-clamp-3 mb-8 italic">
                            "{event.description}"
                          </p>

                          <div className="space-y-4 mb-8">
                             <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                   <MapPin className="w-4 h-4" />
                                </div>
                                <span className="line-clamp-1">{event.location}</span>
                             </div>
                             <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                   <Clock className="w-4 h-4" />
                                </div>
                                <span>{event.time}</span>
                             </div>
                          </div>

                          {isUpcoming && (
                            <div className="mb-8">
                              <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                <span>Attendance Progress</span>
                                <span className={availabilityPercent >= 90 ? 'text-rose-500' : 'text-blue-600'}>
                                  {availabilityPercent}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${availabilityPercent}%` }}
                                  className={`h-full rounded-full transition-all duration-1000 ${
                                    availabilityPercent >= 90 ? 'bg-rose-500' : 'bg-blue-600'
                                  }`}
                                />
                              </div>
                            </div>
                          )}

                          <div className="flex gap-3 mt-auto pt-6 border-t border-gray-50">
                            <Link 
                              to={`/events/${event.id}`}
                              className="flex-1 px-4 py-4 bg-gray-50 hover:bg-gray-100 text-gray-900 font-black rounded-2xl transition-all text-[10px] uppercase tracking-widest border border-gray-100 text-center flex items-center justify-center"
                            >
                              View Info
                            </Link>
                            {isUpcoming && (
                              <button className="flex-1 px-4 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20">
                                Register
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── Partner Section ── */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="w-20 h-20 bg-white text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-xl border border-gray-100 rotate-3 group-hover:rotate-6 transition-transform">
            <Sparkles className="w-10 h-10" />
          </div>
          
          <h2 className="text-3xl md:text-6xl font-black text-gray-900 mb-8 tracking-tight">Support Our <span className="text-blue-600">Events</span></h2>
          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Partner with us to create meaningful community engagements, fundraisers, or educational workshops.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link to="/partner" className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-gray-800 transition-all shadow-2xl hover:-translate-y-1 transform">
               Become a Partner
               <ArrowRight className="w-5 h-5" />
             </Link>
             <Link to="/volunteer" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 border border-gray-200 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all shadow-sm">
               Join as Volunteer
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}