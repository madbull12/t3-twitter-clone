import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const userRouter = router({
    searchUsers:publicProcedure
        .input(z.object({ term:z.string() }))
        .query(({ input,ctx })=>{
            return ctx.prisma.user.findMany({
                where:{
                    name:{
                        contains:input.term
                    }
                }
            })
        })
});
