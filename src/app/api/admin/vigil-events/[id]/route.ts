import { NextResponse } from "next/server";
import { db } from "@/db";
import { vigilEvents } from "@/db/schema";
import { eq } from "drizzle-orm";
import storage from "@/lib/storage";
import { checkAdminStatus } from "@/lib/auth";

// GET /api/admin/vigil-events/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await checkAdminStatus();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [event] = await db
      .select()
      .from(vigilEvents)
      .where(eq(vigilEvents.id, parseInt(id)));

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/vigil-events/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const isAdmin = await checkAdminStatus();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Get the current event to check if we need to delete an old image
    const [currentEvent] = await db
      .select()
      .from(vigilEvents)
      .where(eq(vigilEvents.id, parseInt(resolvedParams.id)));

    // If there's an existing image and it's being changed, delete the old one
    if (currentEvent?.image && currentEvent.image !== data.image) {
      await storage.deleteFile(currentEvent.image);
    }

    const [updatedEvent] = await db
      .update(vigilEvents)
      .set({
        city: data.city,
        province: data.province,
        date: data.date,
        time: data.time,
        location: data.location,
        details: data.details,
        organizers: data.organizers || "",
        links: data.links || undefined,
        image: data.image || undefined,
        updatedAt: new Date(),
      })
      .where(eq(vigilEvents.id, parseInt(resolvedParams.id)))
      .returning();

    if (!updatedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/vigil-events/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const isAdmin = await checkAdminStatus();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the event to delete its image if it exists
    const [event] = await db
      .select()
      .from(vigilEvents)
      .where(eq(vigilEvents.id, parseInt(resolvedParams.id)));

    if (event?.image) {
      await storage.deleteFile(event.image);
    }

    const [deletedEvent] = await db
      .delete(vigilEvents)
      .where(eq(vigilEvents.id, parseInt(resolvedParams.id)))
      .returning();

    if (!deletedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
