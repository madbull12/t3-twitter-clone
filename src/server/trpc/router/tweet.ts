import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const tweetRouter = router({
  createTweet: publicProcedure
    .input(
      z.object({
        text: z.string(),
        mediaUrl: z.string().nullable(),
        hashtags: z.string().array().nullable(),
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
          hashtags: {
            connectOrCreate: input?.hashtags?.map((name) => ({
              where: {
                name,
              },
              create: {
                name,
              },
            })),
          },
        },
      });
    }),
  deleteTweet: publicProcedure

    .input(
      z.object({
        tweetId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      const userId = ctx.session?.user?.id;
      if (!ctx.session) {
        throw new Error(
          "You have to be logged in in order to perform this action!"
        );
      }

      // if(userId !== input?.userId) {
      //   throw new Error(
      //     "Can't preform this action"
      //   );
      // }

      return ctx.prisma.tweet.delete({
        where: {
          id_userId: {
            id: input?.tweetId,
            userId: userId as string,
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

  createRetweet: publicProcedure
    .input(
      z.object({
        text: z.string().nullable(),
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
          retweet: {
            connect: {
              id: input?.tweetId as string,
            },
          },
        },
      });
    }),
  undoRetweet: publicProcedure
    .input(
      z.object({
        tweetId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      const userId = ctx?.session?.user?.id;

      return ctx.prisma.tweet.delete({
        where: {
          retweetId_userId: {
            retweetId: input?.tweetId,
            userId: userId as string,
          },
        },
      });
    }),

  getUniqueTweet: publicProcedure
    .input(
      z.object({
        tweetId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      return ctx.prisma.tweet.findFirst({
        where: {
          AND: [
            {
              userId,
            },
            {
              id: input.tweetId,
            },
          ],
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
          likes: true,
          replies: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  getTweets: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tweet.findMany({
      where: {
        retweet: {
          is: null,
        },
      },
      include: {
        user: true,
        originalTweet: {
          include: {
            user: true,
          },
        },
        likes: true,
        replies: true,
        retweets: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  getUserTweets: publicProcedure
    .input(z.object({ userId: z.string(), link: z.string() }))
    .query(({ ctx, input }) => {
      switch (input.link) {
        case "":
          return ctx.prisma.tweet.findMany({
            where: {
              userId: input.userId,
              NOT: {
                originalTweet: {
                  isNot: null,
                },
              },
            },
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
            orderBy: {
              createdAt: "desc",
            },
          });

        case "tweets&replies":
          return ctx.prisma.tweet.findMany({
            where: {
              userId: input.userId,
            },
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
            orderBy: {
              createdAt: "desc",
            },
          });
        case "media":
          return ctx.prisma.tweet.findMany({
            where: {
              userId: input.userId,
              NOT: {
                image: null,
              },
            },
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
            orderBy: {
              createdAt: "desc",
            },
          });
        case "likes":
          return ctx.prisma.tweet.findMany({
            where: {
              userId: input.userId,
              likes: {
                some: {
                  userId: input.userId,
                },
              },
            },

            include: {
              user: true,
              originalTweet: {
                include: {
                  user: true,
                  likes: true,
                  replies: true,
                  retweets: true,
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
            orderBy: {
              createdAt: "desc",
            },
          });

        default:
          break;
      }
    }),
  getUserRetweets: publicProcedure.query(({ ctx, input }) => {
    const userId = ctx.session?.user?.id;
    return ctx.prisma.tweet.findMany({
      where: {
        userId,
      },
      select: {
        retweets: true,
      },
    });
  }),
  userAlreadyRetweet: publicProcedure
    .input(z.object({ tweetId: z.string() }))
    .query(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      return ctx.prisma.tweet.findUnique({
        where: {
          retweetId_userId: {
            retweetId: input?.tweetId,
            userId: userId as string,
          },
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

          originalTweet: {
            include: {
              user: true,
              likes: true,
              retweets:true,
              replies:true
            },
          },
          retweet: {
            include: {
              user: true,
              likes: true,
              retweets:true,
              replies:true
            },
          },
          likes: true,
          retweets: true,
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
              replies: true,
              originalTweet: {
                include: {
                  user: true,
                },
              },
              likes: true,
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
              replies: true,

              originalTweet: {
                include: {
                  user: true,
                },
              },
              likes: true,
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
              replies: true,

              originalTweet: {
                include: {
                  user: true,
                },
              },
              likes: true,
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
              replies: true,

              originalTweet: {
                include: {
                  user: true,
                },
              },
              likes: true,
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
          originalTweet: {
            include: {
              user: true,
            },
          },
          likes: true,
        },
        where: {
          text: {
            contains: input.term,
          },
        },
      });
    }),
});
