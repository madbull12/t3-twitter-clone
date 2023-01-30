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
            retweet: {
              include: {
                user: true,
                likes: true,
                replies: true,
                retweets: true,
              },
            },
            likes: true,
            replies: true,
            retweets: true,
          },
        },
      },
    });
  }),
  createBookmark: publicProcedure
    .input(z.object({ tweetId: z.string() }))
    .mutation(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      if (!ctx.session) {
        throw new Error(
          "You have to be logged in in order to perform this action!"
        );
      }
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
    .input(z.object({ tweetId: z.string() }))
    .mutation(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      if (!ctx.session) {
        throw new Error(
          "You have to be logged in in order to perform this action!"
        );
      }
      return ctx.prisma.bookmark.delete({
        where: {
          userId_tweetId: {
            tweetId: input?.tweetId,
            userId: userId as string,
          },
        },
      });
    }),

  searchUserBookmarks: publicProcedure
    .input(z.object({ term: z.string() }))
    .query(({ ctx, input }) => {
      const userId = ctx?.session?.user?.id;
      return ctx.prisma.bookmark.findMany({
        where:{
          tweet:{
            text:{
              contains:input?.term,
              mode:"insensitive"
            }
          },
          userId
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
              retweet: {
                include: {
                  user: true,
                  likes: true,
                  replies: true,
                  retweets: true,
                },
              },
              likes: true,
              replies: true,
              retweets: true,
            },
          },
        },
      })
    }),
});
