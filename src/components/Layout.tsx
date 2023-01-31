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
  useEditListModal,
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
import EditListModal from "./EditListModal";
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
import { AnimatePresence } from 'framer-motion'
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
  const { modal: editListModal } = useEditListModal();

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
      listModal ||
      editListModal
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
    listModal,
    editListModal
  ]);
  const phone = useMediaQuery("(min-width:768px)");

  return (
    <AnimatePresence
    // Disable any initial animations on children that
    // are present when the component is first rendered
    initial={false}
    // Only render one component at a time.
    // The exiting component will finish its exit
    // animation before entering component is rendered
    exitBeforeEnter={true}
    // Fires when all exiting nodes have completed animating out
    onExitComplete={() => null}
>
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
      {editListModal ? <EditListModal /> : null}

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
</AnimatePresence>
   
  );
};

export default Layout;
