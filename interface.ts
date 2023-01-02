import { Prisma } from "@prisma/client";

export interface ITweet {
    id:string;
    text:string;
    userId:string;
    user:any;
    image:string;
}


export type TweetWithUser = Prisma.TweetGetPayload<{
    include: {
      user: true;
  
      originalTweet: {
        include: {
          user: true;
        };
      };
      likes: true;
      replies:true
    };
  }>;
  
  interface IProps {
    tweet: TweetWithUser;
  }