import { useSession } from "next-auth/react";
import React, { FC, useEffect } from "react";
import { useLoginModal, useReplyModal } from "../../lib/zustand";
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

  const { status } = useSession();
  useEffect(() => {
    if (replyModal || loginModal) {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [replyModal,loginModal]);

  return (
    <div>
      {replyModal ? <ReplyModal /> : null}
      {loginModal ? <LoginModal /> : null}
      <Sidebar />
      {children}
      <Right />
      {status==="unauthenticated" ? <Footer /> : null }
    </div>
  );
};

export default Layout;
