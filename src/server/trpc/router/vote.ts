import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const voteRouter = router({
    voteOption:publicProcedure.input(z.object({ userId:z.string(),optionId:z.string() })).mutation(({ ctx,input })=>{
        if(!ctx.session) {
            throw new Error("You have to be logged in first ")
        }

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