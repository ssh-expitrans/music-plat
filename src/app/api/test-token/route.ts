// app/api/test-token/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-very-secret-key";

export async function GET() {
  const cookieStore = await cookies(); // await here if TS insists
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    return NextResponse.json({ email: decoded.email });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
