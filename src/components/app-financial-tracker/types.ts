export type Invoice = {
  invoiceId: string;
  name: string;
  imageUrl: string;
  link: string;
  dueDate: Date;
  monthly: boolean;
  amount: number;
  description: string;
  login: string;
  password: string;
  type: string;
  status: string;
  createdAt: Date;
};

export const INVOICE_TYPES = {
  INCOME: "income",
  EXPENSE: "expense",
} as const;

export const INVOICE_STATUS = {
  PAID: "paid",
  UNPAID: "unpaid",
} as const;

export const INVOICE_DELETED = {
  DELETED: "deleted",
} as const;
