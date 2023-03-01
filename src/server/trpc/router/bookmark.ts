import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const bookmarkRouter = router({
  userAlreadyBookmark: publicProcedure
    .input(z.object({ bookmarkId: z.string() }))
    .query(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      return ctx.prisma.bookmark.findUnique({
        where: {
          userId_tweetId: {
            userId: userId as string,
            tweetId: input?.bookmarkId as string,
          },
        },
      });
    }),
  getUserBookmarks: publicProcedure.query(({ ctx }) => {
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
  getInfiniteUserBookmarks: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, cursor } = input;
      const userId = ctx?.session?.user?.id;

      const bookmarks = await ctx.prisma.bookmark.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        // orderBy: {
        //   createdAt: "desc",
        // },
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
      let nextCursor: typeof cursor | undefined = undefined;
      if (bookmarks?.length > limit) {
        const nextItem = bookmarks?.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }
      return {
        bookmarks,
        nextCursor,
      };
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
        where: {
          tweet: {
            text: {
              contains: input?.term,
              mode: "insensitive",
            },
          },
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
});
