import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe) {
    return NextResponse.json({ error: "Stripe client not initialized" }, { status: 500 });
  }

  let event;
  const rawBody = await request.text();

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } else {
      // In dev mode without webhook secret configured, parse body securely
      event = JSON.parse(rawBody);
    }
  } catch (err: any) {
    console.error(`Stripe Webhook Signature Verification Failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle successful checkout payment completion
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const slug = session.metadata?.slug;
    const userEmail = session.customer_email || session.metadata?.userEmail;

    if (slug) {
      const client = await clientPromise;
      const db = client.db("wedding_app");
      const collection = db.collection("invitations");

      await collection.updateOne(
        { slug },
        {
          $set: {
            paymentStatus: "paid",
            published: true,
            stripeSessionId: session.id,
            stripePaymentIntent: session.payment_intent,
            amountPaid: session.amount_total ? session.amount_total / 100 : undefined,
            userEmail: userEmail || undefined,
            updatedAt: new Date(),
          },
        }
      );
    }
  }

  return NextResponse.json({ received: true });
}
