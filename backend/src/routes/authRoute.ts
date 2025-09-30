import { Hono } from "hono"
import { signinInput, signupInput } from "../validations"
import { PrismaClient } from "../generated/prisma/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import { sign } from "hono/jwt"

export const authRoute = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>()

authRoute.post("/signup", async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const body = await c.req.json();
        const signedupInput = signupInput.safeParse(body);
        if (!signedupInput.success) {
            return c.json({
                message: "Enter valid input"
            })
        }
        const userExists = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        })
        if (userExists) {
            return c.json({
                message: "User already exists"
            })
        }

        const salt = crypto.getRandomValues(new Uint8Array(16));

        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(body.password),
            { name: 'PBKDF2' },
            false,
            ['deriveBits', 'deriveKey']
        )

        const derivedKey = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000, // Adjust iterations for security/performance balance
                hash: 'SHA-256',
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );

        const hashedPassword = btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.exportKey('raw', derivedKey))));
        const saltString = btoa(String.fromCharCode(...salt));

        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: hashedPassword,
                salt: saltString,
                createdAt: new Date()
            }
        })

        console.log("User signed up successfully");
        try {
            const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
            return c.json({
                token: jwt
            })
        } catch (err) {
            return c.json({
                error: err
            })
        }
    } catch (error) {
        return c.json({
            error: error
        })
    }
})

authRoute.post("/signin", async (c) => {
    try {
        const body = await c.req.json();
        const signedinInput = signinInput.safeParse(body);
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        if (!signedinInput.success) {
            return c.json({
                message: "Invalid inputs"
            })
        }
        const user = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        })
        if (!user) {
            return c.json({
                message: "User does not exists"
            })
        }
        const salt = Uint8Array.from(atob(user.salt), (c) => c.charCodeAt(0))

        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(body.password),
            { name: 'PBKDF2' },
            false,
            ['deriveBits', 'deriveKey']
        )

        const derivedKey = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256',
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        )

        const derivedHash = btoa(
            String.fromCharCode(...new Uint8Array(await crypto.subtle.exportKey('raw', derivedKey)))
        )
         if (derivedHash !== user.password) {
    return c.json({ error: 'Invalid email or password' }, 401)
  }

        const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
        return c.json({
            token: jwt,
            message: "Login successfull"
        })
    } catch (error) {
        return c.json({
            error: error
        })
    }
})


