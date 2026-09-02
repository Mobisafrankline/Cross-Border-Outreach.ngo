import { 
  Heart, 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  Calendar, 
  Shield, 
  Globe,
  AlertCircle,
  Building2,
  Bitcoin,
  ArrowRight,
  ChevronRight,
  Smartphone,
  Lock,
  Gift,
  Award
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe, isStripeConfigured } from "../../lib/stripe";
import PaymentForm from "../components/PaymentForm";

type PaymentMethod = "card" | "bank" | "crypto" | "other";

export default function Donate() {
  const [donationType, setDonationType] = useState<"one-time" | "monthly">("one-time");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000];
  const currentAmount = selectedAmount !== null ? selectedAmount : (Number(customAmount) || 0);
  
  const dynamicImpact = useMemo(() => {
    if (currentAmount < 25) return "Every dollar helps us provide crucial meals and resources.";
    if (currentAmount < 50) return "Provides essential school supplies to empower young minds.";
    if (currentAmount < 100) return "Feeds a family of 4 facing crisis for an entire week.";
    if (currentAmount < 250) return "Covers life-saving medical treatment for 5 patients.";
    if (currentAmount < 500) return "Funds vocational training to break the cycle of poverty.";
    if (currentAmount < 1000) return "Provides a massive microloan to kickstart a family business.";
    return "Your incredible generosity funds large-scale community infrastructure.";
  }, [currentAmount]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-source-serif">
      {/* ── Hero Header ── */}
      <div className="bg-gradient-to-br from-navy-900 to-[#021A2E] text-white py-24 lg:py-32 relative overflow-hidden">
        {/* Background Decorative Orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F5B800]/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[#F5B800] text-xs font-black uppercase tracking-[0.2em] mb-8 shadow-xl">
              <Heart className="w-3.5 h-3.5 fill-[#F5B800]" /> Make A Difference
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight font-playfair drop-shadow-lg">
              Empower Change Through <br/>
              <span className="text-[#F5B800] italic font-playfair">Generosity</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100/90 max-w-3xl mx-auto leading-relaxed font-medium">
              Your contribution directly funds life-saving programs in vulnerable communities. 
              Join thousands of donors in making a global impact today.
            </p>
          </motion.div>
        </div>
        
        {/* SVG Curve */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
          <svg className="relative block w-full h-[50px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C79.8,111.45,159.2,117.8,236.4,111.5c41.3-3.4,81.4-11.2,120.7-21.7C332.9,81.6,327.3,69.5,321.39,56.44Z" className="fill-[#f8f9fa]"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 relative z-20 -mt-8">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* ── Left Column: Impact & Info ── */}
          <div className="lg:col-span-7 space-y-8">
            {/* Impact Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgba(3,43,69,0.06)] p-8 md:p-10 border border-slate-900/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#F5B800]/5 rounded-bl-full -mr-10 -mt-10 pointer-events-none transition-colors duration-500 group-hover:bg-[#F5B800]/10" />
              
              <div className="flex items-center gap-5 mb-8 relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-[#F5B800] to-[#FFD13B] rounded-2xl flex items-center justify-center shadow-lg shadow-[#F5B800]/20 shrink-0">
                  <Award className="w-7 h-7 text-navy-900" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-navy-900 font-playfair">The Power of Your Gift</h3>
                  <p className="text-slate-500 text-sm font-medium">See how your contribution transforms lives</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-navy-900 to-[#021A2E] rounded-3xl p-8 relative overflow-hidden group/inner shadow-inner">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/inner:opacity-20 transition-opacity duration-700">
                  <Globe className="w-32 h-32 text-[#F5B800]" />
                </div>
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={dynamicImpact}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="relative z-10"
                  >
                    <div className="text-[10px] font-black text-[#F5B800] uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Heart className="w-3 h-3 fill-[#F5B800]" /> Core Impact
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-white leading-tight font-playfair">
                      {dynamicImpact}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10 relative z-10">
                <div className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-3xl font-black text-navy-900 mb-1">100%</div>
                  <div className="text-[9px] text-[#F5B800] uppercase tracking-[0.2em] font-black">To Programs</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-3xl font-black text-navy-900 mb-1">SSL</div>
                  <div className="text-[9px] text-[#F5B800] uppercase tracking-[0.2em] font-black">Secure Data</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-100 hidden md:block">
                  <div className="text-3xl font-black text-navy-900 mb-1">Tax</div>
                  <div className="text-[9px] text-[#F5B800] uppercase tracking-[0.2em] font-black">501(c)(3) Cert</div>
                </div>
              </div>
            </motion.div>

            {/* Other Ways to Give */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 pl-2">
                <h3 className="text-2xl font-black text-navy-900 flex items-center gap-3 font-playfair">
                  <Gift className="w-6 h-6 text-[#F5B800]" />
                  Other Ways to Give
                </h3>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <button 
                  onClick={() => setPaymentMethod("bank")}
                  className={`flex items-start gap-4 p-6 rounded-[2rem] border-2 transition-all text-left ${paymentMethod === "bank" ? "border-[#F5B800] bg-white shadow-[0_8px_30px_rgba(245,184,0,0.1)]" : "border-slate-900/5 bg-white hover:border-[#F5B800]/50 hover:shadow-md"}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${paymentMethod === "bank" ? "bg-[#F5B800] text-navy-900 shadow-lg shadow-[#F5B800]/20" : "bg-slate-100 text-slate-500"}`}>
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-black text-navy-900 mb-1">Bank & Wire Transfer</div>
                    <p className="text-sm text-slate-500">Direct deposit from any global bank.</p>
                  </div>
                </button>
                <button 
                  onClick={() => setPaymentMethod("crypto")}
                  className={`flex items-start gap-4 p-6 rounded-[2rem] border-2 transition-all text-left ${paymentMethod === "crypto" ? "border-[#F5B800] bg-white shadow-[0_8px_30px_rgba(245,184,0,0.1)]" : "border-slate-900/5 bg-white hover:border-[#F5B800]/50 hover:shadow-md"}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${paymentMethod === "crypto" ? "bg-[#F5B800] text-navy-900 shadow-lg shadow-[#F5B800]/20" : "bg-slate-100 text-slate-500"}`}>
                    <Bitcoin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-black text-navy-900 mb-1">Cryptocurrency</div>
                    <p className="text-sm text-slate-500">Donate BTC, ETH, and other tokens.</p>
                  </div>
                </button>
              </div>

              {/* Bank Details Dropdown */}
              <AnimatePresence>
                {paymentMethod === "bank" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, scale: 0.98 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.98 }}
                    className="bg-white border border-[#F5B800]/30 shadow-lg shadow-[#F5B800]/5 rounded-[2.5rem] p-8 md:p-10 overflow-hidden relative"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5B800]/5 rounded-bl-full -mr-10 -mt-10 pointer-events-none" />
                    
                    <div className="flex items-center gap-2 mb-8 text-[#F5B800]">
                      <Lock className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Bank Deposit Information</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Bank Name</div>
                        <div className="text-lg font-black text-navy-900">Standard Chartered Bank</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-6 mb-1">Account Number</div>
                        <div className="text-xl font-black font-mono text-navy-900">0123456789</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">SWIFT / BIC Code</div>
                        <div className="text-xl font-black font-mono text-navy-900">SCBLUS33XXX</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-6 mb-1">Account Holder</div>
                        <div className="text-lg font-black uppercase text-navy-900">Cross-borders Outreach</div>
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-100 flex items-start gap-4 bg-slate-50 p-6 rounded-2xl">
                      <Smartphone className="w-6 h-6 text-[#F5B800] shrink-0" />
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        Please send a screenshot of the completed transfer to <span className="font-bold text-navy-900">donations@crossborders.ngo</span> to receive your tax receipt.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Crypto Details Dropdown */}
              <AnimatePresence>
                {paymentMethod === "crypto" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, scale: 0.98 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.98 }}
                    className="bg-navy-900 text-white shadow-xl rounded-[2.5rem] p-8 md:p-10 overflow-hidden relative"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5B800]/10 rounded-bl-full -mr-10 -mt-10 pointer-events-none" />
                    
                    <div className="flex items-center gap-2 mb-8 text-[#F5B800]">
                      <Bitcoin className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Crypto Wallet Addresses</span>
                    </div>
                    <div className="space-y-8">
                      <div>
                        <div className="text-[10px] text-[#F5B800] font-black uppercase tracking-widest mb-3">Bitcoin (BTC)</div>
                        <div className="bg-navy-800/80 p-4 rounded-2xl font-mono text-sm sm:text-base break-all border border-white/10 select-all hover:border-[#F5B800]/50 transition-colors shadow-inner">
                          bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#F5B800] font-black uppercase tracking-widest mb-3">Ethereum / ERC-20 (ETH, USDT)</div>
                        <div className="bg-navy-800/80 p-4 rounded-2xl font-mono text-sm sm:text-base break-all border border-white/10 select-all hover:border-[#F5B800]/50 transition-colors shadow-inner">
                          0x71C7656EC7ab88b098defB751B7401B5f6d8976F
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right Column: Donation Widget ── */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 pt-8 lg:pt-0">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2.5rem] shadow-[0_8px_40px_rgba(3,43,69,0.08)] border border-slate-900/5 p-8 sm:p-10 relative overflow-hidden"
            >
              {/* Subtle top accent */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#F5B800] to-[#FFD13B]" />
              
              <h2 className="text-3xl font-black text-navy-900 mb-8 flex items-center gap-3 font-playfair">
                <CreditCard className="w-8 h-8 text-[#F5B800]" />
                Checkout
              </h2>

              {/* Frequency */}
              <div className="flex p-1.5 bg-slate-50 rounded-full mb-10 border border-slate-100">
                <button 
                  onClick={() => setDonationType("one-time")}
                  className={`flex-1 py-3.5 rounded-full text-sm font-black transition-all uppercase tracking-widest ${donationType === "one-time" ? "bg-white text-navy-900 shadow-md border border-slate-100/50" : "text-slate-400 hover:text-slate-600"}`}
                >
                  One-time
                </button>
                <button 
                  onClick={() => setDonationType("monthly")}
                  className={`flex-1 py-3.5 rounded-full text-sm font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${donationType === "monthly" ? "bg-[#F5B800] text-navy-900 shadow-md shadow-[#F5B800]/20" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <Calendar className="w-4 h-4" /> Monthly
                </button>
              </div>

              {/* Amounts Grid */}
              <div className="space-y-6 mb-10">
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => { setSelectedAmount(amount); setCustomAmount(""); setPaymentMethod("card"); }}
                      className={`py-4 sm:py-5 rounded-2xl font-black text-xl transition-all border-2 ${
                        selectedAmount === amount 
                          ? "border-[#F5B800] bg-gold-50 text-navy-900 shadow-sm" 
                          : "border-slate-100 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                
                {/* Custom Amount */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <DollarSign className={`w-6 h-6 transition-colors font-bold ${!selectedAmount && customAmount ? "text-[#F5B800]" : "text-slate-400"}`} />
                  </div>
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => { 
                      setCustomAmount(e.target.value); 
                      if(e.target.value) { setSelectedAmount(null); setPaymentMethod("card"); } 
                    }}
                    className={`w-full bg-slate-50 pl-14 pr-6 py-5 rounded-2xl border-2 font-black text-2xl text-navy-900 transition-all focus:outline-none placeholder:text-slate-300 placeholder:font-medium placeholder:text-lg ${!selectedAmount && customAmount ? "border-[#F5B800] bg-white shadow-[0_4px_20px_rgba(245,184,0,0.1)]" : "border-slate-100 focus:border-[#F5B800]/50"}`}
                  />
                </div>
              </div>

              {/* Stripe / Checkout Area */}
              <div className="space-y-6">
                <div className="flex items-end justify-between mb-6 pb-6 border-b border-slate-100">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">Total Contribution</span>
                  <span className="text-navy-900 font-black text-4xl font-playfair">${currentAmount.toLocaleString()}</span>
                </div>

                {currentAmount > 0 ? (
                  isStripeConfigured() ? (
                    <Elements stripe={getStripe()}>
                      <PaymentForm 
                        amount={currentAmount}
                        donationType={donationType === "one-time" ? "one-time" : "recurring"}
                      />
                    </Elements>
                  ) : (
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 text-center shadow-inner">
                      <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">
                        Secure credit card payments are currently being configured for deployment.
                      </p>
                      <button 
                        onClick={() => setPaymentMethod("bank")}
                        className="w-full py-5 bg-[#032B45] hover:bg-[#021A2E] text-white rounded-xl font-black uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-3 shadow-lg shadow-navy-900/20"
                      >
                        View Bank Details <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )
                ) : (
                  <div className="bg-slate-50 rounded-2xl p-10 text-center border-2 border-dashed border-slate-200 flex flex-col items-center justify-center min-h-[160px]">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                      <DollarSign className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Select an amount above to continue</p>
                  </div>
                )}
              </div>

              {/* Security Badges */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-slate-400">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" /> SSL Secured
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
                  <Lock className="w-3.5 h-3.5 text-navy-900" /> AES-256 Encrypted
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Trust Section ── */}
      <section className="bg-white py-24 border-t border-slate-900/5 relative overflow-hidden">
        {/* Decorative background logo/icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
          <Shield className="w-[600px] h-[600px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-navy-900 mb-6 font-playfair">Why Trust <span className="text-[#F5B800]">Us?</span></h2>
            <div className="w-24 h-1.5 bg-[#F5B800] rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              We are unconditionally committed to the highest standards of financial accountability, transparency, and operational efficiency.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                title: "Financial Audits",
                desc: "We undergo strict annual external audits to ensure every single cent is accounted for and utilized efficiently.",
                icon: Shield
              },
              {
                title: "Impact Verified",
                desc: "We publish detailed, public impact reports quarterly, showing the tangible, real-world results of your donations.",
                icon: CheckCircle2
              },
              {
                title: "Secure Data",
                desc: "Your personal and financial information is fully protected by industry-leading, bank-grade encryption standards.",
                icon: Lock
              }
            ].map((item, i) => (
              <div key={i} className="text-center group bg-[#f8f9fa] p-10 rounded-[2.5rem] hover:bg-white hover:shadow-[0_20px_40px_rgba(3,43,69,0.06)] transition-all duration-500 border border-slate-900/5">
                <div className="w-20 h-20 bg-white shadow-md text-[#F5B800] rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-[#F5B800] group-hover:text-white transition-all duration-500 transform rotate-3 group-hover:-rotate-3">
                  <item.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-navy-900 mb-4 font-playfair">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-gradient-to-br from-navy-900 to-[#021A2E] py-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#F5B800]/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20">
            <Heart className="w-10 h-10 text-[#F5B800]" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 font-playfair drop-shadow-md">
            Can't Give Right <span className="text-[#F5B800]">Now?</span>
          </h2>
          <p className="text-xl text-blue-100/80 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            There are many other ways to support our mission. Join our volunteer team or start your own fundraiser to help spread the word.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <a href="/opportunities" className="px-10 py-5 bg-[#F5B800] text-navy-900 rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#FFD13B] hover:-translate-y-1 transition-all shadow-xl shadow-[#F5B800]/20 flex items-center justify-center gap-3">
              Explore Opportunities <ArrowRight className="w-5 h-5" />
            </a>
            <a href="/fundraise" className="px-10 py-5 bg-transparent border border-[#F5B800]/30 text-[#F5B800] rounded-full font-black text-sm uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-3">
              Start a Fundraiser
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
