import { pgTable, serial, text, timestamp, date } from "drizzle-orm/pg-core";

export const vigilEvents = pgTable("vigil_events", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  date: date("date", { mode: "date" }).notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  details: text("details").notNull(),
  organizers: text("organizers").notNull().default(""),
  links: text("links").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
