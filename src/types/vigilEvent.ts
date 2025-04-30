import { InferSelectModel } from "drizzle-orm";
import { vigilEvents } from "../db/schema";

export type VigilEvent = InferSelectModel<typeof vigilEvents>;
