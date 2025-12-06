export interface StripeCheckoutProps {
  priceId: string;
  mode: "payment" | "subscription";
  amount: number;
  tier?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export interface StripeProviderProps {
  clientSecret: string;
  priceId: string;
  mode: "payment" | "subscription";
  amount: number;
  tier?: string;
  onSuccess: () => void;
  onCancel: () => void;
}
