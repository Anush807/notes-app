import { Hono } from "hono"
import { verify } from "hono/jwt";

export const notesRoute = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();
notesRoute.use("/*", async (c) =>{
    try{
        const headerToken = c.req.header("Authorization");
        if(!headerToken){
            return c.json({
                message: "User not logged in"
            })
        }
        const token = headerToken?.split(" ")[1];
        const user = await verify(token, c.env.JWT_SECRET)
    }catch(err){

    }
})

notesRoute.post("/createnotes", async (c) =>{

})
