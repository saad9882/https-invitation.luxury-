import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const FILE_PATH = path.join(process.cwd(), "src", "data", "reviews_db.json");

async function getLocalReviews() {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function saveLocalReview(review: any) {
  try {
    const current = await getLocalReviews();
    current.unshift(review);
    await fs.writeFile(FILE_PATH, JSON.stringify(current, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Local file write error:", err);
    return false;
  }
}

export async function GET() {
  const isMongoConfigured = process.env.MONGODB_URI && !process.env.MONGODB_URI.includes("<username>");
  if (isMongoConfigured) {
    try {
      const client = await clientPromise;
      const db = client.db("wedding_app");
      const reviews = await db
        .collection("reviews")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      const serializedReviews = reviews.map((review) => ({
        ...review,
        _id: review._id.toString(),
      }));

      return NextResponse.json({ reviews: serializedReviews });
    } catch (error: any) {
      console.warn("MongoDB fetch failed, falling back to local file:", error.message);
    }
  }

  // Local file fallback
  const localReviews = await getLocalReviews();
  return NextResponse.json({ reviews: localReviews });
}

export async function POST(request: Request) {
  try {
    let fullName = "";
    let email = "";
    let rating = 5;
    let title = "";
    let experience = "";
    let subscribed = false;
    let photoUrl: string | null = null;

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json();
      fullName = body.fullName || "";
      email = body.email || "";
      rating = Number(body.rating);
      title = body.title || "";
      experience = body.experience || "";
      subscribed = !!body.subscribed;
      photoUrl = body.photoUrl || null;
    } else {
      const formData = await request.formData();
      fullName = formData.get("fullName")?.toString()?.trim() || "";
      email = formData.get("email")?.toString()?.trim() || "";
      const ratingStr = formData.get("rating")?.toString()?.trim() || "5";
      rating = Number(ratingStr);
      title = formData.get("title")?.toString()?.trim() || "";
      experience = formData.get("experience")?.toString()?.trim() || "";
      subscribed = formData.get("subscribed")?.toString() === "true" || formData.get("subscribed") === "on";

      const photo = formData.get("photo");
      if (photo && photo instanceof File && photo.size > 0) {
        const MAX_SIZE = 4 * 1024 * 1024;
        if (photo.size <= MAX_SIZE && photo.type.startsWith("image/")) {
          const buffer = Buffer.from(await photo.arrayBuffer());
          const base64Data = buffer.toString("base64");
          photoUrl = `data:${photo.type};base64,${base64Data}`;
        }
      }
    }

    if (!fullName || !email || !rating || !title || !experience) {
      return NextResponse.json(
        { error: "fullName, email, rating, title, and experience are all required fields." },
        { status: 400 }
      );
    }

    if (isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be a number between 1 and 5." },
        { status: 400 }
      );
    }

    const reviewDoc = {
      fullName,
      email,
      rating,
      title,
      experience,
      photoUrl,
      subscribed,
      verified: true,
      createdAt: new Date(),
    };

    const isMongoConfigured = process.env.MONGODB_URI && !process.env.MONGODB_URI.includes("<username>");
    if (isMongoConfigured) {
      try {
        const client = await clientPromise;
        const db = client.db("wedding_app");
        const result = await db.collection("reviews").insertOne(reviewDoc);

        const createdReview = {
          ...reviewDoc,
          _id: result.insertedId.toString(),
        };

        return NextResponse.json(createdReview, { status: 201 });
      } catch (error: any) {
        console.warn("MongoDB insert failed, falling back to local file:", error.message);
      }
    }

    // Local file fallback
    const localReview = {
      ...reviewDoc,
      _id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    await saveLocalReview(localReview);
    return NextResponse.json(localReview, { status: 201 });

  } catch (error: any) {
    console.error("POST Review Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create review" },
      { status: 500 }
    );
  }
}
