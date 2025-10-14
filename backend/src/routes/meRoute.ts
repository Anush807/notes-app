import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "../generated/prisma/edge";
import { withAccelerate } from "@prisma/extension-accelerate";


export const meRoute = new Hono<{
  Bindings: {
    JWT_SECRET: string,
    DATABASE_URL: string
  };
  Variables: {
    userId: string;
  };
}>();

// 🔹 Middleware for JWT authentication (same pattern as your notesRoute)
meRoute.use("/*", async (c, next) => {
  try {
    const headerToken = c.req.header("Authorization") || "";
    if (!headerToken) {
      c.status(403);
      return c.json({ message: "Unauthorized" });
    }

    const token = headerToken.split(" ")[1];
    const user = await verify(token, c.env.JWT_SECRET);

    if (user) {
      c.set("userId", (user as { id: string }).id);
      await next();
    } else {
      c.status(403);
      return c.json({ message: "User not logged in" });
    }
  } catch (err) {
    console.error(err);
    c.status(403);
    return c.json({ message: "Invalid or expired token" });
  }
});

// 🔹 /me route: returns user info (excluding password & salt)
meRoute.get("/dashboard", async (c) => {
  try {
    const userId = c.get("userId");

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        active: true,
        createdAt: true,
        notes: true,
        // verificationTokens: true,
      },
    });

    if (!user) {
      c.status(404);
      return c.json({ message: "User not found" });
    }

    return c.json({ user });
  } catch (err) {
    console.error(err);
    c.status(500);
    return c.json({ message: "Internal Server Error" });
  }
});