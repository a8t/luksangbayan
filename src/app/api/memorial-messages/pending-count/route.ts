import { db } from "@/db";
import { memorialMessages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { checkAdminStatus } from "@/lib/auth";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const isAdmin = await checkAdminStatus();
    if (!isAdmin) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const result = await db
      .select({ value: sql<number>`count(*)` })
      .from(memorialMessages)
      .where(eq(memorialMessages.status, "pending"))
      .execute();
    const count = Number(result[0]?.value) || 0;

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Failed to get pending count:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to get pending count" }),
      { status: 500 }
    );
  }
}
