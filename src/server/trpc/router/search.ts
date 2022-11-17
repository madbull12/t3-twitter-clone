import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const searchRouter = router({
  searchQuery: publicProcedure
    .input(z.object({ term: z.string(),filtering:z.string() }))
    .query(({ ctx,input }) => {
        switch(input.filtering) {
            case "top":
            case "latest":
                return ctx.prisma.tweet.findMany({
                    include:{
                      user:true
                    },
                    where:{
                      text:{
                        contains:input.term
                      }
                    }
                });
            case "people":
                return ctx.prisma.tweet.findMany({
                    where:{
                        user:{
                            name:input.term
                        }
                    },
                    select:{
                        user:true
                    }
                })
            default:
                break;
        }
 

    }),
});
