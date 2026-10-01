import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/guests?slug=sarah-and-john -> Retrieves guest list for wedding owner
export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ success: false, error: "Slug is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("wedding_app");

    // Verify user owns the wedding invitation
    const wedding = await db.collection("invitations").findOne({ slug });
    if (!wedding) {
      return NextResponse.json({ success: false, error: "Wedding not found" }, { status: 404 });
    }

    if (wedding.userEmail !== user.email && wedding.userId !== user.id) {
      return NextResponse.json({ success: false, error: "Forbidden: You do not own this invitation" }, { status: 403 });
    }

    const guests = await db.collection("guests").find({ weddingSlug: slug }).toArray();
    const rsvps = await db.collection("rsvps").find({ weddingSlug: slug }).toArray();

    // Map rsvp info to guests
    const rsvpMap = new Map(rsvps.map((r) => [r.secureToken, r]));

    const enrichedGuests = guests.map((g) => ({
      id: g._id.toString(),
      name: g.name,
      email: g.email || "",
      phone: g.phone || "",
      plusOneAllowed: g.plusOneAllowed || false,
      secureToken: g.secureToken,
      guestUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://invitation.luxury"}/${slug}/g/${g.secureToken}`,
      rsvp: rsvpMap.get(g.secureToken) || null,
      createdAt: g.createdAt,
    }));

    return NextResponse.json({ success: true, guests: enrichedGuests });
  } catch (error: any) {
    console.error("GET Guests error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/guests -> Adds a new guest with secure random token
export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { slug, name, email, phone, plusOneAllowed = false } = await request.json();

    if (!slug || !name) {
      return NextResponse.json({ success: false, error: "Slug and guest name are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("wedding_app");

    // Verify ownership
    const wedding = await db.collection("invitations").findOne({ slug });
    if (!wedding) {
      return NextResponse.json({ success: false, error: "Wedding not found" }, { status: 404 });
    }

    if (wedding.userEmail !== user.email && wedding.userId !== user.id) {
      return NextResponse.json({ success: false, error: "Forbidden: You do not own this invitation" }, { status: 403 });
    }

    // Generate cryptographically secure random token (32 hex characters)
    const secureToken = crypto.randomBytes(16).toString("hex");

    const guestDoc = {
      weddingSlug: slug,
      name: name.trim(),
      email: email ? email.trim() : "",
      phone: phone ? phone.trim() : "",
      plusOneAllowed: Boolean(plusOneAllowed),
      secureToken,
      createdAt: new Date(),
    };

    await db.collection("guests").insertOne(guestDoc);
    await db.collection("guests").createIndex({ secureToken: 1 }, { unique: true }).catch(() => {});

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://invitation.luxury";
    const guestUrl = `${baseUrl}/${slug}/g/${secureToken}`;

    return NextResponse.json({
      success: true,
      guest: {
        ...guestDoc,
        guestUrl,
      },
    });
  } catch (error: any) {
    console.error("POST Guest error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
