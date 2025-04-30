import { seedVigilEvents } from "../src/db/seed";

async function main() {
  try {
    await seedVigilEvents();
    process.exit(0);
  } catch (error) {
    console.error("Error running seed script:", error);
    process.exit(1);
  }
}

main();
