import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const likeRouter = router({
    likeTweet:publicProcedure
        .input(z.object({ tweetId:z.string() }))
        .mutation(({ ctx,input })=>{
            if(!ctx.session) {
                throw new Error("You have to be logged in")
            }
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


    }),
    unlikeTweet:publicProcedure
        .input(z.object({ tweetId:z.string() }))
        .mutation(({ ctx,input })=>{
            if(!ctx.session) {
                throw new Error("You have to be logged in")
            }
            const userId = ctx.session?.user?.id;
            return ctx.prisma.like.delete({
               where:{
                userId_tweetId:{
                    userId:userId as string,
                    tweetId:input.tweetId
                }
               }
            })


    }),
    

    userLikeTweet:publicProcedure
        .input((z.object({ tweetId:z.string() })))
        .query(({ ctx,input })=>{
            const userId = ctx.session?.user?.id;

            return ctx.prisma.like.findUnique({
                where:{
                    userId_tweetId:{
                        userId:userId as string,
                        tweetId:input.tweetId
                    }
                }
            })
        })


    
})