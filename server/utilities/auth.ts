import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import * as schema from "../db/schema";
import { drizzle } from "drizzle-orm/d1";

export const auth = async (
  env: CloudflareEnv
): Promise<ReturnType<typeof betterAuth>> => {
  const db = drizzle(env.DB);

  return betterAuth({
    appName: "pherus",
    basePath: "/api",
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: {
        ...schema,
      },
    }),
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
  });
};
