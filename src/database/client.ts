import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const connectionString = process.env.POSTGRES_URL;

const client = postgres(connectionString || "postgres://localhost/ssme", {
  prepare: false,
});

export const db = drizzle(client, { schema });
