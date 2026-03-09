import { loadStripe, Stripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'YOUR_STRIPE_PUBLISHABLE_KEY';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

// Payment method types supported in USA
export const PAYMENT_METHODS = {
  CARD: 'card',
  ACH: 'us_bank_account',
  APPLE_PAY: 'apple_pay',
  GOOGLE_PAY: 'google_pay',
  PAYPAL: 'paypal',
  CASH_APP: 'cashapp',
  AFTERPAY: 'afterpay_clearpay',
  KLARNA: 'klarna'
} as const;

export type PaymentMethodType = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

export interface DonationData {
  amount: number;
  currency: string;
  program: string;
  donorEmail: string;
  donorName: string;
  recurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'yearly';
  paymentMethod: PaymentMethodType;
}

// Create a payment intent
export const createPaymentIntent = async (donationData: DonationData) => {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(donationData),
    });

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Create a setup intent for recurring donations
export const createSetupIntent = async (donorEmail: string) => {
  try {
    const response = await fetch('/api/create-setup-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: donorEmail }),
    });

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Create a subscription for recurring donations
export const createSubscription = async (customerId: string, paymentMethodId: string, planId: string) => {
  try {
    const response = await fetch('/api/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        customerId, 
        paymentMethodId, 
        planId 
      }),
    });

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Cancel a subscription
export const cancelSubscription = async (subscriptionId: string) => {
  try {
    const response = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId }),
    });

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Get payment method display name
export const getPaymentMethodDisplay = (method: PaymentMethodType): string => {
  const displays: Record<PaymentMethodType, string> = {
    [PAYMENT_METHODS.CARD]: 'Credit/Debit Card',
    [PAYMENT_METHODS.ACH]: 'Bank Account (ACH)',
    [PAYMENT_METHODS.APPLE_PAY]: 'Apple Pay',
    [PAYMENT_METHODS.GOOGLE_PAY]: 'Google Pay',
    [PAYMENT_METHODS.PAYPAL]: 'PayPal',
    [PAYMENT_METHODS.CASH_APP]: 'Cash App Pay',
    [PAYMENT_METHODS.AFTERPAY]: 'Afterpay',
    [PAYMENT_METHODS.KLARNA]: 'Klarna'
  };
  return displays[method] || method;
};

// Format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Validate card number (basic Luhn algorithm)
export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!/^\d+$/.test(cleaned)) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Get card brand from number
export const getCardBrand = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(cleaned)) return 'Visa';
  if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
  if (/^3[47]/.test(cleaned)) return 'American Express';
  if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
  if (/^35/.test(cleaned)) return 'JCB';
  if (/^30[0-5]/.test(cleaned)) return 'Diners Club';
  
  return 'Unknown';
};
