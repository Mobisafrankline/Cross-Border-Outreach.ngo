import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, User, Bot, HelpCircle, Loader2, Heart, Globe, Phone, Mail as MailIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
}

const SYSTEM_PROMPT = `
You are a deeply empathetic, professional, and helpful customer support assistant for Cross-Borders Outreach Ministry Inc, a registered 501(c)(3) non-profit organization.
Your tone should be warm, encouraging, and highly respectful.

Here is the key organizational knowledge you must use to answer questions:
- Mission: We cross borders to uplift vulnerable communities globally through tangible, life-saving support.
- Core Programs: Food Support, Education Support, Healthcare Outreach, and Economic Empowerment (microloans and vocational training).
- Key Locations: We are based in the USA (New York/Atlanta) and operate on the ground in Kenya (including flood relief in Nairobi and the Murang'a Rescue Centre).
- Donations: 100% of public donations go directly to our programs. Donations are tax-deductible for US residents. Users can donate via Credit/Debit card securely on our /donate page.
- Contact Info: Email: skamau@crossbordersoutreach.org. Address: 123 Charity Lane, Suite 100, New York, NY 10001.

Rules:
1. Keep your answers concise, structured, and easy to read. Do not write massive paragraphs.
2. If asked how to donate, direct them to click the "Donate" button at the top of the site or visit the /donate page.
3. CRITICAL: If a user asks a highly complex/sensitive question (e.g., canceling a recurring donation, arranging a large corporate partnership, disputes, or explicitly repeating a request for a human), you MUST output exactly and ONLY this JSON string: 
{"action": "HANDOFF"}
Never say "I will hand you over". Just output the JSON exactly as it is.
`;

export default function CustomerSupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "init", role: "model", text: "Welcome to Cross-Borders Outreach! 🌍 Our mission is to uplift vulnerable communities. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [needsHandoff, setNeedsHandoff] = useState(false);
  
  // Handoff form state
  const [handoffForm, setHandoffForm] = useState({ email: "", message: "" });
  const [handoffState, setHandoffState] = useState<"idle" | "submitting" | "success">("idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick Action Suggestions
  const quickActions = [
    "How do I donate?",
    "What programs do you run?",
    "Is my donation tax-deductible?",
    "How can I volunteer?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (textToProcess: string = input) => {
    if (!textToProcess.trim() || isTyping) return;

    const userText = textToProcess.trim();
    setInput("");
    
    // Add user message
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", text: userText }]);
    setIsTyping(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey || apiKey === "your_gemini_api_key_here") {
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            role: "model", 
            text: "It looks like the AI is currently offline for maintenance. Please reach out to skamau@crossbordersoutreach.org for direct help!" 
          }]);
          setIsTyping(false);
        }, 1500);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
          { role: "model", parts: [{ text: "Understood. I will act as a warm, professional representative using the organizational knowledge provided." }] },
          ...messages.slice(1).map(msg => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.text }]
          }))
        ]
      });

      const result = await chat.sendMessage(userText);
      const responseText = result.response.text().trim();

      if (responseText.includes('{"action": "HANDOFF"}')) {
        setNeedsHandoff(true);
      } else {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: "model", text: responseText }]);
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "model", text: "I'm having a little trouble connecting right now. Please try again or email our team directly!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleHandoffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHandoffState("submitting");
    setTimeout(() => {
      setHandoffState("success");
    }, 1500);
  };

  return (
    <>
      {/* ── Floating Launcher ── */}
      <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[100]">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 lg:p-5 rounded-full shadow-[0_10px_40px_-10px_rgba(37,99,235,0.8)] flex items-center justify-center transition-all group relative border-2 border-white"
            >
              <MessageCircle className="w-6 h-6 lg:w-7 lg:h-7" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
              
              {/* Tooltip */}
              <div className="absolute right-full mr-4 bg-white text-gray-900 py-1.5 px-3 rounded-lg shadow-lg text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Need help? Chat with us!
                <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-white rotate-45" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Chat Interface ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[100] w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-gray-100 flex flex-col h-[600px] max-h-[calc(100vh-6rem)]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-5 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-900/20 pattern-grid-lg opacity-20 mix-blend-overlay" />
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                    <Heart className="w-5 h-5 text-red-300 fill-red-300" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-blue-600 rounded-full" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-lg leading-tight tracking-tight">CrossBorders AI</h3>
                  <p className="text-xs text-blue-100 font-medium opacity-90">Support Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors relative z-10"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {needsHandoff ? (
              /* ── Human Handoff View ── */
              <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-gray-50/50">
                {handoffState === "success" ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 shadow-sm border border-green-200">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 tracking-tight">Message Sent</h4>
                    <p className="text-gray-600 text-sm leading-relaxed px-4">
                      Our human support team will review your request and get back to you via email shortly.
                    </p>
                    <button 
                      onClick={() => {
                        setNeedsHandoff(false);
                        setHandoffState("idle");
                        setMessages(prev => [...prev, { id: Date.now().toString(), role: "model", text: "I've escalated that to our human team! Is there anything simpler I can help you with?" }]);
                      }}
                      className="mt-6 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors w-full"
                    >
                      Return to AI Chat
                    </button>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
                    <div className="mb-6 text-center">
                      <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-orange-200">
                        <User className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg tracking-tight">Connect with a Human</h4>
                      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">Let's get you connected with a real team member for this request.</p>
                    </div>

                    <form onSubmit={handleHandoffSubmit} className="flex flex-col gap-4">
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
                          <div className="relative">
                            <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                              type="email" 
                              required
                              value={handoffForm.email}
                              onChange={(e) => setHandoffForm({...handoffForm, email: e.target.value})}
                              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 text-sm outline-none transition-all"
                              placeholder="you@email.com"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Your Message</label>
                          <textarea 
                            required
                            value={handoffForm.message}
                            onChange={(e) => setHandoffForm({...handoffForm, message: e.target.value})}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 text-sm outline-none transition-all resize-none"
                            placeholder="Describe your request..."
                          />
                        </div>
                      </div>
                      
                      <button 
                        type="submit"
                        disabled={handoffState === "submitting"}
                        className="mt-2 w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 hover:shadow-xl transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                      >
                        {handoffState === "submitting" ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /> Sending Securely...</>
                        ) : (
                          <><Send className="w-5 h-5" /> Send to Support Team</>
                        )}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setNeedsHandoff(false)}
                        className="text-xs text-gray-400 hover:text-gray-700 font-bold uppercase tracking-wider py-2 transition-colors"
                      >
                        Cancel
                      </button>
                    </form>
                  </motion.div>
                )}
              </div>
            ) : (
              /* ── Chat View ── */
              <>
                <div className="flex-1 p-5 overflow-y-auto bg-slate-50 flex flex-col gap-5">
                  {/* NGO Mission Banner */}
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-sm text-blue-900 shadow-sm mx-2">
                    <Globe className="w-8 h-8 text-blue-500 shrink-0" />
                    <p className="leading-relaxed opacity-90 text-xs mt-0.5">
                      Your donations directly fund our local outreach programs in Kenya and the USA. Thanks for making a difference!
                    </p>
                  </div>

                  {messages.map((msg, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id} 
                      className={`max-w-[88%] flex flex-col ${msg.role === "user" ? "self-end items-end" : "self-start items-start"}`}
                    >
                      {msg.role === "model" && idx !== 0 && (
                        <div className="flex items-center gap-2 mb-1.5 ml-1">
                          <Bot className="w-3.5 h-3.5 text-blue-600" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">CrossBorders AI</span>
                        </div>
                      )}
                      <div 
                        className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                          msg.role === "user" 
                            ? "bg-blue-600 text-white rounded-br-sm" 
                            : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <div className="self-start items-start max-w-[85%] mt-2">
                      <div className="px-5 py-4 bg-white border border-gray-100 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-blue-600/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 bg-blue-600/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-blue-600/50 rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} className="h-4 shrink-0" />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                  
                  {/* Quick Actions (only show if few messages so far) */}
                  <AnimatePresence>
                    {messages.length < 3 && !isTyping && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex overflow-x-auto gap-2 pb-3 mb-2 no-scrollbar"
                      >
                        {quickActions.map(action => (
                          <button
                            key={action}
                            onClick={() => handleSend(action)}
                            className="shrink-0 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-600 hover:text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
                          >
                            {action}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative flex items-center">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Ask me anything..."
                      className="w-full pl-5 pr-12 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/30 font-medium outline-none transition-all placeholder:text-gray-400 shadow-inner"
                    />
                    <button 
                      onClick={() => handleSend(input)}
                      disabled={!input.trim() || isTyping}
                      className="absolute right-2 p-2 bg-blue-600 text-white rounded-xl shadow-md transition-all hover:bg-blue-700 disabled:opacity-0 disabled:scale-75 disabled:pointer-events-none"
                    >
                      <Send className="w-4 h-4 ml-0.5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
