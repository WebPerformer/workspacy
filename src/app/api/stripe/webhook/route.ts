import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

async function makeBackendRequest(url: string, options: any, context: string) {
  try {
    console.log(`🔗 Making ${context} request to:`, url);

    const response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ ${context} successful:`, data);
    return { success: true, data };
  } catch (error: any) {
    console.error(`❌ ${context} failed:`, error.message);
    return { success: false, error: error.message };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const sig = (await headers()).get("stripe-signature");
    const webhookToken = process.env.WEBHOOK_API_TOKEN;

    console.log("🔧 Webhook received, verifying signature...");

    const event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log(`🎯 Webhook type: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (
          session.mode === "subscription" &&
          session.subscription &&
          session.customer_details?.email
        ) {
          const slug = session.customer_details.email
            .split("@")[0]
            .replace(/\./g, "-")
            .toLowerCase();

          await makeBackendRequest(
            `${process.env.EXTERNAL_API_URL}/customers`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Webhook-Token": webhookToken!,
              },
              body: JSON.stringify({
                customer_id: session.customer,
                name: session.customer_details.name || "",
                email: session.customer_details.email,
                phone: session.customer_details.phone || "",
                slug,
                subscription_id: session.subscription,
                status: true,
              }),
            },
            "Create Customer"
          );
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("❌ Webhook error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
