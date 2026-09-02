import { useEffect, useState } from "react";
import { Calendar, MapPin, Clock, Users, ArrowRight, Sparkles, Globe, Bookmark, Loader2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { events as staticEvents } from "../../data/content";
import { supabase } from "../../lib/supabase";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";

// ── Types ──────────────────────────────────────────────────────
interface EventItem {
  id: string | number;
  title: string;
  description: string;
  longDescription: string;
  date: string;
  time: string;
  location: string;
  address: string;
  category: string;
  status: "upcoming" | "past";
  ticketPrice: string;
  capacity: number;
  registered: number;
  image: string;
  organizer: string;
  contactEmail: string;
  contactPhone: string;
  source: "static" | "supabase";
  computedDate?: number;
}

// ── Map Supabase row → EventItem ───────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromSupabase(row: any): EventItem {
  return {
    id: `sb-${row.id}`,
    title: row.title ?? "",
    description: row.excerpt ?? row.content ?? "",
    longDescription: row.content ?? row.excerpt ?? "",
    date: row.event_date ?? "",
    time: row.event_time ?? "",
    location: row.event_location ?? "",
    address: row.event_address ?? "",
    category: row.category ?? "Outreach",
    status: (row.event_status ?? "upcoming") as "upcoming" | "past",
    ticketPrice: row.ticket_price ?? "Free",
    capacity: row.event_capacity ?? 0,
    registered: row.event_registered ?? 0,
    image: row.featured_image ?? "",
    organizer: row.organizer ?? "Cross-borders Outreach international",
    contactEmail: row.contact_email ?? "",
    contactPhone: row.contact_phone ?? "",
    source: "supabase",
  };
}

// ── Map static entry → EventItem ──────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromStatic(e: any): EventItem {
  return { ...e, id: e.id, source: "static" };
}

export default function Events() {
  const [liveEvents, setLiveEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("type", "events")
          .eq("status", "published")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setLiveEvents(data.map(fromSupabase));
        }
      } catch (e) {
        console.error("Failed to fetch events from Supabase:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Merge: Supabase events first (newest), then static
  const staticMapped = staticEvents.map(fromStatic);
  const now = new Date();
  
  const allEvents: EventItem[] = [...liveEvents, ...staticMapped].map(event => {
    // Dynamic status computation based on date
    const eventDate = event.date && event.date !== "TBD" ? new Date(event.date) : new Date();
    // Use end of day for eventDate so it doesn't immediately become "past" on the day of the event
    const isPast = eventDate < now && eventDate.toDateString() !== now.toDateString();
    
    return {
      ...event,
      status: isPast ? "past" : "upcoming",
      computedDate: eventDate.getTime()
    };
  });
  
  const upcomingEvents = allEvents.filter(e => e.status === "upcoming").sort((a, b) => (a.computedDate || 0) - (b.computedDate || 0));
  const pastEvents = allEvents.filter(e => e.status === "past").sort((a, b) => (b.computedDate || 0) - (a.computedDate || 0));

  const displayEvents = [...upcomingEvents, ...pastEvents];

  const EVENTS_PER_PAGE = 6;
  const totalPages = Math.ceil(displayEvents.length / EVENTS_PER_PAGE);
  const paginatedEvents = displayEvents.slice((currentPage - 1) * EVENTS_PER_PAGE, currentPage * EVENTS_PER_PAGE);

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "TBD") return "To Be Determined";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "long", day: "numeric" });
  };

  const getAvailabilityPercent = (registered: number, capacity: number) =>
    capacity > 0 ? Math.round((registered / capacity) * 100) : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-navy-900 via-[#0a2540] to-sky-900">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
            alt="Events" className="w-full h-full object-cover mix-blend-overlay opacity-30" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-400 text-navy-900 text-xs font-extrabold uppercase tracking-widest mb-6 rounded shadow-sm">
              <Calendar className="w-4 h-4 text-navy-900" /> Our Schedule
            </div>
            <h1 className="text-4xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-2xl font-playfair text-white">
              Our <span className="text-gold-400">Impact Events</span>
            </h1>
            <p className="text-lg md:text-xl text-sky-100 max-w-2xl mx-auto leading-relaxed font-source-serif font-medium">
              Join us in our journey of transformation. From local outreach to international summits, explore how you can be part of the change.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex px-4 py-1.5 bg-gold-500 text-navy-900 font-bold text-xs uppercase tracking-widest rounded mb-6">
                Event Calendar
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-navy-900 mb-6 tracking-tight font-playfair">
                Upcoming &amp; Recent <span className="text-gold-500">Gatherings</span>
              </h2>
              <div className="w-20 h-2 bg-gold-500 rounded-full mb-8" />
              <p className="text-lg text-slate-500 leading-relaxed font-source-serif">
                Discover the latest opportunities to volunteer, partner, and witness the direct impact of our cross-border missions.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
                <Globe className="w-4 h-4 text-navy-900" />
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Across 3 Countries</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-10 h-10 animate-spin text-navy-900" />
            </div>
          ) : (
            <motion.div layout>
              <AnimatePresence mode="popLayout">
                {displayEvents.length === 0 ? (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-3xl p-24 text-center border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Calendar className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-navy-800 mb-2 font-playfair">No events scheduled yet</h3>
                    <p className="text-slate-500 font-source-serif">Our team is currently planning our next major outreach.</p>
                  </motion.div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      {paginatedEvents.map((event, index) => {
                      const availabilityPercent = getAvailabilityPercent(event.registered, event.capacity);
                      const isUpcoming = event.status === "upcoming";
                      return (
                        <motion.div key={String(event.id)} layout
                          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="group bg-white rounded-3xl overflow-hidden border border-slate-900/5 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)] hover:-translate-y-1 transition-all duration-500 flex flex-col h-full relative">
                          <div className="relative h-64 overflow-hidden bg-sky-50">
                            <ImageWithFallback src={event.image} alt={event.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/30 to-transparent opacity-80" />

                            {/* New badge for Supabase events */}
                            {event.source === "supabase" && (
                              <div className="absolute top-6 right-16 px-3 py-1 bg-gold-500 text-navy-900 text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg">
                                New
                              </div>
                            )}

                            <div className="absolute top-6 left-6 flex gap-2">
                              <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-navy-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                                {event.category}
                              </span>
                            </div>
                            <button className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-gold-500 hover:text-navy-900 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
                              <Bookmark className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-6 left-6 right-6">
                              <div className="flex items-center gap-2 text-navy-900 font-bold uppercase text-[10px] tracking-widest bg-gold-400 w-fit px-3 py-1 rounded-lg shadow-lg mb-3">
                                <Calendar className="w-3 h-3" /> {formatDate(event.date)}
                              </div>
                              <h3 className="text-2xl font-black text-white leading-tight line-clamp-2 font-playfair">{event.title}</h3>
                            </div>
                          </div>

                          <div className="p-8 flex flex-col flex-1">
                            <p className="text-sm text-slate-600 line-clamp-3 mb-8 italic font-source-serif">"{event.description}"</p>
                            <div className="space-y-4 mb-8">
                              <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-navy-900">
                                  <MapPin className="w-4 h-4" />
                                </div>
                                <span className="line-clamp-1">{event.location || "Location TBD"}</span>
                              </div>
                              {event.time && (
                                <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-navy-900">
                                    <Clock className="w-4 h-4" />
                                  </div>
                                  <span>{event.time}</span>
                                </div>
                              )}
                            </div>

                            {isUpcoming && event.capacity > 0 && (
                              <div className="mb-8">
                                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                  <span>Attendance Progress</span>
                                  <span className={availabilityPercent >= 90 ? "text-orange-500" : "text-navy-900"}>
                                    {availabilityPercent}%
                                  </span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${availabilityPercent}%` }}
                                    className={`h-full rounded-full transition-all duration-1000 ${availabilityPercent >= 90 ? "bg-orange-500" : "bg-navy-900"}`} />
                                </div>
                              </div>
                            )}

                            <div className="flex gap-3 mt-auto pt-6 border-t border-slate-100">
                              <Link to={`/events/${event.id}`}
                                className={`px-4 py-4 bg-slate-50 hover:bg-slate-100 text-navy-900 font-black rounded-xl transition-all text-[10px] uppercase tracking-widest border border-slate-200 text-center flex items-center justify-center ${isUpcoming ? 'flex-1' : 'w-full'}`}>
                                View Info
                              </Link>
                              {isUpcoming && (
                                <button className="flex-1 px-4 py-4 bg-gold-500 hover:bg-gold-400 text-navy-900 font-black rounded-3xl transition-all text-[10px] uppercase tracking-widest shadow-xl shadow-gold-500/20">
                                  Register
                                </button>
                              )}
                              {/* Past events have no registration button entirely */}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-200 py-10 mt-16">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className="flex items-center gap-2 text-slate-500 hover:text-navy-900 font-bold uppercase tracking-widest text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors group"
                      >
                        <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" /> Previous
                      </button>
                      <div className="flex gap-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-10 h-10 rounded-full font-black text-sm flex items-center justify-center transition-colors ${currentPage === i + 1 ? "bg-navy-900 text-white shadow-md shadow-navy-900/30" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className="flex items-center gap-2 text-slate-500 hover:text-navy-900 font-bold uppercase tracking-widest text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors group"
                      >
                        Next <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Partner Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="w-20 h-20 bg-white text-gold-500 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-[0_4px_20px_rgba(15,23,42,0.04)] border border-slate-200 rotate-3">
            <Sparkles className="w-10 h-10 text-gold-500" />
          </div>
          <h2 className="text-3xl md:text-6xl font-extrabold text-navy-900 mb-8 tracking-tight font-playfair">
            Support Our <span className="text-gold-500">Events</span>
          </h2>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-source-serif">
            Partner with us to create meaningful community engagements, fundraisers, or educational workshops.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/partner" className="inline-flex items-center gap-3 px-10 py-5 bg-navy-900 text-white rounded-3xl font-black text-lg hover:bg-navy-800 transition-all shadow-2xl hover:-translate-y-1 transform">
              Become a Partner <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/opportunities" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-navy-900 border border-slate-200 rounded-3xl font-black text-lg hover:bg-slate-100 transition-all shadow-sm">
              <Users className="w-5 h-5" /> Join as Volunteer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
