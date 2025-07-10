type PaystackWebhookEvent =
  | "charge.success"
  | "charge.failed"
  | "transfer.success"
  | "transfer.failed"
  | "transfer.reversed"
  | "subscription.create"
  | "subscription.disable"
  | "invoice.create"
  | "invoice.payment_failed"
  | "invoice.payment_successful"
  | "customeridentification.success"
  | "customeridentification.failed";

export interface PaystackWebhookPayload {
  event: PaystackWebhookEvent;
  data: any; // You can refine this per event if needed
}
