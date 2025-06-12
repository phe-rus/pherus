import userAuth from "@/server/client/users-auth";
import { useHono } from "@/server/hooks/use-hono";
import { handle } from "hono/vercel";

const app = useHono().basePath("/api");
app.route("/users", userAuth);
app.get("/hello", (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

export const GET = handle(app);
export const POST = handle(app);
