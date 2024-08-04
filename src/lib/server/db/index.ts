import { drizzle } from "drizzle-orm/libsql";

import * as schema from "../../db/schema";
import { createClient } from "@libsql/client";
import { env } from "$env/dynamic/private";

export const db = drizzle(
  createClient({
    url: env.TURSO_DATABASE_URL!,
    authToken: env.TURSO_AUTH_TOKEN!
  }),
  { schema }
);

export default db;
