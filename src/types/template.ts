export interface Template {
  id: string;
  name: string;
  description: string;
  images: string[];
  metadata: {
    advantages?: Record<string, string>;
    category?: string;
    included?: string;
    tier?: string;
    preview: string;
    [key: string]: string | Record<string, string> | undefined;
  };
  tier: string;
  has_access: boolean;
  price: {
    id: string;
    type: string;
    unit_amount: number;
    currency: string;
    recurring?: any;
  };
}

export interface PurchaseDrawerProps {
  template: Template;
  subscriptionTemplates: Template[];
}
