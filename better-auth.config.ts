import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { drizzle } from "drizzle-orm/d1";

const db = drizzle(process.env.DB);

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  appName: "pherus",
  basePath: "/api",
  database: drizzleAdapter(db, { provider: "sqlite" }),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
});
