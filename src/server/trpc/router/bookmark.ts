import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const bookmarkRouter = router({
  getUserBookmarks: publicProcedure.query(({ ctx, input }) => {
    const userId = ctx.session?.user?.id;

    return ctx.prisma.bookmark.findMany({
      where: {
        userId,
      },
      include: {
        tweet: {
          include: {
            user: true,
            originalTweet: {
              include: {
                user: true,
              },
            },
            likes: true,
            replies: true,
          },
        },
      },
    });
  }),
  createBookmark: publicProcedure
    .input(z.object({ tweetId: z.string() }))
    .mutation(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      return ctx.prisma.bookmark.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          tweet: {
            connect: {
              id: input.tweetId,
            },
          },
        },
      });
    }),
  deleteBookmark: publicProcedure
    .input(z.object({ bookmarkId: z.string() }))
    .mutation(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      return ctx.prisma.bookmark.delete({
        where:{
          id:input.bookmarkId,        
        }
      });
    }),
});
