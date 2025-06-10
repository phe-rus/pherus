import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { cache } from "react";

/**
 *
 * @returns dz as Drizzle & env as CloudflareEnv
 */
const getDatabase = cache(async () => {
  const { env } = await getCloudflareContext({ async: true });
  const db = drizzle(env.DB);

  return {
    db,
    env,
  };
});

const db = drizzle(process.env.DB);

export { getDatabase, db };
