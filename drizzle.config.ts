import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "postgres",
    database: process.env.POSTGRES_DATABASE || "luksangbayan",
    ssl: process.env.NODE_ENV === "production" ? true : false,
  },
} satisfies Config;
