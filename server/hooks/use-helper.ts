import { Context } from "hono";
import { decode, sign, verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";
import {
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie,
  deleteCookie,
} from "hono/cookie";

type props = {
  [key: string]: any;
  c: Context;
};

async function JWTSignHelper({ key, c }: props) {
  const secret = process.env.BETTER_AUTH_SECRET!;
  const payload: JWTPayload = {
    sub: key,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2, // Token expires in 2 hours
    nbf: Math.floor(Date.now() / 1000) - 30, // Token not before 30 seconds from now
    iat: Math.floor(Date.now() / 1000), // Token issued at current time
  };

  const token = await sign(payload, secret);

  await setSignedCookie(c, "token", token, secret);
}

async function JWTVerifyHelper(token: string) {
  const secret = process.env.BETTER_AUTH_SECRET!;
  const decodedPayload = await verify(token, secret);
  return decodedPayload;
}

export { JWTSignHelper, JWTVerifyHelper };
