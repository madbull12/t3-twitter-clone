import { signIn } from "next-auth/react";
import React from "react";
import { BsGoogle, BsTwitter } from "react-icons/bs";
import { FcGoogle } from 'react-icons/fc'
const SignInPage = () => {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-y-4 bg-base-100 p-4 text-neutral shadow-xl">
      <BsTwitter className="text-3xl" />
      <h1 className="text-3xl font-bold">Sign in to Twitter</h1>
      <button
        onClick={() => signIn("google")}
        className="flex items-center gap-x-2 rounded-full bg-white px-4 py-2 text-lg font-bold text-black"
      >
        Sign in with google
        <FcGoogle />{" "}
      </button>
      <button
        onClick={() => signIn("twitter")}
        className="flex items-center gap-x-2 rounded-full bg-white px-4 py-2 text-lg font-bold text-black"
      >
        Sign in with twitter
        <BsTwitter className="text-primary" />{" "}
      </button>
    </div>
  );
};

export default SignInPage;
