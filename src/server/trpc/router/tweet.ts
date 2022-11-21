import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const tweetRouter = router({
  createTweet: publicProcedure
    .input(
      z.object({
        text: z.string(),
        mediaUrl: z.string().nullable(),
      })
    )
    .mutation(({ input, ctx }) => {
      const userId = ctx?.session?.user?.id;
      if (!ctx.session) {
        throw new Error(
          "You have to be logged in in order to perform this action!"
        );
      }

      return ctx.prisma.tweet.create({
        data: {
          text: input?.text,
          image: input?.mediaUrl,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),
  createReply: publicProcedure
    .input(
      z.object({
        text: z.string(),
        mediaUrl: z.string().nullable(),
        tweetId: z.string().nullable(),
      })
    )
    .mutation(({ input, ctx }) => {
      const userId = ctx?.session?.user?.id;

      if (!ctx.session) {
        throw new Error(
          "You have to be logged in in order to perform this action!"
        );
      }

      return ctx.prisma.tweet.create({
        data: {
          text: input?.text,
          image: input?.mediaUrl,
          user: {
            connect: {
              id: userId,
            },
          },
          originalTweet: {
            connect: {
              id: input.tweetId as string,
            },
          },
        },
      });
    }),

  getTweetReplies: publicProcedure
    .input(z.object({ tweetId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.tweet.findMany({
        where: {
          originalTweetId: input.tweetId,
        },
        include: {
          user: true,
          originalTweet: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  getTweets: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tweet.findMany({
      include: {
        user: true,
        originalTweet: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  getSingleTweet: publicProcedure
    .input(z.object({ tweetId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.tweet.findUnique({
        where: {
          id: input?.tweetId,
        },
        include: {
          user: true,
          
          originalTweet:{
            include:{
              user:true
            }
          }
        },
      });
    }),
  searchTweets: publicProcedure
    .input(z.object({ term: z.string(), filtering: z.string() }))
    .query(({ ctx, input }) => {
      switch (input.filtering) {
        case "top":
          return ctx.prisma.tweet.findMany({
            include: {
              user: true,
            },
            where: {
              text: {
                contains: input.term,
                mode: "insensitive",
              },
            },
          });

        case "latest":
          return ctx.prisma.tweet.findMany({
            include: {
              user: true,
            },
            where: {
              text: {
                contains: input.term,
                mode: "insensitive",
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          });

        case "photos":
          return ctx.prisma.tweet.findMany({
            include: {
              user: true,
            },
            where: {
              text: {
                contains: input.term,
                mode: "insensitive",
              },
              image: {
                endsWith: ".jpg",
              },
            },
          });
        case "videos":
          return ctx.prisma.tweet.findMany({
            include: {
              user: true,
            },
            where: {
              text: {
                contains: input.term,
              },
              image: {
                endsWith: ".mp4",
              },
            },
          });

        default:
          break;
      }
      return ctx.prisma.tweet.findMany({
        include: {
          user: true,
        },
        where: {
          text: {
            contains: input.term,
          },
        },
      });
    }),
});
