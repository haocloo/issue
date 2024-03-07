import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

import { eq } from "drizzle-orm";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.select().from(users).where(eq(users.email, email));
    // const user = await db.query.users.findFirst({ where: { email: email } });
    
    return user[0];
} catch {
    return null;
}
};

export const getUserById = async (id: string) => {
    try {
    const user = await db.select().from(users).where(eq(users.id, id));

    return user[0];
  } catch {
    return null;
  }
};
