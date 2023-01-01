import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const profileRouter = router({
  upsertProfile: publicProcedure
    .input(
      z.object({
        bio: z.string().nullable(),
        location: z.string().nullable(),
        website: z.string().nullable(),
        coverPhoto: z.string().nullable(),
        name:z.string().nullable(),
        image:z.string().nullable()
      })
    )
    .mutation(({ input:{ bio,location,website,coverPhoto,image,name }, ctx }) => {
        const userId = ctx.session?.user?.id
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
                    create:{
                        image,
                        name
                    }

                }
            },
            update:{
                bio,
                location,
                website,
                coverPhoto
            }
        })
    }),
});
