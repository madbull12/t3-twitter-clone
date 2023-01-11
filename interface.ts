import { Prisma } from "@prisma/client";
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
      retweets:true
    };
  }>;
  
  interface IProps {
    tweet: TweetWithUser;
  }