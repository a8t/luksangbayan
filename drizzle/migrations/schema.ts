import { pgTable, serial, text, date, timestamp } from "drizzle-orm/pg-core";

export const vigilEvents = pgTable("vigil_events", {
  id: serial().primaryKey().notNull(),
  city: text().notNull(),
  province: text().notNull(),
  date: date().notNull(),
  time: text().notNull(),
  location: text().notNull(),
  details: text().notNull(),
  organizers: text().default("").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
  links: text().array().default([""]).notNull(),
});
