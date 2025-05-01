import { db } from "@/db";
import { memorialMessages } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { checkAdminStatus } from "@/lib/auth";
import { sql } from "drizzle-orm";

type MessageStatus = "pending" | "approved" | "rejected";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "10");
    const status = searchParams.get("status") as MessageStatus | null;

    const isAdmin = await checkAdminStatus();

    const offset = (page - 1) * perPage;

    // Build where clause
    const whereClause = (() => {
      if (!isAdmin) {
        return eq(memorialMessages.status, "approved");
      }
      return status ? eq(memorialMessages.status, status) : undefined;
    })();

    // Get total count
    const countResult = await db
      .select({ value: sql<number>`count(*)` })
      .from(memorialMessages)
      .where(whereClause)
      .execute();
    const totalCount = Number(countResult[0]?.value) || 0;

    // Get paginated messages
    const messages = await db
      .select()
      .from(memorialMessages)
      .where(whereClause)
      .orderBy(desc(memorialMessages.createdAt))
      .limit(perPage)
      .offset(offset)
      .execute();

    return NextResponse.json({
      messages,
      totalCount,
      isAdmin,
    });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch messages" }),
      { status: 500 }
    );
  }
}
