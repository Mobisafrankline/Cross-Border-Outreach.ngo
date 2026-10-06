import { useEffect, useState } from "react";
import { MapPin, Heart, Users, Calendar, ArrowRight, Globe2, CheckCircle2, Leaf } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { events as staticEvents } from "../../data/content";
import { supabase } from "../../lib/supabase";
import outreach4 from "../../assets/outreach4.jpeg";
import outreach5 from "../../assets/outreach5.jpeg";
import imageSlide4 from "../../assets/ImageSlide4.jpeg";
import imageSlide1 from "../../assets/ImageSlide1.jpeg";
import img4 from "../../assets/4.jpeg";

const EA_KEYWORDS = ["Kenya", "Uganda", "Tanzania", "Nairobi", "Murang'a", "Muranga", "Africa", "Mombasa", "Kisumu"];

function isEastAfricaEvent(address: string = "", location: string = "") {
  return EA_KEYWORDS.some(k =>
    address.toLowerCase().includes(k.toLowerCase()) ||
    location.toLowerCase().includes(k.toLowerCase())
  );
}

const eastAfricaHighlights = [
  { icon: <Heart className="w-6 h-6" />, title: "Rescue Centre Support", desc: "Visiting children's rescue centres — delivering education, care, and essential supplies.", color: "#e11d48" },
  { icon: <Users className="w-6 h-6" />, title: "Community Food Programs", desc: "Distributing food packs and nutrition support to vulnerable families in Kenya and beyond.", color: "#d97706" },
  { icon: <Leaf className="w-6 h-6" />, title: "Climate Resilience", desc: "Helping communities adapt through sustainable agriculture and clean water access.", color: "#059669" },
  { icon: <Globe2 className="w-6 h-6" />, title: "Healthcare Outreach", desc: "Mobile medical clinics and health screenings reaching remote villages.", color: "#2563eb" },
];

export default function OutreachEastAfrica() {
  const [allEvents, setAllEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const filteredStatic = staticEvents.filter(e => isEastAfricaEvent(e.address || "", e.location || ""));
      const { data: sbData } = await supabase.from("articles").select("*").eq("type", "events").eq("status", "published");
      const filteredSB = (sbData || []).filter(e => isEastAfricaEvent(e.event_location || "", e.address || ""));
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
      <section className="relative bg-gradient-to-br from-[#052e16] via-[#166534] to-[#032B45] pt-24 pb-0 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#F5B800]/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-end">

            {/* Left — Text */}
            <div className="pb-16 pt-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5B800] text-[#032B45] font-extrabold text-xs uppercase tracking-widest rounded mb-6 shadow">
                <span>🌍</span> East Africa Outreach
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
                Transforming Lives<br />
                <span className="text-[#F5B800]">Across East Africa</span>
              </h1>
              <p className="text-base text-green-100 mb-8 leading-relaxed max-w-lg">
                From Murang'a to Nairobi and beyond, we deliver education, food, healthcare, and climate resilience to communities that need it most.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/donate" className="inline-flex items-center gap-2 px-6 py-3 bg-[#F5B800] text-[#032B45] rounded font-bold hover:bg-yellow-300 transition-colors shadow">
                  <Heart className="w-4 h-4 fill-[#032B45]" /> Support East Africa
                </Link>
                <Link to="/events" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded font-bold hover:bg-white/20 transition-colors border border-white/20">
                  See All Events <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right — Image collage flush to bottom */}
            <div className="hidden lg:grid grid-cols-3 gap-3 items-end h-[360px]">
              <div className="col-span-2 h-full rounded-t-2xl overflow-hidden shadow-2xl border-2 border-white/10">
                <ImageWithFallback src={outreach4} alt="East Africa outreach" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-3 h-full">
                <div className="flex-1 rounded-t-2xl overflow-hidden shadow-xl border-2 border-white/10">
                  <ImageWithFallback src={img4} alt="Kenya community" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 rounded-t-2xl overflow-hidden shadow-xl border-2 border-white/10">
                  <ImageWithFallback src={outreach5} alt="Children Kenya" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-[#166534] py-5">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { num: "1,500+", label: "Kids Reached" },
            { num: "3+", label: "Children's Homes" },
            { num: "2+", label: "Countries" },
            { num: "5", label: "Core Programs" },
          ].map((s, i) => (
            <div key={i} className="py-2">
              <div className="text-2xl font-extrabold text-white">{s.num}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-green-200 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HIGHLIGHTS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-widest text-[#F5B800] mb-2">What We Do in East Africa</div>
            <h2 className="text-3xl font-extrabold text-[#032B45]">Our East Africa Programs</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {eastAfricaHighlights.map((h, i) => (
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


      {/* ── MURANG'A SPOTLIGHT ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
              <ImageWithFallback src={imageSlide1} alt="Murang'a Rescue Centre" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <div className="bg-white/90 backdrop-blur rounded-xl p-3 shadow-lg">
                  <div className="text-[10px] font-bold text-[#F5B800] uppercase tracking-widest mb-0.5">Featured Visit</div>
                  <div className="font-extrabold text-[#032B45] text-sm">Murang'a Rescue Centre · Feb 2026</div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#F5B800] mb-2">Spotlight</div>
              <h2 className="text-3xl font-extrabold text-[#032B45] mb-4 leading-tight">Murang'a Rescue<br />Centre Visit</h2>
              <p className="text-slate-600 leading-relaxed mb-5">
                On February 28, 2026, our volunteers visited Murang'a Rescue Centre in Murang'a County, Kenya — spending time with children through mentorship, games, and learning activities, bringing joy and hope to vulnerable youth.
              </p>
              <ul className="space-y-2.5 mb-6">
                {["Educational support and mentorship", "Psychosocial engagement activities", "Community partnership strengthening", "Essential supply distribution"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-slate-700 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#166534] flex-shrink-0 mt-0.5" /> {item}
                  </li>
                ))}
              </ul>
              <Link to="/events/2" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#032B45] text-white rounded-xl font-bold hover:bg-[#F5B800] hover:text-[#032B45] transition-colors text-sm">
                Read Full Report <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── EAST AFRICA EVENTS ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#F5B800] mb-1">On the Ground</div>
              <h2 className="text-3xl font-extrabold text-[#032B45]">East Africa Events</h2>
            </div>
            <Link to="/events" className="text-[#032B45] font-bold flex items-center gap-1 hover:text-[#F5B800] transition-colors text-sm">
              All Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {allEvents.length === 0 ? (
            <div className="text-center py-16 text-slate-400 font-medium">
              No East Africa events yet. <Link to="/events" className="text-[#F5B800] underline">See all events →</Link>
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
      <section className="py-16 bg-gradient-to-br from-[#052e16] to-[#166534] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-white mb-3">Make a Difference in East Africa</h2>
          <p className="text-green-200 mb-8">Join us in serving the communities of Kenya and East Africa with compassion and purpose.</p>
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
