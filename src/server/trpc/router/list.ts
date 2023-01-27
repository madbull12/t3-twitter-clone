import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const listRouter = router({
  getUserLists: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.list.findMany({
        where: {
          creatorId: input?.userId,
        },

        include: {
          creator: {
            include: {
              profile: true,
            },
          },
        
        },
      });
    }),

  createList: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        isPrivate: z.boolean(),
        coverPhoto: z.string().optional().nullable(),
      })
    )
    .mutation(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      return ctx.prisma.list.create({
        data: {
          creator: {
            connect: {
              id: userId as string,
            },
          },
          name: input?.name,
          isPrivate: input?.isPrivate,
          description: input?.description,
          coverPhoto: input?.coverPhoto,
        },
      });
    }),

  getListDetails: publicProcedure
    .input(z.object({ listId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.list.findUnique({
        where: {
          id: input?.listId,
        },
        include: {
          creator: {
            include: {
              profile: true,
            },
          },
          followers: {
            include: {
              profile: true,
            },
          },
          members: {
            include: {
              profile: true,
            },
          },
        },
      });
    }),
});
