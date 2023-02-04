import { Prisma, PrismaClient } from "@prisma/client";
import { User } from "@prisma/client";


export type UserWithPayloads = Prisma.UserGetPayload<{
  include:{
    profile:true
  }
}>

export type LikesWithPayloads = Prisma.LikeGetPayload<{
  include:{
    user:{
      include:{
        profile:true
      }
    }
  }
}>
export type ListWithPayloads = Prisma.ListGetPayload<{
  include:{
    creator:{
      include:{
        profile:true
      }
    },
    followers:{
      include:{
        profile:true
      }
    },
    members:{
      include:{
        profile:true
      }
    }
  }
}>
export type RetweetsWithPayloads = Prisma.TweetGetPayload<{
  include:{
    retweets:{
      include:{
        user:{
          include:{
            profile:true
          }
        },
        
      }
    }
  }
}>

export type BookmarksWithPayloads = Prisma.BookmarkGetPayload<{
  include: {
    tweet: {
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
    },
  },
}>

export type TweetWithUser = Prisma.TweetGetPayload<{
    include: {
      user: true;
  
      originalTweet: {
        include: {
          user: true;
        };
      };
      retweet: {
        include: {
          user: true;
        };
      };
      likes: true;
      replies:true;
      poll:{
        include:{
          options:true
        }
      },
      retweets:{
        include:{
          user:{
            include:{
              profile:true
            }
          },
        }
      }
    };
  }>;
  
  interface IProps {
    tweet: TweetWithUser;
  }

export type OptionWithPayload = Prisma.OptionGetPayload<{
  include:{
    votes:true
  }
}>