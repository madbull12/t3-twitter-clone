import { router } from "../trpc";
import { authRouter } from "./auth";
import { tweetRouter } from "./tweet";
// import { exampleRouter } from "./example";

export const appRouter = router({
  // example: exampleRouter,
  auth: authRouter,
  tweet:tweetRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
