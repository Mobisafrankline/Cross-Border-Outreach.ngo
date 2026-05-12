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
  Gift
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
    if (currentAmount < 50) return "This provides essential school supplies to empower young minds.";
    if (currentAmount < 100) return "This feeds a family of 4 facing crisis for an entire week.";
    if (currentAmount < 250) return "This covers life-saving medical treatment for 5 patients.";
    if (currentAmount < 500) return "This funds vocational training to break the cycle of poverty.";
    if (currentAmount < 1000) return "This provides a massive microloan to kickstart a small family business.";
    return "Your tremendous generosity helps fund large-scale community infrastructure.";
  }, [currentAmount]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Header */}
      <div className="bg-blue-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,#3b82f6_0%,transparent_50%)]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Empower Change Through <br/>
              <span className="text-orange-400 italic">Generosity</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Your contribution directly funds life-saving programs in vulnerable communities. 
              Join thousands of donors in making a global impact.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 -mt-16 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Impact & Info */}
          <div className="lg:col-span-7 space-y-8">
            {/* Impact Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-8 border border-slate-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-orange-500 fill-current" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">The Power of Your Gift</h3>
                  <p className="text-slate-500 text-sm">See how your contribution transforms lives</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Globe className="w-24 h-24 text-blue-600" />
                </div>
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={dynamicImpact}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative z-10"
                  >
                    <p className="text-2xl font-bold text-slate-800 leading-tight">
                      {dynamicImpact}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">100%</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">To Programs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">Secure</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">PCI Compliant</div>
                </div>
                <div className="text-center hidden md:block">
                  <div className="text-2xl font-bold text-blue-600">Tax Relief</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">501(c)(3) Cert</div>
                </div>
              </div>
            </motion.div>

            {/* Other Ways to Give */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 px-2 flex items-center gap-2">
                <Gift className="w-5 h-5 text-blue-600" />
                Other Ways to Give
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setPaymentMethod("bank")}
                  className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left ${paymentMethod === "bank" ? "border-blue-600 bg-white shadow-lg" : "border-transparent bg-white hover:border-slate-200"}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${paymentMethod === "bank" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Bank & Wire Transfer</div>
                    <p className="text-sm text-slate-500">Direct deposit from any bank globally.</p>
                  </div>
                </button>
                <button 
                  onClick={() => setPaymentMethod("crypto")}
                  className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left ${paymentMethod === "crypto" ? "border-blue-600 bg-white shadow-lg" : "border-transparent bg-white hover:border-slate-200"}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${paymentMethod === "crypto" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                    <Bitcoin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Cryptocurrency</div>
                    <p className="text-sm text-slate-500">Donate BTC, ETH, and other tokens.</p>
                  </div>
                </button>
              </div>

              {/* Bank Details Modal-like Section */}
              <AnimatePresence>
                {paymentMethod === "bank" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-blue-600 text-white rounded-2xl p-8 overflow-hidden"
                  >
                    <div className="flex items-center gap-2 mb-6 opacity-80">
                      <Lock className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Bank Deposit Information</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <div className="text-sm text-blue-100 mb-1">Bank Name</div>
                        <div className="text-lg font-bold">Standard Chartered Bank</div>
                        <div className="text-sm text-blue-100 mt-4 mb-1">Account Number</div>
                        <div className="text-lg font-bold font-mono">0123456789</div>
                      </div>
                      <div>
                        <div className="text-sm text-blue-100 mb-1">SWIFT / BIC Code</div>
                        <div className="text-lg font-bold font-mono">SCBLUS33XXX</div>
                        <div className="text-sm text-blue-100 mt-4 mb-1">Account Holder</div>
                        <div className="text-lg font-bold uppercase">Crossborders Outreach Ministry Inc</div>
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
                      <Smartphone className="w-5 h-5 opacity-70" />
                      <p className="text-sm text-blue-100 italic">
                        Please send a screenshot of the transfer to <span className="font-bold">donations@crossborders.ngo</span>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Crypto Details */}
              <AnimatePresence>
                {paymentMethod === "crypto" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-slate-900 text-white rounded-2xl p-8 overflow-hidden"
                  >
                    <div className="flex items-center gap-2 mb-6 opacity-60">
                      <Smartphone className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Crypto Wallet Addresses</span>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <div className="text-xs text-slate-400 font-bold uppercase mb-2">Bitcoin (BTC)</div>
                        <div className="bg-slate-800 p-3 rounded-lg font-mono text-sm break-all border border-slate-700 select-all">
                          bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-bold uppercase mb-2">Ethereum / ERC-20 (ETH, USDT)</div>
                        <div className="bg-slate-800 p-3 rounded-lg font-mono text-sm break-all border border-slate-700 select-all">
                          0x71C7656EC7ab88b098defB751B7401B5f6d8976F
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Donation Widget */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-slate-100 p-8 sm:p-10"
            >
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
                Secure Checkout
              </h2>

              {/* Frequency */}
              <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
                <button 
                  onClick={() => setDonationType("one-time")}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${donationType === "one-time" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  One-time
                </button>
                <button 
                  onClick={() => setDonationType("monthly")}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${donationType === "monthly" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <Calendar className="w-4 h-4" />
                  Monthly
                </button>
              </div>

              {/* Amounts */}
              <div className="space-y-6 mb-8">
                <div className="grid grid-cols-3 gap-3">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => { setSelectedAmount(amount); setCustomAmount(""); }}
                      className={`py-4 rounded-2xl font-bold text-lg border-2 transition-all ${
                        selectedAmount === amount 
                          ? "border-blue-600 bg-blue-50 text-blue-600" 
                          : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200"
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <DollarSign className={`w-5 h-5 transition-colors ${!selectedAmount && customAmount ? "text-blue-600" : "text-slate-400"}`} />
                  </div>
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); if(e.target.value) setSelectedAmount(null); }}
                    className={`w-full bg-slate-50 pl-12 pr-6 py-5 rounded-2xl border-2 font-bold text-xl text-slate-900 transition-all focus:outline-none ${!selectedAmount && customAmount ? "border-blue-600 bg-white" : "border-slate-100 focus:border-blue-300"}`}
                  />
                </div>
              </div>

              {/* Stripe Payment Form */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm mb-4 px-1">
                  <span className="text-slate-500 font-medium">Total Contribution</span>
                  <span className="text-slate-900 font-black text-xl">${currentAmount.toLocaleString()}</span>
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
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center">
                      <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm text-slate-600 mb-4 font-medium">
                        Secure credit card payments are currently being configured.
                      </p>
                      <button 
                        onClick={() => setPaymentMethod("bank")}
                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                      >
                        View Bank Details <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )
                ) : (
                  <div className="bg-slate-50 rounded-2xl p-10 text-center border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Select an amount above</p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex items-center justify-center gap-4 text-slate-400">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"><Shield className="w-3 h-3" /> SSL Secured</div>
                <div className="w-1 h-1 bg-slate-200 rounded-full" />
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"><Lock className="w-3 h-3" /> Data Encrypted</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <section className="bg-white py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Why Trust Us?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We are committed to the highest standards of financial accountability and transparency.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Financial Audits",
                desc: "We undergo annual external audits to ensure every cent is accounted for and used efficiently.",
                icon: Shield
              },
              {
                title: "Impact Verified",
                desc: "We publish detailed impact reports quarterly, showing the real-world results of your donations.",
                icon: CheckCircle2
              },
              {
                title: "Secure Data",
                desc: "Your personal and financial information is protected by industry-leading encryption standards.",
                icon: Lock
              }
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-slate-900 py-20 overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8">
            Can't give right now? <br/>
            <span className="text-blue-400">Join our volunteer team.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/volunteer" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2">
              Explore Opportunities <ArrowRight className="w-5 h-5" />
            </a>
            <a href="/fundraise" className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              Start a Fundraiser
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}