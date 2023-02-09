import { router } from "../trpc";
import { authRouter } from "./auth";
import { bookmarkRouter } from "./bookmark";
import { followRouter } from "./follow";
import { hashtagRouter } from "./hashtag";
import { likeRouter } from "./like";
import { listRouter } from "./list";
import { notificationRouter } from "./notification";
import { pollRouter } from "./poll";
import { profileRouter } from "./profile";
import { searchRouter } from "./search";
import { tweetRouter } from "./tweet";
import { userRouter } from "./user";
import { voteRouter } from "./vote";
// import { exampleRouter } from "./example";

export const appRouter = router({
  // example: exampleRouter,
  auth: authRouter,
  tweet:tweetRouter,
  user:userRouter,
  like:likeRouter,
  profile:profileRouter,
  hashtag:hashtagRouter,
  bookmark:bookmarkRouter,
  follow:followRouter,
  // retweet:retweetRouter
  // reply:replyRouter
  list:listRouter,
  vote:voteRouter,
  poll:pollRouter,
  notification:notificationRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
