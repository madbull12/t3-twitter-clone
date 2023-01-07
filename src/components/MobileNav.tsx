import Link from "next/link";
import React from "react";
import { AiFillHome, AiFillBell, AiOutlineMail } from "react-icons/ai";
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "./Button";
import Profile from "./Profile";
import useMediaQuery from "../../hooks/useMediaQuery";
import { BiBookmark, BiSearch, BiUser } from "react-icons/bi";
import { BsMailbox } from "react-icons/bs";
const MobileNav = () => {

  return (
    <div className='fixed border-t text-3xl border-base-300 z-[1000] flex items-center justify-between bottom-0 right-0 w-full left-0 px-8 py-4 bg-base-100'>
        <Link href="/">
            <AiFillHome />
        </Link>
        <Link href="/explore">
            <BiSearch />
        </Link>
        <Link href="/">
            <AiFillBell />
        </Link>
        <Link href="/">
            <AiOutlineMail />
        </Link>
    </div>
  )
}

export default MobileNav