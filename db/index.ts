import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL não definido. Adicione em .env.local (Neon/Supabase) e na Vercel."
    );
  }
  if (!dbInstance) {
    const sql = postgres(connectionString, { max: 1, prepare: false });
    dbInstance = drizzle(sql, { schema });
  }
  return dbInstance;
}
