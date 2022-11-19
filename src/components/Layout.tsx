import { useSession } from "next-auth/react";
import React, { FC, useEffect } from "react";
import { useReplyModal } from "../../lib/zustand";
import Footer from "./Footer";
import ReplyModal from "./ReplyModal";
import Right from "./Right";
import Sidebar from "./Sidebar";

interface IProps {
  children: React.ReactNode;
}
const Layout = ({ children }: IProps) => {
  const { modal } = useReplyModal();

  const { status } = useSession();
  useEffect(() => {
    if (modal) {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [modal]);

  return (
    <div>
      {modal ? <ReplyModal /> : null}
      <Sidebar />
      {children}
      <Right />
      {status==="unauthenticated" ? <Footer /> : null }
    </div>
  );
};

export default Layout;
