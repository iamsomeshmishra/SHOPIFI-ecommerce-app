import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

// @desc    Create Stripe Payment Intent
// @route   POST /api/payment/create-payment-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  try {
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid payment amount' });
    }

    if (!stripe) {
      console.warn('Stripe key not found in env. Generating simulated payment configuration.');
      return res.json({
        clientSecret: 'mock_stripe_client_secret_' + Math.random().toString(36).substring(7),
        isMock: true
      });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      isMock: false
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
