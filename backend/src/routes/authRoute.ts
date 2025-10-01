import { Hono } from "hono"
import { signinInput, signupInput } from "../validations"
import { PrismaClient } from "../generated/prisma/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import { sign } from "hono/jwt"
import { Resend } from "resend"

export const authRoute = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
        RESEND_API_KEY: string
    }
}>()

authRoute.post("/signup", async (c) => {
    try {
        const body = await c.req.json();
        const signedupInput = signupInput.safeParse(body);
        if (!signedupInput.success) {
            return c.json({
                message: "Enter valid input"
            })
        }
         const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())
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
                active: false,
                salt: saltString,
                createdAt: new Date(),
            }
        })
        const array = new Uint8Array(16); 
        const token = crypto.getRandomValues(array);

        const actualToken = Array.from(token, b => b.toString(16).padStart(2, '0')).join('');
        const expiry = new Date(Date.now() + 1000 * 60 * 60)

        await prisma.verificationToken.create({
            data:{
                token: actualToken,
                expiresAt: expiry,
                userId: user.id
            }
        })

        const resend = new Resend(c.env.RESEND_API_KEY)
        const verificationLink =  `http://localhost:8787/api/v1/auth/verify?token=${actualToken}`
        console.log(verificationLink)
        await resend.emails.send({
            from: "supernova3901@gmail.com",
            to: user.email,
            subject: 'Verify your email',
            html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
        })
        
        console.log("User signed up successfully");
        console.log("User verifcation email has been sent")
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

authRoute.get("/verify", async (c) => {
    const token = c.req.query("token")
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try{
         if(!token){
            return c.json({
                message: "no token provided"
            })
         }
         const record = await prisma.verificationToken.findUnique({
            where:{
                token: token
            },
            include: {
                user: true
            }
         })

         if(!record) {
            return c.json({
                message: "Invalid verification"
            })
         }

         await prisma.user.update({
            where:{
                id: record.userId
            },
            data:{
                active: true
            }
         })
         await prisma.verificationToken.delete({
            where:{
                id: record.id
            }
         })
         return c.json({
            message: "Email verified successfully"
         })
    }catch(err){
        return c.json({
            error: err
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


