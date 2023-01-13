import { profile } from "console";
import { useSession } from "next-auth/react";
import { Html } from "next/document";
import React, { FC, useEffect } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import {
  useCreateModal,
  useDisplayModal,
  useEditProfileModal,
  useLikesModal,
  useLoginModal,
  useMobileDrawer,
  useReplyModal,
  useRetweetsModal,
} from "../../lib/zustand";
import CreateModal from "./CreateModal";
import DisplayModal from "./DisplayModal";
import EditProfileModal from "./EditProfileModal";
import Footer from "./Footer";
import LikesListModal from "./LikesListModal";
import LoginModal from "./LoginModal";
import MobileCreate from "./MobileCreate";
import MobileDrawer from "./MobileDrawer";
import MobileNav from "./MobileNav";
import ReplyModal from "./ReplyModal";
import RetweetsListModal from "./RetweetsListModal";
import Right from "./Right";
import Sidebar from "./Sidebar";

interface IProps {
  children: React.ReactNode;
}
const Layout = ({ children }: IProps) => {
  const { modal: replyModal } = useReplyModal();
  const { modal: loginModal } = useLoginModal();
  const { modal: createModal } = useCreateModal();
  const { modal: profileModal } = useEditProfileModal();
  const { modal: displayModal } = useDisplayModal();
  const { modal: likesModal } = useLikesModal();
  const { modal: retweetsModal } = useRetweetsModal();
  const { drawer: mobileDrawer } = useMobileDrawer();

  const { status } = useSession();
  const isNotTablet = useMediaQuery("(min-width:1024px)");

  useEffect(() => {
    if (
      replyModal ||
      loginModal ||
      createModal ||
      profileModal ||
      displayModal ||
      mobileDrawer ||
      likesModal ||
      retweetsModal
    ) {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [
    replyModal,
    loginModal,
    createModal,
    profileModal,
    displayModal,
    mobileDrawer,
    likesModal,
    retweetsModal
  ]);
  const phone = useMediaQuery("(min-width:768px)");

  return (
    <main className="relative mx-auto  min-h-[200vh] max-w-screen-2xl  bg-base-100 text-neutral">
      {!phone ? <>{mobileDrawer ? <MobileDrawer /> : null}</> : null}
      {replyModal ? <ReplyModal /> : null}
      {retweetsModal ? <RetweetsListModal /> : null}
      {loginModal ? <LoginModal /> : null}
      {createModal ? <CreateModal /> : null}
      {profileModal ? <EditProfileModal /> : null}
      {displayModal ? <DisplayModal /> : null}
      {likesModal ? <LikesListModal  /> : null}
      {phone ? <Sidebar /> : status === "authenticated" ? <MobileNav /> : null}
      {children}
      {isNotTablet ? <Right /> : null}
      {!phone ?<MobileCreate /> : null }
      {status === "unauthenticated" ? <Footer /> : null}
    </main>
  );
};

export default Layout;
