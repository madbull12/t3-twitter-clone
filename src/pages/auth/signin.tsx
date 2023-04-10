import { signIn, useSession } from "next-auth/react";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { env } from "process";
import React, { useEffect } from "react";
import { BsApple, BsGoogle, BsTwitter } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import useMediaQuery from "../../../hooks/useMediaQuery";
const SignInPage = () => {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, []);

  const tablet = useMediaQuery("(min-width:1024px)");
  return (
    <main>
      <div className={`${!tablet ? "items-center justify-center" : null} flex min-h-screen  w-full gap-x-8 overflow-y-hidden text-neutral `}>
        {tablet ? (
          <div className="relative flex min-h-screen w-2/3 items-center justify-center">
            <Image
              src={"/twitter-banner.png"}
              objectFit="cover"
              layout="fill"
            />
            <BsTwitter className="absolute text-[300px] text-white" />
          </div>
        ) : null}

        <div className={`px-2 py-6 ${tablet ? null : "flex flex-col items-center"}`}>
          <BsTwitter className="text-5xl text-primary" />
          {tablet ? (
          <h1 className="mt-12 text-6xl font-black">See what's happening now </h1>

          ):(
          <h1 className="mt-12 max-w-xs text-2xl sm:text-4xl font-black">See what's happening in the world right now </h1>
            
          )}
          <p className="mt-12 text-2xl sm:text-4xl font-black">Join Twitter today.</p>
          <div className="mt-8 space-y-4 flex flex-col items-center">
            <button
              onClick={() =>
                signIn("google", {
                  callbackUrl: env.NEXTAUTH_URL,
                })
              }
              className={`${tablet ? null :"mx-auto"} flex whitespace-nowrap  w-3/4 items-center justify-center gap-x-2 rounded-full  border border-base-300 px-4 py-2 text-base sm:text-lg font-semibold transition-all duration-100 ease-in-out hover:bg-base-200`}
            >
              <FcGoogle />
              <p>Sign in with Google</p>
            </button>
            <button
              onClick={() =>
                signIn("twitter", {
                  callbackUrl: env.NEXTAUTH_URL,
                })
              }
              className={`${tablet ? null :"mx-auto"} flex whitespace-nowrap w-3/4 items-center justify-center gap-x-2 rounded-full border border-base-300 px-4 py-2 text-base sm:text-lg font-semibold transition-all duration-100 ease-in-out hover:bg-base-200`}
            >
              <BsTwitter className="text-primary" />
              <p>Sign in with Twitter</p>
            </button>
            <p className="w-3/4 text-center md:text-start text-sm text-gray-500">
              By signing up, you agree to the Terms of Service and Privacy
              Policy, including Cookie Use.
            </p>
          </div>
        </div>
      </div>
      <div className="flex min-h-screen  items-center justify-center">
        <div className="relative mx-auto h-72 sm:h-96 w-3/4 md:w-1/2  ">
          <Image src="/elon-musk-smoke.gif" layout="fill" />
        </div>
      </div>

      {/* <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-y-4 rounded-lg bg-base-100 p-4 text-neutral shadow-xl">
        <BsTwitter className="text-3xl text-primary" />
        <h1 className="text-3xl font-bold">Sign in to Twitter</h1>
        <button
          onClick={() =>
            signIn("google", {
              callbackUrl: env.NEXTAUTH_URL,
            })
          }
          className="flex items-center gap-x-2 rounded-full border bg-white px-4 py-2 text-lg font-bold text-black"
        >
          Sign in with google
          <FcGoogle />{" "}
        </button>
        <button
          onClick={() =>
            signIn("twitter", {
              callbackUrl: env.NEXTAUTH_URL,
            })
          }
          className="flex items-center gap-x-2 rounded-full border bg-white px-4 py-2 text-lg font-bold text-black"
        >
          Sign in with twitter
          <BsTwitter className="text-primary" />{" "}
        </button>
      </div> */}
    </main>
  );
};

export default SignInPage;
