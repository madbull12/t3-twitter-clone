import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const userRouter = router({
  searchUsers: publicProcedure
    .input(z.object({ term: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.user.findMany({
        where: {
          name: {
            contains: input.term,
            mode: "insensitive",
          },
        },
        include: {
          profile: true,
          followers: true,
          followings: true,
        },
      });
    }),
  getUserProfile: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id: input?.userId,
        },
        include: {
          profile: true,
          followers: true,
          followings: true,
        },
      });
    }),

  getUserByHandle: publicProcedure
    .input(z.object({ handle: z.string() }))
    .query(({ input, ctx }) => {
      const userId = ctx.session?.user?.id;

      return ctx.prisma.user.findFirst({
        where: {
          handle: input?.handle,
          id:{
            not:userId
          }
        },
      });
    }),
  getUser: publicProcedure.input(z.object({ userId:z.string()})).query(({ ctx,input }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: input?.userId,
      },
    });
  }),
  editUserHandle: publicProcedure
    .input(z.object({ handle: z.string() }))
    .mutation(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      if (!ctx.session) {
        throw new Error("You have to be logged in!");
      }

      return ctx.prisma.user.update({
        where: {
          id: userId as string,
        },
        data: {
          handle: input?.handle,
        },
      });
    }),

});
