import {
  pgTable,
  serial,
  text,
  timestamp,
  date,
  varchar,
} from "drizzle-orm/pg-core";

export const vigilEvents = pgTable("vigil_events", {
  id: serial("id").primaryKey(),
  city: varchar("city", { length: 100 }).notNull(),
  province: varchar("province", { length: 100 }).notNull(),
  date: date("date", { mode: "date" }).notNull(),
  time: varchar("time", { length: 50 }).notNull(),
  location: text("location").notNull(),
  details: text("details").notNull(),
  organizers: text("organizers").notNull().default(""),
  links: text("links").array().notNull().default([]),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const memorialMessages = pgTable("memorial_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  country: text("country").notNull().default("Canada"),
  email: text("email"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type VigilEvent = typeof vigilEvents.$inferSelect;
export type MemorialMessage = typeof memorialMessages.$inferSelect;
export type NewMemorialMessage = typeof memorialMessages.$inferInsert;
