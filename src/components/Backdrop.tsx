import React from "react";

const Backdrop = ({ children }: { children: React.ReactNode }) => {
  return <div className="bg-[#00000080] py-16 z-[999] absolute right-0 bottom-0 top-0 left-0 w-full">
    {children}
  </div>;
};

export default Backdrop;
