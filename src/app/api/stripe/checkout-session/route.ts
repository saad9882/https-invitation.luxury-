import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { PLANS, PlanId } from "@/lib/plans";
import { getTemplateById } from "@/data/templates";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatWeddingDate(dateStr: string) {
  if (!dateStr) return "Saturday, 18th September 2027";
  try {
    const date = new Date(dateStr.indexOf("T") === -1 ? dateStr + "T12:00:00" : dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = date.getDate();
    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";

    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const monthName = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${dayName}, ${day}${suffix} ${monthName} ${year}`;
  } catch (e) {
    return dateStr;
  }
}

import { getAuthUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request);
    const body = await request.json();
    const {
      plan = "essential",
      templateId = "template_3",
      userEmail = user?.email || "",
      designData = {},
    } = body;

    const planConfig = PLANS[plan as PlanId] || PLANS.essential;
    const templateConfig = getTemplateById(templateId);
    const templateName = templateConfig ? templateConfig.name : "Custom Invitation";
    const priceEuros = planConfig.price;

    const client = await clientPromise;
    const db = client.db("wedding_app");
    const collection = db.collection("invitations");

    // 1. Generate unique URL-safe slug
    const partner1 = designData.partner1 || "Charlotte";
    const partner2 = designData.partner2 || "Julian";
    let baseSlug = `${slugify(partner1)}-and-${slugify(partner2)}`
      .replace(/-and-$/, "")
      .replace(/^-and-/, "")
      .replace(/-+$/, "")
      .replace(/^-+/, "");
    if (!baseSlug || baseSlug === "and") {
      baseSlug = "invitation";
    }

    let slug = baseSlug;
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 100) {
      const existing = await collection.findOne({ slug });
      if (!existing) {
        isUnique = true;
      } else {
        attempts++;
        slug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
      }
    }

    // 2. Prepare database document
    const weddingDate = designData.weddingDate || "2027-09-18";
    const weddingDateDisplay = formatWeddingDate(weddingDate);
    const venueName = designData.venueName || "Villa Montalcino";
    const venueAddress = designData.venueAddress || "Tremezzo, Lake Como, Italy";

    const invitationDoc = {
      slug,
      plan,
      templateId,
      userId: user?.id || null,
      userEmail: userEmail || user?.email || "guest@luxuryinvitation.co",
      partner1,
      partner2,
      initials: designData.initials || "C & J",
      weddingDate,
      weddingTime: designData.weddingTime || "17:00",
      weddingDateDisplay,
      calendarUrl: designData.calendarUrl || "",
      venueName,
      venueAddress,
      mapUrl: designData.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(venueName + " " + venueAddress)}`,
      mapEmbedUrl: designData.mapUrl || `https://maps.google.com/maps?q=${designData.latitude || 45.9786},${designData.longitude || 9.2274}&z=15&output=embed`,
      latitude: designData.latitude || 45.9786,
      longitude: designData.longitude || 9.2274,
      timeline: designData.timeline || [],
      dressCodeTitle: designData.dressCodeTitle || "Formal Attire",
      dressCodeLines: designData.dressCodeLines || [],
      giftNote: designData.giftNote || "",
      giftItems: designData.giftItems || [],
      rsvpWeb3Key: designData.rsvpWeb3Key || "",
      rsvpEmail: designData.rsvpEmail || userEmail || "harveyandkarina@gmail.com",
      rsvpCc: designData.rsvpCc || null,
      rsvpDeadline: designData.rsvpDeadline || "2027-08-01",
      rsvpDeadlineText: designData.rsvpDeadlineText || "Please respond by August 1st, 2027",
      rsvpFields: designData.rsvpFields || {},
      showRestaurants: designData.showRestaurants ?? true,
      restaurants: designData.restaurants || [],
      showAccommodations: designData.showAccommodations ?? true,
      accommodations: designData.accommodations || [],
      showFaq: designData.showFaq ?? true,
      faqs: designData.faqs || [],
      namesFont: designData.namesFont || "font-serif",
      headersFont: designData.headersFont || "font-serif",
      bodyFont: designData.bodyFont || "font-sans",
      bgColor: designData.bgColor || "#EBE7E0",
      textColor: designData.textColor || "#5C2C35",
      accentColor: designData.accentColor || "#C9A56B",
      inviteText: designData.inviteText || "Together with their families",
      requestText: designData.requestText || "request the pleasure of your company",
      heroMediaUrl: designData.heroMediaUrl || "",
      venueMediaUrl: designData.venueMediaUrl || "",
      musicMediaUrl: designData.musicMediaUrl || "",
      music: designData.music || "None",
      floralsEnabled: designData.floralsEnabled ?? true,
      splashStyle: designData.splashStyle || "wax-seal",
      splashIntroOption: designData.splashIntroOption || "Option A",
      blocks: designData.blocks || [],
      amountPaid: priceEuros,
      currency: "eur",
      paymentStatus: stripe ? "pending" : "paid",
      published: !stripe,
      createdAt: new Date(),
    };

    await collection.insertOne(invitationDoc);

    // 3. Resolve base origin URL for checkout redirect
    let origin = process.env.NEXT_PUBLIC_APP_URL || "https://luxuryinvite.com";

    // Allow request origin only if it is localhost/127.0.0.1 (for local development testing)
    const requestOrigin = request.headers.get("origin") || request.headers.get("referer")?.split("/checkout")[0] || "";
    if (requestOrigin.includes("localhost") || requestOrigin.includes("127.0.0.1")) {
      origin = requestOrigin;
    }

    // 4. Create Stripe Session if Stripe API Key is configured
    if (stripe) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: `${templateName} — ${planConfig.name} Invitation Plan`,
                description: `Bespoke wedding invitation website for ${partner1} & ${partner2}`,
                images: [
                  origin + (templateConfig?.phoneImage || "/image/wedding-hero.png"),
                ],
              },
              unit_amount: Math.round(priceEuros * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        customer_email: userEmail || undefined,
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&slug=${slug}`,
        cancel_url: `${origin}/checkout?plan=${plan}&template=${templateId}&canceled=true`,
        metadata: {
          slug,
          plan,
          templateId,
          userEmail: userEmail || "",
        },
      });

      return NextResponse.json({
        success: true,
        url: session.url,
        sessionId: session.id,
        slug,
      });
    } else {
      // Fallback Demo Mode (when Stripe secret key is not set yet in .env)
      return NextResponse.json({
        success: true,
        url: `${origin}/checkout/success?slug=${slug}&demo=true`,
        slug,
        demoMode: true,
      });
    }
  } catch (error: any) {
    console.error("Stripe Checkout Session error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
