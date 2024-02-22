import { type Config } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export default {
  schema: "./src/lib/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    uri: process.env.DATABASE_URL,
  },
  tablesFilter: ["scougi_*"]
} satisfies Config;
