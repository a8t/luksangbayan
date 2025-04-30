import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { db } from "@/db";
import { vigilEvents } from "@/db/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// GET /api/admin/vigil-events
export async function GET() {
  try {
    // Verify admin token
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const events = await db.select().from(vigilEvents);
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST /api/admin/vigil-events
export async function POST(request: Request) {
  try {
    // Verify admin token
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const data = await request.json();
    const [newEvent] = await db
      .insert(vigilEvents)
      .values({
        city: data.city,
        province: data.province,
        date: new Date(data.date),
        time: data.time,
        location: data.location,
        details: data.details,
        organizers: data.organizers || "",
      })
      .returning();

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
