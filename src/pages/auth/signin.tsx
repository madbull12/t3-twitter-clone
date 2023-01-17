import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { env } from "process";
import React,{ useEffect } from "react";
import { BsGoogle, BsTwitter } from "react-icons/bs";
import { FcGoogle } from 'react-icons/fc'
const SignInPage = () => {
  const { status } = useSession();
  const router = useRouter()
  useEffect(()=>{
    if(status==="authenticated") {
      router.push("/")
    }
  },[])
  return (
    <main className="flex justify-center items-center min-h-screen w-full">
<div className="mx-auto flex max-w-2xl rounded-lg flex-col items-center justify-center gap-y-4 bg-base-100 p-4 text-neutral shadow-xl">
      <BsTwitter className="text-3xl text-primary" />
      <h1 className="text-3xl font-bold">Sign in to Twitter</h1>
      <button
        onClick={() => signIn("google",{
          callbackUrl:env.NEXTAUTH_URL
        })}
        className="flex border items-center gap-x-2 rounded-full bg-white px-4 py-2 text-lg font-bold text-black"
      >
        Sign in with google
        <FcGoogle />{" "}
      </button>
      <button
        onClick={() => signIn("twitter",{
          callbackUrl:env.NEXTAUTH_URL,
        })}
        className="flex border items-center gap-x-2 rounded-full bg-white px-4 py-2 text-lg font-bold text-black"
      >
        Sign in with twitter
        <BsTwitter className="text-primary" />{" "}
      </button>
    </div>

    </main>
    
  );
};

export default SignInPage;
