import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { cache } from "react";

const useHono = cache(() => {
  const app = new Hono<{
    Bindings: CloudflareEnv;
  }>();

  app.use(
    cors({
      origin: process.env.BETTER_AUTH_URL || "*",
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS", "PATCH", "DELETE"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    })
  );
  app.use(logger());
  app.use(
    poweredBy({
      serverName: "Cloudflare Workers + Hono + NextJS & Opennextjs",
    })
  );
  return app;
});

export { useHono };
