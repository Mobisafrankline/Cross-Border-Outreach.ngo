import { Calendar, MapPin, Clock, Users, Mail, Phone, ArrowRight, CheckCircle, X, Sparkles, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { events } from "../../data/content";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  
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
      {/* ── Hero Section (Reduced Size) ─────────────────────────── */}
      <section className="relative pt-8 pb-12 lg:pt-12 lg:pb-20 overflow-hidden">
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
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">
              Our <span className="text-blue-100">Impact Events</span>
            </h1>
            <p className="text-lg text-blue-50 max-w-2xl mx-auto leading-relaxed opacity-90 font-medium">
              Join us in making a difference. Explore our upcoming initiatives and past milestones.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Events Container ────────────────────────────────────── */}
      <section className="py-12 relative -mt-6 lg:-mt-10 z-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div layout>
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
                /* ── GRID LAYOUT ── */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {displayEvents.map((event, index) => {
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
                        className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border group flex flex-col ${isUpcoming ? 'border-blue-100 ring-1 ring-blue-50' : 'border-slate-100 opacity-90'}`}
                      >
                        {/* Event Image - Much clearer overlay now */}
                        <div className="relative h-52 overflow-hidden bg-slate-100">
                          <ImageWithFallback
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          {/* Super subtle bottom shadow just for white text contrast */}
                          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-slate-900/40 to-transparent" />
                          
                          {/* Category Badge */}
                          <div className="absolute top-4 left-4">
                            <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-800 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                              {event.category}
                            </span>
                          </div>

                          {/* Ticket Price Badge */}
                          <div className="absolute top-4 right-4">
                            <span className="inline-block px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-white rounded-full text-xs font-black shadow-sm">
                              {event.ticketPrice}
                            </span>
                          </div>

                          {/* Status Tag */}
                          <div className="absolute bottom-4 left-4">
                            {isUpcoming ? (
                              <span className="bg-emerald-500 text-white px-3 py-1 font-bold rounded-full text-xs flex items-center gap-1.5 shadow-md">
                                <Calendar className="w-3.5 h-3.5" />
                                Upcoming
                              </span>
                            ) : (
                              <span className="bg-slate-800/80 backdrop-blur-md text-white px-3 py-1 font-bold rounded-full text-xs flex items-center gap-1.5 shadow-md">
                                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                                Completed
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="p-6 flex flex-col flex-1">
                          <h3 className="text-lg font-extrabold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                            {event.title}
                          </h3>

                          <p className="text-slate-600 text-sm mb-5 leading-relaxed line-clamp-2 flex-grow-0">
                            {event.description}
                          </p>

                          {/* Info Rows */}
                          <div className="space-y-3 mb-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center shrink-0">
                                <Calendar className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="text-sm font-semibold text-slate-700 truncate">{formatDate(event.date)}</span>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center shrink-0">
                                <MapPin className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="text-sm font-semibold text-slate-700 truncate" title={event.location}>{event.location}</span>
                            </div>
                          </div>

                          {/* Availability Bar (Upcoming only) */}
                          {isUpcoming && (
                            <div className="mb-5">
                              <div className="flex justify-between text-xs font-semibold mb-1.5">
                                <span className="text-slate-500 uppercase">Availability</span>
                                <span className={`${availabilityPercent >= 90 ? 'text-red-500' : 'text-blue-600'}`}>
                                  {availabilityPercent}% Full
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
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
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-3 mt-auto pt-4 border-t border-slate-100">
                            <button 
                              onClick={() => setSelectedEvent(event.id)}
                              className="flex-1 px-4 py-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold rounded-xl transition-all text-center text-sm border border-slate-200 hover:border-blue-200"
                            >
                              View Details
                            </button>
                            {isUpcoming && (
                              <button className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm">
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

      {/* ── Event Detail Modal (Premium Split Redesign) ───────────── */}
      <AnimatePresence>
        {selectedEventData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl w-full max-w-6xl max-h-[95vh] lg:h-[85vh] overflow-hidden shadow-2xl flex flex-col lg:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button (Floating) */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-6 right-6 lg:top-8 lg:right-8 z-10 p-2.5 bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 rounded-full text-slate-800 lg:text-white transition-all shadow-lg hover:rotate-90 duration-300"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Left Column: Image Area */}
              <div className="relative w-full lg:w-2/5 h-64 lg:h-full shrink-0 overflow-hidden bg-slate-100">
                <ImageWithFallback
                  src={selectedEventData.image}
                  alt={selectedEventData.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent lg:bg-gradient-to-tr lg:from-slate-900/90 lg:via-slate-900/20" />
                
                {/* Image Overlay Content */}
                <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10 pr-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4 shadow-lg">
                    {selectedEventData.category}
                  </span>
                  <h2 className="text-3xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-lg mb-2">
                    {selectedEventData.title}
                  </h2>
                  <p className="text-blue-100 font-medium text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {selectedEventData.location}
                  </p>
                </div>
              </div>

              {/* Right Column: Scrollable Content Area */}
              <div className="w-full lg:w-3/5 h-full overflow-y-auto bg-slate-50 flex flex-col relative custom-scrollbar">
                
                {/* Header Stats Strip */}
                <div className="bg-white border-b border-slate-100 p-6 lg:p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 shrink-0 sticky top-0 z-10 shadow-sm">
                  <div className="flex flex-col gap-1">
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Date</div>
                    <div className="font-bold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
                      <Calendar className="w-4 h-4 text-blue-600 hidden sm:block" />
                      {formatDate(selectedEventData.date)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Time</div>
                    <div className="font-bold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
                      <Clock className="w-4 h-4 text-blue-600 hidden sm:block" />
                      {selectedEventData.time}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Price</div>
                    <div className="font-bold text-blue-600 text-sm sm:text-base">
                      {selectedEventData.ticketPrice}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status</div>
                    <div>
                      {selectedEventData.status === "upcoming" ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1.5 text-sm sm:text-base">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Upcoming
                        </span>
                      ) : (
                        <span className="text-slate-500 font-bold flex items-center gap-1.5 text-sm sm:text-base">
                          <CheckCircle className="w-4 h-4" />
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-6 lg:p-10 flex-1">
                  
                  <div className="grid xl:grid-cols-3 gap-10">
                    <div className="xl:col-span-2 space-y-8">
                      {/* Description */}
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          About the Event
                        </h3>
                        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                          {selectedEventData.longDescription.split('\n').map((para, i) => (
                            <p key={i} className="mb-4">{para}</p>
                          ))}
                        </div>
                      </div>

                      {/* Organizer Details */}
                      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          Organizer Info
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-slate-800 w-20">Name:</span>
                            <span className="text-slate-600">{selectedEventData.organizer}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-slate-800 w-20">Email:</span>
                            <a href={`mailto:${selectedEventData.contactEmail}`} className="text-blue-600 hover:underline">
                              {selectedEventData.contactEmail}
                            </a>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-slate-800 w-20">Phone:</span>
                            <a href={`tel:${selectedEventData.contactPhone}`} className="text-blue-600 hover:underline">
                              {selectedEventData.contactPhone}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="xl:col-span-1 space-y-6">
                      {/* Capacity Card */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-slate-900">Capacity</h4>
                          <span className="text-sm font-semibold text-slate-500">
                            {selectedEventData.registered} / {selectedEventData.capacity}
                          </span>
                        </div>
                        {selectedEventData.status === "upcoming" && (
                          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-2">
                            <div 
                              className={`h-full rounded-full ${
                                getAvailabilityPercent(selectedEventData.registered, selectedEventData.capacity) >= 90 ? 'bg-red-500' : 'bg-blue-600'
                              }`}
                              style={{ width: `${getAvailabilityPercent(selectedEventData.registered, selectedEventData.capacity)}%` }}
                            />
                          </div>
                        )}
                        <p className="text-xs text-slate-500 text-center">
                          {selectedEventData.status === "upcoming" 
                            ? "Spots are filling up!" 
                            : "This event has already occurred."}
                        </p>
                      </div>

                      {/* Action CTA Card */}
                      <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-6 shadow-xl text-center text-white relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500 rounded-full opacity-20 blur-2xl" />
                        
                        <div className="relative z-10">
                          <div className="text-sm text-blue-200 font-semibold uppercase tracking-wider mb-2">Ticket Price</div>
                          <div className="text-4xl font-extrabold mb-6">{selectedEventData.ticketPrice}</div>
                          
                          {selectedEventData.status === "upcoming" ? (
                            <button className="w-full py-3.5 bg-white text-blue-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-md">
                              Register Now
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          ) : (
                            <button className="w-full py-3.5 bg-white/10 text-white/50 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed border border-white/10">
                              <CheckCircle className="w-4 h-4" />
                              Completed
                            </button>
                          )}
                        </div>
                      </div>
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

      {/* Custom Scrollbar CSS for Modal */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
      `}} />
    </div>
  );
}