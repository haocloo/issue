import { pgTable, pgEnum, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export const UserRoleEnum = pgEnum("UserRole", ["ADMIN", "USER"]);

export const users: any = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date"}),
  image: text("image"),
  password: text("password"),
  role: UserRoleEnum('UserRole').default("USER"),
  isTwoFactorEnabled: boolean("isTwoFactorEnabled").default(false),
  twoFactorConfirmationId: integer("twoFactorConfirmationId").references(() => twoFactorConfirmations.id),
});

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id, {onDelete: 'cascade'}),
  type: text("type"),
  provider: text("provider").unique(),
  providerAccountId: text("providerAccountId").unique(),
  refreshToken: text("refreshToken"),
  accessToken: text("accessToken"),
  expiresAt: integer("expiresAt"),
  tokenType: text("tokenType"),
  scope: text("scope"),
  idToken: text("idToken"),
  sessionState: text("sessionState"),
});

export const verificationTokens = pgTable("verification_tokens", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  token: text("token").unique(),
  expires: timestamp("expires"),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  token: text("token").unique(),
  expires: timestamp("expires"),
});

export const twoFactorTokens = pgTable("two_factor_tokens", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  token: text("token").unique(),
  expires: timestamp("expires"),
});

export const twoFactorConfirmations = pgTable("two_factor_confirmations", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id, {onDelete: 'cascade'}).unique(),
});

export type MyDatabase = NodePgDatabase<{
  users : typeof users;
  accounts : typeof accounts;
  verification_tokens : typeof verificationTokens;
  password_reset_tokens : typeof passwordResetTokens;
  two_factor_tokens : typeof twoFactorTokens;
  two_factor_confirmations : typeof twoFactorConfirmations;
}>;
