import { Calendar, MapPin, Clock, Users, Mail, Phone, ArrowRight, CheckCircle, X, Sparkles, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { events } from "../../data/content";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Events() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  
  const upcomingEvents = events.filter(event => event.status === "upcoming");
  const pastEvents = events.filter(event => event.status === "past");
  
  const displayEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;

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

  const selectedEventData = selectedEvent ? events.find(e => e.id === selectedEvent) : null;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedEventData) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    }
  }, [selectedEventData]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Gradients & Effects */}
        <div className="absolute inset-0 bg-blue-600 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 z-0" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-400 opacity-20 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500 opacity-20 blur-[100px]" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold tracking-wide mb-6 bg-white/20 text-white border border-white/30 shadow-sm backdrop-blur-md uppercase">
              <Calendar className="w-4 h-4 text-white" />
              Community Gatherings
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-md">
              Join Our Next <br className="hidden md:block" />
              <span className="text-blue-100">Impact Event</span>
            </h1>
            <p className="text-xl text-blue-50 max-w-2xl mx-auto leading-relaxed mb-10 opacity-90 font-medium">
              From community outreaches to fundraising galas, be part of the moments that bring our mission to life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Events Container ────────────────────────────────────── */}
      <section className="py-16 relative -mt-10 lg:-mt-16 z-20">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Custom Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white p-1.5 rounded-full shadow-md border border-slate-200 inline-flex relative">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`relative px-8 py-3 rounded-full font-bold text-sm transition-colors z-10 ${
                  activeTab === "upcoming" ? "text-white" : "text-slate-600 hover:text-blue-600"
                }`}
              >
                Upcoming Events ({upcomingEvents.length})
                {activeTab === "upcoming" && (
                  <motion.div
                    layoutId="event-tab"
                    className="absolute inset-0 bg-blue-600 rounded-full -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`relative px-8 py-3 rounded-full font-bold text-sm transition-colors z-10 ${
                  activeTab === "past" ? "text-white" : "text-slate-600 hover:text-blue-600"
                }`}
              >
                Past Events ({pastEvents.length})
                {activeTab === "past" && (
                  <motion.div
                    layoutId="event-tab"
                    className="absolute inset-0 bg-blue-600 rounded-full -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            </div>
          </div>

          <motion.div 
             layout
             className="space-y-8"
          >
            <AnimatePresence mode="popLayout">
              {displayEvents.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-200"
                >
                  <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">No events found</h3>
                  <p className="text-slate-500">Check back later for new updates.</p>
                </motion.div>
              ) : (
                displayEvents.map((event, index) => {
                  const availabilityPercent = getAvailabilityPercent(event.registered, event.capacity);
                  const isUpcoming = event.status === "upcoming";
                  
                  return (
                    <motion.div 
                      key={event.id}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-xl transition-all border border-slate-100 group"
                    >
                      <div className="grid md:grid-cols-12 gap-0">
                        {/* Event Image */}
                        <div className="md:col-span-5 lg:col-span-4 h-64 md:h-auto overflow-hidden relative">
                          <ImageWithFallback
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                          {!isUpcoming && (
                            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] flex items-center justify-center">
                              <span className="bg-white/90 text-slate-800 px-4 py-2 font-bold rounded-full text-sm flex items-center gap-2 shadow-lg">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Completed
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Event Details */}
                        <div className="md:col-span-7 lg:col-span-8 p-8 md:p-10 flex flex-col justify-between">
                          <div>
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                              <div>
                                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                                  {event.category}
                                </span>
                                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                  {event.title}
                                </h3>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Ticket</div>
                                <div className="text-2xl font-black text-blue-600">{event.ticketPrice}</div>
                              </div>
                            </div>

                            <p className="text-slate-600 text-lg mb-8 leading-relaxed line-clamp-2">
                              {event.description}
                            </p>

                            {/* Info Grid */}
                            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-5 mb-8">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                                  <Calendar className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="text-xs text-slate-500 font-semibold uppercase">Date</div>
                                  <div className="font-bold text-slate-800">{formatDate(event.date)}</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                                  <Clock className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="text-xs text-slate-500 font-semibold uppercase">Time</div>
                                  <div className="font-bold text-slate-800">{event.time}</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                                  <MapPin className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="truncate pr-4">
                                  <div className="text-xs text-slate-500 font-semibold uppercase">Location</div>
                                  <div className="font-bold text-slate-800 truncate" title={event.location}>{event.location}</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                                  <Users className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="text-xs text-slate-500 font-semibold uppercase">Capacity</div>
                                  <div className="font-bold text-slate-800">
                                    {event.registered} / {event.capacity} Registered
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-100">
                            {/* Availability Bar (Upcoming) */}
                            {isUpcoming ? (
                              <div className="w-full sm:w-1/2">
                                <div className="flex justify-between text-xs font-semibold mb-2">
                                  <span className="text-slate-500 uppercase">Availability</span>
                                  <span className={`${availabilityPercent >= 90 ? 'text-red-500' : 'text-blue-600'}`}>
                                    {availabilityPercent}% Full
                                  </span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${availabilityPercent}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={`h-full rounded-full ${
                                      availabilityPercent >= 90 ? 'bg-gradient-to-r from-red-500 to-red-400' : 
                                      availabilityPercent >= 70 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 
                                      'bg-gradient-to-r from-blue-600 to-blue-400'
                                    }`}
                                  />
                                </div>
                              </div>
                            ) : <div className="hidden sm:block"></div>}
                            
                            <div className="flex gap-3 w-full sm:w-auto">
                              <button 
                                onClick={() => setSelectedEvent(event.id)}
                                className="flex-1 sm:flex-none px-6 py-3 bg-white border-2 border-slate-200 hover:border-blue-200 hover:bg-blue-50 text-slate-700 font-bold rounded-xl transition-all text-center"
                              >
                                View Details
                              </button>
                              {isUpcoming && (
                                <button className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                                  Register
                                  <ArrowRight className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── Event Detail Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {selectedEventData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header with Image */}
              <div className="relative h-64 md:h-80 shrink-0">
                <ImageWithFallback
                  src={selectedEventData.image}
                  alt={selectedEventData.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-3 shadow-sm">
                    {selectedEventData.category}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-md">
                    {selectedEventData.title}
                  </h2>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 md:p-10 bg-white">
                
                {/* Event Details Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 pb-10 border-b border-slate-100">
                  <div className="flex flex-col gap-2">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-2">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div className="text-xs text-slate-500 font-semibold uppercase">Date</div>
                    <div className="font-bold text-slate-900">{formatDate(selectedEventData.date)}</div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-2">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div className="text-xs text-slate-500 font-semibold uppercase">Time</div>
                    <div className="font-bold text-slate-900">{selectedEventData.time}</div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-2">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div className="text-xs text-slate-500 font-semibold uppercase">Location</div>
                    <div className="font-bold text-slate-900 line-clamp-1">{selectedEventData.location}</div>
                    <div className="text-sm text-slate-600 leading-tight">{selectedEventData.address}</div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-2">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="text-xs text-slate-500 font-semibold uppercase">Capacity</div>
                    <div className="font-bold text-slate-900">
                      {selectedEventData.registered} / {selectedEventData.capacity}
                    </div>
                    {selectedEventData.status === "upcoming" && (
                      <div className="mt-1">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              getAvailabilityPercent(selectedEventData.registered, selectedEventData.capacity) >= 90 ? 'bg-red-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${getAvailabilityPercent(selectedEventData.registered, selectedEventData.capacity)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="grid lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">About This Event</h3>
                    <div className="prose prose-lg prose-blue max-w-none text-slate-700">
                      {selectedEventData.longDescription.split('\n').map((para, i) => (
                        <p key={i} className="mb-4 leading-relaxed">{para}</p>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-1 space-y-6">
                    {/* Organizer Card */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                      <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">Organizer Contact</h4>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Users className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                          <span className="font-medium text-slate-800">{selectedEventData.organizer}</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <Mail className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                          <a href={`mailto:${selectedEventData.contactEmail}`} className="text-blue-600 hover:underline font-medium break-all">
                            {selectedEventData.contactEmail}
                          </a>
                        </div>
                        <div className="flex items-start gap-3">
                          <Phone className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                          <a href={`tel:${selectedEventData.contactPhone}`} className="text-blue-600 hover:underline font-medium">
                            {selectedEventData.contactPhone}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action Card */}
                    <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-xl shadow-blue-600/20">
                      <div className="text-sm text-blue-200 font-semibold uppercase tracking-wider mb-1">Ticket Price</div>
                      <div className="text-4xl font-extrabold mb-6">{selectedEventData.ticketPrice}</div>
                      
                      {selectedEventData.status === "upcoming" ? (
                        <button className="w-full py-4 bg-white text-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
                          Register Now
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      ) : (
                        <button className="w-full py-4 bg-blue-700/50 text-blue-100 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed border border-blue-500/30">
                          <CheckCircle className="w-5 h-5" />
                          Event Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CTA Section ─────────────────────────────────────────── */}
      <section className="py-24 bg-white border-t border-slate-200 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 p-12 md:p-16 rounded-[2.5rem] border border-slate-100 relative"
          >
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Sparkles className="w-10 h-10" />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Host Your Own Event</h2>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Partner with us to create meaningful events, fundraisers, or workshops that drive lasting impact in your community.
            </p>
            
            <a href="/partner" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-md hover:shadow-xl hover:-translate-y-1 transform duration-200">
              Become a Partner
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}