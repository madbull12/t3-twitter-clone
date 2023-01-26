import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const listRouter = router({
  getUserLists: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
        return ctx.prisma.list.findMany({
          where:{
            creatorId:input?.userId
          }
        })

    }),
});
