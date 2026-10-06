import { useEffect, useState } from "react";
import { MapPin, Heart, Users, Calendar, ArrowRight, Globe2, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { events as staticEvents } from "../../data/content";
import { supabase } from "../../lib/supabase";
import outreach1 from "../../assets/outreach1.jpeg";
import outreach2 from "../../assets/outreach2.jpeg";
import outreach3 from "../../assets/outreach3.jpeg";

const USA_KEYWORDS = ["USA", ", GA ", ", GA,", "GA 3", "Georgia", "Atlanta", "Lilburn", "United States", "30045", "30046", "30047", "30345"];

function isUSAEvent(address: string = "", location: string = "") {
  return USA_KEYWORDS.some(k => address.includes(k) || location.includes(k));
}

const usaHighlights = [
  { icon: <Users className="w-6 h-6" />, title: "Community Distribution", desc: "Household essentials, food baskets, and hygiene kits delivered to families across Atlanta.", color: "#1e3a8a" },
  { icon: <Heart className="w-6 h-6" />, title: "Faith-Based Partnerships", desc: "Collaborating with local churches to extend outreach to underserved populations.", color: "#f97316" },
  { icon: <Globe2 className="w-6 h-6" />, title: "Immigrant & Refugee Support", desc: "Bridging cultural gaps to serve immigrant families navigating life in the US.", color: "#059669" },
  { icon: <CheckCircle2 className="w-6 h-6" />, title: "Back-to-School Drives", desc: "Supplying school supplies and uniforms to children in need each academic year.", color: "#7c3aed" },
];

export default function OutreachUSA() {
  const [allEvents, setAllEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const filteredStatic = staticEvents.filter(e => isUSAEvent(e.address, e.location));
      const { data: sbData } = await supabase.from("articles").select("*").eq("type", "events").eq("status", "published");
      const filteredSB = (sbData || []).filter(e => isUSAEvent(e.event_location || "", e.address || ""));
      const now = new Date();
      const combined = [
        ...filteredStatic.map(e => ({ ...e, _isStatic: true, computedDate: e.date && e.date !== "TBD" ? new Date(e.date).getTime() : 0, isPast: e.date && e.date !== "TBD" ? new Date(e.date) < now : true })),
        ...filteredSB.map(e => ({ ...e, _isStatic: false, computedDate: e.event_date ? new Date(e.event_date).getTime() : 0, isPast: e.event_date ? new Date(e.event_date) < now : true })),
      ].sort((a, b) => (a.isPast ? 1 : -1) - (b.isPast ? 1 : -1) || a.computedDate - b.computedDate);
      setAllEvents(combined);
    };
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-[#032B45] via-[#0a2540] to-[#1e3a8a] pt-24 pb-0 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#B22234]/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-end">

            {/* Left — Text */}
            <div className="pb-16 pt-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5B800] text-[#032B45] font-extrabold text-xs uppercase tracking-widest rounded mb-6 shadow">
                <span>🇺🇸</span> United States Outreach
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
                Serving Communities<br />
                <span className="text-[#F5B800]">Across America</span>
              </h1>
              <p className="text-base text-sky-100 mb-8 leading-relaxed max-w-lg">
                From Atlanta, Georgia to communities across the USA, Cross-borders Outreach International brings hope, resources, and connection to families who need it most.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/donate" className="inline-flex items-center gap-2 px-6 py-3 bg-[#F5B800] text-[#032B45] rounded font-bold hover:bg-yellow-300 transition-colors shadow">
                  <Heart className="w-4 h-4 fill-[#032B45]" /> Support USA Outreach
                </Link>
                <Link to="/events" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded font-bold hover:bg-white/20 transition-colors border border-white/20">
                  See All Events <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right — Image collage flush to bottom */}
            <div className="hidden lg:grid grid-cols-3 gap-3 items-end h-[360px]">
              <div className="col-span-2 h-full rounded-t-2xl overflow-hidden shadow-2xl border-2 border-white/10">
                <ImageWithFallback src={outreach1} alt="Community outreach USA" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-3 h-full">
                <div className="flex-1 rounded-t-2xl overflow-hidden shadow-xl border-2 border-white/10">
                  <ImageWithFallback src={outreach2} alt="Volunteers Atlanta" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 rounded-t-2xl overflow-hidden shadow-xl border-2 border-white/10">
                  <ImageWithFallback src={outreach3} alt="Spring Festival Atlanta" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-[#F5B800] py-5">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { num: "14,000+", label: "People Served" },
            { num: "5+", label: "Major Events" },
            { num: "3+", label: "US Cities" },
            { num: "12+", label: "Partner Orgs" },
          ].map((s, i) => (
            <div key={i} className="py-2">
              <div className="text-2xl font-extrabold text-[#032B45]">{s.num}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#032B45]/70 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HIGHLIGHTS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-widest text-[#F5B800] mb-2">What We Do in the USA</div>
            <h2 className="text-3xl font-extrabold text-[#032B45]">Our US Programs & Focus Areas</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {usaHighlights.map((h, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white" style={{ backgroundColor: h.color }}>
                  {h.icon}
                </div>
                <h3 className="font-extrabold text-[#032B45] text-base mb-2">{h.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── USA EVENTS ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#F5B800] mb-1">Past & Upcoming</div>
              <h2 className="text-3xl font-extrabold text-[#032B45]">USA Events</h2>
            </div>
            <Link to="/events" className="text-[#032B45] font-bold flex items-center gap-1 hover:text-[#F5B800] transition-colors text-sm">
              All Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {allEvents.length === 0 ? (
            <div className="text-center py-16 text-slate-400 font-medium">
              No USA events yet. <Link to="/events" className="text-[#F5B800] underline">See all events →</Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allEvents.map((ev, idx) => {
                const rawDate = ev.event_date || ev.date;
                const eventDate = rawDate ? new Date(rawDate) : null;
                const displayDate = eventDate && !isNaN(eventDate.getTime())
                  ? eventDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                  : rawDate || "TBD";
                const imgSrc = ev.featured_image || ev.image || "";

                return (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:-translate-y-1 hover:shadow-lg transition-all">
                    <div className="h-44 overflow-hidden relative">
                      <ImageWithFallback
                        src={typeof imgSrc === "string" ? imgSrc : imgSrc}
                        alt={ev.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 text-white text-[10px] font-bold uppercase tracking-widest rounded-full"
                        style={{ background: ev.isPast ? "rgba(17,24,39,0.75)" : "rgba(5,150,105,0.9)" }}>
                        {ev.isPast ? "Past Event" : "● Upcoming"}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="text-[10px] font-bold text-[#F5B800] uppercase tracking-widest mb-1">{ev.category || "Outreach"}</div>
                      <h3 className="font-extrabold text-[#032B45] text-base mb-2 leading-snug line-clamp-2">{ev.title}</h3>
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" /> {displayDate}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-3">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{ev.event_location || ev.address || ev.location || "TBD"}</span>
                      </div>
                      <p className="text-slate-500 text-xs line-clamp-2 mb-3 leading-relaxed">{ev.excerpt || ev.description}</p>
                      <Link to={`/events/${ev.id}`} className="inline-flex items-center gap-1 text-[10px] font-bold text-[#032B45] hover:text-[#F5B800] transition-colors uppercase tracking-widest">
                        View Details <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-gradient-to-br from-[#032B45] to-[#0a2540] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-white mb-3">Get Involved in the USA</h2>
          <p className="text-sky-200 mb-8">Volunteer, donate, or partner with us to make a difference in American communities.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/donate" className="inline-flex items-center gap-2 px-7 py-3 bg-[#F5B800] text-[#032B45] rounded font-bold hover:bg-yellow-300 transition-colors">
              <Heart className="w-4 h-4" /> Donate Now
            </Link>
            <Link to="/opportunities" className="inline-flex items-center gap-2 px-7 py-3 bg-white/10 text-white rounded font-bold hover:bg-white/20 transition-colors border border-white/20">
              Volunteer <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
