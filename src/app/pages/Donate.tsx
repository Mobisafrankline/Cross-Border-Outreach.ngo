import { 
  Heart, 
  CreditCard, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  Calendar, 
  Lock, 
  Shield, 
  Apple, 
  Wallet,
  Smartphone,
  Bitcoin,
  Building2,
  QrCode,
  Globe,
  Banknote,
  Landmark,
  RefreshCw,
  Clock
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState } from "react";

type PaymentMethod = 
  | "card" 
  | "paypal" 
  | "apple" 
  | "google" 
  | "bank" 
  | "crypto" 
  | "venmo" 
  | "cashapp" 
  | "zelle"
  | "momo"
  | "klarna"
  | "afterpay"
  | "affirm"
  | "sepa"
  | "ach"
  | "check";

export default function Donate() {
  const [donationType, setDonationType] = useState<"one-time" | "monthly">("one-time");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cryptoType, setCryptoType] = useState<"bitcoin" | "ethereum" | "usdc">("bitcoin");

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000, 2500, 5000];

  const donationImpacts = [
    { amount: "$25", impact: "Provides school supplies for 3 children" },
    { amount: "$50", impact: "Feeds a family of 4 for one week" },
    { amount: "$100", impact: "Covers medical treatment for 5 patients" },
    { amount: "$250", impact: "Funds vocational training for 2 people" },
    { amount: "$500", impact: "Provides a microloan for a small business" },
    { amount: "$1000", impact: "Supports a full scholarship for one year" },
    { amount: "$2500", impact: "Builds a clean water well for a village" },
    { amount: "$5000", impact: "Funds a community health center for 6 months" }
  ];

  const paymentCategories = [
    {
      title: "Cards & Digital Wallets",
      methods: [
        { id: "card" as PaymentMethod, label: "Credit/Debit Card", icon: <CreditCard className="w-5 h-5" /> },
        { id: "paypal" as PaymentMethod, label: "PayPal", icon: <span className="flex items-baseline text-lg"><span className="font-bold text-blue-800">Pay</span><span className="font-bold text-sky-500">Pal</span></span> },
        { id: "apple" as PaymentMethod, label: "Apple Pay", icon: <Apple className="w-5 h-5" /> },
        { id: "google" as PaymentMethod, label: "Google Pay", icon: <Wallet className="w-5 h-5" /> },
        { id: "venmo" as PaymentMethod, label: "Venmo", icon: <span className="font-bold text-blue-600 text-lg">Venmo</span> },
        { id: "cashapp" as PaymentMethod, label: "Cash App", icon: <span className="font-bold text-green-600 text-lg">$</span> },
      ]
    },
    {
      title: "Bank Transfers",
      methods: [
        { id: "bank" as PaymentMethod, label: "Wire Transfer", icon: <Building2 className="w-5 h-5" /> },
        { id: "zelle" as PaymentMethod, label: "Zelle", icon: <span className="font-bold text-purple-600 text-lg">Zelle</span> },
        { id: "ach" as PaymentMethod, label: "ACH Transfer", icon: <Landmark className="w-5 h-5" /> },
        { id: "sepa" as PaymentMethod, label: "SEPA (EU)", icon: <Globe className="w-5 h-5" /> },
        { id: "check" as PaymentMethod, label: "Check/Money Order", icon: <Banknote className="w-5 h-5" /> },
      ]
    },
    {
      title: "Buy Now, Pay Later",
      methods: [
        { id: "klarna" as PaymentMethod, label: "Klarna", icon: <span className="font-bold text-pink-600 text-lg">Klarna</span> },
        { id: "afterpay" as PaymentMethod, label: "Afterpay", icon: <span className="font-bold text-blue-600 text-lg">Afterpay</span> },
        { id: "affirm" as PaymentMethod, label: "Affirm", icon: <span className="font-bold text-indigo-600 text-lg">Affirm</span> },
      ]
    },
    {
      title: "Alternative Payments",
      methods: [
        { id: "crypto" as PaymentMethod, label: "Cryptocurrency", icon: <Bitcoin className="w-5 h-5" /> },
        { id: "momo" as PaymentMethod, label: "Mobile Money", icon: <Smartphone className="w-5 h-5" /> },
      ]
    }
  ];

  const cryptoOptions = [
    { id: "bitcoin", name: "Bitcoin (BTC)", symbol: "₿" },
    { id: "ethereum", name: "Ethereum (ETH)", symbol: "Ξ" },
    { id: "usdc", name: "USD Coin (USDC)", symbol: "◈" }
  ];

  const handlePaymentSubmit = () => {
    const amount = selectedAmount || Number(customAmount);
    console.log(`Processing ${paymentMethod} payment of $${amount}`);
  };

  const getButtonText = () => {
    switch(paymentMethod) {
      case "paypal": return "Continue with PayPal";
      case "apple": return "Pay with Apple Pay";
      case "google": return "Pay with Google Pay";
      case "venmo": return "Pay with Venmo";
      case "cashapp": return "Pay with Cash App";
      case "zelle": return "Open Zelle App";
      case "crypto": return `Donate ${cryptoType.toUpperCase()}`;
      case "momo": return "Continue to Mobile Money";
      case "klarna": return "Pay with Klarna";
      case "afterpay": return "Pay with Afterpay";
      case "affirm": return "Pay with Affirm";
      case "bank": return "View Wire Instructions";
      case "ach": return "Continue with ACH";
      case "sepa": return "View SEPA Details";
      case "check": return "View Mailing Address";
      default: return "Complete Donation";
    }
  };

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1697665387559-253e7a645e96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb25hdGlvbiUyMGdpdmluZyUyMGNoYXJpdHklMjBoYW5kc3xlbnwxfHx8fDE3NzE5OTY4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Donation and giving"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Make a Donation</h1>
          <p className="text-xl md:text-2xl opacity-95">
            Your generosity transforms lives and creates lasting impact in communities
          </p>
        </div>
      </section>

      {/* Donation Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {/* Donation Type Toggle */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setDonationType("one-time")}
                className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all ${
                  donationType === "one-time"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                One-Time Donation
              </button>
              <button
                onClick={() => setDonationType("monthly")}
                className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all ${
                  donationType === "monthly"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Monthly Giving
                </div>
              </button>
            </div>

            {/* Amount Selection */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Select Your Donation Amount</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {predefinedAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                    className={`py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
                      selectedAmount === amount
                        ? "bg-orange-500 text-white shadow-lg scale-105"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    ${amount.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h3>
              
              <div className="space-y-6">
                {paymentCategories.map((category) => (
                  <div key={category.title}>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      {category.title}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {category.methods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-lg border-2 transition-all min-h-[80px] ${
                            paymentMethod === method.id
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {method.id === "paypal" || method.id === "venmo" || method.id === "cashapp" || method.id === "klarna" || method.id === "afterpay" || method.id === "affirm" ? (
                              method.icon
                            ) : (
                              <div className={paymentMethod === method.id ? "text-blue-600" : "text-gray-600"}>
                                {method.icon}
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-xs text-center leading-tight">{method.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Method Specific Forms */}
              <div className="mt-6 bg-gray-50 rounded-xl p-6">
                {/* Credit Card Form */}
                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4 text-green-600">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm font-medium">Secure SSL Encrypted Transaction</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white md:col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="px-4 py-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="px-4 py-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Name on Card"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white md:col-span-2"
                      />
                      <input
                        type="email"
                        placeholder="Email for Receipt"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white md:col-span-2"
                      />
                    </div>
                  </div>
                )}

                {/* PayPal */}
                {paymentMethod === "paypal" && (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-blue-800">Pay</span>
                      <span className="text-4xl font-bold text-sky-500">Pal</span>
                    </div>
                    <p className="text-gray-600 mb-6">
                      You'll be redirected to PayPal to complete your secure donation.
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Buyer Protection</span>
                      <span className="flex items-center gap-1"><RefreshCw className="w-4 h-4" /> Instant</span>
                    </div>
                  </div>
                )}

                {/* Apple Pay */}
                {paymentMethod === "apple" && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Apple className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-gray-600 mb-4">
                      Pay securely with Face ID, Touch ID, or your passcode.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg text-sm text-gray-700">
                      <Lock className="w-4 h-4" />
                      <span>Private & Secure</span>
                    </div>
                  </div>
                )}

                {/* Google Pay */}
                {paymentMethod === "google" && (
                  <div className="text-center py-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-3xl font-medium text-gray-600">G</span>
                      <span className="text-xl font-medium text-gray-600">oogle Pay</span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Fast checkout with your saved Google Pay methods.
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Lock className="w-4 h-4" /> Encrypted</span>
                      <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Protected</span>
                    </div>
                  </div>
                )}

                {/* Venmo */}
                {paymentMethod === "venmo" && (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-blue-600">Venmo</span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Pay easily from your Venmo balance or linked accounts.
                    </p>
                    <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
                      <p>Search for: <span className="font-bold">@CrossbordersOutreach</span></p>
                      <p className="mt-1">Or tap the button below to open Venmo</p>
                    </div>
                  </div>
                )}

                {/* Cash App */}
                {paymentMethod === "cashapp" && (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-green-600">Cash App</span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Quick payment from your Cash App balance.
                    </p>
                    <div className="bg-green-50 rounded-lg p-4 text-sm text-green-800">
                      <p>Cashtag: <span className="font-bold">$CrossbordersNGO</span></p>
                      <p className="mt-1">Or scan QR code at checkout</p>
                    </div>
                  </div>
                )}

                {/* Zelle */}
                {paymentMethod === "zelle" && (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-purple-600">Zelle</span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Direct bank-to-bank transfer with no fees.
                    </p>
                    <div className="bg-purple-50 rounded-lg p-4 text-left text-sm text-purple-800 space-y-2">
                      <p><span className="font-medium">Email:</span> donations@crossborders.org</p>
                      <p><span className="font-medium">Phone:</span> (555) 123-4567</p>
                      <p><span className="font-medium">Name:</span> Cross-Borders Outreach</p>
                    </div>
                  </div>
                )}

                {/* Cryptocurrency */}
                {paymentMethod === "crypto" && (
                  <div className="space-y-4">
                    <div className="flex justify-center gap-4 mb-4">
                      {cryptoOptions.map((crypto) => (
                        <button
                          key={crypto.id}
                          onClick={() => setCryptoType(crypto.id as any)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            cryptoType === crypto.id
                              ? "bg-orange-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {crypto.symbol} {crypto.name}
                        </button>
                      ))}
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
                      <QrCode className="w-32 h-32 mx-auto mb-4 text-orange-600" />
                      <p className="text-sm text-gray-600 mb-2">Scan or copy address:</p>
                      <code className="block bg-white p-3 rounded text-xs break-all font-mono text-orange-800">
                        {cryptoType === "bitcoin" && "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"}
                        {cryptoType === "ethereum" && "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"}
                        {cryptoType === "usdc" && "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"}
                      </code>
                      <p className="text-xs text-gray-500 mt-2">
                        *Crypto donations are tax-deductible at fair market value
                      </p>
                    </div>
                  </div>
                )}

                {/* Mobile Money */}
                {paymentMethod === "momo" && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Select Provider:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="p-4 border-2 border-yellow-400 rounded-lg hover:bg-yellow-50 text-center">
                        <span className="font-bold text-yellow-600">MTN Mobile Money</span>
                      </button>
                      <button className="p-4 border-2 border-red-500 rounded-lg hover:bg-red-50 text-center">
                        <span className="font-bold text-red-600">M-Pesa</span>
                      </button>
                      <button className="p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50 text-center">
                        <span className="font-bold text-blue-600">Airtel Money</span>
                      </button>
                      <button className="p-4 border-2 border-green-500 rounded-lg hover:bg-green-50 text-center">
                        <span className="font-bold text-green-600">Orange Money</span>
                      </button>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 text-sm text-yellow-800">
                      <p>Dial code: <span className="font-bold">*165*3#</span> (MTN example)</p>
                      <p className="mt-1">Merchant ID: <span className="font-bold">CROSSBORDERS</span></p>
                    </div>
                  </div>
                )}

                {/* Buy Now Pay Later */}
                {(paymentMethod === "klarna" || paymentMethod === "afterpay" || paymentMethod === "affirm") && (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-800">
                        {paymentMethod === "klarna" && <span className="text-pink-600">Klarna</span>}
                        {paymentMethod === "afterpay" && <span className="text-blue-600">Afterpay</span>}
                        {paymentMethod === "affirm" && <span className="text-indigo-600">Affirm</span>}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-6 mb-4">
                      <div className="text-center">
                        <Clock className="w-8 h-8 mx-auto mb-1 text-green-500" />
                        <span className="text-sm font-medium">4 Payments</span>
                      </div>
                      <div className="text-center">
                        <RefreshCw className="w-8 h-8 mx-auto mb-1 text-blue-500" />
                        <span className="text-sm font-medium">0% Interest</span>
                      </div>
                      <div className="text-center">
                        <CheckCircle2 className="w-8 h-8 mx-auto mb-1 text-purple-500" />
                        <span className="text-sm font-medium">No Fees</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Split your donation into 4 interest-free payments. 
                      First payment today, rest every 2 weeks.
                    </p>
                  </div>
                )}

                {/* Bank Transfer */}
                {paymentMethod === "bank" && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Wire Transfer Details
                      </h4>
                      <div className="space-y-3 text-sm text-blue-800">
                        <div className="grid grid-cols-3 gap-2">
                          <span className="font-medium">Bank Name:</span>
                          <span className="col-span-2">Chase Bank, N.A.</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="font-medium">Account Name:</span>
                          <span className="col-span-2">Cross-Borders Outreach Ministry Inc</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="font-medium">Account #:</span>
                          <span className="col-span-2 font-mono">000123456789</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="font-medium">Routing #:</span>
                          <span className="col-span-2 font-mono">021000021</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="font-medium">SWIFT:</span>
                          <span className="col-span-2 font-mono">CHASUS33</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="font-medium">Address:</span>
                          <span className="col-span-2">270 Park Avenue, New York, NY 10017</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Please include your email in the transfer notes for receipt purposes.
                      International wires may take 3-5 business days.
                    </p>
                  </div>
                )}

                {/* ACH Transfer */}
                {paymentMethod === "ach" && (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="font-semibold text-green-900 mb-4">ACH Bank Transfer</h4>
                      <div className="space-y-3 text-sm text-green-800">
                        <p><span className="font-medium">Account Type:</span> Checking</p>
                        <p><span className="font-medium">Routing Number:</span> 021000021</p>
                        <p><span className="font-medium">Account Number:</span> 000123456789</p>
                        <p><span className="font-medium">Bank:</span> Chase Bank</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>ACH transfers typically take 1-2 business days to process</span>
                    </div>
                  </div>
                )}

                {/* SEPA */}
                {paymentMethod === "sepa" && (
                  <div className="space-y-4">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                      <h4 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        SEPA Transfer (EU)
                      </h4>
                      <div className="space-y-3 text-sm text-purple-800">
                        <p><span className="font-medium">IBAN:</span> GB29 NWBK 6016 1331 9268 19</p>
                        <p><span className="font-medium">BIC:</span> NWBKGB2L</p>
                        <p><span className="font-medium">Bank:</span> NatWest Bank</p>
                        <p><span className="font-medium">Reference:</span> DONATION-[Your Email]</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      SEPA transfers are usually free within the EU and take 1 business day.
                    </p>
                  </div>
                )}

                {/* Check */}
                {paymentMethod === "check" && (
                  <div className="space-y-4">
                    <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Banknote className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h4 className="font-semibold text-gray-900 mb-2">Mail Your Check</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium">Cross-Borders Outreach Ministry Inc</p>
                        <p>123 Charity Lane, Suite 100</p>
                        <p>New York, NY 10001</p>
                        <p>USA</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Please make checks payable to "Cross-Borders Outreach Ministry Inc".
                      Include your email address for the tax receipt.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Donate Button */}
            <button 
              onClick={handlePaymentSubmit}
              className="w-full py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Heart className="w-6 h-6 fill-white" />
              {getButtonText()}
            </button>

            {/* Security Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-6 text-gray-400">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span className="text-xs">256-bit SSL</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="text-xs">PCI Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs">Verified Nonprofit</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="text-xs">Global Secure</span>
              </div>
            </div>

            <p className="text-center text-gray-600 mt-4 text-sm">
              Your donation is tax-deductible. You'll receive a receipt via email.
              Questions? Contact us at <a href="mailto:donations@crossborders.org" className="text-blue-600 hover:underline">donations@crossborders.org</a>
            </p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how your donation directly supports our programs and changes lives
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationImpacts.map((item, index) => (
              <div key={index} className="bg-blue-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-blue-600 mb-3">{item.amount}</div>
                <p className="text-gray-700 text-sm">{item.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Ways to Give */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Other Ways to Give</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Stock Donations</h3>
              <p className="text-gray-600 mb-4">
                Donate appreciated stocks and receive tax benefits
              </p>
              <a href="/contact" className="text-blue-600 font-semibold hover:text-blue-700">
                Learn More →
              </a>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Corporate Matching</h3>
              <p className="text-gray-600 mb-4">
                Double your impact through employer matching gifts
              </p>
              <a href="/partner" className="text-blue-600 font-semibold hover:text-blue-700">
                Learn More →
              </a>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Legacy Giving</h3>
              <p className="text-gray-600 mb-4">
                Create a lasting impact through planned giving
              </p>
              <a href="/contact" className="text-blue-600 font-semibold hover:text-blue-700">
                Learn More →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Why Donate to Crossborders?</h2>
          <div className="space-y-4">
            {[
              "100% of your donation goes directly to programs",
              "Tax-deductible contributions (501(c)(3) certified)",
              "Transparent financial reporting and accountability",
              "Regular updates on your donation's impact",
              "Direct community partnerships ensuring effectiveness"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4 bg-white rounded-lg p-4">
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}