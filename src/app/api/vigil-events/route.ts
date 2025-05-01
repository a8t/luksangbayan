import { db } from "@/db";
import { vigilEvents } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Get total count
    const countResult = await db
      .select({ value: sql<number>`count(*)` })
      .from(vigilEvents)
      .execute();
    const totalCount = Number(countResult[0]?.value) || 0;

    const events = await db
      .select()
      .from(vigilEvents)
      .orderBy(desc(vigilEvents.createdAt))
      .execute();

    return NextResponse.json({
      events,
      totalCount,
    });
  } catch (error) {
    console.error("Failed to fetch vigil events:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch vigil events" }),
      { status: 500 }
    );
  }
}
