import { router } from "../trpc";
import { authRouter } from "./auth";
import { bookmarkRouter } from "./bookmark";
import { hashtagRouter } from "./hashtag";
import { likeRouter } from "./like";
import { profileRouter } from "./profile";
import { searchRouter } from "./search";
import { tweetRouter } from "./tweet";
import { userRouter } from "./user";
// import { exampleRouter } from "./example";

export const appRouter = router({
  // example: exampleRouter,
  auth: authRouter,
  tweet:tweetRouter,
  user:userRouter,
  like:likeRouter,
  profile:profileRouter,
  hashtag:hashtagRouter,
  bookmark:bookmarkRouter
  // reply:replyRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
