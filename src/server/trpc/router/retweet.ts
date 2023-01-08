import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const retweetRouter = router({
  uniqueRetweet: publicProcedure
  .input(z.object({ tweetId:z.string()}))
  .query(({ ctx, input }) => {
    const userId = ctx.session?.user?.id;

    return ctx.prisma.retweet.findUnique({
        where:{
            userId_tweetId:{
                userId:userId as string,
                tweetId:input?.tweetId
            }
        }
    })

  }),
  retweet: publicProcedure
    .input(z.object({ tweetId: z.string() }))
    .mutation(({ ctx, input }) => {
      if (!ctx.session) {
        throw new Error("You have to be logged in");
      }
      const userId = ctx.session?.user?.id;

      return ctx.prisma.retweet.create({
        data: {
          tweet: {
            connect: {
              id: input.tweetId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),
  undoRetweet: publicProcedure
    .input(z.object({ tweetId: z.string() }))
    .mutation(({ ctx, input }) => {
      if (!ctx.session) {
        throw new Error("You have to be logged in");
      }
      const userId = ctx.session?.user?.id;
      return ctx.prisma.retweet.delete({
        where: {
          userId_tweetId: {
            userId: userId as string,
            tweetId: input.tweetId,
          },
        },
      });
    }),
});
