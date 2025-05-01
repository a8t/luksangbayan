import { NextResponse } from "next/server";
import { db } from "@/db";
import { memorialMessages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { checkAdminStatus } from "@/app/actions";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  // Check admin status
  const isAdmin = await checkAdminStatus();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { messageId, action, rejectionReason } = await request.json();

    if (!messageId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["approve", "reject", "delete"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (action === "delete") {
      await db
        .delete(memorialMessages)
        .where(eq(memorialMessages.id, messageId));
    } else {
      await db
        .update(memorialMessages)
        .set({
          status: action === "approve" ? "approved" : "rejected",
          moderatedAt: new Date(),
          moderatedBy: "admin", // You might want to store actual admin info
          rejectionReason: action === "reject" ? rejectionReason : null,
        })
        .where(eq(memorialMessages.id, messageId));
    }

    revalidatePath("/memorial-wall");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to moderate message:", error);
    return NextResponse.json(
      { error: "Failed to moderate message" },
      { status: 500 }
    );
  }
}
