export interface ActiveSubscription {
  id: string;
  name: string;
  amount: number;
  interval: string;
  category: string;
  tier: string;
  priceId: string;
  hasAccess: boolean;
}
