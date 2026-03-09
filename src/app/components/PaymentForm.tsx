import { useState, FormEvent } from "react";
import {
  useStripe,
  useElements,
  CardElement,
  PaymentElement,
  ExpressCheckoutElement,
  LinkAuthenticationElement,
  AddressElement
} from "@stripe/react-stripe-js";
import { 
  Mail, 
  User, 
  MapPin, 
  Lock, 
  CreditCard,
  Building2,
  Smartphone,
  Bitcoin,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { createPaymentIntent, PaymentMethodType } from "../../lib/stripe";
import { supabase } from "../../lib/supabase";

interface PaymentFormProps {
  amount: number;
  donationType: "one-time" | "recurring";
  program: string;
  paymentMethod: PaymentMethodType;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// Extended payment method type for all options
type ExtendedPaymentMethod = PaymentMethodType | 
  'venmo' | 'zelle' | 'crypto' | 'momo' | 'klarna' | 'afterpay' | 
  'affirm' | 'sepa' | 'ach' | 'check' | 'wire';

interface ExtendedPaymentFormProps extends Omit<PaymentFormProps, 'paymentMethod'> {
  paymentMethod: ExtendedPaymentMethod;
}

export default function PaymentForm({ 
  amount, 
  donationType, 
  program, 
  paymentMethod,
  onSuccess,
  onError
}: ExtendedPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "US"
  });
  
  const [cryptoType, setCryptoType] = useState<'bitcoin' | 'ethereum' | 'usdc'>('bitcoin');
  const [momoProvider, setMomoProvider] = useState<'mtn' | 'mpesa' | 'airtel' | 'orange'>('mtn');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle Stripe-based payments
  const handleStripePayment = async () => {
    if (!stripe || !elements) return;

    const { data: paymentData, error: paymentError } = await createPaymentIntent({
      amount: amount * 100,
      currency: "usd",
      program,
      donorEmail: formData.email,
      donorName: `${formData.firstName} ${formData.lastName}`,
      recurring: donationType === "recurring",
      frequency: donationType === "recurring" ? "monthly" : undefined,
      paymentMethod: paymentMethod as PaymentMethodType
    });

    if (paymentError || !paymentData) {
      throw new Error("Failed to create payment intent");
    }

    let result;

    if (paymentMethod === 'card') {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");
      
      result = await stripe.confirmCardPayment(paymentData.clientSecret, {
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
    } else if (['apple_pay', 'google_pay', 'paypal', 'cashapp', 'klarna', 'afterpay', 'affirm'].includes(paymentMethod)) {
      // For express checkout methods
      result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donation-success`,
          payment_method_data: {
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
            }
          }
        },
      });
    } else if (paymentMethod === 'us_bank_account' || paymentMethod === 'sepa_debit') {
      result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donation-success`,
        },
      });
    }

    return result;
  };

  // Handle non-Stripe payments
  const handleAlternativePayment = async () => {
    // Save pending donation to database
    const { error: dbError } = await supabase
      .from('donations')
      .insert({
        donor_email: formData.email,
        donor_name: `${formData.firstName} ${formData.lastName}`,
        amount: amount,
        program: program,
        payment_method: paymentMethod,
        status: 'pending',
        type: donationType,
        metadata: {
          crypto_type: paymentMethod === 'crypto' ? cryptoType : null,
          momo_provider: paymentMethod === 'momo' ? momoProvider : null,
          phone: formData.phone
        }
      });

    if (dbError) throw dbError;

    // For demo purposes, simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return { paymentIntent: { id: `manual_${Date.now()}` } };
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
      let result;

      // Check if this is a Stripe-supported payment
      const stripeMethods = ['card', 'apple_pay', 'google_pay', 'paypal', 'cashapp', 
        'us_bank_account', 'sepa_debit', 'klarna', 'afterpay', 'affirm'];
      
      if (stripeMethods.includes(paymentMethod)) {
        result = await handleStripePayment();
        
        if (result?.error) {
          throw new Error(result.error.message || "Payment failed");
        }
      } else {
        // Handle alternative payment methods
        result = await handleAlternativePayment();
      }

      // Save completed donation
      const { error: dbError } = await supabase
        .from('donations')
        .insert({
          donor_email: formData.email,
          donor_name: `${formData.firstName} ${formData.lastName}`,
          amount: amount,
          program: program,
          payment_method: paymentMethod,
          stripe_payment_id: result?.paymentIntent?.id || null,
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

  // Render payment method specific UI
  const renderPaymentMethodUI = () => {
    switch (paymentMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4 text-green-600">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">Secure SSL Encrypted</span>
            </div>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#1f2937',
                    '::placeholder': { color: '#9ca3af' },
                  },
                },
              }}
              className="p-4 border-2 border-gray-300 rounded-lg bg-white"
            />
          </div>
        );

      case 'apple_pay':
      case 'google_pay':
      case 'paypal':
      case 'cashapp':
        return (
          <div className="space-y-4">
            <ExpressCheckoutElement
              options={{
                paymentMethods: {
                  applePay: paymentMethod === 'apple_pay' ? 'auto' : 'never',
                  googlePay: paymentMethod === 'google_pay' ? 'auto' : 'never',
                  paypal: paymentMethod === 'paypal' ? 'auto' : 'never',
                  link: 'never',
                },
              }}
            />
            <p className="text-sm text-gray-600 text-center">
              Click the button above to pay with {paymentMethod.replace('_', ' ')}
            </p>
          </div>
        );

      case 'us_bank_account':
        return (
          <div className="space-y-4">
            <PaymentElement options={{ layout: 'tabs' }} />
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-medium mb-2">Bank Transfer (ACH)</p>
              <p>Secure direct debit from your bank account. Takes 1-2 business days to process.</p>
            </div>
          </div>
        );

      case 'sepa_debit':
        return (
          <div className="space-y-4">
            <PaymentElement options={{ layout: 'tabs' }} />
            <div className="bg-purple-50 rounded-lg p-4 text-sm text-purple-800">
              <p className="font-medium mb-2">SEPA Direct Debit (EU)</p>
              <p>For European bank accounts. You will receive a pre-notification email before debit.</p>
            </div>
          </div>
        );

      case 'klarna':
      case 'afterpay':
      case 'affirm':
        return (
          <div className="space-y-4">
            <PaymentElement />
            <div className="bg-pink-50 rounded-lg p-4 text-sm text-pink-800">
              <div className="flex items-center gap-4 mb-3">
                <div className="text-center">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-green-500" />
                  <span className="text-xs font-medium">4 Payments</span>
                </div>
                <div className="text-center">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                  <span className="text-xs font-medium">0% Interest</span>
                </div>
                <div className="text-center">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-purple-500" />
                  <span className="text-xs font-medium">No Fees</span>
                </div>
              </div>
              <p>Split your ${amount} donation into 4 interest-free payments of ${(amount / 4).toFixed(2)}</p>
            </div>
          </div>
        );

      case 'venmo':
        return (
          <div className="text-center py-8">
            <div className="mb-4">
              <span className="text-4xl font-bold text-blue-600">Venmo</span>
            </div>
            <p className="text-gray-600 mb-4">Pay easily from your Venmo balance</p>
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800 space-y-2">
              <p>Search: <span className="font-bold">@CrossbordersOutreach</span></p>
              <p>Or send to: <span className="font-bold">donations@crossborders.org</span></p>
            </div>
            <input
              type="text"
              name="phone"
              placeholder="Your Venmo phone number (optional)"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full mt-4 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
            />
          </div>
        );

      case 'zelle':
        return (
          <div className="text-center py-8">
            <div className="mb-4">
              <span className="text-4xl font-bold text-purple-600">Zelle</span>
            </div>
            <p className="text-gray-600 mb-4">Direct bank-to-bank transfer</p>
            <div className="bg-purple-50 rounded-lg p-4 text-left text-sm text-purple-800 space-y-2">
              <p><span className="font-medium">Email:</span> donations@crossborders.org</p>
              <p><span className="font-medium">Phone:</span> (555) 123-4567</p>
              <p><span className="font-medium">Name:</span> Cross-Borders Outreach</p>
            </div>
            <input
              type="text"
              name="phone"
              placeholder="Your Zelle-enrolled phone number"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full mt-4 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
            />
          </div>
        );

      case 'crypto':
        return (
          <div className="space-y-4">
            <div className="flex justify-center gap-2 mb-4">
              {(['bitcoin', 'ethereum', 'usdc'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setCryptoType(type)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    cryptoType === type
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {type === 'bitcoin' && '₿ BTC'}
                  {type === 'ethereum' && 'Ξ ETH'}
                  {type === 'usdc' && '◈ USDC'}
                </button>
              ))}
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="flex flex-col items-center">
                {showQrCode ? (
                  <div className="bg-white p-4 rounded-lg mb-4">
                    <QrCode className="w-32 h-32 text-orange-600" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowQrCode(true)}
                    className="mb-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Show QR Code
                  </button>
                )}
                
                <code className="block w-full bg-white p-3 rounded text-xs break-all font-mono text-orange-800 text-center">
                  {cryptoType === 'bitcoin' && 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'}
                  {cryptoType === 'ethereum' && '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'}
                  {cryptoType === 'usdc' && '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'}
                </code>
                
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(
                    cryptoType === 'bitcoin' ? 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' :
                    cryptoType === 'ethereum' ? '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' :
                    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
                  )}
                  className="mt-2 text-sm text-orange-600 hover:text-orange-700 underline"
                >
                  Copy Address
                </button>
              </div>
              
              <p className="text-xs text-gray-600 mt-4 text-center">
                *Send only {cryptoType.toUpperCase()} to this address. 
                Crypto donations are tax-deductible at fair market value.
              </p>
            </div>
            
            <input
              type="text"
              name="phone"
              placeholder="Your phone number for confirmation (optional)"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
            />
          </div>
        );

      case 'momo':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Select Provider:</h4>
            <div className="grid grid-cols-2 gap-3">
              {([
                { id: 'mtn', name: 'MTN Mobile Money', color: 'yellow' },
                { id: 'mpesa', name: 'M-Pesa', color: 'red' },
                { id: 'airtel', name: 'Airtel Money', color: 'blue' },
                { id: 'orange', name: 'Orange Money', color: 'orange' }
              ] as const).map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => setMomoProvider(provider.id)}
                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                    momoProvider === provider.id
                      ? `border-${provider.color}-500 bg-${provider.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className={`font-bold text-${provider.color}-600 text-sm`}>
                    {provider.name}
                  </span>
                </button>
              ))}
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4 text-sm text-yellow-800">
              <p className="font-medium mb-2">Payment Instructions:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Dial: <span className="font-bold">*165*3#</span> (or your provider's code)</li>
                <li>Enter Merchant ID: <span className="font-bold">CROSSBORDERS</span></li>
                <li>Enter Amount: <span className="font-bold">${amount}</span></li>
                <li>Enter PIN to confirm</li>
              </ol>
            </div>
            
            <input
              type="tel"
              name="phone"
              placeholder="Your Mobile Money number *"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
              required
            />
          </div>
        );

      case 'check':
        return (
          <div className="text-center py-8">
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h4 className="font-semibold text-gray-900 mb-2">Mail Your Check</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium">Cross-Borders Outreach Ministry Inc</p>
                <p>123 Charity Lane, Suite 100</p>
                <p>New York, NY 10001</p>
                <p>USA</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Make checks payable to "Cross-Borders Outreach Ministry Inc"
            </p>
          </div>
        );

      case 'wire':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Wire Transfer Details
              </h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p><span className="font-medium">Bank:</span> Chase Bank, N.A.</p>
                <p><span className="font-medium">Account:</span> Cross-Borders Outreach Ministry Inc</p>
                <p><span className="font-medium">Account #:</span> 000123456789</p>
                <p><span className="font-medium">Routing:</span> 021000021</p>
                <p><span className="font-medium">SWIFT:</span> CHASUS33</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Include your email in transfer notes for receipt.
            </p>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-600">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
            <p>Payment method configuration required</p>
          </div>
        );
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-700 mb-4">
          Your {donationType === 'recurring' ? 'monthly' : ''} donation of ${amount} has been received.
        </p>
        {paymentMethod === 'crypto' && (
          <p className="text-sm text-orange-700 bg-orange-100 rounded-lg p-3 mb-4">
            Please allow 10-30 minutes for blockchain confirmation.
          </p>
        )}
        {paymentMethod === 'momo' && (
          <p className="text-sm text-yellow-700 bg-yellow-100 rounded-lg p-3 mb-4">
            Please complete the payment on your phone. You'll receive SMS confirmation.
          </p>
        )}
        <p className="text-gray-600 text-sm">
          Receipt sent to {formData.email}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Your Information
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none bg-white"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none bg-white"
              required
            />
          </div>
        </div>

        {/* Address for certain payment methods */}
        {['card', 'us_bank_account', 'sepa_debit', 'klarna', 'afterpay', 'affirm'].includes(paymentMethod) && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none bg-white"
                  maxLength={2}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ZIP
                </label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none bg-white"
                  maxLength={10}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Details */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-600" />
          Payment Details
          <span className="ml-auto text-sm font-normal text-gray-600 capitalize">
            {paymentMethod.replace(/_/g, ' ')}
          </span>
        </h3>
        
        <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
          {renderPaymentMethodUI()}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing || (!stripe && ['card', 'apple_pay', 'google_pay', 'paypal'].includes(paymentMethod))}
        className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            {['check', 'wire', 'crypto', 'momo', 'zelle', 'venmo'].includes(paymentMethod) 
              ? "Confirm Donation" 
              : `Donate $${amount} ${donationType === "recurring" ? "Monthly" : "Now"}`
            }
          </>
        )}
      </button>

      {/* Security Footer */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-gray-500 text-sm">
        <div className="flex items-center gap-1">
          <Lock className="w-4 h-4" />
          <span>256-bit SSL</span>
        </div>
        <div className="flex items-center gap-1">
          <Shield className="w-4 h-4" />
          <span>PCI Compliant</span>
        </div>
        {['card', 'apple_pay', 'google_pay'].includes(paymentMethod) && (
          <div className="flex items-center gap-1">
            <Smartphone className="w-4 h-4" />
            <span>Stripe Secure</span>
          </div>
        )}
        {paymentMethod === 'crypto' && (
          <div className="flex items-center gap-1">
            <Bitcoin className="w-4 h-4" />
            <span>Blockchain Secured</span>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-gray-500">
        By donating, you agree to our Terms of Service and Privacy Policy.
        Questions? Contact <a href="mailto:donations@crossborders.org" className="text-blue-600 hover:underline">donations@crossborders.org</a>
      </p>
    </form>
  );
}