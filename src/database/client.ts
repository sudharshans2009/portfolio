import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("POSTGRES_URL is not configured.");
}

export const client = postgres(connectionString, {
  prepare: false,
});

export const db = drizzle(client, { schema });
