import { useHono } from "../hooks/use-hono";
import { validator } from "hono/validator";
import { z } from "zod";
import argon2 from "argon2";
import { getDatabase } from "../db";
import {
  acccounts,
  InsertAccountTypes,
  InsertUsersTypes,
  users,
} from "../db/schema";
import { eq, or } from "drizzle-orm";

// prettier-ignore
const createUserWithEmailAndPassword = z.object({
  email: z.string().email({ message: 'Invalid email address' }).nonempty({ message: 'Email is required' }),
  password: z.string().min(8, { message: 'Password must be at least 6 characters long' }).max(23, { message: 'Password must be at least 6 characters long' }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$/, { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' }).nonempty({ message: 'Password is required' }),
  username: z.string().min(3, { message: 'Username must be between 3 and 12 characters long'}).max(12, { message: 'Username must be between 3 and 12 characters long'}).nonempty({ message: 'Username is required' }),
  enableUsername: z.boolean().default(false),
});

// prettier-ignore
const signInWithEmailAndPassword = z.object({
  email: z.string().email({ message: 'Invalid email address' }).nullable(),
  username: z.string().nullable(),
  password: z.string().nonempty({ message: 'Password is required' }),
  rememberMe: z.boolean().default(false),
})

const userAuth = useHono();
userAuth.get("/currentUser", (c) => {
  return c.json({
    users: "1",
  });
});

userAuth.post(
  "/createUserWithEmailAndPassword",
  validator("json", (value, c) => {
    const parsed = createUserWithEmailAndPassword.safeParse(value);
    if (!parsed.success) {
      return c.text("Invalid!", 401);
    }
    return parsed.data;
  }),
  async (c) => {
    const { db, env } = await getDatabase();
    const { email, password, username, enableUsername } = c?.req?.valid("json");
    // check if user already exists
    const checkusersExists = await db
      .select()
      .from(users)
      .where(or(eq(users.identifier, email), eq(users.username, username)))
      .limit(1);
    if (checkusersExists.length > 0) {
      return c.json("User already exists", 401);
    }
    // encrypting the password
    const passwordHash = await argon2.hash(password);
    // create the new user
    const createNewUser: InsertUsersTypes = {
      identifier: email,
      passwordHash: passwordHash,
      username: username,
      provider: "EMAIL&PASSWORD",
      enableUsername: enableUsername,
    };

    const createAccount = await db.transaction(async (tx) => {
      const [newUsers] = await tx
        .insert(users)
        .values(createNewUser)
        .returning();

      // all users in database
      const allUsers = await db.select().from(users);
      const allusersstate = allUsers.length > 0;

      const newUserAccount: InsertAccountTypes = {
        uid: newUsers.uid,
        username: newUsers.username,
        email: newUsers.identifier,
        role: allusersstate ? "user" : "owner",
      };

      const [accountInfo] = await tx
        .insert(acccounts)
        .values(newUserAccount)
        .returning();
      const { uid, ...all } = accountInfo;
      return all;
    });

    return c.json({
      message: "User created successfully",
      user: {
        ...createAccount,
      },
      status: "success",
      code: 200,
      success: true,
    });
  }
);

userAuth.post(
  "/signInWithEmailAndPassword",
  validator("json", (value, c) => {
    const parsed = signInWithEmailAndPassword.safeParse(value);
    if (!parsed.success) {
      return c.text("Invalid!", 401);
    }
    return parsed.data;
  }),
  async (c) => {
    const { db, env } = await getDatabase();
    const { email, password, username, rememberMe } = c?.req?.valid("json");

    const [authuser] = await db
      .select()
      .from(users)
      .where(or(eq(users.identifier, email!), eq(users.username, username!)))
      .limit(1);

    // confirm login method username has enableUsername else return cant use method
    if (username && !authuser.enableUsername && !email) {
      return c.json(
        `${username} doesn't have permssion to login with username enable!`,
        401
      );
    }

    // varify password
    const passwordValidation = await argon2.verify(
      authuser.passwordHash,
      password
    );

    if (!passwordValidation) {
      return c.json("Invalid password", 401);
    }

    return c.json({
      message: "User logged in successfully",
      user: authuser,
      status: "success",
      code: 200,
      success: true,
    });
  }
);

export type Route = typeof userAuth;
export default userAuth;
