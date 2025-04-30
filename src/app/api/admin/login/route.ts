import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { rateLimiter } from "@/utils/rateLimiter";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      return NextResponse.json(
        { message: "Admin credentials not configured" },
        { status: 500 }
      );
    }

    // Check rate limit
    if (rateLimiter.isLimited(ip)) {
      return NextResponse.json(
        { message: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Reset rate limit on successful login
      rateLimiter.reset(ip);

      const token = sign({ role: "admin" }, JWT_SECRET, { expiresIn: "1h" });

      const response = NextResponse.json(
        { success: true },
        {
          status: 200,
          headers: {
            "Set-Cookie": `admin-token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600${
              process.env.NODE_ENV === "production" ? "; Secure" : ""
            }`,
          },
        }
      );

      return response;
    }

    // Increment failed attempt counter
    rateLimiter.increment(ip);

    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
