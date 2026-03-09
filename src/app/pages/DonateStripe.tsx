import { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { Heart, CreditCard, DollarSign, Building2, Smartphone, Wallet } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { getStripe, PAYMENT_METHODS, getPaymentMethodDisplay } from "../../lib/stripe";
import PaymentForm from "../components/PaymentForm";

export default function DonateStripe() {
  const [donationType, setDonationType] = useState<"one-time" | "recurring">("one-time");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("general");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(PAYMENT_METHODS.CARD);

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000];

  const programs = [
    { id: "general", label: "Where Most Needed", description: "We'll direct your donation where it's needed most" },
    { id: "food", label: "Food Support", description: "Provide nutritious meals to families" },
    { id: "education", label: "Education Support", description: "Fund school supplies and scholarships" },
    { id: "healthcare", label: "Health Outreach", description: "Support medical care and clinics" },
    { id: "economic", label: "Economic Empowerment", description: "Fund job training and microloans" }
  ];

  const paymentMethods = [
    { 
      id: PAYMENT_METHODS.CARD, 
      icon: <CreditCard className="w-5 h-5" />, 
      label: "Credit/Debit Card",
      description: "Visa, Mastercard, Amex, Discover"
    },
    { 
      id: PAYMENT_METHODS.ACH, 
      icon: <Building2 className="w-5 h-5" />, 
      label: "Bank Account",
      description: "Direct bank transfer (ACH)"
    },
    { 
      id: PAYMENT_METHODS.APPLE_PAY, 
      icon: <Smartphone className="w-5 h-5" />, 
      label: "Apple Pay",
      description: "Fast & secure with Apple Pay"
    },
    { 
      id: PAYMENT_METHODS.GOOGLE_PAY, 
      icon: <Smartphone className="w-5 h-5" />, 
      label: "Google Pay",
      description: "Quick checkout with Google"
    },
    { 
      id: PAYMENT_METHODS.PAYPAL, 
      icon: <Wallet className="w-5 h-5" />, 
      label: "PayPal",
      description: "Pay with your PayPal account"
    },
    { 
      id: PAYMENT_METHODS.CASH_APP, 
      icon: <DollarSign className="w-5 h-5" />, 
      label: "Cash App Pay",
      description: "Use Cash App to donate"
    }
  ];

  const donationAmount = selectedAmount || parseFloat(customAmount) || 0;
  const stripePromise = getStripe();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1697665387559-253e7a645e96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb25hdGlvbiUyMGdpdmluZyUyMGNoYXJpdHklMjBoYW5kc3xlbnwxfHx8fDE3NzE5OTY4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Donation and giving"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <Heart className="w-5 h-5 fill-white" />
            <span className="font-semibold">Secure Donation</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Make a Donation</h1>
          <p className="text-xl md:text-2xl opacity-95">
            Your generosity transforms lives and creates lasting impact
          </p>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                {/* Step 1: Donation Type */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Donation Type</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setDonationType("one-time")}
                      className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                        donationType === "one-time"
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <DollarSign className="w-6 h-6 mx-auto mb-2" />
                      One-Time
                    </button>
                    <button
                      onClick={() => setDonationType("recurring")}
                      className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                        donationType === "recurring"
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <Heart className="w-6 h-6 mx-auto mb-2" />
                      Monthly
                    </button>
                  </div>
                </div>

                {/* Step 2: Amount */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Amount</h2>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {predefinedAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount("");
                        }}
                        className={`py-4 px-6 rounded-lg border-2 font-bold transition-all ${
                          selectedAmount === amount
                            ? "border-blue-600 bg-blue-50 text-blue-600"
                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Custom Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-lg">$</span>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setSelectedAmount(null);
                        }}
                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-lg"
                        placeholder="Enter amount"
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 3: Program Selection */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Program</h2>
                  <div className="space-y-3">
                    {programs.map((program) => (
                      <button
                        key={program.id}
                        onClick={() => setSelectedProgram(program.id)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedProgram === program.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-300 bg-white hover:border-gray-400"
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{program.label}</div>
                        <div className="text-sm text-gray-600 mt-1">{program.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 4: Payment Method */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Method</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                          selectedPaymentMethod === method.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-300 bg-white hover:border-gray-400"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          selectedPaymentMethod === method.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                        }`}>
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{method.label}</div>
                          <div className="text-xs text-gray-600 mt-0.5">{method.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 5: Payment Form */}
                {donationAmount > 0 && (
                  <Elements stripe={stripePromise}>
                    <PaymentForm
                      amount={donationAmount}
                      donationType={donationType}
                      program={selectedProgram}
                      paymentMethod={selectedPaymentMethod}
                    />
                  </Elements>
                )}
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-white sticky top-40">
                <h3 className="text-2xl font-bold mb-6">Donation Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between py-3 border-b border-blue-400/30">
                    <span className="opacity-90">Type:</span>
                    <span className="font-semibold capitalize">{donationType}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-blue-400/30">
                    <span className="opacity-90">Program:</span>
                    <span className="font-semibold">
                      {programs.find(p => p.id === selectedProgram)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-blue-400/30">
                    <span className="opacity-90">Payment:</span>
                    <span className="font-semibold text-sm">
                      {getPaymentMethodDisplay(selectedPaymentMethod)}
                    </span>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-6">
                  <div className="text-sm opacity-90 mb-2">Total Amount</div>
                  <div className="text-4xl font-bold">
                    ${donationAmount.toLocaleString()}
                  </div>
                  {donationType === "recurring" && (
                    <div className="text-sm opacity-90 mt-2">per month</div>
                  )}
                </div>

                <div className="space-y-3 text-sm opacity-90">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span>100% of your donation goes to the program</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span>Tax-deductible receipt provided</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span>Cancel recurring donations anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">🔒</div>
              <div className="text-sm text-gray-600 mt-1">Secure SSL</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">✓</div>
              <div className="text-sm text-gray-600 mt-1">Verified Nonprofit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">💳</div>
              <div className="text-sm text-gray-600 mt-1">PCI Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">⚡</div>
              <div className="text-sm text-gray-600 mt-1">Powered by Stripe</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
