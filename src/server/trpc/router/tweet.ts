import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const tweetRouter = router({
  createTweet: publicProcedure
    .input(z.object({ text:z.string(),imageUrl:z.string().nullable() }))
    .mutation(({ input, ctx }) => {
        const userId= ctx.session?.user?.id;
        if(!ctx.session) {
            throw new Error("You have to be logged in in order to perform this action!")
        }

        return ctx.prisma.tweet.create({
          data:{
            
            text:input?.text,
            image:input?.imageUrl,
            user:{
              connect:{
                id:userId
              }
            }
          }
        })


    
  }),

  getTweets: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tweet.findMany({
      include:{
        user:true
      },
      orderBy:{
        createdAt:"desc"
      }
    })
  }),
});
