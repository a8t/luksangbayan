import { db } from "../db";
import { vigilEvents } from "../db/schema";
import { eq } from "drizzle-orm";

export async function getVigilEvents() {
  return await db.select().from(vigilEvents).orderBy(vigilEvents.date);
}

export async function getVigilEventsByProvince(province: string) {
  return await db
    .select()
    .from(vigilEvents)
    .where(eq(vigilEvents.province, province))
    .orderBy(vigilEvents.date);
}

export async function getVigilEventsByCity(city: string) {
  return await db
    .select()
    .from(vigilEvents)
    .where(eq(vigilEvents.city, city))
    .orderBy(vigilEvents.date);
}

export async function getUniqueProvinces() {
  const events = await getVigilEvents();
  return [...new Set(events.map((event) => event.province))].sort();
}

export async function getCitiesByProvince(province: string) {
  const events = await getVigilEventsByProvince(province);
  return [...new Set(events.map((event) => event.city))].sort();
}
