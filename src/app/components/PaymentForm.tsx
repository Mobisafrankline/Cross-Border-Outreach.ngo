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
  donationType: "one-time" | "recurring";
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

  const inputClasses = "w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
      
      {/* ── Checkout Header ── */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Secure Checkout</h3>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-blue-500" /> 256-bit SSL Encrypted
          </p>
        </div>
        <div className="text-right">
          <div className="text-gray-500 font-semibold uppercase tracking-wider text-[10px] mb-1">Total Contribution</div>
          <div className="text-2xl font-bold text-gray-900">${amount}<span className="text-base text-gray-400 font-medium">{donationType === 'recurring' ? '/mo' : ''}</span></div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900 text-sm">Payment Unsuccessful</h4>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* ── Personal Info Section ── */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Donor Information</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`${inputClasses} pl-10`}
                required
              />
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`${inputClasses} pl-10`}
                required
              />
            </div>
            <div className="relative sm:col-span-2">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className={`${inputClasses} pl-10`}
                required
              />
            </div>
            <div className="relative sm:col-span-2">
              <select
                name="program"
                value={formData.program}
                onChange={handleInputChange as any}
                className={`${inputClasses} appearance-none cursor-pointer pl-4`}
                required
              >
                <option value="General donation">General donation</option>
                <option value="Food Support Program">Food Support Program</option>
                <option value="Education Support">Education Support</option>
                <option value="Healthcare Outreach">Healthcare Outreach</option>
                <option value="Economic Empowerment">Economic Empowerment</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 mt-6">Billing Details</h4>
          <div className="space-y-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={formData.address}
                onChange={handleInputChange}
                className={`${inputClasses} pl-10`}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1 relative">
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
              <div className="relative">
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
              <div className="relative">
                <input
                  type="text"
                  name="zip"
                  placeholder="ZIP"
                  value={formData.zip}
                  onChange={handleInputChange}
                  className={inputClasses}
                  maxLength={10}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Payment Details Section ── */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Secure Payment</h4>
          <div className="bg-white border border-gray-200 rounded-lg p-4 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-sm">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div className="w-full">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '15px',
                        color: '#111827',
                        fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
                        fontWeight: '500',
                        '::placeholder': { color: '#9ca3af' },
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

      </div>

      {/* ── Action Area ── */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isProcessing || !stripe}
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-base transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Shield className="w-5 h-5 opacity-80" />
              Process Payment of ${amount}
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          Payments are securely processed by Stripe. <br/>
          <a href="mailto:skamau@crossbordersoutreach.org" className="text-blue-600 hover:underline mt-1 inline-block">Contact Support</a>
        </p>
      </div>
    </form>
  );
}