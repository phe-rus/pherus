import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

const uidGen = nanoid(38);
export type providers = "EMAIL&PASSWORD" | "GOOGLE" | "GITHUB";
export type roles = "owner" | "admin" | "user" | "editor";

// prettier-ignore
export const users = sqliteTable("users", {
  uid: text("uid").primaryKey().unique().$default(()=> uidGen),
  identifier: text("identifier").notNull(), // often the email or username or telephone numbers
  provider: text("provider").notNull().$type<providers>(),
  passwordHash: text("hash").notNull(),
  username: text("username").notNull(),
  enableUsername: text("enableUsername").$type<boolean>().$default(()=> false),
  createdAt: text("createdAt").$default(()=> new Date().toISOString()).notNull(),
  updatedAt: text("updatedAt").$default(()=> new Date().toISOString()).notNull()
});

// prettier-ignore
export const acccounts = sqliteTable("account", {
  uid: text("uid").notNull().references(()=> users.uid),
  email: text("email").notNull(),
  username: text("username").notNull().references(()=> users.username),
  avatar: text("avatar"),
  role: text("role").notNull().$type<roles>().$default(()=> "user"),
  _verified: text("_verified").$type<boolean>().$default(()=> false)
})

export type InsertUsersTypes = typeof users.$inferInsert;
export type SelectUsersTypes = typeof users.$inferSelect;
export type InsertAccountTypes = typeof acccounts.$inferInsert;
export type SelectAccountTypes = typeof acccounts.$inferSelect;
