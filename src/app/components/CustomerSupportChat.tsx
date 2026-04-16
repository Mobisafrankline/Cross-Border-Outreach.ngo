import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, User, Bot, HelpCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
}

const SYSTEM_PROMPT = `
You are a helpful, empathetic, and professional customer support assistant for Cross-borders Outreach Ministry Inc. 
You answer questions concisely based on typical knowledge of an NGO.
Key info: 
- We provide Food Support, Education, Healthcare, and Economic Empowerment.
- We operate in various regions, notably holding events in the USA (e.g. Atlanta, GA) and Kenya (e.g. Nairobi floods, Murang'a Rescue Centre).
- Our mission is to cross borders to uplift vulnerable communities.

CRITICAL INSTRUCTION:
If a user asks a highly complex or sensitive question (such as filing a serious complaint, wanting to arrange a major corporate partnership, asking specific questions about their specific private donations, or explicitly repeatedly asking to speak with a human), you MUST output exactly and ONLY this JSON string: 
{"action": "HANDOFF"}
Never say "I will hand you over". Just output the JSON.
`;

export default function CustomerSupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "model", text: "Hello! I am the Cross-borders Outreach assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [needsHandoff, setNeedsHandoff] = useState(false);
  
  // Handoff form state
  const [handoffForm, setHandoffForm] = useState({ email: "", message: "" });
  const [handoffState, setHandoffState] = useState<"idle" | "submitting" | "success">("idle");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setInput("");
    
    const newMessages: Message[] = [...messages, { id: Date.now().toString(), role: "user", text: userText }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey || apiKey === "your_gemini_api_key_here") {
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            role: "model", 
            text: "It looks like the Gemini API key isn't configured yet. Please ask the developer to set VITE_GEMINI_API_KEY in the .env.local file." 
          }]);
          setIsTyping(false);
        }, 1000);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // Format previous history for Gemini (excluding the initial greeting if we want, or mapping to model/user)
      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
          { role: "model", parts: [{ text: "Understood." }] },
          ...messages.slice(1).map(msg => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.text }]
          }))
        ]
      });

      const result = await chat.sendMessage(userText);
      const responseText = result.response.text().trim();

      // Check if LLM requested human handoff
      if (responseText.includes('{"action": "HANDOFF"}')) {
        setNeedsHandoff(true);
      } else {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: "model", text: responseText }]);
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "model", text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleHandoffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHandoffState("submitting");
    
    // Simulate sending email to support team
    setTimeout(() => {
      setHandoffState("success");
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-colors border-4 border-white"
            >
              <MessageCircle className="w-7 h-7" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-[100] w-[350px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden border border-gray-100 flex flex-col h-[500px] max-h-[calc(100vh-6rem)]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Crossborders Assist</h3>
                  <p className="text-[11px] text-blue-100 font-medium">We typically reply instantly</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {needsHandoff ? (
              /* Human Handoff View */
              <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-gray-50">
                {handoffState === "success" ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                      <HelpCircle className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Message Sent!</h4>
                    <p className="text-gray-600 text-sm">
                      Our human support team has received your query and will contact you via email shortly.
                    </p>
                    <button 
                      onClick={() => {
                        setNeedsHandoff(false);
                        setHandoffState("idle");
                        // Add a friendly follow up
                        setMessages(prev => [...prev, { id: Date.now().toString(), role: "model", text: "I've notified the team. Is there anything else I can help you with in the meantime?" }]);
                      }}
                      className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full"
                    >
                      Back to chat
                    </button>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
                    <div className="mb-6 text-center">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">Connect with a Human</h4>
                      <p className="text-xs text-gray-500 mt-1">This query requires a real person. Leave your details and we will reach out.</p>
                    </div>

                    <form onSubmit={handleHandoffSubmit} className="flex flex-col gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={handoffForm.email}
                          onChange={(e) => setHandoffForm({...handoffForm, email: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="you@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">How can we help?</label>
                        <textarea 
                          required
                          value={handoffForm.message}
                          onChange={(e) => setHandoffForm({...handoffForm, message: e.target.value})}
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                          placeholder="Describe your request..."
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={handoffState === "submitting"}
                        className="mt-2 w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-70"
                      >
                        {handoffState === "submitting" ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                        ) : (
                          <><Send className="w-4 h-4" /> Send to Support</>
                        )}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setNeedsHandoff(false)}
                        className="text-xs text-gray-500 hover:text-gray-900 font-medium py-2"
                      >
                        Cancel and return to AI
                      </button>
                    </form>
                  </motion.div>
                )}
              </div>
            ) : (
              /* Chat View */
              <>
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`max-w-[85%] flex flex-col ${msg.role === "user" ? "self-end items-end" : "self-start items-start"}`}
                    >
                      <div 
                        className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                          msg.role === "user" 
                            ? "bg-blue-600 text-white rounded-br-sm" 
                            : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="self-start items-start max-w-[85%]">
                      <div className="px-5 py-3.5 bg-white border border-gray-100 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} className="h-px shrink-0" />
                </div>

                <div className="p-3 bg-white border-t border-gray-100 shrink-0">
                  <div className="relative flex items-center">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Type a message..."
                      className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400"
                    />
                    <button 
                      onClick={handleSend}
                      disabled={!input.trim() || isTyping}
                      className="absolute right-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <Send className="w-4 h-4" />
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
