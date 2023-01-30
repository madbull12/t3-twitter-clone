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
        name: z.string().min(4,"Name should have at least 4 characters"),
        description: z.string().optional(),
        isPrivate: z.boolean(),
        coverPhoto: z.string().optional().nullable(),
      })
    )
    .mutation(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      if (!ctx.session) {
        throw new Error(
          "You have to be logged in in order to perform this action!"
        );
      }
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

  editList: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        isPrivate: z.boolean().optional(),
        coverPhoto: z.string().optional().nullable(),
        listId:z.string()
      })
    )
    .mutation(({ ctx,input })=>{
      if (!ctx.session) {
        throw new Error(
          "You have to be logged in in order to perform this action!"
        );
      }
      return ctx.prisma.list.update({
        where:{
          id:input?.listId
        },
        data:{
          name:input?.name as string,
          description:input?.description as string,
          isPrivate:input?.isPrivate as boolean,
          coverPhoto:input?.coverPhoto as string
        }
      })
    }),
    deleteList:publicProcedure
    .input(
      z.object({
   
        listId:z.string()
      })
    )
    .mutation(({ ctx,input })=>{
      if (!ctx.session) {
        throw new Error(
          "You have to be logged in in order to perform this action!"
        );
      }
      const userId = ctx.session.user?.id;
      return ctx.prisma.list.delete({
        where:{
          id_creatorId:{
            id:input?.listId,
            creatorId:userId as string
          }
        },
 
      })
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
