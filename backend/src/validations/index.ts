import z from "zod"

export const signupInput = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export const signinInput = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export type Signup = z.infer<typeof signupInput>
export type signin = z.infer<typeof signinInput>

