import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyPassword, signToken, COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const client = await clientPromise;
    const db = client.db("wedding_app");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const userId = user._id.toString();
    const tokenPayload = { id: userId, email: user.email, name: user.name };
    const token = signToken(tokenPayload);

    const response = NextResponse.json({
      success: true,
      user: { id: userId, email: user.email, name: user.name },
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
    console.error("Login Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
