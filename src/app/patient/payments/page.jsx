'use client';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const card = elements.getElement(CardElement);
      const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(`Payment successful! Transaction ID: ${paymentMethod.id}`);
        // Here we would sync with backend: await api.post('/payments', { paymentMethodId: paymentMethod.id })
      }
    } catch (err) {
      toast.error('Payment failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-lg bg-gray-50">
        <CardElement options={{ style: { base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } } } }} />
      </div>
      <button disabled={!stripe || loading} type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition">
        {loading ? 'Processing Secure Payment...' : 'Pay $50.00'}
      </button>
    </form>
  );
}

export default function Payments() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Make a Payment</h1>
      <div className="max-w-md bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold mb-4">Consultation Fee</h2>
        <p className="text-gray-600 mb-6">Enter your card details below to complete your booking securely via Stripe.</p>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
}
