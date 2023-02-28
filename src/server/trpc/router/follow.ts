import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const followRouter = router({
  followUser: publicProcedure
    .input(z.object({ followingId: z.string() }))
    .mutation(({ ctx, input }) => {
      if (!ctx.session) {
        throw new Error("Please login first");
      }
      const userId = ctx.session?.user?.id;

      return ctx.prisma.follows.create({
        data: {
          follower: {
            connect: {
              id: input?.followingId as string,
            },
          },
          following: {
            connect: {
              id: userId as string,
            },
          },
        },
      });
    }),
  unfollowUser: publicProcedure
    .input(z.object({ followingId: z.string() }))
    .mutation(({ ctx, input }) => {
      if (!ctx.session) {
        throw new Error("Please login first");
      }
      const userId = ctx.session?.user?.id;

      return ctx.prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: input?.followingId as string,
            followingId: userId as string,
          },
        },
      });
    }),
  getSingleFollower: publicProcedure
    .input(z.object({ followingId: z.string() }))
    .query(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      return ctx.prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: input?.followingId as string,
            followingId: userId as string,
          },
        },
      });
    }),

  getUserFollowers: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id: input?.userId,
        },
        select: {
          followers: {
            include: {
              following: {
                include: {
                  profile: true,
                },
              },
              follower: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
      });
    }),
  getUserFollowing: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id: input?.userId as string,
        },
        select: {
          followings: {
            include: {
              following: {
                include: {
                  profile: true,
                },
              },
              follower: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
      });
    }),
  getInfiniteUserFollowing: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
        userId:z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, cursor,userId } = input;

      const users = await ctx.prisma.user.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        where:{
          followers:{
            some:{
              followingId:userId,
            },
          }
         
        }
        
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (users?.length > limit) {
        const nextItem = users?.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }
      return {
        users,
        nextCursor,
      };
    }),
  getInfiniteUserFollowers: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
        userId:z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, cursor,userId } = input;

      const users = await ctx.prisma.user.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        where:{
          followings:{
            some:{
              followerId:userId,
            },
          }
         
        }
        
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (users?.length > limit) {
        const nextItem = users?.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }
      return {
        users,
        nextCursor,
      };
    }),
  followList: publicProcedure
    .input(z.object({ userId: z.string(), listId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.list.update({
        where: {
          id: input?.listId as string,
        },
        data: {
          followers: {
            connect: {
              id: input?.userId,
            },
          },
        },
      });
    }),
  unfollowList: publicProcedure
    .input(z.object({ userId: z.string(), listId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.list.update({
        where: {
          id: input?.listId as string,
        },
        data: {
          followers: {
            disconnect: {
              id: input?.userId,
            },
          },
        },
      });
    }),
  getInfinitePeopleRecommendations: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, cursor } = input;
      const userId = ctx.session?.user?.id;

      const users = await ctx.prisma.user.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          NOT: {
            followers: {
              some: {
                followingId: userId as string,
              },
            },
          },
        },
        include: {
          followers: {
            include: {
              follower: {
                include: {
                  profile: true,
                },
              },
            },
          },
          followings: {
            include: {
              following: {
                include: {
                  profile: true,
                },
              },
            },
          },
          profile: true,
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (users.length > limit) {
        const nextItem = users.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }
      return {
        users,
        nextCursor,
      };
    }),
  getFollowersRecommendation: publicProcedure.query(({ ctx, input }) => {
    const userId = ctx.session?.user?.id;

    return ctx.prisma.user.findMany({
      where: {
        NOT: {
          followers: {
            some: {
              followingId: userId as string,
            },
          },
        },
      },
      include: {
        followers: {
          include: {
            follower: {
              include: {
                profile: true,
              },
            },
          },
        },
        followings: {
          include: {
            following: {
              include: {
                profile: true,
              },
            },
          },
        },
        profile: true,
      },
    });
  }),
});
