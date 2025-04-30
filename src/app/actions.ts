"use server";

import { db } from "../db";
import { vigilEvents } from "../db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

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
