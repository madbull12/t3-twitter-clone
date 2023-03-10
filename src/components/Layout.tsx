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
  usePhotoViewModal,
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
import { AnimatePresence } from "framer-motion";
import PhotoViewModal from "./PhotoViewModal";
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
  const { modal: photoViewModal } = usePhotoViewModal();

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
      editListModal ||
      photoViewModal
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
    editListModal,
    photoViewModal,
  ]);
  const phone = useMediaQuery("(min-width:768px)");

  return (
    <main>
      {!phone ? (
        <AnimatePresence
          initial={false}
          mode="wait"
          onExitComplete={() => null}
        >
          {mobileDrawer ? <MobileDrawer /> : null}
        </AnimatePresence>
      ) : null}

      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {replyModal ? <ReplyModal /> : null}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {photoViewModal ? <PhotoViewModal /> : null}
      </AnimatePresence>

      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {retweetsModal ? <RetweetsListModal /> : null}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {loginModal ? <LoginModal /> : null}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {createModal ? <CreateModal /> : null}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {displayModal ? <DisplayModal /> : null}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {profileModal ? <EditProfileModal /> : null}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {likesModal ? <LikesListModal /> : null}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {handleModal ? <HandleModal /> : null}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {listModal ? <CreateListModal /> : null}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {editListModal ? <EditListModal /> : null}
      </AnimatePresence>

      <div className="relative mx-auto  min-h-[200vh] max-w-screen-lg bg-base-100  text-neutral xl:max-w-screen-xl">
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
      </div>
    </main>
  );
};

export default Layout;
