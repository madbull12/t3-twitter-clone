import { z } from "zod";

import { router, publicProcedure } from "../trpc";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { TRPCError } from "@trpc/server";

const rateLimit = new Ratelimit({
  redis:Redis.fromEnv(),
  limiter:Ratelimit.slidingWindow(3,"1 m"),
  analytics:true
})

export const tweetRouter = router({
  createTweet: publicProcedure
    .input(
      z.object({
        text: z.string(),
        mediaUrl: z.string().nullable(),
        hashtags: z.string().array().nullable(),
      })
    )
    .mutation(async({ input, ctx }) => {
      const userId = ctx?.session?.user?.id;

      const { success } = await rateLimit.limit(userId as string);
      if(!success) throw new TRPCError({ code:"TOO_MANY_REQUESTS",message:"Please wait for a minute before tweeting again" })
      if (!ctx.session) {
        throw new Error(
          "You have to be logged in in order to perform this action!"
        );
      }

      return await ctx.prisma.tweet.create({
        data: {
          text: input?.text,
          image: input?.mediaUrl,
          isPinned: false,
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
  createPoll: publicProcedure
    .input(
      z.object({
        text: z.string(),
        hashtags: z.string().array().nullable(),
        options: z.string().array(),
      })
    )
    .mutation(({ ctx, input }) => {
      const userId = ctx?.session?.user?.id;
      if (!ctx.session) {
        throw new Error(
          "You have to be logged in in order to perform this action!"
        );
      }
      return ctx.prisma.tweet.create({
        data: {
          text: input?.text,
          isPinned: false,
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

          poll: {
            create: {
              options: {
                createMany: {
                  data: input?.options
                    .filter((option) => option !== "")
                    .map((option) => ({
                      text: option,
                    })),
                },
              },
              expiredAt: new Date(),
            },
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
          isPinned: false,
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
          isPinned: false,
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
      if (!ctx.session) {
        throw new Error(
          "You have to be logged in in order to perform this action!"
        );
      }
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
          retweets: true,
          likes: true,
          poll: {
            include: {
              options: {
                include: {
                  votes: true,
                },
              },
            },
          },
          replies: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  getTweets: publicProcedure
    .input(z.object({ limit: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.tweet.findMany({
        where: {
          retweet: {
            is: null,
          },
        },
        take: input?.limit,
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

  getFollowingInfiniteTweets: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new Error("You have to be logged in to perform this action!");
      }
      const userId = ctx.session?.user?.id;
      const followingUsers = await ctx.prisma.user.findUnique({
        where: {
          id: userId as string,
        },
        select: {
          followings: {
            select: {
              followerId: true,
            },
          },
        },
      });

      console.log(followingUsers);
      const followingIds = followingUsers?.followings.map(
        (user) => user.followerId
      );

      const { limit, skip, cursor } = input;

      const followingTweets = await ctx.prisma.tweet.findMany({
        where: {
          userId: {
            in: followingIds,
          },
          // retweet: {
          //   is: null,
          // },
        },
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          retweet: {
            include: {
              user: true,
              likes: true,
              replies: true,
              retweets: true,
            },
          },
          user: true,
          originalTweet: {
            include: {
              user: true,
            },
          },
          likes: true,
          replies: true,
          retweets: true,
          poll: {
            include: {
              options: {
                include: {
                  votes: true,
                },
              },
            },
          },
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (followingTweets.length > limit) {
        const nextItem = followingTweets.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }
      return {
        followingTweets,
        nextCursor,
      };
    }),
  getInfiniteTweets: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, cursor } = input;
      const tweets = await ctx.prisma.tweet.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
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
          poll: {
            include: {
              options: {
                include: {
                  votes: true,
                },
              },
            },
          },
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (tweets.length > limit) {
        const nextItem = tweets.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }
      return {
        tweets,
        nextCursor,
      };
    }),

  pinTweet: publicProcedure
    .input(z.object({ tweetId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new Error("You have to be logged in first");
      }
      const userId = ctx?.session?.user?.id;
      await ctx.prisma.tweet.updateMany({
        where: {
          userId,
        },
        data: {
          isPinned: false,
        },
      });

      return await ctx.prisma.tweet.update({
        where: {
          id_userId: {
            id: input?.tweetId,
            userId: userId as string,
          },
        },
        data: {
          isPinned: true,
        },
      });
    }),

  unpinTweet: publicProcedure
    .input(z.object({ tweetId: z.string() }))
    .mutation(({ ctx, input }) => {
      const userId = ctx?.session?.user?.id;
      if (!ctx.session) {
        throw new Error("You have to be logged in first");
      }
      return ctx.prisma.tweet.update({
        where: {
          id_userId: {
            id: input?.tweetId,
            userId: userId as string,
          },
        },
        data: {
          isPinned: false,
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
              poll: {
                include: {
                  options: {
                    include: {
                      votes: true,
                    },
                  },
                },
              },
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
              poll: {
                include: {
                  options: {
                    include: {
                      votes: true,
                    },
                  },
                },
              },
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
              poll: {
                include: {
                  options: {
                    include: {
                      votes: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          });
        case "likes":
          return ctx.prisma.tweet.findMany({
            where: {
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
              poll: {
                include: {
                  options: {
                    include: {
                      votes: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          });

        default:
          break;
      }
    }),
  getInfiniteUserTweets: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        link: z.string(),
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, cursor, userId, link } = input;

      switch (link) {
        case "": {
          const tweets = await ctx.prisma.tweet.findMany({
            take: limit + 1,
            skip: skip,
            cursor: cursor ? { id: cursor } : undefined,
            where: {
              userId,
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
              poll: {
                include: {
                  options: {
                    include: {
                      votes: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          });
          let nextCursor: typeof cursor | undefined = undefined;
          if (tweets.length > limit) {
            const nextItem = tweets.pop(); // return the last item from the array
            nextCursor = nextItem?.id;
          }
          return {
            tweets,
            nextCursor,
          };
        }

        case "tweets&replies": {
          const tweets = await ctx.prisma.tweet.findMany({
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
              poll: {
                include: {
                  options: {
                    include: {
                      votes: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          });
          let nextCursor: typeof cursor | undefined = undefined;
          if (tweets.length > limit) {
            const nextItem = tweets.pop(); // return the last item from the array
            nextCursor = nextItem?.id;
          }
          return {
            tweets,
            nextCursor,
          };
        }

        case "media": {
          const tweets = await ctx.prisma.tweet.findMany({
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
              poll: {
                include: {
                  options: {
                    include: {
                      votes: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          });
          let nextCursor: typeof cursor | undefined = undefined;
          if (tweets.length > limit) {
            const nextItem = tweets.pop(); // return the last item from the array
            nextCursor = nextItem?.id;
          }
          return {
            tweets,
            nextCursor,
          };
        }

        case "likes": {
          const tweets = await ctx.prisma.tweet.findMany({
            where: {
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
              poll: {
                include: {
                  options: {
                    include: {
                      votes: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          });
          let nextCursor: typeof cursor | undefined = undefined;
          if (tweets.length > limit) {
            const nextItem = tweets.pop(); // return the last item from the array
            nextCursor = nextItem?.id;
          }
          return {
            tweets,
            nextCursor,
          };
        }

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
          poll: {
            include: {
              options: {
                include: {
                  votes: true,
                },
              },
            },
          },

          originalTweet: {
            include: {
              user: true,
              likes: true,
              retweets: true,
              replies: true,
              poll: {
                include: {
                  options: {
                    include: {
                      votes: true,
                    },
                  },
                },
              },
            },
          },

          retweet: {
            include: {
              user: true,
              likes: true,
              retweets: true,
              replies: true,
            },
          },
          likes: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
          },

          retweets: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
      });
    }),
  searchTweets: publicProcedure
    .input(
      z.object({
        term: z.string(),
        filtering: z.string(),
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, cursor } = input;

      switch (input.filtering) {
        case "top": {
          const tweets = await ctx.prisma.tweet.findMany({
            take: limit + 1,
            skip: skip,
            cursor: cursor ? { id: cursor } : undefined,
            // orderBy: {
            //   createdAt: "desc",
            // },
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
              poll: {
                include: {
                  options: {
                    include: {
                      votes: true,
                    },
                  },
                },
              },
            },
            where: {
              text: {
                contains: input.term,
                mode: "insensitive",
              },
              retweet: {
                is: null,
              },
            },
          });
          let nextCursor: typeof cursor | undefined = undefined;
          if (tweets.length > limit) {
            const nextItem = tweets.pop(); // return the last item from the array
            nextCursor = nextItem?.id;
          }
          return {
            tweets,
            nextCursor,
          };
        }
        // return ctx.prisma.tweet.findMany({
        //   include: {
        //     user: true,
        //     replies: true,
        //     originalTweet: {
        //       include: {
        //         user: true,
        //       },
        //     },
        //     likes: true,
        //     retweets: true,
        //   },
        //   where: {
        //     text: {
        //       contains: input.term,
        //       mode: "insensitive",
        //     },
        //   },
        // });

        case "latest": {
          const tweets = await ctx.prisma.tweet.findMany({
            take: limit + 1,
            skip: skip,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: {
              createdAt: "desc",
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
              poll: {
                include: {
                  options: {
                    include: {
                      votes: true,
                    },
                  },
                },
              },
            },
            where: {
              text: {
                contains: input.term,
                mode: "insensitive",
              },
            },
          });
          let nextCursor: typeof cursor | undefined = undefined;
          if (tweets.length > limit) {
            const nextItem = tweets.pop(); // return the last item from the array
            nextCursor = nextItem?.id;
          }
          return {
            tweets,
            nextCursor,
          };
        }

        case "photos": {
          const tweets = await ctx.prisma.tweet.findMany({
            take: limit + 1,
            skip: skip,
            cursor: cursor ? { id: cursor } : undefined,
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
              poll: {
                include: {
                  options: {
                    include: {
                      votes: true,
                    },
                  },
                },
              },
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
          let nextCursor: typeof cursor | undefined = undefined;
          if (tweets.length > limit) {
            const nextItem = tweets.pop(); // return the last item from the array
            nextCursor = nextItem?.id;
          }
          return {
            tweets,
            nextCursor,
          };
        }

        case "videos": {
          const tweets = await ctx.prisma.tweet.findMany({
            take: limit + 1,
            skip: skip,
            cursor: cursor ? { id: cursor } : undefined,
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
              poll: {
                include: {
                  options: {
                    include: {
                      votes: true,
                    },
                  },
                },
              },
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
          let nextCursor: typeof cursor | undefined = undefined;
          if (tweets.length > limit) {
            const nextItem = tweets.pop(); // return the last item from the array
            nextCursor = nextItem?.id;
          }
          return {
            tweets,
            nextCursor,
          };
        }

        default:
          break;
      }
      // return ctx.prisma.tweet.findMany({
      //   take: limit + 1,
      //   skip: skip,
      //   cursor: cursor ? { id: cursor } : undefined,
      //   include: {
      //     user: true,
      //     originalTweet: {
      //       include: {
      //         user: true,
      //       },
      //     },
      //     likes: true,
      //   },
      //   where: {
      //     text: {
      //       contains: input.term,
      //     },
      //   },
      // });
    }),
});
