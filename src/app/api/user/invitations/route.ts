import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("wedding_app");
    const collection = db.collection("invitations");

    // Retrieve invitations owned by user (either by userId or userEmail)
    const invitations = await collection
      .find({
        $or: [{ userId: user.id }, { userEmail: user.email }],
      })
      .sort({ createdAt: -1 })
      .toArray();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://invitation.luxury";

    const formatted = invitations.map((inv) => ({
      id: inv._id.toString(),
      slug: inv.slug,
      partner1: inv.partner1,
      partner2: inv.partner2,
      weddingDate: inv.weddingDateDisplay || inv.weddingDate,
      venueName: inv.venueName,
      templateId: inv.templateId,
      published: inv.published,
      paymentStatus: inv.paymentStatus,
      publicUrl: `${baseUrl}/${inv.slug}`,
      createdAt: inv.createdAt,
    }));

    return NextResponse.json({ success: true, invitations: formatted });
  } catch (error: any) {
    console.error("GET User Invitations error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
