import { db } from "./index";
import { vigilEvents } from "./schema";
import vigilEventsData from "../data/vigilEvents.json";

type VigilEvent = {
  city: string;
  province: string;
  date: string;
  time: string;
  location: string;
  details: string;
  organizers: string;
};

export async function seedVigilEvents() {
  try {
    // Check if table is empty
    const count = await db.select({ count: vigilEvents.id }).from(vigilEvents);

    if (count.length === 0) {
      console.log("Seeding vigil events...");

      // Insert all events
      await db.insert(vigilEvents).values(
        (vigilEventsData as VigilEvent[]).map((event) => ({
          city: event.city,
          province: event.province,
          date: new Date(event.date),
          time: event.time,
          location: event.location,
          details: event.details,
          organizers: event.organizers || "",
        }))
      );

      console.log("Seeding completed successfully");
    } else {
      console.log("Vigil events table already contains data, skipping seed");
    }
  } catch (error) {
    console.error("Error seeding vigil events:", error);
    throw error;
  }
}
