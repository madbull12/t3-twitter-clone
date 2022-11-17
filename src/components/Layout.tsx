import React, { FC, useEffect } from "react";
import { useReplyModal } from "../../lib/zustand";
import ReplyModal from "./ReplyModal";
import Right from "./Right";
import Sidebar from "./Sidebar";

interface IProps {
  children: React.ReactNode;
}
const Layout = ({ children }: IProps) => {
  const { modal } = useReplyModal();


    useEffect(() => {
      if (modal) {
        window.scrollTo(0,0)
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'

      }

    }, [modal])


  return (
    <div>
      {modal ? <ReplyModal /> : null}
      <Sidebar />
      {children}
      <Right />
    </div>
  );
};

export default Layout;
