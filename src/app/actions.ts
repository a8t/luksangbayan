"use server";

import { sendTelegramMessage } from "@/utils/telegram";
import { db } from "../db";
import {
  memorialMessages,
  type NewMemorialMessage,
  type MemorialMessage,
} from "../db/schema";
import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";

export interface PaginatedMessages {
  messages: MemorialMessage[];
  totalCount: number;
  isAdmin: boolean;
}

export async function createMemorialMessage(message: NewMemorialMessage) {
  try {
    await db.insert(memorialMessages).values(message);
    revalidatePath("/memorial-wall");

    const pendingCountQueryResult = await db
      .select({ value: sql<number>`count(*)` })
      .from(memorialMessages)
      .where(eq(memorialMessages.status, "pending"))
      .execute();

    const pendingCount = Number(pendingCountQueryResult[0]?.value) || 0;

    await sendTelegramMessage(
      `<b>✉️ New memorial wall message ✉️</b>
${message.name} - ${message.city}, ${message.province}, ${message.country} - ${
        message.email === "" ? "(no email)" : message.email
      }

${message.message}

<b>⚠️ There are ${pendingCount} pending messages to review ⚠️</b>
<a href="https://luksangbayan.ca/admin/memorial-messages">🔗 View all pending messages</a>`
    );
    return { success: true };
  } catch (error) {
    console.error("Failed to create memorial message:", error);
    return { success: false, error: "Failed to create memorial message" };
  }
}
