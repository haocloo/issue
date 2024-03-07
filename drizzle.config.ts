import config from "./lib/db/config";
import { defineConfig } from "drizzle-kit";

const sslmode = config.APP_ENV === "prod" ? "?sslmode=require" : "";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: config.POSTGRES_URL + sslmode,
  },
  verbose: true,
  strict: true,
});
