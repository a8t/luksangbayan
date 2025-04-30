import { date, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const vigilEvents = pgTable("vigil_events", {
  id: serial().primaryKey().notNull(),
  city: text().notNull(),
  province: text().notNull(),
  date: date().notNull(),
  time: text().notNull(),
  location: text().notNull(),
  details: text().notNull(),
  organizers: text().notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});
