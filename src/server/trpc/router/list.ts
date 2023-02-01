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
        name: z.string().min(4, "Name should have at least 4 characters"),
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
        listId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!ctx.session) {
        throw new Error(
          "You have to be logged in in order to perform this action!"
        );
      }
      const userId = ctx.session.user?.id;

      return ctx.prisma.list.update({
        where: {
          id_creatorId: {
            id: input?.listId,
            creatorId: userId as string,
          },
        },
        data: {
          name: input?.name as string,
          description: input?.description as string,
          isPrivate: input?.isPrivate as boolean,
          coverPhoto: input?.coverPhoto as string,
        },
      });
    }),
  deleteList: publicProcedure
    .input(
      z.object({
        listId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!ctx.session) {
        throw new Error(
          "You have to be logged in in order to perform this action!"
        );
      }
      const userId = ctx.session.user?.id;
      return ctx.prisma.list.delete({
        where: {
          id_creatorId: {
            id: input?.listId,
            creatorId: userId as string,
          },
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

  getListMembers: publicProcedure
    .input(z.object({ listId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.list.findUnique({
        where: {
          id: input?.listId,
        },
        select: {
          members: {
            include: {
              profile: true,
            },
          },
        },
        // include: {
        //   members: {
        //     include: {
        //       profile: true,
        //     },
        //   },
        // },
      });
    }),
  searchUserSuggestions: publicProcedure
    .input(z.object({ name: z.string(), listId: z.string() }))
    .query(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      return ctx.prisma.user.findMany({
        where: {
          name: {
            contains: input?.name,
            mode: "insensitive",
          },
          AND: [
            {
              NOT: {
                listMember: {
                  some: {
                    id: input?.listId,
                  },
                },
              },
            },
            {
              NOT: {
                id: userId,
              },
            },
          ],
        },
        include: {
          profile: true,
        },
      });
    }),
  getUserSuggestions: publicProcedure
    .input(z.object({ listId: z.string() }))
    .query(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      return ctx.prisma.user.findMany({
        where: {
          AND: [
            {
              NOT: {
                listMember: {
                  some: {
                    id: input?.listId,
                  },
                },
              },
            },
            {
              NOT: {
                id: userId,
              },
            },
          ],
        },
        include: {
          profile: true,
        },
      });
    }),

  addMember: publicProcedure
    .input(z.object({ listId: z.string(), userId: z.string() }))
    .mutation(({ ctx, input }) => {
      if (!ctx.session) {
        throw new Error(
          "You have to be logged in in order to perform this action!"
        );
      }
      const userId = ctx.session?.user?.id;

      return ctx.prisma.list.update({
        where: {
          id_creatorId: {
            id: input?.listId,
            creatorId: userId as string,
          },
        },
        data: {
          members: {
            connect: {
              id: input?.userId as string,
            },
          },
        },
      });
    }),

  removeMember: publicProcedure
    .input(z.object({ listId: z.string(), userId: z.string() }))
    .mutation(({ ctx, input }) => {
      if (!ctx.session) {
        throw new Error(
          "You have to be logged in in order to perform this action!"
        );
      }
      const userId = ctx.session?.user?.id;

      return ctx.prisma.list.update({
        where: {
          id_creatorId: {
            id: input?.listId,
            creatorId: userId as string,
          },
        },
        data: {
          members: {
            disconnect: {
              id: input?.userId as string,
            },
          },
        },
      });
    }),

  isMemberExist: publicProcedure
    .input(z.object({ memberId: z.string(), listId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findFirst({
        where: {
          listMember: {
            some: {
              id: input?.listId,
            },
          },
          id: input?.memberId,
        },
      });
    }),

  getTweetsByListMembers: publicProcedure
    .input(z.object({ listId: z.string() }))
    .query(async ({ ctx, input }) => {
      const listMembers = await ctx.prisma.list.findUnique({
        where: {
          id: input?.listId,
        },
        select: {
          members: {
            select: {
              id: true,
            },
          },
        },
      });

      // console.log(listMembers?.members?.map((member)=>member.id))
      const memberIds = listMembers?.members?.map((member) => member.id);
      return ctx.prisma.tweet.findMany({
        where: {
          userId: {
            in: memberIds,
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
      });
    }),
});
