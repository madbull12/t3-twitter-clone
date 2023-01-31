import Link from "next/link";
import React from "react";
import { AiFillHome, AiFillBell, AiOutlineMail, AiOutlineHome, AiOutlineBell } from "react-icons/ai";
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "./Button";
import Profile from "./Profile";
import useMediaQuery from "../../hooks/useMediaQuery";
import { BiBookmark, BiSearch, BiUser } from "react-icons/bi";
import { BsMailbox } from "react-icons/bs";
import { useRouter } from "next/router";
import { FaSearch } from "react-icons/fa";
const MobileNav = () => {

  const router = useRouter();


  return (
    <div className='fixed border-t text-3xl border-base-300 z-[1000] flex items-center justify-between bottom-0 right-0 w-full left-0 px-8 py-4 bg-base-100'>
        <Link href={"/"}>
            {router.pathname==="/" ?  <AiFillHome /> : <AiOutlineHome />}
           
        </Link>
        <Link href="/explore">
            {router.pathname==="/explore" ? <FaSearch /> : <BiSearch />}
            
        </Link>
        <Link href="/notifications">
            {router.pathname==="/notifications" ?<AiFillBell /> : <AiOutlineBell /> }
            
        </Link>
        <Link href="/">
            <AiOutlineMail />
        </Link>
    </div>
  )
}

export default MobileNav