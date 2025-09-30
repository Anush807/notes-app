import { Hono } from "hono"
import { verify } from "hono/jwt";
import { notes } from "../validations";
import { PrismaClient } from "../generated/prisma/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const notesRoute = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables: {
        userId: string
    }
}>();

notesRoute.use("/*", async (c, next) => {
    try {
        const headerToken = c.req.header("Authorization") || "";
        if (!headerToken) {
            c.status(403)
            return c.json({
                message: "Unauthorized"
            })
        }
        const token = headerToken.split(" ")[1];
        const user = await verify(token, c.env.JWT_SECRET)
        if (user) {
            c.set("userId", (user as { id: string }).id)
            await next();
        } else {
            c.status(403)
            return c.json({
                message: "User not logged in"
            })
        }
    } catch (err) {
        c.json({
            error: err
        })
    }
})

notesRoute.post("/createnotes", async (c) => {
    try {
        const body = await c.req.json();
        const parsedNotes = notes.safeParse(body);
        if (!parsedNotes.success) {
            return c.json({
                message: "Invalid inputs"
            })
        }
        const userId = c.get("userId");
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const note = await prisma.notes.create({
            data: {
                title: body.title,
                content: body.content,
                creatorId: userId
            }
        })
        return c.json({
            message: "notes created successfully",
            note
        })
    } catch (err) {
        return c.json({
            error: err,
        })
    }
})

notesRoute.put("/editnote/:id", async (c) => {
    try {
        const body = await c.req.json();
        const id = c.req.param("id")
        try {
            const parsedNotes = notes.safeParse(body);
            if (!parsedNotes.success) {
                return c.json({
                    message: "edit your notes properly"
                })
            }
        } catch (err) {
            return c.json({
                error: err
            })
        }
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())
        const editedNote = await prisma.notes.update({
            where: {
                id: id
            },
            data: {
                title: body.title,
                content: body.content
            },
            select: {
                title: true,
                content: true
            }
        })
        return c.json({
            message: "edited successfully",
            editedNote
        })
    } catch (err) {
        return c.json({
            error: err
        })
    }
})

// notesRoute.get("/bulk", async (c) =>{
//     const id = c.req.param("")
// })
