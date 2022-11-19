import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const replyRouter = router({
    createReply: publicProcedure
      .input(z.object({ text: z.string(), mediaUrl: z.string().nullable(),tweetId:z.string() }))
      .mutation(({ input, ctx }) => {
        const userId = ctx.session?.user?.id;
        if (!ctx.session) {
          throw new Error(
            "You have to be logged in in order to perform this action!"
          );
        }
  
        return ctx.prisma.reply.create({
            data: {
                text: input?.text,
                image: input?.mediaUrl,
                tweet:{
                    connect:{
                        id:input?.tweetId
                    }
                },
                user: {
                  connect: {
                    id: userId,
                  },
                },
              },
        });
      }),
  
    
});
  