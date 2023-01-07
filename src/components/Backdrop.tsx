import React from "react";

const Backdrop = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="absolute w-full z-[999999] min-h-[200vh]  bg-[#00000080] py-16">
      {children}
    </div>
  );
};

export default Backdrop;
