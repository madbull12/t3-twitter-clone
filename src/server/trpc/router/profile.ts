import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const profileRouter = router({
  upsertProfile: publicProcedure
  
    .input(
      z.object({
        bio: z.string().max(160,"Bio can't be too long").nullable(),
        location: z.string().max(30,"Location can't be too long").nullable(),
        website: z.string().max(100,"Website can't be too long").nullable(),
        coverPhoto: z.string().nullable(),
        name:z.string().max(50,"Name can't be too long").nullable(),
        image:z.string().nullable()
      })
    )
    .mutation(({ input:{ bio,location,website,coverPhoto,image,name }, ctx }) => {
        const userId = ctx.session?.user?.id
        if (!ctx.session) {
            throw new Error(
              "You have to be logged in in order to perform this action!"
            );
          }
        return ctx.prisma.profile.upsert({
            where:{
                userId
            },
            create:{
                bio,
                location,
                website,
                coverPhoto,
                user:{
                    connect:{
                        id:userId
                    },
              

                }
            },
            update:{
                bio,
                location,
                website,
                coverPhoto,
                user:{
                    update:{
                        name,
                        image
                    }
                }
            }
        })
    }),
});
