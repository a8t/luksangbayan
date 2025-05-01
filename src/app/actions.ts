"use server";

import { db } from "../db";
import {
  vigilEvents,
  memorialMessages,
  type NewMemorialMessage,
} from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

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

export async function getMemorialMessages() {
  return await db
    .select()
    .from(memorialMessages)
    .orderBy(desc(memorialMessages.createdAt));
}

export async function createMemorialMessage(message: NewMemorialMessage) {
  try {
    await db.insert(memorialMessages).values(message);
    revalidatePath("/memorial-wall");
    return { success: true };
  } catch (error) {
    console.error("Failed to create memorial message:", error);
    return { success: false, error: "Failed to create memorial message" };
  }
}
