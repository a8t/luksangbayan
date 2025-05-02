"use server";

import { sendTelegramMessage } from "@/utils/telegram";
import { db } from "../db";
import {
  memorialMessages,
  type NewMemorialMessage,
  type MemorialMessage,
} from "../db/schema";
import { revalidatePath } from "next/cache";

export interface PaginatedMessages {
  messages: MemorialMessage[];
  totalCount: number;
  isAdmin: boolean;
}

export async function createMemorialMessage(message: NewMemorialMessage) {
  try {
    await db.insert(memorialMessages).values(message);
    revalidatePath("/memorial-wall");
    await sendTelegramMessage(
      `New memorial wall message:
Name: ${message.name}
From: ${message.city}, ${message.province}, ${message.country}
Email: ${message.email === "" ? "(no email)" : message.email}
Message: ${message.message}
Go to https://luksangbayan.ca/admin/memorial-messages to moderate.`
    );
    return { success: true };
  } catch (error) {
    console.error("Failed to create memorial message:", error);
    return { success: false, error: "Failed to create memorial message" };
  }
}
