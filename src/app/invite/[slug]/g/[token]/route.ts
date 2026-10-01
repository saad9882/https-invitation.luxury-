import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import clientPromise from "@/lib/mongodb";

interface RouteProps {
  params: {
    slug: string;
    token: string;
  };
}

export async function GET(request: Request, { params }: RouteProps) {
  try {
    const { slug, token } = params;

    const client = await clientPromise;
    const db = client.db("wedding_app");

    // 1. Look up invitation in MongoDB
    const invitation = await db.collection("invitations").findOne({ slug });

    if (!invitation || !invitation.published) {
      return new Response("Invitation Not Found", { status: 404 });
    }

    // 2. Look up Guest by cryptographically secure token
    const guest = await db.collection("guests").findOne({ secureToken: token, weddingSlug: slug });
    if (!guest) {
      return new Response("Invalid Guest Invitation Link", { status: 404 });
    }

    const templateId = invitation.templateId || "template_3";
    const filePath = path.join(process.cwd(), "src", "templates-source", `${templateId}.html`);

    if (!fs.existsSync(filePath)) {
      console.error(`Template source file not found: ${filePath}`);
      return new Response("Template Source Not Found", { status: 500 });
    }

    let html = fs.readFileSync(filePath, "utf8");

    // Base tag & Robots noindex for guest privacy
    const baseTag = `<base href="/demos/${templateId}/" />\n  <meta name="robots" content="noindex, nofollow" />`;
    html = html.replace("<head>", `<head>\n  ${baseTag}`);

    // Dynamic replacements
    const replacements: Record<string, string> = {
      "{{PARTNER_1}}": invitation.partner1 || "Charlotte",
      "{{PARTNER_2}}": invitation.partner2 || "Julian",
      "{{WEDDING_DATE_DISPLAY}}": invitation.weddingDateDisplay || "Saturday, 18th September 2027",
      "{{VENUE_NAME}}": invitation.venueName || "Villa Montalcino",
      "{{VENUE_ADDRESS}}": invitation.venueAddress || "Tremezzo, Lake Como, Italy",
      "{{MAP_EMBED_URL}}": invitation.mapEmbedUrl || "",
      "{{RSVP_EMAIL}}": invitation.rsvpEmail || "harveyandkarina@gmail.com",
      "{{RSVP_CC}}": invitation.rsvpCc || "",
      "{{DRESS_CODE_TEXT}}": invitation.dressCodeTitle || invitation.dressCodeText || "Formal Attire",
      "{{GIFT_TEXT}}": invitation.giftNote || invitation.giftText || "Gifts are entirely optional.",
      "{{RSVP_DEADLINE_TEXT}}": invitation.rsvpDeadlineText || "Please respond by August 1st, 2027",
      "{{GUEST_NAME}}": guest.name,
    };

    for (const [key, value] of Object.entries(replacements)) {
      html = html.split(key).join(value);
    }

    // Inject client-side initialization data payload & guest context securely
    const guestPayload = {
      name: guest.name,
      plusOneAllowed: guest.plusOneAllowed,
      token: guest.secureToken,
    };

    const dataScript = `<script>
  window.__INITIAL_DATA__ = ${JSON.stringify(invitation)};
  window.__GUEST_DATA__ = ${JSON.stringify(guestPayload)};
</script>`;

    html = html.replace("</body>", `  ${dataScript}\n</body>`);

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch (error: any) {
    console.error("GET Live Guest Invitation error:", error);
    return new Response("Internal Server Error: " + error.message, { status: 500 });
  }
}
