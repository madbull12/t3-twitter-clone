import { profile } from "console";
import { useSession } from "next-auth/react";
import { Html } from "next/document";
import { useRouter } from "next/router";
import React, { FC, useEffect } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import {
  useCreateListModal,
  useCreateModal,
  useDisplayModal,
  useEditProfileModal,
  useHandleModal,
  useLikesModal,
  useLoginModal,
  useMobileDrawer,
  useReplyModal,
  useRetweetsModal,
} from "../../lib/zustand";
import CreateListModal from "./CreateListModal";
import CreateModal from "./CreateModal";
import DisplayModal from "./DisplayModal";
import EditProfileModal from "./EditProfileModal";
import Footer from "./Footer";
import HandleModal from "./HandleModal";
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
  const { modal: listModal } = useCreateListModal();
  const { modal: displayModal } = useDisplayModal();
  const { modal: likesModal } = useLikesModal();
  const { modal: handleModal } = useHandleModal();
  const { modal: retweetsModal } = useRetweetsModal();
  const { drawer: mobileDrawer } = useMobileDrawer();

  const router = useRouter();
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
      retweetsModal ||
      handleModal ||
      listModal
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
    retweetsModal,
    handleModal,
    listModal
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
      {likesModal ? <LikesListModal /> : null}
      {handleModal ? <HandleModal /> : null}
      {listModal ? <CreateListModal /> : null}

      {router.pathname !== "/auth/signin" ? (
        <>
          {phone ? (
            <Sidebar />
          ) : status === "authenticated" ? (
            <MobileNav />
          ) : null}
        </>
      ) : null}

      {children}
      {router.pathname !== "/auth/signin" ? (
        <>{isNotTablet ? <Right /> : null}</>
      ) : null}
      {status === "authenticated" ? (
        <>{!phone ? <MobileCreate /> : null}</>
      ) : null}
      {router.pathname !== "/auth/signin" ? (
        <>{status === "unauthenticated" ? <Footer /> : null}</>
      ) : null}
    </main>
  );
};

export default Layout;
