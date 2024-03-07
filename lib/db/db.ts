// import config from "@/lib/db/config";
// import { drizzle } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";
// import { MyDatabase } from "./schema";

// const sslmode = config.APP_ENV === "prod" ? "?sslmode=require" : "";

// export const pool = new Pool({
//   connectionString: config.POSTGRES_URL + sslmode,
// });

// export const db: MyDatabase = drizzle(pool, { logger: true });
