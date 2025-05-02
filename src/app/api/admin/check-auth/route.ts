import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET() {
  try {
    const token = (await cookies()).get("admin-token")?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 302, headers: { Location: "/admin/login" } }
      );
    }

    verify(token, JWT_SECRET);
    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json(
      { authenticated: false },
      { status: 302, headers: { Location: "/admin/login" } }
    );
  }
}
