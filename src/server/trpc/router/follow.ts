import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const followRouter = router({
  followUser:publicProcedure
    .input(z.object({followingId:z.string()}))
    .mutation(({ ctx,input })=>{
        if(!ctx.session) {
            throw new Error("Please login first")
        }
        const userId = ctx.session?.user?.id;

        return ctx.prisma.follows.create({
            data:{
                follower:{
                    connect:{
                        id:userId as string
                    }
                },
                following:{
                    connect:{
                        id:input?.followingId as string
                    }
                }
            }
        })
    })
    
});
