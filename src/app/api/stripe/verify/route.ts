import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");
    const slug = searchParams.get("slug");

    const client = await clientPromise;
    const db = client.db("wedding_app");
    const collection = db.collection("invitations");

    if (sessionId && stripe) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid") {
        const targetSlug = slug || (session.metadata?.slug as string);
        if (targetSlug) {
          await collection.updateOne(
            { slug: targetSlug },
            {
              $set: {
                paymentStatus: "paid",
                published: true,
                stripeSessionId: sessionId,
                stripePaymentIntent: session.payment_intent,
                updatedAt: new Date(),
              },
            }
          );

          const updated = await collection.findOne({ slug: targetSlug });
          return NextResponse.json({ success: true, slug: targetSlug, invitation: updated });
        }
      }
    }

    if (slug) {
      const invitation = await collection.findOne({ slug });
      if (invitation) {
        // If Stripe is configured, we do NOT allow verifying just by slug unless it is already paid in DB
        if (stripe) {
          if (invitation.paymentStatus === "paid") {
            return NextResponse.json({ success: true, slug, invitation });
          }
          return NextResponse.json({ success: false, error: "Payment verification required" }, { status: 400 });
        }

        // If in test/demo mode (no Stripe key configured)
        await collection.updateOne(
          { slug },
          { $set: { paymentStatus: "paid", published: true } }
        );
        return NextResponse.json({ success: true, slug, invitation });
      }
    }

    return NextResponse.json({ success: false, error: "Invitation not found or unpaid" }, { status: 404 });
  } catch (error: any) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
