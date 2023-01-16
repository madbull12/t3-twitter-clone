import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const hashtagRouter = router({
    getTopHashtags: publicProcedure
    .query(({ ctx, input }) => {
      return ctx.prisma.hashtag.findMany({
        take:5,
        include:{
            tweets:true
        },
        orderBy: {
          tweets:{
            _count:"desc"
          }
        },
      });
    }),

    
})