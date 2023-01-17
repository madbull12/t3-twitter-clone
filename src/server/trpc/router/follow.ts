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
              id: input?.followingId as string,
            },
          },
          following: {
            connect: {
              id: userId as string,
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
            followerId: input?.followingId as string,
            followingId: userId as string,
          },
        },
      });
    }),
  getSingleFollower: publicProcedure
    .input(z.object({ followingId: z.string() }))
    .query(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      return ctx.prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: input?.followingId as string,
            followingId: userId as string,
          },
        },
      });
    }),

  getUserFollowers: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id: input?.userId,
        },
        select: {
          followers: {
            include:{
              following:{
                include:{
                  profile:true
                }
              },
              follower:{
                include:{
                  profile:true
                }
              }
            }
          },
        },
        
      });
    }),
  getUserFollowing: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id: input?.userId as string,
        },
        select: {
          followings:{
            include:{
              following:{
                include:{
                  profile:true
                }
              },
              follower:{
                include:{
                  profile:true
                }
              }
            
              
            }
            

          }
        },
      });
    }),
    getFollowersRecommendation:publicProcedure.query(({ ctx,input })=>{
      const userId = ctx.session?.user?.id;

      return ctx.prisma.user.findMany({
        where:{
          NOT:{
            followers:{
              some:{
                followingId:userId as string
              }
            }
          }
        },
       include:{
        followers:{
          include:{
            follower:{
              include:{
                profile:true
              }
            }
          }
        },
        followings:{
          include:{
            following:{
              include:{
                profile:true
              }
            }
          }
        }
       }
      })
    })
});
