import { useState, FormEvent } from "react";
import {
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import {
  Mail,
  User,
  MapPin,
  Lock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Shield,
  Smartphone,
  Globe2
} from "lucide-react";
import { createPaymentIntent } from "../../lib/stripe";
import { supabase } from "../../lib/supabase";

interface PaymentFormProps {
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  prefillData?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

export default function PaymentForm({
  amount,
  donationType,
  onSuccess,
  onError,
  prefillData
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [formData, setFormData] = useState({
    firstName: prefillData?.firstName || "",
    lastName: prefillData?.lastName || "",
    email: prefillData?.email || "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    program: "General donation"
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Payment system not initialized");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { data: paymentData, error: paymentError } = await createPaymentIntent({
        amount: amount * 100,
        currency: "usd",
        program: formData.program,
        donorEmail: formData.email,
        donorName: `${formData.firstName} ${formData.lastName}`,
        recurring: donationType === "recurring",
        frequency: donationType === "recurring" ? "monthly" : undefined,
        paymentMethod: "card"
      });

      if (paymentError || !paymentData) {
        throw new Error("Failed to create payment intent");
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const result = await stripe.confirmCardPayment(paymentData.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            address: {
              line1: formData.address,
              city: formData.city,
              state: formData.state,
              postal_code: formData.zip,
              country: formData.country
            }
          }
        }
      });

      if (result.error) {
        throw new Error(result.error.message || "Payment failed");
      }

      const { error: dbError } = await supabase
        .from('donations')
        .insert({
          donor_email: formData.email,
          donor_name: `${formData.firstName} ${formData.lastName}`,
          amount: amount,
          program: formData.program,
          payment_method: "card",
          stripe_payment_id: result.paymentIntent?.id || null,
          status: 'completed',
          type: donationType
        });

      if (dbError) {
        console.error("Failed to save donation:", dbError);
      }

      setSuccess(true);
      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-10 text-center shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600" />
        <div className="w-20 h-20 bg-white shadow-md border-4 border-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Payment Successful</h3>
        <p className="text-lg text-emerald-800 font-medium mb-6">
          Your {donationType === 'recurring' ? 'monthly' : ''} donation of ${amount} has been securely processed.
        </p>
        <div className="bg-white rounded-xl p-4 inline-flex items-center gap-3 border border-emerald-100 shadow-sm">
          <Mail className="w-5 h-5 text-emerald-500" />
          <span className="text-slate-600 font-medium text-sm">Receipt sent to <b className="text-slate-800">{formData.email}</b></span>
        </div>
      </div>
    );
  }

  const inputClasses = "w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
      
      {/* ── Checkout Header ── */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Secure Checkout</h2>
          <p className="text-slate-500 font-medium text-sm mt-1 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" /> 256-bit SSL Encrypted
          </p>
        </div>
        <div className="text-right">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-1">Total Due</div>
          <div className="text-3xl font-black text-blue-600">${amount}<span className="text-lg text-slate-400 font-medium">{donationType === 'recurring' ? '/mo' : ''}</span></div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-5 flex items-start gap-4 animate-in slide-in-from-top-2">
          <div className="bg-white p-2 rounded-full shadow-sm text-red-500 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-red-900">Payment Unsuccessful</h4>
            <p className="text-red-700 font-medium mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* ── Personal Info Section ── */}
      <div className="space-y-5 relative">
        
        {/* Floating Background Accent */}
        <div className="absolute -inset-x-6 inset-y-0 bg-slate-50 rounded-3xl -z-10" />

        <div className="flex gap-4">
          <div className="flex-1 relative group">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">First Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                name="firstName"
                placeholder="Jane"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`${inputClasses} pl-12`}
                required
              />
            </div>
          </div>
          <div className="flex-1 relative group">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Last Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`${inputClasses} pl-12`}
                required
              />
            </div>
          </div>
        </div>

        <div className="relative group">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="email"
              name="email"
              placeholder="jane.doe@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className={`${inputClasses} pl-12`}
              required
            />
          </div>
        </div>

        <div className="relative group">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Billing Address</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              name="address"
              placeholder="123 Main St"
              value={formData.address}
              onChange={handleInputChange}
              className={`${inputClasses} pl-12`}
              required
            />
          </div>
        </div>

        <div className="relative group">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Select Fund / Program</label>
          <div className="relative">
            <select
              name="program"
              value={formData.program}
              onChange={handleInputChange as any}
              className={`${inputClasses} appearance-none cursor-pointer`}
              required
            >
              <option value="General donation">General donation</option>
              <option value="Food Support Program">Food Support Program</option>
              <option value="Education Support">Education Support</option>
              <option value="Healthcare Outreach">Healthcare Outreach</option>
              <option value="Economic Empowerment">Economic Empowerment</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center px-2 text-slate-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-[2] relative group">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              className={inputClasses}
              required
            />
          </div>
          <div className="flex-1 relative group">
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleInputChange}
              className={inputClasses}
              maxLength={2}
              required
            />
          </div>
          <div className="flex-1 relative group">
            <input
              type="text"
              name="zip"
              placeholder="ZIP Code"
              value={formData.zip}
              onChange={handleInputChange}
              className={inputClasses}
              maxLength={10}
              required
            />
          </div>
        </div>
      </div>

      {/* ── Payment Details Section ── */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Card Information</label>
          <div className="flex items-center gap-1.5 opacity-70">
            {/* Simple Visa/Mastercard visual hints */}
            <div className="w-8 h-5 bg-[#1434CB] rounded text-white text-[10px] font-black italic flex items-center justify-center">VISA</div>
            <div className="w-8 h-5 bg-[#EB001B] rounded flex items-center justify-center relative overflow-hidden">
               <div className="w-4 h-4 bg-[#F79E1B] rounded-full absolute -right-0.5 mix-blend-screen opacity-90"></div>
               <div className="w-4 h-4 bg-[#EB001B] rounded-full absolute -left-0.5 mix-blend-screen opacity-90"></div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 transition-all focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/10 group">
          <div className="flex items-center gap-4">
            <CreditCard className="w-6 h-6 text-slate-400 group-focus-within:text-blue-600 transition-colors shrink-0" />
            <div className="w-full">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#0f172a',
                      fontFamily: '"Inter", system-ui, sans-serif',
                      fontWeight: '500',
                      letterSpacing: '0.025em',
                      '::placeholder': { color: '#94a3b8' },
                      iconColor: '#3b82f6'
                    },
                    invalid: {
                      color: '#ef4444',
                      iconColor: '#ef4444',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Action Area ── */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={isProcessing || !stripe}
          className="relative w-full overflow-hidden group rounded-2xl font-bold text-lg md:text-xl text-white shadow-xl shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
        >
          <div className="absolute inset-0 bg-blue-600 bg-gradient-to-r from-blue-700 to-blue-600 transition-transform group-hover:scale-[1.02]" />
          <div className="relative py-4 md:py-5 flex items-center justify-center gap-3">
            {isProcessing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Processing Securely...
              </>
            ) : (
              <>
                <Shield className="w-6 h-6 shrink-0 opacity-80" />
                Process Payment of ${amount}
              </>
            )}
          </div>
        </button>

        <div className="flex items-center justify-center gap-6 mt-6 opacity-60">
           <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
             <Lock className="w-4 h-4" /> SSL Encrypted
           </div>
           <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
             <Globe2 className="w-4 h-4" /> Global Secure
           </div>
        </div>
        <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed font-medium">
          Payments are securely processed by Stripe. <br/>
          Need help? <a href="mailto:skamau@crossbordersoutreach.org" className="text-blue-500 hover:text-blue-600">Contact Support</a>
        </p>
      </div>

    </form>
  );
}