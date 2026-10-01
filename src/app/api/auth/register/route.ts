import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hashPassword, signToken, COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const client = await clientPromise;
    const db = client.db("wedding_app");
    const usersCollection = db.collection("users");

    // Ensure unique index on email
    await usersCollection.createIndex({ email: 1 }, { unique: true }).catch(() => {});

    // Check existing user
    const existing = await usersCollection.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);
    const newUserDoc = {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUserDoc);
    const userId = result.insertedId.toString();

    const tokenPayload = { id: userId, email: normalizedEmail, name: name.trim() };
    const token = signToken(tokenPayload);

    const response = NextResponse.json({
      success: true,
      user: { id: userId, email: normalizedEmail, name: name.trim() },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
