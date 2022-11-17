import { router } from "../trpc";
import { authRouter } from "./auth";
import { searchRouter } from "./search";
import { tweetRouter } from "./tweet";
import { userRouter } from "./user";
// import { exampleRouter } from "./example";

export const appRouter = router({
  // example: exampleRouter,
  auth: authRouter,
  tweet:tweetRouter,
  user:userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
