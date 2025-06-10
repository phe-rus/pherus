import { getDatabase } from "@/server/db";
import { auth } from "@/server/utilities/auth";
import { Hono } from "hono";
import { handle } from "hono/vercel";

async function appInstance() {
  const { env } = await getDatabase();
  const honoInst = new Hono<{ Bindings: typeof env }>().basePath("/api");
  return honoInst;
}

const app = await appInstance();
/**app.on(["GET", "POST"], "/*", (c) => {
  //return auth(c?.env).handler(c.req.raw);
}); **/

app.get("/hello", (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

export const GET = handle(app);
export const POST = handle(app);
