import React from "react";

const Backdrop = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="absolute right-0 bottom-0 top-0 left-0 z-[999] w-full bg-[#00000080] py-16">
      {children}
    </div>
  );
};

export default Backdrop;
