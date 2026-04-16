import { 
  Heart, 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  Calendar, 
  Shield, 
  Apple, 
  Wallet,
  Globe,
  ChevronDown,
  AlertCircle
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe, isStripeConfigured } from "../../lib/stripe";
import PaymentForm from "../components/PaymentForm";

type PaymentMethod = 
  | "card" | "paypal" | "apple" | "google" 
  | "venmo" | "cashapp" | "zelle" | "crypto" 
  | "momo" | "klarna" | "afterpay" | "affirm" 
  | "sepa" | "ach" | "check" | "bank";

export default function Donate() {
  const [donationType, setDonationType] = useState<"one-time" | "monthly">("one-time");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [selectedProgram, setSelectedProgram] = useState("general");
  const [showMoreMethods, setShowMoreMethods] = useState(false);

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

  const topMethods = [
    { id: "card" as PaymentMethod, label: "Credit Card", icon: <CreditCard className="w-5 h-5 text-gray-700" /> },
    { id: "paypal" as PaymentMethod, label: "PayPal", icon: <span className="font-bold text-blue-800 text-sm">PayPal</span> },
    { id: "apple" as PaymentMethod, label: "Apple Pay", icon: <Apple className="w-5 h-5 text-black" /> },
    { id: "google" as PaymentMethod, label: "Google Pay", icon: <Wallet className="w-5 h-5 text-red-500" /> },
  ];

  const extendedMethodsOptions = [
    { id: "venmo" as PaymentMethod, label: "Venmo" },
    { id: "cashapp" as PaymentMethod, label: "Cash App" },
    { id: "bank" as PaymentMethod, label: "Wire Transfer" },
    { id: "crypto" as PaymentMethod, label: "Crypto" },
    { id: "klarna" as PaymentMethod, label: "Klarna" },
    { id: "zelle" as PaymentMethod, label: "Zelle" },
    { id: "momo" as PaymentMethod, label: "Mobile Money" }
  ];

  // Map local payment method to PaymentForm prop type
  const mappedPaymentMethod = useMemo(() => {
    const mapping: Record<PaymentMethod, any> = {
      card: "card",
      paypal: "paypal",
      apple: "apple_pay",
      google: "google_pay",
      venmo: "venmo",
      cashapp: "cashapp",
      zelle: "zelle",
      crypto: "crypto",
      momo: "momo",
      klarna: "klarna",
      afterpay: "afterpay",
      affirm: "affirm",
      sepa: "sepa_debit",
      ach: "us_bank_account",
      check: "check",
      bank: "wire"
    };
    return mapping[paymentMethod] || "card";
  }, [paymentMethod]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-start">
          
          {/* Left Column - Story & Impact */}
          <div className="lg:col-span-6 lg:sticky lg:top-32 mb-12 lg:mb-0 space-y-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                Your compassion, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">amplified.</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg mb-8">
                Join our mission to uplift vulnerable communities globally. 100% of your public donation goes directly toward funding essential life-saving and empowering programs.
              </p>
              
              <div className="relative h-72 rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
                  alt="Children smiling"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-lg">
                    <AnimatePresence mode="wait">
                      <motion.div key={dynamicImpact} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="flex items-start gap-4">
                        <Heart className="w-8 h-8 text-orange-400 mt-1 flex-shrink-0" fill="currentColor" />
                        <div>
                          <p className="text-white font-semibold text-sm mb-1 uppercase tracking-wider">Your Impact</p>
                          <p className="text-white text-lg font-medium leading-tight">{dynamicImpact}</p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 py-6 border-t border-gray-100">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white
                    ${i===1 ? 'bg-blue-500' : i===2 ? 'bg-orange-400' : i===3 ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                    <Heart className="w-4 h-4 fill-white" />
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-bold text-gray-900">Over 10,000 donors</p>
                <p>Have already joined our mission this year.</p>
              </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Tax-deductible contributions (501(c)(3) certified)</span>
               </div>
               <div className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Transparent financial reporting</span>
               </div>
            </div>
          </div>

          {/* Right Column - Fintech Widget */}
          <div className="lg:col-span-6 relative z-10 w-full xl:w-11/12 ml-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 p-6 sm:p-10"
            >
              
              {/* Frequency Toggle */}
              <div className="bg-gray-100 p-1.5 rounded-2xl flex mb-8 relative">
                <motion.div 
                  className="absolute inset-y-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm border border-gray-100/50"
                  initial={false}
                  animate={{ left: donationType === "one-time" ? "6px" : "calc(50% + 3px)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
                <button onClick={() => setDonationType("one-time")} className={`relative z-10 flex-1 py-3 text-sm font-semibold transition-colors ${donationType === "one-time" ? "text-gray-900" : "text-gray-500"}`}>Give Once</button>
                <button onClick={() => setDonationType("monthly")} className={`relative z-10 flex-1 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${donationType === "monthly" ? "text-gray-900" : "text-gray-500"}`}><Calendar className="w-4 h-4" /> Monthly</button>
              </div>

              {/* Amounts Grid */}
              <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                  <h3 className="text-gray-900 font-bold text-lg">Select Amount</h3>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">USD</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => { setSelectedAmount(amount); setCustomAmount(""); }}
                      className={`py-3.5 rounded-xl font-bold text-lg border-2 transition-all ${
                        selectedAmount === amount ? "border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm" : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign className={`w-5 h-5 transition-colors ${!selectedAmount && customAmount ? "text-blue-600" : "text-gray-400"}`} />
                  </div>
                  <input
                    type="number"
                    min="1"
                    placeholder="Other Amount"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); if(e.target.value) setSelectedAmount(null); }}
                    className={`w-full bg-white pl-11 pr-4 py-4 rounded-xl border-2 font-bold text-lg text-gray-900 transition-all focus:outline-none ${!selectedAmount && customAmount ? "border-blue-600" : "border-gray-200 focus:border-blue-400"}`}
                  />
                </div>
              </div>

              {/* Program Selector */}
              <div className="mb-8">
                <h3 className="text-gray-900 font-bold text-lg mb-4">Support a Program</h3>
                <select 
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-blue-400"
                >
                  <option value="general">Where Most Needed</option>
                  <option value="food">Food Support</option>
                  <option value="education">Education Support</option>
                  <option value="healthcare">Health Outreach</option>
                  <option value="economic">Economic Empowerment</option>
                </select>
              </div>

              {/* Payment Methods */}
              <div className="mb-8">
                <h3 className="text-gray-900 font-bold text-lg mb-4">Payment Method</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {topMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => { setPaymentMethod(method.id); setShowMoreMethods(false); }}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                        paymentMethod === method.id ? "border-blue-600 bg-blue-50/50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300 transition-colors"
                      }`}
                    >
                      <div className="h-6 flex items-center justify-center mb-1.5">{method.icon}</div>
                      <span className={`text-[11px] font-semibold ${paymentMethod === method.id ? "text-blue-800" : "text-gray-600"}`}>{method.label}</span>
                    </button>
                  ))}
                </div>

                <div className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50">
                   <button onClick={() => setShowMoreMethods(!showMoreMethods)} className="w-full flex items-center justify-between p-4 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                     <span>More payment options</span>
                     <motion.div animate={{ rotate: showMoreMethods ? 180 : 0 }} className="text-gray-400"><ChevronDown className="w-5 h-5"/></motion.div>
                   </button>
                   <AnimatePresence>
                     {showMoreMethods && (
                       <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 pb-4 border-t border-gray-200/60 pt-2">
                         <div className="flex flex-wrap gap-2">
                           {extendedMethodsOptions.map((method) => (
                              <button key={method.id} onClick={() => setPaymentMethod(method.id)} className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${paymentMethod === method.id ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}>
                                {method.label}
                              </button>
                           ))}
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>
              </div>

              {/* Real Payment Form Integration */}
              {currentAmount > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  {isStripeConfigured() ? (
                    <Elements stripe={getStripe()}>
                      <PaymentForm 
                        amount={currentAmount}
                        donationType={donationType === "one-time" ? "one-time" : "recurring"}
                        program={selectedProgram}
                        paymentMethod={mappedPaymentMethod}
                      />
                    </Elements>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                      <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                      <h4 className="font-bold text-gray-900 mb-2">Payment Setup Required</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        To enable real donations, add your Stripe publishable key to <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs font-mono">.env.local</code>:
                      </p>
                      <code className="block bg-white border border-amber-200 rounded-lg px-4 py-2.5 text-xs font-mono text-left text-amber-900 break-all">
                        VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
                      </code>
                      <p className="text-xs text-gray-500 mt-3">Get your key at <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">dashboard.stripe.com/apikeys</a></p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-center gap-6 mt-8">
                 <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium"><Shield className="w-3.5 h-3.5" /> PCI Compliant</div>
                 <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium"><Globe className="w-3.5 h-3.5" /> Global Secure</div>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}