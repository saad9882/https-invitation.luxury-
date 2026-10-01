import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import clientPromise from "@/lib/mongodb";

interface RouteProps {
  params: {
    slug: string;
  };
}

export async function GET(request: Request, { params }: RouteProps) {
  try {
    const { slug } = params;

    const client = await clientPromise;
    const db = client.db("wedding_app");
    const collection = db.collection("invitations");

    // Look up invitation in MongoDB
    const invitation = await collection.findOne({ slug });

    if (!invitation || !invitation.published) {
      return new Response("Invitation Not Found", { status: 404 });
    }

    const templateId = invitation.templateId || "template_3";
    const filePath = path.join(process.cwd(), "src", "templates-source", `${templateId}.html`);

    if (!fs.existsSync(filePath)) {
      console.error(`Template source file not found: ${filePath}`);
      return new Response("Template Source Not Found", { status: 500 });
    }

    let html = fs.readFileSync(filePath, "utf8");

    // SEO Metadata Injection
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://invitation.luxury";
    const canonicalUrl = `${appUrl}/${slug}`;
    const pageTitle = `${invitation.partner1 || "Charlotte"} & ${invitation.partner2 || "Julian"} — Wedding Invitation | Invitation Luxury`;
    const metaDesc = `You are invited to celebrate the wedding of ${invitation.partner1 || "Charlotte"} and ${invitation.partner2 || "Julian"} at ${invitation.venueName || "Villa Montalcino"}.`;
    const heroImage = invitation.heroMediaUrl || `${appUrl}/image/wedding-hero.png`;

    const seoTags = `
  <base href="/demos/${templateId}/" />
  <title>${pageTitle}</title>
  <meta name="description" content="${metaDesc}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${pageTitle}" />
  <meta property="og:description" content="${metaDesc}" />
  <meta property="og:image" content="${heroImage}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${pageTitle}" />
  <meta name="twitter:description" content="${metaDesc}" />
  <meta name="twitter:image" content="${heroImage}" />
`;

    // Replace default head tag
    html = html.replace("<head>", `<head>\n${seoTags}`);

    // Replace placeholders with real customizations for server-side HTML
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
    };

    for (const [key, value] of Object.entries(replacements)) {
      html = html.split(key).join(value);
    }

    // Inject client-side initialization data payload for dynamic interactive rendering
    const dataScript = `<script>window.__INITIAL_DATA__ = ${JSON.stringify(invitation)};</script>`;
    html = html.replace("</body>", `  ${dataScript}\n</body>`);

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error: any) {
    console.error("GET Live Invitation error:", error);
    return new Response("Internal Server Error: " + error.message, { status: 500 });
  }
}
