import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import config from "@/lib/db/config";
import { MyDatabase } from "./schema";

declare global {
    var db: MyDatabase | undefined;
}

let db: MyDatabase;

if (config.APP_ENV === "production") {
    const client = new Client({
        connectionString: config.POSTGRES_URL + "?sslmode=require",
    });

    (async () => {
        await client.connect();
    })();

    db = drizzle(client, { logger: true });
} else {
    if (!global.db) {
        const client = new Client({
            connectionString: config.POSTGRES_URL,
        });

        (async () => {
            await client.connect();
        })();

        global.db = drizzle(client, {
            logger: true,
        });
    }

    db = global.db;
}

export { db };
