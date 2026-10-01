import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

interface RouteProps {
  params: {
    token: string;
  };
}

// GET /api/rsvp/[token] -> Returns ONLY the guest info matching this secure token
export async function GET(request: Request, { params }: RouteProps) {
  try {
    const { token } = params;

    if (!token || token.length < 8) {
      return NextResponse.json({ success: false, error: "Invalid guest token" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("wedding_app");

    const guest = await db.collection("guests").findOne({ secureToken: token });
    if (!guest) {
      return NextResponse.json({ success: false, error: "Guest invitation token not found" }, { status: 404 });
    }

    const existingRsvp = await db.collection("rsvps").findOne({ secureToken: token });

    // Strictly return ONLY this guest's data to enforce guest privacy & protect against IDOR
    return NextResponse.json({
      success: true,
      guest: {
        name: guest.name,
        email: guest.email,
        plusOneAllowed: guest.plusOneAllowed,
        weddingSlug: guest.weddingSlug,
      },
      rsvp: existingRsvp
        ? {
            attendance: existingRsvp.attendance,
            guestNames: existingRsvp.guestNames || [guest.name],
            dietaryRequirements: existingRsvp.dietaryRequirements || "",
            message: existingRsvp.message || "",
            updatedAt: existingRsvp.updatedAt,
          }
        : null,
    });
  } catch (error: any) {
    console.error("GET Guest RSVP error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/rsvp/[token] -> Submits or updates RSVP for this guest token
export async function POST(request: Request, { params }: RouteProps) {
  try {
    const { token } = params;
    const body = await request.json();
    const { attendance, guestNames, dietaryRequirements, message } = body;

    if (!token || !attendance) {
      return NextResponse.json({ success: false, error: "Token and attendance response required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("wedding_app");

    const guest = await db.collection("guests").findOne({ secureToken: token });
    if (!guest) {
      return NextResponse.json({ success: false, error: "Invalid guest token" }, { status: 404 });
    }

    const rsvpDoc = {
      weddingSlug: guest.weddingSlug,
      secureToken: token,
      guestId: guest._id.toString(),
      attendance, // "attending" | "declined"
      guestNames: Array.isArray(guestNames) ? guestNames : [guest.name],
      dietaryRequirements: dietaryRequirements || "",
      message: message || "",
      updatedAt: new Date(),
    };

    await db.collection("rsvps").updateOne(
      { secureToken: token },
      { $set: rsvpDoc },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "RSVP saved successfully",
      rsvp: rsvpDoc,
    });
  } catch (error: any) {
    console.error("POST Guest RSVP error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
