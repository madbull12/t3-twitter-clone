import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const voteRouter = router({
    voteOption:protectedProcedure.input(z.object({ userId:z.string(),optionId:z.string() })).mutation(({ ctx,input })=>{
      

        return ctx.prisma.option.update({
            where:{
                id:input?.optionId
            },
            data:{
                votes:{
                    connect:{
                        id:input?.userId
                    }
                }
            }
        })
    })
})