// src/StripeProvider.tsx
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

export const StripeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <Elements stripe={stripePromise}>{children}</Elements>;
