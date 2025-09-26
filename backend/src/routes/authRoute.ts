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
    try{
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const body = await c.req.json();
        const signedupInput = signupInput.safeParse(body);
    if(!signedupInput.success){
        return c.json({
            message: "Enter valid input"
        })
    }
    const userExists = await prisma.user.findUnique({
        where:{
            email: body.email
        }
    })
    if(userExists){
        return c.json({
            message: "User already exists"
        })
    }
    const user = await prisma.user.create({
        data:{
            email: body.email,
            password: body.password,
            createdAt: new Date()
        }
    })

    console.log("User signed up successfully");
    try{
        const jwt = await sign({ id: user.id}, c.env.JWT_SECRET);
        return c.json({
            token: jwt
        })
    }catch(err){
        return c.json({
            error: err
        })
    }
}catch(error){
        return c.json({
            error : error
        })
    }  
})

authRoute.post("/signin", async(c) =>{
    try {
        const body = await c.req.json();
        const signedinInput = signinInput.safeParse(body);
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        if(!signedinInput.success){
            return c.json({
                message: "Invalid inputs"
            })
        }
        const user = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        })
        if(!user){
            return c.json({
                message: "User does not exists"
            })
        }
        const jwt = await sign({id: user.id}, c.env.JWT_SECRET);
        return c.json({
            token: jwt
        })
    }catch(error){
        return c.json({
            error: error
        })
    }
})


