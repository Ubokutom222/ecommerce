import { NextRequest, NextResponse } from "next/server";
import type { PaystackWebhookPayload } from "@/paystack/types";
import { usersCart, orders, orderItems } from "@/db/schema";
import db from "@/db";
import { eq, and, InferSelectModel } from "drizzle-orm";
import { nanoid } from "nanoid";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";
    const allowedIps = ["52.31.139.75", "52.49.173.169", "52.214.14.220"];

    // Read raw body and signature header
    const bodyText = await req.text();
    const incomingSig = req.headers.get("x-paystack-signature") || "";

    // Compute HMAC SHA512 using your Paystack secret
    const secret = process.env.PAYSTACK_SECRET!;
    const expectedSig = crypto
      .createHmac("sha512", secret)
      .update(bodyText)
      .digest("hex");

    // Reject if signatures don’t match
    if (incomingSig !== expectedSig) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    if (!allowedIps.includes(ip)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = JSON.parse(bodyText) as PaystackWebhookPayload;

    switch (body.event) {
      case "charge.success":
        const metadata = body.data.metadata;

        metadata.products.map(async (item) => {
          await db
            .delete(usersCart)
            .where(
              and(
                eq(usersCart.productId, item.id),
                eq(usersCart.userId, metadata.userId),
              ),
            );
        });

        const orderId = nanoid();

        const order_items: InferSelectModel<typeof orderItems>[] = [];

        await db.insert(orders).values({
          id: orderId,
          totalAmount: body.data.amount,
          createdAt: new Date(),
          paystackReference: body.data.reference,
          status: "ordered",
          userId: metadata.userId,
        });

        metadata.products.map((item) => {
          order_items.push({
            id: nanoid(),
            orderId,
            productId: item.id,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          });
        });

        await db.insert(orderItems).values(order_items);
        break;

      case "transfer.success":
        console.log("Transfer success:", body.data);
        break;

      default:
        console.log("Unhandled Paystack event:", body.event);
    }

    return new NextResponse("Webhook processed", { status: 200 });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
