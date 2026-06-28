'use client';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51OpG7eSJL3qWnT2p6L06LpL6LpL6LpL6LpL6LpL6LpL6LpL6LpL6LpL6LpL6LpL6LpL6LpL6LpL6LpL6LpL6Lp'
);

function CheckoutForm({ amount, appointmentId, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      // 1. Create payment intent on the backend
      const res = await api.post('/payments/create-intent', {
        amount,
        appointmentId,
      });

      const { clientSecret } = res.data;

      // 2. Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setProcessing(false);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          toast.success('Payment succeeded!');

          // Sync backend status immediately
          try {
            await api.patch(`/appointments/${appointmentId}`, {
              status: 'confirmed',
              paymentStatus: 'paid'
            });
          } catch (e) {
            console.log('Synced by webhook or direct update.');
          }

          onSuccess();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment initiation failed');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-xl bg-slate-50">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="px-4 py-2 border rounded-xl hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
        >
          {processing ? 'Processing...' : `Pay $${amount}`}
        </button>
      </div>
    </form>
  );
}

export default function StripeCheckout({ amount, appointmentId, onSuccess, onCancel }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        amount={amount}
        appointmentId={appointmentId}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
}
