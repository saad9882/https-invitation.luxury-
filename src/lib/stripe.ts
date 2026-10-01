import Stripe from "stripe";
import { loadStripe, Stripe as StripeClient } from "@stripe/stripe-js";

// Server-side Stripe instance
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2024-06-20" as any,
      appInfo: {
        name: "Antigravity Wedding Invitations",
        version: "1.0.0",
      },
    })
  : null;

// Client-side Stripe instance
let stripePromise: Promise<StripeClient | null>;
export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};
