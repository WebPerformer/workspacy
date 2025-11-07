export interface StripeCheckoutProps {
  priceId: string;
  mode: "payment" | "subscription";
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export interface StripeProviderProps {
  clientSecret: string;
  priceId: string;
  mode: "payment" | "subscription";
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}
