import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const likeRouter = router({
    likeTweet:publicProcedure
        .input(z.object({ tweetId:z.string() }))
        .mutation(({ ctx,input })=>{
            const userId = ctx.session?.user?.id;
            return ctx.prisma.like.create({
                data:{
                    tweet:{
                        connect:{
                            id:input.tweetId
                        }
                    },
                    user:{
                        connect:{
                            id:userId
                        }
                    }
                }
            })


        })
})