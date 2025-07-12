// types/paystack.ts
export type PaystackWebhookEvent =
  | "charge.success"
  | "charge.failed"
  | "transfer.success"
  | "transfer.failed"
  | "transfer.reversed"
  | "invoice.create"
  | "invoice.payment_successful"
  | "invoice.payment_failed"
  | "subscription.create"
  | "subscription.disable"
  | "customeridentification.success"
  | "customeridentification.failed";

interface Metadata {
  userId: string;
  products: {
    id: string;
    quantity: number;
    unitPrice: number;
  }[];
}

// Shared customer type
interface PaystackCustomer {
  id: number;
  email: string;
  name?: string;
  phone?: string;
}

// Event-specific data types

export interface ChargeSuccessData {
  id: number;
  amount: number;
  currency: string;
  reference: string;
  status: string;
  customer: PaystackCustomer;
  metadata: Metadata;
}

export interface TransferSuccessData {
  id: number;
  amount: number;
  reference: string;
  status: string;
  recipient: string;
  currency: string;
  metadata?: Record<string, string>;
}

export interface InvoicePaymentSuccessfulData {
  id: number;
  status: string;
  amount: number;
  invoice_code: string;
  subscription_code?: string;
  customer: PaystackCustomer;
  metadata?: Record<string, string>;
}

export interface SubscriptionCreateData {
  id: number;
  status: string;
  subscription_code: string;
  customer: PaystackCustomer;
  plan: string;
  metadata?: Record<string, string>;
}

// Discriminated union for full webhook payload

export type PaystackWebhookPayload =
  | { event: "charge.success"; data: ChargeSuccessData }
  | { event: "transfer.success"; data: TransferSuccessData }
  | { event: "invoice.payment_successful"; data: InvoicePaymentSuccessfulData }
  | { event: "subscription.create"; data: SubscriptionCreateData };
