import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const pollRouter = router({
    getSinglePoll:publicProcedure.input(z.object({ pollId:z.string() })).query(({ ctx,input })=>{
        return ctx.prisma.poll.findUnique({
            where:{
                id:input?.pollId
            }
        })
    })
})