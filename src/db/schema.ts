import {
  pgTable,
  serial,
  text,
  timestamp,
  date,
  varchar,
  pgEnum,
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

export const memorialMessageStatus = pgEnum("memorial_message_status", [
  "pending",
  "approved",
  "rejected",
]);

export const memorialMessages = pgTable("memorial_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  country: text("country").notNull().default("Canada"),
  email: text("email"),
  message: text("message").notNull(),
  status: memorialMessageStatus("status").notNull().default("pending"),
  moderatedAt: timestamp("moderated_at"),
  moderatedBy: text("moderated_by"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type VigilEvent = typeof vigilEvents.$inferSelect;
export type MemorialMessage = typeof memorialMessages.$inferSelect;
export type NewMemorialMessage = typeof memorialMessages.$inferInsert;
