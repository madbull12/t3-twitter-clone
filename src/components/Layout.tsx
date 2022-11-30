import { useSession } from "next-auth/react";
import React, { FC, useEffect } from "react";
import { useCreateModal, useLoginModal, useReplyModal } from "../../lib/zustand";
import CreateModal from "./CreateModal";
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
  const { modal:loginModal } = useLoginModal()
  const { modal:createModal } = useCreateModal()

  const { status } = useSession();
  useEffect(() => {
    if (replyModal || loginModal || createModal) {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [replyModal,loginModal,createModal]);

  return (
    <div>
      {replyModal ? <ReplyModal /> : null}
      {loginModal ? <LoginModal /> : null}
      {createModal ? <CreateModal /> : null}
      <Sidebar />
      {children}
      <Right />
      {status==="unauthenticated" ? <Footer /> : null }
    </div>
  );
};

export default Layout;
