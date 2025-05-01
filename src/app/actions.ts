"use server";

import { db } from "../db";
import {
  vigilEvents,
  memorialMessages,
  type NewMemorialMessage,
  type MemorialMessage,
} from "../db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { invalidateQueries } from "@/utils/queryClient";

export async function getVigilEvents() {
  return await db.select().from(vigilEvents).orderBy(vigilEvents.date);
}

export async function getUniqueProvinces() {
  const events = await getVigilEvents();
  return [...new Set(events.map((event) => event.province))].sort();
}

export async function getCitiesByProvince(province: string) {
  const events = await db
    .select()
    .from(vigilEvents)
    .where(eq(vigilEvents.province, province))
    .orderBy(vigilEvents.date);
  return [...new Set(events.map((event) => event.city))].sort();
}

export async function checkAdminStatus() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  return !!token;
}

export interface PaginatedMessages {
  messages: MemorialMessage[];
  totalCount: number;
  isAdmin: boolean;
}

export async function getMemorialMessages(
  page: number = 1,
  perPage: number = 10,
  includeModerated: boolean = false
): Promise<PaginatedMessages> {
  const offset = (page - 1) * perPage;
  const isAdmin = await checkAdminStatus();
  const statusFilter =
    !isAdmin || !includeModerated
      ? eq(memorialMessages.status, "approved")
      : undefined;

  const [messages, [{ count }]] = await Promise.all([
    db
      .select()
      .from(memorialMessages)
      .where(statusFilter)
      .orderBy(desc(memorialMessages.createdAt))
      .limit(perPage)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(memorialMessages)
      .where(statusFilter),
  ]);

  return {
    messages,
    totalCount: Number(count),
    isAdmin,
  };
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
