"use server";

import { db } from "../db";
import {
  memorialMessages,
  type NewMemorialMessage,
  type MemorialMessage,
} from "../db/schema";
import { revalidatePath } from "next/cache";
import { invalidateQueries } from "@/utils/queryClient";

export interface PaginatedMessages {
  messages: MemorialMessage[];
  totalCount: number;
  isAdmin: boolean;
}

export async function createMemorialMessage(message: NewMemorialMessage) {
  try {
    await db.insert(memorialMessages).values(message);
    revalidatePath("/memorial-wall");
    await invalidateQueries(["memorialMessages"]);
    return { success: true };
  } catch (error) {
    console.error("Failed to create memorial message:", error);
    return { success: false, error: "Failed to create memorial message" };
  }
}
