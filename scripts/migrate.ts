import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();

const runMigrations = async () => {
  const pool = new Pool({
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "postgres",
    database: process.env.POSTGRES_DATABASE || "voice_poll",
    ssl: process.env.NODE_ENV === "production",
  });

  const db = drizzle(pool);

  console.log("Running migrations...");
  await migrate(db, {
    migrationsFolder: path.join(process.cwd(), "drizzle/migrations"),
  });
  console.log("Migrations completed!");

  await pool.end();
};

runMigrations().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
