import { NextResponse } from "next/server";
import { db } from "@/db";
import { vigilEvents } from "@/db/schema";
import { checkAdminStatus } from "@/lib/auth";

// GET /api/admin/vigil-events
export async function GET() {
  try {
    const isAdmin = await checkAdminStatus();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    const isAdmin = await checkAdminStatus();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const [newEvent] = await db
      .insert(vigilEvents)
      .values({
        city: data.city,
        province: data.province,
        date: data.date,
        time: data.time,
        location: data.location,
        details: data.details,
        organizers: data.organizers || "",
        links: data.links || undefined,
        image: data.image || undefined,
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
