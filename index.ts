import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

// Hosted providers (Neon, Supabase, Render, etc.) require SSL but often
// use self-signed certs in the chain, so we can't do strict verification.
// If the connection string already specifies sslmode, pg respects that;
// this only kicks in as a fallback for providers that need SSL but didn't
// put sslmode in the URL.
const needsSsl =
  /sslmode=require/.test(databaseUrl) ||
  /\.neon\.tech|\.supabase\.co|\.render\.com/.test(databaseUrl);

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
