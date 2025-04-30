import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const getPool = () => {
  const isProduction = process.env.NODE_ENV === "production";
  const host = process.env.POSTGRES_HOST || "localhost";
  const port = parseInt(process.env.POSTGRES_PORT || "5432");
  const user = process.env.POSTGRES_USER || "postgres";
  const password = process.env.POSTGRES_PASSWORD || "postgres";
  const database = process.env.POSTGRES_DATABASE || "luksangbayan";

  return new Pool({
    host,
    port,
    user,
    password,
    database,
    ssl: isProduction,
  });
};

const pool = getPool();
export const db = drizzle(pool, { schema });
