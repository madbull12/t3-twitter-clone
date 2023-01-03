import { profile } from "console";
import { useSession } from "next-auth/react";
import React, { FC, useEffect } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useCreateModal, useEditProfileModal, useLoginModal, useReplyModal } from "../../lib/zustand";
import CreateModal from "./CreateModal";
import EditProfileModal from "./EditProfileModal";
import Footer from "./Footer";
import LoginModal from "./LoginModal";
import ReplyModal from "./ReplyModal";
import Right from "./Right";
import Sidebar from "./Sidebar";

interface IProps {
  children: React.ReactNode;
}
const Layout = ({ children }: IProps) => {
  const { modal:replyModal } = useReplyModal();
  const { modal:loginModal } = useLoginModal();
  const { modal:createModal } = useCreateModal();
  const { modal:profileModal } = useEditProfileModal();

  const { status } = useSession();
  const isNotTablet= useMediaQuery("(min-width:1024px)");

  useEffect(() => {
    if (replyModal || loginModal || createModal || profileModal) {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [replyModal,loginModal,createModal,profileModal]);

  return (
    <main className="max-w-screen-2xl mx-auto relative">
      {replyModal ? <ReplyModal /> : null}
      {loginModal ? <LoginModal /> : null}
      {createModal ? <CreateModal /> : null}
      {profileModal ? <EditProfileModal /> : null}
      <Sidebar />
      {children}
      {isNotTablet ? <Right /> : null}
      {status==="unauthenticated" ? <Footer /> : null }
    </main>
  );
};

export default Layout;
