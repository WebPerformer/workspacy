// components/stripe-provider.tsx
"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { StripeCheckout } from "./stripe-checkout";
import { useEffect, useState } from "react";
import { StripeProviderProps } from "@/src/types/stripe";

let stripePromise: any = null;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export function StripeProvider({
  clientSecret,
  priceId,
  mode,
  amount,
  tier,
  onSuccess,
  onCancel,
}: StripeProviderProps) {
  const [stripe, setStripe] = useState<any>(null);

  useEffect(() => {
    setStripe(getStripe());
  }, []);

  if (!stripe || !clientSecret) {
    return (
      <div className="max-w-md mx-auto p-6 border rounded-lg bg-card text-center">
        <p>Carregando checkout seguro...</p>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      rules: {
        ".Label": {
          color: "oklch(0.89 0.0029 264.54)",
        },
        ".Input": {
          backgroundColor: "oklch(0.1906 0.0026 247.96)",
          borderColor: "oklch(0.2572 0.0095 276.72)",
          color: "oklch(0.89 0.0029 264.54)",
        },
        ".Input:focus": {
          borderColor: "oklch(0.51 0.2492 299.15)",
          boxShadow: "0 0 0 1px #000000",
        },
      },
    },
  };

  return (
    <Elements stripe={stripe} options={options}>
      <StripeCheckout
        priceId={priceId}
        mode={mode}
        amount={amount}
        tier={tier}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
}
