import { Hono } from "hono";
import { getDatabase } from "../db";

async function useHono() {
  const { env } = await getDatabase();
  const honoInsatnace = new Hono<{ Bindings: typeof env }>();
  return honoInsatnace;
}

export { useHono };
