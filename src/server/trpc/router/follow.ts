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
              id: userId as string,
            },
          },
          following: {
            connect: {
              id: input?.followingId as string,
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
            followerId: userId as string,
            followingId: input?.followingId as string,
          },
        },
      });
    }),
  getSingleFollower: publicProcedure
    .input(z.object({ followingId: z.string() }))
    .query(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      return ctx.prisma.follows.findUnique({
        where:{
            followerId_followingId:{
                followerId: userId as string,
                followingId: input?.followingId as string,
            }
        }
      })
    }),
});
