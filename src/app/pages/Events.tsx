import { Calendar, MapPin, Clock, Users, Mail, Phone, ArrowRight, CheckCircle, X } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { events } from "../../data/content";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Events() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  
  const upcomingEvents = events.filter(event => event.status === "upcoming");
  const pastEvents = events.filter(event => event.status === "past");
  
  const displayEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getAvailabilityPercent = (registered: number, capacity: number) => {
    return Math.round((registered / capacity) * 100);
  };

  const selectedEventData = selectedEvent ? events.find(e => e.id === selectedEvent) : null;

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1769837230424-bf083c309ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdW5kcmFpc2luZyUyMGV2ZW50JTIwY2hhcml0eSUyMGdhdGhlcmluZ3xlbnwxfHx8fDE3NzE5OTY4OTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Events"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <Calendar className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Events</h1>
          <p className="text-xl md:text-2xl opacity-95">
            Join us in making a difference through community events and programs
          </p>
        </div>
      </section>

      {/* Event Tabs */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "upcoming"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Upcoming Events ({upcomingEvents.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "past"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Past Events ({pastEvents.length})
            </button>
          </div>

          {/* Events Grid */}
          <div className="space-y-8">
            {displayEvents.map((event) => {
              const availabilityPercent = getAvailabilityPercent(event.registered, event.capacity);
              
              return (
                <div key={event.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Event Image */}
                    <div className="md:col-span-1 h-64 md:h-auto overflow-hidden">
                      <ImageWithFallback
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Event Details */}
                    <div className="md:col-span-2 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold mb-3">
                            {event.category}
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h3>
                        </div>
                        {event.status === "past" && (
                          <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold">
                            Completed
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 mb-4">{event.description}</p>

                      {/* Event Info Grid */}
                      <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm text-gray-500">Date</div>
                            <div className="font-semibold text-gray-900">{formatDate(event.date)}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm text-gray-500">Time</div>
                            <div className="font-semibold text-gray-900">{event.time}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm text-gray-500">Location</div>
                            <div className="font-semibold text-gray-900">{event.location}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm text-gray-500">Capacity</div>
                            <div className="font-semibold text-gray-900">
                              {event.registered} / {event.capacity} registered
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Availability Bar (for upcoming events) */}
                      {event.status === "upcoming" && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Availability</span>
                            <span className="font-semibold text-gray-900">{availabilityPercent}% Full</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${
                                availabilityPercent >= 90 ? 'bg-red-500' : 
                                availabilityPercent >= 70 ? 'bg-orange-500' : 
                                'bg-green-500'
                              }`}
                              style={{ width: `${availabilityPercent}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Pricing and Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200">
                        <div>
                          <div className="text-sm text-gray-500">Ticket Price</div>
                          <div className="text-xl font-bold text-blue-600">{event.ticketPrice}</div>
                        </div>
                        
                        <div className="flex gap-3">
                          <button 
                            onClick={() => setSelectedEvent(event.id)}
                            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                          >
                            Read More
                          </button>
                          {event.status === "upcoming" ? (
                            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2">
                              Register Now
                              <ArrowRight className="w-5 h-5" />
                            </button>
                          ) : (
                            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              Completed
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEventData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header with Image */}
              <div className="relative h-72 overflow-hidden rounded-t-2xl">
                <ImageWithFallback
                  src={selectedEventData.image}
                  alt={selectedEventData.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-6 h-6 text-gray-900" />
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold mb-3">
                    {selectedEventData.category}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {selectedEventData.title}
                  </h2>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                {/* Event Details Grid */}
                <div className="grid sm:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Date</div>
                      <div className="font-semibold text-gray-900">
                        {formatDate(selectedEventData.date)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Time</div>
                      <div className="font-semibold text-gray-900">{selectedEventData.time}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Location</div>
                      <div className="font-semibold text-gray-900">{selectedEventData.location}</div>
                      <div className="text-sm text-gray-600 mt-1">{selectedEventData.address}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Capacity</div>
                      <div className="font-semibold text-gray-900">
                        {selectedEventData.registered} / {selectedEventData.capacity} registered
                      </div>
                      {selectedEventData.status === "upcoming" && (
                        <div className="mt-2 w-48">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                getAvailabilityPercent(selectedEventData.registered, selectedEventData.capacity) >= 90 ? 'bg-red-500' : 
                                getAvailabilityPercent(selectedEventData.registered, selectedEventData.capacity) >= 70 ? 'bg-orange-500' : 
                                'bg-green-500'
                              }`}
                              style={{ width: `${getAvailabilityPercent(selectedEventData.registered, selectedEventData.capacity)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">About This Event</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedEventData.longDescription}
                  </p>
                </div>

                {/* Organizer & Contact */}
                <div className="bg-blue-50 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Organizer & Contact</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <div>
                        <span className="font-semibold text-gray-900">{selectedEventData.organizer}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <a 
                        href={`mailto:${selectedEventData.contactEmail}`} 
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {selectedEventData.contactEmail}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <a 
                        href={`tel:${selectedEventData.contactPhone}`} 
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {selectedEventData.contactPhone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Ticket Price & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-200">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Ticket Price</div>
                    <div className="text-3xl font-bold text-blue-600">{selectedEventData.ticketPrice}</div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                    >
                      Close
                    </button>
                    {selectedEventData.status === "upcoming" ? (
                      <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2">
                        Register Now
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    ) : (
                      <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold flex items-center gap-2 cursor-not-allowed">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Event Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Want to Host Your Own Event?
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Partner with us to create meaningful events that drive impact in your community.
          </p>
          <a
            href="/partner"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Become a Partner
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </div>
  );
}